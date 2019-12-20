# import pytest
import os


# @pytest.fixture(scope='function')
# def test_env():
#     """Mocked AWS Credentials for moto."""
os.environ['AWS_ACCESS_KEY_ID'] = 'testing'
os.environ['AWS_SECRET_ACCESS_KEY'] = 'testing'
os.environ['AWS_SECURITY_TOKEN'] = 'testing'
os.environ['AWS_SESSION_TOKEN'] = 'testing'
os.environ['STATES_TABLE'] = 'some-states-table'


os.environ['AWS_REGION'] = 'testing'
