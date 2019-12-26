import { Dispatch } from 'redux';
import { GET_NAMES_STARTED, GET_NAMES_DONE, NameActionTypes } from './types';
import { getNameState, createState } from '../../api';


export function getNames(id: string): (dispatch: Dispatch<NameActionTypes>) => Promise<void> {
    return async (dispatch: Dispatch<NameActionTypes>) => {
        dispatch({type: GET_NAMES_STARTED});

        try {
            const payload = await getNameState(id);
            dispatch({
                type: GET_NAMES_DONE,
                payload: {
                    remaining: payload.Remaining,
                    rejected: payload.Rejected || [],
                    selected: payload.Selected || []
               }
            });
        } catch (e) {
            console.error(e);
        }
    }
}

export function signUp(email1: string, email2: string, sex: string): (dispatch: Dispatch<NameActionTypes>) => Promise<void> {
    return async (dispatch: Dispatch<NameActionTypes>) => {
        dispatch({type: GET_NAMES_STARTED});

        try {
            const payload = await createState(email1, email2, sex);
            window.location.href = payload.Location;
        } catch (e) {
            console.error(e);
        }
    }
}