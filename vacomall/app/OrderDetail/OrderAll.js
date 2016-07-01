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
import {API,NetService,} from '../util/Path';
export default class OrderAll extends Component {
    componentDidMount() {
        NetService.getFetchData(API.ORDERDETAIL+'?st=100',(result)=>{

        })
    }

    componentDidUnMount() {

    }
    render() {
        return (
            <View style={{backgroundColor:'#FAFAFA',flex:1}}>
                <View style={styles.orderWrap}>
                    <View style={{height:48,justifyContent:'center',borderBottomWidth:0.5,borderBottomColor:'#BFBFBF'}}>
                        <Text style={{color:'#BFBFBF'}}>订单编号:9999999999999999</Text>
                    </View>
                    <View style={{height:100,justifyContent:'center',alignItems:'flex-end'}}>
                        <View><Text>共计2件商品 合计:<Text>999</Text></Text></View>
                        <View style={{flexDirection:'row'}}>
                            <View style={styles.btn}><Text style={{color:'#898989'}}>取消订单</Text></View>
                            <View style={[styles.btn,styles.btn1]}><Text style={{color:'white'}}>去支付</Text></View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
const styles=StyleSheet.create({
    orderWrap:{
        backgroundColor:'#FFFFFF',
        marginTop:10,
        borderBottomWidth:0.5,
        borderBottomColor:'#E6E6E6',
        paddingLeft:10,
        paddingRight:10
    },
    btn:{
        width:90,
        height:32,
        borderWidth:1,
        borderColor:'#898989',
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center'
    },
    btn1:{
        marginTop:10,
        backgroundColor:'#16BD42',
        borderWidth:0
    }
})