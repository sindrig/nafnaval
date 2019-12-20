import json
import pytest
import uuid

from server.handlers import StateHandler
from server.request import Request
from server.exceptions import NotFound


def test_get_nonexisting_state(dynamodb):
    guid = str(uuid.uuid4())
    request = Request(path=f'{guid}/', body=None, query={})
    handler = StateHandler()

    # Missing item in config table, we want to raise
    handler.name_table.put_item(
        Item={'StateId': guid, 'Done': False, 'Name': 'Sindri'}
    )

    with pytest.raises(NotFound) as exc:
        handler.get(request)

    assert exc.value.error == f'State "{guid}" not found'


def test_get_state(dynamodb):
    guid = str(uuid.uuid4())
    request = Request(path=f'{guid}/', body=None, query={})
    handler = StateHandler()

    config = {'StateId': guid, 'Email': 'ya'}
    handler.config_table.put_item(Item=config)
    item = {'StateId': guid, 'Done': False, 'Name': 'Sindri'}
    handler.name_table.put_item(
        Item=item
    )

    response = handler.get(request)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body == {
        'config': config,
        'names': [item]
    }
