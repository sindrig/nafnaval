import uuid

from moto import mock_dynamodb

from server.handlers import StateHandler
from server.request import Request


@mock_dynamodb
def test_get_nonexisting_state():
    guid = uuid.uuid4()
    request = Request(path=f'{guid}/', body=None)
    handler = StateHandler()

    response = handler.get(request)

    assert response['statusCode'] == 404
    assert response['body'] == f'State "{guid}" not found'
