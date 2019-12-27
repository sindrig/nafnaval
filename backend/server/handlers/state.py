import os
import time
import uuid
import re
from urllib.parse import urljoin

import boto3
import botocore

from server.responses import response
from server.exceptions import NotFound, BadInput
from server import names

TEMPLATE_DIR = os.path.dirname(os.path.abspath(__file__))
STUPID_EMAIL_REGEX = re.compile(r'[^@]+@[^@]+\.[^@]+')
FRONTEND_URL = 'https://nafnaval.is'
EMAIL_SENDER = 'nafnaval@nafnaval.is'
BLANK = '__blank'
_blank_set = {BLANK}


class StateHandler:
    def __init__(self):
        dynamodb = boto3.resource(
            'dynamodb', region_name=os.getenv('AWS_REGION')
        )
        self.name_table = dynamodb.Table(os.getenv('NAMES_TABLE'))
        self.ses_client = boto3.client(
            'ses', region_name=os.getenv('AWS_REGION')
        )

    def get(self, request):
        state_id = self._get_state_id(request)
        if '/' in request.path and request.path.split('/', 1)[-1]:
            wanted_attributes = request.path.split('/')[1:]
        else:
            wanted_attributes = ['remaining']
        attrs = [
            'StateId',
            'Counterpart',
            'Email',
        ]
        if 'selected' in wanted_attributes:
            attrs.append('Selected')
        if 'rejected' in wanted_attributes:
            attrs.append('Rejected')
        if 'remaining' in wanted_attributes:
            attrs.append('Remaining')
        result = self.name_table.get_item(
            Key={'StateId': state_id}, ProjectionExpression=','.join(attrs)
        )
        if 'Item' not in result:
            raise NotFound(f'State "{state_id}" not found')
        return response(self._serializable(result['Item']))

    def put(self, request):
        email1 = self._get_and_validate_email(request.body, 'email1')
        email2 = self._get_and_validate_email(request.body, 'email2')
        sex = request.body.get('sex')
        if sex not in (names.MALE, names.FEMALE):
            raise BadInput(
                'Missing or invalid sex (either '
                f'"{names.MALE}" or "{names.FEMALE}")'
            )
        name_list = names.get(sex)
        state_id = str(uuid.uuid4())
        counterpart = str(uuid.uuid4())
        print(f'Creating states {state_id} and {counterpart}')

        self.name_table.put_item(
            Item=self._create_name_item(
                state_id, counterpart, email1, name_list
            )
        )
        self.name_table.put_item(
            Item=self._create_name_item(
                counterpart, state_id, email2, name_list
            )
        )
        with open(os.path.join(TEMPLATE_DIR, 'email_body.html')) as f:
            template = f.read()
        self._send_email(email1, state_id, template)
        self._send_email(email2, counterpart, template)
        return response({'Location': urljoin(FRONTEND_URL, state_id)},)

    def post(self, request):
        state_id = self._get_state_id(request)
        selected = set(request.body.get('select', []))
        rejected = set(request.body.get('reject', []))
        if not selected and not rejected:
            raise BadInput('Nothing to select or reject')
        adds = []
        attribute_values = {
            ':bodyitems': selected.union(rejected),
            ':state_id': state_id,
        }
        if selected:
            adds.append('Selected :selected')
            attribute_values[':selected'] = selected
        if rejected:
            adds.append('Rejected :rejected')
            attribute_values[':rejected'] = rejected
        update_expression = (
            'DELETE Remaining :bodyitems ' f'ADD {", ".join(adds)}'
        )
        try:
            result = self.name_table.update_item(
                Key={'StateId': state_id},
                UpdateExpression=update_expression,
                ExpressionAttributeValues=attribute_values,
                ReturnValues='UPDATED_NEW',
                ConditionExpression='StateId = :state_id',
            )
        except botocore.exceptions.ClientError as e:
            code = e.response['Error']['Code']
            if code != 'ConditionalCheckFailedException':
                raise
            raise NotFound(f'State "{state_id}" not found')
        return response(self._serializable(result['Attributes']))

    def _create_name_item(self, state_id, counterpart, email, names):
        return {
            'StateId': state_id,
            'Counterpart': counterpart,
            'Email': email,
            'Remaining': names.union(_blank_set),
            'Rejected': _blank_set,
            'Selected': _blank_set,
            'Created': int(time.time()),
            'Updated': int(time.time()),
        }

    def _get_and_validate_email(self, body, key):
        if key not in body:
            raise BadInput(f'Missing {key}')
        email = body[key]
        if not STUPID_EMAIL_REGEX.match(email):
            raise BadInput(f'Invalid email "{email}"')
        return email

    def _get_state_id(self, request):
        return request.path.split('/')[0]

    def _send_email(self, email, state_id, template):
        response = self.ses_client.send_email(
            Source=EMAIL_SENDER,
            Destination={'ToAddresses': [email]},
            Message={
                'Subject': {'Data': 'Skráning á nafnaval.is'},
                'Body': {
                    'Html': {
                        'Data': template
                        % {'url': urljoin(FRONTEND_URL, state_id)}
                    }
                },
            },
        )
        print(f'Sent email with message id {response["MessageId"]}')

    def _serializable(self, item):
        return {
            k: list(v - _blank_set) if isinstance(v, set) else v
            for k, v in item.items()
        }
