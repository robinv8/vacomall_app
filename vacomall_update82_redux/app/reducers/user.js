/**
 * Created by ren on 16/8/12.
 */
import * as Types from '../actions/types';

const initialState = {
    uname: null,
    status: 'out'
};

export default function user(state = initialState, action) {
    switch (action.type) {
        case Types.LOGGED_DOING:
            return {
                ...state,
                status: 'doing',
            }
        case Types.LOGGED_IN:
            return{
                ...state,
                status:'in',
                uname:action.uname
            }
        case Types.LOGGED_OUT:
            return{
                ...state,
                status:'out'
            }
        default:
            return state;
    }
}