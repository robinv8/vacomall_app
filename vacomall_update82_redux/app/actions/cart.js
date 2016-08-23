/**
 * Created by ren on 16/8/18.
 */
'use strict';
import {Types} from '../pages/util/Path';
/**
 *
 * @returns {{type}}
 * @constructor
 * @description 编辑购物车
 */
export function CateEdit() {
    return {
        type: Types.CATE_EDIT,
    }
}
/**
 *
 * @returns {{type}}
 * @constructor
 * @description 完成编辑
 */
export function CateSubmit() {
    return {
        type: Types.CATE_SUBMIT
    }
}
