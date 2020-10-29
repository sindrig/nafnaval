import os

import boto3

from server.exceptions import NotFound

BLANK = '__blank'


class BaseHandler:
    BLANK_SET = {BLANK}

    def __init__(self):
        resource_kwargs = {
            'region_name': os.getenv('AWS_REGION'),
        }
        if os.getenv('LOCALSTACK') and os.getenv('LOCALSTACK_HOSTNAME'):
            localstack_hostname = os.getenv('LOCALSTACK_HOSTNAME')
            endpoint_url = f'http://{localstack_hostname}:4566'
            resource_kwargs['endpoint_url'] = endpoint_url
        dynamodb = boto3.resource('dynamodb', **resource_kwargs)
        self.name_table = dynamodb.Table(os.getenv('NAMES_TABLE'))
        self.ses_client = boto3.client('ses', **resource_kwargs)

    def get_state_id(self, request):
        return request.path.split('/')[0]

    def get_state(self, state_id):
        attrs = [
            'StateId',
            'Email',
            'Selected',
            'Rejected',
            'Remaining',
            'Counterpart',
        ]
        result = self.name_table.get_item(
            Key={'StateId': state_id}, ProjectionExpression=','.join(attrs)
        )
        if 'Item' not in result:
            raise NotFound(f'State "{state_id}" not found')
        return result['Item']
