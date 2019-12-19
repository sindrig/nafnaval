import { combineReducers } from 'redux';

import names from './names/reducer';
import { NameState } from './names/types';

export interface IStoreState {
    readonly names: NameState
}

export default combineReducers({
    names,
});
