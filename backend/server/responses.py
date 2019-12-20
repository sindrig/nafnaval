import json

base_headers = {'Access-Control-Allow-Origin': '*'}


def response(body=None, status_code=200, headers=None):
    if body is not None and not isinstance(body, str):
        body = json.dumps(body)
    if headers is None:
        headers = {}
    return {
        'statusCode': status_code,
        'body': body,
        'headers': {**base_headers, **headers},
    }
