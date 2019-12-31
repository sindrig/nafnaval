import os
import decimal
import random
import time
import uuid
import re
from urllib.parse import urljoin

import botocore

from server.handlers.base import BaseHandler
from server.responses import response
from server.exceptions import NotFound, BadInput
from server import names

TEMPLATE_DIR = os.path.dirname(os.path.abspath(__file__))
STUPID_EMAIL_REGEX = re.compile(r'[^@]+@[^@]+\.[^@]+')
FRONTEND_URL = 'https://nafnaval.is'
EMAIL_SENDER = 'nafnaval@nafnaval.is'


class StateHandler(BaseHandler):
    def get(self, request):
        state_id = self.get_state_id(request)
        state = self.get_state(state_id)
        return response(self._serializable(state))

    def put(self, request):
        email1 = self._get_and_validate_email(request.body, 'email1')
        email2 = self._get_and_validate_email(request.body, 'email2')
        gender = request.body.get('gender')
        if gender not in (names.MALE, names.FEMALE):
            raise BadInput(
                'Missing or invalid gender (either '
                f'"{names.MALE}" or "{names.FEMALE}")'
            )
        name_list = names.get(gender)
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
        return response({'stateId': state_id})

    def post(self, request):
        state_id = self.get_state_id(request)
        # TODO: Do not default action
        # TODO: Migrate save to movements?
        if request.body.get('action', 'save') == 'save':
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
                f'DELETE Remaining :bodyitems ADD {", ".join(adds)}'
            )
        elif request.body.get('action') == 'move':
            movements = request.body.get('movements', [])
            if not movements:
                raise BadInput('No movements saved')
            result = self.name_table.get_item(
                Key={'StateId': state_id},
                ProjectionExpression='Remaining,Selected,Rejected',
            )
            if 'Item' not in result:
                raise NotFound(f'State "{state_id}" not found')
            item = result['Item']
            deletes = set()
            adds = set()
            attribute_values = {
                ':state_id': state_id,
            }
            for movement in movements:
                if movement.get('name') not in item.get(
                    movement.get('from'), []
                ):
                    raise BadInput(
                        f'"{movement.get("name")}" not found in '
                        f'{movement.get("from")}'
                    )
                elif 'to' not in movement:
                    raise BadInput('Missing to parameter in movement')
                f = movement['from']
                t = movement['to']
                name = movement['name']
                target_delete_key = f':del{f.lower()}'
                target_add_key = f':add{t.lower()}'
                if target_delete_key not in attribute_values:
                    attribute_values[target_delete_key] = set()
                if target_add_key not in attribute_values:
                    attribute_values[target_add_key] = set()
                attribute_values[target_delete_key].add(name)
                attribute_values[target_add_key].add(name)
                deletes.add(f'{f} {target_delete_key}')
                adds.add(f'{t} {target_add_key}')
            update_expression = (
                f'DELETE {", ".join(deletes)} ADD {", ".join(adds)}'
            )

        try:
            result = self.name_table.update_item(
                Key={'StateId': state_id},
                UpdateExpression=update_expression,
                ExpressionAttributeValues=attribute_values,
                ReturnValues='ALL_NEW',
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
            'Remaining': names.union(self.BLANK_SET),
            'Rejected': self.BLANK_SET,
            'Selected': self.BLANK_SET,
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
        result = {}
        for k, v in item.items():
            if k in ('Counterpart', 'Email'):
                # Skip counterparts
                continue
            if isinstance(v, set):
                result[k] = list(v - self.BLANK_SET)
                if k == 'Remaining':
                    # We want to have Remaining shuffled always
                    random.shuffle(result[k])
                else:
                    # Others shold always be in order
                    result[k] = sorted(result[k])
            elif isinstance(v, decimal.Decimal):
                result[k] = float(v)
            else:
                result[k] = v
        return result
