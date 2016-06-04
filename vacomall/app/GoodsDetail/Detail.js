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
import md5 from '../util/md5.min';
import Login from '../Login';
import DetailImg from './DetailImg';

import DetailSwiper from './DetailSwiper';
import GoodsSpec from './GoodsSpec';

export default class GoodsDetail extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            specColor: '#C3C3C3',
            num: '1',
            price: '0',
            loaded: false,
            id: null,
            webImgData: null,
            swiperData:null
        };
        this._specSelect = this._specSelect.bind(this)
    }

    componentDidMount() {
        seacVueObj = [], specification = {}, secp = null;
        var _this = this;
        setTimeout(function () {
            //NetService.postFetchData(API.DETAIL, 'id=' + _this.props.id, (result)=>_this._callback(result));
            NetService.postFetchData(API.DETAIL, 'id=73426069403c4d04ac6963989e4c1ef9', (result)=>_this._callback(result));
        }, 400);
    }

    _callback(result) {
        if (result['success'] === false) {
            ToastAndroid.show(result['result']['message'], ToastAndroid.SHORT);
            return;
        }
        this.setState({
            swiperData:result['images']
        });
        this.setDetails(result['details']);
        this.setSpecifications(result['specifications'])
        this.setState({
            loaded: true
        })
        specification = result['allGoods'];
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

    setSpecifications(datas) {
        var _this = this;
        var secpArray = [];
        datas.forEach(function (data, index) {
            var secp = data.SpecificationInfo.split(',');
            var specvueArray = []
            secp.forEach(function (data1, index1) {
                specvueArray.push(<Spec key={index1} flag={index} result={datas.length} specvue={data1}
                                        specSelect={_this._specSelect}/>)
            });
            secpArray.push(<View key={index} style={{marginBottom:10,paddingBottom:15,borderBottomWidth:1,borderBottomColor:'red'}}>
                <View style={{flexDirection:'row',marginBottom:5}}>
                    <Text style={{fontSize:12,color:'#2F2F2F'}}>{data['SpecificationName']}</Text><Text
                    style={{fontSize:12,marginLeft:3,color:'#F08100',marginTop:1}}></Text>
                </View>
                <View style={{flex:1,flexDirection:'row',flexWrap:'wrap'}}>
                    {specvueArray}
                </View>
            </View>)
        })
        this.setState({
            specifications: secpArray
        });
    }

    _onChange(num) {
        var res = /^[0-9]*$/;
        var _this = this;
        if (res.test(num) && num !== "") {
            if (num.substring(0, 1) === "0") {
                num = num.substring(1)
            }
            _this.setState({
                num: num
            })
        } else {
            _this.setState({
                num: '1'
            })
        }
    }

    _addCart() {
        if (this.state.id === null) {
            ToastAndroid.show('请选择商品规格!', ToastAndroid.SHORT);
        } else {
            NetService.postFetchData(API.ADDCART, 'id=' + this.state.id + '&buySum=' + this.state.num, (result)=>this._callback1(result));
        }
    }

    _callback1(result) {
        this.setState({
            btnStatus: true
        });
        if (result['success'] === false) {
            ToastAndroid.show(result['result']['message'], ToastAndroid.SHORT);
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
        ToastAndroid.show(result['message'], ToastAndroid.SHORT);
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

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return (
            <View style={{flex:1,backgroundColor:'#F4F4F4'}}>
                <View style={{flex:1}}>
                    <ScrollView
                        style={{flex:1}}>
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
                                        <View style={styles.price_con}>
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
                            <GoodsSpec specifications={this.state.specifications} _this={this}/>
                        </View>

                        <TouchableWithoutFeedback onPress={()=>this.toDetailImg()}>
                            <View
                                style={{marginTop:10,backgroundColor:'white',paddingLeft:5,height:50,justifyContent:'center',alignItems:'center'}}>
                                <Text>点击查看图片详情</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </View>
                <View>
                    <View style={{flexDirection:'row',height:40,backgroundColor:'white'}}>
                        <View
                            style={[styles.bom,{flex:180, paddingLeft:10, borderTopColor:'#DBDBDB', borderTopWidth:0.5, flexDirection:'row', justifyContent:'flex-start'}]}>
                            <Text style={{fontSize:12}}>总价:</Text>
                            <Text style={[styles.price]}>￥</Text>
                            <Text
                                style={[styles.price,{fontSize: 18,marginTop:-4}]}>{(this.state.price * this.state.num).toFixed(2)}</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>this._addCart()}>
                            <View style={[styles.bom,{flex:99,backgroundColor:'#ff9402'}]}>
                                <Text style={{fontSize:14,color:'white'}}>加入购物车</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                {this.state.specs}
            </View>
        );
    }

    _num(flag) {
        if (flag === 'add') {
            var num = (parseInt(this.state.num) + 1).toString()
            this.setState({
                num: num
            })
        } else {
            var num = "";
            if (this.state.num === '0') {
                num = this.state.num
            } else {
                num = (parseInt(this.state.num) - 1).toString()
            }
            this.setState({
                num: num
            })
        }
    }

    _specSelect(obj) {
        if (obj !== undefined) {
            this.setState({
                price: obj['GoodsSalePrice'],
                id: obj['Id'],
            })
        }
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

var secp = null, seacVueObj = [], specification = {};
class Spec extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            specColor: '#C3C3C3',
            flag: this.props.flag,
            specvue: this.props.specvue,
            result: this.props.result
        };
    }

    _specSelect() {
        if (seacVueObj[this.state.flag] !== undefined) {
            seacVueObj[this.state.flag]._specUnSelect();
        }
        seacVueObj[this.state.flag] = this;
        this.setState({
            specColor: '#F08100'
        });

        var jslength = 0;
        for (var js2 in seacVueObj) {
            jslength++;
        }

        if (jslength === this.state.result) {
            var specvue = "";
            for (var i = 0; i < jslength; i++) {
                specvue = specvue + seacVueObj[i].state.specvue + ','
            }
            var vueMd5 = md5(specvue.substring(0, specvue.length - 1)).toUpperCase();
            this.props.specSelect(specification[vueMd5])
        }
        if (secp === this) {
            return;
        } else if (secp != null && this.state.flag === secp.state.flag) {
            secp._specUnSelect();
        }
        secp = this;
    }

    _specUnSelect() {
        this.setState({
            specColor: '#C3C3C3'
        })
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={()=>this._specSelect()}>
                <View style={[styles.specVue,{borderColor:this.state.specColor}]}><Text
                    style={styles.specVueText}>{this.state.specvue}</Text></View>
            </TouchableWithoutFeedback>
        );
    }
}
const styles = StyleSheet.create({
    price_view: {
        flexDirection: 'row',
    },
    drawer: {
        position: 'absolute',
        top: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgba(0,0,0,0.3)'
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
    spec: {
        color: '#3C3C3C',

    },
    exp_img: {
        resizeMode: 'stretch',
        width: 14,
        height: 14
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
        flex: 1,
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
    specVue: {
        padding: 10,
        paddingTop: 3,
        paddingBottom: 3,
        borderWidth: 1,
        marginRight: 5,
        marginBottom: 5
    },
    specVueText: {
        fontSize: 12,
        color: '#2F2F2F'
    }
});