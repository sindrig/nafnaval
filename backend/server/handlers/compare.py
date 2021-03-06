from server.handlers.base import BaseHandler
from server.responses import response


class CompareHandler(BaseHandler):
    def get(self, request):
        state_id = self.get_state_id(request)
        state1 = self.get_state(state_id)
        state2 = self.get_state(state1['Counterpart'])
        common = state1['Selected'].intersection(state2['Selected'])

        return response(
            {
                'names': list(common - self.BLANK_SET),
                'progress': {
                    'self': self._get_progress(state1),
                    'counterpart': self._get_progress(state2),
                },
            }
        )

    def _get_progress(self, state):
        remaining = state['Remaining'] - self.BLANK_SET
        total = (
            len(state['Selected'] - self.BLANK_SET)
            + len(state['Rejected'] - self.BLANK_SET)
            + len(remaining)
        )
        return (total - len(remaining)) / total
