/**
 * Created by renyubin on 16/4/23.
 */
'use strict';

import React,{
    Component,
    View,
    Text,
    Navigator,
    AppState,
    StatusBar,
    AsyncStorage,
    Dimensions,
    Image,
    Platform
}from 'react-native';


import {MainScreen,IntroPage,Login,PaySuccess,PayHDFK,CodePush,Toast} from './app/util/Path';
let defaultName = 'IntroPage';
let defaultComponent = IntroPage;
import Version from './app/Version';
const {width,height}=Dimensions.get('window');
export default class MainPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isload:false,
            isUpdate:false,
            isUpdateStatus:null
        };
    }


    componentWillMount() {
        /*this.setState({
            isUpdate:false
        });
        this._loadInitialState();*/
        CodePush.notifyApplicationReady();
        //访问慢,不稳定
        CodePush.checkForUpdate()
            .then((update) => {
                if (!update) {
                    console.log('APP已是最新版')
                    this.setState({
                        isUpdate:false
                    });
                    this._loadInitialState();
                } else {
                    console.log('正在更新~')
                    this.setState({
                        isUpdate:true,
                        isUpdateStatus:'更新后内容更精彩……'
                    })
                    CodePush.sync({
                        installMode: CodePush.InstallMode.IMMEDIATE
                    });
                }
            });
    }
    async _loadInitialState() {
        let installed = await AsyncStorage.getItem('installedVersion');
        console.log(installed)
        if (installed == Version) {
            defaultName = 'MainScreen';
            defaultComponent = MainScreen;
        } else {
            defaultName = 'IntroPage';
            defaultComponent = IntroPage;
        }
        this.setState({
            isload:true
        })
    }


    render() {
        if (!this.state.isload) {
            return (
                <View style={{position:'absolute',width:width,height:height,top:0,backgroundColor:'white'}}>
                    <Image source={require('./images/ad.png')}
                           style={{width:width,height:height-20,resizeMode:'stretch'}}
                           onError={(e)=>{
                           Toast.show(e.nativeEvent.error)
                           }}
                    >
                        <View style={{marginTop:Platform.OS==='ios'?56:36,alignItems:'center'}}>
                            <Text style={{backgroundColor:'rgba(0,0,0,0)',color:'#03541F',fontSize:16}}>{this.state.isUpdateStatus}</Text>
                        </View>
                    </Image>
                </View>
            )
        }
        return (
            <View style={{flex:1}}>
                <StatusBar
                    barStyle="default"
                />
                <Navigator
                    initialRoute={{ name: defaultName, component: defaultComponent }}
                    interactivePopGestureEnabled={false}
                    style={{backgroundColor:'white'}}
                    configureScene={(route) => {
                if (route.sceneConfig) {
            return route.sceneConfig;
          }
            return Navigator.SceneConfigs.PushFromRight;
          }}
                    renderScene={(route, navigator) => {
            let Component = route.component;
            return <Component {...route.params} navigator={navigator} _this={this}/>
          }}/>
            </View>
        );
    }
}