/**
 * Created by renyubin on 16/4/23.
 */
"use strict";

import React,{
    Component,
    View,
    Text,
    Navigator,
    AppState,
}from 'react-native';
import HomePage from './app/HomePage';
import codePush from "react-native-code-push";
import funcTest from './app/funcTest';
import MainScreen from './app/MainScreen';
export default class MainPage extends Component {
    componentDidMount() {
        codePush.sync();
    }
    render() {
        let defaultName = 'MainScreen';
        let defaultComponent = MainScreen;
        return (
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
        );
    }
}