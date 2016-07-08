/**
 * Created by renyubin on 16/6/17.
 */
'use strict';
import React,{
    Component,
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Dimensions,
    Image,
    Navigator,
    Platform,
    ScrollView,

}from 'react-native';
import {LinearGradient,Toast,Login,API,NetService,WeChatPayIos,WeChatPayAndroid,ChongZhi} from '../util/Path';


let WeChatPay;
export default class Flow extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            childShowView: null,
            reduce:0
        };
    }

    componentDidMount() {
        if(Platform.OS==='ios'){
            WeChatPay=WeChatPayIos;
        }else{
            WeChatPay=WeChatPayAndroid;
        }
        WeChatPay.registerApp();//注册微信

        if (this.props.hfData === null) {
            return;
        }
        let dataArray = this.props.llData['items'];
        let childArray = [], groupArray = [];
        let i = 0;
        var _this=this;
        dataArray.map(function (elem, index) {
            if (index % 3 - 1 === 0 && index !== 0) {
                childArray.push(<Child key={index}
                                       ItemName={elem['ItemName']}
                                       ItemSalePrice={elem['ItemSalePrice']}
                                       ItemPrice={elem['ItemPrice']}
                                       Target={elem['Target']}
                                       _this={_this}
                                       style={{marginLeft:10,marginRight:10}}/>);
            } else {
                childArray.push(<Child key={index}
                                       ItemName={elem['ItemName']}
                                       Target={elem['Target']}
                                       ItemPrice={elem['ItemPrice']}
                                       _this={_this}
                                       ItemSalePrice={elem['ItemSalePrice']}/>);
            }
            if ((index % 3 - 2===0 && index !== 0) || index === dataArray.length - 1) {
                groupArray.push(<View style={styles.child_con} key={i}>{childArray}</View>);
                childArray = [];
                i++;
            }
        });
        this.setState({
            childShowView: groupArray
        })
    }

    pay() {
        let mobile=this.props._this.state.text;
        if (mobile === '') {
            Toast.show('手机号码不正确!');
            return;
        }
        if (beforeThis === null) {
            Toast.show('请选择充值金额!');
            return;
        }
        ChongZhi.parentThis.setState({
            loadding: <View
                style={{flex:1,position:'absolute',top:0,width:Dimensions.get('window').width,height:Dimensions.get('window').height,justifyContent:'center',alignItems:'center'}}>
                <View
                    style={{width:200,height:140,backgroundColor:'rgba(0,0,0,0.5)',borderRadius:5,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'white'}}>正在加载,请等候……</Text>
                </View>
            </View>
        });
        let isWXAppInstalled = true;
        WeChatPay.isWXAppInstalled((res)=> {
            if (res) {
                submitOrder(this);
            }else{
                ChongZhi.parentThis.setState({
                    loadding: null
                });
            }
        });
        function submitOrder(_this){
            NetService.postFetchData(API.SUBMITCZ, 'phone=' + mobile + '&target=' + beforeThis.state.Target, (result)=> {
                if (result['success'] === false) {
                    Toast.show(result['result']['message']);
                    ChongZhi.parentThis.setState({
                        loadding: null
                    });
                    const {navigator}=_this.props;
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
                WeChatPay.order(result['result']['OutTradeId'],(result)=>{
                    ChongZhi.parentThis.setState({
                        loadding: null
                    });
                    if(result==='false'){
                        return
                    }
                    if(!result){
                        return
                    }
                    if (navigator) {
                        navigator.push({
                            component: PaySuccess,
                            sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                            params:{result:result}
                        })
                    }

                });

            });
        }
    }


    render() {
        return (
            <ScrollView style={{flex:1,backgroundColor:'#fafafa'}}>
                <View style={styles.child}>
                    {this.state.childShowView}
                </View>
                <View
                    style={{height:38,backgroundColor:'white',justifyContent:'center',paddingLeft:10,borderBottomWidth:0.5,borderBottomColor:'#DFDFDF'}}>
                    <Text style={{color:'#3C3C3C'}}>目前充值服务近支持微信支付</Text>
                </View>
                <View
                    style={{height:56,backgroundColor:'white',alignItems:'center',paddingLeft:10,flexDirection:'row',paddingRight:12,borderBottomWidth:0.5,borderBottomColor:'#E6E6E6'}}>
                    <View style={{flexDirection:'row',flex:1,alignItems:'center'}}>
                        <Image source={require('../../images/wechat_icon.png')}
                               style={{width:25,height: 25,resizeMode: 'stretch',marginRight:10}}
                        />
                        <Text>微信支付</Text>
                    </View>
                    <View>
                        <Image source={require('../../images/right.png')}
                               style={{width:18,height: 18,resizeMode: 'stretch'}}/>
                    </View>
                </View>
                <View style={{alignItems:'center',marginTop:27}}>
                    <TouchableWithoutFeedback onPress={()=>this.pay()}>
                        <LinearGradient colors={['#16BD42', '#16BD42', '#16BD42']} style={styles.linearGradient}>
                            <Text style={[styles.buttonText]}>
                                立即支付 <Text style={{fontSize:14}}>(立省{this.state.reduce}元)</Text>
                            </Text>
                        </LinearGradient>
                    </TouchableWithoutFeedback>
                </View>
            </ScrollView>

        );
    }
}
let beforeThis = null;
class Child extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            backgroundColor: 'white',
            beforeThis: null,
            fontSize1: 16,
            color1: '#16BD42',
            fontSize2: 10,
            color2: '#16BD42',
            Target: this.props.Target
        };
    }

    _select() {
        if (beforeThis !== null) {
            beforeThis.setState({
                backgroundColor: 'white',
                fontSize1: 16,
                color1: '#16BD42',
                fontSize2: 10,
                color2: '#16BD42'
            });
        }
        this.setState({
            backgroundColor: '#16BD42',
            fontSize1: 20,
            color1: '#FDFF00',
            fontSize2: 12,
            color2: 'white',

        });
        this.props._this.setState({
            reduce:(this.props.ItemPrice-this.props.ItemSalePrice).toFixed(2)
        })

        beforeThis = this;
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={()=>this._select()}>
                <View style={[styles.child_view,this.props.style,{backgroundColor:this.state.backgroundColor}]}>
                    <Text style={{fontSize:this.state.fontSize1,color:this.state.color1}}>{this.props.ItemName}</Text>
                    <Text
                        style={{fontSize:this.state.fontSize2,color:this.state.color2}}>仅需{this.props.ItemSalePrice}元</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    child_view: {
        width: (Dimensions.get('window').width - 42) / 3,
        height: 70,
        borderWidth: 1,
        borderColor: '#16BD42',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    child_con: {
        flexDirection: 'row',
        marginBottom: 10,
        width: Dimensions.get('window').width - 22,
        flexWrap: 'wrap',
    },
    child: {
        paddingLeft: 11,
        paddingRight: 11,
        paddingTop: 20,
        paddingBottom: 10,
        marginBottom: 21,
        backgroundColor: 'white'
    },
    linearGradient: {
        flex: 1,
        height: 46,
        width: Dimensions.get('window').width - 24,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        backgroundColor: 'transparent',
        color: 'white'
    },
});