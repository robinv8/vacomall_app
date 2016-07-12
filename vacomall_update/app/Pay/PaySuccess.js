/**
 * Created by renyubin on 16/5/4.
 */
'use strict';
import React,{Component} from 'react';
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
import {MainScreen,OrderDetail} from '../util/Path'
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
                        <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>

                        </View>
                        <View style={styles.searchBox}>
                            <Text style={{color: '#3C3C3C',fontSize: 18}}>支付成功</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>this.toHome()}>
                            <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                                <Image source={require('../../images/home_icon.png')}
                                       style={styles.scanIcon}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View>
                    <View style={{alignItems:'center',flex:1}}>
                        <View style={{marginTop:60}}>
                            <Image source={require('../../images/success_icon.png')}
                                   style={{width:100,height:87,resizeMode:'stretch'}}></Image>
                        </View>
                        <View style={{alignItems:'center',marginTop:23}}>
                            <Text style={{color:'#3C3C3C',fontSize:18}}>支付成功!</Text>
                            <Text style={{color:'#898989',fontSize:16,marginTop:15}}>我们尽快安排帮您发货~</Text>
                        </View>
                    </View>
                </View>
                <View style={{marginTop:15,alignItems:'center'}}>
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
                <View style={{alignItems:'center',marginTop:40}}>
                    <TouchableWithoutFeedback onPress={()=>this.toOrderDetail()}>
                        <View
                            style={{flexDirection:'row',borderWidth:1,borderColor:'#16BD42',width:96,height:32,borderRadius:5,justifyContent:'center',alignItems:'center'}}>
                            <Image source={require('../../images/green_left_arrow.png')}
                                   style={{width:12,height:16,marginRight:2}}/>
                            <Text style={{color:'#16BD42',fontSize:16}}>订单详情</Text>
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
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        height: Platform.OS === 'ios' ? 64 : 40,
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        borderBottomWidth:0.5,
        borderBottomColor:'#D3D3D3',
        justifyContent: 'center'
    },
    logo: {
        height: 25,
        width: 64,
        resizeMode: 'stretch'
    },
    searchBox: {
        height: 40,
        flexDirection: 'row',
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanIcon: {
        height: 22,
        width: 23,
        resizeMode: 'stretch'
    },
    searchIcon: {
        width: 20,
        height: 20,
        resizeMode: 'stretch',
        backgroundColor: '#00702d'
    },
    backIcon: {
        width: 12,
        height: 20,
        resizeMode: 'stretch',
    },
    inputText: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 14,
        width: 860,
        color: 'white'
    },
    orderList: {
        flexDirection: 'row',
        height: 35,
        borderBottomColor: '#BFBFBF',
        borderBottomWidth: 0.5,
        width:270,
        alignItems: 'center'
    },
    text: {
        color: '#3C3C3C',
        fontSize: 16
    }
})