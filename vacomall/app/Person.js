/**
 * Created by renyubin on 16/4/23.
 */
import React,{
    Component,
    View,
    Text,
    StyleSheet,
    Platform,
    Image,
    Dimensions,
    StatusBar,
    ScrollView
}from 'react-native';
import Login from './Login';
export default class Person extends Component {
    getPersion() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: Login,
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="default"
                />
                <ScrollView style={styles.personHead}>
                    <Image source={require('../images/person_background.png')} style={styles.personHead_img}>
                        <View style={{flexDirection:'row',flex:1}}>
                            <View style={{height:50,paddingLeft:12,paddingTop:14,flex:1}}>
                                <Image source={require('../images/back_icon.png')} style={styles.backIcon}/>
                            </View>
                            <View style={{alignItems:'center',marginTop:24}}>
                                <Image source={require('../images/header_img.png')} style={styles.header_img}/>
                                <Text style={{fontSize:16,color:'white',backgroundColor:'rgba(0,0,0,0)'}}>HI!万小颗</Text>
                            </View>
                            <View style={{height:50,paddingRight:13,paddingTop:14,alignItems:'flex-end',flex:1}}>
                                <Image source={require('../images/setting.png')} style={styles.settingIcon}/>
                            </View>
                        </View>
                        <View style={styles.header_bottom}>
                            <View style={styles.header_bottom_con}/>
                            <View style={styles.header_bottom_con}>
                                <Text style={{color:'#CAEFDA'}}>购物券:</Text>
                                <Text style={{fontFamily:'DIN Condensed',fontWeight:'bold',fontSize:28,color:'white',paddingTop:5}}>55</Text>
                                <Text style={{color:'white',fontSize:12}}>张</Text>
                            </View>
                            <View style={[styles.header_bottom_con,{borderRightWidth:0}]}>
                                <Text style={{color:'#CAEFDA'}}>优惠券:</Text>
                                <Text style={{fontFamily:'DIN Condensed',fontWeight:'bold',fontSize:28,color:'white',paddingTop:5}}>4</Text>
                                <Text style={{color:'white',fontSize:12}}>张</Text>
                            </View>
                        </View>
                    </Image>
                    <View style={{backgroundColor:'white',marginBottom:10}}>
                        <View style={{height:50,alignItems:'center',flexDirection:'row',borderBottomWidth:0.5,borderBottomColor:'#E5E5E5'}}>
                            <View style={{flexDirection:'row',flex:1,alignItems:'center'}}>
                                <Image source={require('../images/order_item.png')} style={[styles.settingIcon,{marginLeft:18,marginRight:5}]}/>
                                <Text>全部订单</Text>
                            </View>
                            <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end',alignItems:'center'}}>
                                <Image source={require('../images/search_icon1.png')} style={[styles.searchIcon,{marginLeft:18,marginRight:5}]}/>
                                <Text style={{color:'#C2C2C2'}}>查看全部订单</Text>
                                <Image source={require('../images/right_arrow.png')} style={[styles.right_arrow]}/>
                            </View>
                        </View>
                        <View style={{flex:1,flexDirection:'row',height:78,paddingTop:17}}>
                            <View style={{flex:1,alignItems:'center'}}>
                                <Image source={require('../images/order_icon1.png')} style={styles.order_icon}/>
                                <Text style={{color:'#696969',fontSize:12,marginTop:6}}>待付款</Text>

                            </View>
                            <View style={{flex:1,alignItems:'center'}}>
                                <Image source={require('../images/order_icon2.png')} style={styles.order_icon}/>
                                <Text style={{color:'#696969',fontSize:12,marginTop:6}}>待付款</Text>
                                <View style={styles.bub}>
                                    <Text style={{fontSize:11.05,color:'white',backgroundColor:'rgba(0,0,0,0)'}}>10</Text>
                                </View>
                            </View>
                            <View style={{flex:1,alignItems:'center'}}>
                                <Image source={require('../images/order_icon3.png')} style={styles.order_icon}/>
                                <Text style={{color:'#696969',fontSize:12,marginTop:6}}>待付款</Text>
                            </View>
                            <View style={{flex:1,alignItems:'center'}}>
                                <Image source={require('../images/order_icon4.png')} style={styles.order_icon}/>
                                <Text style={{color:'#696969',fontSize:12,marginTop:6}}>待付款</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#F5F5F5'
    },
    personHead: {
        flex: 1,
        height: 238,
    },
    personHead_img: {
        height: 238,
        width:Dimensions.get('window').width,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
    },
    backIcon: {
        width: 12,
        height: 18,
        resizeMode: 'stretch',
    },
    settingIcon:{
        width: 20,
        height: 20,
        resizeMode: 'stretch',
    },
    header_img:{
        width: 73,
        height: 70,
        resizeMode: 'stretch',
    },
    header_bottom:{
        height:60,
        backgroundColor:'rgba(0,0,0,0.25)',
        justifyContent:'flex-end',
        flexDirection:'row'
    },
    header_bottom_con:{
        flex:1,
        borderRightWidth:0.5,
        borderRightColor:'#4EA976',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    searchIcon: {
        marginRight: 2,
        width: 14,
        height: 14,
        resizeMode: 'stretch',
    },
    right_arrow:{
        width: 8,
        height: 10,
        resizeMode: 'stretch',
        marginLeft: 4,
        marginRight: 10,
    },
    order_icon:{
        width:26,
        height:23,
        resizeMode: 'stretch'
    },
    bub:{
        position:'absolute',
        width:15,
        height:15,
        backgroundColor:'#FF9700',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:15,
        right:25,
        top:-10
    }
})