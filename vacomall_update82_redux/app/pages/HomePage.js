/**
 * Created by renyubin on 16/4/24.
 */
'use strict';

import React, {
    Component,
}from 'react';
import {
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
    Platform,
    ToastAndroid,
    Animated
} from 'react-native';
import {connect} from 'react-redux';

import {HomeHeader, Swiper, MenuButton, GoodsDetail, ListPage, API, NetService} from './util/Path';
import {endCutColor,cutColor,backgColor,priceColor} from './util/global';
import {getHeight} from './util/response';

import {TO_NEXT_TYPE10,TO_NEXT_TYPE20,TO_NEXT_TYPE30} from '../actions/route';
var listFlag = 0;
class HomePage extends Component {
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
            news: null,
            isRefreshing: false,
            newsValue: new Animated.Value(0),
            newsFlag: 1,
            guessFlag: false,
            index99: null,
            indexCSH: null
        };
    }

    componentDidMount() {
        /*获取首页基本数据*/
        NetService.getFetchData(API.HOME + '?keys=INDEX_CAT,INDEX_SCROLL_IMG,INDEX_NEWS,INDEX_99,INDEX_CSH,INDEX_BRAND', (result)=>this._callback(result));
    }

    componentWillUnmount(){
        this.timer&&clearInterval(this.timer)
    }

    /*
     * 跳转目标页面
     * */
    toNextPage(id, Xtype) {
        const {dispatch,navigator}=this.props;
        let opt={
            id:id
        }
        switch (Xtype) {
            case 10:
                dispatch(TO_NEXT_TYPE10(opt));
                if (navigator) {
                    navigator.push({
                        component: GoodsDetail
                    })
                }
                break;
            case 20:
                dispatch(TO_NEXT_TYPE20(opt));
                if (navigator) {
                    navigator.push({
                        component: ListPage,
                        sceneConfig: Navigator.SceneConfigs.FloatFromRight
                    })
                }
            case 30:
                dispatch(TO_NEXT_TYPE30(opt));
                if (navigator) {
                    navigator.push({
                        component: ListPage,
                        sceneConfig: Navigator.SceneConfigs.FloatFromRight
                    })
                }
                break;
        }
    }

    /*异步请求后的回调*/
    _callback(result) {
        this.setState({isRefreshing: false});
        /*轮播图数据*/
        let index_img = result['INDEX_SCROLL_IMG']['items'];
        if (index_img.length === 0) {
            return;
        }
        let imgArray = [];
        index_img.map((data, index)=> {
            switch (data['Xtype']) {
                case 10:
                    imgArray.push(<TouchableWithoutFeedback key={index}
                                                            onPress={(id, Xtype)=>this.toNextPage(data['Target'], data['Xtype'])}>
                            <View style={styles.wrapper}>
                                <Image style={styles.slide} source={{uri: data["ItemImg"]}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                    break;
                case 20:
                    imgArray.push(<TouchableWithoutFeedback key={index}
                                                            onPress={(id, Xtype)=>this.toNextPage(data['Target'], data['Xtype'])}>
                            <View style={styles.wrapper}>
                                <Image style={styles.slide} source={{uri: data["ItemImg"]}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                    break;
                case 30:
                    imgArray.push(<TouchableWithoutFeedback key={index}
                                                            onPress={(id, Xtype)=>this.toNextPage(data['Target'], data['Xtype'])}>
                            <View style={styles.wrapper}>
                                <Image style={styles.slide} source={{uri: data["ItemImg"]}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                    break;
                default:
                    imgArray.push(<TouchableWithoutFeedback key={index}
                                                            onPress={(id, Xtype)=> {
                                                            }}>
                            <View style={styles.wrapper}>
                                <Image style={styles.slide} source={{uri: data["ItemImg"]}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                    break;
            }

        })
        this.setState({
            swiper: <Swiper autoplay={true} height={getHeight(170)} paginationStyle={{bottom: 5}}>
                {imgArray}
            </Swiper>
        });
        imgArray = [];

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


        /*万颗新闻头条*/
        var newsArray = [];
        var index_news_data = result['INDEX_NEWS']['items'];
        if (index_news_data.length === 0) {
            return;
        }
        index_news_data.map(function (data, index) {
            newsArray.push(<View style={styles.news_centent} key={index}>
                <Text style={{fontSize: getHeight(12), color: '#3C3C3C'}}>{data['ItemName']}</Text>
            </View>)
        });
        newsArray.push(<View style={styles.news_centent} key={index_news_data.length}>
            <Text style={{fontSize: getHeight(12), color: '#3C3C3C'}}>{index_news_data[0]['ItemName']}</Text>
        </View>)
        this.setState({
            news: <Animated.View key={0} style={[styles.news, {top: this.state.newsValue}]}>
                {newsArray}
            </Animated.View>
        });

        this.timer = setInterval(()=> {
            if (this.state.newsFlag === index_news_data.length + 1) {
                this.state.newsValue.setValue(0)
                this.setState({
                    newsFlag: 1
                });
            }
            Animated.spring(                          // 可选的基本动画类型: spring, decay, timing
                this.state.newsValue,                 // 将`bounceValue`值动画化
                {
                    toValue: -getHeight(30) * this.state.newsFlag,                         // 将其值以动画的形式改到一个较小值
                }
            ).start();
            this.setState({
                newsFlag: this.state.newsFlag + 1
            });
        }, 3000)

        /*天天9块9*/
        let index_99_data = result['INDEX_99']['items'];
        if (index_99_data.length === 0) {
            return;
        }
        this.setState({
            index99: <View style={[styles.seckill, {marginTop: getHeight(11)}]}>
                <TouchableWithoutFeedback
                    onPress={(id, Xtype)=>this.toNextPage(index_99_data[0]['Target'], index_99_data[0]['Xtype'])}>
                    <View style={styles.seckill_1}>
                        <Image source={{uri: index_99_data[0]['ItemImg']}} style={styles.seckill_1_img}/>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.seckill_2}>
                    <TouchableWithoutFeedback
                        onPress={(id, Xtype)=>this.toNextPage(index_99_data[1]['Target'], index_99_data[1]['Xtype'])}>
                        <View style={styles.seckill_3}>
                            <Image source={{uri: index_99_data[1]['ItemImg']}}
                                   style={styles.seckill_2_img}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={(id, Xtype)=>this.toNextPage(index_99_data[2]['Target'], index_99_data[2]['Xtype'])}>
                        <View style={[styles.seckill_2]}>
                            <Image source={{uri: index_99_data[2]['ItemImg']}}
                                   style={styles.seckill_3_img}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        });
        /*超实惠*/
        let index_csh_data = result['INDEX_CSH']['items'];
        if (index_csh_data.length === 0) {
            return;
        }
        this.setState({
            indexCSH: <View style={styles.seckill}>
                <TouchableWithoutFeedback
                    onPress={(id, Xtype)=>this.toNextPage(index_csh_data[0]['Target'], index_csh_data[0]['Xtype'])}>
                    <View style={styles.seckill_1}>
                        <Image source={{uri: index_csh_data[0]['ItemImg']}}
                               style={styles.seckill_1_img}/>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.seckill_2}>
                    <TouchableWithoutFeedback
                        onPress={(id, Xtype)=>this.toNextPage(index_csh_data[1]['Target'], index_csh_data[1]['Xtype'])}>
                        <View style={styles.seckill_3}>
                            <Image source={{uri: index_csh_data[1]['ItemImg']}}
                                   style={styles.seckill_2_img}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={(id, Xtype)=>this.toNextPage(index_csh_data[2]['Target'], index_csh_data[2]['Xtype'])}>
                        <View style={[styles.seckill_2]}>
                            <Image source={{uri: index_csh_data[2]['ItemImg']}}
                                   style={styles.seckill_3_img}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        });
        /*品牌直供*/
        let index_brand_data = result['INDEX_BRAND']['items'];
        if (index_brand_data.length === 0) {
            return;
        }
        this.setState({
            indexBrand: <View style={styles.seckill}>
                <TouchableWithoutFeedback
                    onPress={(id, Xtype)=>this.toNextPage(index_brand_data[0]['Target'], index_brand_data[0]['Xtype'])}>
                    <View style={[styles.seckill_1, {width: getHeight(142),justifyContent: 'center'}]}>
                        <Image source={{uri: index_brand_data[0]['ItemImg']}}
                               style={[{width: getHeight(141), height: getHeight(198)}]}/>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={(id, Xtype)=>this.toNextPage(index_brand_data[1]['Target'], index_brand_data[1]['Xtype'])}>
                    <View style={[styles.seckill_1, {width: getHeight(142),justifyContent: 'center'}]}>
                        <Image source={{uri: index_brand_data[1]['ItemImg']}}
                               style={[{width: getHeight(141), height: getHeight(198)}]}/>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={(id, Xtype)=>this.toNextPage(index_brand_data[2]['Target'], index_brand_data[2]['Xtype'])}>
                    <View style={[styles.seckill_1, {width: getHeight(142),justifyContent: 'center', borderRightWidth: 0}]}>
                        <Image source={{uri: index_brand_data[2]['ItemImg']}}
                               style={[{width: getHeight(141), height: getHeight(198)}]}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        });
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
            listMarginRight = getHeight(4);
        } else {
            listMarginRight = 0;
        }
        listFlag++;

        return (
            <TouchableWithoutFeedback onPress={(id)=>this.toDetails(gList['Id'])}>
                <View style={[styles.goods_view, {marginRight: listMarginRight}]}>
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#F3F3F3'
                        }}>
                        <Image source={{uri: gList['SpuDefaultImage'] + '@h_300'}}
                               style={{
                                   width: getHeight(205),
                                   height: getHeight(204.5)
                               }}/>
                    </View>
                    <View style={{marginLeft: getHeight(7), marginRight: getHeight(4), height: getHeight(61.5)}}>
                        <View style={{marginBottom: 1, height: getHeight(38.5), paddingTop: getHeight(5)}}>
                            <Text style={{fontSize: getHeight(12), color: priceColor}}>{_textLength(gList['GoodsItemTitle'])}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row',justifyContent: 'flex-end',marginBottom: getHeight(3)}}>
                            <View style={{flex: 1,justifyContent: 'flex-end',}}>
                                <Text style={styles.price}><Text
                                    style={{fontSize: getHeight(12)}}>￥</Text>{gList['GoodsItemSalePrice']}
                                </Text>
                            </View>
                            <View
                                style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', }}>
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

    handleScroll(event:Object) {
        if (event.nativeEvent.contentOffset.y + Dimensions.get('window').height-50> this.state.contentHeight && this.state.guessFlag === false) {
            NetService.getFetchData(API.GUESS, (result)=>this._guessCallback(result));
            this.setState({
                guessFlag: true
            })
        }
        //event.nativeEvent.contentOffset+'-'+
    }

    toDetails(id) {
        const {navigator}=this.props;
        console.log(navigator)
        if (navigator) {
            navigator.push({
                component: GoodsDetail,
                params: {id: id}
            })
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <HomeHeader navigator={this.props.navigator}/>
                <ScrollView style={{backgroundColor: backgColor}}
                            endFillColor="white"
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={()=>this._onRefresh()}
                                    colors={['#ff0000', '#00ff00', '#0000ff', '#3ad564']}
                                    progressBackgroundColor="#ffffff"
                                />
                            }
                            onContentSizeChange={(w, h)=>this._ContentSizeChange(w, h)}
                            onScroll={(event)=>this.handleScroll(event)}>
                    <View style={{height: getHeight(170)}}>
                        {this.state.swiper}
                    </View>
                    <View style={styles.quick}>
                        <View>
                            <View style={styles.menuView}>
                                {this.state.catArray1}
                            </View>
                            <View style={[styles.menuView, styles.menuView2]}>
                                {this.state.catArray2}
                            </View>
                        </View>
                        {/*万颗头条*/}
                        <View style={styles.ad}>
                            <View style={styles.ad_topic}>
                                <Image style={styles.headline}
                                       source={require('../images/Headline.png')}/>
                                <View style={{
                                    width: 1,
                                    height: getHeight(17),
                                    backgroundColor: '#979797',
                                    marginRight: getHeight(10.5),
                                    marginLeft: getHeight(5.5)
                                }}/>
                                <View style={{flex: 1, height: getHeight(30), overflow: 'hidden'}}>
                                    {this.state.news}
                                </View>
                            </View>
                            <View style={{marginRight: 6}}>
                                <Image source={require('../images/updown_icon.png')}
                                       style={{width: 7, height: 13, resizeMode: 'stretch'}}/>
                            </View>
                        </View>
                    </View>

                    {this.state.index99}
                    <View style={styles.chaoshihui}>
                        <View style={styles.chaoshihui_title}>
                            <Image source={require('../images/chaoshihui_tit.png')} style={styles.csh_tit}/>
                        </View>
                        {this.state.indexCSH}
                    </View>
                    <View style={[styles.chaoshihui, {height: getHeight(236)}]}>
                        <View style={styles.chaoshihui_title}>
                            <Image source={require('../images/ppzg_tit.png')}
                                   style={[{width: getHeight(98), height: getHeight(22)}]}/>
                        </View>
                        {this.state.indexBrand}
                    </View>
                    <View
                        style={styles.cnxh_view}>
                        <Image source={require('../images/cnxh_tit.png')} style={styles.cnxh_view_img}/>
                    </View>
                    <View>
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={(gList)=>this.renderGList(gList)}
                            contentContainerStyle={styles.listview}/>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    menuView: {
        flexDirection: 'row',
        marginTop: getHeight(10)
    },
    menuView2: {
        marginTop: getHeight(20)
    },
    news: {
        position: 'absolute',
    },
    news_centent: {
        height: getHeight(30),
        justifyContent: 'center',
    },
    seckill: {
        flex: 1,
        height: getHeight(200),
        backgroundColor: 'white',
        flexDirection: 'row',
        shadowColor: 'rgb(0,0,0)',
        shadowOpacity: 0.1,
        shadowRadius: 0,
        shadowOffset: {
            height: 0.5,
            width: 0
        }
    },
    seckill_1: {
        borderRightWidth: 0.5,
        borderRightColor: '#E5E5E5',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: getHeight(206.25),
        height: getHeight(200),
    },
    seckill_1_img: {
        width: getHeight(206.25),
        height: getHeight(200),
    },
    seckill_2_img: {
        width: getHeight(207),
        height: getHeight(99),
        resizeMode: 'stretch'
    },
    seckill_3_img: {
        width: getHeight(207),
        height: getHeight(99),
        resizeMode: 'stretch'
    },
    seckill_2: {
        justifyContent: 'center'
    },
    seckill_3: {
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
    },
    ad: {
        backgroundColor: '#F3F3F3',
        marginLeft: getHeight(10),
        marginTop: getHeight(20),
        marginRight: getHeight(10),
        height: getHeight(30),
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

    listview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex:1
    },
    goods_view: {
        width: getHeight(205),
        height:getHeight(268),
        backgroundColor: 'white',
        marginBottom: getHeight(5),
        shadowColor: "rgb(0,0,0)",
        shadowOpacity: 0.1,
        shadowRadius: 0,
        shadowOffset: {
            height: 1,
            width: 0
        }
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
    quick: {
        height: getHeight(240),
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: endCutColor
    },
    headline: {
        width: getHeight(59),
        height: getHeight(14),
        marginRight: 5
    },
    chaoshihui: {
        marginTop: getHeight(12),
        flex: 1,
        backgroundColor: 'white',
        height:getHeight(238)
    },
    chaoshihui_title: {
        height: getHeight(37.25),
        borderBottomWidth: 0.5,
        borderBottomColor: cutColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    csh_tit: {
        width: getHeight(79),
        height: getHeight(22),

    },
    cnxh_view: {
        alignItems: 'center',
        height: getHeight(53),
        justifyContent: 'center'
    },
    cnxh_view_img: {
        width: getHeight(98),
        height: getHeight(20),
    }
});

export default connect()(HomePage)