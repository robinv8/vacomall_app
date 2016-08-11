/**
 * Created by renyubin on 16/4/23.
 */
import React,{
    Component,
}from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Image,
    Dimensions,
    StatusBar,
    ScrollView,
    ListView,
    TouchableWithoutFeedback,
    Navigator
}from 'react-native';
import {Login,API,NetService,MenuButton,GoodsDetail,Toast,OrderSelectPage,PersonSafe,Guess} from './util/Path';
import {getHeight} from './util/response';
var listFlag = 0;
export default class Person extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            catArray1: [],
            catArray2: [],
            all: 0,
            dfk: null,
            dfh: null,
            dsh: null,
            thh: null,
            isrefresh:true,
            guess:null
        };
    }

    getPersion() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: Login,
            })
        }
    }

    
    componentWillReceiveProps(nextProps) {
        console.log(nextProps.active+' '+this.state.isrefresh)
        if (nextProps.active&&this.state.isrefresh) {
            this.componentWillMount()
        }
    }
    
    componentWillMount() {
        NetService.getFetchData(API.ORDERNUM, (result)=> {
            if (result['success'] === false) {
                Toast.show(result['result']['message']);
                if (result['result']['code'] === 303) {
                    const {navigator}=this.props;
                    if (navigator) {
                        navigator.replace({
                            component: Login,
                            params:{name:'Person'}
                        })
                    }
                }
                return;
            } else {
                this.setState({
                    guess: <Guess navigator={this.props.navigator}/>
                })
                let dfk = result[100];
                if (dfk > 0) {
                    dfk = dfk.toString();
                    this.setState({
                        dfk: <View style={styles.bub}>
                            <Text
                                style={{fontSize:getHeight(11.05),color:'white',backgroundColor:'rgba(0,0,0,0)'}}>{dfk.length > 2 ? dfk.substring(0, 1) + '+' : dfk}</Text>
                        </View>,
                    })
                }
                let dfh = result[200];
                if (dfh > 0) {
                    dfh = dfh.toString();
                    this.setState({
                        dfh: <View style={styles.bub}>
                            <Text
                                style={{fontSize:getHeight(11.05),color:'white',backgroundColor:'rgba(0,0,0,0)'}}>{dfh.length > 2 ? dfh.substring(0, 1) + '+' : dfh}</Text>
                        </View>
                    })
                }
                let dsh = result[300];
                if (dsh > 0) {
                    dsh = dsh.toString();
                    this.setState({
                        dsh: <View style={styles.bub}>
                            <Text
                                style={{fontSize:getHeight(11.05),color:'white',backgroundColor:'rgba(0,0,0,0)'}}>{dsh.length > 2 ? dsh.substring(0, 1) + '+' : dsh}</Text>
                        </View>
                    })
                }
                let thh = result[600];
                if (thh > 0) {
                    thh = thh.toString();
                    this.setState({
                        thh: <View style={styles.bub}>
                            <Text
                                style={{fontSize:getHeight(11.05),color:'white',backgroundColor:'rgba(0,0,0,0)'}}>{thh.length > 2 ? thh.substring(0, 1) + '+' : thh}</Text>
                        </View>
                    })
                }
                /*获取首页基本数据*/
                NetService.getFetchData(API.HOME + '?keys=INDEX_CAT', (result)=> {
                    this.cathandle(result);
                });
            }
        });

    }

    cathandle(result) {
        /*快捷入口*/
        var index_cat_data = result['INDEX_CAT']['items'];
        if (index_cat_data.length === 0) {
            return;
        }
        var _this = this;
        var catArray1 = [], catArray2 = []
        index_cat_data.map(function (data, index) {
            if (index < 4) {
                catArray1.push(<MenuButton key={index}
                                           id={data['Target']}
                                           imgUrl={data['ItemImg']}
                                           Xtype={data['Xtype']}
                                           showText={data['ItemName']}
                                           navigator={_this.props.navigator}/>)
            } else if (index < 8) {
                catArray2.push(<MenuButton key={index}
                                           id={data['Target']}
                                           imgUrl={data['ItemImg']}
                                           Xtype={data['Xtype']}
                                           showText={data['ItemName']}
                                           navigator={_this.props.navigator}/>)
            }
        });
        this.setState({
            catArray1: catArray1,
            catArray2: catArray2
        });
    }

    toOrderDetail(num) {
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: OrderSelectPage,
                params: {initialPage: num}
            })
        }
    }



    toDetails(id) {
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: GoodsDetail,
                params: {id: id}
            })
        }
    }

    toPersonSafe() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: PersonSafe,
            })
        }
    }
