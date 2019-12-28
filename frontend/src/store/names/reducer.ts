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
  progress: 0,
  initializing: false,
  error: false,
}

const getProgress = (state: NameState) => {
    const totalNames = (
      state.remaining.size +
      state.selected.size +
      state.rejected.size +
      state.selections.size
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
            error: false,
            // Maybe not? Maybe state?
            selections: List(),
            ...action.payload
        }
        newStateGetNames.progress = getProgress(newStateGetNames);
        return newStateGetNames;
    case NAME_SELECTED:
      const newStateNameSelected = {
        ...state,
        remaining: state.remaining.filter(name => name !== action.payload.name),
        selections: state.selections.push(action.payload),
      }
      newStateNameSelected.progress = getProgress(newStateNameSelected);
      return newStateNameSelected;
    case SIGNUP_DONE:
      return {
        ...state,
        stateId: action.payload.stateId,
      }
    default:
      return state
  }
}