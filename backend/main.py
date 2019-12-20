import json


def handler(event, context):
    responseMsg = {
        'statusCode': '200',
        'body': json.dumps(event),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }
    return responseMsg
