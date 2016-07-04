/**
 * Created by renyubin on 16/6/18.
 */
import React,{
    Component,
    View, Text, StyleSheet, ScrollView,
    AlertIOS, TouchableHighlight,
    NativeAppEventEmitter,
    Navigator
}from 'react-native';
import {WeChatIos,Toast,API,ChongZhi,NetService,md5,Random,PaySuccess} from './Path'

let scope = 'snsapi_userinfo';
let state = 'wechat_sdk_test';


const appid = 'wx0ccd9f577013dab0';


export function registerApp() {
    WeChatIos.registerApp(appid, (res) => {
        //show('registerApp',res)
    });
}
export function isWXAppInstalled(callback) {
    WeChatIos.isWXAppInstalled((res) => {
        if (!res) {
            Toast.show('请安装微信,便可充值!');
        }
        callback(res);
    });
}

export function order(id,callback) {
    /!*获取首页基本数据*!/
    NetService.postFetchData(API.ORDER, 'orderId=' + id, (result)=>{
        if(!result['success']){
            Toast.show(result['result']['message']);
            callback(result['success'])
            return;
        }
        var result = result['result']['response'];
        const random = Random.generateMixed(16);
        const timeStamp = parseInt(new Date().getTime() / 1000 - 30);
        var stringA = "appid=" + result['appid'] + "&noncestr=" + random + "&package=Sign=WXPay&partnerid=" + result['mch_id'] + "&prepayid=" + result['prepay_id'] + "&timestamp=" + timeStamp;
        stringSignTemp = stringA + "&key=e10884523bd29da9edbf941cb15eef5d";
        var sign = md5(stringSignTemp).toUpperCase()
        let payOptions = {
            appId: result['appid'],
            nonceStr: random,
            partnerId: result['mch_id'],
            packageValue: 'Sign=WXPay',
            prepayId: result['prepay_id'],
            timeStamp: timeStamp.toString(),
            sign: sign
        };

        WeChatIos.weChatPay(payOptions, (res)=> {

        });
        let subscription = NativeAppEventEmitter.addListener(
            'finishedPay',
            (res) => {
                if (res.errCode == 0) { //充值成功
                    getpayinfo(id,callback);

                } else if (res.errCode == -1) { //很多情况下是证书问题
                    Toast.show('支付失败,请稍后尝试');
                    callback(false);
                } else if (res.errCode == -2) { //取消支付
                    Toast.show("取消支付");
                    callback(false);
                }
            }
        );
    });
}
function getpayinfo(id,callback) {
    setTimeout(function () {
        NetService.postFetchData(API.GETPAYINFO, 'orderId=' + id, (result)=> {
            result = result['result'];
            if (result['isPay']) {
                if(callback!==undefined){
                    callback(result);
                }
            }
        });
    }, 3000)
}