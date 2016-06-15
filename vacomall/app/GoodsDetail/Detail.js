/**
 * Created by renyubin on 16/5/9.
 */
import React,{
    Component,
    View,
    StyleSheet,
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    TextInput,
    Alert,
    WebView,
    ToastAndroid,
    ViewPagerAndroid,
    Navigator,
    Animated
}from 'react-native';


import API from '../util/api';
import * as NetService from '../util/NetService';

import Login from '../Login';
import DetailImg from './DetailImg';
import Toast from 'react-native-root-toast';
import DetailSwiper from './DetailSwiper';
import GoodsSpec from './GoodsSpec';
import HtmlRender from 'react-native-html-render';
export default class GoodsDetail extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            price: '0',
            loaded: false,
            id: null,
            webImgData: null,
            swiperData: null,
            resultData: null,
            specs: null,
            num: '0',
            contentHeight:null,
            guessFlag:false
        };

    }

    componentDidMount() {
        var _this = this;
        setTimeout(function () {
            NetService.postFetchData(API.DETAIL, 'id=' + _this.props.id, (result)=>_this._callback(result));
            //NetService.postFetchData(API.DETAIL, 'id=0ce43cfa29994a77b8572a788c1d2715', (result)=>_this._callback(result));
        }, 400);
    }

    _callback(result) {
        if (result['success'] === false) {
            ToastAndroid.show(result['result']['message'], ToastAndroid.SHORT);
            return;
        }
        this.setState({
            swiperData: result['images'],
            resultData: result
        });
        this.setDetails(result['details']);

        this.setState({
            loaded: true
        })
        this.setState({
            webImgData: result['imageDetails'][0]['SpuDetail']
        })
    }

    setDetails(data) {
        this.setState({
            price: data['GoodsItemSalePrice'],
            details: data,
        })
    }

    _addCart() {
        if (this.state.id === null) {
            Toast.show('请选择商品规格!');
        } else {
            NetService.postFetchData(API.ADDCART, 'id=' + this.state.id + '&buySum=' + this.state.num, (result)=>this._callback1(result));
        }
    }

    _callback1(result) {
        this.setState({
            btnStatus: true
        });
        if (result['success'] === false) {
            Toast.show(result['result']['message']);
            if (result['result']['code'] === 303) {
                const {navigator}=this.props.parentProps;
                if (navigator) {
                    navigator.replace({
                        component: Login,
                        sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                        params: {page: 'GoodsDetail', id: this.props.id}
                    })
                }
            }
            return;
        }
        Toast.show(result['message']);
        seacVueObj.map(function (_this) {
            _this.setState({
                specColor: '#C3C3C3'
            });
        });
        seacVueObj = [], this.state.id = null;
    }

    toDetailImg() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: DetailImg,
                sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                params: {webImgData: this.state.webImgData, _back: this.props._back}
            })
        }
    }

    handleScroll(event:Object) {
        console.log(event.nativeEvent.contentOffset.y+Dimensions.get('window').height + '-' + this.state.contentHeight)
        if (event.nativeEvent.contentOffset.y + Dimensions.get('window').height-100> this.state.contentHeight && this.state.guessFlag === false) {
            const {navigator}=this.props;
            if (navigator) {
                navigator.push({
                    component: DetailImg,
                    sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                    params: {webImgData: this.state.webImgData, _back: this.props._back}
                })
            }
        }
    }

    _ContentSizeChange(w, h) {
        console.log(h)
        this.setState({
            contentHeight: h
        });
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return (
            <View style={{flex:1,backgroundColor:'#F4F4F4'}}>
                <View style={{flex:1}}>
                    <ScrollView
                        style={{flex:1}}
                        onContentSizeChange={(w,h)=>this._ContentSizeChange(w,h)}
                        onScroll={(event)=>this.handleScroll(event)}
                    >
                        <DetailSwiper swiperData={this.state.swiperData}/>
                        <View>
                            <View style={{backgroundColor:'white',padding:10,marginBottom:10,paddingBottom:0}}>
                                <View style={styles.goods_name}>
                                    <View style={{flex:8}}>
                                        <Text style={{color:'#3C3C3C'}}>{this.state.details['GoodsItemTitle']}</Text>
                                    </View>
                                    <View style={{justifyContent:'center',flex:2,alignItems:'center'}}>
                                        <Image source={require('../../images/share_icon.png')}
                                               style={styles.share_icon}/>
                                        <Text>分享</Text>
                                    </View>
                                </View>
                                <View style={styles.price_view}>
                                    <View
                                        style={{flex:1,flexDirection:'row',borderRightWidth:1,borderRightColor:'#E3E3E3'}}>
                                        <View style={styles.price_con}>
                                            <Text style={[styles.price,{fontSize:16,marginTop:3}]}>￥</Text>
                                            <Text
                                                style={[styles.price,{fontSize: 22,marginTop:-4}]}>{this.state.price}</Text>
                                        </View>
                                        <View
                                            style={[styles.price_con,{flex:1,justifyContent:'flex-end',marginRight:6}]}>
                                            <Text
                                                style={[styles.bef_text,styles.bef_price]}>市场价￥{this.state.details['GoodsItemTagPrice']}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.sales}>
                                        <View style={styles.freight}><Text
                                            style={{fontSize:14,color:'#BFBFBF',marginLeft:16}}>快递:0.00</Text></View>
                                        <View style={[styles.freight,{alignItems:'flex-end',marginRight:5}]}><Text
                                            style={{fontSize:14,color:'#BFBFBF'}}>月销:{this.state.details['GoodsItemSales']}笔</Text></View>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={{flexDirection:'row',padding:10,marginBottom:10,paddingBottom:0,paddingTop:0,backgroundColor:'white',height:44,alignItems:'center'}}>
                                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-start'}}>
                                    <Image source={require('../../images/detail/right.png')}
                                           style={styles.exp_img}></Image>
                                    <Text style={styles.exp_text}>免运费</Text>
                                </View>
                                <View style={{flexDirection:'row',flex:1}}>
                                    <Image source={require('../../images/detail/right.png')}
                                           style={styles.exp_img}/>
                                    <Text style={styles.exp_text}>包邮</Text>
                                </View>
                                <View style={{flexDirection:'row',flex:2}}>
                                    <Image source={require('../../images/detail/right.png')}
                                           style={styles.exp_img}/>
                                    <Text style={styles.exp_text}>支持货到付款</Text>
                                </View>
                                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                                    <Image source={require('../../images/detail/right.png')}
                                           style={styles.exp_img}/>
                                    <Text style={styles.exp_text}>七天无理由退货</Text>
                                </View>
                            </View>

                        </View>
                        <GoodsSpec _this2={this}/>
                        <TouchableWithoutFeedback onPress={()=>this.toDetailImg()}>
                            <View
                                style={{paddingLeft:5,height:40,justifyContent:'center',alignItems:'center'}}>
                                <Text>继续拖动,查看图文详情</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </View>
                <View>
                    <View style={{flexDirection:'row',height:49,backgroundColor:'white'}}>
                        <View
                            style={[styles.bom,{flex:1, paddingLeft:10, flexDirection:'row', justifyContent:'flex-start',backgroundColor:'white', borderTopColor:'#DBDBDB', borderTopWidth:1,}]}>
                            <Text style={{fontSize:12}}>总价:</Text>
                            <Text style={[styles.price]}>￥</Text>
                            <Text
                                style={[styles.price,{fontSize: 18,marginTop:-4}]}>{(this.state.price * this.state.num).toFixed(2)}</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>this._addCart()}>
                            <View style={[styles.bom,{flex:1,backgroundColor:'#ff9402'}]}>
                                <Text style={{fontSize:14,color:'white'}}>加入购物车</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        );
    }


    renderLoadingView() {
        return (
            <View style={{flex:1}}>
                <View style={{flex:1,justifyContent: 'center',alignItems: 'center',backgroundColor:'#F4F4F4'}}>
                    <Image source={require('../../images/loading.gif')}
                           style={{width:70,height:50,resizeMode:'stretch'}}/>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    price_view: {
        flexDirection: 'row',
    },
    right_arrows: {
        resizeMode: 'stretch',
        width: 10,
        height: 15
    },
    goods_name: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingBottom: 5,
        borderBottomColor: '#E7E7E7'
    },

    exp_img: {
        resizeMode: 'stretch',
        width: 14,
        height: 14,
        marginTop: Dimensions.ios === 'ios' ? 0 : 2
    },
    exp_text: {
        fontSize: 12,
        color: '#909090'
    },
    share_icon: {
        width: 40,
        height: 25,
        resizeMode: 'stretch'
    },
    container: {
        backgroundColor: '#F4F4F4'
    },
    price_con: {
        flexDirection: 'row',
        height: 45,
        alignItems: 'center'
    },
    price: {
        color: '#FD3824',
        fontSize: 16
    },
    bef_text: {
        fontSize: 14,
        color: '#BFBFBF'
    },
    bef_price: {
        textDecorationLine: 'line-through'
    },
    sales: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    freight: {
        flex: 1
    },
    bom: {
        justifyContent: 'center',
        alignItems: 'center'
    },
});