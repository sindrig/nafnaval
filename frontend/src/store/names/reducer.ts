import {
  NameState,
  ActionTypes,
  NameActionTypes,
  Bucket,
  NameMovement,
} from './types'
import { List } from 'immutable'

enum StateBucketKeys {
  remaining = 'remaining',
  selected = 'selected',
  rejected = 'rejected',
}

const initialState: NameState = {
  [StateBucketKeys.remaining]: List<string>(),
  [StateBucketKeys.selected]: List<string>(),
  [StateBucketKeys.rejected]: List<string>(),
  movements: List<NameMovement>(),
  progress: 0,
  initializing: false,
  error: null,
}

const getProgress = (state: NameState): number => {
  const totalNames =
    state.remaining.size +
    state.selected.size +
    state.rejected.size +
    state.movements.size
  return (totalNames - state.remaining.size) / totalNames
}

const updateProgress = (state: NameState): NameState => {
  return { ...state, progress: getProgress(state) }
}

const getStateKey = (bucket: Bucket): StateBucketKeys => {
  if (bucket === Bucket.Rejected) {
    return StateBucketKeys.rejected
  }
  if (bucket === Bucket.Selected) {
    return StateBucketKeys.selected
  }
  if (bucket === Bucket.Remaining) {
    return StateBucketKeys.remaining
  }
  throw new Error(`Unknown bucket ${bucket}`)
}

export default function nameReducer(
  state = initialState,
  action: NameActionTypes,
): NameState {
  switch (action.type) {
    case ActionTypes.LOADING_NAMES:
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
        ...action.payload,
      }
      newStateGetNames.progress = getProgress(newStateGetNames)
      const firstNameInCurrentState = state.remaining.get(0)
      if (
        firstNameInCurrentState &&
        action.payload.remaining.contains(firstNameInCurrentState)
      ) {
        const index = action.payload.remaining.indexOf(firstNameInCurrentState)
        newStateGetNames.remaining = newStateGetNames.remaining
          .delete(index)
          .insert(0, firstNameInCurrentState)
      }
      return newStateGetNames
    case ActionTypes.NAME_SELECTED:
      const {
        payload: { name, from, to },
      } = action
      const selectedStateKey = getStateKey(from)
      return updateProgress({
        ...state,
        movements: state.movements.push({ name, from, to }),
        [selectedStateKey]: state[selectedStateKey].filter((n) => n !== name),
      })
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
    case ActionTypes.UNDO_MOVEMENT:
      const movement = state.movements.find(
        ({ name }) => name === action.payload.name,
      )
      if (!movement) {
        return state
      }
      const undoStateKey = getStateKey(movement.from)
      return updateProgress({
        ...state,
        movements: state.movements.filterNot(
          ({ name }) => name === action.payload.name,
        ),
        [undoStateKey]: state[undoStateKey].insert(0, movement.name),
      })
    default:
      return state
  }
}
