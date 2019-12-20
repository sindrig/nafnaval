import pytest
import os
import boto3
from moto import mock_dynamodb2


# @pytest.fixture(scope='function')
# def test_env():
#     """Mocked AWS Credentials for moto."""
os.environ['AWS_ACCESS_KEY_ID'] = 'testing'
os.environ['AWS_SECRET_ACCESS_KEY'] = 'testing'
os.environ['AWS_SECURITY_TOKEN'] = 'testing'
os.environ['AWS_SESSION_TOKEN'] = 'testing'
os.environ['NAMES_TABLE'] = names_table = 'some-names-table'


# Not the same as prod deployment
os.environ['AWS_REGION'] = 'us-east-1'


@pytest.fixture(scope='function')
def dynamodb():
    with mock_dynamodb2():
        dynamo = boto3.resource(
            'dynamodb', region_name=os.environ['AWS_REGION']
        )
        table = dynamo.create_table(
            TableName=names_table,
            KeySchema=[
                {'AttributeName': 'StateId', 'KeyType': 'HASH'},
            ],
            AttributeDefinitions=[
                {'AttributeName': 'StateId', 'AttributeType': 'S'},
            ],
        )
        table.meta.client.get_waiter('table_exists').wait(
            TableName=names_table
        )
        yield dynamo
