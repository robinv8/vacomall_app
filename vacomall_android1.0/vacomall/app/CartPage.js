/**
 * Created by renyubin on 16/4/28.
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
    ToastAndroid,
    Navigator
}from 'react-native'
import CartHeader from './Cart/CartHeader';
import API from './util/api';
import * as NetService from './util/NetService';
import Login from './Login';
import OrderPage from '../app/OrderPage';
var cartThis = [];
export default class CartPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            gList: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2)=>row1 !== row2,
            }),
            loaded: false,
            checked: false,
            checkedImg: require('../images/cart_dischecked.png'),
            price: '0',
        }
    }

    componentDidMount() {
        cartThis = [];
        NetService.postFetchData(API.GETCART, '', (result)=>this._callback(result));
    }


    _callback(result) {
        if (result['success'] === false) {
            ToastAndroid.show(result['result']['message'], ToastAndroid.SHORT);
            if (result['result']['code'] === 303) {
                const {navigator}=this.props;
                if (navigator) {
                    navigator.replace({
                        component: Login,
                        sceneConfig: Navigator.SceneConfigs.FadeAndroid
                    })
                }
            }
            return;
        } else {
            if (result['cartList'].length !== 0) {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(result['cartList']),
                    loaded: true,
                    gList:result['cartList'],
                    price:result['cartTotalMoney']
                })
            } else {
                this.setState({
                    loaded: true,
                })
            }
        }

    }


    _toOrder() {
        var _this=this;
        if(this.state.gList.length===0){
            ToastAndroid.show('购物车数量为0,不能结算!', ToastAndroid.SHORT);
            return;
        }
        NetService.postFetchData(API.HASSTORE, '',(result)=>_callback(result));
        function _callback(result){
            if (result['success'] === false) {
                ToastAndroid.show(result['result']['message'], ToastAndroid.SHORT);
                return;
            }
            const {navigator}=_this.props;
            if (navigator) {
                navigator.push({
                    component: OrderPage,
                    sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                })
            }
        }
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return (
            <View style={{flex:1,backgroundColor:'#f4f4f4'}}>
                <CartHeader navigator={this.props.navigator} gList={this.state.gList}/>
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
                            style={[styles.bom,{flex:2, paddingLeft:10, borderTopColor:'#DBDBDB', borderTopWidth:0.5, flexDirection:'row', justifyContent:'flex-end',paddingRight:10}]}>
                            <Text style={{fontSize:12}}>总价:</Text>
                            <Text style={[styles.price]}>￥</Text>
                            <Text
                                style={[styles.price,{fontSize: 18,marginTop:-4}]}>{this.state.price}</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>this._toOrder()}>
                            <View style={[styles.bom,{flex:1,backgroundColor:'#CF0F35'}]}>
                                <Text style={{fontSize:14,color:'white'}}>去结算</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        )
    }

    renderLoadingView() {
        return (
            <View style={{flex:1}}>
                <CartHeader navigator={this.props.navigator} id={this.props.id}/>
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


    componentDidMount() {
        cartThis.push(this);
        this.setState({
            num: this.props.gList['buySum'],
            price: this.props.gList['price']
        });
    }

    render() {
        return (
            <View style={styles.goods_view}>
                <View style={{height:80,width:80,justifyContent:'center',alignItems:'center'}}>
                    <Image source={{uri:this.props.gList['imgUrl']}}
                           style={{height:80,width:80,resizeMode:'stretch'}}/>
                </View>
                <View style={{marginLeft:5,height:80,flexWrap: 'wrap',flex:1}}>
                    <View style={{flex:5}}>
                        <Text style={{color:'#2F2F2F',fontSize:10,marginTop:-3}}>{this.props.gList['name']}</Text>
                        <Text style={{color:'#C6C6C6',fontSize:10}}>规格:{this.props.gList['skuSpecification']}</Text>
                    </View>
                    <View style={{flex:1,flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#CF0F35',fontSize:12}}>￥{this.props.gList['price']}</Text>
                        </View>
                        <View style={{flex:1,alignItems:'flex-end'}}>
                            <Text style={{color:'#2F2F2F',fontSize:12}}>×{this.props.gList['buySum']}</Text>
                        </View>
                    </View>
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
        paddingBottom: 7,
        paddingLeft: 5,
        paddingRight: 5
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