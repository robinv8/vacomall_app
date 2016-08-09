/**
 * Created by renyubin on 16/5/4.
 */
'use strict';
import React,{
    Component,
}from 'react';
import {
    View,
    Platform,
    Text,
    TouchableWithoutFeedback,
    StyleSheet,
    StatusBar,
    Image,
    PixelRatio,
    Navigator,
    Alert
}from 'react-native'
import {MainScreen,OrderDetail} from '../util/Path';
import {getHeight} from '../util/response';
export default class paySuccess extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            CreateTime: '',
            OrderCode: '',
            OrderPayType: '',
            OrderPayMoney: '',
            OrderId:''
        };
    }

    componentDidMount() {
        var result = this.props.result;
        console.log(result['orderPayId'])
        this.setState({
            CreateTime: result['payTime'],
            OrderCode: result['orderCode'],
            OrderPayType: result['orderPayTitle'],
            OrderPayMoney: result['orderPayMoney'],
            OrderId: result['Id'],
        })
    }


    toHome() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.resetTo({
                component: MainScreen,
                sceneConfig: Navigator.SceneConfigs.FadeAndroid,
            })
        }
    }
    toOrderDetail(){
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: OrderDetail,
                params:{orderId:this.state.OrderId}
            })
        }
    }
    render() {
        return (
            <View style={{flex:1,backgroundColor:'white'}}>
                <View>
                    <View style={styles.container}>
                        <StatusBar barStyle="default"/>
                        <View style={{flex:1,height:getHeight(50),justifyContent:'center',alignItems:'center'}}>

                        </View>
                        <View style={styles.searchBox}>
                            <Text style={{color: '#3C3C3C',fontSize: getHeight(18)}}>支付成功</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>this.toHome()}>
                            <View style={{flex:1,height:getHeight(50),justifyContent:'center',alignItems:'center'}}>
                                <Image source={require('../../images/home_icon.png')}
                                       style={styles.scanIcon}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View>
                    <View style={{alignItems:'center',flex:1}}>
                        <View style={{marginTop:getHeight(60)}}>
                            <Image source={require('../../images/success_icon.png')}
                                   style={{width:getHeight(100),height:getHeight(87),resizeMode:'stretch'}}></Image>
                        </View>
                        <View style={{alignItems:'center',marginTop:getHeight(23)}}>
                            <Text style={{color:'#3C3C3C',fontSize:getHeight(18)}}>支付成功!</Text>
                            <Text style={{color:'#898989',fontSize:getHeight(16),marginTop:getHeight(15)}}>我们尽快安排帮您发货~</Text>
                        </View>
                    </View>
                </View>
                <View style={{marginTop:getHeight(15),alignItems:'center'}}>
                    <View style={styles.orderList}>
                        <View style={{flex:1,}}>
                            <Text style={styles.text}>订单编号</Text>
                        </View>
                        <View style={{flex:2}}>
                            <Text style={styles.text}>{this.state.OrderCode}</Text>
                        </View>
                    </View>
                    <View style={styles.orderList}>
                        <View style={{flex:1}}>
                            <Text style={styles.text}>付款方式</Text>
                        </View>
                        <View style={{flex:2}}>
                            <Text style={styles.text}>{this.state.OrderPayType}</Text>
                        </View>
                    </View>
                    <View style={styles.orderList}>
                        <View style={{flex:1}}>
                            <Text style={styles.text}>下单时间</Text>
                        </View>
                        <View style={{flex:2}}>
                            <Text style={styles.text}>{this.state.CreateTime}</Text>
                        </View>
                    </View>
                    <View style={[styles.orderList,{borderBottomWidth:0}]}>
                        <View style={{flex:1}}>
                            <Text style={styles.text}>支付金额</Text>
                        </View>
                        <View style={{flex:2}}>
                            <Text style={styles.text}>{this.state.OrderPayMoney}</Text>
                        </View>
                    </View>
                </View>
                <View style={{alignItems:'center',marginTop:getHeight(40)}}>
                    <TouchableWithoutFeedback onPress={()=>this.toOrderDetail()}>
                        <View
                            style={{flexDirection:'row',borderWidth:1,borderColor:'#16BD42',width:getHeight(96),height:getHeight(32),borderRadius:5,justifyContent:'center',alignItems:'center'}}>
                            <Image source={require('../../images/green_left_arrow.png')}
                                   style={{width:getHeight(12),height:getHeight(16),marginRight:2}}/>
                            <Text style={{color:'#16BD42',fontSize:getHeight(16)}}>订单详情</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? getHeight(20) : 0,
        height: Platform.OS === 'ios' ? getHeight(64) : getHeight(50),
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        borderBottomWidth:1,
        borderBottomColor:'#d3d3d3',
        justifyContent: 'center'
    },
    searchBox: {
        height: getHeight(50),
        flexDirection: 'row',
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanIcon: {
        height: getHeight(22),
        width: getHeight(23),
        resizeMode: 'stretch'
    },
    backIcon: {
        width: getHeight(12),
        height: getHeight(20),
        resizeMode: 'stretch',
    },

    orderList: {
        flexDirection: 'row',
        height: getHeight(35),
        borderBottomColor: '#BFBFBF',
        borderBottomWidth: 1,
        width:getHeight(270),
        alignItems: 'center'
    },
    text: {
        color: '#3C3C3C',
        fontSize: getHeight(16)
    }
})