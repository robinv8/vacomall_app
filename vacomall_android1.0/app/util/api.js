/**
 * Created by renyubin on 16/4/24.
 */
var API_ADDRESS ='http://api.m.vacomall.com/';//'http://api.m.vacomall.com/';//'http://10.8.8.106:8099/';

var DEBUG = true;
var API = {
    LOGIN:API_ADDRESS+'auth/login',
    HOME:API_ADDRESS+'data/get',
    LIST:API_ADDRESS+'goods/list',
    SEARCH:API_ADDRESS+'search',
    DETAIL:API_ADDRESS+'goods/detail',
    GETCART:API_ADDRESS+'cart/get',
    ADDCART:API_ADDRESS+'cart/add',
    DELETECART:API_ADDRESS+'cart/delete',
    LOGINSTATE:API_ADDRESS+'auth/session',
    CONFIRM:API_ADDRESS+'order/confirm',
    SUBMIT:API_ADDRESS+'order/submit',
    HASSTORE:API_ADDRESS+'cart/hasStore',
    LOGOUT:API_ADDRESS+'auth/logout'
};

module.exports = API;