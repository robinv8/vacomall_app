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
    Navigator
} from 'react-native';
import {API, NetService, Toast, Login,OrderDetail,WeChatPayAndroid,WeChatPayIos,PaySuccess} from '../util/Path';
let WeChatPay;
export default class OrderList extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2)=>row1 !== row2
            }),
            handle: null,
            liststate: null
        };
    }

    /*
     * <View style={{flexDirection:'row',marginTop:13}}>
     <View style={styles.btn}><Text style={{color:'#898989'}}>取消订单</Text></View>
     <View style={[styles.btn,styles.btn1]}><Text style={{color:'white'}}>去支付</Text></View>
     </View>*/
    cancelOrder(orderId) {
        const {navigator}=this.props._this.props;
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
            this.props._this.setState({
                page: 1,
                isloaded: false,
                loaded: false,
                listArray: []
            });
            this.props._this.loadData();
            Toast.show(result['result']['message']);
        })
    }

    submitOrder(orderId) {
        const {navigator}=this.props._this.props._this.props;
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
            this.props._this.setState({
                page: 1,
                isloaded: false,
                loaded: false,
                listArray: []
            });
            this.props._this.loadData();
            Toast.show(result['result']['message']);
        })
    }

    componentDidMount() {
        if (Platform.OS === 'ios') {
            WeChatPay = WeChatPayIos;
        } else {
            WeChatPay = WeChatPayAndroid;
        }
        WeChatPay.registerApp();//注册微信
        prevThis = null
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.props.gList['goods']),
        });
        switch (this.props.gList['OrderStatus']) {
            case 100:
                this.setState({
                    handle: <View style={{flexDirection:'row',marginTop:13}}>
                        <TouchableWithoutFeedback onPress={(orderId)=>this.cancelOrder(this.props.gList['Id'])}>
                            <View style={styles.btn}><Text style={{color:'#898989'}}>取消订单</Text></View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={(orderId,OrderPayId)=>this._toSubmit(this.props.gList['Id'],this.props.gList['OrderPayId'])}>
                            <View style={[styles.btn,styles.btn1]}><Text style={{color:'white'}}>去支付</Text></View>
                        </TouchableWithoutFeedback>
                    </View>,
                    liststate: <View style={{flexDirection:'row',marginTop:13}}>
                        <View style={[styles.min_btn]}><Text style={{color:'#FF9700',fontSize:12}}>待支付 </Text></View>
                    </View>
                })
                break;
            case 200:
                this.setState({
                    handle: null,
                    liststate: <View style={{flexDirection:'row',marginTop:13}}>
                        <View style={[styles.min_btn]}><Text style={{color:'#FF9700',fontSize:12}}>待发货 </Text></View>
                    </View>
                })
                break;
            case 300:
                this.setState({
                    handle: <View style={{flexDirection:'row',marginTop:13}}>
                        <TouchableWithoutFeedback onPress={(orderId)=>this.submitOrder(this.props.gList['Id'])}>
                            <View style={[styles.btn,styles.btn1]}><Text style={{color:'white'}}>确认收货</Text></View>
                        </TouchableWithoutFeedback>
                    </View>,
                    liststate: <View style={{flexDirection:'row',marginTop:13}}>
                        <View style={[styles.min_btn]}><Text style={{color:'#FF9700',fontSize:12}}>已发货 </Text></View>
                    </View>
                })
                break;
            case 500:
                this.setState({
                    handle: null,
                    liststate: <View style={{flexDirection:'row',marginTop:13}}>
                        <View style={[styles.min_btn]}><Text style={{color:'#FF9700',fontSize:12}}>请退款 </Text></View>
                    </View>
                })
                break;

        }
    }

    _toSubmit(orderId, OrderPayId) {
        const {navigator}=this.props._this.props._this.props;
        if (OrderPayId !== 'd3d74b12b76045adaf86dd20cee00574') {
            Toast.show('货到付款订单,请到PC端支付');
            return;
        }

        this.props._this.setState({
            loadding: <View
                style={{flex:1,position:'absolute',top:-100,width:Dimensions.get('window').width,height:Dimensions.get('window').height,justifyContent:'center',alignItems:'center'}}>
                <View
                    style={{width:200,height:140,backgroundColor:'rgba(0,0,0,0.5)',borderRadius:5,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'white'}}>正在加载,请等候……</Text>
                </View>
            </View>
        });

        WeChatPay.isWXAppInstalled((res)=> {
            this.props._this.setState({
                loadding: null
            });
            if (res) {
                WeChatPay.order(orderId, (result)=> {
                    this.props._this.setState({
                        loadding: null
                    });
                    if (result === 'false') {
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

    componentDidUnMount() {

    }

    renderGList(gList) {
        return (
            <CartList gList={gList} liststate={this.state.liststate}
                      navigator={this.props._this.props._this.props.navigator} _this={this.props._this}/>
        )
    }

    render() {
        return (
            <View style={{backgroundColor:'#FAFAFA',flex:1}}>
                <View style={styles.orderWrap}>
                    <View style={{height:48,justifyContent:'center',borderBottomWidth:0.5,borderBottomColor:'#BFBFBF'}}>
                        <Text style={{color:'#BFBFBF'}}>订单编号:{this.props.gList['OrderCode']}</Text>
                    </View>
                    <ListView
                        dataSource={this.state.dataSource}
                        enableEmptySections={true}
                        renderRow={(gList)=>this.renderGList(gList)}
                    />
                    <View style={{justifyContent:'center',alignItems:'flex-end',marginTop:17,marginBottom:20}}>
                        <View>
                            <Text style={{color:'#898989'}}>共计{this.props.gList['goods'].length}件商品 合计:<Text
                                style={{color:'#FD3824',fontSize:12}}>￥</Text>
                                <Text
                                    style={{color:'#FD3824',fontSize:18}}>{this.props.gList['OrderPayMoney']}</Text></Text></View>
                        {this.state.handle}
                    </View>
                </View>
            </View>
        )
    }
}
var prevThis = null;
class CartList extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            borderBottomWidth: 1.5
        };
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

    toOrderDetail(OrderId) {
        this.props._this.setState({
            isloaded: true
        })
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: OrderDetail,
                params: {orderId: OrderId}
            })
        }
    }

    render() {
        return (
            <View style={styles.goods_view}>
                <TouchableWithoutFeedback onPress={(OrderId)=>this.toOrderDetail(this.props.gList['OrdersId'])}>
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
                            {this.props.liststate}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    orderWrap: {
        backgroundColor: '#FFFFFF',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E6E6E6',
        paddingLeft: 10,
        paddingRight: 10
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
        borderWidth: 0
    },
    min_btn: {
        width: 54,
        height: 20,
        borderWidth: 0.5,
        borderColor: '#FF9700',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    goods_view: {
        backgroundColor: 'white',
        height: 114,
        flex: 1
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
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(191,191,191,0.5)',
        flexDirection: 'row',
        alignItems: 'center'
    }
})