/**
 * Created by renyubin on 16/4/23.
 */
import React,{
    Component,
    View,
    Text,
    StyleSheet,
    Platform,
    Image,
    Dimensions,
    StatusBar,
    ScrollView,
    ListView,
    TouchableWithoutFeedback
}from 'react-native';
import Login from './Login';
import API from './util/api';
import * as NetService from './util/NetService';
import MenuButton from './HomePage/MenuButton';
import GoodsDetail from './GoodsDetail';
var listFlag = 0;
export default class Person extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            catArray1: [],
            catArray2: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2)=>row1 !== row2
            }),
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

    componentDidMount() {
        /*获取首页基本数据*/
        NetService.getFetchData(API.HOME + '?keys=INDEX_CAT', (result)=>_callback(result));
        var _this=this;
        function _callback(result){
            _this.cathandle(result);
        };
        NetService.getFetchData(API.GUESS, (result)=>_guessCallback(result));
        function _guessCallback(result){
            _this.setState({
                dataSource: _this.state.dataSource.cloneWithRows(result)
            });
        }
    }
    cathandle(result){
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
                                           id={data['GroupId']}
                                           imgUrl={data['ItemImg']}
                                           Xtype={data['Xtype']}
                                           showText={data['ItemName']}
                                           navigator={_this.props.navigator}/>)
            } else if (index < 8) {
                catArray2.push(<MenuButton key={index}
                                           id={data['GroupId']}
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
    renderGList(gList) {
        var _textLength = function (text) {
            var rtnText = "";
            if (text.length > 20) {
                rtnText = text.substring(0, 25)
            } else {
                rtnText = text;
            }
            return rtnText;
        };
        var listMarginRight = 0;
        if (listFlag % 2 === 0) {
            listMarginRight = 5;
        } else {
            listMarginRight = 0;
        }
        listFlag++;

        return (
            <TouchableWithoutFeedback onPress={(id)=>this.toDetails(gList['Id'])}>
                <View style={[styles.goods_view,{marginRight:listMarginRight}]}>
                    <View
                        style={{alignItems: 'center',justifyContent: 'center',borderBottomWidth:1,borderBottomColor:'#F3F3F3',marginBottom:5}}>
                        <Image source={{uri:gList['SpuDefaultImage']}}
                               style={{width: 150,height: 150,marginBottom:10}}/>
                    </View>
                    <View style={{marginLeft:7,marginRight:4}}>
                        <View style={{marginBottom:1,height:32}}>
                            <Text style={{fontSize:12,color:'#3C3C3C'}}>{_textLength(gList['GoodsItemTitle'])}</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row'}}>
                            <View style={{flex:1,marginBottom:5}}>
                                <Text style={styles.price}><Text
                                    style={{fontSize:12}}>￥</Text>{gList['GoodsItemSalePrice']}
                                </Text>
                            </View>
                            <View style={{flex:1,justifyContent:'flex-end',alignItems:'flex-end',marginBottom:5}}>
                                <Text style={styles.bprice}>{gList['GoodsItemSales']}人已付款</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
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
    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="default"
                />
                <ScrollView style={styles.personHead}>
                    <Image source={require('../images/person_background.png')} style={styles.personHead_img}>
                        <View style={{flexDirection:'row',flex:1}}>
                            <View style={{height:50,paddingLeft:12,paddingTop:14,flex:1}}>

                            </View>
                            <View style={{alignItems:'center',marginTop:20}}>
                                <Image source={require('../images/header_img.png')} style={styles.header_img}/>
                                <Text style={{fontSize:16,color:'white',backgroundColor:'rgba(0,0,0,0)',marginTop:5}}>HI!万小颗</Text>
                            </View>
                            <View style={{height:50,paddingRight:13,paddingTop:14,alignItems:'flex-end',flex:1}}>
                                <Image source={require('../images/setting.png')} style={styles.settingIcon}/>
                            </View>
                        </View>
                        <View style={[styles.header_bottom,{opacity:0}]}>
                            <View style={styles.header_bottom_con}/>
                            <View style={styles.header_bottom_con}>
                                <Text style={{color:'#CAEFDA'}}>购物券:</Text>
                                <Text style={{fontFamily:'DIN Condensed',fontWeight:'bold',fontSize:28,color:'white',paddingTop:5}}>55</Text>
                                <Text style={{color:'white',fontSize:12}}>张</Text>
                            </View>
                            <View style={[styles.header_bottom_con,{borderRightWidth:0}]}>
                                <Text style={{color:'#CAEFDA'}}>优惠券:</Text>
                                <Text style={{fontFamily:'DIN Condensed',fontWeight:'bold',fontSize:28,color:'white',paddingTop:5}}>4</Text>
                                <Text style={{color:'white',fontSize:12}}>张</Text>
                            </View>
                        </View>
                    </Image>
                    <View style={{backgroundColor:'white',marginBottom:10}}>
                        <View style={{height:50,alignItems:'center',flexDirection:'row',borderBottomWidth:0.5,borderBottomColor:'#E5E5E5'}}>
                            <View style={{flexDirection:'row',flex:1,alignItems:'center'}}>
                                <Image source={require('../images/order_item.png')} style={[styles.settingIcon,{marginLeft:18,marginRight:5}]}/>
                                <Text>全部订单</Text>
                            </View>
                            <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end',alignItems:'center'}}>
                                <Image source={require('../images/search_icon1.png')} style={[styles.searchIcon,{marginLeft:18,marginRight:5}]}/>
                                <Text style={{color:'#C2C2C2'}}>查看全部订单</Text>
                                <Image source={require('../images/right_arrow.png')} style={[styles.right_arrow]}/>
                            </View>
                        </View>
                        <View style={{flex:1,flexDirection:'row',height:78,paddingTop:17}}>
                            <View style={{flex:1,alignItems:'center'}}>
                                <Image source={require('../images/order_icon1.png')} style={styles.order_icon}/>
                                <Text style={{color:'#696969',fontSize:12,marginTop:6}}>待付款</Text>

                            </View>
                            <View style={{flex:1,alignItems:'center'}}>
                                <Image source={require('../images/order_icon2.png')} style={styles.order_icon}/>
                                <Text style={{color:'#696969',fontSize:12,marginTop:6}}>待付款</Text>
                                <View style={styles.bub}>
                                    <Text style={{fontSize:11.05,color:'white',backgroundColor:'rgba(0,0,0,0)'}}>10</Text>
                                </View>
                            </View>
                            <View style={{flex:1,alignItems:'center'}}>
                                <Image source={require('../images/order_icon3.png')} style={styles.order_icon}/>
                                <Text style={{color:'#696969',fontSize:12,marginTop:6}}>待付款</Text>
                            </View>
                            <View style={{flex:1,alignItems:'center'}}>
                                <Image source={require('../images/order_icon4.png')} style={styles.order_icon}/>
                                <Text style={{color:'#696969',fontSize:12,marginTop:6}}>待付款</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.quick_view}>
                        <View style={styles.menuView}>
                            {this.state.catArray1.map(function(data,index){
                            return <View key={index} style={{flex:1,height:110,borderRightWidth:0.5,borderRightColor:'#F3F3F3'}}>{data}</View>
                        })}
                        </View>
                        <View style={[styles.menuView,styles.menuView2]}>
                            {this.state.catArray2.map(function(data,index){
                                return <View key={index} style={{flex:1,height:110,borderRightWidth:0.5,borderRightColor:'#F3F3F3'}}>{data}</View>
                            })}
                        </View>
                    </View>
                    <View
                        style={styles.cnxh_view}>
                        <Image source={require('../images/cnxh_tit.png')} style={styles.cnxh_view_img}/>
                    </View>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={(gList)=>this.renderGList(gList)}
                        contentContainerStyle={styles.listview}/>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#F5F5F5'
    },
    personHead: {
        flex: 1,
        height: 238,
    },
    personHead_img: {
        height: 208,
        width:Dimensions.get('window').width,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        //resizeMode: 'stretch',
    },
    backIcon: {
        width: 12,
        height: 18,
        resizeMode: 'stretch',
    },
    settingIcon:{
        width: 20,
        height: 20,
        resizeMode: 'stretch',
    },
    header_img:{
        width: 120,
        height: 120,
        //resizeMode: 'stretch',
    },
    goods_view: {
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
    header_bottom:{
        height:60,
        backgroundColor:'rgba(0,0,0,0.25)',
        justifyContent:'flex-end',
        flexDirection:'row'
    },
    header_bottom_con:{
        flex:1,
        borderRightWidth:0.5,
        borderRightColor:'#4EA976',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    searchIcon: {
        marginRight: 2,
        width: 14,
        height: 14,
        resizeMode: 'stretch',
    },
    right_arrow:{
        width: 8,
        height: 10,
        resizeMode: 'stretch',
        marginLeft: 4,
        marginRight: 10,
    },
    order_icon:{
        width:26,
        height:23,
        resizeMode: 'stretch'
    },
    bub:{
        position:'absolute',
        width:15,
        height:15,
        backgroundColor:'#FF9700',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:15,
        right:25,
        top:-10
    },
    quick_view: {
        height: 220,
        backgroundColor:'white',
    },
    menuView: {
        flexDirection: 'row',
        height:110,
        alignItems:'center',
        borderBottomWidth:0.5,
        borderBottomColor:'#E5E5E5'
    },
    menuView2: {
        borderBottomWidth:0
    },
    listview: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    cnxh_view: {
        alignItems: 'center',
        height: 40,
        justifyContent: 'center'
    },
    cnxh_view_img: {
        width: 96,
        height: 20,
        resizeMode: 'stretch',
    },
    price: {
        color: '#FF0200',
        fontSize: 18
    },
    bprice: {
        color: '#BFBFBF',
        fontSize: 12,
        justifyContent: 'flex-end'
    },
})