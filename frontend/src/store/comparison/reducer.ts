import { ActionTypes, CompareState, ComparsionActionTypes } from './types';
import { List } from 'immutable';


const initialState: CompareState = {
  names: List<string>(),
  progress: {self: 0, counterpart: 0},
  // TODO: Get initializing/loading to a common reducer
  initializing: false,
}

export default function compareReducer(
  state = initialState,
  action: ComparsionActionTypes
): CompareState {
  switch (action.type) {
    case ActionTypes.LOADING_COMPARISON:
        return {
            ...state,
            initializing: true,
        }
    case ActionTypes.GET_COMPARISON_DONE:
        return {
          ...action.payload,
          initializing: false,
        }
    default:
      return state
  }
}