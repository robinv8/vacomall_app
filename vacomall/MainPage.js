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
    StatusBar
}from 'react-native';

import codePush from "react-native-code-push";
import funcTest from './app/funcTest';
import MainScreen from './app/MainScreen';

import Login from './app/Login';
import ListPage from './app/ListPage';
import SearchPage from './app/SearchPage';
import CategoryList from './app/CategoryList';

export default class MainPage extends Component {
    componentDidMount() {
        codePush.sync();
    }
    render() {
        let defaultName = 'CategoryList';
        let defaultComponent = CategoryList;
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