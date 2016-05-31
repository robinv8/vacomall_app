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
    Alert,
    Dimensions
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
                <TouchableWithoutFeedback onPress={()=>this.updateState()} disabled={this.state.status}>
                    <View style={styles.qrcode_view}>
                        <Image source={require('../../images/header/qrcode_icon.png')}
                               style={styles.qrcode_icon}/>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.searchBox}>
                    <Image source={require('../../images/header/search_icon.png')} style={styles.searchIcon}/>
                    <Text style={styles.searchText}>2016夏季女T恤 热卖</Text>
                </View>
                <TouchableWithoutFeedback onPress={()=>this.toCart()}>
                    <View style={styles.cate_view}>
                        <Image source={require('../../images/header/cate_icon.png')} style={styles.scanIcon}/>
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
        height: Platform.OS === 'ios' ? 64 : 50,
        backgroundColor: '#009934',
        alignItems: 'center',
    },
    qrcode_view:{
        flex:1,height:50,
        justifyContent:'center',
        alignItems:'center'
    },
    qrcode_icon:{
        height:22,
        width:29,
        resizeMode:'stretch'
    },
    searchBox: {
        height: 28,
        flexDirection: 'row',
        flex: 5,
        borderRadius: 5,
        backgroundColor: '#007728',
        alignItems: 'center',
    },
    scanIcon: {
        height: 18,
        width: 27,
        resizeMode: 'stretch'
    },
    searchIcon: {
        marginLeft: 5,
        marginRight: 5,
        width: 14.54,
        height: 12.87,
        resizeMode: 'stretch',
        backgroundColor: '#00702d'
    },
    searchText: {
        flex: 1,
        fontSize: 13.32,
        color: 'white'
    },
    cate_view:{
        flex:1,
        height:64,
        justifyContent:'center',
        alignItems:'center'
    }
})