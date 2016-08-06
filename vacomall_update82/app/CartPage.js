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
                    <View style={[styles.bom,{width:110,backgroundColor:'#16BD42',justifyContent:'center'}]}>
                        <Text style={{fontSize:14,color:'white'}}>结算({this.state.num})</Text>
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
                        style={{flexDirection:'row',alignItems:'center',height:40,paddingLeft:10,paddingRight:42}}>
                        <Image source={require('../images/checked_icon.png')}
                               style={styles.check}/>
                        <Text >全选</Text>
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
                        style={{flexDirection:'row',alignItems:'center',height:40,paddingLeft:10,paddingRight:42}}>
                        <Image source={require('../images/check_icon.png')}
                               style={styles.check}/>
                        <Text >全选</Text>
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
                <View style={[styles.bom,{width:110,backgroundColor:'#FF9700',justifyContent:'center'}]}>
                    <Text style={{fontSize:14,color:'white'}}>删除</Text>
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
                <View style={[styles.bom,{width:110,backgroundColor:'#16BD42',justifyContent:'center'}]}>
                    <Text style={{fontSize:14,color:'white'}}>结算({this.state.num})</Text>
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
                    style={{marginBottom:49}}
                    removeClippedSubviews={true}>
                    <View style={{backgroundColor:'white'}}>
                        <TouchableWithoutFeedback onPress={()=>this._checked()}>
                            <View style={[styles.sty]}>
                                <Image source={this.state.checkedImg}
                                       style={[styles.check,{opacity:this.state.opacity}]}/><Text>万颗商城</Text>
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
                        style={{flexDirection:'row',height: 49,backgroundColor:'white',justifyContent:'flex-end',alignItems:'center',paddingRight:15,borderBottomWidth:0.5,borderBottomColor:'#e2e2e2'}}>
                        <Text>共计:<Text style={styles.price}>￥<Text
                            style={{fontSize:18}}>{this.state.price}</Text></Text></Text>
                    </View>
                </ScrollView>
                <View>
                    <View style={{flexDirection:'row',height:49,backgroundColor:'white',position:'absolute',bottom:0,width:Dimensions.get('window').width,borderTopWidth:1,borderTopColor:Platform.OS === 'ios'?'rgba(213,213,213,0.5)':'rgba(213,213,213,1)'}}>
                        <View
                            style={[styles.bom,{flex:2,flexDirection:'row', paddingLeft:10, paddingRight:10}]}>
                            <View
                                style={{opacity:this.state.opacity===0?1:0,flexDirection:'row',height:49,alignItems:'center',left:10,position:'absolute'}}>
                                <Text style={{fontSize:12}}>总价:</Text>
                                <Text style={[styles.price]}>￥</Text>
                                <Text
                                    style={[styles.price,{fontSize: 18,marginTop:-4}]}>{this.state.price}</Text>
                            </View>
                            <TouchableWithoutFeedback onPress={()=>this._checked()}>
                                <View
                                    style={{flexDirection:'row',alignItems:'center',height:40,paddingLeft:10,paddingRight:42,opacity:this.state.opacity}}>
                                    <Image source={this.state.checkedImg}
                                           style={styles.check}/>
                                    <Text >全选</Text>
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
                    style={{justifyContent: 'center',alignItems: 'center',backgroundColor:'white',height:350,marginTop:11}}>
                    <View style={{flexDirection:'row',alignItems: 'center',}}>
                        <Image source={require('../images/white_cart.png')}
                               style={{width: 30,height:26,marginRight:15}}/><Text
                        style={{color:'#3C3C3C'}}>购物车是空的,您可以</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>this.toHome()}>
                        <View
                            style={{backgroundColor: '#FF9700',width:88,height:28,borderRadius:5,justifyContent: 'center',alignItems: 'center',marginTop:22}}>
                            <Text style={{color:'white'}}>随便逛逛</Text>
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
                            style={{height:84,width:84,justifyContent:'center',alignItems:'center',borderWidth:0.5,borderColor:'rgba(191,191,191,0.5)',borderRadius:3}}>
                            <Image source={{uri:this.props.gList['imgUrl']}}
                                   style={{height:82,width:82,resizeMode:'stretch'}}/>
                        </View>
                        <View style={{flex:7,marginLeft:10}}>
                            <Text
                                style={{color:'#898989',fontSize:14,height:63}}>{this.texthandle(this.props.gList['name'])}</Text>
                            <Text
                                style={{color:'#C8C8C8',fontSize:12}}>规格:{this.props.gList['skuSpecification'].substring(0, 30)}</Text>
                        </View>
                    </View>

                    <View style={{flex:1,alignItems:'flex-end',paddingRight:2}}>
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
    sty: {
        flexDirection: 'row',
        height: 38,
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(191,191,191,0.5)'
    },
    goods_view_view: {
        height: 115,
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: 0.5,
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
        justifyContent: 'flex-start',
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
    listview: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    cnxh_view: {
        alignItems: 'center',
        height: 40,
        justifyContent: 'center'
    },
    cnxh_view_img: {
        width: 96,
        height: 20,
        resizeMode: 'stretch',
    },
    price1: {
        color: '#FF0200',
        fontSize: 18
    },
    bprice: {
        color: '#BFBFBF',
        fontSize: 12,
        justifyContent: 'flex-end'
    },
})