/**
 * Created by ren on 16/8/12.
 */
import {combineReducers} from 'redux';
import userReducer from './user';

export default combineReducers({
    userStore:userReducer
})