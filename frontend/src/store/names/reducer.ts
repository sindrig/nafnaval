import {
    NameState,
    LOADING,
    GET_NAMES_DONE,
    NAME_SELECTED,
    ERROR,
    SIGNUP_DONE,
    NameActionTypes,
} from './types';
import { List } from 'immutable';


const initialState: NameState = {
  remaining: List(),
  selected: List(),
  rejected: List(),
  movements: List(),
  progress: 0,
  initializing: false,
  error: null,
}

const getProgress = (state: NameState) => {
    const totalNames = (
      state.remaining.size +
      state.selected.size +
      state.rejected.size +
      state.movements.size
    );
    return (totalNames - state.remaining.size) / totalNames;
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
        const newStateGetNames = {
            ...state,
            initializing: false,
            error: null,
            // Maybe not? Maybe state?
            movements: List(),
            ...action.payload
        }
        newStateGetNames.progress = getProgress(newStateGetNames);
        return newStateGetNames;
    case NAME_SELECTED:
      const newStateNameSelected = {
        ...state,
        remaining: state.remaining.filter(name => name !== action.payload.name),
        movements: state.movements.push(action.payload),
      }
      newStateNameSelected.progress = getProgress(newStateNameSelected);
      return newStateNameSelected;
    case SIGNUP_DONE:
      return {
        ...state,
        stateId: action.payload.stateId,
      }
    case ERROR:
      return {
        ...state,
        initializing: false,
        error: action.payload.error,
      }
    default:
      return state
  }
}