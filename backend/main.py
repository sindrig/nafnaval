def handler(event, context):
    responseMsg = {
        'statusCode': '200',
        'body': 'Hello world',
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }
    return responseMsg
