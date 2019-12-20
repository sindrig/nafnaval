import json
from unittest.mock import patch, Mock

from server.router import serve, Request


def test_no_handler_key():
    res = serve(path='', method='get')

    assert res['statusCode'] == 404


@patch('server.router.get_handler')
def test_not_found_handler(get_handler_patch):
    get_handler_patch.return_value = None

    res = serve(path='state/', method='get')

    assert res['statusCode'] == 404
    assert res['body'] == json.dumps(
        {'error': 'Could not find handler key "state"'}
    )


@patch('server.router.get_handler')
def test_missing_method(get_handler_patch):
    class Handler:
        pass

    get_handler_patch.return_value = Handler

    res = serve(path='state/', method='get')

    assert res['statusCode'] == 405
    assert res['body'] == json.dumps(
        {'error': f'Could not find "get" handler for "state" handler'}
    )


@patch('server.router.get_handler')
def test_malformed_body(get_handler_patch):
    class Handler:
        def get(cls):
            pass

    get_handler_patch.return_value = Handler

    res = serve(path='state/', method='get', body='{"invalid_json"')

    assert res['statusCode'] == 400
    assert res['body'] == json.dumps({'error': 'Could not decode body'})


@patch('server.router.get_handler')
def test_routes_correctly(get_handler_patch):
    handler = Mock()
    expected = {'expected': 'return_value'}
    handler().get.return_value = expected
    get_handler_patch.return_value = handler

    res = serve(
        path='state/rest/of/path', method='get', body='{"encoded": "body"}'
    )

    assert res == expected
    handler().get.assert_called_once_with(
        Request(path='rest/of/path', body={'encoded': 'body'})
    )
