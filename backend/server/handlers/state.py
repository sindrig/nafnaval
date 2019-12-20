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
        self.config_table = dynamodb.Table(os.getenv('CONFIG_TABLE'))

    def get(self, request):
        state_id = request.path.split('/')[0]
        config = self.config_table.get_item(Key={'StateId': state_id})
        if 'Item' not in config:
            raise NotFound(f'State "{state_id}" not found')
        kwargs = {'KeyConditionExpression': Key('StateId').eq(state_id)}
        if 'all' not in request.query:
            kwargs['FilterExpression'] = Attr('Done').eq(False)
        return response(
            {
                'names': self.name_table.query(**kwargs)['Items'],
                'config': config['Item'],
            }
        )

    def post(self, request):
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

        self.config_table.put_item(
            Item=self._create_config(state_id, counterpart, email1)
        )
        self.config_table.put_item(
            Item=self._create_config(counterpart, state_id, email2)
        )
        with self.name_table.batch_writer() as batch:
            for guid in (state_id, counterpart):
                for name in names:
                    batch.put_item(Item=self._create_name(guid, name))
        # TODO: Send emails
        return response(
            headers={'Location': urljoin(FRONTEND_URL, state_id)},
            status_code=302,
        )

    def _create_config(self, state_id, counterpart, email):
        return {
            'StateId': state_id,
            'Email': email,
            'Counterpart': counterpart,
            'Created': int(time.time()),
        }

    def _create_name(self, state_id, name):
        return {
            'StateId': state_id,
            'Name': name,
            'Done': False,
            'Selected': False,
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
