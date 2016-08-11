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
import {getHeight} from '../util/response';
let WeChatPay;
export default class ReturnListComponent extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            handle: null,
            liststate: null
        };
    }

    componentDidMount() {
        prevThis = null
        switch (this.props.gList['ReturnStateInfo']) {
            case "退款中":
                this.setState({
                    handle: <View style={{flexDirection:'row',marginTop:getHeight(13)}}>
                        <TouchableWithoutFeedback
                            onPress={(returnSkuId)=>this._cancelReturnSKU(this.props.gList['Id'])}>
                            <View style={[styles.btn,styles.btn1]}><Text style={{color:'white'}}>取消退货</Text></View>
                        </TouchableWithoutFeedback>
                    </View>
                })
                break
        }
    }

    _cancelReturnSKU(returnSkuId) {
        NetService.postFetchData(API.CANCELRETURNSKU, 'returnSkuId=' + returnSkuId, (result)=> {
            if (result['success'] === false) {
                Toast.show(result['result']['message']);
                ChongZhi.parentThis.setState({
                    loadding: null
                });

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

    componentDidUnMount() {

    }


    render() {
        return (
            <View style={{backgroundColor:'#FAFAFA',flex:1}}>
                <View style={styles.orderWrap}>
                    <View style={{height:getHeight(48),justifyContent:'center',borderBottomWidth:0.5,borderBottomColor:'#dfdfdf'}}>
                        <Text style={{color:'#BFBFBF',fontSize:getHeight(16)}}>订单编号:{this.props.gList['ReturnCode']}</Text>
                    </View>
                    <CartList gList={this.props.gList} navigator={this.props._this.props.navigator}
                              _this={this.props._this}/>
                    <View style={{justifyContent:'center',alignItems:'flex-end',marginTop:getHeight(17),marginBottom:getHeight(20)}}>
                        <View><Text style={{color:'#898989',fontSize:getHeight(14)}}>共计{this.props.gList['SkuNum']}件商品 合计:<Text
                            style={{color:'#FD3824',fontSize:getHeight(12)}}>￥</Text><Text
                            style={{color:'#FD3824',fontSize:getHeight(18)}}>{this.props.gList['ReturnMoney']}</Text></Text></View>
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
            borderBottomWidth: 0.5,
            liststate: null,
            handel:null
        };
    }
    cancelReturnSKU(returnSkuId){
        NetService.postFetchData(API.CANCELRETURNSKU,'returnSkuId='+returnSkuId,(result)=>{
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
            Toast.show(result['result']['message']);
        })
    }
    deleteReturnSKU(returnSkuId){
        NetService.postFetchData(API.DELETERETURNSKU,'returnSkuId='+returnSkuId,(result)=>{
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
            Toast.show(result['result']['message']);
        })
    }
    confirmReturnSKU(returnSkuId){
        NetService.postFetchData(API.DELETERETURNSKU,'returnSkuId='+returnSkuId,(result)=>{
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
            Toast.show(result['result']['message']);
        })
    }
    componentDidMount() {
        this.setState({
            liststate: <View style={{flexDirection:'row',marginTop:getHeight(13)}}>
                <View style={[styles.min_btn]}><Text style={{color:'#FF9700',fontSize:getHeight(12)}}>{this.props.gList['ReturnStateInfo']} </Text></View>
            </View>
        })
        switch (this.props.gList['ReturnState']){
            case 10://退款中
                this.setState({
                    handle: <View style={{flexDirection:'row',marginTop:getHeight(13)}}>
                        <TouchableWithoutFeedback onPress={(returnSkuId)=>this.cancelReturnSKU(this.props.gList['Id'])}>
                            <View style={styles.btn}><Text style={{color:'#898989'}}>取消退款</Text></View>
                        </TouchableWithoutFeedback>
                    </View>
                });
                break;
            case 11://已确认
                this.setState({
                    handle: null
                })
                break;
            case 15://已收货
                this.setState({
                    handle: <View style={{flexDirection:'row',marginTop:getHeight(13)}}>
                        <TouchableWithoutFeedback onPress={(returnSkuId)=>this.confirmReturnSKU(this.props.gList['Id'])}>
                            <View style={styles.btn}><Text style={{color:'#898989'}}>确认收款</Text></View>
                        </TouchableWithoutFeedback>
                    </View>
                })
                break;
            case 20://已完成
                this.setState({
                    handle: null
                })
                break;
            case 90://已取消
                this.setState({
                    handle: <View style={{flexDirection:'row',marginTop:getHeight(13)}}>
                        <TouchableWithoutFeedback onPress={(returnSkuId)=>this.deleteReturnSKU(this.props.gList['Id'])}>
                            <View style={styles.btn}><Text style={{color:'#898989'}}>删除</Text></View>
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


    render() {
        return (
            <View style={styles.goods_view}>
                <View style={[styles.goods_view_view,{borderBottomWidth:this.state.borderBottomWidth}]}>
                    <View style={{flexDirection:'row',flex:7}}>
                        <View
                            style={{height:getHeight(84),width:getHeight(84),justifyContent:'center',alignItems:'center',borderWidth:0.5,borderColor:'#dfdfdf',borderRadius:3}}>
                            <Image source={{uri:this.props.gList['SpuDefaultImage']}}
                                   style={{height:getHeight(82),width:getHeight(81),resizeMode:'stretch'}}/>
                        </View>
                        <View style={{flex:4,marginLeft:getHeight(10),marginTop:getHeight(5)}}>
                            <Text
                                style={{color:'#BFBFBF',fontSize:getHeight(14)}}>{this.texthandle(this.props.gList['SkuTitle'])}</Text>
                            <Text
                                style={{color:'#BFBFBF',fontSize:getHeight(12),marginTop:getHeight(6)}}>规格:{this.props.gList['SkuSpecification']}</Text>
                        </View>
                    </View>

                    <View
                        style={{flex:2,alignItems:'flex-end',paddingRight:2,height:getHeight(114),paddingTop:getHeight(20),justifyContent:'flex-start'}}>
                        <View>
                            <Text style={{color:'#BFBFBF',fontSize:getHeight(10)}}>￥<Text
                                style={{fontSize:getHeight(14)}}>{this.props.gList['SkuSalePrice']}</Text></Text>
                        </View>
                        <View style={{marginTop:getHeight(5)}}>
                            <Text style={{color:'#C8C8C8',fontSize:getHeight(16)}}>×{this.props.gList['SkuNum']}</Text>
                        </View>
                        {this.state.liststate}
                    </View>
                </View>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    orderWrap: {
        backgroundColor: '#FFFFFF',
        marginTop: getHeight(10),
        borderBottomWidth: 1,
        borderBottomColor: '#E6E6E6',
        paddingLeft: getHeight(10),
        paddingRight: getHeight(10)
    },
    btn: {
        width: getHeight(90),
        height: getHeight(32),
        borderWidth: 1,
        borderColor: '#898989',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn1: {
        marginLeft: getHeight(10),
        backgroundColor: '#16BD42',
        borderWidth: 0
    },
    min_btn: {
        width: getHeight(54),
        height: getHeight(20),
        borderWidth: 0.5,
        borderColor: '#FF9700',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    goods_view: {
        backgroundColor: 'white',
        height: getHeight(114),
        flex: 1
    },

    goods_view_view: {
        height: getHeight(114),
        flexDirection: 'row',
        borderBottomColor: '#dfdfdf',
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
        height: getHeight(47),
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(191,191,191,0.5)',
        flexDirection: 'row',
        alignItems: 'center'
    }
})