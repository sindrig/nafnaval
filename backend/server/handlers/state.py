import os
import re

import boto3
from boto3.dynamodb.conditions import Key, Attr

from server.responses import response
from server.exceptions import NotFound, BadInput


STUPID_EMAIL_REGEX = re.compile(r'[^@]+@[^@]+\.[^@]+')

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

        return response({'body': request.body})

    def _get_and_validate_email(self, body, key):
        if key not in body:
            raise BadInput(f'Missing {key}')
        email = body[key]
        if not STUPID_EMAIL_REGEX.match(email):
            raise BadInput(f'Invalid email "{email}"')
        return email
