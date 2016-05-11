'use strict';
import React, {
    Component,
    Image,
    TextInput,
    View,
    StyleSheet,
    Platform,
    Text,
    StatusBar,
    PixelRatio,
    TouchableWithoutFeedback,
    Navigator,
    ToastAndroid,
    Alert
}from 'react-native';
var PPI = PixelRatio.get();
import SearchPage from '../SearchPage';
import CartPage from '../CartPage';
import Login from '../Login';
import API from '../util/api';
import * as NetService from '../util/NetService';
export default class HomeHeader extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            login: <TouchableWithoutFeedback onPress={()=>this._toLoginPage()}>
                <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#00702d'}}>登录</Text>
                </View>
            </TouchableWithoutFeedback>,
            status: false
        };
    }

    _toSearchPage() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: SearchPage,
                sceneConfig: Navigator.SceneConfigs.FadeAndroid
            })
        }
    }

    _toLoginPage() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.replace({
                component: Login,
                sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                params: {page: 'HomePage'}
            })
        }
    }
å
    updateState() {

        var _callback = function (result) {
            if (result['success'] === false) {
                this._toLoginPage();
            } else {
                this.quitAlert();
            }
            this.state.status=false;
        }
        NetService.postFetchData(API.LOGINSTATE, '', _callback.bind(this));
        this.state.status=true;

    }

    quitAlert() {
        var _this = this;
        const {navigator}=this.props;

        function quit() {
            NetService.postFetchData(API.LOGOUT, '', _callback);
        };
        function _callback(result) {
            if (result['success'] === false) {
                ToastAndroid.show(result['result']['message'], ToastAndroid.SHORT);
                return;
            }
            ToastAndroid.show('退出成功!', ToastAndroid.SHORT);
            if (navigator) {
                navigator.replace({
                    component: Login,
                    sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                    params: {page: 'HomePage'}
                })
            }
        }

        Alert.alert(
            '提示',
            '是否退出登录?',
            [
                {text: '否'},
                {text: '是', onPress: () => quit()},
            ]
        )
    }

    toCart() {
        const {navigator}=this.props;
        var _callback = function (result) {
            if (result['success'] === false) {
                ToastAndroid.show(result['result']['message'], ToastAndroid.SHORT);
                if (result['result']['code'] === 303) {
                    if (navigator) {
                        navigator.replace({
                            component: Login,
                            sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                            params: {page: 'HomePage'}
                        })
                    }
                }
            } else {
                if (navigator) {
                    navigator.push({
                        component: CartPage,
                        sceneConfig: Navigator.SceneConfigs.FloatFromRight,

                    })
                }
            }
        }
        NetService.postFetchData(API.LOGINSTATE, '', _callback.bind(this));
    }


    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                />
                <TouchableWithoutFeedback onPress={()=>this.updateState()} disabled={this.state.status}>
                    <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                        <Image source={require('../../images/person.png')}
                               style={{height:30,width:30,resizeMode:'stretch'}}/>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.searchBox}>
                    <TextInput
                        keyboardType='web-search'
                        placeholder='创维家电直送 好礼不停'
                        onFocus={()=>this._toSearchPage()}
                        placeholderTextColor={'#00a040'}
                        style={styles.inputText}/>
                    <Image source={require('../../images/header/search_icon.png')} style={styles.searchIcon}/>
                </View>
                <TouchableWithoutFeedback onPress={()=>this.toCart()}>
                    <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                        <Image source={require('../../images/header/icon_shopping_cart.png')} style={styles.scanIcon}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        height: Platform.OS === 'ios' ? 134 / PPI : 50,
        backgroundColor: '#009934',
        alignItems: 'center',
    },
    logo: {
        height: 25,
        width: 64,
        resizeMode: 'stretch'

    },
    searchBox: {
        height: 30,
        flexDirection: 'row',
        flex: 5,
        borderRadius: 3,
        backgroundColor: '#00702d',
        alignItems: 'center',
    },
    scanIcon: {
        height: 26.7,
        width: 26.7,
        resizeMode: 'stretch'
    },
    searchIcon: {
        marginLeft: 5,
        marginRight: 8,
        width: 20,
        height: 20,
        resizeMode: 'stretch',
        backgroundColor: '#00702d'
    },
    inputText: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 14,
        color: 'white',
        paddingTop: 10
    }
})