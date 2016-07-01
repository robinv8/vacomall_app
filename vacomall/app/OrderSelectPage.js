/**
 * Created by renyubin on 16/6/25.
 */
'use strict';
import React,{
    Component,
    View,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    Text,
    Platform,
    StatusBar
} from 'react-native';
import {ScrollableTabView,DefaultTabBar,OrderAll,OrderDFK,OrderDFH,OrderDSH} from './util/Path'
export default class OrderSelectPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            orderStatus: '我的订单',
            initialPage: 0,
            isLoad0: false,
            isLoad1: false,
            isLoad2: false,
            isLoad3: false,
            isLoad4: false
        };
    }

    _back() {
        const {navigator}=this.props;
        //const test=navigator.getCurrentRoutes();
        if (navigator) {
            navigator.pop()
        }
    }

    componentWillMount() {
        let initialPage = this.props.initialPage;
        //if(!initialPage===undefined){
        let _this = this;
        const initialPageArray = ['all', 100, 200, 300, 400]
        initialPageArray.findIndex(function (value, index, arr) {
            if (value === initialPage) {
                _this.setState({
                    initialPage: index,
                });
                switch (index) {
                    case 0:
                        _this.setState({
                            isLoad0: true
                        })
                        break;
                }
            }
        })
    }

    scroll() {
        /*this.setState({
         isLoad:true
         })*/
    }

    onChangeTab(index) {
        switch (index['i']) {
            case 0:
                this.setState({
                    isLoad0: true
                })
                break;
            case 1:
                this.setState({
                    isLoad1: true
                })
                break;
            case 2:
                this.setState({
                    isLoad2: true
                })
                break;
            case 3:
                this.setState({
                    isLoad3: true
                })
                break;
            case 4:
                this.setState({
                    isLoad4: true
                })
                break;
        }

    }

    render() {
        return (
            <View style={{backgroundColor:'#FAFAFA',flex:1}}>
                <View style={[styles.container]}>
                    <StatusBar
                        barStyle="default"
                    />
                    <TouchableWithoutFeedback onPress={()=>this._back()}>
                        <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                            <Image source={require('../images/back_icon.png')}
                                   style={styles.backIcon}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.searchBox}>
                        <Text style={{color:'#3C3C3C',fontSize:18}}>
                            {this.state.orderStatus}
                        </Text>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>{}}>
                        <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center',opacity:0}}>
                            <Image source={require('../images/home_icon.png')}
                                   style={styles.scanIcon}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <ScrollableTabView
                    tabBarTextStyle={{fontSize:16,fontWeight:'100'}}
                    tabBarInactiveTextColor="#898989"
                    tabBarActiveTextColor='#000000'
                    tabBarUnderlineColor='#16BD42'
                    tabBarBackgroundColor='white'
                    scrollWithoutAnimation={true}
                    initialPage={this.state.initialPage}
                    locked={true}
                    onScroll={()=>this.scroll()}
                    onChangeTab={(index)=>this.onChangeTab(index)}
                    renderTabBar={() => <DefaultTabBar underlineHeight={2} style={{borderBottomWidth:2,borderBottomColor:'#D2D2D2',height:60,paddingTop:10}}/>}>
                    <OrderAll tabLabel="全部" isLoad={this.state.isLoad0}/>
                    <OrderDFK tabLabel="待付款" isLoad={this.state.isLoad1}/>
                    <OrderDFH tabLabel="待发货" isLoad={this.state.isLoad2}/>
                    <OrderDSH tabLabel="待收货" isLoad={this.state.isLoad3}/>
                    <View tabLabel="退换货" isLoad={this.state.isLoad4}/>
                </ScrollableTabView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        height: Platform.OS === 'ios' ? 64 : 40,
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#D5D5D5'
    },
    searchBox: {
        height: 28,
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanIcon: {
        height: 19,
        width: 21,
        resizeMode: 'stretch'
    },
    backIcon: {
        width: 14,
        height: 20,
        resizeMode: 'stretch',
    },
});