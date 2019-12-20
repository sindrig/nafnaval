from server.responses import response


class StateHandler:
    def get(self, request):
        return response({'path': request.path})

    def post(self, request):
        return response({'body': request.body})
