/**
 * Created by renyubin on 16/6/18.
 */
import React,{
    Component,
    View, Text, StyleSheet, ScrollView,
    AlertIOS, TouchableHighlight,
    DeviceEventEmitter,
    Alert
}from 'react-native';
import {WeChatAndroid,Toast,API,ChongZhi,NetService,md5,Random,PaySuccess} from './Path'
const appid = 'wx0ccd9f577013dab0';

export function registerApp() {
    WeChatAndroid.registerApp(appid,(err,registerOK) => {
        //Toast.show(registerOK + '');
    });
}

export function isWXAppInstalled(callback){
    WeChatAndroid.isWXAppInstalled(
        (err,isInstalled) => {
            if(!isInstalled){
                Toast.show('请安装微信,便可充值!');
            }
            callback(isInstalled);
        }
    );
}

export function order(id,module) {
    /!*获取首页基本数据*!/
   NetService.postFetchData(API.ORDER, 'orderId='+id, (result)=>{
       if(!result['success']){
           Toast.show(result['message']);
           return;
       }
       result = result['result']['response'];
       const random = Random.generateMixed(16);
       const timeStamp = parseInt(new Date().getTime() / 1000 - 30);
       var stringA = "appid=" + result['appid'] + "&noncestr=" + random + "&package=Sign=WXPay&partnerid=" + result['mch_id'] + "&prepayid=" + result['prepay_id'] + "&timestamp=" + timeStamp;
       console.log(stringA)
       stringSignTemp = stringA + "&key=e10884523bd29da9edbf941cb15eef5d";
       console.log(stringSignTemp);
       var sign = md5(stringSignTemp).toUpperCase();
       let payOptions = {
           appId: result['appid'],
           nonceStr: random,
           partnerId: result['mch_id'],
           packageValue: 'Sign=WXPay',
           prepayId: result['prepay_id'],
           timeStamp: timeStamp.toString(),
           sign: sign
       };
       //Toast.show(module);
       if(module==='chongzhi'){
           ChongZhi.parentThis.setState({
               loadding: null
           });
       }else{
           module.setState({
               loadding: null
           });
       }

       WeChatAndroid.weChatPay(payOptions,(err,sendReqOK) => {
           getpayinfo(id,module);
           //console.log(sendReqOK)
       });
       /*DeviceEventEmitter.addListener('finishedPay', function (event) {
           var success = event.success;
           ToastAndroid.show(JSON.stringify(event))
           /!*if(success){
            getpayinfo(id);
            }else{
            ToastAndroid.show('支付失败',ToastAndroid.SHORT);
            }*!/
       });*/
   });
}
function getpayinfo(id,module){
    setTimeout(function () {
        NetService.postFetchData(API.GETPAYINFO, 'orderId=' + id, (result)=> {
            result = result['result'];
            if (result['isPay']) {
                if(module==='chongzhi'){
                    ChongZhi.parentThis.setState({
                        loadding: null
                    });
                    Toast.show('微信支付成功!');
                }else{
                    const {navigator}=module.props;
                    if (navigator) {
                        navigator.push({
                            component: PaySuccess,
                            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                        })
                    }
                }
            }
        });
    }, 3000)
}