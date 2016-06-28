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
    Navigator, TextInput
}from 'react-native';
import {OrderHeader, API, NetService, Toast} from './util/Path'

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

    componentDidUnMount() {
        cartThis = [];
        this.setState({
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
        });
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
                    Toast.show(result['result']['message']);
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
                    <ScrollView style={{flex:1}}>
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
                            style={{marginTop:12}}
                        />
                        <View
                            style={{flex:1,height:194,backgroundColor:'white',marginTop:11,paddingLeft:10,paddingRight:10}}>
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
                                        style={{height:47,paddingLeft:14,fontSize:14}}
                                    />
                                </View>
                            </View>
                            <View style={[styles.ordernews,{justifyContent:'flex-end'}]}>

                                <View style={{flexDirection:'row'}}>
                                    <Text style={{fontSize:12,marginTop:5}}>共计:</Text>
                                    <Text style={[styles.price,{marginTop:5}]}>￥</Text>
                                    <Text
                                        style={[styles.price,{fontSize: 18}]}>{this.state.money}</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View>
                    <View style={{flexDirection:'row',height:49,backgroundColor:'white'}}>
                        <View
                            style={[styles.bom,{flex:2, paddingLeft:10, borderTopColor:'#DBDBDB', borderTopWidth:0.5, flexDirection:'row', justifyContent:'flex-end',paddingRight:10}]}>
                            <Text style={{fontSize:12,marginTop:4}}>总价:</Text>
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
            <View style={styles.goods_view}>
                <View style={styles.goods_view_view}>
                    <View style={{flexDirection:'row',flex:7}}>
                        <View
                            style={{height:84,width:84,justifyContent:'center',alignItems:'center',borderWidth:0.5,borderColor:'rgba(191,191,191,0.5)',borderRadius:3}}>
                            <Image source={{uri:this.props.gList['imgUrl']}}
                                   style={{height:82,width:82,resizeMode:'stretch'}}/>
                        </View>
                        <View style={{flex:4,marginLeft:10}}>
                            <Text
                                style={{color:'#898989',fontSize:14,height:63}}>{this.props.gList['name'].substring(0, 50)}</Text>
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
    sty: {
        flexDirection: 'row',
        height: 38,
        backgroundColor: 'white',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(191,191,191,0.5)'
    },
    goods_view_view: {
        height: 115,
        backgroundColor: 'white',
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
        alignItems: 'center',
    }
})