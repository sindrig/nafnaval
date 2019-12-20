import json
from urllib.parse import urlparse, parse_qs
from server.responses import response
from server.exceptions import NotFound, BadInput, HttpError, MethodNotAllowed

from server.handlers import StateHandler
from server.request import Request


def get_handler(key):
    return {'state': StateHandler}.get(key, None)


def serve(path, method, body=None):
    return response(path)
    try:
        try:
            handler_key, rest = path.split('/', 1)
        except ValueError:
            raise NotFound(f'Could not parse handler key and rest from {path}')
        target_handler = get_handler(handler_key)
        if target_handler is None:
            raise NotFound(f'Could not find handler key "{handler_key}"')
        if not hasattr(target_handler, method):
            raise MethodNotAllowed(
                f'Could not find "{method}" handler '
                f'for "{handler_key}" handler',
            )
        if body:
            try:
                body = json.loads(body)
            except ValueError:
                raise BadInput('Could not decode body')
        parts = urlparse(rest)
        return getattr(target_handler(), method)(
            Request(path=parts.path, query=parse_qs(parts.query), body=body)
        )
    except HttpError as e:
        return response(e.data(), status_code=e.status_code)
