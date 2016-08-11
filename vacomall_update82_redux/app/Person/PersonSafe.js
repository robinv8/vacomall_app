/**
 * Created by ren on 16/7/5.
 */
import React,{
    Component,
}from 'react';
import {
    View,
    StatusBar,
    StyleSheet,
    TouchableWithoutFeedback,
    Image,
    Text,
    Platform,
    Alert,
    Navigator,
    AsyncStorage
} from 'react-native';
import {PersonInfo,NetService,API,Toast,Login,AbortVacomall} from '../util/Path'
import {getHeight} from '../util/response';
export default class PersonSafe extends Component {
    _back() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.pop()
        }
    }

    toPersonInfo() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: PersonInfo,
            })
        }
    }
    toAbortvacomall(){
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: AbortVacomall,
            })
        }
    }
    quitAlert() {
        var _this = this;
        const {navigator}=this.props;

        function quit() {
            NetService.postFetchData(API.LOGOUT, '', _callback);
        };
        function _callback(result) {
            if (result['success'] === false) {
                Toast.show(result['result']['message']);
                return;
            }
            Toast.show('退出成功!');
            if (navigator) {
                navigator.push({
                    component: Login,
                    sceneConfig: Navigator.SceneConfigs.FadeAndroid
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

    async cancelStore() {
        await AsyncStorage.clear()
        Toast.show('缓存已清除!')
    }

    render() {
        return (
            <View style={{backgroundColor:'#F6F6F6',flex:1}}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={()=>this._back()}>
                        <View style={{flex:1,height:getHeight(50),justifyContent:'center',alignItems:'center'}}>
                            <Image source={require('../../images/back_icon.png')}
                                   style={styles.backIcon}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.searchBox}>
                        <Text style={{color: '#3C3C3C',fontSize: getHeight(18)}}>更多设置</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>{}}>
                        <View style={{flex:1,height:getHeight(50),justifyContent:'center',alignItems:'center'}}>

                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View>
                    <TouchableWithoutFeedback onPress={()=>this.toPersonInfo()}>
                        <View
                            style={[styles.barwrap,{marginTop:getHeight(17),height:getHeight(62),flexDirection:'row',alignItems:'center',backgroundColor:'white'}]}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Image source={require('../../images/person_icon1.png')} style={styles.safe_icon}/>
                                <Text style={{marginLeft:getHeight(10),color:'#3C3C3C',fontSize:getHeight(16)}}>个人安全中心</Text>
                            </View>
                            <View style={{flex:1,alignItems:'flex-end',marginRight:getHeight(15)}}>
                                <Image source={require('../../images/right_arrows_icon.png')}
                                       style={styles.right_arrows}/>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <View
                        style={[styles.barwrap,{marginTop:getHeight(17),paddingLeft:getHeight(10),paddingRight:getHeight(10),backgroundColor:'white'}]}>
                        <TouchableWithoutFeedback onPress={()=>this.toAbortvacomall()}>
                            <View
                                style={[styles.barwrap,{height:getHeight(62),flexDirection:'row',flex:1,alignItems:'center',borderBottomWidth:0.5}]}>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Image source={require('../../images/person_icon2.png')}
                                           style={[styles.safe_icon,{marginLeft:0}]}/>
                                    <Text style={{marginLeft:getHeight(10),color:'#3C3C3C',fontSize:getHeight(16)}}>关于万颗</Text>
                                </View>
                                <View style={{flex:1,alignItems:'flex-end'}}>
                                    <Image source={require('../../images/right_arrows_icon.png')}
                                           style={styles.right_arrows}/>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>this.cancelStore()}>
                            <View
                                style={[styles.barwrap,{height:getHeight(62),flexDirection:'row',alignItems:'center',borderBottomWidth:0}]}>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Image source={require('../../images/person_icon3.png')}
                                           style={[styles.safe_icon,{marginLeft:0}]}/>
                                    <Text style={{marginLeft:getHeight(10),color:'#3C3C3C',fontSize:getHeight(16)}}>清除缓存</Text>
                                </View>
                                <View style={{flex:1,alignItems:'flex-end'}}>
                                    <Image source={require('../../images/right_arrows_icon.png')}
                                           style={styles.right_arrows}/>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>{Toast.show('即将开放,敬请期待……')}}>
                        <View
                            style={[styles.barwrap,{marginTop:getHeight(17),height:getHeight(62),flexDirection:'row',alignItems:'center',backgroundColor:'white'}]}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Image source={require('../../images/person_icon4.png')} style={styles.safe_icon}/>
                                <Text style={{marginLeft:getHeight(10),color:'#3C3C3C',fontSize:getHeight(16)}}>客服中心</Text>
                            </View>
                            <View style={{flex:1,alignItems:'flex-end',marginRight:15}}>
                                <Image source={require('../../images/right_arrows_icon.png')}
                                       style={styles.right_arrows}/>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>this.quitAlert()}>
                        <View
                            style={[styles.barwrap,{marginTop:getHeight(17),height:getHeight(48),flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center'}]}>
                            <Text style={{marginLeft:getHeight(10),color:'#3C3C3C',fontSize:getHeight(16)}}>退出登录</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? getHeight(20) : 0,
        height: Platform.OS === 'ios' ? getHeight(64) : getHeight(50),
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#B2B2B2',
        justifyContent: 'center'
    },
    searchBox: {
        height: getHeight(50),
        flexDirection: 'row',
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanIcon: {
        height: getHeight(27),
        width: getHeight(27),
        resizeMode: 'stretch'
    },
    backIcon: {
        width: getHeight(12),
        height: getHeight(20),
        resizeMode: 'stretch',
    },
    barwrap: {
        borderBottomWidth: 1,
        borderBottomColor: '#E2E2E2',

    },
    safe_icon: {
        width: getHeight(32),
        height: getHeight(32),
        resizeMode: 'stretch',
        marginLeft: getHeight(10)
    },
    right_arrows: {
        width: getHeight(7.87),
        height: getHeight(14),
        resizeMode: 'stretch',
    }
})