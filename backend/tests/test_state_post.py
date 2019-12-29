import json

import pytest

from server.handlers import StateHandler
from server.request import Request
from server import names
from server.exceptions import NotFound, BadInput


def test_post_nonexist_state(dynamodb):
    handler = StateHandler()
    state_id = 'test'
    request = Request(
        path=f'{state_id}/', body={'select': ['Arnar'], 'reject': ['Bjarni']},
    )

    with pytest.raises(NotFound):
        handler.post(request)


def test_post_empty_select_reject(dynamodb):
    handler = StateHandler()
    state_id = 'test'
    request = Request(
        path=f'{state_id}/', body={'select': [], 'reject': []},
    )

    with pytest.raises(BadInput):
        handler.post(request)


def test_select_names(dynamodb):
    handler = StateHandler()
    state_id = 'test'
    handler.name_table.put_item(
        Item=handler._create_name_item(
            state_id, 'counter', 'email', names.get('male')
        )
    )
    request = Request(
        path=f'{state_id}/',
        body={'select': ['Sindri', 'Óttar'], 'reject': ['Aðalráður']},
    )

    response = handler.post(request)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert 'Sindri' not in body['Remaining']
    assert 'Óttar' not in body['Remaining']
    assert 'Aðalráður' not in body['Remaining']
    assert 'Guðmundur' in body['Remaining']
    assert sorted(body['Selected']) == sorted(['Sindri', 'Óttar'])
    assert body['Rejected'] == ['Aðalráður']

    request = Request(path=f'{state_id}/', body={'select': ['Guðmundur']})

    response = handler.post(request)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert 'Guðmundur' not in body['Remaining']
    assert sorted(body['Selected']) == sorted(['Sindri', 'Óttar', 'Guðmundur'])
    assert body['Rejected'] == ['Aðalráður']
