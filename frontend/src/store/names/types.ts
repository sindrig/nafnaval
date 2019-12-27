import { List } from 'immutable';

export enum Selection {
    reject,
    select
}

export interface NameSelection {
    name: string
    selection: Selection
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
}



export const GET_NAMES = 'GET_NAMES';
export const GET_NAMES_STARTED = 'GET_NAMES_STARTED';
export const GET_NAMES_DONE = 'GET_NAMES_DONE';
export const NAME_SELECTED = 'NAME_SELECTED';

interface GetNamesAction {
    type: typeof GET_NAMES
    meta: {
        id: string
    }
}

interface GetNamesStarted {
    type: typeof GET_NAMES_STARTED
}

interface GetNamesDone {
    type: typeof GET_NAMES_DONE
    payload: Names
}

interface NameSelected {
    type: typeof NAME_SELECTED,
    payload: NameSelection
}

export type NameActionTypes = GetNamesAction | GetNamesStarted | GetNamesDone | NameSelected
