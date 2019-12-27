import { Dispatch } from 'redux';
import { GET_NAMES_STARTED, GET_NAMES_DONE, NAME_SELECTED, NameActionTypes, Selection, NameSelection } from './types';
import { getNameState, createState, selectNames } from '../../api';
import { fromJS, List } from 'immutable';


export function getNames(id: string): (dispatch: Dispatch<NameActionTypes>) => Promise<void> {
    return async (dispatch: Dispatch<NameActionTypes>) => {
        dispatch({type: GET_NAMES_STARTED});

        try {
            const payload = await getNameState(id);
            dispatch({
                type: GET_NAMES_DONE,
                payload: {
                    remaining: fromJS(payload.Remaining),
                    rejected: fromJS(payload.Rejected || []),
                    selected: fromJS(payload.Selected || []),
                    stateId: payload.StateId,
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

function nameSelection(name: string, selection: Selection): (dispatch: Dispatch<NameActionTypes>) => void {
    return (dispatch: Dispatch<NameActionTypes>) => {
        dispatch({
            type: NAME_SELECTED,
            payload: {
                name,
                selection,
            }
        })
    }
}

export function rejectName(name: string): (dispatch: Dispatch<NameActionTypes>) => void {
    return nameSelection(name, Selection.reject);
}

export function selectName(name: string): (dispatch: Dispatch<NameActionTypes>) => void {
    return nameSelection(name, Selection.select);
}

export function saveSelections(id: string, selections: List<NameSelection>): (dispatch: Dispatch<NameActionTypes>) => Promise<void> {
    return async(dispatch: Dispatch<NameActionTypes>) => {
        dispatch({type: GET_NAMES_STARTED});
        const select = selections
            .filter(({ selection }) => selection === Selection.select)
            .map(({ name }) => name)
            .toJS();
        const reject = selections
            .filter(({ selection }) => selection === Selection.reject)
            .map(({ name }) => name)
            .toJS();
        const payload = await selectNames(id, select, reject);
    }
}