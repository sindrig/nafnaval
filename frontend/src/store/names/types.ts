import { List } from 'immutable';

export enum Bucket {
    Rejected = 'Rejected',
    Selected = 'Selected',
    Remaining = 'Remaining'
}

export interface NameMovement {
    name: string
    from: Bucket
    to: Bucket
}

interface StateId {
    stateId: string
}

interface Names {
    remaining: List<string>
    selected: List<string>
    rejected: List<string>
    stateId?: string
    movements: List<NameMovement>
}

export interface NameState extends Names {
    initializing: boolean
    error: string | null
    // Local name movements
    progress: number
}

interface ErrorType {
    error: string
}



export const GET_NAMES = 'GET_NAMES';
export const ERROR = 'ERROR';
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

interface Error {
    type: typeof ERROR
    payload: ErrorType
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
    payload: NameMovement
}

export type NameActionTypes = (
    GetNamesAction | GetNamesStarted | GetNamesDone | NameSelected | SignupDone | Error
)
