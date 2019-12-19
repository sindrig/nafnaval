import { Dispatch } from 'redux';
import { GET_NAMES_STARTED, GET_NAMES_DONE, NameActionTypes } from './types';
import { getNameState } from '../../api';


export function getNames(id: string): (dispatch: Dispatch<NameActionTypes>) => Promise<void> {
    return async (dispatch: Dispatch<NameActionTypes>) => {
        dispatch({type: GET_NAMES_STARTED});

        try {
            const payload = await getNameState(id);
            dispatch({type: GET_NAMES_DONE, payload: payload.names})
        } catch (e) {
            console.error(e);
        }
    }
}