/**
 * Created by renyubin on 16/5/4.
 */
'use strict';
import React, {
    Component,
    View,
    Text,
    ListView,
    PropTypes,
    Image,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Navigator, TextInput,
    Platform
}from 'react-native';
import {
    OrderHeader,
    API,
    NetService,
    Toast,
    PaySuccess,
    WeChatPayAndroid,
    WeChatPayIos,
    Login,
    PayHDFK,
    OrderDFK,
    CartPage,
Loaddingpage
} from './util/Path'

let cartThis = [], WeChatPay;
export default class OrderPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2)=>row1 !== row2,
            }),
            loaded: false,
            name: "",
            mobile: "",
            address: "",
            money: "",
            num: "",
            flag: true,
            wx: <Image source={require('../images/check_icon.png')}
                       style={{width:18,height: 18,resizeMode: 'stretch'}}/>,
            hdfk: <Image source={require('../images/check_icon.png')}
                         style={{width:18,height: 18,resizeMode: 'stretch'}}/>,
            orderPayId: null,
            text: '',
            loadding: null,
            isSubmitOrder: false,
            result: null,
            paytype:null
        };
    }

    componentDidMount() {
        if (Platform.OS === 'ios') {
            WeChatPay = WeChatPayIos;
        } else {
            WeChatPay = WeChatPayAndroid;
        }
        WeChatPay.registerApp();//注册微信
        setTimeout(()=> {
            NetService.postFetchData(API.CONFIRM, '', (result)=>this._callback(result));
        }, 500);
        this.checkpay('wx', 'd3d74b12b76045adaf86dd20cee00574');
    }

    componentDidUnMount() {
        cartThis = [];
    }

    _callback(result) {
        if (result['success'] === false) {
            Toast.show(result['result']['message']);
            return;
        }
        result = result['result'];
        var memberVillage = result['memberVillage'];
        this.setState({
            name: memberVillage['VillageName'],
            mobile: memberVillage['VillageMobile'],
            address: memberVillage['VillageAddress'],
            money: result['cartTotalMoney'],
            num: result['cartList'].length
        });
        if (result['cartList'].length !== 0) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(result['cartList']),
                loaded: true,
            })
        } else {
            this.setState({
                loaded: true,
            })
        }
    }

    _toSubmit() {
        let orderPayId = this.state.orderPayId
        if (orderPayId === null) {
            Toast.show('请选择支付类型!');
            return;
        }
        this.setState({
            loadding: <View
                style={{flex:1,position:'absolute',top:0,width:Dimensions.get('window').width,height:Dimensions.get('window').height,justifyContent:'center',alignItems:'center'}}>
                <View
                    style={{width:200,height:140,backgroundColor:'rgba(0,0,0,0.5)',borderRadius:5,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'white'}}>正在加载,请等候……</Text>
                </View>
            </View>
        });

        let isWXAppInstalled = true;
        if (orderPayId === 'd3d74b12b76045adaf86dd20cee00574') {
            WeChatPay.isWXAppInstalled((res)=> {
                if (res) {
                    submitOrder(this);
                }else{
                    this.setState({
                        loadding:null
                    });
                }
            });
        } else {
            submitOrder(this);
        }
        function submitOrder(_this) {
            _this.setState({
                paytype:orderPayId
            })
            const {navigator}=_this.props;
            if (!_this.state.isSubmitOrder) {
                NetService.postFetchData(API.SUBMIT, 'orderPayId=' + orderPayId + '&orderRemark=' + _this.state.text, (result)=> {
                    if (result['success'] === false) {
                        Toast.show(result['result']['message']);
                        if (result['result']['code'] === 303) {
                            if (navigator) {
                                navigator.push({
                                    component: Login,
                                    sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                                })
                            }
                        }
                        _this.setState({
                            loadding:null
                        });
                        return;
                    }
                    if (navigator) {
                        navigator.replacePrevious({
                            component: CartPage,
                        })
                    }
                    result = result['result'];
                    if (orderPayId === 'd3d74b12b76045adaf86dd20cee00574') {
                        WeChatPay.order(result['OutTradeId'],(result)=>{
                            _this.setState({
                                loadding:null
                            });
                            if(result==='false'){
                                return
                            }
                            if (navigator) {
                                navigator.replace({
                                    component: PaySuccess,
                                    sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                                    params:{result:result}
                                })
                            }
                        });//微信支付
                    } else {
                        if (navigator) {
                            navigator.replace({
                                component: PayHDFK,
                                sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                                params: {result: result}
                            })
                        }
                    }
                    _this.setState({
                        isSubmitOrder: true,
                        result: result
                    });
                });
            } else {
                if (orderPayId === 'd3d74b12b76045adaf86dd20cee00574') {

                    WeChatPay.order(_this.state.result['OutTradeId'],(result)=>{
                        _this.setState({
                            loadding:null
                        });
                        if(result==='false'){
                            return
                        }
                        if (navigator) {
                            navigator.push({
                                component: PaySuccess,
                                sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                                params:{result:result}
                            })
                        }

                    });
                } else {
                    if (navigator) {
                        navigator.push({
                            component: PayHDFK,
                            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                            params: {result: _this.state.result}
                        })
                    }
                }
            }

        }
    }


    checkpay(paystyle, orderPayId) {
        if(this.state.paytype!==orderPayId&&this.state.paytype!==null){
            Toast.show('不能修改支付类型!')
            return;
        }
        switch (paystyle) {
            case 'wx':
                this.setState({
                    wx: <Image source={require('../images/checked_icon.png')}
                               style={{width:18,height: 18,resizeMode: 'stretch'}}/>,
                    hdfk: <Image source={require('../images/check_icon.png')}
                                 style={{width:18,height: 18,resizeMode: 'stretch'}}/>,
                    orderPayId: orderPayId
                });
                break;
            case 'hdfk':
                this.setState({
                    wx: <Image source={require('../images/check_icon.png')}
                               style={{width:18,height: 18,resizeMode: 'stretch'}}/>,
                    hdfk: <Image source={require('../images/checked_icon.png')}
                                 style={{width:18,height: 18,resizeMode: 'stretch'}}/>,
                    orderPayId: orderPayId
                });
                break;
        }
    }

    _onChange(text) {
        this.setState({
            text: text
        })
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return (
            <View style={{flex:1,backgroundColor:'#FAFAFA'}}>
                <View style={{flex:1}}>
                    <OrderHeader navigator={this.props.navigator}/>
                    <ScrollView style={{flex:1,marginBottom:49}}>
                        <View
                            style={{height:84,backgroundColor:'white',flexDirection:'row',padding:12,paddingTop:17,paddingBottom:15,borderBottomWidth:1,borderBottomColor:'#E6E6E6'}}>

                            <View style={{flex:9,justifyContent:'center'}}>
                                <View style={{flexDirection:'row',marginBottom:15}}>
                                    <View style={{flex:1,flexDirection:'row'}}>
                                        <Text style={{color:'#BFBFBF'}}>收货人:</Text><View style={{marginLeft:21}}><Text
                                        style={{color:'#BFBFBF'}}>{this.state.name}</Text></View>
                                    </View>
                                    <View style={{alignItems:'flex-end',flex:1}}>
                                        <Text style={{color:'#BFBFBF'}}>{this.state.mobile}</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={{color:'#BFBFBF'}}>收货地址:</Text>
                                    <View style={{marginLeft:21}}><Text
                                        style={{color:'#BFBFBF'}}>{this.state.address}</Text></View>
                                </View>
                            </View>
                        </View>

                        <ListView
                            initialListSize={14}
                            dataSource={this.state.dataSource}
                            renderRow={(gList)=>this.renderGList(gList)}
                            style={{marginTop:12,borderBottomWidth:1,borderBottomColor:'#E6E6E6',}}
                        />
                        <View
                            style={{flex:1,backgroundColor:'white',marginTop:11,paddingLeft:10,paddingRight:10,borderBottomWidth:1,borderBottomColor:'#E6E6E6'}}>
                            <View style={styles.ordernews}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#3C3C3C'}}>保障服务</Text>
                                </View>
                                <View style={{alignItems:'flex-end',flex:1}}>
                                    <Text style={{fontSize:12}}>送货上门免安装</Text>
                                </View>
                            </View>
                            <View style={styles.ordernews}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#3C3C3C'}}>运费</Text>
                                </View>
                                <View style={{alignItems:'flex-end',flex:1}}>
                                    <Text style={{fontSize:12}}>免运费</Text>
                                </View>
                            </View>
                            <View style={styles.ordernews}>
                                <View>
                                    <Text style={{color:'#3C3C3C'}}>买家留言:</Text>
                                </View>
                                <View style={{alignItems:'flex-end',flex:1}}>
                                    <TextInput
                                        placeholder='选填,可填写您需要的备注信息'
                                        placeholderTextColor={'#BFBFBF'}
                                        onChangeText={(text)=>this._onChange(text)}
                                        underlineColorAndroid='transparent'
                                        value={this.state.text}
                                        style={{height:47,paddingLeft:14,fontSize:14,paddingTop:Platform.OS==='ios'?0:12}}
                                    />
                                </View>
                            </View>
                            <View style={[styles.ordernews,{justifyContent:'flex-end',borderBottomWidth:0}]}>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={{fontSize:12,marginTop:5}}>共计:</Text>
                                    <Text style={[styles.price,{marginTop:6}]}>￥</Text>
                                    <Text
                                        style={[styles.price,{fontSize: 18}]}>{this.state.money}</Text>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{flex:1,backgroundColor:'white',marginTop:11,paddingLeft:10,paddingRight:10,borderBottomWidth:1,borderBottomColor:'#E6E6E6'}}>
                            <View style={[styles.ordernews,{height:38,borderBottomWidth: 0.3,borderBottomColor: 'rgba(191,191,191,0.5)',marginLeft:-10,marginRight:-10,paddingLeft:10}]}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#3C3C3C'}}>选择付款方式</Text>
                                </View>
                            </View>
                            <View style={[styles.ordernews,{height:57}]}>
                                <View style={{flexDirection:'row',flex:1,alignItems:'center'}}>
                                    <Image source={require('../images/wechat_icon.png')}
                                           style={{width:25,height: 25,resizeMode: 'stretch',marginRight:10}}
                                    />
                                    <Text>微信支付</Text>
                                </View>
                                <TouchableWithoutFeedback
                                    onPress={()=>this.checkpay('wx','d3d74b12b76045adaf86dd20cee00574')}>
                                    <View style={{flex:1,alignItems:'flex-end'}}>
                                        {this.state.wx}
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={[styles.ordernews,{borderBottomWidth:0,height:57}]}>
                                <View style={{flexDirection:'row',flex:5,alignItems:'center'}}>
                                    <Image source={require('../images/hdfk.png')}
                                           style={{width:25,height: 25,resizeMode: 'stretch',marginRight:10}}
                                    />
                                    <Text>货到付款</Text>
                                </View>
                                <TouchableWithoutFeedback
                                    onPress={()=>this.checkpay('hdfk','7be9eb00370b4dd99ddd129708fec4d8')}>
                                    <View style={{flex:1,alignItems:'flex-end'}}>
                                        {this.state.hdfk}
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View>
                    <View style={{flexDirection:'row',height:49,backgroundColor:'white',position:'absolute',bottom:0,width:Dimensions.get('window').width,borderTopWidth:1,borderTopColor:Platform.OS === 'ios'?'rgba(213,213,213,0.5)':'rgba(213,213,213,1)'}}>
                        <View
                            style={[styles.bom,{flex:2, paddingLeft:10, flexDirection:'row', justifyContent:'flex-end',paddingRight:10}]}>
                            <Text style={{fontSize:12,marginTop:1}}>共计:</Text>
                            <Text style={[styles.price,{marginTop:4}]}>￥</Text>
                            <Text
                                style={[styles.price,{fontSize: 18}]}>{this.state.money}</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>this._toSubmit()}>
                            <View style={[styles.bom,{width:110,backgroundColor:'#16BD42'}]}>
                                <Text style={{fontSize:14,color:'white'}}>立即支付({this.state.num})</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                {this.state.loadding}
            </View>
        )
    }

    renderLoadingView() {
        return (
            <View style={{flex:1}}>
                <OrderHeader navigator={this.props.navigator} id={this.props.id}/>
                <Loaddingpage/>
            </View>
        );
    }

    renderGList(gList) {

        return (
            <CartList gList={gList}/>
        )
    }
}
let prevThis = null;
class CartList extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            borderBottomWidth: 0
        };
    }

    componentDidMount() {
        if (prevThis !== null) {
            prevThis.setState({
                borderBottomWidth: 0.5
            });
        }
        prevThis = this;
    }

    texthandle(text) {
        var rtnText = "";
        let index = text.indexOf('-');
        if (index > 0) {
            rtnText = text.substring(0, index);
        }
        if (rtnText.length > 30) {
            rtnText = rtnText.substring(0, 25) + '……'
        } else {
            rtnText = rtnText;
        }

        return rtnText;
    }

    render() {
        return (
            <View style={styles.goods_view}>
                <View style={[styles.goods_view_view,{borderBottomWidth:this.state.borderBottomWidth}]}>
                    <View style={{flexDirection:'row',flex:7}}>
                        <View
                            style={{height:84,width:84,justifyContent:'center',alignItems:'center',borderWidth:0.5,borderColor:'rgba(191,191,191,0.5)',borderRadius:3}}>
                            <Image source={{uri:this.props.gList['imgUrl']}}
                                   style={{height:82,width:82,resizeMode:'stretch'}}/>
                        </View>
                        <View style={{flex:4,marginLeft:10}}>
                            <Text
                                style={{color:'#898989',fontSize:14,height:63}}>{this.texthandle(this.props.gList['name'])}</Text>
                            <Text
                                style={{color:'#C8C8C8',fontSize:12}}>规格:{this.props.gList['skuSpecification'].substring(0, 30)}</Text>
                        </View>
                    </View>

                    <View style={{flex:2,alignItems:'flex-end',paddingRight:2}}>
                        <View style={{height:60}}>
                            <Text style={{color:'#FF0200',fontSize:12}}>￥<Text
                                style={{fontSize:18}}>{this.props.gList['price']}</Text></Text>
                        </View>
                        <View>
                            <Text style={{color:'#C8C8C8',fontSize:16}}>×{this.props.gList['buySum']}</Text>
                        </View>
                    </View>
                </View>
            </View>

        );
    }
}
const styles = StyleSheet.create({

    goods_view: {
        backgroundColor: 'white',
        height: 115,
        flex: 1
    },

    goods_view_view: {
        height: 115,
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        borderBottomColor: 'rgba(191,191,191,0.5)',
        paddingTop: 14,
        paddingBottom: 16,
        alignItems: 'center'
    },
    price: {
        color: '#FF0200',
        fontSize: 12
    },
    sort: {
        backgroundColor: '#efefef',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        width: 100,
        height: 30,
        borderRadius: 3
    },
    sortText: {
        fontSize: 12
    },
    bom: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    check: {
        width: 18,
        height: 18,
        marginRight: 7,
    },
    goods_view1: {
        width: (Dimensions.get('window').width) / 2 - 3,
        backgroundColor: 'white',
        marginBottom: 5,
        shadowColor: "rgb(0,0,0)",
        shadowOpacity: 0.1,
        shadowRadius: 0,
        shadowOffset: {
            height: 0.5,
            width: 0
        }
    },
    ordernews: {
        height: 47,
        borderBottomWidth: 0.3,
        borderBottomColor: 'rgba(191,191,191,0.5)',
        flexDirection: 'row',
        alignItems: 'center'
    }
})