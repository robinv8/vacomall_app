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
    Platform,
    BackAndroid,
    Dimensions
} from 'react-native';
import {HomePage,ChongZhiPage,CartPage,Person,TabNavigator,Toast} from './util/Path';
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
const {width,height}=Dimensions.get('window');

export default class MainScreen extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selectedTab: HOME,
            navigator: null,
            active: null,
            ad:<View style={{position:'absolute',width:width,height:height,top:0,backgroundColor:'white'}}>
                    <Image source={require('../images/ad.png')} style={{width:width,height:height-20,resizeMode:'stretch'}}/>
            </View>
        };
    }

    _renderTabItem(img, selectedImg, tag, childView) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === tag}
                renderIcon={() => <Image style={styles.tabIcon} source={img}/>}
                renderSelectedIcon={() => <Image style={styles.tabIcon} source={selectedImg}/>}
                onPress={() => this.setState({ selectedTab: tag ,active:true})}
            >
                {childView}
            </TabNavigator.Item>
        );
    }

    componentDidUnMount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', ()=>this.onBackAndroid());
        }
    }

    onBackAndroid() {
        const {navigator} = this.props;
        const routers = navigator.getCurrentRoutes();
        if (routers.length > 1) {
            var displayName = routers[routers.length - 1]['component']['displayName'];
            if (displayName === 'Login') {
                this.setState({
                    selectedTab:HOME
                });
                navigator.popToTop();
            } else {
                navigator.pop();
            }
            return true;
        }
        if(this.state.selectedTab!==HOME){
            this.setState({
                selectedTab:HOME
            });
            return true;
        }
        return false;
    };

    componentDidMount() {
        if(this.props.Ad!==undefined){
            this.setState({
                ad:this.props.Ad
            })
        }

        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', (BackAndroid)=>this.onBackAndroid(BackAndroid));
        }
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
                <TabNavigator hidesTabTouch={false} tabBarStyle={styles.tab}>
                    {this._renderTabItem(HOME_NORMAL, HOME_FOCUS, HOME, <HomePage navigator={this.props.navigator} _this={this}/>)}
                    {this._renderTabItem(CHONGZHI_NORMAL, CHONGZHI_FOCUS, CHONGZHI, <ChongZhiPage
                        navigator={this.props.navigator}/>)}
                    {this._renderTabItem(CART_NORMAL, CART_FOCUS, CART, <CartPage navigator={this.props.navigator}
                                                                                  tab={true}
                                                                                  active={this.state.active}/>)}
                    {this._renderTabItem(PERSONAL_NORMAL, PERSONAL_FOCUS, PERSONAL, <Person
                        navigator={this.props.navigator}/>)}
                </TabNavigator>
                {this.state.ad}
            </View >
        );
    }
}

const styles = StyleSheet.create({
    tab: {
        backgroundColor: 'rgba(250,250,250,0.5)',
        alignItems: 'center',
        height: 49,
        borderTopWidth: Platform.OS === 'ios' ? 1 : 0.5,
        borderTopColor: 'rgba(0,0,0,0.1)'
    },
    tabIcon: {
        width: 41,
        height: 35,
        resizeMode: 'stretch',
        top: 7
    }
})