/**
 * Created by renyubin on 16/4/23.
 */
'use strict';
import React,{
    Component,
    View,
    TextInput,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    AsyncStorage,
    ToastAndroid,
    PixelRatio,
    Image,
    Alert,
    Dimensions,
    Navigator
} from 'react-native';
import HomePage from './HomePage';
import ListPage from './ListPage';
import GoodsDetail from './GoodsDetail';
import API from './util/api';

import * as NetService from './util/NetService';
var PPI = PixelRatio.get();
export default class Login extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            uname: "",
            pwd: "",
            visible: 0,
            visible1: 1,
            visibleFlag: true,
            isShow: true

        };
    }

    componentDidMount() {
        this._loadInitialState();
    }

    async _loadInitialState() {
        var uname = await AsyncStorage.getItem('uname');
        var pwd = await AsyncStorage.getItem('pwd');
        this.setState({
            uname: uname,
            pwd: pwd
        });
    }

    _login() {
        var uname = this.state.uname;
        var pwd = this.state.pwd;
        if (uname === "") {
            ToastAndroid.show('用户名不能为空!', ToastAndroid.SHORT);
            return;
        }
        if (pwd === "") {
            return;
        }
        if (uname !== "" && pwd !== "") {
            NetService.postFetchData(API.LOGIN, 'uname=' + uname + '&pwd=' + pwd, (result)=>this._callback(result));
        }
    }

    _callback(result) {
        if (result['success'] === false) {
            ToastAndroid.show(result['result']['message'], ToastAndroid.SHORT);
            return;
        }
        var uname = this.state.uname;
        var pwd = this.state.pwd;
        this._saveValue_One(uname, pwd);
    }

    //进行储存数据_ONE
    async _saveValue_One(uname, pwd) {
        await AsyncStorage.setItem('uname', uname);
        await AsyncStorage.setItem('pwd', pwd);
        ToastAndroid.show('登录成功!', ToastAndroid.SHORT);
        this.toPage();
    }

    toPage() {
        const {navigator}=this.props;
        var page = this.props.page;
        if (navigator) {
            switch (page) {
                case 'HomePage':
                    navigator.replace({
                        component: HomePage,
                        sceneConfig:Navigator.SceneConfigs.FloatFromRight,
                        params: {page: 'Login'}
                    });
                    break;
                case 'ListPage':
                    navigator.replace({
                        component: ListPage,
                        sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                        params: {page: 'Login', id: this.props.id}
                    });
                    break;
                case 'GoodsDetail':
                    navigator.replace({
                        component: GoodsDetail,
                        sceneConfig:Navigator.SceneConfigs.FloatFromRight,
                        params: {page: 'Login', id: this.props.id}
                    });
                    break;
            }
        }
    }

    _visibleCut(flag, text) {
        if (flag) {
            this.setState({
                visible: 1,
                visible1: 0,
                visibleFlag: false,
                isShow: false,
            })
        } else {
            this.setState({
                visible: 0,
                visible1: 1,
                visibleFlag: true,
                isShow: true,
            })
        }
    }

    _onChange(text, flag) {
        if (flag === 'uname') {
            this.setState({
                uname: text
            })
        } else {
            this.setState({
                pwd: text
            })
        }
    }

    _clear(flag) {
        if (flag === 'uname') {
            this.setState({
                uname: '',
            })
        } else {
            this.setState({
                pwd: '',
            })
        }
    }

    _back() {
        this.toPage();
    }

    render() {
        return (
            <View style={{backgroundColor:'#F4F4F4',flex:1}}>
                <View style={{height:120,backgroundColor:'#14A83B'}}>
                    <TouchableWithoutFeedback onPress={()=>this._back()}>
                        <View style={{height:50,width:50,justifyContent:'center',alignItems:'center'}}>
                            <Image source={require('../images/login/login_back.png')}
                                   style={{width:13,height:20,resizeMode:'stretch'}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{marginTop:-60,alignItems:'center',justifyContent:'center'}}>
                    <View
                        style={{height:100,width:100,borderRadius:100,backgroundColor:'#F4F4F4',alignItems:'center',justifyContent:'center'}}>
                        <Image source={require('../images/header/head.png')}
                               style={{width:90,height:90,resizeMode:'stretch'}}/>
                    </View>
                    <Text style={{color:'#2E2E2E'}}>万颗账户登录</Text>
                </View>
                <View style={{marginTop:20}}>
                    <View style={{alignItems:'center'}}>
                        <Image source={require('../images/login/uname.png')}
                               style={{height:60,width:Dimensions.get('window').width-30,resizeMode:'stretch'}}/>
                    </View>
                    <View style={{marginTop:-57,flexDirection:'row',alignItems:'center'}}>
                        <TextInput
                            style={{height: 48,marginLeft:55,width:Dimensions.get('window').width-115}}
                            placeholder='请输入账号'
                            placeholderTextColor={'#d8d8d8'}
                            onChangeText={(uname,flag)=>this._onChange(uname,'uname')}
                            underlineColorAndroid='transparent'
                            value={this.state.uname}
                        />
                        <TouchableWithoutFeedback onPress={(flag)=>this._clear('uname')}>
                            <Image source={require('../images/login/clean.png')}
                                   style={{width:15,height:15,resizeMode:'stretch',marginLeft:8}}/>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{alignItems:'center',marginTop:15}}>
                        <Image source={require('../images/login/pwd.png')}
                               style={{height:60,width:Dimensions.get('window').width-30,resizeMode:'stretch'}}/>
                    </View>
                    <View style={{marginTop:-55,flexDirection:'row',alignItems:'center'}}>
                        <TextInput
                            style={{height: 48,marginLeft:56,width:Dimensions.get('window').width-138}}
                            placeholder='请输入密码'
                            secureTextEntry={this.state.isShow}
                            onChangeText={(pwd,flag) => this._onChange(pwd,'pwd')}
                            underlineColorAndroid='transparent'
                            placeholderTextColor={'#d8d8d8'}
                            value={this.state.pwd}
                        />
                        <TouchableWithoutFeedback onPress={(flag)=>this._visibleCut(this.state.visibleFlag)}>
                            <Image source={require('../images/login/visibility1.png')}
                                   style={{width:20,height:13,resizeMode:'stretch',marginLeft:3,opacity:this.state.visible1}}/>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={(flag)=>this._visibleCut(this.state.visibleFlag)}>
                            <Image source={require('../images/login/visibility.png')}
                                   style={{width:6,height:8,resizeMode:'stretch',marginLeft:-13,opacity:this.state.visible}}/>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={(flag)=>this._clear('pwd')}>
                            <Image source={require('../images/login/clean.png')}
                                   style={{width:15,height:15,resizeMode:'stretch',marginLeft:14}}/>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{alignItems:'center',marginTop:40}}>
                        <TouchableOpacity onPress={()=>this._login()}>
                            <Image source={require('../images/login/login_btn.png')}
                                   style={{width:Dimensions.get('window').width-20,height:75,resizeMode:'stretch'}}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}