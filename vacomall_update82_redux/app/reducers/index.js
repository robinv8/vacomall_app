/**
 * Created by ren on 16/8/12.
 */
import {combineReducers} from 'redux';
import userReducer from './user';
import routeReducor from './route';
import {cateOper} from './cart';
export default combineReducers({
    userStore:userReducer,
    routeStore:routeReducor,
    cartStore:cateOper
})