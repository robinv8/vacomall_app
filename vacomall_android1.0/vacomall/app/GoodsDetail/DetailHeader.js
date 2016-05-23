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
import CartPage from '../CartPage';
import Login from '../Login';
import API from '../util/api';
import * as NetService from '../util/NetService';
var PPI = PixelRatio.get();
export default class Header extends Component {

    toCart() {
        const {navigator}=this.props;
        var _callback=function(result){
            if(result['success']===false){
                ToastAndroid.show(result['result']['message'], ToastAndroid.SHORT);
                if (result['result']['code'] === 303) {
                    if (navigator) {
                        navigator.replace({
                            component: Login,
                            sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                            params: {page: 'GoodsDetail',id:this.props.id}
                        })
                    }
                }
            }else{
                if (navigator) {
                    navigator.push({
                        component: CartPage,
                        sceneConfig: Navigator.SceneConfigs.FloatFromRight,

                    })
                }
            }
        }
        NetService.postFetchData(API.LOGINSTATE, "",_callback.bind(this));
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                />
                <TouchableWithoutFeedback onPress={()=>this.props._back()}>
                    <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../../images/login/login_back.png')}
                           style={styles.backIcon}/>
                        </View>
                </TouchableWithoutFeedback>
                <View style={styles.searchBox}>
                    <Text style={{color: 'white',fontSize: 20}}>商品详情</Text>
                </View>
                <TouchableWithoutFeedback onPress={()=>this.toCart()}>
                    <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../../images/white_cart.png')} style={styles.scanIcon}/>
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
        backgroundColor: '#14A83B',
        alignItems: 'center',
    },
    logo: {
        height: 25,
        width: 64,
        resizeMode: 'stretch'

    },
    searchBox: {
        height: 40,
        flexDirection: 'row',
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanIcon: {
        height: 30,
        width: 30,
        resizeMode: 'stretch'
    },
    searchIcon: {
        width: 20,
        height: 20,
        resizeMode: 'stretch',
        backgroundColor: '#00702d'
    },
    backIcon: {
        width: 12,
        height: 20,
        resizeMode: 'stretch',
    },
    inputText: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 14,
        width: 860,
        color: 'white'
    }
})