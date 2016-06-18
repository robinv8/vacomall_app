/**
 * Created by renyubin on 16/6/18.
 */
import React,{
    Component,
    View, Text, StyleSheet, ScrollView,
    AlertIOS, TouchableHighlight,
    DeviceEventEmitter,
    ToastAndroid
}from 'react-native';

import WeChat from 'react-native-wechat-android';
import Toast from 'react-native-root-toast';
let scope = 'snsapi_userinfo';
let state = 'wechat_sdk_test';
import API from '../util/api';
import * as Random from '../util/random';
import * as NetService from '../util/NetService';
import MD5 from '../util/md5.min';
const appid = 'wx0ccd9f577013dab0';

export function registerApp() {
    WeChat.registerApp(appid,(err,registerOK) => {
        //ToastAndroid.show(registerOK + '',ToastAndroid.SHORT);
    });
}

export function order(id) {
    //getpayinfo('4d4a3ddb294545a0ab530e64c44adc0');
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
            //ToastAndroid.show(res,ToastAndroid.SHORT);
        });
        DeviceEventEmitter.addListener('finishedPay',function(event){
            var success = event.success;
            ToastAndroid.show(JSON.stringify(event))
            /*if(success){
                getpayinfo(id);
            }else{
                ToastAndroid.show('支付失败',ToastAndroid.SHORT);
            }*/
        });
    }
}
function getpayinfo(id){

    NetService.postFetchData(API.GETPAYINFO, 'orderId='+id, (result)=>{
        result=result['result'];
        if(result['isPay']){
            ToastAndroid.show('支付结果','充值成功');
        }else{
            ToastAndroid.show('支付结果','订单正在处理,请等待……');
        }
    });
}