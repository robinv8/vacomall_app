/**
 * Created by ren on 16/8/13.
 */
'use strict';

import {applyMiddleware, createStore,compose} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';
const logger = store => next => action => {
    if(typeof action === 'function') console.log('dispatching a function');
    else console.log('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    return result;
}

let middlewares = [
    logger,
    thunk
];
const enhancer=compose(applyMiddleware(...middlewares))

export default function configureStore(initialState){
    const store = createStore(reducers,initialState,enhancer);

    return store;
}