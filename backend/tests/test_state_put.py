from unittest.mock import patch

import pytest

from server.handlers import StateHandler
from server.request import Request
from server.exceptions import BadInput


def test_missing_email1():
    handler = StateHandler()
    request = Request(path='', body={'email2': 'sindri@irdn.is'}, query={})

    with pytest.raises(BadInput) as exc:
        handler.put(request)

    assert exc.value.error == 'Missing email1'


def test_missing_email2():
    handler = StateHandler()
    request = Request(path='', body={'email1': 'sindri@nafnaval.is'}, query={})

    with pytest.raises(BadInput) as exc:
        handler.put(request)

    assert exc.value.error == 'Missing email2'


def test_invalid_emails():
    handler = StateHandler()
    request = Request(
        path='', body={'email1': 'blah', 'email2': 'blash'}, query={}
    )

    with pytest.raises(BadInput) as exc:
        handler.put(request)

    assert exc.value.error == 'Invalid email "blah"'


def test_missing_sex():
    handler = StateHandler()
    request = Request(
        path='',
        body={'email1': 'sindri@nafnaval.is', 'email2': 'sindri@irdn.is'},
        query={},
    )

    with pytest.raises(BadInput) as exc:
        handler.put(request)

    assert (
        exc.value.error == 'Missing or invalid sex (either "male" or "female")'
    )


def test_invalid_sex():
    handler = StateHandler()
    request = Request(
        path='',
        body={
            'email1': 'sindri@nafnaval.is',
            'email2': 'sindri@irdn.is',
            'sex': 'invalid',
        },
        query={},
    )

    with pytest.raises(BadInput) as exc:
        handler.put(request)

    assert (
        exc.value.error == 'Missing or invalid sex (either "male" or "female")'
    )


@patch('server.handlers.state.uuid')
def test_create_state(uuid_patch, dynamodb):
    uuid_patch.uuid4.return_value = 'some-uuid'
    handler = StateHandler()
    request = Request(
        path='',
        body={
            'email1': 'sindri@nafnaval.is',
            'email2': 'sindri@irdn.is',
            'sex': 'male',
        },
        query={},
    )

    state = handler.put(request)

    assert state['statusCode'] == 302
    assert state['headers']['Location'] == f'https://nafnaval.is/some-uuid'
