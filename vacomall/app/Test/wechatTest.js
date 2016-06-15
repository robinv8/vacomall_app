/**
 * Created by renyubin on 16/6/12.
 */
import React,{
    Component,
    View, Text, StyleSheet, ScrollView,
    AlertIOS, TouchableHighlight,
    NativeAppEventEmitter
}from 'react-native';
import WeChat from 'react-native-wechat-ios';
let scope = 'snsapi_userinfo';
let state = 'wechat_sdk_test';
import API from '../util/api';
import * as NetService from '../util/NetService';
import MD5 from '../util/md5.min';
const appid = 'wx0ccd9f577013dab0';
function show(title, msg) {
    AlertIOS.alert(title + '', msg + '');
}
export default class wechatTest extends Component {
    componentDidMount() {
        this.registerApp();

        NativeAppEventEmitter.addListener(
            'didRecvAuthResponse',
            (response) => AlertIOS.alert(JSON.stringify(response))
        );

        NativeAppEventEmitter.addListener(
            'didRecvMessageResponse',
            (response) => {
                if (parseInt(response.errCode) === 0) {
                    alert('分享成功');
                } else {
                    alert('分享失败');
                }
            }
        );
    }

    registerApp() {
        WeChat.registerApp(appid, (res) => {
            //show('registerApp', res);
        });
    }

    registerAppWithDesc() {
        let appdesc = '测试';
        WeChat.registerApp(appid, appdesc, (res) => {
            show('registerAppWithDesc', res);
        });
    }

    isWXAppInstalled() {
        WeChat.isWXAppInstalled((res) => {
            show('isWXAppInstalled', res);
        });
    }

    getWXAppInstallUrl() {
        WeChat.getWXAppInstallUrl((res) => {
            show('getWXAppInstallUrl', res);
        });
    }

    isWXAppSupportApi() {
        WeChat.isWXAppSupportApi((res) => {
            show('isWXAppSupportApi', res);
        });
    }

    getApiVersion() {
        WeChat.getApiVersion((res) => {
            show('getApiVersion', res);
        });
    }

    openWXApp() {
        WeChat.openWXApp((res) => {
            show('openWXApp', res);
        });
    }

    sendAuthReq() {
        let scope = 'snsapi_userinfo';
        let state = 'wechat_sdk_test';
        WeChat.sendAuthReq(scope, state, (res) => {
            show('sendAuthReq', res);
        });
    }

    sendLinkURL() {
        WeChat.sendLinkURL({
            link: 'https://www.qianlonglaile.com/web/activity/share?uid=d1NrTmtrdVNFNzVmelVCQitpaEZxZz09&date=1449818774&from=groupmessage&isappinstalled=0#!/',
            tagName: '钱隆',
            title: '哈哈哈哈哈哈',
            desc: '噢噢噢噢哦哦哦哦哦哦',
            thumbImage: 'https://dn-qianlonglaile.qbox.me/static/pcQianlong/images/buy_8e82463510d2c7988f6b16877c9a9e39.png',
            scene: 0
        });
    }

    order() {
        /*获取首页基本数据*/
        NetService.postFetchData(API.ORDER, 'orderId=2372be3a86784bec8402666b059ace5f', (result)=>_callback(result));
        function _callback(result) {
            var result = result['response'];
            var stringA = "appid="+result['appid']+"&body=test&device_info="+result['device_info']+"&mch_id="+result['mch_id']+"&nonce_str="+result['nonce_str'];
            stringSignTemp="stringA&key=e108845cb15eef5d23bd29da9edbf941";
            var sign=MD5(stringSignTemp).toUpperCase()
            let payOptions = {
                appId: result['appid'],
                nonceStr: result['nonce_str'],
                partnerId: result['mch_id'],
                prepayId: result['prepay_id'],
                packageValue: 'Sign=WXPay',
                timeStamp: parseInt(new Date().getTime() / 1000 - 30),
                sign: sign
            };
            WeChat.weChatPay(payOptions, (res)=> {
                show('支付', res);
            });
        }

        /*NetService.getFetchData(API.ORDER1,(result)=>_callback(result));
         function _callback(result) {
         let payOptions = {
         appid: result['appid'],
         nonceStr: result['noncestr'],
         partnerId: result['partnerid'],
         prepayId: result['prepayid'],
         packageValue: 'Sign=WXPay',
         timeStamp: result['timestamp'],
         sign: result['sign']
         };
         //show('md',result['prepayid']);
         WeChat.weChatPay(payOptions, (res)=> {
         //show('支付', res);
         });
         }*/

    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.wrapper}>

                <Text style={styles.pageTitle}>WeChat SDK for React Native (iOS)</Text>

                <TouchableHighlight
                    style={styles.button} underlayColor="#f38"
                    onPress={this.registerApp}>
                    <Text style={styles.buttonTitle}>registerApp</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.button} underlayColor="#f38"
                    onPress={this.registerAppWithDesc}>
                    <Text style={styles.buttonTitle}>registerAppWithDesc</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.button} underlayColor="#f38"
                    onPress={this.isWXAppInstalled}>
                    <Text style={styles.buttonTitle}>isWXAppInstalled</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.button} underlayColor="#f38"
                    onPress={this.isWXAppSupportApi}>
                    <Text style={styles.buttonTitle}>isWXAppSupportApi</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.button} underlayColor="#f38"
                    onPress={this.getApiVersion}>
                    <Text style={styles.buttonTitle}>getApiVersion</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.button} underlayColor="#f38"
                    onPress={this.getWXAppInstallUrl}>
                    <Text style={styles.buttonTitle}>getWXAppInstallUrl</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.button} underlayColor="#f38"
                    onPress={this.openWXApp}>
                    <Text style={styles.buttonTitle}>openWXApp</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.button} underlayColor="#f38"
                    onPress={this.sendAuthReq}>
                    <Text style={styles.buttonTitle}>sendAuthReq</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.button} underlayColor="#f38"
                    onPress={this.sendLinkURL}>
                    <Text style={styles.buttonTitle}>sendLinkURL</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.button} underlayColor="#f38"
                    onPress={this.order}>
                    <Text style={styles.buttonTitle}>支付</Text>
                </TouchableHighlight>

            </ScrollView>
        );
    }
}
let styles = StyleSheet.create({
    wrapper: {
        paddingTop: 60,
        paddingBottom: 20,
        alignItems: 'center',
    },
    pageTitle: {
        paddingBottom: 40
    },
    button: {
        width: 200,
        height: 40,
        marginBottom: 10,
        borderRadius: 6,
        backgroundColor: '#f38',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTitle: {
        fontSize: 16,
        color: '#fff'
    }
});
