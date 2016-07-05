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
    AsyncStorage
}from 'react-native';


import {MainScreen,IntroPage,OrderDetail,codePush,Login,ReturnSKU,ReturnSKUEdit,OrderSelectPage,Guess,BarCodeAndroid,BarCodeIos,PersonSafe,PersonInfo,Person,AbortVacomall} from './app/util/Path';
let defaultName = 'IntroPage';
let defaultComponent = IntroPage;
import Version from './app/Version'
export default class MainPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isload:false
        };
    }

    componentDidMount() {
        //Reactotron.connect()
        //codePush.sync();//app 热更新
    }

    componentWillMount() {
        this._loadInitialState();
    }
    async _loadInitialState() {
        let installed = await AsyncStorage.getItem('installedVersion');
        console.log(installed)
        if (installed == Version) {
            defaultName = 'AbortVacomall';
            defaultComponent = AbortVacomall;
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
                <View/>
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
            return <Component {...route.params} navigator={navigator} />
          }}/>
            </View>
        );
    }
}