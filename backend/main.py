import argparse

from server.router import serve

VERSION = "1.0.0"


def handler(event, context):
    return serve(
        path=event.get('path', '').lstrip('/'),
        method=event.get('httpMethod', '').lower(),
        body=event.get('body'),
    )


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('http_method')
    parser.add_argument('path')
    parser.add_argument('body', default='', nargs='?')
    args = parser.parse_args()
    print(
        handler(
            {
                'path': args.path,
                'httpMethod': args.http_method,
                'body': args.body,
            },
            None,
        )
    )
