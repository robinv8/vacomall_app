/**
 * Created by renyubin on 16/4/25.
 */
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
    ToastAndroid
}from 'react-native';
import {CartPage,Login,API,NetService,Toast} from '../util/Path';
import {getHeight} from '../util/response';
export default class Header extends Component {
    toCart() {
        NetService.postFetchData(API.LOGINSTATE, "",(result)=>{
            const {navigator}=this.props;
            if(result['success']===false){
                Toast.show(result['result']['message']);
                if (result['result']['code'] === 303) {
                    if (navigator) {
                        navigator.push({
                            component: Login,
                            sceneConfig: Navigator.SceneConfigs.FadeAndroid
                        })
                    }
                }
            }else{
                if (navigator) {
                    navigator.push({
                        component: CartPage,
                        //sceneConfig: Navigator.SceneConfigs.FadeAndroid
                    })
                }
            }
        });
    }
    /*
    * <TouchableWithoutFeedback onPress={()=>{}}>
     <View style={{flexDirection:'row',alignItems: 'center',justifyContent: 'center', marginRight:15}}>
     <Image source={require('../../images/more_icon.png')} style={styles.moreIcon}/>
     </View>
     </TouchableWithoutFeedback>
    * */
    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="default"
                />
                <TouchableWithoutFeedback onPress={()=>this.props._back()}>
                    <View style={{flex:2,justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
                        <Image source={require('../../images/back_icon.png')}
                           style={styles.backIcon}/>
                        <Text style={{marginLeft:getHeight(2),fontSize:getHeight(16)}}>返回</Text>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.searchBox}>
                    <Text style={{color: '#3C3C3C',fontSize: getHeight(18)}}>商品详情</Text>
                </View>
                <View style={{flex:2,flexDirection:'row',justifyContent:'flex-end'}}>
                    <TouchableWithoutFeedback onPress={()=>this.toCart()}>
                        <View style={{flex:1,height:getHeight(50),alignItems: 'flex-end',justifyContent: 'center',marginRight:getHeight(15)}}>
                            <Image source={require('../../images/black_cart.png')} style={styles.scanIcon}/>
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
        paddingTop: Platform.OS === 'ios' ? getHeight(20) : 0,
        height: Platform.OS === 'ios' ? getHeight(64) : getHeight(50),
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        borderBottomWidth:1,
        borderBottomColor:'#d3d3d3',
        justifyContent:'center'
    },

    searchBox: {
        height: getHeight(50),
        flexDirection: 'row',
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanIcon: {
        height: getHeight(23),
        width: getHeight(26),
        resizeMode: 'stretch'
    },
    moreIcon:{
        width: getHeight(20),
        height: getHeight(5),
        resizeMode: 'stretch',
    },
    searchIcon: {
        width: 20,
        height: 20,
        resizeMode: 'stretch',
        backgroundColor: '#00702d'
    },
    backIcon: {
        width: getHeight(12),
        height: getHeight(20),
        resizeMode: 'stretch',
        marginLeft:getHeight(9)
    }
})