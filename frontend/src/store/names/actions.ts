import { Dispatch } from 'redux';
import { ActionTypes, NameActionTypes, Bucket, NameMovement } from './types';
import { getNameState, createState, saveMovements, NamesResponse, ErrorResponse, CreateStateResponse } from '../../api';
import { fromJS, List } from 'immutable';


export function getNames(id: string): (dispatch: Dispatch<NameActionTypes>) => Promise<void> {
    return async (dispatch: Dispatch<NameActionTypes>) => {
        dispatch({type: ActionTypes.LOADING});

        const payload = await getNameState(id);
        dispatch(receiveNames(payload));
    }
}

export function signUp(email1: string, email2: string, gender: string): (dispatch: Dispatch<NameActionTypes>) => Promise<void> {
    return async (dispatch: Dispatch<NameActionTypes>) => {
        dispatch({type: ActionTypes.LOADING});

        const payload = await createState(email1, email2, gender);
        if ((payload as ErrorResponse).error) {
            dispatch(receiveError(payload as ErrorResponse))
        } else {
            const {stateId} = (payload as CreateStateResponse);
            dispatch({
                type: ActionTypes.SIGNUP_DONE,
                payload: {stateId},
            })
        }
    }
}

export function moveName(name: string, from: Bucket, to: Bucket): (dispatch: Dispatch<NameActionTypes>) => void {
    return (dispatch: Dispatch<NameActionTypes>) => {
        dispatch({
            type: ActionTypes.NAME_SELECTED,
            payload: { name, from, to }
        })
    };
}

// TODO: Use saveMomements in api instead
export function savemovements(id: string, movements: List<NameMovement>): (dispatch: Dispatch<NameActionTypes>) => Promise<void> {
    return async(dispatch: Dispatch<NameActionTypes>) => {
        dispatch({type: ActionTypes.LOADING});
        const payload = await saveMovements(id, movements.toJS())
        // TODO: Re-use with getNames above
        dispatch(receiveNames(payload));
    }
}

function receiveNames(payload: NamesResponse | ErrorResponse): NameActionTypes {
    if ((payload as ErrorResponse).error) {
        const { error } = (payload as ErrorResponse);
        return {
            type: ActionTypes.ERROR,
            payload: { error }
        }
    }
    const { Remaining, Rejected, Selected } = (payload as NamesResponse);
    return {
        type: ActionTypes.GET_NAMES_DONE,
        payload: {
            remaining: fromJS(Remaining),
            rejected: fromJS(Rejected || []),
            selected: fromJS(Selected || []),
            movements: List(),
       }
    };
}

function receiveError({ error }: ErrorResponse): NameActionTypes {
    return {
        type: ActionTypes.ERROR,
        payload: { error }
    };
}