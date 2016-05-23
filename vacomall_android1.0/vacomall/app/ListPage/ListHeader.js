/**
 * Created by renyubin on 16/4/25.
 */
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
    ToastAndroid
}from 'react-native';
import SearchPage from '../SearchPage';
import CartPage from '../CartPage';
import Login from '../Login';
import API from '../util/api';
import * as NetService from '../util/NetService';
var PPI = PixelRatio.get();
export default class Header extends Component {
    _back() {
        const {navigator}=this.props;
        const test=navigator.getCurrentRoutes();
        if (navigator) {
            navigator.pop()
        }
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
                            params: {page: 'ListPage',id:this.props.id}
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
                <TouchableWithoutFeedback onPress={()=>this._back()}>
                    <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                        <Image source={require('../../images/header/back.png')}
                               style={styles.backIcon}/>
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
                        <Image source={require('../../images/header/icon_shopping_cart.png')}
                               style={styles.scanIcon}/>
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
        flex: 6,
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
    backIcon: {
        width: 10,
        height: 15,
        resizeMode: 'stretch',
    },
    inputText: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 14,
        width: 860,
        color: 'white',
        paddingTop: 10
    }
})