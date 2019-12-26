import {
    NameState,
    GET_NAMES_STARTED,
    GET_NAMES_DONE,
    NameActionTypes,
} from './types';


const initialState: NameState = {
  remaining: [],
  selected: [],
  rejected: [],
  initializing: true,
  error: false,
}

export default function nameReducer(
  state = initialState,
  action: NameActionTypes
): NameState {
  switch (action.type) {
    case GET_NAMES_STARTED:
        return {
            ...state,
            initializing: true,
        }
    case GET_NAMES_DONE:
        return {
            initializing: false,
            error: false,
            ...action.payload
        }
    default:
      return state
  }
}