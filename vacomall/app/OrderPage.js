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
    ToastAndroid,
    Navigator
}from 'react-native';
import {OrderHeader,API,NetService} from './util/Path'

var cartThis = [];
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
            flag: true
        };
    }

    componentDidMount() {
        var _this = this;
        setTimeout(function () {
            NetService.postFetchData(API.CONFIRM, '', (result)=>_this._callback(result));
        }, 400)
    }

    _callback(result) {
        if (result['success'] === false) {
            ToastAndroid.show(result['result']['message'], ToastAndroid.SHORT);
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
        if (result.length !== 0) {
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
        const {navigator}=this.props;

        function _callback(result) {
            if (this.state.flag) {
                this.state.flag = false;
                if (result['success'] === false) {
                    ToastAndroid.show(result['result']['message'], ToastAndroid.SHORT);
                    if (navigator) {
                        navigator.push({
                            component: PayError,
                            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                        })
                    }
                    return;
                }
                if (navigator) {
                    navigator.push({
                        component: PaySuccess,
                        sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                        params: {result: result}
                    })
                }
            }
        }

        NetService.postFetchData(API.SUBMIT, '', _callback.bind(this));
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return (
            <View style={{flex:1,backgroundColor:'#f4f4f4'}}>
                <View style={{flex:1}}>
                    <OrderHeader navigator={this.props.navigator}/>
                    <View
                        style={{height:84,backgroundColor:'white',flexDirection:'row',padding:12,paddingTop:17,paddingBottom:15}}>

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
                                <Text style={{color:'#BFBFBF'}}>收货地址:</Text></View>
                            <View style={{marginLeft:21}}><Text
                            style={{color:'#BFBFBF'}}>{this.state.address}</Text></View>
                        </View>
                    </View>

                    <View style={{flex:1}}>
                        <ListView
                            initialListSize={14}
                            dataSource={this.state.dataSource}
                            renderRow={(gList)=>this.renderGList(gList)}
                        ></ListView>
                    </View>
                </View>
                <View>
                    <View style={{flexDirection:'row',height:40,backgroundColor:'white'}}>
                        <View
                            style={[styles.bom,{flex:2, paddingLeft:10, borderTopColor:'#DBDBDB', borderTopWidth:0.5, flexDirection:'row', justifyContent:'flex-end',paddingRight:10}]}>
                            <Text style={{fontSize:12}}>总价:</Text>
                            <Text style={[styles.price]}>￥</Text>
                            <Text
                                style={[styles.price,{fontSize: 18,marginTop:-4}]}>{this.state.money}</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>this._toSubmit()}>
                            <View style={[styles.bom,{flex:1,backgroundColor:'#CF0F35'}]}>
                                <Text style={{fontSize:14,color:'white'}}>提交订单({this.state.num})</Text>
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
                <OrderHeader navigator={this.props.navigator} id={this.props.id}/>
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
            <CartList gList={gList}/>
        )
    }
}
class CartList extends Component {

    render() {
        return (
            <View style={{flex:1,backgroundColor:'white',marginTop: 10,paddingLeft:5,paddingRight:5}}>
                <View style={styles.goods_view}>
                    <View style={{height:80,width:80,justifyContent:'center',alignItems:'center'}}>
                        <Image source={{uri:this.props.gList['imgUrl']}}
                               style={{height:80,width:80,resizeMode:'stretch'}}/>
                    </View>
                    <View style={{marginLeft:5,height:80,paddingRight:10,flexWrap: 'wrap',flex:1}}>
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
                <View
                    style={{borderTopWidth:1,borderTopColor:'#EAEAEA',alignItems:'flex-end'}}>
                    <View style={{flex:1,flexDirection:'row',paddingBottom:5,paddingTop:5}}>
                        <Text style={{color:'#2F2F2F',fontSize:12}}>总价:</Text><Text
                        style={{color:'#CF0F35',fontSize:12}}>￥{this.props.gList['totalMoney'].toFixed(2)}</Text>
                    </View>
                </View>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    goods_view: {
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