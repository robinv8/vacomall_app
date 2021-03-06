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
import {HomePage,ChongZhiPage,CartPage,Person,TabNavigator,Toast,CodePush} from './util/Path';
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
            active: false,
            beforeView: null
        };
    }


    _renderTabItem(img, selectedImg, tag, childView) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === tag}
                renderIcon={() => <Image style={styles.tabIcon} source={img}/>}
                renderSelectedIcon={() => <Image style={styles.tabIcon} source={selectedImg}/>}
                onPress={() =>{
                    this.setState({
                        selectedTab: tag ,
                        active:true
                    })
                } }
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
        console.log(routers)
        if (routers.length > 1) {
            var displayName = routers[routers.length - 1]['component']['name'];
            if (displayName === 'Login'||displayName==='PayHDFK'||displayName==='PaySuccess') {
                this.setState({
                    selectedTab: HOME
                });
                navigator.popToTop();
            } else {
                let params = routers[routers.length - 1]['params'];
                let beforeThis = undefined
                if (params !== undefined) {
                    beforeThis = params['_this'];
                }
                if (beforeThis !== undefined) {
                    beforeThis.setState({
                        isrefresh: true
                    })
                }
                navigator.pop();
            }
            return true;
        }
        if (this.state.selectedTab !== HOME) {
            this.setState({
                selectedTab: HOME
            });
            return true;
        }
        return false;
    };

    componentWillMount() {
        let initTab=this.props.initTab;
        if(initTab!==undefined){
            this.setState({
                selectedTab:initTab
            })
        }
    }
    componentDidMount() {
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
                    {this._renderTabItem(HOME_NORMAL, HOME_FOCUS, HOME, <HomePage navigator={this.props.navigator}
                                                                                  _this={this}/>)}
                    {this._renderTabItem(CHONGZHI_NORMAL, CHONGZHI_FOCUS, CHONGZHI, <ChongZhiPage
                        navigator={this.props.navigator}/>)}
                    {this._renderTabItem(CART_NORMAL, CART_FOCUS, CART, <CartPage navigator={this.props.navigator}
                                                                                  tab={true}
                                                                                  active={this.state.active}/>)}
                    {this._renderTabItem(PERSONAL_NORMAL, PERSONAL_FOCUS, PERSONAL, <Person
                        navigator={this.props.navigator} active={this.state.active}/>)}
                </TabNavigator>
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