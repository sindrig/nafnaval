import { combineReducers } from 'redux'

import names from './names/reducer'
import comparison from './comparison/reducer'
import { NameState } from './names/types'
import { CompareState } from './comparison/types'

export interface IStoreState {
  readonly names: NameState
  readonly comparison: CompareState
}

export default combineReducers({
  names,
  comparison,
})
