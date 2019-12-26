export interface Name {
    text: string
    id: string
    selected: boolean
}

export interface NameState {
    names: Name[],
    remaining: string,
    selected: string,
    rejected: string,
    initializing: boolean,
    error: boolean,
}

export const GET_NAMES = 'GET_NAMES';
export const GET_NAMES_STARTED = 'GET_NAMES_STARTED';
export const GET_NAMES_DONE = 'GET_NAMES_DONE';

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
    payload: Name[]
}

export type NameActionTypes = GetNamesAction | GetNamesStarted | GetNamesDone
