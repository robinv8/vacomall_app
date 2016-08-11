/**
 * Created by renyubin on 16/4/28.
 */
'use strict';
import React,{
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
    ToastAndroid,
    Navigator,Platform
}from 'react-native'
import {CartHeader, Login, API, NetService, Toast, OrderPage, GoodsDetail, ListViewRowEdit,MainScreen,Loaddingpage,Guess} from './util/Path';
import {priceColor} from './util/global';
import {getHeight} from './util/response';
let cartThis = [];
export default class CartPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            gList: [],
            loaded: false,
            checked: false,
            isNull: false,
            checkedImg: require('../images/check_icon.png'),
            price: '0',
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2)=>row1 !== row2
            }),
            opacity: 0,
            isedit: false,
            num: 0,
            button: null,
            editdata: null,
            isrefresh:true
        }
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

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.active+' '+this.state.isrefresh)
        if (nextProps.active&&this.state.isrefresh) {
            this.componentDidMount(()=> {
                this._editsubmit();
            });
        }
    }

    componentDidMount(callback) {
        cartThis = [];
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows([]),
        });
        NetService.postFetchData(API.GETCART, '', (result)=> {
            if (result['success'] === false) {
                Toast.show(result['result']['message']);
                if (result['result']['code'] === 303) {
                    const {navigator}=this.props;
                    if (navigator) {
                        navigator.replace({
                            component: Login,
                            params:{name:'CartPage'}
                        })
                    }
                }
                return;
            } else {
                result = result['result'];
                let length=result['cartList'].length
                if (length !== 0) {
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(result['cartList']),
                        loaded: true,
                        isNull: true,
                        gList: result['cartList'],
                        price: result['cartTotalMoney'],
                        num: length
                    });
                    if (callback !== undefined) {
                        callback();
                    }
                } else {
                    this.setState({
                        loaded: true,
                        isNull: false
                    });
                }
            }
            this.setState({
                button: <TouchableWithoutFeedback onPress={()=>this._toOrder()}>
                    <View style={[styles.bom,{width:getHeight(110),backgroundColor:'#16BD42',justifyContent:'center'}]}>
                        <Text style={{fontSize:getHeight(14),color:'white'}}>结算({this.state.num})</Text>
                    </View>
                </TouchableWithoutFeedback>
            });
        });
    }

    _checked() {
        if (!this.state.isedit) {
            return;
        }
        var _this = this;
        if (this.state.checked === false) {
            cartThis.forEach(function (_cartThis) {
                _cartThis.setState({
                    checkedImg: require('../images/checked_icon.png'),
                    checked: true
                })
            })
            _this.setState({
                checkedImg: require('../images/checked_icon.png'),
                checked: true,
                editdata: <TouchableWithoutFeedback onPress={()=>this._checked()}>
                    <View
                        style={{flexDirection:'row',alignItems:'center',height:getHeight(40),paddingLeft:getHeight(10),paddingRight:getHeight(42)}}>
                        <Image source={require('../images/checked_icon.png')}
                               style={styles.check}/>
                        <Text style={{fontSize:getHeight(16),color:'#3c3c3c'}}>全选</Text>
                    </View>
                </TouchableWithoutFeedback>
            });
        } else {
            cartThis.forEach(function (_cartThis) {
                _cartThis.setState({
                    checkedImg: require('../images/check_icon.png'),
                    checked: false
                })
            })
            _this.setState({
                checkedImg: require('../images/check_icon.png'),
                checked: false,
                editdata: <TouchableWithoutFeedback onPress={()=>this._checked()}>
                    <View
                        style={{flexDirection:'row',alignItems:'center',height:getHeight(40),paddingLeft:getHeight(10),paddingRight:getHeight(42)}}>
                        <Image source={require('../images/check_icon.png')}
                               style={styles.check}/>
                        <Text style={{fontSize:getHeight(16),color:'#3c3c3c'}}>全选</Text>
                    </View>
                </TouchableWithoutFeedback>
            });
        }
    }

    _toOrder() {
        var _this = this;
        if (this.state.gList.length === 0) {
            Toast.show('购物车数量为0,不能结算!');
            return;
        }
        NetService.postFetchData(API.HASSTORE, '', (result)=> {
            if (result['success'] === false) {
                Toast.show(result['result']['message']);
                return;
            }

            const {navigator}=_this.props;
            if (navigator) {
                navigator.push({
                    component: OrderPage,
                    sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                })
            }
        });
    }


    //boundary line
    _renderBound() {
        return (
            <View style={{height: 1, backgroundColor: 'silver'}}/>
        )
    }


    toDetails(id) {
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: GoodsDetail,
                params: {id: id}
            })
        }
    }

    _edit() {
        if (this.state.gList.length === 0) {
            Toast.show('购物车数量为0,不能进行编辑!');
            return;
        }
        let _this = this;
        this.setState({
            opacity: 1,
            isedit: true,
            button: <TouchableWithoutFeedback onPress={()=>this._deletCate()}>
                <View style={[styles.bom,{width:getHeight(110),backgroundColor:'#FF9700',justifyContent:'center'}]}>
                    <Text style={{fontSize:getHeight(14),color:'white'}}>删除</Text>
                </View>
            </TouchableWithoutFeedback>,
        });
        cartThis.forEach(function (_cartThis) {
            _cartThis.setState({
                opacity: 1,
                isedit: true,
            })
        })
    }

    _editsubmit() {
        this.setState({
            opacity: 0,
            isedit: true,
            button: <TouchableWithoutFeedback onPress={()=>this._toOrder()}>
                <View style={[styles.bom,{width:getHeight(110),backgroundColor:'#16BD42',justifyContent:'center'}]}>
                    <Text style={{fontSize:getHeight(14),color:'white'}}>结算({this.state.num})</Text>
                </View>
            </TouchableWithoutFeedback>,
            editdata: null
        });
        cartThis.forEach(function (_cartThis) {
            _cartThis.setState({
                opacity: 0
            })
        });
        if (!this.state.checked) {
            return;
        }
        this._checked();
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
            //let _this=this;
            NetService.postFetchData(API.DELETECART, 'id=' + ids, (result)=> {
                if (result['success'] === false) {
                    Toast.show(result['result']['message']);
                    return;
                }
                Toast.show(result['result']['message']);
                this.componentDidMount(()=> {
                    this._edit()
                });

            });
        } else {
            Toast.show('请选择要删除的商品!');
        }
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        if (!this.state.isNull) {
            return this.isNull();
        }
        return (
            <View style={{flex:1,backgroundColor:'#f4f4f4'}}>
                <CartHeader navigator={this.props.navigator} _edit={()=>this._edit()}
                            _editsubmit={()=>this._editsubmit()} tab={this.props.tab} topEvent={true}/>
                <ScrollView
                    scrollsToTop={true}
                    style={{marginBottom:getHeight(49)}}
                    removeClippedSubviews={true}>
                    <View style={{backgroundColor:'white'}}>
                        <TouchableWithoutFeedback onPress={()=>this._checked()}>
                            <View style={[styles.sty]}>
                                <Image source={this.state.checkedImg}
                                       style={[styles.check,{opacity:this.state.opacity}]}/><Text style={{fontSize:getHeight(14)}}>万颗商城</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                    <ListView
                        style={{backgroundColor:'white'}}
                        dataSource={this.state.dataSource}
                        enableEmptySections={true}
                        renderRow={(gList)=>this.renderGList(gList)}
                    />
                    <View
                        style={{flexDirection:'row',height: getHeight(49),backgroundColor:'white',justifyContent:'flex-end',alignItems:'center',paddingRight:getHeight(15),borderBottomWidth:0.5,borderBottomColor:'#e2e2e2'}}>
                        <Text style={{fontSize:getHeight(14),color:'#3c3c3c'}}>共计:<Text style={styles.price}>￥<Text
                            style={{fontSize:getHeight(18)}}>{this.state.price}</Text></Text></Text>
                    </View>
                </ScrollView>
                <View>
                    <View style={{flexDirection:'row',height:getHeight(49),backgroundColor:'white',position:'absolute',bottom:0,width:Dimensions.get('window').width,borderTopWidth:1,borderTopColor:Platform.OS === 'ios'?'rgba(213,213,213,0.5)':'rgba(213,213,213,1)'}}>
                        <View
                            style={[styles.bom,{flex:2,flexDirection:'row', paddingLeft:getHeight(10), paddingRight:getHeight(10)}]}>
                            <View
                                style={{opacity:this.state.opacity===0?1:0,flexDirection:'row',height:getHeight(49),alignItems:'center',left:getHeight(10),position:'absolute'}}>
                                <Text style={{fontSize:getHeight(12)}}>总价:</Text>
                                <Text style={[styles.price]}>￥</Text>
                                <Text
                                    style={[styles.price,{fontSize: getHeight(18),marginTop:getHeight(-4)}]}>{this.state.price}</Text>
                            </View>
                            <TouchableWithoutFeedback onPress={()=>this._checked()}>
                                <View
                                    style={{flexDirection:'row',alignItems:'center',height:getHeight(40),paddingLeft:getHeight(10),paddingRight:getHeight(42),opacity:this.state.opacity}}>
                                    <Image source={this.state.checkedImg}
                                           style={styles.check}/>
                                    <Text style={{fontSize:getHeight(16),color:'#3c3c3c'}}>全选</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        {this.state.button}
                    </View>
                </View>
            </View>
        )
    }

    renderLoadingView() {
        return (
            <View style={{flex:1}}>
                <CartHeader navigator={this.props.navigator} id={this.props.id} tab={this.props.tab}/>
                <Loaddingpage/>
            </View>
        );
    }

    isNull() {
        return (
            <ScrollView style={{flex:1,backgroundColor:'#F6F6F6'}}>
                <CartHeader navigator={this.props.navigator} id={this.props.id} tab={this.props.tab} topEvent={false}/>
                <View
                    style={{justifyContent: 'center',alignItems: 'center',backgroundColor:'white',height:getHeight(350),marginTop:getHeight(11)}}>
                    <View style={{flexDirection:'row',alignItems: 'center',}}>
                        <Image source={require('../images/white_cart.png')}
                               style={{width: getHeight(30),height:getHeight(26),marginRight:getHeight(15)}}/><Text
                        style={{color:'#3C3C3C',fontSize:getHeight(16)}}>购物车是空的,您可以</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>this.toHome()}>
                        <View
                            style={{backgroundColor: '#FF9700',width:getHeight(88),height:getHeight(28),borderRadius:5,justifyContent: 'center',alignItems: 'center',marginTop:getHeight(22)}}>
                            <Text style={{color:'white',fontSize:getHeight(14)}}>随便逛逛</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <Guess navigator={this.props.navigator}/>

            </ScrollView>
        );
    }

    renderGList(gList) {
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
            checkedImg: require('../images/check_icon.png'),
            num: '0',
            price: '0',
            opacity: 0,
            isedit: false
        };
    }

    _checked() {
        if (!this.state.isedit) {
            return;
        }
        if (this.state.checked === false) {
            this.setState({
                checkedImg: require('../images/checked_icon.png'),
                checked: true
            });
            this.props.This.setState({
                //price: (parseInt(this.props.This.state.price) + this.state.price * this.state.num).toFixed(2),
                //num: parseInt(this.props.This.state.num) + this.state.num,
                checkedImg: require('../images/checked_icon.png'),
                checked: true
            })
        } else {
            this.setState({
                checkedImg: require('../images/check_icon.png'),
                checked: false
            });
            this.props.This.setState({
                //price: (this.props.This.state.price - this.state.price * this.state.num).toFixed(),
                //num: this.props.This.state.num - this.state.num,
                checkedImg: require('../images/check_icon.png'),
                checked: false,

            })
        }
        var _this = this;
        cartThis.map(function (data) {
            if (!data.state.checked) {
                _this.props.This.setState({
                    checkedImg: require('../images/check_icon.png'),
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
                <View style={styles.goods_view_view}>
                    <TouchableWithoutFeedback onPress={()=>this._checked()}>
                        <View style={{opacity:this.state.opacity}}>
                            <Image
                                source={this.state.checkedImg} style={styles.check}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{flexDirection:'row',flex:5}}>
                        <View
                            style={{height:getHeight(84),width:getHeight(84),justifyContent:'center',alignItems:'center',borderWidth:0.5,borderColor:'rgba(191,191,191,0.5)',borderRadius:3}}>
                            <Image source={{uri:this.props.gList['imgUrl']}}
                                   style={{height:getHeight(82),width:getHeight(82),resizeMode:'stretch'}}/>
                        </View>
                        <View style={{flex:7,marginLeft:getHeight(10)}}>
                            <Text
                                style={{color:'#898989',fontSize:getHeight(14),height:getHeight(63)}}>{this.texthandle(this.props.gList['name'])}</Text>
                            <Text
                                style={{color:'#C8C8C8',fontSize:12}}>规格:{this.props.gList['skuSpecification'].substring(0, 30)}</Text>
                        </View>
                    </View>

                    <View style={{flex:1,alignItems:'flex-end',paddingRight:getHeight(2)}}>
                        <View style={{height:getHeight(60)}}>
                            <Text style={{color:'#FF0200',fontSize:getHeight(12)}}>￥<Text
                                style={{fontSize:getHeight(18)}}>{this.props.gList['price']}</Text></Text>
                        </View>
                        <View>
                            <Text style={{color:'#C8C8C8',fontSize:getHeight(16)}}>×{this.props.gList['buySum']}</Text>
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
    sty: {
        flexDirection: 'row',
        height: getHeight(38),
        alignItems: 'center',
        marginLeft: getHeight(10),
        marginRight: getHeight(10),
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(191,191,191,0.5)'
    },
    goods_view_view: {
        height: getHeight(115),
        flexDirection: 'row',
        marginLeft: getHeight(10),
        marginRight: getHeight(10),
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(191,191,191,0.5)',
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
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    check: {
        width: getHeight(18),
        height: getHeight(18),
        marginRight: getHeight(7)
    },
    listview: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    cnxh_view: {
        alignItems: 'center',
        height: getHeight(40),
        justifyContent: 'center'
    },
    cnxh_view_img: {
        width: getHeight(96),
        height: getHeight(20),
        resizeMode: 'stretch',
    },
    price1: {
        color: '#FF0200',
        fontSize: getHeight(18)
    },
    bprice: {
        color: '#BFBFBF',
        fontSize: getHeight(12),
        justifyContent: 'flex-end'
    },
})