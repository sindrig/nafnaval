import pytest

from server.handlers import StateHandler
from server.request import Request
from server.exceptions import BadInput


def test_missing_email1():
    handler = StateHandler()
    request = Request(path='', body={'email2': 'sindri@irdn.is'}, query={})

    with pytest.raises(BadInput) as exc:
        handler.post(request)

    assert exc.value.error == 'Missing email1'


def test_missing_email2():
    handler = StateHandler()
    request = Request(path='', body={'email1': 'sindri@nafnaval.is'}, query={})

    with pytest.raises(BadInput) as exc:
        handler.post(request)

    assert exc.value.error == 'Missing email2'


def test_invalid_emails():
    handler = StateHandler()
    request = Request(path='', body={'email1': 'blah', 'email2': 'blash'}, query={})

    with pytest.raises(BadInput) as exc:
        handler.post(request)

    assert exc.value.error == 'Invalid email "blah"'
