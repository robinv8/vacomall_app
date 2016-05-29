/**
 * Created by renyubin on 16/5/28.
 */
'use strict';
import React, {
    Component,
    View,
    StyleSheet,
    Text,
    Image,
    TouchableHighlight,
    Navigator,
    Platform
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';
import HomePage from './HomePage';

const HOME = 'home';
const HOME_NORMAL = require('../images/tabs/home_normal.png');
const HOME_FOCUS = require('../images/tabs/home_focus.png');
const CHONGZHI = 'chongzhi';
const CHONGZHI_NORMAL = require('../images/tabs/chongzhi_normal.png');
const CHONGZHI_FOCUS = require('../images/tabs/chongzhi_focus.png');
const CART = 'cart';
const CART_NORMAL = require('../images/tabs/cart_normal.png');
const CART_FOCUS = require('../images/tabs/cart_focus.png');
const PERSONAL = 'personal';
const PERSONAL_NORMAL = require('../images/tabs/personal_normal.png');
const PERSONAL_FOCUS = require('../images/tabs/personal_focus.png');


export default class MainScreen extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selectedTab: HOME,
            navigator: null
        };
    }

    _renderTabItem(img, selectedImg, tag, childView) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === tag}
                renderIcon={() => <Image style={styles.tabIcon} source={img}/>}
                renderSelectedIcon={() => <Image style={styles.tabIcon} source={selectedImg}/>}
                onPress={() => this.setState({ selectedTab: tag })}>
                {childView}
            </TabNavigator.Item>
        );
    }

    static _createChildView(tag) {
        return (
            <View style={{flex:1,backgroundColor:'#00baff',alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:22}}>{tag}</Text>
            </View>
        )
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <TabNavigator hidesTabTouch={false} tabBarStyle={styles.tab} style={{backgroundColor:'rgba(255,255,255,0)'}}>
                    {this._renderTabItem(HOME_NORMAL, HOME_FOCUS, HOME, <HomePage navigator={this.props.navigator}/>)}
                    {this._renderTabItem(CHONGZHI_NORMAL, CHONGZHI_FOCUS, CHONGZHI, MainScreen._createChildView(CHONGZHI))}
                    {this._renderTabItem(CART_NORMAL, CART_FOCUS, CART, MainScreen._createChildView(CART))}
                    {this._renderTabItem(PERSONAL_NORMAL, PERSONAL_FOCUS, PERSONAL, MainScreen._createChildView(PERSONAL))}
                </TabNavigator>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    tab: {
        backgroundColor:'rgba(250,250,250,0.5)',
        alignItems: 'center',
        height: 49,
        borderTopWidth:Platform.OS === 'ios' ? 1 : 0.5,
        borderTopColor:'rgba(0,0,0,0.1)'
    },
    tabIcon: {
        width: 41,
        height: 35,
        resizeMode: 'stretch',
        marginTop: 15
    }
})