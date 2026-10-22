import os
from unittest.mock import Mock, patch

import boto3
import pytest
from botocore.stub import Stubber

from server.exceptions import ServiceUnavailable, TooManyRequests
from server.signup_limits import SignupLimits


@pytest.fixture
def clock():
    with patch('server.signup_limits.time', Mock()) as clock:
        clock.time.return_value = 1700000000
        yield clock.time


@pytest.fixture
def limits(dynamodb, clock):
    return SignupLimits(
        boto3.client('dynamodb', region_name=os.environ['AWS_REGION']),
        os.environ['SIGNUP_LIMITS_TABLE'],
    )


def recipients(index):
    return [f'parent{index}@example.com', f'partner{index}@example.com']


def test_ip_limit_and_atomic_rejection(limits):
    for index in range(3):
        limits.reserve('192.0.2.1', recipients(index))

    with pytest.raises(TooManyRequests):
        limits.reserve('192.0.2.1', recipients(3))

    # The rejected request must not reserve the new recipients.
    limits.reserve('192.0.2.2', recipients(3))


def test_recipient_cooldown_and_atomic_rejection(limits):
    limits.reserve('192.0.2.1', recipients(0))

    with pytest.raises(TooManyRequests):
        limits.reserve('192.0.2.2', recipients(0))

    # Rejections must not consume the other IP's quota.
    for index in range(1, 4):
        limits.reserve('192.0.2.2', recipients(index))


def test_ip_quota_resets_in_next_hour(limits, clock):
    for index in range(3):
        limits.reserve('192.0.2.1', recipients(index))

    clock.return_value += 3600
    limits.reserve('192.0.2.1', recipients(3))


def test_ipv6_spelling_does_not_bypass_ip_quota(limits):
    for index in range(3):
        limits.reserve('2001:db8::1', recipients(index))

    with pytest.raises(TooManyRequests):
        limits.reserve(
            '2001:0db8:0000:0000:0000:0000:0000:0001', recipients(3)
        )


def test_expired_recipient_cooldown_does_not_depend_on_ttl_cleanup(
    limits, clock
):
    limits.reserve('192.0.2.1', recipients(0))
    clock.return_value += 86400

    limits.reserve('192.0.2.1', recipients(0))


def test_daily_budget_cannot_be_bypassed_by_changing_ips(limits):
    for index in range(50):
        limits.reserve(f'192.0.2.{index + 1}', recipients(index))

    with pytest.raises(TooManyRequests):
        limits.reserve('192.0.2.100', recipients(50))


@pytest.mark.parametrize('source_ip', [None, '', 'not-an-ip'])
def test_missing_or_invalid_source_ip_fails_closed(limits, source_ip):
    with pytest.raises(ServiceUnavailable):
        limits.reserve(source_ip, recipients(0))


def test_storage_failure_fails_closed(limits):
    with Stubber(limits.client) as stubber:
        stubber.add_client_error(
            'transact_write_items', service_error_code='AccessDeniedException'
        )
        with pytest.raises(ServiceUnavailable):
            limits.reserve('192.0.2.1', recipients(0))
