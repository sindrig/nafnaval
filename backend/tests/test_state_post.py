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
    request = Request(path=f'{state_id}/', body={'select': [], 'reject': []},)

    with pytest.raises(BadInput):
        handler.post(request)


def test_post_missing_movements(dynamodb):
    handler = StateHandler()
    state_id = 'test'
    request = Request(path=f'{state_id}/', body={'action': 'move'},)

    with pytest.raises(BadInput):
        handler.post(request)
    request = Request(
        path=f'{state_id}/', body={'action': 'move', 'movements': []},
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


def test_add_selected_to_remaining(dynamodb):
    handler = StateHandler()
    state_id = 'test'
    item = handler._create_name_item(
        state_id, 'counter', 'email', names.get('male')
    )
    handler.name_table.put_item(Item=item)

    request = Request(
        path=f'{state_id}/',
        body={
            'movements': [
                {'name': 'Sindri', 'from': 'Remaining', 'to': 'Rejected'}
            ],
            'action': 'move',
        },
    )

    response = handler.post(request)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert 'Sindri' in body['Rejected']
    assert 'Sindri' not in body['Remaining']
    assert 'Sindri' not in body['Selected']

    request = Request(
        path=f'{state_id}/',
        body={
            'movements': [
                {'name': 'Sindri', 'from': 'Rejected', 'to': 'Selected'}
            ],
            'action': 'move',
        },
    )

    response = handler.post(request)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert 'Sindri' in body['Selected']
    assert 'Sindri' not in body['Remaining']
    assert 'Sindri' not in body['Rejected']

    request = Request(
        path=f'{state_id}/',
        body={
            'movements': [
                {'name': 'Sindri', 'from': 'Selected', 'to': 'Remaining'}
            ],
            'action': 'move',
        },
    )

    response = handler.post(request)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert 'Sindri' in body['Remaining']
    assert 'Sindri' not in body['Selected']
    assert 'Sindri' not in body['Rejected']


def test_multiple_movements(dynamodb):
    handler = StateHandler()
    state_id = 'test'
    item = handler._create_name_item(
        state_id, 'counter', 'email', names.get('male')
    )
    handler.name_table.put_item(Item=item)

    request = Request(
        path=f'{state_id}/',
        body={
            'movements': [
                {'name': 'Sindri', 'from': 'Remaining', 'to': 'Rejected'},
                {'name': 'Óttar', 'from': 'Remaining', 'to': 'Selected'},
            ],
            'action': 'move',
        },
    )

    response = handler.post(request)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body['Rejected'] == ['Sindri']
    assert body['Selected'] == ['Óttar']
    assert 'Sindri' not in body['Remaining']
    assert 'Óttar' not in body['Remaining']
