from unittest.mock import patch

from main import handler


@patch('main.serve')
def test_source_ip_comes_from_gateway_not_client_headers(serve):
    event = {
        'path': '/state/',
        'httpMethod': 'PUT',
        'body': '{}',
        'headers': {'X-Forwarded-For': '192.0.2.200'},
        'requestContext': {'identity': {'sourceIp': '192.0.2.1'}},
    }

    handler(event, None)

    serve.assert_called_once_with(
        path='state/', method='put', body='{}', source_ip='192.0.2.1'
    )
