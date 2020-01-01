import { Dispatch } from 'redux';
import { ActionTypes, ComparsionActionTypes } from './types';
import { getComparison, ComparisonResponse, ErrorResponse } from '../../api';
import { fromJS } from 'immutable';


export function getComparisonList(id: string): (dispatch: Dispatch<ComparsionActionTypes>) => Promise<void> {
    return async (dispatch: Dispatch<ComparsionActionTypes>) => {
        dispatch({type: ActionTypes.LOADING_COMPARISON});

        const payload = await getComparison(id);
        if ((payload as ErrorResponse).error) {
            dispatch({
                type: ActionTypes.ERROR,
                payload: { error: (payload as ErrorResponse).error }
            })
        } else {
            const { names, progress } = (payload as ComparisonResponse);
            dispatch({
                type: ActionTypes.GET_COMPARISON_DONE,
                payload: { names: fromJS(names), progress},
            })
        }
    }
}