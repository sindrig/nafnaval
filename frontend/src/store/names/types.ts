import { List } from 'immutable';

export enum Selection {
    reject,
    select
}

export interface NameSelection {
    name: string
    selection: Selection
}

interface StateId {
    stateId: string
}

interface Names {
    remaining: List<string>,
    selected: List<string>,
    rejected: List<string>,
    stateId?: string
}

export interface NameState extends Names {
    initializing: boolean
    error: boolean
    // Local name selections
    selections: List<NameSelection>
    progress: number
}



export const GET_NAMES = 'GET_NAMES';
export const LOADING = 'LOADING';
export const GET_NAMES_DONE = 'GET_NAMES_DONE';
export const SIGNUP_DONE = 'SIGNUP_DONE';
export const NAME_SELECTED = 'NAME_SELECTED';

interface GetNamesAction {
    type: typeof GET_NAMES
    meta: {
        id: string
    }
}

interface GetNamesStarted {
    type: typeof LOADING
}

interface GetNamesDone {
    type: typeof GET_NAMES_DONE
    payload: Names
}

interface SignupDone {
    type: typeof SIGNUP_DONE
    payload: StateId
}

interface NameSelected {
    type: typeof NAME_SELECTED,
    payload: NameSelection
}

export type NameActionTypes = (
    GetNamesAction | GetNamesStarted | GetNamesDone | NameSelected | SignupDone
)
