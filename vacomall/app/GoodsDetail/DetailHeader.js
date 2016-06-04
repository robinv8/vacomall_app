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
                    barStyle="default"
                />
                <TouchableWithoutFeedback onPress={()=>this.props._back()}>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                        <Image source={require('../../images/back_icon.png')}
                           style={styles.backIcon}/>
                        <Text style={{marginLeft:2,fontSize:16}}>返回</Text>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.searchBox}>
                    <Text style={{color: '#3C3C3C',fontSize: 18}}>商品详情</Text>
                </View>
                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                    <TouchableWithoutFeedback onPress={()=>this.toCart()}>
                        <View style={{alignItems: 'center',justifyContent: 'center', marginRight:16}}>
                            <Image source={require('../../images/black_cart.png')} style={styles.scanIcon}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>this.toCart()}>
                        <View style={{flexDirection:'row',alignItems: 'center',justifyContent: 'center', marginRight:15}}>
                            <Image source={require('../../images/more_icon.png')} style={styles.moreIcon}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        height:Platform.OS === 'ios' ? 64 : 40,
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        borderBottomWidth:0.5,
        borderBottomColor:'#B2B2B2',
        justifyContent:'center'
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
        height: 23,
        width: 26,
        resizeMode: 'stretch'
    },
    moreIcon:{
        width: 20,
        height: 5,
        resizeMode: 'stretch',
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
        marginLeft:9
    },
    inputText: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 14,
        width: 860,
        color: 'white'
    }
})