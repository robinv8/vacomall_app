/**
 * Created by ren on 16/8/18.
 */
'use strict';
import {Types} from '../pages/util/Path';

export function CateEdit() {
    return {
        type: Types.CATE_EDIT,
    }
}

export function CateSubmit() {
    return {
        type: Types.CATE_SUBMIT
    }
}