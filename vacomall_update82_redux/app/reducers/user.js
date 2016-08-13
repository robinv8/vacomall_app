/**
 * Created by ren on 16/8/12.
 */
import * as Types from '../actions/types';

const initialState = {
    isLoggedIn: false,
    user: {},
    state: null
};

export default function user(state = initialState, action) {
    switch (action.type) {
        case Types.LOGGED_DOING:
            return {
                ...state,
                status: 'doing'
            }
        default:
            return state;
    }
}