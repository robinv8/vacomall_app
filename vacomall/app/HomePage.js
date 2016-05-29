/**
 * Created by renyubin on 16/4/24.
 */
'use strict';
import React, {
    Component,
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Alert,
    RefreshControl,
    Dimensions,
    TouchableWithoutFeedback,
    ListView,
    Navigator,
    BackAndroid,
    Platform,
    ToastAndroid
} from 'react-native';
import Swiper from 'react-native-swiper2';
import MenuButton from './HomePage/MenuButton';
import HomeHeader from './HomePage/HomeHeader';
import GoodsDetail from './GoodsDetail';
import ListPage from './ListPage';
import API from './util/api';
import * as NetService from './util/NetService';

export default class HomePage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            swiper: [],
            catArray1: [],
            catArray2: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2)=>row1 !== row2,
            }),
            loaded: false,
            content: ''
        };
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', ()=>this.onBackAndroid());
        }
    }

    onBackAndroid() {
        const {navigator} = this.props;
        const routers = navigator.getCurrentRoutes();
        if (routers.length > 1) {
            var displayName = routers[routers.length - 1]['component']['displayName'];
            if (displayName === 'paySuccess') {
                navigator.popToTop();
            } else {
                navigator.pop();
            }
            return true;
        }
        return false;
    };

    componentDidMount() {
        /*获取首页基本数据*/
        NetService.getFetchData(API.HOME + '?keys=INDEX_IMAGE,INDEX_CAT_DATA,INDEX_HOT_GOODS,INDEX_NOTE', (result)=>this._callback(result));

        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', (BackAndroid)=>this.onBackAndroid(BackAndroid));
        }
    }

    /*异步请求后的回调*/
    _callback(result) {
        var index_img = result['INDEX_IMAGE']['DataValue'];
        var imgArray = [];
        var _this = this;
        JSON.parse(index_img).map(function (data, index) {
            switch (data['Type']) {
                case 1:
                    imgArray.push(<TouchableWithoutFeedback key={index} onPress={()=>_this.toDetails(data['ItemId'])}>
                            <View style={styles.wrapper}>
                                <Image style={styles.slide} source={{uri:data["ImgUrl"]}}></Image>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                    break;
                case 2:
                    imgArray.push(<TouchableWithoutFeedback key={index}
                                                            onPress={()=>_this._selectGoodsList(data['Cid'])}>
                            <View style={styles.wrapper}>
                                <Image style={styles.slide} source={{uri:data["ImgUrl"]}}></Image>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                    break;
                case 3:
                    imgArray.push(<TouchableWithoutFeedback key={index}
                                                            onPress={()=>_this.historyOnSubmit(data['keywords'])}>
                            <View style={styles.wrapper}>
                                <Image style={styles.slide} source={{uri:data["ImgUrl"]}}></Image>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                    break;
            }

        });
        this.setState({
            swiper: <Swiper autoplay={true} height={170} paginationStyle={{bottom: 5}}>
                {imgArray}
            </Swiper>
        });

        var index_cat_data = result['INDEX_CAT_DATA']['DataValue'];

        var _this = this;
        var catArray1 = [], catArray2 = []
        JSON.parse(index_cat_data).map(function (data, index) {
            if (index < 4) {
                catArray1.push(<MenuButton key={index}
                                           id={data['Id']}
                                           color={data['BgColor']}
                                           showText={data['Title']}
                                           navigator={_this.props.navigator}/>)
            } else if (index < 8) {
                catArray2.push(<MenuButton key={index}
                                           id={data['Id']}
                                           color={data['BgColor']}
                                           showText={data['Title']}
                                           navigator={_this.props.navigator}/>)
            }
        });
        this.setState({
            catArray1: catArray1,
            catArray2: catArray2
        });
        var index_hot_data = result['INDEX_HOT_GOODS']['DataValue'];
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(JSON.parse(index_hot_data))
        });

        var index_note = result['INDEX_NOTE']['DataValue'];
        this.setState({
            content: JSON.parse(index_note)['Note']
        });
    }

    _selectGoodsList(id) {
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: ListPage,
                sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                params: {id: id}

            })
        }
    }

    historyOnSubmit(text) {
        if (text === "") {
            return;
        }
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: ListPage,
                params: {
                    text: text,
                    id: null
                }
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

    renderGList(gList) {
        var _textLength = function (text) {
            var rtnText = "";
            if (text.length > 20) {
                rtnText = text.substring(0, 25) + '…'
            } else {
                rtnText = text;
            }
            return rtnText;
        }
        return (
            <TouchableWithoutFeedback onPress={(id)=>this.toDetails(gList['Id'])}>
                <View style={styles.goods_view}>

                    <View style={{alignItems: 'center',justifyContent: 'center'}}>
                        <Image source={{uri:gList['ImageUrl']}}
                               style={{width: 150,height: 150,marginBottom:10}}></Image>
                    </View>
                    <View style={{marginBottom:10}}>
                        <Text style={{fontSize:12}}>{_textLength(gList['SkuTitle'])}</Text>
                    </View>
                    <View style={{flex:1,flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <Text style={styles.price}>￥{gList['SkuPrice']}</Text>
                        </View>
                        <View
                            style={{borderColor:'#e43777',borderWidth:1,borderRadius:5,width:50,height:20,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:10,color:'#e43777'}}>立即抢购</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    render() {
        return (
            <View style={{flex:1}}>
                <HomeHeader navigator={this.props.navigator}/>
                <ScrollView style={{backgroundColor:'#F6F6F6'}}>
                    <View style={{height:170}}>
                        {this.state.swiper}
                    </View>
                    <View style={styles.quick}>
                        <View style={styles.quick_view}>
                            <View style={styles.menuView}>
                                {this.state.catArray1}
                            </View>
                            <View style={styles.menuView}>
                                {this.state.catArray2}
                            </View>
                        </View>

                        <View style={styles.ad}>
                            <View style={styles.ad_topic}>
                                <Image style={styles.headline}
                                       source={require('../images/Headline.png')}/>
                                <Text style={styles.ad_topic_text}>{this.state.content}</Text>
                            </View>
                            <View style={styles.ad_more}><Text style={styles.ad_more_text}>更多></Text></View>
                        </View>
                    </View>
                    <View style={[styles.seckill,{marginTop: 12}]}>
                        <View style={styles.seckill_1}>
                            <Image source={require('../images/kill_img_1.png')} style={styles.seckill_1_img}></Image>
                        </View>
                        <View style={styles.seckill_2}>
                            <View style={styles.seckill_3}>
                                <Image source={require('../images/kill_img_2.png')}
                                       style={styles.seckill_2_img}></Image>
                            </View>
                            <View style={[styles.seckill_2]}>
                                <Image source={require('../images/kill_img_3.png')}
                                       style={styles.seckill_3_img}></Image>
                            </View>
                        </View>
                    </View>
                    <View style={styles.chaoshihui}>
                        <View style={styles.chaoshihui_title}>
                            <Image source={require('../images/chaoshihui_tit.png')} style={styles.csh_tit}></Image>
                        </View>
                        <View style={styles.seckill}>
                            <View style={styles.seckill_1}>
                                <Image source={require('../images/csh_img1.png')} style={styles.seckill_1_img}></Image>
                            </View>
                            <View style={styles.seckill_2}>
                                <View style={styles.seckill_3}>
                                    <Image source={require('../images/csh_img2.png')}
                                           style={styles.seckill_2_img}></Image>
                                </View>
                                <View style={[styles.seckill_2]}>
                                    <Image source={require('../images/csh_img3.png')}
                                           style={styles.seckill_3_img}></Image>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.chaoshihui,{height:236}]}>
                        <View style={styles.chaoshihui_title}>
                            <Image source={require('../images/ppzg_tit.png')}
                                   style={[styles.csh_tit,{width:96,height:22}]}></Image>
                        </View>
                        <View style={styles.seckill}>
                            <View style={[styles.seckill_1,{justifyContent:'center'}]}>
                                <Image source={require('../images/ppzg_img1.png')}
                                       style={[styles.seckill_1_img,{width:68,height:170}]}></Image>
                            </View>
                            <View style={[styles.seckill_1,{justifyContent:'center'}]}>
                                <Image source={require('../images/ppzg_img2.png')}
                                       style={[styles.seckill_1_img,{width:89,height:172}]}></Image>
                            </View>
                            <View style={[styles.seckill_1,{justifyContent:'center'}]}>
                                <Image source={require('../images/ppzg_img3.png')}
                                       style={[styles.seckill_1_img,{width:60,height:178}]}></Image>
                            </View>
                        </View>
                    </View>
                    <View
                        style={styles.cnxh_view}>
                        <Image source={require('../images/cnxh_tit.png')} style={styles.cnxh_view_img}></Image>
                    </View>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={(gList)=>this.renderGList(gList)}
                        contentContainerStyle={styles.listview}></ListView>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    menuView: {
        flexDirection: 'row',
        marginTop: 12
    },
    quick_view:{
    height:170
    },
    seckill: {
        flex: 1,
        height: 201,
        backgroundColor: 'white',

        flexDirection: 'row',
        shadowColor: 'rgb(0,0,0)',
        shadowOpacity: 0.1,
        shadowRadius: 0,
        shadowOffset: {
            height: 1,
            width: 0
        }
    },
    seckill_1: {
        flex: 1,
        borderRightWidth: 0.5,
        borderRightColor: '#E5E5E5',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    seckill_1_img: {
        width: 138,
        height: 190,
        resizeMode: 'stretch'
    },
    seckill_2_img: {
        width: 186,
        height: 74,
        resizeMode: 'stretch'
    },
    seckill_3_img: {
        width: 183,
        height: 93,
        resizeMode: 'stretch'
    },
    seckill_2: {
        flex: 1,
        justifyContent: 'center'
    },
    seckill_3: {
        flex: 1,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E5E5',
        justifyContent: 'center'
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row',
    },
    slide: {
        flex: 1,
        resizeMode: 'stretch',
    },
    ad: {
        backgroundColor: '#F3F3F3',
        marginLeft: 10,
        marginTop: 20,
        marginRight: 20,
        height: 30,
        paddingLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5
    },
    ad_topic: {
        flex: 9,
        flexDirection: 'row',
        alignItems: 'center'
    },
    ad_topic_text: {
        fontSize: 12,
        color: '#3C3C3C',
        fontFamily: 'PingFang SC'
    },
    ad_more: {
        flex: 1,
        height: 16,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#FF7B00',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    ad_more_text: {
        color: '#FF7B00',
        fontSize: 10
    },
    listview: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    goods_view: {
        padding: 5,
        margin: 3,
        width: (Dimensions.get('window').width - 12) / 2,
        backgroundColor: 'white',
    },
    price: {
        color: '#e43777',
        fontSize: 12
    },
    quick: {
        height: 240,
        backgroundColor: 'white',
        shadowColor: "rgb(0,0,0)",
        shadowOpacity: 0.1,
        shadowRadius: 0,
        shadowOffset: {
            height: 0.5,
            width: 0
        }
    },
    headline: {
        width: 59,
        height: 14,
        marginRight: 10
    },
    chaoshihui: {
        marginTop: 12,
        flex: 1,
        height: 239,
        backgroundColor: 'white',
        shadowColor: "rgb(0,0,0)",
        shadowOpacity: 0.1,
        shadowRadius: 0,
        shadowOffset: {
            height: 0.5,
            width: 0
        }
    },
    chaoshihui_title: {
        height: 38,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E5E5',
        justifyContent: 'center',
        alignItems: 'center'
    },
    csh_tit: {
        width: 77,
        height: 22,
        resizeMode: 'stretch',

    },
    cnxh_view: {
        alignItems: 'center',
        height: 40,
        justifyContent: 'center'
    },
    cnxh_view_img:{
        width:96,
        height:20,
        resizeMode: 'stretch',

    }
});