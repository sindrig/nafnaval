import os

import boto3

from server.exceptions import NotFound

BLANK = '__blank'


class BaseHandler:
    BLANK_SET = {BLANK}

    def __init__(self):
        dynamodb = boto3.resource(
            'dynamodb', region_name=os.getenv('AWS_REGION')
        )
        self.name_table = dynamodb.Table(os.getenv('NAMES_TABLE'))
        self.ses_client = boto3.client(
            'ses', region_name=os.getenv('AWS_REGION')
        )

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
