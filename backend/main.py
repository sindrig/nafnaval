from server.router import serve


def handler(event, context):
    return server(path=event, method=event, body=event)
    return serve(
        path=event.get('path', '').lstrip('/'),
        method=event.get('httpMethod', '').lower(),
        body=event.get('body'),
    )
