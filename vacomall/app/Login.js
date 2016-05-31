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
    PixelRatio,
    Image,
    Alert,
    Dimensions,
    Navigator,
    StyleSheet,
    Platform,
    StatusBar
} from 'react-native';
import HomePage from './HomePage';
import ListPage from './ListPage';
import GoodsDetail from './GoodsDetail';
import Toast from 'react-native-root-toast';
import LinearGradient from 'react-native-linear-gradient';
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
            isShow: true,
            btnStateColor:'#70C98B',

        };
    }

    componentDidMount() {
        this._loadInitialState();
        console.log(PPI);
    }

    async _loadInitialState() {
        var uname = await AsyncStorage.getItem('uname');
        var pwd = await AsyncStorage.getItem('pwd');
        this.setState({
            uname: uname,
            pwd: pwd
        });
        if(this.state.uname===''||this.state.uname===null||this.state.pwd===''||this.state.pwd===null){
            this.setState({
                btnStateColor:'#70C98B'
            })
        }else{
            this.setState({
                btnStateColor:'white'
            })
        }
    }

    _login() {
        var uname = this.state.uname;
        var pwd = this.state.pwd;
        if (uname === "") {
            Toast.show('用户名不能为空!');
            return;
        }
        if (pwd === "") {
            Toast.show('密码不能为空!');
            return;
        }
        if (uname !== "" && pwd !== "") {
            NetService.postFetchData(API.LOGIN, 'uname=' + uname + '&pwd=' + pwd, (result)=>this._callback(result));
        }
    }

    _callback(result) {
        if (result['success'] === false) {
            Toast.show(result['result']['message']);
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
        Toast.show('登录成功!');
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
                        sceneConfig: Navigator.SceneConfigs.FloatFromRight,
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
                        sceneConfig: Navigator.SceneConfigs.FloatFromRight,
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
            });
        } else {
            this.setState({
                pwd: text
            })
        }
        if(this.state.uname===''||this.state.uname===null||this.state.pwd===''||this.state.pwd===null){
            this.setState({
                btnStateColor:'#70C98B'
            })
        }else{
            this.setState({
                btnStateColor:'white'
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

    _close() {
        Toast.show('sasa', {
            duration: Toast.durations.SHORT
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="default"
                />
                <Image source={require('../images/login/login_top.png')} style={styles.login_back}>
                    <View style={{alignItems:'flex-end',flex:1,}}>
                        <TouchableWithoutFeedback onPress={()=>this._close()}>
                            <View
                                style={{marginRight:3,marginTop:Platform.OS === 'ios' ?19 : 0,justifyContent:'center',alignItems:'center',width:50,height:50}}>
                                <Image source={require('../images/login/login_close.png')}
                                       style={{width:18,height:18,resizeMode:'stretch'}}></Image>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </Image>
                <View style={{marginTop:20,height:36,flex:1}}>
                    <View style={{flexDirection:'row',height:36,marginRight:38,marginTop:9}}>
                        <View style={{alignItems:'flex-end',flex:2,justifyContent:'center'}}>
                            <Image source={require('../images/login/uname.png')}
                                   style={{height:36,width:36,resizeMode:'stretch'}}/>
                        </View>
                        <View
                            style={{flexDirection:'row',alignItems:'center',height:33,flex:9,borderBottomWidth:0.5,borderBottomColor:'#BBBBBB',marginLeft:8}}>
                            <TextInput
                                style={{height: Platform.OS === 'ios' ?35 : 40,flex:1,fontSize:16,color:'#3B3B3B'}}
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
                    </View>

                    <View style={{flexDirection:'row',height:36,marginTop:20,marginRight:38}}>
                        <View style={{alignItems:'flex-end',flex:2,justifyContent:'center'}}>
                            <Image source={require('../images/login/pwd.png')}
                                   style={{height:36,width:36,resizeMode:'stretch'}}/>
                        </View>
                        <View
                            style={{flexDirection:'row',alignItems:'center',height:33,flex:9,borderBottomWidth:0.5,borderBottomColor:'#BBBBBB',marginLeft:8}}>
                            <TextInput
                                style={{height: Platform.OS === 'ios' ?35 : 40,flex:1,fontSize:16,color:'#3B3B3B'}}
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
                                <View
                                    style={{width:30,height:32,position:'absolute',right:23,justifyContent:'center',alignItems:'center'}}>
                                    <Image source={require('../images/login/visibility.png')}
                                           style={{width:6,height:8,resizeMode:'stretch',opacity:this.state.visible}}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={(flag)=>this._clear('pwd')}>
                                <Image source={require('../images/login/clean.png')}
                                       style={{width:15,height:15,resizeMode:'stretch',marginLeft:14}}/>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>

                    <View style={{alignItems:'center',marginTop:27}}>
                        <TouchableOpacity onPress={()=>this._login()}>
                            <LinearGradient colors={['#00A832', '#00A033', '#009933']} style={styles.linearGradient}>
                                <Text style={[styles.buttonText,{color:this.state.btnStateColor}]}>
                                    登录
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems:'flex-end',marginTop:8,marginRight:40,opacity:0}}>
                        <TouchableOpacity onPress={()=>this._login()}>
                            <Text style={{fontSize:14,color:'#515151'}}>忘记密码?</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,alignItems:'center',marginTop:Platform.OS === 'ios' ?97/3*PPI : 20,opacity:0}}>
                        <Text style={{fontSize:14,color:'#BDBDBD'}}>——— 其他方式登录 ———</Text>
                        <View style={{flexDirection:'row',flex:1,marginTop:20}}>
                            <View style={styles.thirdparty_view}>
                                <Image source={require('../images/login/login_qq_icon.png')}
                                       style={styles.thirdparty}></Image>
                            </View>
                            <View style={styles.thirdparty_view}>
                                <Image source={require('../images/login/login_wechat_icon.png')}
                                       style={styles.thirdparty}></Image>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    login_back: {
        width: Dimensions.get('window').width,
        height: Platform.OS === 'ios' ? 228 : 200,
    },
    thirdparty_view: {
        alignItems: 'center',
        width: 80
    },
    thirdparty: {
        width: 45,
        height: 45,
        resizeMode: 'stretch'
    },
    linearGradient: {
        flex: 1,
        height: 46,
        width: Dimensions.get('window').width - 58,
        borderRadius: 20
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        backgroundColor: 'transparent',
    },
});