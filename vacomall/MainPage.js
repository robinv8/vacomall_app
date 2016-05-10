/**
 * Created by renyubin on 16/4/23.
 */
'use strict';
import React,{
    Component,
    View,
    Text,
    Navigator,
}from 'react-native';
import HomePage from './app/HomePage';
export default class MainPage extends Component {
    render() {
        let defaultName = 'HomePage';
        let defaultComponent = HomePage;
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