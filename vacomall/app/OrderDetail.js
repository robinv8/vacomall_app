/**
 * Created by renyubin on 16/6/25.
 */
'use strict';
import React, {
    Component,
    View,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    Text,
    Platform,
    StatusBar,
    ListView,
    Dimensions,
    Navigator
} from 'react-native';
import {API, NetService, Toast, Login,OrderDetailHeader,LinearGradient} from './util/Path';
export default class OrderDetail extends Component {

    render() {
        return (
            <View style={{backgroundColor:'#FAFAFA',flex:1}}>
                <OrderDetailHeader navigator={this.props.navigator}/>
                <View>
                    <LinearGradient
                        start={[0.0, 0.25]} end={[0.5, 1.0]}
                        locations={[0,0.5,1]}
                        colors={['#00C800', '#0BC321', '#16BD42']}
                        style={styles.linearGradient}>
                        <View style={{flex:1,backgroundColor:'rgba(0,0,0,0)',justifyContent:'center',paddingLeft:29}}>
                            <Text style={{color:'white',fontSize:18,marginBottom:5}}>已发货</Text>
                            <Text style={{color:'white'}}>还剩<Text style={{fontSize:18}}>8天21时</Text>自动确定收货</Text>
                        </View>
                        <View style={{justifyContent:'center',marginRight:30}}>
                            <Image source={require('../images/orderDetail/order_icon1.png')} style={{width:62,height:55}}/>
                        </View>
                    </LinearGradient>
                    <View style={{height:123,backgroundColor:'white',marginBottom:15,borderBottomWidth:0.5,borderBottomColor:'rgba(230,230,230,1)',paddingLeft:12,paddingRight:12}}>
                        <View style={{flexDirection:'row',height:56,alignItems:'center',borderBottomWidth:0.5,borderBottomColor:'rgba(232,232,232,1)',}}>
                                <Image source={require('../images/orderDetail/order_icon2.png')} style={{width:23,height:21}}></Image>
                        </View>
                        <View style={{flexDirection:'row',height:66,alignItems:'center'}}>
                            <View>
                                <Image source={require('../images/orderDetail/order_icon3.png')} style={{width:15,height:21}}></Image>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
const styles=StyleSheet.create({
    linearGradient:{
        flex:1,
        height:100,
        flexDirection:'row'
    }
})
