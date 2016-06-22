/**
 * Created by renyubin on 16/6/18.
 */
import React,{
    Component,
    View, Text, StyleSheet, ScrollView,
    AlertIOS, TouchableHighlight,
    NativeAppEventEmitter
}from 'react-native';

import WeChat from 'react-native-wechat-ios';
import Toast from 'react-native-root-toast';
let scope = 'snsapi_userinfo';
let state = 'wechat_sdk_test';
import API from '../util/api';
import * as Random from '../util/random';
import * as NetService from '../util/NetService';
import MD5 from '../util/md5.min';
const appid = 'wx0ccd9f577013dab0';

function show(title, msg) {
    AlertIOS.alert(title + '', msg + '');
}
export function registerApp() {
    WeChat.registerApp(appid, (res) => {
        //show('registerApp',res)
    });
}
export function openWXApp(i) {
    WeChat.openWXApp((res) => {
        show('openWXApp', i);
    });
}
export function order(id) {
    /!*获取首页基本数据*!/
    NetService.postFetchData(API.ORDER, 'orderId='+id, (result)=>_callback(result));
    function _callback(result) {
        var result = result['result']['response'];
        const random = Random.generateMixed(16);
        const timeStamp = parseInt(new Date().getTime() / 1000 - 30);
        var stringA = "appid=" + result['appid'] + "&noncestr=" + random + "&package=Sign=WXPay&partnerid=" + result['mch_id'] + "&prepayid=" + result['prepay_id'] + "&timestamp=" + timeStamp;
        console.log(stringA)
        stringSignTemp = stringA + "&key=e10884523bd29da9edbf941cb15eef5d";
        console.log(stringSignTemp);
        var sign = MD5(stringSignTemp).toUpperCase()
        let payOptions = {
            appId: result['appid'],
            nonceStr: random,
            partnerId: result['mch_id'],
            packageValue: 'Sign=WXPay',
            prepayId: result['prepay_id'],
            timeStamp: timeStamp.toString(),
            sign: sign
        };
        WeChat.weChatPay(payOptions, (res)=> {
            //show('支付', res);
        });
        let subscription = NativeAppEventEmitter.addListener(
            'finishedPay',
            (res) => {
                if(res.errCode == 0) { //充值成功
                    getpayinfo(id);
                } else if(res.errCode == -1) { //很多情况下是证书问题
                    show('支付结果','支付失败,请稍后尝试');
                } else if(res.errCode == -2) { //充值取消
                    //show('支付结果',"充值取消");
                }
            }
        );
    }
}
function getpayinfo(id){
    NetService.postFetchData(API.GETPAYINFO, 'orderId='+id, (result)=>{
        result=result['result'];
        if(result['isPay']){
            show('支付结果','充值成功');
        }else{
            show('支付结果','订单正在处理,请等待……');
        }
    });
}