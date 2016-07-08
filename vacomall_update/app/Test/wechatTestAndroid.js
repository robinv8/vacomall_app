/**
 * Created by renyubin on 16/6/12.
 */
'use strict';
import React, {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    DeviceEventEmitter,
    ToastAndroid,
} from 'react-native';

import WeChat from 'react-native-wechat-android';

let appId = 'wx0ccd9f577013dab0';   // 你的AppId

let webpageOptions = {
    title: '分享这个网页给你',
    desc: '我发现这个网页很有趣，特意分享给你',
    thumbSize: 150,
    scene: 0,
    type: 3,

    webpageUrl: 'https://github.com/beefe/react-native-wechat-android',
    thumbImage: 'http://img1.imgtn.bdimg.com/it/u=3924416677,403957246&fm=21&gp=0.jpg',
};

export default class MyProject extends React.Component{
    _registerApp(){
        WeChat.registerApp(appId,(err,registerOK) => {
            ToastAndroid.show(registerOK + '',ToastAndroid.SHORT);
        });
    }

    _openApp(){
        WeChat.openWXApp((err,res) => {

        });
    }

    _share(){
        WeChat.sendReq(webpageOptions,(err,sendOK) => {
        });
    }

    componentWillMount(){
        DeviceEventEmitter.addListener('finishedShare',function(event){
            var success = event.success;
            if(success){
                ToastAndroid.show('分享成功',ToastAndroid.SHORT);
            }else{
                ToastAndroid.show('分享失败',ToastAndroid.SHORT);
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text} onPress={this._registerApp} >
                    注册到微信
                </Text>
                <Text style={styles.text} onPress={this._openApp} >
                    打开微信
                </Text>
                <Text style={styles.text} onPress={this._share} >
                    分享网页到微信
                </Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        color: '#333333',
        margin: 10,
    },
});
