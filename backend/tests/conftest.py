import pytest
import os
import boto3
from moto import mock_dynamodb, mock_ses


# @pytest.fixture(scope='function')
# def test_env():
#     """Mocked AWS Credentials for moto."""
os.environ['AWS_ACCESS_KEY_ID'] = 'testing'
os.environ['AWS_SECRET_ACCESS_KEY'] = 'testing'
os.environ['AWS_SECURITY_TOKEN'] = 'testing'
os.environ['AWS_SESSION_TOKEN'] = 'testing'
os.environ['NAMES_TABLE'] = names_table = 'some-names-table'
os.environ['SIGNUP_LIMITS_TABLE'] = limits_table = 'some-signup-limits'
os.environ['SIGNUPS_ENABLED'] = 'true'


# Not the same as prod deployment
os.environ['AWS_REGION'] = 'us-east-1'


@pytest.fixture(scope='function')
def dynamodb():
    with mock_dynamodb():
        dynamo = boto3.resource(
            'dynamodb', region_name=os.environ['AWS_REGION']
        )
        table = dynamo.create_table(
            TableName=names_table,
            KeySchema=[{'AttributeName': 'StateId', 'KeyType': 'HASH'}],
            AttributeDefinitions=[
                {'AttributeName': 'StateId', 'AttributeType': 'S'},
            ],
            BillingMode='PAY_PER_REQUEST',
        )
        table.meta.client.get_waiter('table_exists').wait(
            TableName=names_table
        )
        dynamo.create_table(
            TableName=limits_table,
            KeySchema=[{'AttributeName': 'LimitKey', 'KeyType': 'HASH'}],
            AttributeDefinitions=[
                {'AttributeName': 'LimitKey', 'AttributeType': 'S'},
            ],
            BillingMode='PAY_PER_REQUEST',
        )
        yield dynamo


@pytest.fixture(scope='function')
def ses():
    with mock_ses():
        ses = boto3.client('ses', region_name=os.environ['AWS_REGION'])
        ses.verify_domain_identity(Domain='nafnaval.is')
        yield ses
