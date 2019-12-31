import { NameState, ActionTypes, NameActionTypes, Bucket, NameMovement } from './types';
import { List } from 'immutable';


const initialState: NameState = {
  remaining: List<string>(),
  selected: List<string>(),
  rejected: List<string>(),
  movements: List<NameMovement>(),
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
    case ActionTypes.LOADING:
        return {
            ...state,
            initializing: true,
        }
    case ActionTypes.GET_NAMES_DONE:
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
    case ActionTypes.NAME_SELECTED:
      const { payload: { name, from, to } } = action;
      const newStateNameSelected = {
        ...state,
        movements: state.movements.push({ name, from, to }),
      }
      switch (from) {
        case Bucket.Selected:
          newStateNameSelected.selected = newStateNameSelected.selected.filter(n => n !== name);
          break;
        case Bucket.Rejected:
          newStateNameSelected.rejected = newStateNameSelected.rejected.filter(n => n !== name);
          break;
        case Bucket.Remaining:
          newStateNameSelected.remaining = newStateNameSelected.remaining.filter(n => n !== name);
          break;
        default:
          throw new Error(`Unknown from bucket ${from}`)
      }
      newStateNameSelected.progress = getProgress(newStateNameSelected);
      return newStateNameSelected;
    case ActionTypes.SIGNUP_DONE:
      return {
        ...state,
        stateId: action.payload.stateId,
      }
    case ActionTypes.ERROR:
      return {
        ...state,
        initializing: false,
        error: action.payload.error,
      }
    default:
      return state
  }
}