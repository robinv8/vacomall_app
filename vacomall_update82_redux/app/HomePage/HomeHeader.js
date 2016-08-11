'use strict';
import React,{
    Component,
}from 'react';
import {
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
import {API,NetService,CategoryList,Login,Response,Global,CartPage,ListPage,SearchPage,Toast,BarCodeIos,BarCodeAndroid} from '../util/Path';
import {mainColor} from '../util/global';
import {getHeight} from '../util/response';
export default class HomeHeader extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
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


    toCate(){
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: CategoryList,
            })
        }
    }
    toBarCode(){
        /*const {navigator}=this.props;
        if (Platform.OS === 'ios') {
            if (navigator) {
                navigator.push({
                    component: BarCodeIos,
                    sceneConfig:Navigator.SceneConfigs.FloatFromLeft
                })
            }
        } else {
            if (navigator) {
                navigator.push({
                    component: BarCodeAndroid,
                    sceneConfig:Navigator.SceneConfigs.FloatFromLeft
                })
            }
        }*/
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                />
                <TouchableWithoutFeedback onPress={()=>this.toBarCode()} disabled={this.state.status}>
                    <View style={styles.qrcode_view}>
                        <Image source={require('../../images/header/qrcode_icon.png')}
                               style={styles.qrcode_icon}/>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>this._toSearchPage()}>
                    <View style={styles.searchBox}>
                        <Image source={require('../../images/header/search_icon.png')} style={styles.searchIcon}/>
                        <Text style={styles.searchText}>2016夏季女T恤 热卖</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>this.toCate()}>
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
        paddingTop: Platform.OS === 'ios' ? getHeight(20) : 0,
        height: Platform.OS === 'ios' ? getHeight(64) : getHeight(50),
        backgroundColor: mainColor,
        alignItems: 'center',
    },
    qrcode_view:{
        flex:1,
        height:getHeight(50),
        justifyContent:'center',
        alignItems:'center'
    },
    qrcode_icon:{
        height:getHeight(22),
        width:getHeight(29),
        resizeMode:'stretch'
    },
    searchBox: {
        height: getHeight(28),
        flexDirection: 'row',
        flex: 5,
        borderRadius: 5,
        backgroundColor: '#09982E',
        alignItems: 'center',
    },
    scanIcon: {
        height: getHeight(18),
        width: getHeight(27),
        resizeMode: 'stretch'
    },
    searchIcon: {
        marginLeft: 5,
        marginRight: 5,
        width: getHeight(14.54),
        height: getHeight(12.87),
        resizeMode: 'stretch',
        backgroundColor: '#09982E'
    },
    searchText: {
        flex: 1,
        fontSize: getHeight(13.23),
        color: 'white'
    },
    cate_view:{
        flex:1,
        height:getHeight(64),
        justifyContent:'center',
        alignItems:'center'
    }
})