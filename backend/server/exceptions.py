class HttpError(RuntimeError):
    status_code = 500

    def __init__(self, error):
        super().__init__()
        self.error = error

    def data(self):
        return {
            'error': self.error,
        }


class NotFound(HttpError):
    status_code = 404


class BadInput(HttpError):
    status_code = 400


class MethodNotAllowed(HttpError):
    status_code = 405
