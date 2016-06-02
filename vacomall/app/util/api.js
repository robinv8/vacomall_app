/**
 * Created by renyubin on 16/4/24.
 */
//var API_ADDRESS ='http://api.m.vacomall.com/';//'http://api.m.vacomall.com/';//'http://10.8.8.106:8099/';
var API_ADDRESS='http://10.8.8.106:8099/'//'http://test.api.m.vacomall.com/';

var DEBUG = true;
var API = {
    LOGIN:API_ADDRESS+'auth/login',
    HOME:API_ADDRESS+'group/get',
    GUESS:API_ADDRESS+'index/guess',
    LIST:API_ADDRESS+'goods/list',
    CATE:API_ADDRESS+'group/get',
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