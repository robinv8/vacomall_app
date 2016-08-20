/**
 * Created by ren on 16/8/15.
 */
'use strict';
import {Types} from '../pages/util/Path';

const initialState = {
    id: null,
    text:null
};

export default function navigator(state = initialState, action) {
    switch (action.type) {
        case Types.TO_NEXT_TYPE10:
            return {
                ...state,
                id: action.opt.id,
            }
        case Types.TO_NEXT_TYPE20:
            return {
                ...state,
                id: action.opt.id
            }
        case Types.TO_NEXT_TYPE30:
            return {
                ...state,
                text: action.opt.id,
                id: null
            }
        default:
            return state;
    }
}