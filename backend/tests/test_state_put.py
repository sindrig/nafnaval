import json
from unittest.mock import patch

import pytest

from server.handlers import StateHandler
from server.request import Request
from server.exceptions import BadInput


def test_missing_email1():
    handler = StateHandler()
    request = Request(path='', body={'email2': 'sindri@irdn.is'},)

    with pytest.raises(BadInput) as exc:
        handler.put(request)

    assert exc.value.error == 'Missing email1'


def test_missing_email2():
    handler = StateHandler()
    request = Request(path='', body={'email1': 'sindri@nafnaval.is'},)

    with pytest.raises(BadInput) as exc:
        handler.put(request)

    assert exc.value.error == 'Missing email2'


def test_invalid_emails():
    handler = StateHandler()
    request = Request(path='', body={'email1': 'blah', 'email2': 'blash'})

    with pytest.raises(BadInput) as exc:
        handler.put(request)

    assert exc.value.error == 'Invalid email "blah"'


def test_missing_sex():
    handler = StateHandler()
    request = Request(
        path='',
        body={'email1': 'sindri@nafnaval.is', 'email2': 'sindri@irdn.is'},
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
    )

    with pytest.raises(BadInput) as exc:
        handler.put(request)

    assert (
        exc.value.error == 'Missing or invalid sex (either "male" or "female")'
    )


@patch('server.handlers.state.uuid')
def test_create_state(uuid_patch, dynamodb, ses):
    uuid_patch.uuid4.return_value = 'some-uuid'
    handler = StateHandler()
    request = Request(
        path='',
        body={
            'email1': 'sindri@nafnaval.is',
            'email2': 'sindri@irdn.is',
            'sex': 'male',
        },
    )

    state = handler.put(request)

    assert state['statusCode'] == 200
    assert state['body'] == json.dumps(
        {'Location': f'https://nafnaval.is/some-uuid'}
    )
    assert ses.get_send_quota()['SentLast24Hours'] == 2