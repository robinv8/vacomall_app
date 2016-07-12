/**
 * Created by renyubin on 16/6/4.
 */

import React,{Component} from 'react';
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

let secp = null, seacVueObj = [], specification = {}, detailThis, shadeThis;

export default class GoodsSpec extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            spec: '选择规格',
        };
    }

    componentDidMount() {
        detailThis = this.props._this2;

        detailThis.props._this1.setState({
            specs: <Shade _this3={this}/>
        });
    }

    render() {
        return (
            <View>
                <TouchableWithoutFeedback onPress={()=>shadeThis._shade()}>
                    <View
                        style={{flexDirection:'row',padding:10,marginBottom:10,paddingBottom:0,paddingTop:0,backgroundColor:'white',height:44,alignItems:'center'}}>
                        <View style={{flexDirection:'row',flex:1,justifyContent:'flex-start'}}>
                            <Text style={styles.spec}>{this.state.spec}</Text>
                        </View>
                        <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                            <Image source={require('../../images/detail/right_arrows.png')}
                                   style={styles.right_arrows}/>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    };
}
export class Shade extends Component {
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

    componentDidMount() {
        shadeThis = this;
        console.log(shadeThis);
        this.props._this3.props._this2.setState({
            shadeThis: shadeThis
        });
        seacVueObj = [], specification = {}, secp = null;
        specification = detailThis.state.resultData['allGoods'];
        var specifications = detailThis.state.resultData['specifications']
        this.setSpecifications(specifications);
    }

