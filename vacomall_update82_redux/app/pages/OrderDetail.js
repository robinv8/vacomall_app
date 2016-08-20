/**
 * Created by renyubin on 16/6/25.
 */
'use strict';
import React,{
    Component,
}from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    Text,
    Platform,
    StatusBar,
    ListView,
    Dimensions,
    Navigator,
    ScrollView
} from 'react-native';
import {API, NetService, Toast, Login,OrderDetailHeader,LinearGradient,WeChatPayAndroid,WeChatPayIos,PaySuccess,OrderExpress,Loaddingpage,ReturnSKUEdit} from './util/Path';
let WeChatPay;
export default class OrderDetail extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2)=>row1 !== row2
            }),
            orderState: <View
                style={{flex:1,backgroundColor:'rgba(0,0,0,0)',justifyContent:'center',paddingLeft:29}}></View>,
            ConsignessName: null,
            ConsignessMoblie: null,
            ConsignessAddress: null,
            OrderPayMoney: null,
            handle: null,
            liststate: null,
            isExpress: false,
            result: null,
            loaded: false,
            isReturn: false,
            OrderStatus: null,
            ReturnSku:false
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
            NetService.getFetchData(API.ORDERDETAILINFO + '?orderId=' + this.props.orderId, (result)=> {
                const {navigator}=this.props;
                if (result['success'] === false) {
                    Toast.show(result['message']);
                    if (result['code'] === 303) {
                        if (navigator) {
                            navigator.push({
                                component: Login,
                                sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                            })
                        }
                    }

                    return;
                }
                this.setState({
                    loaded: true,
                    result: result,
                    orderState: <View
                        style={{flex:1,backgroundColor:'rgba(0,0,0,0)',justifyContent:'center',paddingLeft:29}}>
                        <Text
                            style={{color:'white',fontSize:18,marginBottom:5}}>{result['orders']['OrderStatusInfo']}</Text>
                        <Text style={{color:'white'}}>{result['orders']['OrderStatusInfoExt']}</Text>
                    </View>,
                    ConsignessName: result['consignee']['ConsignessName'],
                    ConsignessMoblie: result['consignee']['ConsignessMoblie'],
                    ConsignessAddress: result['consignee']['ConsignessCityName'] + ' ' + result['consignee']['ConsignessAddress'],
                    dataSource: this.state.dataSource.cloneWithRows(result['orders']['ordersGoods']),
                    OrderPayMoney: result['orders']['OrderPayMoney'],
                    OrderStatus: result['orders']['OrderStatus'],
                    ReturnSku:result['orders']['ReturnSku']
                })
                switch (this.state.OrderStatus) {
                    case 100:
                        this.setState({
                            handle: <View
                                style={{flexDirection:'row',marginTop:13,height:49,backgroundColor:'white',alignItems:'center',justifyContent:'flex-end'}}>
                                <TouchableWithoutFeedback onPress={(orderId)=>this.cancelOrder(this.props.orderId)}>
                                    <View style={styles.btn}><Text style={{color:'#898989'}}>取消订单</Text></View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={(orderId)=>this._toSubmit(this.props.orderId)}>
                                    <View style={[styles.btn,styles.btn1]}><Text
                                        style={{color:'white'}}>去支付</Text></View>
                                </TouchableWithoutFeedback>
                            </View>
                        })
                        break;
                    case 200:
                        this.setState({
                            handle: null,
                        })
                        break;
                    case 300:
                        if (result['orders']['OrderExtType'] === 1) {
                            this.setState({
                                handle: <View
                                    style={{flexDirection:'row',marginTop:13,height:49,backgroundColor:'white',alignItems:'center',justifyContent:'flex-end'}}>
                                    <TouchableWithoutFeedback onPress={(orderId)=>this.submitOrder(this.props.orderId)}>
                                        <View style={[styles.btn,styles.btn1]}><Text
                                            style={{color:'white'}}>确认收货</Text></View>
                                    </TouchableWithoutFeedback>
                                </View>,
                                isExpress: true
                            })
                        } else {
                            this.setState({
                                handle: <View
                                    style={{flexDirection:'row',marginTop:13,height:49,backgroundColor:'white',alignItems:'center',justifyContent:'flex-end'}}>
                                    <TouchableWithoutFeedback onPress={(orderId)=>this.submitOrder(this.props.orderId)}>
                                        <View style={[styles.btn,styles.btn1]}><Text
                                            style={{color:'white'}}>确认收货</Text></View>
                                    </TouchableWithoutFeedback>
                                </View>
                            })
                        }

                        break;
                    case 400:
                        this.setState({
                            handle: null,
                            isReturn: true
                        })
                        break;
                    case 500:
                        this.setState({
                            handle: null
                        })
                        break;
                }
            })
        }, 500)

    }


    cancelOrder(orderId) {
        const {navigator}=this.props;
        NetService.postFetchData(API.CANCELORDER, 'orderId=' + orderId, (result)=> {
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
                return;
            }
            if (navigator) {
                navigator.pop()
            }
            Toast.show(result['result']['message']);
        })
    }

    submitOrder(orderId) {
        const {navigator}=this.props;
        NetService.postFetchData(API.ORDERCONFIRM, 'orderId=' + orderId, (result)=> {
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
                return;
            }
            if (navigator) {
                navigator.pop()
            }
            Toast.show(result['result']['message']);
        })
    }

    _toSubmit(orderId) {
        const {navigator}=this.props;
        let orderPayId = orderId;
        this.setState({
            loadding: <View
                style={{flex:1,position:'absolute',top:0,width:Dimensions.get('window').width,height:Dimensions.get('window').height,justifyContent:'center',alignItems:'center'}}>
                <View
                    style={{width:200,height:140,backgroundColor:'rgba(0,0,0,0.5)',borderRadius:5,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'white'}}>正在加载,请等候……</Text>
                </View>
            </View>
        });

        WeChatPay.isWXAppInstalled((res)=> {
            if (res) {
                WeChatPay.order(orderPayId, (result)=> {
                    this.setState({
                        loadding: null
                    });
                    if(result==='false'){
                        return
                    }
                    if (navigator) {
                        navigator.push({
                            component: PaySuccess,
                            sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                            params: {result: result}
                        })
                    }
                });

            }
        });

    }

    renderGList(gList) {
        return (
            <CartList gList={gList} OrderStatus={this.state.OrderStatus} isExpress={this.state.isExpress}
                      isReturn={this.state.isReturn} ReturnSku={this.state.ReturnSku} navigator={this.props.navigator} result={this.state.result}/>
        )
    }

    renderLoadingView() {
        return (
            <View style={{flex:1}}>
                <OrderDetailHeader navigator={this.props.navigator}/>
                <Loaddingpage/>
            </View>
        );
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return (
            <View style={{backgroundColor:'#FAFAFA',flex:1}}>
                <OrderDetailHeader navigator={this.props.navigator}/>
                <ScrollView>
                    <LinearGradient
                        start={[0.0, 0.25]} end={[0.5, 1.0]}
                        locations={[0,0.5,1]}
                        colors={['#00C800', '#0BC321', '#16BD42']}
                        style={styles.linearGradient}>
                        {this.state.orderState}
                        <View style={{justifyContent:'center',marginRight:30}}>
                            <Image source={require('../images/orderDetail/order_icon1.png')}
                                   style={{width:62,height:55}}/>
                        </View>
                    </LinearGradient>
                    <View
                        style={{height:66,backgroundColor:'white',marginBottom:15,borderBottomWidth:1,borderBottomColor:'rgba(230,230,230,1)',paddingLeft:12,paddingRight:12}}>
                        <View style={{flexDirection:'row',height:66,alignItems:'center'}}>
                            <View>
                                <Image source={require('../images/orderDetail/order_icon3.png')}
                                       style={{width:15,height:21,marginLeft:5}}></Image>
                            </View>
                            <View style={{marginLeft:14,flex:1}}>
                                <View style={{flex:1,flexDirection:'row',marginBottom:6}}>
                                    <View style={{alignItems:'flex-end'}}>
                                        <Text style={{color:'#BFBFBF'}}>收货人:{this.state.ConsignessName}</Text>
                                    </View>
                                    <View style={{flex:1,alignItems:'flex-end'}}>
                                        <Text style={{color:'#BFBFBF'}}>{this.state.ConsignessMoblie}</Text>
                                    </View>
                                </View>
                                <Text style={{color:'#BFBFBF'}}>收货地址:{this.state.ConsignessAddress}</Text>
                            </View>
                        </View>
                    </View>

                    <View
                        style={{backgroundColor:'white',marginBottom:15,borderBottomWidth:1,borderBottomColor:'rgba(230,230,230,1)',paddingLeft:12,paddingRight:12}}>
                        <ListView
                            dataSource={this.state.dataSource}
                            enableEmptySections={true}
                            renderRow={(gList)=>this.renderGList(gList)}
                        />
                        <View style={{height:83,justifyContent:'center'}}>
                            <View style={{flexDirection:'row',marginBottom:11}}>
                                <View><Text style={{color:'#3C3C3C'}}>运费</Text></View>
                                <View style={{alignItems:'flex-end',flex:1}}><Text>￥0.00</Text></View>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <View><Text>实付款(含运费)</Text></View>
                                <View style={{alignItems:'flex-end',flex:1}}><Text
                                    style={{color:'#FD3824',fontSize:12}}>￥<Text
                                    style={{fontSize:18}}>{this.state.OrderPayMoney}</Text></Text></View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                {this.state.handle}
                {this.state.loadding}
            </View>
        )
    }
}
class CartList extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            borderBottomWidth: 0.5,
            liststate: null
        };
    }

    componentDidMount() {
        if(this.props.result['orders']['OrderExtType']===2){
            return;
        }
        switch (this.props.OrderStatus) {
            case 100:
                this.setState({
                    liststate: <View style={{flexDirection:'row',marginTop:13}}>
                        <TouchableWithoutFeedback
                            onPress={()=>this.selectExpress(this.props.gList['OrdersId'],this.props.gList['SkuCode'])}>
                            <View style={[styles.min_btn]}><Text
                                style={{color:'#898989',fontSize:12}}>查看物流 </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                })
                break;
            case 200:
                this.setState({
                    liststate: <View style={{flexDirection:'row',marginTop:13}}>
                        <TouchableWithoutFeedback
                            onPress={()=>this.selectExpress(this.props.gList['OrdersId'],this.props.gList['SkuCode'])}>
                            <View style={[styles.min_btn]}><Text
                                style={{color:'#898989',fontSize:12}}>查看物流 </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                })
                break;
            case 300:
                this.setState({
                    liststate: <View style={{flexDirection:'row',marginTop:13}}>
                        <TouchableWithoutFeedback
                            onPress={()=>this.selectExpress(this.props.gList['OrdersId'],this.props.gList['SkuCode'])}>
                            <View style={[styles.min_btn]}><Text
                                style={{color:'#898989',fontSize:12}}>查看物流 </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                })

                break;
            case 400:
                if(this.props.ReturnSku){
                    this.setState({
                        liststate: <View style={{flexDirection:'row',marginTop:13}}>
                            <TouchableWithoutFeedback
                                onPress={()=>this.selectExpress(this.props.gList['OrdersId'],this.props.gList['SkuCode'])}>
                                <View style={[styles.min_btn,{marginRight:10}]}><Text
                                    style={{color:'#898989',fontSize:12}}>查看物流 </Text>
                                </View>
                            </TouchableWithoutFeedback><TouchableWithoutFeedback
                                onPress={()=>this.toReturnSKU(this.props.gList['Id'])}>
                                <View style={[styles.min_btn]}><Text
                                    style={{color:'#898989',fontSize:12}}>申请退货 </Text></View>
                            </TouchableWithoutFeedback>
                        </View>
                    })
                }else{
                    this.setState({
                        liststate: <View style={{flexDirection:'row',marginTop:13}}>
                            <TouchableWithoutFeedback
                                onPress={()=>this.selectExpress(this.props.gList['OrdersId'],this.props.gList['SkuCode'])}>
                                <View style={[styles.min_btn]}><Text
                                    style={{color:'#898989',fontSize:12}}>查看物流 </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    })
                }

                break;
            case 500:
                this.setState({
                    liststate: <View style={{flexDirection:'row',marginTop:13}}>
                        <TouchableWithoutFeedback
                            onPress={()=>this.toReturnSKU(this.props.gList['goodsId'])}>
                            <View style={[styles.min_btn]}><Text
                                style={{color:'#898989',fontSize:12}}>查看物流 </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                })
                break;
        }
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

    selectExpress(OrdersId, SkuCode) {
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: OrderExpress,
                params: {
                    OrdersId: OrdersId,
                    SkuCode: SkuCode,
                    img: this.props.gList['SpuDefaultImage'],
                    orderState: this.props.result['orders']['OrderStatusInfo'],
                    orderCode: this.props.result['orders']['OrderCode']
                }
            })
        }
    }

    toReturnSKU(goodsId) {
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: ReturnSKUEdit,
                params: {
                    goodsId: goodsId
                }
            })
        }
    }

    render() {
        return (
            <View style={styles.goods_view}>
                <View style={[styles.goods_view_view,{borderBottomWidth:this.state.borderBottomWidth}]}>
                    <View style={{flexDirection:'row',flex:7}}>
                        <View
                            style={{height:84,width:84,justifyContent:'center',alignItems:'center',borderWidth:0.5,borderColor:'rgba(191,191,191,0.5)',borderRadius:3}}>
                            <Image source={{uri:this.props.gList['SpuDefaultImage']}}
                                   style={{height:82,width:82,resizeMode:'stretch'}}/>
                        </View>
                        <View style={{flex:4,marginLeft:10,marginTop:5}}>
                            <Text
                                style={{color:'#BFBFBF',fontSize:14}}>{this.texthandle(this.props.gList['SkuTitle'])}</Text>
                            <Text
                                style={{color:'#BFBFBF',fontSize:12,marginTop:6}}>规格:{this.props.gList['SkuSpecification']}</Text>
                        </View>
                    </View>

                    <View
                        style={{flex:2,alignItems:'flex-end',paddingRight:2,height:114,paddingTop:20,justifyContent:'flex-start'}}>
                        <View>
                            <Text style={{color:'#BFBFBF',fontSize:10}}>￥<Text
                                style={{fontSize:14}}>{this.props.gList['SkuSalePrice']}</Text></Text>
                        </View>
                        <View style={{marginTop:5}}>
                            <Text style={{color:'#C8C8C8',fontSize:16}}>×{this.props.gList['SkuNum']}</Text>
                        </View>
                        {this.state.liststate}
                    </View>
                </View>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        height: 100,
        flexDirection: 'row'
    },
    goods_view_view: {
        height: 115,
        flexDirection: 'row',

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
    btn: {
        width: 90,
        height: 32,
        borderWidth: 1,
        borderColor: '#898989',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn1: {
        marginLeft: 10,
        backgroundColor: '#16BD42',
        borderWidth: 0,
        marginRight: 12,
    },
    min_btn: {
        width: 54,
        height: 20,
        borderWidth: 0.5,
        borderColor: '#898989',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
})
