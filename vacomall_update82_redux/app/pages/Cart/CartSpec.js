/**
 * Created by renyubin on 16/6/4.
 */

import React, {
    Component,
}from 'react';
import {
    TouchableWithoutFeedback,
    Animated,
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TextInput,
    ScrollView,
    Platform,
    Navigator
}from 'react-native';
import {Toast, Login, API, NetService, md5} from '../util/Path';
import {priceColor} from '../util/global';
import {getHeight} from '../util/response';
let secp = null, seacVueObj = [], specification = {}, cartListThis,cartPageThis, shadeThis;

export default class CartSpec extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            bottom: new Animated.Value(-Dimensions.get('window').height / 2 - 150),
            specColor: '#C3C3C3',
            specifications: null,
            num: '1',
            store: '0',
            id: null,
            SkuSpecification: null,
            shadeTop: Dimensions.get('window').height
        };
        this._specSelect = this._specSelect.bind(this);
    }

    _shade() {
        this.setState({
            shadeTop: 0
        });
        Animated.timing(this.state.bottom, {
            toValue: Platform.OS === 'ios' ? 0 : 25,// 将其值以动画的形式改到一个较小值
            decay: 0.1,
        }).start();
    }

    componentWillMount() {
        cartListThis = this.props._this2;
        cartPageThis=cartListThis.props.This;
    }

    /*componentWillUnmount(){
     secp = null, seacVueObj = [], specification = {}, cartListThis, shadeThis;
     this.state.bottom.stopAnimation(value=>{
     console.log('动画结束!')
     })
     }*/
    componentDidMount() {
        shadeThis = this;
        //console.log(shadeThis);
        this.props._this2.setState({
            shadeThis: shadeThis
        });
        seacVueObj = [], secp = null;
        specification = cartListThis.state.resultData['allGoods'];
        var specifications = cartListThis.state.resultData['specifications']
        this.setSpecifications(specifications);
        this._shade();
    }

    cancelshade() {
        Animated.timing(this.state.bottom, {
            toValue: -Dimensions.get('window').height / 2 - 150,                         // 将其值以动画的形式改到一个较小值
            decay: 0.3,
        }).start(()=> {
            this.setState({
                shadeTop: Dimensions.get('window').height
            });
        })
    }

    setSpecifications(datas) {
        var secpArray = [];
        let skuSpecificationArray=cartListThis.state.skuSpecification.split(',');//已选中的规格值
        datas.forEach((data, index)=> {
            var secp = data.SpecificationInfo.split(',');
            var specvueArray = []
            secp.forEach((data1, index1)=> {
                if (data1 === skuSpecificationArray[index]) {
                    specvueArray.push(<Spec key={index1} flag={index} result={datas.length} specvue={data1}
                                            selected={true}
                                            specSelect={this._specSelect}/>)
                } else {
                    specvueArray.push(<Spec key={index1} flag={index} result={datas.length} specvue={data1}
                                            specSelect={this._specSelect}/>)
                }

            });
            secpArray.push(<View key={index}
                                 style={styles.spec_view}>
                    <View style={{flexDirection: 'row', marginBottom: getHeight(13)}}>
                        <Text style={{fontSize: getHeight(14), color: '#3C3C3C'}}>{data['SpecificationName']}</Text><Text
                        style={{fontSize: getHeight(12), marginLeft: getHeight(3), color: '#F08100', marginTop: 1}}></Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                        {specvueArray}
                    </View>
                </View>
            )
        });
        this.setState({
            specifications: secpArray
        });
    }

    _num(flag) {
        if (flag === 'add') {
            let num = (parseInt(this.state.num) + 1).toString()
            this.setState({
                num: num
            })
        } else {
            let num = "";
            if (this.state.num === '1') {
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
        if (obj === 'error') {
            seacVueObj.map(function (_this) {
                _this.setState({
                    specColor: '#E9E9EA',
                    specVueTextColor: '#898989'
                });
            });
            this.setState({
                id: null,
                num: '1'
            });

            this.cancelshade();
        } else if (obj !== undefined) {
            this.setState({
                price: obj['GoodsSalePrice'],
                id: obj['Id'],
                store: obj['GoodsStore'],
                SkuSpecification: obj['SkuSpecification']
            });
            cartListThis.setState({
                skuSpecification:obj['SkuSpecification']
            });
        }
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

    _addCart() {
        if (this.state.id === null) {
            Toast.show('请选择商品规格!');
        } else {
            NetService.postFetchData(API.DELETECART, 'id=' + this.props._this2.state.id, (result)=> {
                if (result['success'] === false) {
                    Toast.show(result['result']['message']);
                    return;
                }
                this.props._this2.setState({
                    id: this.state.id
                })
                NetService.postFetchData(API.ADDCART, 'id=' + this.state.id + '&buySum=' + this.props._this2.state.num, (result)=>this._callback1(result));
            });
        }
    }

    _callback1(result) {
        this.setState({
            btnStatus: true
        });
        if (result['success'] === false) {
            Toast.show(result['result']['message']);
            if (result['result']['code'] === 303) {
                const {navigator}=cartListThis.props.parentProps;
                if (navigator) {
                    navigator.push({
                        component: Login,
                        sceneConfig: Navigator.SceneConfigs.FadeAndroid
                        //params: {page: 'GoodsDetail', id: this.props.id}
                    })
                }
            }
            return;
        }
        result = result['result'];
        Toast.show(result['message']);
        seacVueObj.map(function (_this) {
            _this.setState({
                specColor: '#E9E9EA',
                specVueTextColor: '#898989'
            });
        });
        this.setState({
            id: null,
            num: '1'
        });
        this.cancelshade();
        cartPageThis.setState({
            gList:[],//清空列表
            isrefresh: true
        })
    }

    render() {
        return (
            <View style={[styles.drawer, {top: this.state.shadeTop}]}>
                <TouchableWithoutFeedback onPress={()=>this.cancelshade()}>
                    <View style={{flex: 1}}/>
                </TouchableWithoutFeedback>
                <Animated.View
                    style={[styles.animate_view, {bottom: this.state.bottom}]}>
                    <View style={[styles.info_view]}>
                        <View style={[styles.info_view1]}>
                            <View style={styles.info_viewText}>
                                <View style={{flex: 5, height: getHeight(90)}}>
                                    <View>
                                        <Text
                                            style={{
                                                marginTop: getHeight(21),
                                                color: '#3C3C3C',
                                                marginBottom: getHeight(5),
                                                fontSize: getHeight(14)
                                            }}>{cartListThis.state.resultData['details']['GoodsItemTitle'].substring(0, 24)}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={styles.price_con}>
                                            <Text
                                                style={[styles.price, {fontSize: getHeight(16), marginTop: 0}]}>￥</Text>
                                            <Text
                                                style={[styles.price, {
                                                    fontSize: getHeight(20),
                                                    marginTop: getHeight(-4)
                                                }]}>{cartListThis.state.resultData['details']['GoodsItemSalePrice']}</Text>
                                        </View>
                                        <View style={styles.price_con}>
                                            <Text
                                                style={[styles.bef_text, styles.bef_price]}>市场价￥{cartListThis.state.resultData['details']['GoodsItemTagPrice']}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View
                                    style={{flex: 1}}>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            flex: 1,
                            marginBottom: getHeight(10),
                            marginLeft: getHeight(10),
                            position: 'relative'
                        }}>
                            <Image defaultSource={require('../../images/defaultImage.png')}
                                   source={{uri: cartListThis.state.resultData['images'][0]['ImagePath']}}
                                   style={styles.shade_img}/>
                        </View>
                        <View style={{position: 'absolute', top: getHeight(30), right: 0}}>
                            <TouchableWithoutFeedback onPress={()=>this.cancelshade()}>
                                <Image source={require('../../images/close_icon.png')}
                                       style={{
                                           width: getHeight(20),
                                           height: getHeight(20),
                                           marginTop: getHeight(5),
                                           marginRight: getHeight(6)
                                       }}/>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>

                    <ScrollView style={{height: Dimensions.get('window').height / 2 - 100, backgroundColor: 'white'}}>
                        <View>{this.state.specifications}</View>
                    </ScrollView>
                    <View style={{backgroundColor: 'white'}}>
                        <TouchableWithoutFeedback onPress={()=>this._addCart()}>
                            <View
                                style={{
                                    backgroundColor: '#16BD42',
                                    flex: 1,
                                    height: getHeight(46),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 2,
                                    margin: getHeight(12),
                                    marginBottom: getHeight(9),
                                }}>
                                <Text style={{fontSize: getHeight(18), color: 'white'}}>完成</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                </Animated.View>
            </View>
        );
    }
}
class Spec extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            specColor: '#E9E9EA',
            flag: this.props.flag,
            specvue: this.props.specvue,
            result: this.props.result,
            specVueTextColor: '#898989'
        };
    }
    componentDidMount(){
        if(this.props.selected){
            this._specSelect();
        }
    }
    _specSelect() {
        if (seacVueObj[this.state.flag] !== undefined) {
            seacVueObj[this.state.flag]._specUnSelect();
        }
        seacVueObj[this.state.flag] = this;
        this.setState({
            specColor: '#F08100',
            specVueTextColor: 'white'
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
            var spec = specification[vueMd5];
            if (spec === undefined) {
                Toast.show('该商品暂不能购买!');
                this.props.specSelect('error');//商品规格异常
                return;
            }
            this.props.specSelect(specification[vueMd5]);
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
            specColor: '#E9E9EA',
            specVueTextColor: '#898989'
        })
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={()=>this._specSelect()}>
                <View style={[styles.specVue, {backgroundColor: this.state.specColor}]}><Text
                    style={[styles.specVueText, {color: this.state.specVueTextColor}]}>{this.state.specvue}</Text></View>
            </TouchableWithoutFeedback>
        );
    }
}
const styles = StyleSheet.create({
    spec_view: {
        marginBottom: getHeight(10),
        paddingBottom: getHeight(15),
        borderBottomWidth: 0.5,
        borderBottomColor: '#E7E7E7',
        marginTop: getHeight(14),
        marginLeft: getHeight(10),
        marginRight: getHeight(10)
    },
    info_view: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        height: getHeight(129),
    },
    info_view1: {
        backgroundColor: 'rgba(255,255,255,1)',
        position: 'absolute',
        bottom: 0,
        width: Dimensions.get('window').width,
    },
    info_viewText: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#E7E7E7',
        flex: 1,
        paddingLeft: getHeight(130),
        justifyContent: 'flex-end',
        paddingBottom: getHeight(16),
        marginLeft: getHeight(10),
        position: 'relative'
    },
    spec: {
        color: '#3C3C3C',
        fontSize: getHeight(14)
    },
    shade_img: {
        width: getHeight(109),
        height: getHeight(109),
        borderWidth: 0.5,
        borderColor: '#E7E7E7',
        borderRadius: 5,
        resizeMode: 'cover'
    },
    price_con: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    price: {
        color: '#FD3824',
        fontSize: getHeight(16)
    },
    bef_text: {
        marginLeft: getHeight(6),
        fontSize: getHeight(12),
        color: '#BFBFBF'
    },
    bef_price: {
        textDecorationLine: 'line-through'
    },
    animate_view: {
        width: Dimensions.get('window').width,

    },
    input_view: {
        width: getHeight(40),
        height: getHeight(35),
        marginTop: Platform.OS === 'ios' ? 0 : getHeight(5)
    },
    sub_view: {
        width: getHeight(35),
        height: getHeight(35),
        justifyContent: 'center',
        alignItems: 'center'
    },
    drawer: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 100,
        bottom: 0
    },
    right_arrows: {
        resizeMode: 'stretch',
        width: getHeight(10),
        height: getHeight(15)
    },
    goods_name: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingBottom: getHeight(5),
        borderBottomColor: '#E7E7E7'
    },
    specVue: {
        padding: getHeight(5.5),
        paddingTop: getHeight(6),
        paddingBottom: getHeight(7),
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: getHeight(10),
        marginBottom: getHeight(10),
        height: getHeight(30)
    },
    specVueText: {
        fontSize: getHeight(12)
    }
});
