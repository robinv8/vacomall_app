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
    ToastAndroid,
    Animated
} from 'react-native';
import {HomeHeader,Swiper,MenuButton,GoodsDetail,ListPage,API,NetService} from './util/Path';
var listFlag = 0;

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
                rowHasChanged: (row1, row2)=>row1 !== row2
            }),
            loaded: false,
            news: null,
            isRefreshing: false,
            newsValue: new Animated.Value(0),
            newsFlag: 1,
            guessFlag: false
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
        NetService.getFetchData(API.HOME + '?keys=INDEX_CAT,INDEX_SCROLL_IMG,INDEX_NEWS,INDEX_99,INDEX_CSH,INDEX_BRAND', (result)=>this._callback(result));

        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', (BackAndroid)=>this.onBackAndroid(BackAndroid));
        }
    }

    /*异步请求后的回调*/
    _callback(result) {
        this.setState({isRefreshing: false});
        this.timer && clearTimeout(this.timer);
        /*轮播图数据*/
        var index_img = result['INDEX_SCROLL_IMG']['items'];
        if (index_img.length === 0) {
            return;
        }
        var imgArray = [];
        var _this = this;
        index_img.map(function (data, index) {
            switch (data['Xtype']) {
                case 10:
                    imgArray.push(<TouchableWithoutFeedback key={index} onPress={()=>_this.toDetails(data['Target'])}>
                            <View style={styles.wrapper}>
                                <Image style={styles.slide} source={{uri:data["ItemImg"]}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                    break;
                case 20:
                    imgArray.push(<TouchableWithoutFeedback key={index}
                                                            onPress={()=>_this._selectGoodsList(data['Target'])}>
                            <View style={styles.wrapper}>
                                <Image style={styles.slide} source={{uri:data["ItemImg"]}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                    break;
                case 30:
                    imgArray.push(<TouchableWithoutFeedback key={index}
                                                            onPress={()=>_this.historyOnSubmit(data['Target'])}>
                            <View style={styles.wrapper}>
                                <Image style={styles.slide} source={{uri:data["ItemImg"]}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                    break;
            }

        });

        this.setState({
            swiper: <Swiper autoplay={false} height={170} paginationStyle={{bottom: 5}}>
                {imgArray}
            </Swiper>
        });

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


        /*万颗新闻头条*/
        var newsArray = [];
        var index_news_data = result['INDEX_NEWS']['items'];
        if (index_news_data.length === 0) {
            return;
        }
        index_news_data.map(function (data, index) {
            newsArray.push(<View style={styles.news_centent} key={index}>
                <Text>{data['ItemName']}</Text>
            </View>)
        });
        newsArray.push(<View style={styles.news_centent} key={index_news_data.length}>
            <Text>{index_news_data[0]['ItemName']}</Text>
        </View>)
        this.setState({
            news: <Animated.View key={0} style={[styles.news,{top:this.state.newsValue}]}>
                {newsArray}
            </Animated.View>
        });

        var _this = this;
        this.timer = setInterval(function () {
            if (_this.state.newsFlag === index_news_data.length + 1) {
                _this.state.newsValue.setValue(0)
                _this.setState({
                    newsFlag: 1
                });
            }
            Animated.spring(                          // 可选的基本动画类型: spring, decay, timing
                _this.state.newsValue,                 // 将`bounceValue`值动画化
                {
                    toValue: -30 * _this.state.newsFlag,                         // 将其值以动画的形式改到一个较小值
                }
            ).start();
            _this.setState({
                newsFlag: _this.state.newsFlag + 1
            });
        }, 3000)

        /*天天9块9*/
        var index_99_data = result['INDEX_99']['items'];
        if (index_99_data.length === 0) {
            return;
        }
        this.setState({
            index99: <View style={[styles.seckill,{marginTop: 12}]}>
                <View style={styles.seckill_1}>
                    <Image source={{uri:index_99_data[0]['ItemImg']}} style={styles.seckill_1_img}/>
                </View>
                <View style={styles.seckill_2}>
                    <View style={styles.seckill_3}>
                        <Image source={{uri:index_99_data[1]['ItemImg']}}
                               style={styles.seckill_2_img}/>
                    </View>
                    <View style={[styles.seckill_2]}>
                        <Image source={{uri:index_99_data[2]['ItemImg']}}
                               style={styles.seckill_3_img}/>
                    </View>
                </View>
            </View>
        });
        /*超实惠*/
        var index_csh_data = result['INDEX_CSH']['items'];
        if (index_csh_data.length === 0) {
            return;
        }
        this.setState({
            indexCSH: <View style={styles.seckill}>
                <View style={styles.seckill_1}>
                    <Image source={{uri:index_99_data[0]['ItemImg']}}
                           style={styles.seckill_1_img}/>
                </View>
                <View style={styles.seckill_2}>
                    <View style={styles.seckill_3}>
                        <Image source={{uri:index_99_data[1]['ItemImg']}}
                               style={styles.seckill_2_img}/>
                    </View>
                    <View style={[styles.seckill_2]}>
                        <Image source={{uri:index_99_data[2]['ItemImg']}}
                               style={styles.seckill_3_img}/>
                    </View>
                </View>
            </View>
        });
        /*品牌直供*/
        var index_brand_data = result['INDEX_BRAND']['items'];
        if (index_brand_data.length === 0) {
            return;
        }
        this.setState({
            indexBrand: <View style={styles.seckill}>
                <View style={[styles.seckill_1,{justifyContent:'center'}]}>
                    <Image source={{uri:index_brand_data[0]['ItemImg']}}
                           style={[styles.seckill_1_img,{width:(Dimensions.get('window').width-1) / 3,height:197}]}/>
                </View>
                <View style={[styles.seckill_1,{justifyContent:'center'}]}>
                    <Image source={{uri:index_brand_data[1]['ItemImg']}}
                           style={[styles.seckill_1_img,{width:(Dimensions.get('window').width-1) / 3,height:197}]}/>
                </View>
                <View style={[styles.seckill_1,{justifyContent:'center',borderRightWidth:0}]}>
                    <Image source={{uri:index_brand_data[2]['ItemImg']}}
                           style={[styles.seckill_1_img,{width:(Dimensions.get('window').width-1) / 3,height:197}]}/>
                </View>
            </View>
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

    _goToCate() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: CategoryList,
                params: {id: id}
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

    _onRefresh() {
        this.setState({isRefreshing: true});
        /*获取首页基本数据*/
        NetService.getFetchData(API.HOME + '?keys=INDEX_CAT,INDEX_SCROLL_IMG,INDEX_NEWS,INDEX_99,INDEX_CSH,INDEX_BRAND', (result)=>this._callback(result));
        listFlag = 0;
    }

    handleScroll(event:Object) {
        if (event.nativeEvent.contentOffset.y + Dimensions.get('window').height - 100 > this.state.contentHeight && this.state.guessFlag === false) {
            NetService.getFetchData(API.GUESS, (result)=>this._guessCallback(result));
            this.setState({
                guessFlag: true
            })
        }
        //event.nativeEvent.contentOffset+'-'+
    }

    _guessCallback(result) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(result)
        });
    }

    _ContentSizeChange(w, h) {
        //console.log(h)
        this.setState({
            contentHeight: h
        });
    }

    onDownFunc() {

    }

    render() {
        return (
            <View style={{flex:1}}>
                <HomeHeader navigator={this.props.navigator}/>
                <ScrollView style={{backgroundColor:'#F6F6F6'}}
                            refreshControl={
                              <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={()=>this._onRefresh()}
                                colors={['#ff0000', '#00ff00', '#0000ff','#3ad564']}
                                progressBackgroundColor="#ffffff"
                              />
                            }
                            onContentSizeChange={(w,h)=>this._ContentSizeChange(w,h)}
                            onScroll={(event)=>this.handleScroll(event)}>
                    <View style={{height:170}}>
                        {this.state.swiper}
                    </View>
                    <View style={styles.quick}>
                        <View style={styles.quick_view}>
                            <View style={styles.menuView}>
                                {this.state.catArray1}
                            </View>
                            <View style={[styles.menuView,styles.menuView2]}>
                                {this.state.catArray2}
                            </View>
                        </View>

                        <View style={styles.ad}>
                            <View style={styles.ad_topic}>
                                <Image style={styles.headline}
                                       source={require('../images/Headline.png')}/>
                                <View style={{flex:1,height:30,overflow:'hidden'}}>
                                    {this.state.news}
                                </View>
                            </View>
                            <View style={styles.ad_more}><Text style={styles.ad_more_text}>更多></Text></View>
                        </View>
                    </View>

                    {this.state.index99}
                    <View style={styles.chaoshihui}>
                        <View style={styles.chaoshihui_title}>
                            <Image source={require('../images/chaoshihui_tit.png')} style={styles.csh_tit}/>
                        </View>
                        {this.state.indexCSH}
                    </View>
                    <View style={[styles.chaoshihui,{height:236}]}>
                        <View style={styles.chaoshihui_title}>
                            <Image source={require('../images/ppzg_tit.png')}
                                   style={[styles.csh_tit,{width:96,height:22}]}/>
                        </View>
                        {this.state.indexBrand}
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
        )
    }
}

const styles = StyleSheet.create({
    menuView: {
        flexDirection: 'row',
        marginTop: 12
    },
    quick_view: {
        height: 170
    },
    menuView2: {
        marginTop: 20
    },
    news: {
        position: 'absolute',
    },
    news_centent: {
        height: 30,
        justifyContent: 'center',
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
        width: (Dimensions.get('window').width / 2) - 2,
        height: 200,
        resizeMode: 'stretch'
    },
    seckill_2_img: {
        width: Dimensions.get('window').width / 2,
        height: 100,
        resizeMode: 'stretch'
    },
    seckill_3_img: {
        width: Dimensions.get('window').width / 2,
        height: 100,
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
    price: {
        color: '#FF0200',
        fontSize: 18
    },
    bprice: {
        color: '#BFBFBF',
        fontSize: 12,
        justifyContent: 'flex-end'
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
    cnxh_view_img: {
        width: 96,
        height: 20,
        resizeMode: 'stretch',
    }
});