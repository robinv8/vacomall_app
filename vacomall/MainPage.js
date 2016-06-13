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
import GoodsDetail from './app/GoodsDetail';
import Cart from './app/CartPage';

import wechatTest from './app/Test/wechatTest';
import wechatTestAndroid from './app/Test/wechatTestAndroid';
import Person from './app/Person';
import pullTest from './app/Test/pullTest';

import Reactotron from 'reactotron';


export default class MainPage extends Component {
    componentDidMount() {
        codePush.sync();

    }
    render() {
        let defaultName = 'Person';
        let defaultComponent = Person;
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