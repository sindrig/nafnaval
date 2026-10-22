import json
from unittest.mock import patch

import pytest

from server.handlers import StateHandler
from server.request import Request
from server.exceptions import BadInput, ServiceUnavailable, TooManyRequests


def test_missing_email1():
    handler = StateHandler()
    request = Request(
        path='',
        body={'email2': 'sindri@irdn.is'},
    )

    with pytest.raises(BadInput) as exc:
        handler.put(request)

    assert exc.value.error == 'Missing email1'


def test_missing_email2():
    handler = StateHandler()
    request = Request(
        path='',
        body={'email1': 'sindri@nafnaval.is'},
    )

    with pytest.raises(BadInput) as exc:
        handler.put(request)

    assert exc.value.error == 'Missing email2'


def test_invalid_emails():
    handler = StateHandler()
    request = Request(path='', body={'email1': 'blah', 'email2': 'blash'})

    with pytest.raises(BadInput) as exc:
        handler.put(request)

    assert exc.value.error == 'Invalid email "blah"'


def test_missing_gender():
    handler = StateHandler()
    request = Request(
        path='',
        body={'email1': 'sindri@nafnaval.is', 'email2': 'sindri@irdn.is'},
    )

    with pytest.raises(BadInput) as exc:
        handler.put(request)

    exp_err = 'Missing or invalid gender (either "male", "female" or "both")'
    assert exc.value.error == exp_err


def test_invalid_gender():
    handler = StateHandler()
    request = Request(
        path='',
        body={
            'email1': 'sindri@nafnaval.is',
            'email2': 'sindri@irdn.is',
            'gender': 'invalid',
        },
    )

    with pytest.raises(BadInput) as exc:
        handler.put(request)

    exp_err = 'Missing or invalid gender (either "male", "female" or "both")'
    assert exc.value.error == exp_err


@patch('server.handlers.state.uuid')
def test_create_state(uuid_patch, dynamodb, ses):
    uuid_patch.uuid4.side_effect = ['some-uuid', 'partner-uuid']
    handler = StateHandler()
    request = Request(
        path='',
        source_ip='192.0.2.1',
        body={
            'email1': 'sindri@nafnaval.is',
            'email2': 'sindri@irdn.is',
            'gender': 'male',
        },
    )

    state = handler.put(request)

    assert state['statusCode'] == 200
    assert state['body'] == json.dumps({'stateId': 'some-uuid'})
    assert ses.get_send_quota()['SentLast24Hours'] == 2


@pytest.mark.parametrize('enabled', [None, '', 'false'])
def test_paused_signups_have_no_side_effects(
    enabled, monkeypatch, dynamodb, ses
):
    if enabled is None:
        monkeypatch.delenv('SIGNUPS_ENABLED')
    else:
        monkeypatch.setenv('SIGNUPS_ENABLED', enabled)
    handler = StateHandler()
    request = Request(
        path='',
        source_ip='192.0.2.1',
        body={
            'email1': 'parent@example.com',
            'email2': 'partner@example.com',
            'gender': 'male',
        },
    )

    with pytest.raises(ServiceUnavailable):
        handler.put(request)

    assert dynamodb.Table('some-names-table').scan()['Count'] == 0
    assert ses.get_send_quota()['SentLast24Hours'] == 0


def test_recipient_cooldown_prevents_states_and_emails(dynamodb, ses):
    handler = StateHandler()
    request = Request(
        path='',
        source_ip='192.0.2.1',
        body={
            'email1': 'parent@example.com',
            'email2': 'partner@example.com',
            'gender': 'male',
        },
    )
    handler.put(request)
    request.source_ip = '192.0.2.2'
    request.body['email1'] = ' Parent@EXAMPLE.com '
    request.body['email2'] = 'another@example.com'

    with pytest.raises(TooManyRequests):
        handler.put(request)

    assert dynamodb.Table('some-names-table').scan()['Count'] == 2
    assert ses.get_send_quota()['SentLast24Hours'] == 2


def test_missing_protection_configuration_has_no_side_effects(
    monkeypatch, dynamodb, ses
):
    monkeypatch.delenv('SIGNUP_LIMITS_TABLE')
    handler = StateHandler()
    request = Request(
        path='',
        source_ip='192.0.2.1',
        body={
            'email1': 'parent@example.com',
            'email2': 'partner@example.com',
            'gender': 'male',
        },
    )

    with pytest.raises(ServiceUnavailable):
        handler.put(request)

    assert dynamodb.Table('some-names-table').scan()['Count'] == 0
    assert ses.get_send_quota()['SentLast24Hours'] == 0


@pytest.mark.parametrize(
    'email',
    [
        None,
        ['parent@example.com'],
        'parent@example.com,other@example.com',
        'parent@example.com\nBcc:other@example.com',
        'parent@example.com extra',
        'a' * 65 + '@example.com',
    ],
)
def test_rejects_invalid_recipient_values(email):
    handler = StateHandler()
    request = Request(
        path='',
        body={'email1': email, 'email2': 'partner@example.com'},
    )

    with pytest.raises(BadInput):
        handler.put(request)


def test_rejects_duplicate_recipients():
    handler = StateHandler()
    request = Request(
        path='',
        body={
            'email1': 'parent@example.com',
            'email2': ' PARENT@example.com ',
        },
    )

    with pytest.raises(BadInput) as error:
        handler.put(request)

    assert error.value.error == 'Use two different email addresses'


def test_signup_email_uses_configured_frontend_url(monkeypatch):
    monkeypatch.setenv('FRONTEND_URL', 'https://stagingwww.nafnaval.is')
    handler = StateHandler()

    with patch.object(
        handler.ses_client,
        'send_email',
        return_value={'MessageId': 'test-message'},
    ) as send_email:
        handler._send_email(
            'parent@example.com', 'test-state', '<a href="%(url)s">Open</a>'
        )

    send_email.assert_called_once_with(
        Source='nafnaval@nafnaval.is',
        Destination={'ToAddresses': ['parent@example.com']},
        Message={
            'Subject': {'Data': 'Skráning á nafnaval.is'},
            'Body': {
                'Html': {
                    'Data': '<a href="https://stagingwww.nafnaval.is/test-state">Open</a>'
                }
            },
        },
    )
