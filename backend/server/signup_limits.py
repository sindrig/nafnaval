import hashlib
import ipaddress
import logging
import time

from botocore.exceptions import BotoCoreError, ClientError

from server.exceptions import ServiceUnavailable, TooManyRequests

logger = logging.getLogger(__name__)

HOUR = 3600
DAY = 24 * HOUR
SIGNUPS_PER_IP_HOUR = 3
SIGNUPS_PER_DAY = 50


class SignupLimits:
    def __init__(self, client, table_name):
        self.client = client
        self.table_name = table_name

    def reserve(self, source_ip, emails):
        if not self.table_name or not source_ip:
            raise ServiceUnavailable('Signup protection is unavailable')
        try:
            source_ip = str(ipaddress.ip_address(source_ip))
        except ValueError:
            raise ServiceUnavailable('Signup protection is unavailable')

        now = int(time.time())
        items = [
            self._counter(
                'ip:{}:{}'.format(self._digest(source_ip), now // HOUR),
                SIGNUPS_PER_IP_HOUR,
                (now // HOUR + 1) * HOUR,
            ),
            self._counter(
                'daily:{}'.format(now // DAY),
                SIGNUPS_PER_DAY,
                (now // DAY + 1) * DAY,
            ),
        ]
        for email in emails:
            items.append(
                {
                    'Put': {
                        'TableName': self.table_name,
                        'Item': {
                            'LimitKey': {
                                'S': 'recipient:' + self._digest(email)
                            },
                            'ExpiresAt': {'N': str(now + DAY)},
                        },
                        'ConditionExpression': (
                            'attribute_not_exists(LimitKey) '
                            'OR ExpiresAt <= :now'
                        ),
                        'ExpressionAttributeValues': {':now': {'N': str(now)}},
                    }
                }
            )

        # Reserve every limit atomically before storing states or sending mail.
        # A rejected signup must not consume another recipient's cooldown.
        try:
            self.client.transact_write_items(TransactItems=items)
        except ClientError as error:
            code = error.response['Error']['Code']
            reasons = error.response.get('CancellationReasons', [])
            if code == 'TransactionCanceledException' and any(
                reason.get('Code') == 'ConditionalCheckFailed'
                for reason in reasons
            ):
                raise TooManyRequests(
                    'Too many signups. Please try again later.'
                ) from error
            logger.exception('Could not reserve signup limits')
            raise ServiceUnavailable(
                'Signup protection is unavailable'
            ) from error
        except BotoCoreError as error:
            logger.exception('Could not reach signup protection')
            raise ServiceUnavailable(
                'Signup protection is unavailable'
            ) from error

    def _counter(self, key, limit, expires):
        return {
            'Update': {
                'TableName': self.table_name,
                'Key': {'LimitKey': {'S': key}},
                'UpdateExpression': (
                    'SET ExpiresAt = :expires ADD SignupCount :one'
                ),
                'ConditionExpression': (
                    'attribute_not_exists(SignupCount) '
                    'OR SignupCount < :limit'
                ),
                'ExpressionAttributeValues': {
                    ':expires': {'N': str(expires)},
                    ':one': {'N': '1'},
                    ':limit': {'N': str(limit)},
                },
            }
        }

    @staticmethod
    def _digest(value):
        return hashlib.sha256(value.encode('utf-8')).hexdigest()
