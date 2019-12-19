import {
    NameState,
    GET_NAMES,
    GET_NAMES_DONE,
    NameActionTypes,
} from './types';


const initialState: NameState = {
  names: [],
  initializing: true,
  error: false,
}

export default function nameReducer(
  state = initialState,
  action: NameActionTypes
): NameState {
  switch (action.type) {
    case GET_NAMES:
        return {
            ...state,
            initializing: true,
        }
    case GET_NAMES_DONE:
        return {
            initializing: false,
            error: false,
            names: action.payload,
        }
    default:
      return state
  }
}