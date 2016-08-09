/**
 * Created by renyubin on 16/5/4.
 */
'use strict';
import React, {
    Component,
}from 'react';
import {
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
import {getHeight} from './util/response';
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
                       style={{width: getHeight(18), height: getHeight(18), resizeMode: 'stretch'}}/>,
            hdfk: <Image source={require('../images/check_icon.png')}
                         style={{width: getHeight(18), height: getHeight(18), resizeMode: 'stretch'}}/>,
            orderPayId: null,
            text: '',
            loadding: null,
            isSubmitOrder: false,
            result: null,
            paytype: null
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
                style={{
                    flex: 1,
                    position: 'absolute',
                    top: 0,
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <View
                    style={{
                        width: getHeight(200),
                        height: getHeight(140),
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <Text style={{color: 'white'}}>正在加载,请等候……</Text>
                </View>
            </View>
        });

        let isWXAppInstalled = true;
        if (orderPayId === 'd3d74b12b76045adaf86dd20cee00574') {
            WeChatPay.isWXAppInstalled((res)=> {
                if (res) {
                    submitOrder(this);
                }
            });
        } else {
            submitOrder(this);
        }
        function submitOrder(_this) {
            _this.setState({
                paytype: orderPayId
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
                            loadding: null
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
                        WeChatPay.order(result['OutTradeId'], (result)=> {
                            _this.setState({
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
                        });//微信支付
                    } else {
                        if (navigator) {
                            navigator.push({
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

                    WeChatPay.order(_this.state.result['OutTradeId'], (result)=> {
                        _this.setState({
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
        if (this.state.paytype !== orderPayId && this.state.paytype !== null) {
            Toast.show('不能修改支付类型!')
            return;
        }
        switch (paystyle) {
            case 'wx':
                this.setState({
                    wx: <Image source={require('../images/checked_icon.png')}
                               style={{width: getHeight(18), height: getHeight(18), resizeMode: 'stretch'}}/>,
                    hdfk: <Image source={require('../images/check_icon.png')}
                                 style={{width: getHeight(18), height: getHeight(18), resizeMode: 'stretch'}}/>,
                    orderPayId: orderPayId
                });
                break;
            case 'hdfk':
                this.setState({
                    wx: <Image source={require('../images/check_icon.png')}
                               style={{width: getHeight(18), height: getHeight(18), resizeMode: 'stretch'}}/>,
                    hdfk: <Image source={require('../images/checked_icon.png')}
                                 style={{width: getHeight(18), height: getHeight(18), resizeMode: 'stretch'}}/>,
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
            <View style={{flex: 1, backgroundColor: '#FAFAFA'}}>
                <View style={{flex: 1}}>
                    <OrderHeader navigator={this.props.navigator}/>
                    <ScrollView style={{flex: 1, marginBottom: getHeight(49)}}>
                        <View
                            style={{
                                height: getHeight(84),
                                backgroundColor: 'white',
                                flexDirection: 'row',
                                padding: getHeight(12),
                                paddingTop: getHeight(17),
                                paddingBottom: getHeight(15),
                                borderBottomWidth: 1,
                                borderBottomColor: '#E6E6E6'
                            }}>

                            <View style={{flex: 9, justifyContent: 'center'}}>
                                <View style={{flexDirection: 'row', marginBottom: getHeight(15)}}>
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                        <Text style={{color: '#BFBFBF',fontSize:getHeight(14)}}>收货人:</Text><View style={{marginLeft: getHeight(21)}}><Text
                                        style={{color: '#BFBFBF',fontSize:getHeight(14)}}>{this.state.name}</Text></View>
                                    </View>
                                    <View style={{alignItems: 'flex-end', flex: 1}}>
                                        <Text style={{color: '#BFBFBF',fontSize:getHeight(14)}}>{this.state.mobile}</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{color: '#BFBFBF',fontSize:getHeight(14)}}>收货地址:</Text>
                                    <View style={{marginLeft: getHeight(21)}}><Text
                                        style={{color: '#BFBFBF',fontSize:getHeight(14)}}>{this.state.address}</Text></View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <ListView
                                initialListSize={14}
                                dataSource={this.state.dataSource}
                                renderRow={(gList)=>this.renderGList(gList)}
                                style={{marginTop: getHeight(12), borderBottomWidth: 1, borderBottomColor: '#E6E6E6',paddingBottom:1}}
                            />
                        </View>
                        <View
                            style={{
                                backgroundColor: 'white',
                                marginTop: getHeight(11),
                                paddingLeft: getHeight(10),
                                paddingRight: getHeight(10),
                                borderBottomWidth: 1,
                                borderBottomColor: '#E6E6E6'
                            }}>
                            <View style={styles.ordernews}>
                                <View style={{flex: 1}}>
                                    <Text style={{color: '#3C3C3C',fontSize:getHeight(14)}}>保障服务</Text>
                                </View>
                                <View style={{alignItems: 'flex-end', flex: 1}}>
                                    <Text style={{fontSize: getHeight(12)}}>送货上门免安装</Text>
                                </View>
                            </View>
                            <View style={styles.ordernews}>
                                <View style={{flex: 1}}>
                                    <Text style={{color: '#3C3C3C',fontSize:getHeight(14)}}>运费</Text>
                                </View>
                                <View style={{alignItems: 'flex-end', flex: 1}}>
                                    <Text style={{fontSize: getHeight(12)}}>免运费</Text>
                                </View>
                            </View>
                            <View style={styles.ordernews}>
                                <View>
                                    <Text style={{color: '#3C3C3C',fontSize:getHeight(14)}}>买家留言:</Text>
                                </View>
                                <View style={{flex: 1}}>
                                    <TextInput
                                        placeholder='选填,可填写您需要的备注信息'
                                        placeholderTextColor={'#BFBFBF'}
                                        onChangeText={(text)=>this._onChange(text)}
                                        underlineColorAndroid='transparent'
                                        value={this.state.text}
                                        style={{
                                            height: getHeight(47),
                                            paddingLeft: getHeight(14),
                                            fontSize: getHeight(14),
                                            padding:0,
                                            width:getHeight(414-100)
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={[styles.ordernews, {justifyContent: 'flex-end', borderBottomWidth: 0,height:getHeight(47)}]}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontSize: getHeight(12), marginTop: getHeight(5)}}>共计:</Text>
                                    <Text style={[styles.price, {marginTop: getHeight(6)}]}>￥</Text>
                                    <Text
                                        style={[styles.price, {fontSize: getHeight(18)}]}>{this.state.money}</Text>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'white',
                                marginTop: getHeight(11),
                                paddingLeft: getHeight(10),
                                paddingRight: getHeight(10),
                                borderBottomWidth: 1,
                                borderBottomColor: '#E6E6E6'
                            }}>
                            <View style={[styles.ordernews, {
                                height: getHeight(38),
                                borderBottomWidth: 0.5,
                                borderBottomColor: '#f0f0f0',
                                marginLeft: getHeight(-10),
                                marginRight: getHeight(-10),
                                paddingLeft: getHeight(10)
                            }]}>
                                <View style={{flex: 1}}>
                                    <Text style={{color: '#3C3C3C',fontSize:getHeight(14)}}>选择付款方式</Text>
                                </View>
                            </View>
                            <View style={[styles.ordernews, {height: getHeight(57)}]}>
                                <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                                    <Image source={require('../images/wechat_icon.png')}
                                           style={{width: getHeight(25), height: getHeight(25), resizeMode: 'stretch', marginRight: getHeight(10)}}
                                    />
                                    <Text style={{fontSize:getHeight(14)}}>微信支付</Text>
                                </View>
                                <TouchableWithoutFeedback
                                    onPress={()=>this.checkpay('wx', 'd3d74b12b76045adaf86dd20cee00574')}>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        {this.state.wx}
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={[styles.ordernews, {borderBottomWidth: 0, height: getHeight(57)}]}>
                                <View style={{flexDirection: 'row', flex: 5, alignItems: 'center'}}>
                                    <Image source={require('../images/hdfk.png')}
                                           style={{width: getHeight(25), height: getHeight(25), resizeMode: 'stretch', marginRight: getHeight(10)}}
                                    />
                                    <Text style={{fontSize:getHeight(14)}}>货到付款</Text>
                                </View>
                                <TouchableWithoutFeedback
                                    onPress={()=>this.checkpay('hdfk', '7be9eb00370b4dd99ddd129708fec4d8')}>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        {this.state.hdfk}
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View>
                    <View style={{
                        flexDirection: 'row',
                        height: getHeight(49),
                        backgroundColor: 'white',
                        position: 'absolute',
                        bottom: 0,
                        width: Dimensions.get('window').width,
                        borderTopWidth: 1,
                        borderTopColor: Platform.OS === 'ios' ? 'rgba(213,213,213,0.5)' : 'rgba(213,213,213,1)'
                    }}>
                        <View
                            style={[styles.bom, {
                                flex: 2,
                                paddingLeft: getHeight(10),
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                paddingRight: getHeight(10)
                            }]}>
                            <Text style={{fontSize: getHeight(12), marginTop: 1}}>共计:</Text>
                            <Text style={[styles.price, {marginTop: getHeight(4)}]}>￥</Text>
                            <Text
                                style={[styles.price, {fontSize: getHeight(18)}]}>{this.state.money}</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>this._toSubmit()}>
                            <View style={[styles.bom, {width: getHeight(110), backgroundColor: '#16BD42'}]}>
                                <Text style={{fontSize: getHeight(14), color: 'white'}}>立即支付({this.state.num})</Text>
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
            <View style={{flex: 1}}>
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
                <View style={[styles.goods_view_view, {borderBottomWidth: this.state.borderBottomWidth}]}>
                    <View style={{flexDirection: 'row', flex: 7}}>
                        <View
                            style={{
                                height: getHeight(84),
                                width: getHeight(84),
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 0.5,
                                borderColor: '#efefef',
                                borderRadius: 3
                            }}>
                            <Image source={{uri: this.props.gList['imgUrl']}}
                                   style={{height: getHeight(82), width: getHeight(81), resizeMode: 'stretch'}}/>
                        </View>
                        <View style={{flex: 4, marginLeft: getHeight(10)}}>
                            <Text
                                style={{
                                    color: '#898989',
                                    fontSize: getHeight(14),
                                    height: getHeight(63)
                                }}>{this.texthandle(this.props.gList['name'])}</Text>
                            <Text
                                style={{
                                    color: '#C8C8C8',
                                    fontSize: getHeight(12)
                                }}>规格:{this.props.gList['skuSpecification'].substring(0, 30)}</Text>
                        </View>
                    </View>

                    <View style={{flex: 2, alignItems: 'flex-end', paddingRight: getHeight(2)}}>
                        <View style={{height: getHeight(60)}}>
                            <Text style={{color: '#FF0200', fontSize: getHeight(12)}}>￥<Text
                                style={{fontSize: getHeight(18)}}>{this.props.gList['price']}</Text></Text>
                        </View>
                        <View>
                            <Text style={{color: '#C8C8C8', fontSize: getHeight(16)}}>×{this.props.gList['buySum']}</Text>
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
        height: getHeight(115),
        flex: 1
    },

    goods_view_view: {
        height: getHeight(115),
        flexDirection: 'row',
        marginLeft: getHeight(10),
        marginRight: getHeight(10),
        borderBottomColor: '#efefef',
        paddingTop: getHeight(14),
        paddingBottom: getHeight(16),
        alignItems: 'center'
    },
    price: {
        color: '#FF0200',
        fontSize: getHeight(12)
    },
    sort: {
        backgroundColor: '#efefef',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        width: getHeight(100),
        height: getHeight(30),
        borderRadius: 3
    },
    sortText: {
        fontSize: getHeight(12)
    },
    bom: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    check: {
        width: getHeight(18),
        height: getHeight(18),
        marginRight: getHeight(7),
    },
    ordernews: {
        height: getHeight(45),
        borderBottomWidth: 0.5,
        borderBottomColor: '#efefef',
        flexDirection: 'row',
        alignItems: 'center'
    }
})