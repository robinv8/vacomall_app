/**
 * Created by renyubin on 16/5/9.
 */
import React, {
    Component,
}from 'react';
import {
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
    ViewPagerAndroid,
    Navigator,
    Animated, Platform
}from 'react-native';
import {
    API,
    NetService,
    Login,
    DetailImg,
    Toast,
    DetailSwiper,
    GoodsSpec,
    HtmlRender,
    Loaddingpage,
    DetailHeader
} from '../util/Path';
import {priceColor} from '../util/global';
import {getHeight} from '../util/response';
const {height}=Dimensions.get('window')
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
            num: '1',
            contentHeight: null,
            guessFlag: false,
            shadeThis: null,
            imgdetails: null,
            isgoods: false
        };

    }

    componentDidMount() {
        setTimeout(()=> {
            NetService.postFetchData(API.DETAIL, 'id='+this.props.id, (result)=> {
                if (result['success'] === false) {
                    if (result['result']['code'] === 550) {
                        this.setState({
                            loaded: true,
                        })
                    } else {
                        Toast.show(result['result']['message']);
                    }

                    return;
                }
                var result = result['result'];
                this.setState({
                    swiperData: result['images'],
                    resultData: result
                });
                this.setDetails(result['details']);

                this.setState({
                    loaded: true,
                    isgoods: true
                })
                this.setState({
                    webImgData: result['imageDetails']
                })
            });
            //NetService.postFetchData(API.DETAIL, 'id=0ce43cfa29994a77b8572a788c1d2715', (result)=>_this._callback(result));
        }, 500);
    }


    setDetails(data) {
        this.setState({
            price: data['GoodsItemSalePrice'],
            details: data,
        })
    }

    _addCart() {
        this.state.shadeThis._shade();
    }


    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        if (!this.state.isgoods) {
            return this.isGoods();
        }
        return (
            <View style={{flex: 1, backgroundColor: '#F4F4F4',zIndex:1}}>
                <ScrollView
                    style={{flex:1}}
                    onContentSizeChange={(w, h)=>this._ContentSizeChange(w, h)}
                    onScroll={(event)=>this.handleScroll(event)}
                >
                    <ScrollView
                        style={{flex:1}}
                        pagingEnabled={true}
                        keyboardDismissMode='on-drag'
                    >
                        <DetailSwiper swiperData={this.state.swiperData}/>
                        <View style={styles.topshadow}>
                            <View style={{backgroundColor: 'white', padding: getHeight(10), marginBottom: getHeight(10), paddingBottom: getHeight(11)}}>
                                <View style={styles.goods_name}>
                                    <View style={{flex: 8}}>
                                        <Text
                                            style={{
                                                color: priceColor,
                                                fontSize:getHeight(14),
                                            }}>{this.state.details['GoodsItemTitle']}</Text>
                                    </View>
                                    <View style={{justifyContent: 'center', flex: 2, alignItems: 'center', opacity: 0}}>
                                        <Image source={require('../../images/share_icon.png')}
                                               style={styles.share_icon}/>
                                        <Text style={{color: '#979797', fontSize: getHeight(12)}}>分享</Text>
                                    </View>
                                </View>
                                <View style={styles.price_view}>
                                    <View
                                        style={{flex: 1, flexDirection: 'row'}}>
                                        <View style={styles.price_con}>
                                            <Text style={[styles.price, {fontSize: getHeight(16), marginTop: 3}]}>￥</Text>
                                            <Text
                                                style={[styles.price, {
                                                    fontSize: getHeight(22),
                                                    marginTop: getHeight(-4)
                                                }]}>{this.state.price}</Text>
                                        </View>
                                        <View
                                            style={[styles.price_con, {
                                                flex: 1,
                                                justifyContent: 'flex-start',
                                                marginLeft: getHeight(2)
                                            }]}>
                                            <Text
                                                style={[styles.bef_text, styles.bef_price]}>市场价￥{this.state.details['GoodsItemTagPrice']}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.sales}>
                                        <View style={styles.freight}><Text
                                            style={{fontSize: getHeight(14), color: '#BFBFBF'}}>运费:免邮</Text></View>
                                        <View style={[styles.freight, {alignItems: 'flex-end', marginRight: getHeight(5)}]}><Text
                                            style={{
                                                fontSize: getHeight(14),
                                                color: '#BFBFBF'
                                            }}>月销:{this.state.details['GoodsItemSales']}笔</Text></View>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    padding: getHeight(10),
                                    marginBottom: getHeight(10),
                                    paddingBottom: 0,
                                    paddingTop: 0,
                                    backgroundColor: 'white',
                                    height: getHeight(44),
                                    alignItems: 'center'
                                }}>
                                <View
                                    style={{flexDirection: 'row', alignItems: 'center',}}>
                                    <Image source={require('../../images/detail/right.png')}
                                           style={styles.exp_img}></Image>
                                    <Text style={styles.exp_text}>免运费</Text>
                                </View>
                                <View
                                    style={{flexDirection: 'row', alignItems: 'center', marginLeft: getHeight(30)}}>
                                    <Image source={require('../../images/detail/right.png')}
                                           style={styles.exp_img}/>
                                    <Text style={styles.exp_text}>七天无理由退货</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: getHeight(30)}}>
                                    <Image source={require('../../images/detail/right.png')}
                                           style={styles.exp_img}/>
                                    <Text style={styles.exp_text}>支持货到付款</Text>
                                </View>
                            </View>

                        </View>
                        <GoodsSpec _this2={this}/>
                        <View
                            style={{
                                paddingLeft: getHeight(5),
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: getHeight(25),
                                marginBottom: getHeight(25)
                            }}>
                            <Text style={{color: '#898989',fontSize:getHeight(14)}}>继续拖动,查看图文详情</Text>
                        </View>

                        {this.state.imgdetails}
                    </ScrollView>
                </ScrollView>
                <View
                    style={{
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
                            flex: 1,
                            paddingLeft: getHeight(10),
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            backgroundColor: 'white'
                        }]}>
                        <Text style={{fontSize: getHeight(12)}}>总价:</Text>
                        <Text style={[styles.price]}>￥</Text>
                        <Text
                            style={[styles.price, {
                                fontSize: getHeight(18),
                                marginTop: getHeight(-4)
                            }]}>{(this.state.price * this.state.num).toFixed(2)}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>this._addCart()}>
                        <View style={[styles.bom, {backgroundColor: '#16BD42'}]}>
                            <Text style={{fontSize: getHeight(14), color: 'white'}}>加入购物车</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }

    _ContentSizeChange(w, h) {
        if (this.beforeH === undefined) {
            this.setState({
                contentHeight: h
            });
            this.beforeH = true;
        }
    }

    handleScroll(event:Object) {
        console.log((event.nativeEvent.contentOffset.y + this.state.contentHeight).toString() + '--' + (Dimensions.get('window').height + 113).toString())
        if (event.nativeEvent.contentOffset.y + this.state.contentHeight > Dimensions.get('window').height && this.state.guessFlag === false) {
            this.setState({
                guessFlag: true,
                imgdetails: <DetailImg webImgData={this.state.webImgData}
                                       navigator={this.props._this1.props.navigator}/>
            })
        }
    }

    renderLoadingView() {
        return (
            <View style={{flex: 1}}>
                <Loaddingpage/>
            </View>
        );
    }

    isGoods() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>该商品已下架~</Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    price_view: {
        height: getHeight(74)
    },
    right_arrows: {
        resizeMode: 'stretch',
        width: getHeight(10),
        height: getHeight(15)
    },
    goods_name: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        paddingBottom: getHeight(11),
        borderBottomColor: '#E7E7E7',
        height:getHeight(59)
    },

    exp_img: {
        resizeMode: 'stretch',
        width: getHeight(14),
        height: getHeight(14)
    },
    exp_text: {
        fontSize: getHeight(12),
        color: '#909090'
    },
    topshadow: {
        shadowColor: 'rgb(178,178,178)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
            height: -1,
            width: 0
        }
    },
    share_icon: {
        width: getHeight(40),
        height: getHeight(25),
    },
    container: {
        backgroundColor: '#F4F4F4'
    },
    price_con: {
        flexDirection: 'row',
        height: getHeight(30),
        marginTop: getHeight(14)
    },
    price: {
        color: '#FD3824',
        fontSize: getHeight(16)
    },
    bef_text: {
        fontSize: getHeight(14),
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
        width: getHeight(130),
        justifyContent: 'center',
        alignItems: 'center'
    },
});