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

interface UndoNamePayload {
    name: string
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



export enum ActionTypes {
    GET_NAMES = 'GET_NAMES',
    ERROR = 'ERROR',
    LOADING = 'LOADING',
    GET_NAMES_DONE = 'GET_NAMES_DONE',
    SIGNUP_DONE = 'SIGNUP_DONE',
    NAME_SELECTED = 'NAME_SELECTED',
    UNDO_MOVEMENT = 'UNDO_MOVEMENT',
}

interface GetNamesAction {
    type: typeof ActionTypes.GET_NAMES
    meta: {
        id: string
    }
}

interface GetNamesStarted {
    type: typeof ActionTypes.LOADING
}

interface Error {
    type: typeof ActionTypes.ERROR
    payload: ErrorType
}

interface GetNamesDone {
    type: typeof ActionTypes.GET_NAMES_DONE
    payload: Names
}

interface SignupDone {
    type: typeof ActionTypes.SIGNUP_DONE
    payload: StateId
}

interface NameSelected {
    type: typeof ActionTypes.NAME_SELECTED
    payload: NameMovement
}

interface UndoMovements {
    type: typeof ActionTypes.UNDO_MOVEMENT
    payload: UndoNamePayload
}

export type NameActionTypes = (
    GetNamesAction | GetNamesStarted | GetNamesDone | NameSelected | SignupDone | Error | UndoMovements
)
