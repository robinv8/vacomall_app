/**
 * Created by ren on 16/8/12.
 */
'use strict';

import * as TYPES from './types';
import {NetService,API} from '../pages/util/Path';
import {AsyncStorage} from 'react-native';
// login
export function logIn(uname,pwd){
    return (dispatch) => {
        dispatch({'type': TYPES.LOGGED_DOING});
        NetService.postFetchData(API.LOGIN, 'uname=' + uname + '&pwd=' + pwd, (result)=>{
            if (result['success'] === false) {
                dispatch({'type': TYPES.LOGGED_ERROR,e:result['result']['message']});
                return;
            }
            _saveValue_One(uname, pwd);
            dispatch({'type': TYPES.LOGGED_IN,uname:uname});
        });
        //进行储存数据_ONE
    }
}
async function _saveValue_One(uname, pwd) {
    await AsyncStorage.setItem('uname', uname);
    await AsyncStorage.setItem('pwd', pwd);
}

// logout
export function logOut(){
    return {
        'type': TYPES.LOGGED_OUT
    }
}