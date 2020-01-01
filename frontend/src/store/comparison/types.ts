import { List } from 'immutable';


export interface Progress {
    self: number
    counterpart: number
}

interface Compare {
    progress: Progress
    names: List<string>
}

export interface CompareState extends Compare {
    initializing: boolean
}

interface ErrorType {
    error: string
}



export enum ActionTypes {
    GET_COMPARISON_DONE = 'GET_COMPARISON_DONE',
    ERROR = 'ERROR',
    LOADING_COMPARISON = 'LOADING_COMPARISON',
}



interface GetComparisonStarted {
    type: typeof ActionTypes.LOADING_COMPARISON
}
interface GetComparisonDone {
    type: typeof ActionTypes.GET_COMPARISON_DONE
    payload: Compare
}

interface Error {
    type: typeof ActionTypes.ERROR
    payload: ErrorType
}

export type ComparsionActionTypes = GetComparisonDone | GetComparisonStarted | Error;
