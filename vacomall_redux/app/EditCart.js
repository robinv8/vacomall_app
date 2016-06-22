/**
 * Created by renyubin on 16/4/29.
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
    TextInput
}from 'react-native'
import {EditCartHeader,API,NetService,Toast} from './util/Path';
var cartThis = [];
export default class EditCart extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            gList: null,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2)=>row1 !== row2,
            }),
            loaded: false,
            checked: false,
            checkedImg: require('../images/cart_dischecked.png'),
            price: '0',
            num: '0',
            status: null
        }
    }

    componentDidMount() {
        cartThis = [];
        NetService.postFetchData(API.GETCART, '', (result)=>this._callback(result));
    }

    _callback(result) {
        if (result['success'] === false) {
            Toast.show(result['result']['message']);
            return;
        } else {
            result=result['result'];
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
    }

    _checked() {
        var _this = this;
        if (this.state.checked === false) {
            cartThis.forEach(function (_cartThis) {
                _cartThis.setState({
                    checkedImg: require('../images/cart_checked.png'),
                    checked: true
                })
            })
            var num = 0, price = 0;
            cartThis.map(function (cart) {
                num += cart.state.num
            });
            cartThis.map(function (cart) {
                price += cart.state.price * cart.state.num
            })
            _this.setState({
                num: num.toString(),
                price: price.toFixed(2)
            })
            _this.setState({
                checkedImg: require('../images/cart_checked.png'),
                checked: true
            });
        } else {
            cartThis.forEach(function (_cartThis, index) {
                _cartThis.setState({
                    checkedImg: require('../images/cart_dischecked.png'),
                    checked: false
                })
            })
            _this.setState({
                num: 0,
                price: '0.00'
            })
            _this.setState({
                checkedImg: require('../images/cart_dischecked.png'),
                checked: false
            });
        }
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return (
            <View style={{flex:1,backgroundColor:'#f4f4f4'}}>
                <EditCartHeader navigator={this.props.navigator}/>
                <ScrollView
                    scrollsToTop={true}
                    removeClippedSubviews={true}>
                    <ListView
                        initialListSize={14}
                        dataSource={this.state.dataSource}
                        renderRow={(gList)=>this.renderGList(gList)}
                    ></ListView>
                </ScrollView>
                <View>
                    <View style={{flexDirection:'row',height:40,backgroundColor:'white'}}>
                        <View
                            style={[styles.bom,{flex:2, borderTopColor:'#DBDBDB', borderTopWidth:0.5, flexDirection:'row', justifyContent:'flex-start'}]}>
                            <TouchableWithoutFeedback onPress={()=>this._checked()}>
                                <View style={{flexDirection:'row',alignItems:'center',height:40,paddingLeft:10,paddingRight:10}}>
                                    <Image source={this.state.checkedImg}
                                           style={{width:12,height: 12,resizeMode:'stretch'}}/>
                                    <Text >全选</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>this._deletCate()}>
                            <View style={[styles.bom,{flex:1,backgroundColor:'#F08100'}]}>
                                <Text style={{fontSize:14,color:'white'}}>删除</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        )
    }

    _deletCate() {
        var ids = "", flag = false;
        cartThis.map(function (data) {
            if (data.state.checked) {
                ids += data.state.id + ',';
                flag = true;
            }
        });
        if (flag) {
            ids = ids.substring(0, ids.length - 1);
            NetService.postFetchData(API.DELETECART, 'id=' + ids, (result)=>this._callback1(result));
        } else {
            ToastAndroid.show('请选择要删除的商品!', ToastAndroid.SHORT);
        }
    }

    _callback1(result) {
        if (result['success'] === false) {
            ToastAndroid.show(result['result']['message'], ToastAndroid.SHORT);
            return;
        }
        ToastAndroid.show(result['message'], ToastAndroid.SHORT);
        const {navigator}=this.props;
        if (navigator) {
            navigator.replace({
                component: EditCart,
                params: {id: this.props.id}
            })
        }
    }

    renderLoadingView() {
        return (
            <View style={{flex:1}}>
                <EditCartHeader navigator={this.props.navigator}/>
                <View style={{flex:1,justifyContent: 'center',alignItems: 'center',backgroundColor:'#F4F4F4'}}>
                    <Image source={require('../images/loading.gif')} style={{width:70,height:50,resizeMode:'stretch'}}/>
                </View>
            </View>
        );
    }

    renderGList(gList) {
        var _textLength = function (text) {
            var rtnText = "";
            if (text.length > 30) {
                rtnText = text.substring(0, 30) + '…'
            } else {
                rtnText = text;
            }
            return rtnText;
        }
        return (
            <CartList gList={gList} This={this}/>
        )
    }
}

class CartList extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            checked: false,
            checkedImg: require('../images/cart_dischecked.png'),
            num: '0',
            price: '0'
        };
    }

    _checked() {
        if (this.state.checked === false) {
            this.setState({
                checkedImg: require('../images/cart_checked.png'),
                checked: true
            });
            this.props.This.setState({
                price: (parseInt(this.props.This.state.price) + this.state.price * this.state.num).toFixed(2),
                num: parseInt(this.props.This.state.num) + this.state.num,
                checkedImg: require('../images/cart_checked.png'),
                checked: true
            })
        } else {
            this.setState({
                checkedImg: require('../images/cart_dischecked.png'),
                checked: false
            });
            this.props.This.setState({
                price: (this.props.This.state.price - this.state.price * this.state.num).toFixed(),
                num: this.props.This.state.num - this.state.num,
                checkedImg: require('../images/cart_dischecked.png'),
                checked: false
            })
        }
        var _this = this;
        cartThis.map(function (data) {
            if (!data.state.checked) {
                _this.props.This.setState({
                    checkedImg: require('../images/cart_dischecked.png'),
                    checked: false
                })
            }
        })
    }

    componentDidMount() {
        cartThis.push(this);
        var _this = this;
        this.setState({
            num: _this.props.gList['buySum'].toString(),
            price: _this.props.gList['price'].toString(),
            id: _this.props.gList['id'].toString()
        });
    }


    _num(flag) {
        var _this = this;

        function _callback1(result) {
            if (result['success'] === false) {
                ToastAndroid.show(result['result']['message'], ToastAndroid.SHORT);
                if (_this.state.status === "add") {
                    _this.setState({
                        num: (_this.state.num - 1).toString()
                    })
                }
                return;
            }
        }

        if (flag === 'add') {
            this.state.status = 'add';
            var num = (parseInt(this.state.num) + 1).toString();
            NetService.postFetchData(API.ADDCART, 'id=' + _this.state.id + '&buySum=1', (result)=>_callback1(result));
            _this.setState({
                num: num
            })
        } else {
            this.state.status = 'sub';
            var num = "";
            if (this.state.num ==='1') {
                num = this.state.num
            } else {
                num = (parseInt(this.state.num) - 1).toString();
            }
            NetService.postFetchData(API.ADDCART, 'id=' + _this.state.id + '&buySum=-1', (result)=>_callback1(result));
            _this.setState({
                num: num
            })
        }
    }

    _onChange(num) {
        var res = /^[0-9]*$/;
        if (res.test(num) && num !== "") {
            if (num.substring(0, 1) === "0") {
                num = num.substring(1)
            }
            this.setState({
                num: num
            })
        } else {
            this.setState({
                num: '1'
            })
        }
    }

    render() {
        return (
            <View style={styles.goods_view}>
                <TouchableWithoutFeedback onPress={()=>this._checked()}>
                    <View style={{height:80,width:50,justifyContent:'center',alignItems:'center'}}>
                        <Image source={this.state.checkedImg}
                               style={{width:12,height: 12,resizeMode:'stretch'}}/>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{height:80,width:80,justifyContent:'center',alignItems:'center'}}>
                    <Image source={{uri:this.props.gList['imgUrl']}}
                           style={{height:80,width:80,resizeMode:'stretch'}}/>
                </View>
                <View style={{flexDirection:'row',flex:1}}>
                    <TouchableWithoutFeedback onPress={(flag)=>this._num('sub')}>
                        <View
                            style={{borderRightWidth:1,borderRightColor:'#C3C3C3',flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Image source={require('../images/sub.png')}
                                   style={{width:10,height:2,resizeMode:'stretch'}}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <View
                        style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                        <TextInput
                            style={{paddingLeft:5,paddingRight:5,textAlign:'center',fontSize:14}}
                            keyboardType={'numeric'}
                            onChangeText={(num)=>this._onChange(num)}
                            underlineColorAndroid='transparent'
                            editable={false}
                            value={this.state.num}
                        />
                    </View>
                    <TouchableWithoutFeedback onPress={(flag)=>this._num('add')}>
                        <View
                            style={{borderLeftWidth:1,borderLeftColor:'#C3C3C3',flex:1,justifyContent:'center',alignItems:'center'}}><Image
                            source={require('../images/add.png')}
                            style={{width:10,height:10,resizeMode:'stretch'}}/></View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    goods_view: {
        marginTop: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingTop: 7,
        paddingBottom: 7
    },
    price: {
        color: '#e43777'
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
        alignItems: 'center'
    },
})