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
                        <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                            <Image source={require('../../images/back_icon.png')}
                                   style={styles.backIcon}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.searchBox}>
                        <Text style={{color: '#3C3C3C',fontSize: 18}}>更多设置</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>{}}>
                        <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>

                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View>
                    <TouchableWithoutFeedback onPress={()=>this.toPersonInfo()}>
                        <View
                            style={[styles.barwrap,{marginTop:17,height:62,flexDirection:'row',alignItems:'center',backgroundColor:'white'}]}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Image source={require('../../images/person_icon1.png')} style={styles.safe_icon}/>
                                <Text style={{marginLeft:10,color:'#3C3C3C',fontSize:16}}>个人安全中心</Text>
                            </View>
                            <View style={{flex:1,alignItems:'flex-end',marginRight:15}}>
                                <Image source={require('../../images/right_arrows_icon.png')}
                                       style={styles.right_arrows}/>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <View
                        style={[styles.barwrap,{marginTop:17,paddingLeft:10,paddingRight:10,backgroundColor:'white'}]}>
                        <TouchableWithoutFeedback onPress={()=>this.toAbortvacomall()}>
                            <View
                                style={[styles.barwrap,{height:62,flexDirection:'row',flex:1,alignItems:'center',borderBottomWidth:0.5}]}>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Image source={require('../../images/person_icon2.png')}
                                           style={[styles.safe_icon,{marginLeft:0}]}/>
                                    <Text style={{marginLeft:10,color:'#3C3C3C',fontSize:16}}>关于万颗</Text>
                                </View>
                                <View style={{flex:1,alignItems:'flex-end'}}>
                                    <Image source={require('../../images/right_arrows_icon.png')}
                                           style={styles.right_arrows}/>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>this.cancelStore()}>
                            <View
                                style={[styles.barwrap,{height:62,flexDirection:'row',alignItems:'center',borderBottomWidth:0}]}>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Image source={require('../../images/person_icon3.png')}
                                           style={[styles.safe_icon,{marginLeft:0}]}/>
                                    <Text style={{marginLeft:10,color:'#3C3C3C',fontSize:16}}>清除缓存</Text>
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
                            style={[styles.barwrap,{marginTop:17,height:62,flexDirection:'row',alignItems:'center',backgroundColor:'white'}]}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Image source={require('../../images/person_icon4.png')} style={styles.safe_icon}/>
                                <Text style={{marginLeft:10,color:'#3C3C3C',fontSize:16}}>客服中心</Text>
                            </View>
                            <View style={{flex:1,alignItems:'flex-end',marginRight:15}}>
                                <Image source={require('../../images/right_arrows_icon.png')}
                                       style={styles.right_arrows}/>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>this.quitAlert()}>
                        <View
                            style={[styles.barwrap,{marginTop:17,height:48,flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center'}]}>
                            <Text style={{marginLeft:10,color:'#3C3C3C',fontSize:16}}>退出登录</Text>
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
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        height: Platform.OS === 'ios' ? 64 : 40,
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#B2B2B2',
        justifyContent: 'center'
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
        height: 27,
        width: 27,
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
    },
    barwrap: {
        borderBottomWidth: 1,
        borderBottomColor: '#E2E2E2',

    },
    safe_icon: {
        width: 32,
        height: 32,
        resizeMode: 'stretch',
        marginLeft: 15
    },
    right_arrows: {
        width: 7.87,
        height: 14,
        resizeMode: 'stretch',
    }
})