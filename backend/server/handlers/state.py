import os
import time
import uuid
import re
from urllib.parse import urljoin

import boto3
from boto3.dynamodb.conditions import Key, Attr

from server.responses import response
from server.exceptions import NotFound, BadInput
from server.names import MALE, FEMALE, get


STUPID_EMAIL_REGEX = re.compile(r'[^@]+@[^@]+\.[^@]+')
FRONTEND_URL = 'https://nafnaval.is'


class StateHandler:
    def __init__(self, dynamodb=None):
        dynamodb = boto3.resource(
            'dynamodb', region_name=os.getenv('AWS_REGION')
        )
        self.name_table = dynamodb.Table(os.getenv('NAMES_TABLE'))

    def get(self, request):
        state_id = request.path.split('/')[0]
        attrs = [
            'StateId',
            'Counterpart',
            'Email',
        ]
        if 'selected' in request.query:
            attrs.append('Selected')
        elif 'rejected' in request.query:
            attrs.append('Rejected')
        else:
            attrs.append('Remaining')
        state = self.name_table.get_item(
            Key={'StateId': state_id}, ProjectionExpression=','.join(attrs)
        )
        if 'Item' not in state:
            raise NotFound(f'State "{state_id}" not found')
        return response(state['Item'])

    def put(self, request):
        email1 = self._get_and_validate_email(request.body, 'email1')
        email2 = self._get_and_validate_email(request.body, 'email2')
        sex = request.body.get('sex')
        if sex not in (MALE, FEMALE):
            raise BadInput(
                f'Missing or invalid sex (either "{MALE}" or "{FEMALE}")'
            )
        names = get(sex)
        state_id = str(uuid.uuid4())
        counterpart = str(uuid.uuid4())

        self.name_table.put_item(
            Item=self._create_name_item(state_id, counterpart, email1, names)
        )
        self.name_table.put_item(
            Item=self._create_name_item(counterpart, state_id, email2, names)
        )
        # TODO: Send emails
        return response(
            headers={'Location': urljoin(FRONTEND_URL, state_id)},
            status_code=302,
        )

    def _create_name_item(self, state_id, counterpart, email, names):
        return {
            'StateId': state_id,
            'Counterpart': counterpart,
            'Email': email,
            'Remaining': names,
            'Rejected': [],
            'Selected': [],
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
