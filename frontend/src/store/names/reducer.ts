import {
    NameState,
    LOADING,
    GET_NAMES_DONE,
    NAME_SELECTED,
    SIGNUP_DONE,
    NameActionTypes,
} from './types';
import { List } from 'immutable';


const initialState: NameState = {
  remaining: List(),
  selected: List(),
  rejected: List(),
  selections: List(),
  initializing: false,
  error: false,
}

export default function nameReducer(
  state = initialState,
  action: NameActionTypes
): NameState {
  switch (action.type) {
    case LOADING:
        return {
            ...state,
            initializing: true,
        }
    case GET_NAMES_DONE:
        return {
            ...state,
            initializing: false,
            error: false,
            // Maybe not? Maybe state?
            selections: List(),
            ...action.payload
        }
    case NAME_SELECTED:
      return {
        ...state,
        remaining: state.remaining.filter(name => name !== action.payload.name),
        selections: state.selections.push(action.payload),
      }
    case SIGNUP_DONE:
      return {
        ...state,
        stateId: action.payload.stateId,
      }
    default:
      return state
  }
}