    cancelshade() {
        var _this = this;
        Animated.timing(this.state.bottom, {
            toValue: -Dimensions.get('window').height / 2 - 150,                         // 将其值以动画的形式改到一个较小值
            decay: 0.3,
        }).start(function () {
            _this.setState({
                shadeTop: Dimensions.get('window').height
            });
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
            secpArray.push(<View key={index}
                                 style={styles.spec_view}>
                    <View style={{flexDirection:'row',marginBottom:13}}>
                        <Text style={{fontSize:14,color:'#3C3C3C'}}>{data['SpecificationName']}</Text><Text
                        style={{fontSize:12,marginLeft:3,color:'#F08100',marginTop:1}}></Text>
                    </View>
                    <View style={{flex:1,flexDirection:'row',flexWrap:'wrap'}}>
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
        if(obj==='error'){
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
            this.props._this3.setState({
                spec: '选择规格'
            });
            detailThis.setState({
                id: null
            });
            this.cancelshade();
        }else if (obj !== undefined) {
            this.setState({
                price: obj['GoodsSalePrice'],
                id: obj['Id'],
                store: obj['GoodsStore'],
                SkuSpecification: obj['SkuSpecification']
            });
            this.props._this3.setState({
                spec: '已选:"' + obj['SkuSpecification'] + '"'
            });
            detailThis.setState({
                id: obj['Id']
            })
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
                const {navigator}=detailThis.props.parentProps;
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
        this.props._this3.setState({
            spec: '选择规格'
        });
        detailThis.setState({
            id: null
        });
        this.cancelshade();
    }

    render() {
        return (
            <View style={[styles.drawer,{top:this.state.shadeTop}]}>
                <TouchableWithoutFeedback onPress={()=>this.cancelshade()}>
                    <View style={{flex:1}}/>
                </TouchableWithoutFeedback>
                <Animated.View
                    style={[styles.animate_view,{bottom:this.state.bottom}]}>
                    <View style={[styles.info_view]}>
                        <View style={[styles.info_view1]}>
                            <View style={styles.info_viewText}>
                                <View style={{flex:5,height:90}}>
                                    <View>
                                        <Text
                                            style={{marginTop:21,color:'#3C3C3C',marginBottom:5}}>{detailThis.state.resultData['details']['GoodsItemTitle'].substring(0, 24)}</Text>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <View style={styles.price_con}>
                                            <Text style={[styles.price,{fontSize:16,marginTop:0}]}>￥</Text>
                                            <Text
                                                style={[styles.price,{fontSize: 20,marginTop:-4}]}>{detailThis.state.resultData['details']['GoodsItemSalePrice']}</Text>
                                        </View>
                                        <View style={styles.price_con}>
                                            <Text
                                                style={[styles.bef_text,styles.bef_price]}>市场价￥{detailThis.state.resultData['details']['GoodsItemTagPrice']}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View
                                    style={{flex:1}}>
                                </View>
                            </View>
                        </View>
                        <View style={{flex:1,marginBottom:10,marginLeft:10,position:'relative'}}>
                            <Image defaultSource={require('../../images/defaultImage.png')}
                                source={{uri:detailThis.state.resultData['images'][0]['ImagePath']}}
                                   style={styles.shade_img}/>
                        </View>
                        <View style={{position:'absolute',top:30,right:0}}>
                            <TouchableWithoutFeedback onPress={()=>this.cancelshade()}>
                                <Image source={require('../../images/close_icon.png')}
                                       style={{width:20,height:20,marginTop:5,marginRight:6}}/>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>

                    <ScrollView style={{height:Dimensions.get('window').height/2-100,backgroundColor:'white'}}>
                        <View>{this.state.specifications}</View>
                        <View style={{padding:5,flexDirection:'row',alignItems:'center'}}>
                            <View style={{marginBottom:10,marginLeft:10,marginRight:10}}>
                                <View style={{flexDirection:'row',marginBottom:5}}>
                                    <Text style={{fontSize:14,color:'#2F2F2F'}}>数量</Text>
                                </View>
                                <View style={{flexDirection:'row',width:110,height:35,backgroundColor:'#F5F5F5'}}>
                                    <TouchableWithoutFeedback onPress={(flag)=>this._num('sub')}>
                                        <View
                                            style={styles.sub_view}>
                                            <Image source={require('../../images/sub.png')}
                                                   style={{width:10,height:2,resizeMode:'stretch'}}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <View
                                        style={styles.input_view}>
                                        <TextInput
                                            style={{flex:1,paddingLeft:5,paddingRight:5,textAlign:'center',fontSize:18,height:35,paddingTop:1}}
                                            keyboardType={'numeric'}
                                            onChangeText={(num)=>this._onChange(num)}
                                            underlineColorAndroid='transparent'
                                            value={this.state.num}
                                        />
                                    </View>
                                    <TouchableWithoutFeedback onPress={(flag)=>this._num('add')}>
                                        <View
                                            style={styles.sub_view}><Image
                                            source={require('../../images/add.png')}
                                            style={{width:10,height:10,resizeMode:'stretch'}}/></View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                            <View
                                style={{height:35,justifyContent:'center',marginLeft:10,marginTop:Dimensions.ios==='ios'?5:10}}>
                                <Text
                                    style={{fontSize:12,color:'#BFBFBF'}}>(库存{this.state.store}件)</Text>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{backgroundColor:'white'}}>
                        <TouchableWithoutFeedback onPress={()=>this._addCart()}>
                            <View
                                style={{backgroundColor:'#16BD42',flex:1,height:46,justifyContent:'center',alignItems:'center',borderRadius:2,margin:12,marginBottom:9,}}>
                                <Text style={{fontSize:18,color:'white'}}>完成</Text>
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
            var spec=specification[vueMd5];
            if(spec===undefined){
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
                <View style={[styles.specVue,{backgroundColor:this.state.specColor}]}><Text
                    style={[styles.specVueText,{color:this.state.specVueTextColor}]}>{this.state.specvue}</Text></View>
            </TouchableWithoutFeedback>
        );
    }
}
const styles = StyleSheet.create({
    spec_view: {
        marginBottom: 10,
        paddingBottom: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E7E7E7',
        marginTop: 14,
        marginLeft: 10,
        marginRight: 10
    },
    info_view: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        height: 129,
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
        paddingLeft: 130,
        justifyContent: 'flex-end',
        paddingBottom: 16,
        marginLeft: 10,
        position: 'relative'
    },
    spec: {
        color: '#3C3C3C'
    },
    shade_img: {
        width: 109,
        height: 109,
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
        fontSize: 16
    },
    bef_text: {
        marginLeft: 6,
        fontSize: 12,
        color: '#BFBFBF'
    },
    bef_price: {
        textDecorationLine: 'line-through'
    },
    animate_view: {
        width: Dimensions.get('window').width,

    },
    input_view: {
        width: 40,
        height: 35,
        marginTop: Platform.OS === 'ios' ? 0 : 5
    },
    sub_view: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },
    drawer: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgba(0,0,0,0.5)'
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
    specVue: {
        padding: 8,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 5.71,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 23,
        marginBottom: 10
    },
    specVueText: {
        fontSize: 12
    }
});
