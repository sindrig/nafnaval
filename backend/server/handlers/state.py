import boto3
import os

from server.responses import response


class StateHandler:
    def __init__(self):
        dynamodb = boto3.resource(
            'dynamodb', region_name=os.getenv('AWS_REGION')
        )
        self.table = dynamodb.Table(os.getenv('STATES_TABLE'))

    def get(self, request):
        state_id = request.path.split('/')[0]
        return response(self.table.get_item(Key={'StateId': state_id})['Item'])
        return response({'path': request.path})

    def post(self, request):
        return response({'body': request.body})
