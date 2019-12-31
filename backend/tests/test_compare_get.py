import json
import pytest
import uuid

from server.handlers import CompareHandler
from server.request import Request
from server.exceptions import NotFound


def test_compare_nonexisting_state(dynamodb):
    guid = str(uuid.uuid4())
    request = Request(path=f'{guid}/', body=None)
    handler = CompareHandler()

    with pytest.raises(NotFound) as exc:
        handler.get(request)

    assert exc.value.error == f'State "{guid}" not found'


def test_compare_nonexisting_counterpartstate(dynamodb):
    guid = str(uuid.uuid4())
    request = Request(path=f'{guid}/', body=None)
    handler = CompareHandler()

    item = {
        'StateId': guid,
        'Counterpart': 'not exists',
        'Remaining': {'Blank'},
        'Selected': {'Sindri'},
        'Rejected': {'Oged'},
    }
    handler.name_table.put_item(Item=item)

    with pytest.raises(NotFound) as exc:
        handler.get(request)

    assert exc.value.error == f'State "not exists" not found'


def test_get_state(dynamodb):
    guid1 = str(uuid.uuid4())
    guid2 = str(uuid.uuid4())
    request = Request(path=f'{guid1}/', body=None)
    handler = CompareHandler()

    item = {
        'StateId': guid1,
        'Counterpart': guid2,
        'Remaining': {'Blank'},
        'Selected': {'Sindri', 'SelectedBy1'},
        'Rejected': {'Oged'},
    }
    handler.name_table.put_item(Item=item)
    item = {
        'StateId': guid2,
        'Counterpart': guid1,
        'Remaining': {'Blank2', 'SelectedBy1'},
        'Selected': {'Sindri'},
        'Rejected': {'Oged'},
    }
    handler.name_table.put_item(Item=item)

    response = handler.get(request)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body == {
        'names': ['Sindri'],
        'progress': {'self': 0.75, 'counterpart': 0.5},
    }
