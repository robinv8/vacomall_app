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
    StatusBar
}from 'react-native';


import {MainScreen,codePush,Login,RetrievePwd,RetrievePwdHeader,CategoryList,Reactotron,GoodsDetail} from './app/util/Path';

export default class MainPage extends Component {
    componentDidMount() {
        //Reactotron.connect();
       //codePush.sync();//app 热更新
    }

    render() {
        let defaultName = 'MainScreen';
        let defaultComponent = MainScreen;
        return (
            <View style={{flex:1}}>
                <StatusBar
                    barStyle="light-content"
                />
                <Navigator
                    initialRoute={{ name: defaultName, component: defaultComponent }}
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