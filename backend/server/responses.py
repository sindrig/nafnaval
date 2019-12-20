import json


def response(body, status_code=200):
    if not isinstance(body, str):
        body = json.dumps(body)
    return {
        'statusCode': status_code,
        'body': body,
        'headers': {'Access-Control-Allow-Origin': '*'},
    }
