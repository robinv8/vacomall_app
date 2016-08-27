/**
 * Created by renyubin on 16/4/28.
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
    ToastAndroid,
    Navigator, Platform,
    TextInput
}from 'react-native'
import {
    CartHeader,
    Login,
    API,
    NetService,
    Toast,
    OrderPage,
    GoodsDetail,
    ListViewRowEdit,
    MainScreen,
    Loaddingpage,
    Guess,
} from './util/Path';
import CartSpec from './Cart/CartSpec';
import {connect} from 'react-redux';
import {getHeight} from './util/response';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
class CartPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.ds = new ListView.DataSource({
            rowHasChanged: (row1, row2)=>row1 !== row2
        });
        this.cartThis = [];
        this.state = {
            gList: [],
            loaded: false,
            checked: false,
            isNull: true,
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
            isrefresh: false,
            spec: null,
            shadeThis: null
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

        if (nextProps.active) {
            this.setState({
                gList:[]
            })
            this.componentDidMount()
        }
    }
    shouldComponentUpdate(nextProps,nextState){
        if(nextState.isrefresh){
            this.setState({
                gList:[]
            })
            this.componentDidMount()
        }
        return true;
    }
    componentDidMount(callback) {
        this.setState({
            isrefresh:false,
        });
        NetService.postFetchData(API.GETCART, '', (result)=> {
            if (result['success'] === false) {
                Toast.show(result['result']['message']);
                if (result['result']['code'] === 303) {
                    const {navigator}=this.props;
                    if (navigator) {
                        navigator.replace({
                            component: Login,
                            params: {name: 'CartPage'}
                        })
                    }
                }
                return;
            } else {
                result = result['result'];
                let length = result['cartList'].length
                if (length !== 0) {
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(result['cartList']),
                        loaded: true,
                        isNull: false,
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
                        isNull: true
                    });
                }
            }
            this.setState({
                button: <TouchableWithoutFeedback onPress={()=>this._toOrder()}>
                    <View style={[styles.bom, {
                        width: getHeight(110),
                        backgroundColor: '#16BD42',
                        justifyContent: 'center'
                    }]}>
                        <Text style={{fontSize: getHeight(14), color: 'white'}}>结算({this.state.num})</Text>
                    </View>
                </TouchableWithoutFeedback>,
            });
        });
    }

    _checked() {
        if (!this.state.isedit) {
            return;
        }
        var _this = this;
        if (this.state.checked === false) {
            this.cartThis.forEach(function (_cartThis) {
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
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            height: getHeight(40),
                            paddingLeft: getHeight(10),
                            paddingRight: getHeight(42)
                        }}>
                        <Image source={require('../images/checked_icon.png')}
                               style={styles.check}/>
                        <Text style={{fontSize: getHeight(16), color: '#3c3c3c'}}>全选</Text>
                    </View>
                </TouchableWithoutFeedback>
            });
        } else {
            this.cartThis.forEach(function (_cartThis) {
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
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            height: getHeight(40),
                            paddingLeft: getHeight(10),
                            paddingRight: getHeight(42)
                        }}>
                        <Image source={require('../images/check_icon.png')}
                               style={styles.check}/>
                        <Text style={{fontSize: getHeight(16), color: '#3c3c3c'}}>全选</Text>
                    </View>
                </TouchableWithoutFeedback>,
            });
        }
    }

    _toOrder() {
        this.setState({

            gList:[]
        });
        /*if (this.state.gList.length === 0) {
            Toast.show('购物车数量为0,不能结算!');
            return;
        }
        NetService.postFetchData(API.HASSTORE, '', (result)=> {
            if (result['success'] === false) {
                Toast.show(result['result']['message']);
                return;
            }

            const {navigator}=this.props;
            if (navigator) {
                navigator.push({
                    component: OrderPage,
                    sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                })
            }
        });*/
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
        });
        this.cartThis.forEach(function (_cartThis) {
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
            editdata: null
        });
        this.cartThis.forEach(function (_cartThis) {
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
        this.cartThis.map(function (data) {
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

    /**
     *
     * @param data
     * @param secdId
     * @param rowId
     * @param rowMap
     * @description 删除购物车单条数据
     */
    deleteRow(data, secdId, rowId, rowMap) {
        let id = data['id']
        if (id !== undefined) {
            NetService.postFetchData(API.DELETECART, 'id=' + id, (result)=> {
                if (result['success'] === false) {
                    Toast.show(result['result']['message']);
                    return;
                }
                rowMap[`${secdId}${rowId}`].closeRow();
                const newData = [...this.state.gList];
                newData.splice(rowId, 1);
                if (newData.length === 0) {
                    this.setState({
                        isNull: true
                    })
                }
                this.setState({
                    gList: newData,
                    num: this.state.num - 1
                });
            });
        }
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        if (this.state.isNull) {
            return this.isNull();
        }
        const {btn_text, backgroundColor}=this.props;
        let showBtn;
        if (btn_text === '结算') {
            showBtn = btn_text + '(' + this.state.num + ')';
        } else {
            showBtn = btn_text;
        }
        return (
            <View style={{flex: 1, backgroundColor: '#f4f4f4'}}>
                <CartHeader navigator={this.props.navigator} _edit={()=>this._edit()}
                            _editsubmit={()=>this._editsubmit()} tab={this.props.tab} topEvent={true}/>
                <ScrollView
                    scrollsToTop={true}
                    style={{marginBottom: getHeight(49)}}
                    removeClippedSubviews={true}>
                    <View style={{backgroundColor: 'white'}}>
                        <TouchableWithoutFeedback onPress={()=>this._checked()}>
                            <View style={[styles.sty]}>
                                <Image source={this.state.checkedImg}
                                       style={[styles.check, {opacity: this.state.opacity}]}/><Text
                                style={{fontSize: getHeight(14)}}>万颗商城</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                    <SwipeListView
                        style={{backgroundColor: 'white'}}
                        dataSource={this.ds.cloneWithRows(this.state.gList)}
                        enableEmptySections={true}
                        disableRightSwipe={true}
                        renderRow={(gList)=>this.renderGList(gList)}
                        renderHiddenRow={ (data, secId, rowId, rowMap) => (
                            <View style={styles.rowBack}>
                                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]}
                                                  onPress={ _ => this.deleteRow(data, secId, rowId, rowMap) }>
                                    <Text style={styles.backTextWhite}>删除</Text>
                                    <Image source={require('../images/cart_delete.png')}
                                           style={{width: getHeight(20), height: getHeight(24)}}/>
                                </TouchableOpacity>
                            </View>
                        )}
                        leftOpenValue={0}
                        rightOpenValue={getHeight(-75)}
                    />
                    <View
                        style={{
                            flexDirection: 'row',
                            height: getHeight(49),
                            backgroundColor: 'white',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            paddingRight: getHeight(15),
                            borderBottomWidth: 0.5,
                            borderBottomColor: '#e2e2e2'
                        }}>
                        <Text style={{fontSize: getHeight(14), color: '#3c3c3c'}}>共计:<Text style={styles.price}>￥<Text
                            style={{fontSize: getHeight(18)}}>{parseInt(this.state.price).toFixed(2)}</Text></Text></Text>
                    </View>
                </ScrollView>
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
                                flexDirection: 'row',
                                paddingRight: getHeight(10)
                            }]}>
                            <View
                                style={{
                                    opacity: this.state.opacity === 0 ? 1 : 0,
                                    flexDirection: 'row',
                                    height: getHeight(49),
                                    alignItems: 'center',
                                    left: getHeight(10),
                                    position: 'absolute'
                                }}>
                                <Text style={{fontSize: getHeight(14)}}>总价:</Text>
                                <Text style={[styles.price, {
                                    marginTop: 3
                                }]}>￥</Text>
                                <Text
                                    style={[styles.price, {
                                        fontSize: getHeight(18),
                                        marginTop: getHeight(-2)
                                    }]}>{parseInt(this.state.price).toFixed(2)}</Text>
                            </View>
                            <TouchableWithoutFeedback onPress={()=>this._checked()}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        height: getHeight(40),
                                        left: getHeight(10),
                                        paddingRight: getHeight(42),
                                        opacity: this.state.opacity
                                    }}>
                                    <Image source={this.state.checkedImg}
                                           style={styles.check}/>
                                    <Text style={{fontSize: getHeight(16), color: '#3c3c3c'}}>全选</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>this._toOrder()}>
                            <View style={[styles.bom, {
                                width: getHeight(110),
                                backgroundColor: backgroundColor,
                                justifyContent: 'center'
                            }]}>
                                <Text style={{
                                    fontSize: getHeight(14),
                                    color: 'white'
                                }}>{showBtn}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                {this.state.spec}
            </View>
        )
    }

    renderLoadingView() {
        return (
            <View style={{flex: 1}}>
                <CartHeader navigator={this.props.navigator} id={this.props.id} tab={this.props.tab}/>
                <Loaddingpage/>
            </View>
        );
    }

    isNull() {
        return (
            <ScrollView style={{flex: 1, backgroundColor: '#F6F6F6'}}>
                <CartHeader navigator={this.props.navigator} id={this.props.id} tab={this.props.tab} topEvent={false}/>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        height: getHeight(350),
                        marginTop: getHeight(11)
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                        <Image source={require('../images/white_cart.png')}
                               style={{width: getHeight(30), height: getHeight(26), marginRight: getHeight(15)}}/><Text
                        style={{color: '#3C3C3C', fontSize: getHeight(16)}}>购物车是空的,您可以</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>this.toHome()}>
                        <View
                            style={{
                                backgroundColor: '#FF9700',
                                width: getHeight(88),
                                height: getHeight(28),
                                borderRadius: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: getHeight(22)
                            }}>
                            <Text style={{color: 'white', fontSize: getHeight(14)}}>随便逛逛</Text>
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
function select(store) {
    return {
        btn_text: store.cartStore.btn_text,
        backgroundColor: store.cartStore.backgroundColor
    }
}
export default connect(select)(CartPage);
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
        this.props.This.cartThis.map((data)=> {
            if (!data.state.checked) {
                this.props.This.setState({
                    checkedImg: require('../images/check_icon.png'),
                    checked: false
                })
            }
        })
    }
    componentDidMount() {
        this.specs = {}, this.specsUI = {};
        this.props.This.cartThis.push(this);
        this.setState({
            num: this.props.gList['buySum'].toString(),
            price: this.props.gList['price'].toString(),
            id: this.props.gList['id'].toString(),
            skuSpecification: this.props.gList['skuSpecification']
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

    _num(flag) {
        let num = "";
        if (flag === 'add') {
            this._addCart(1, (result)=> {
                if (result) {
                    num = (parseInt(this.state.num) + 1).toString()
                    this.setState({
                        num: num
                    });
                    this.props.This.setState({
                        price: (parseInt(this.props.This.state.price) + parseInt(this.state.price)).toFixed(2),
                    })
                }
            });
        } else {
            this._addCart(-1, (result)=> {
                if (result) {
                    if (this.state.num === '1') {
                        num = this.state.num
                        this.props.This.setState({
                            price: parseInt(this.props.This.state.price).toFixed(2),
                        })
                    } else {
                        num = (parseInt(this.state.num) - 1).toString()
                        this.props.This.setState({
                            price: (parseInt(this.props.This.state.price) - parseInt(this.state.price)).toFixed(2),
                        })
                    }
                    this.setState({
                        num: num
                    })
                }
            });
        }
    }

    /**
     *
     * @param num 商品数量
     * @param callback 回调函数
     * @private
     * @description 修改购物车商品数量
     */
    _addCart(num, callback) {
        let status = true
        NetService.postFetchData(API.ADDCART, 'id=' + this.state.id + '&buySum=' + num, (result)=> {
            if (result['success'] === false) {
                Toast.show(result['result']['message']);
                if (result['result']['code'] === 303) {
                    const {navigator}=detailThis.props.parentProps;
                    if (navigator) {
                        navigator.push({
                            component: Login,
                            sceneConfig: Navigator.SceneConfigs.FadeAndroid
                        })
                    }
                }
                status = false;
            } else {
                status = true;
            }
            callback(status);
        });
    }

    /**
     * @description 修改商品规格
     */
    selectSpec() {
        this.props.This.setState({
            spec: null,
            resultData: null
        })
        NetService.getFetchData(API.SELECTSPEC + '?id=' + this.state.id, (result)=> {
            this.specs[this.state.id] = result;
            this.editspec(result);
        })
    }

    /**
     *
     * @param result
     * @description 修改购物车商品规格
     */
    editspec(result) {
        this.setState({
            resultData: result
        })
        let rootThis = this.props.This.props.rootThis;
        if (rootThis !== undefined) {
            rootThis.setState({
                spec: null,
                shadeThis: null,
                active:false
            })
            rootThis.setState({
                spec: <CartSpec _this2={this}/>
            })
        } else {
            this.props.This.setState({
                spec: null,
                shadeThis: null
            })
            this.props.This.setState({
                spec: <CartSpec _this2={this}/>
            })
        }
        //this.state.shadeThis._shade();
    }

    render() {
        return (
            <View style={styles.goods_view}>
                <View style={styles.goods_view_view}>
                    <TouchableWithoutFeedback onPress={()=>this._checked()}>
                        <View style={{opacity: this.state.opacity}}>
                            <Image
                                source={this.state.checkedImg} style={styles.check}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{flexDirection: 'row', flex: 5}}>
                        <View
                            style={{
                                height: getHeight(84),
                                width: getHeight(84),
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 0.5,
                                borderColor: 'rgba(191,191,191,0.5)',
                                borderRadius: 3
                            }}>
                            <Image source={{uri: this.props.gList['imgUrl']}}
                                   style={{height: getHeight(82), width: getHeight(82), resizeMode: 'stretch'}}/>
                        </View>
                        <View style={{flex: 7, marginLeft: getHeight(10)}}>
                            <Text
                                style={{
                                    color: '#898989',
                                    fontSize: getHeight(14),
                                    height: getHeight(63)
                                }}>{this.texthandle(this.props.gList['name'])}</Text>
                            <Text
                                style={{
                                    color: '#C8C8C8',
                                    fontSize: 12,
                                    width: 0, height: 0
                                }}>规格:{this.props.gList['skuSpecification'].substring(0, 30)}</Text>
                            <TouchableWithoutFeedback onPress={()=>this.selectSpec()}>
                                <View style={styles.editspec}>
                                    <Text
                                        style={{
                                            color: '#3c3c3c',
                                            fontSize: 12,
                                            width: getHeight(122.25),
                                            flexWrap: 'nowrap'
                                        }}>规格:{this.props.gList['skuSpecification'].substring(0, 7)}</Text>
                                    <View style={{
                                        width: 0.5,
                                        height: getHeight(22),
                                        backgroundColor: 'rgba(191,191,191,0.5)'
                                    }}/>
                                    <Image source={require('../images/down_arrows_icon.png')}
                                           style={styles.down_arrows}/>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>

                    <View style={{flex: 1, alignItems: 'flex-end', paddingRight: getHeight(2)}}>
                        <View style={{height: getHeight(60)}}>
                            <Text style={{color: '#FF0200', fontSize: getHeight(12)}}>￥<Text
                                style={{fontSize: getHeight(18)}}>{this.props.gList['price']}</Text></Text>
                        </View>
                        <View >
                            <Text style={{
                                color: '#C8C8C8',
                                fontSize: getHeight(16),
                                width: 0, height: 0
                            }}>×{this.props.gList['buySum']}</Text>
                        </View>
                        <View style={[styles.editspec, {width: getHeight(83), paddingLeft: 0}]}>
                            <TouchableWithoutFeedback onPress={(flag)=>this._num('sub')}>
                                <View
                                    style={styles.sub_view}>
                                    <Image source={require('../images/black_sub_icon.png')}
                                           style={{width: getHeight(11), height: getHeight(2), resizeMode: 'stretch'}}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={{
                                width: 0.5,
                                height: getHeight(22),
                                backgroundColor: 'rgba(191,191,191,0.5)'
                            }}/>
                            <View style={{flex: 3, alignItems: 'center'}}>
                                <TextInput
                                    style={{
                                        color: '#3c3c3c',
                                        fontSize: getHeight(16),
                                        flex: 1,
                                        textAlign: 'center'
                                    }}
                                    keyboardType={'numeric'}
                                    onChangeText={(num)=>this._onChange(num)}
                                    underlineColorAndroid='transparent'
                                    value={this.state.num}/>

                            </View>
                            <View style={{
                                width: 0.5,
                                height: getHeight(22),
                                backgroundColor: 'rgba(191,191,191,0.5)'
                            }}/>
                            <TouchableWithoutFeedback onPress={(flag)=>this._num('add')}>
                                <View
                                    style={styles.sub_view}><Image
                                    source={require('../images/black_add_icon.png')}
                                    style={{
                                        width: getHeight(11),
                                        height: getHeight(10),
                                        resizeMode: 'stretch'
                                    }}/></View>
                            </TouchableWithoutFeedback>
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
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#ddd',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: getHeight(75)
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: getHeight(75)
    },
    backRightBtnRight: {
        backgroundColor: '#FD3824',
        right: 0

    },
    backTextWhite: {
        color: '#FFF',
        fontSize: getHeight(14),
        marginBottom: getHeight(6)
    },
    editspec: {
        paddingLeft: getHeight(5),
        alignItems: 'center',
        width: getHeight(149),
        height: getHeight(22),
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'rgba(191,191,191,0.5)',
        flexDirection: 'row',
    },
    down_arrows: {
        width: getHeight(8.94),
        height: getHeight(4.83),
        resizeMode: 'stretch',
        marginTop: getHeight(9.1),
        marginRight: getHeight(6.15),
        marginBottom: getHeight(8.07),
        marginLeft: getHeight(4.65),
    },
    sub_view: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        height: getHeight(20)
    },
})