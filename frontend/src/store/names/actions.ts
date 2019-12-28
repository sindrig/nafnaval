import { Dispatch } from 'redux';
import { LOADING, GET_NAMES_DONE, NAME_SELECTED, SIGNUP_DONE, NameActionTypes, Selection, NameSelection } from './types';
import { getNameState, createState, selectNames } from '../../api';
import { fromJS, List } from 'immutable';


export function getNames(id: string): (dispatch: Dispatch<NameActionTypes>) => Promise<void> {
    return async (dispatch: Dispatch<NameActionTypes>) => {
        dispatch({type: LOADING});

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
    }
}

export function signUp(email1: string, email2: string, gender: string): (dispatch: Dispatch<NameActionTypes>) => Promise<void> {
    return async (dispatch: Dispatch<NameActionTypes>) => {
        dispatch({type: LOADING});

        const { stateId } = await createState(email1, email2, gender);
        dispatch({
            type: SIGNUP_DONE,
            payload: {stateId},
        })
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
        dispatch({type: LOADING});
        const select = selections
            .filter(({ selection }) => selection === Selection.select)
            .map(({ name }) => name)
            .toJS();
        const reject = selections
            .filter(({ selection }) => selection === Selection.reject)
            .map(({ name }) => name)
            .toJS();
        const payload = await selectNames(id, select, reject);
        // TODO: Re-use with getNames above
        dispatch({
            type: GET_NAMES_DONE,
            payload: {
                remaining: fromJS(payload.Remaining),
                rejected: fromJS(payload.Rejected || []),
                selected: fromJS(payload.Selected || []),
                selections: List(),
           }
        });
    }
}