import json
import pytest
import uuid

from server.handlers import StateHandler
from server.request import Request
from server.exceptions import NotFound


def test_get_nonexisting_state(dynamodb):
    guid = str(uuid.uuid4())
    request = Request(path=f'{guid}/', body=None)
    handler = StateHandler()

    with pytest.raises(NotFound) as exc:
        handler.get(request)

    assert exc.value.error == f'State "{guid}" not found'


def test_get_state(dynamodb):
    guid = str(uuid.uuid4())
    request = Request(path=f'{guid}/', body=None)
    handler = StateHandler()

    item = {
        'StateId': guid,
        'Remaining': ['Sindri'],
        'Selected': ['Someone'],
        'Rejected': ['Oged'],
    }
    handler.name_table.put_item(Item=item)

    response = handler.get(request)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body == {'StateId': guid, 'Remaining': ['Sindri']}


def test_get_states_rejected(dynamodb):
    guid = str(uuid.uuid4())
    request = Request(path=f'{guid}/rejected', body=None)
    handler = StateHandler()

    item = {
        'StateId': guid,
        'Remaining': ['Sindri'],
        'Selected': ['Someone'],
        'Rejected': ['Oged'],
    }
    handler.name_table.put_item(Item=item)

    response = handler.get(request)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body == {'StateId': guid, 'Rejected': ['Oged']}
