/**
 * Created by renyubin on 16/4/24.
 */
//var API_ADDRESS ='http://api.m.vacomall.com/';//'http://api.m.vacomall.com/';//'http://10.8.8.106:8099/';
var API_ADDRESS ='http://testapivacomall.bceapp.com/'; //'http://api.m.vacomall.com/';
var API_ADDRESS1 = 'http://polarbear.duapp.com/';
var API_ADDRESS2 = 'http://wxpay.weixin.qq.com/';
var DEBUG = true;
var API = {
    LOGIN: API_ADDRESS + 'auth/login',
    HOME: API_ADDRESS + 'group/get',
    GUESS: API_ADDRESS + 'index/guess',
    LIST: API_ADDRESS + 'goods/list',
    CATE: API_ADDRESS + 'cat/get',
    SEARCH: API_ADDRESS + 'search',
    DETAIL: API_ADDRESS + 'goods/detail',
    GETCART: API_ADDRESS + 'cart/get',
    ADDCART: API_ADDRESS + 'cart/add',
    DELETECART: API_ADDRESS + 'cart/delete',
    LOGINSTATE: API_ADDRESS + 'auth/session',
    CONFIRM: API_ADDRESS + 'order/confirm',
    SUBMIT: API_ADDRESS + 'order/submit',
    HASSTORE: API_ADDRESS + 'cart/hasStore',
    LOGOUT: API_ADDRESS + 'auth/logout',
    ORDER: API_ADDRESS + 'wx/preorder',
    GETPAYINFO: API_ADDRESS + 'wx/getpayinfo',
    SUBMITCZ: API_ADDRESS + 'order/submitcz',
    ORDERNUM: API_ADDRESS + 'me/order/get/num',
    ORDERDETAIL: API_ADDRESS + 'me/order/get',
    CANCELORDER: API_ADDRESS + 'me/order/cancel',
    ORDERCONFIRM: API_ADDRESS + 'me/order/confirm',
    ORDERDETAILINFO: API_ADDRESS + 'me/order/detail',
    ORDEREXPRESS: API_ADDRESS + 'me/order/express',
    RETURNSKULIST: API_ADDRESS + 'me/returnsku/list',
    SUBMITRETURNSKU: API_ADDRESS + 'me/returnsku/submit',
    CANCELRETURNSKU: API_ADDRESS + 'me/returnsku/cancel',
    DELETERETURNSKU:API_ADDRESS +'me/returnsku/delete',
    CONFIRMRETURNSKU:API_ADDRESS+'me/returnsku/confirm',
    PERSONINFO: API_ADDRESS + 'me',
    UPDATEVERSION:API_ADDRESS+'ver/get/new'
};

module.exports = API;