/*
* <View style={[styles.header_bottom,{opacity:0}]}>
 <View style={styles.header_bottom_con}/>
 <View style={styles.header_bottom_con}>
 <Text style={{color:'#CAEFDA'}}>购物券:</Text>
 <Text
 style={{fontFamily:'DIN Condensed',fontWeight:'bold',fontSize:28,color:'white',paddingTop:5}}>55</Text>
 <Text style={{color:'white',fontSize:12}}>张</Text>
 </View>
 <View style={[styles.header_bottom_con,{borderRightWidth:0}]}>
 <Text style={{color:'#CAEFDA'}}>优惠券:</Text>
 <Text
 style={{fontFamily:'DIN Condensed',fontWeight:'bold',fontSize:28,color:'white',paddingTop:5}}>4</Text>
 <Text style={{color:'white',fontSize:12}}>张</Text>
 </View>
 </View>
* */
    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="default"
                />
                <ScrollView style={styles.personHead}>
                    <Image source={require('../images/person_background.png')} style={styles.personHead_img}>
                        <View style={{flexDirection:'row',flex:1}}>
                            <View style={{height:getHeight(50),paddingLeft:getHeight(12),paddingTop:getHeight(14),flex:1}}>

                            </View>
                            <TouchableWithoutFeedback onPress={()=>this.toPersonSafe()}>
                                <View style={{alignItems:'center',marginTop:getHeight(20)}}>
                                    <Image source={require('../images/header_img.png')} style={styles.header_img}/>
                                    <Text
                                        style={{fontSize:getHeight(16),color:'white',backgroundColor:'rgba(0,0,0,0)',marginTop:getHeight(5)}}>HI!万小颗</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>this.toPersonSafe()}>
                                <View style={{height:getHeight(50),paddingRight:getHeight(13),paddingTop:getHeight(14),alignItems:'flex-end',flex:1}}>
                                    <Image source={require('../images/setting.png')} style={styles.settingIcon}/>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>

                    </Image>
                    <View style={{backgroundColor:'white',marginBottom:getHeight(10)}}>
                        <TouchableWithoutFeedback onPress={(num)=>this.toOrderDetail('all')}>
                            <View
                                style={{height:getHeight(50),alignItems:'center',flexDirection:'row',borderBottomWidth:0.5,borderBottomColor:'#E5E5E5'}}>
                                <View style={{flexDirection:'row',flex:1,alignItems:'center'}}>
                                    <Image source={require('../images/order_item.png')}
                                           style={[styles.settingIcon,{marginLeft:getHeight(18),marginRight:getHeight(5)}]}/>
                                    <Text style={{fontSize:getHeight(16)}}>全部订单</Text>
                                </View>
                                <View
                                    style={{flexDirection:'row',flex:1,justifyContent:'flex-end',alignItems:'center'}}>
                                    <Image source={require('../images/search_icon1.png')}
                                           style={[styles.searchIcon,{marginLeft:getHeight(18),marginRight:getHeight(5)}]}/>
                                    <Text style={{color:'#C2C2C2',fontSize:getHeight(14)}}>查看全部订单</Text>
                                    <Image source={require('../images/right_arrow.png')} style={[styles.right_arrow]}/>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={{flex:1,flexDirection:'row',height:getHeight(78),}}>
                            <TouchableWithoutFeedback onPress={(num)=>this.toOrderDetail(100)}>
                                <View style={{flex:1,alignItems:'center',paddingTop:getHeight(17)}}>
                                    <Image source={require('../images/order_icon1.png')} style={styles.order_icon}/>
                                    <Text style={{color:'#696969',fontSize:getHeight(12),marginTop:getHeight(6)}}>待付款</Text>
                                    {this.state.dfk}
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={(num)=>this.toOrderDetail(200)}>
                                <View style={{flex:1,alignItems:'center',paddingTop:getHeight(17)}}>
                                    <Image source={require('../images/order_icon2.png')} style={styles.order_icon}/>
                                    <Text style={{color:'#696969',fontSize:getHeight(12),marginTop:getHeight(6)}}>待发货</Text>
                                    {this.state.dfh}

                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={(num)=>this.toOrderDetail(300)}>
                                <View style={{flex:1,alignItems:'center',paddingTop:getHeight(17)}}>
                                    <Image source={require('../images/order_icon3.png')} style={styles.order_icon}/>
                                    <Text style={{color:'#696969',fontSize:getHeight(12),marginTop:getHeight(6)}}>待收货</Text>
                                    {this.state.dsh}
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={(num)=>this.toOrderDetail(400)}>
                                <View style={{flex:1,alignItems:'center',paddingTop:getHeight(17)}}>
                                    <Image source={require('../images/order_icon4.png')} style={styles.order_icon}/>
                                    <Text style={{color:'#696969',fontSize:getHeight(12),marginTop:getHeight(6)}}>退换货/售后</Text>
                                    {this.state.thh}
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <View style={styles.quick_view}>
                        <View style={styles.menuView}>
                            {this.state.catArray1.map(function (data, index) {
                                return <View key={index}
                                             style={{flex:1,height:getHeight(110),borderRightWidth:0.5,borderRightColor:'#F3F3F3'}}>{data}</View>
                            })}
                        </View>
                        <View style={[styles.menuView,styles.menuView2]}>
                            {this.state.catArray2.map(function (data, index) {
                                return <View key={index}
                                             style={{flex:1,height:getHeight(110),borderRightWidth:0.5,borderRightColor:'#F3F3F3'}}>{data}</View>
                            })}
                        </View>
                    </View>
                    {this.state.guess}
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5'
    },
    personHead: {
        flex: 1,
        height: getHeight(238),
    },
    personHead_img: {
        height: getHeight(208),
        width: Dimensions.get('window').width,
        paddingTop: Platform.OS === 'ios' ? getHeight(20) : 0,
    },
    settingIcon: {
        width: getHeight(20),
        height: getHeight(20),
        resizeMode: 'stretch',
    },
    header_img: {
        width: getHeight(120),
        height: getHeight(120),
        resizeMode: 'stretch',
    },
    header_bottom: {
        height: getHeight(60),
        backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    header_bottom_con: {
        flex: 1,
        borderRightWidth: 0.5,
        borderRightColor: '#4EA976',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchIcon: {
        marginRight: getHeight(2),
        width: getHeight(14),
        height: getHeight(14),
        resizeMode: 'stretch',
    },
    right_arrow: {
        width: getHeight(8),
        height: getHeight(10),
        resizeMode: 'stretch',
        marginLeft: getHeight(4),
        marginRight: getHeight(10),
    },
    order_icon: {
        width: getHeight(26),
        height: getHeight(23),
        resizeMode: 'stretch'
    },
    bub: {
        position: 'absolute',
        width: getHeight(15),
        height: getHeight(15),
        backgroundColor: '#FD3824',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        right: getHeight(25),
        top: getHeight(10)
    },
    quick_view: {
        height: getHeight(220),
        backgroundColor: 'white',
    },
    menuView: {
        flexDirection: 'row',
        height: getHeight(110),
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E5E5'
    },
    menuView2: {
        borderBottomWidth: 0
    },
    listview: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    cnxh_view: {
        alignItems: 'center',
        height: getHeight(51),
        justifyContent: 'center'
    },
    cnxh_view_img: {
        width: getHeight(96),
        height: getHeight(20),
        resizeMode: 'stretch',
    },
    price: {
        color: '#FF0200',
        fontSize: getHeight(18)
    },
    bprice: {
        color: '#BFBFBF',
        fontSize: getHeight(12),
        justifyContent: 'flex-end'
    },
})