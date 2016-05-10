/**
 * Created by renyubin on 16/4/25.
 */
'use strict';
import React, {
    Component,
    View,
    Text,
    ListView,
    PropTypes,
    Image,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    RefreshControl,
    BackAndroid,
    Platform
}from 'react-native'
import ListHeader from './ListPage/ListHeader';
import GoodsDetail from './GoodsDetail';
import API from './util/api';
import * as NetService from './util/NetService';
var GiftedListView = require('react-native-gifted-listview');
export default class ListPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            gList: null,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2)=>row1 !== row2,
            }),
            loaded: false,
            page: 1,
            size: 5,
            sort: 0,
            listArray: [],
        }
    }
    componentDidMount() {
        var _this = this
        setTimeout(function () {
            _this.getListData(1)
        }, 400);
    }

    getListData() {
        if (this.props.id === null) {
            NetService.postFetchData(API.SEARCH, 'wd=' + this.props.text + '&page=' + this.state.page + '&size=' + this.state.size + '&sort=' + this.state.sort, (result)=>this._callback(result));
        } else {
            NetService.postFetchData(API.LIST, 'cart=' + this.props.id + '&page=' + this.state.page + '&size=' + this.state.size + '&sort=' + this.state.sort, (result)=>this._callback(result));
        }
    }

    _callback(result) {
        if (result['success'] === false) {
            ToastAndroid.show(result['result']['message'], ToastAndroid.SHORT);
            return;
        }
        if (result['list'].length !== 0) {
            Array.prototype.push.apply(this.state.listArray, result['list'])
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.state.listArray),
                loaded: true,
                isRefreshing: false
            })
        }
    }

    _sort(num) {
        this.setState({
            sort: num,
            page: 1,
            listArray: []
        })
        this.getListData();
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return (
            <View style={{flex:1,backgroundColor:'white'}}>
                <ListHeader navigator={this.props.navigator} id={this.props.id}/>
                <View
                    style={{alignItems:'center',justifyContent:'center',flexDirection: 'row',height:50,borderBottomColor:'#efefef',borderBottomWidth:1}}>
                    <View style={{alignItems:'center',flex:1}}>
                        <TouchableOpacity onPress={(num)=>this._sort(0)}>
                            <View style={styles.sort}>
                                <Text style={[styles.sortText]}>综合排序</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems:'center',flex:1}}>
                        <TouchableOpacity onPress={(num)=>this._sort(3)}>
                            <View style={styles.sort}>
                                <Text style={[styles.sortText]}>销量</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems:'center',flex:1}}>
                        <TouchableOpacity onPress={(num)=>this._sort(2)}>
                            <View style={styles.sort}>
                                <Text style={[styles.sortText]}>价格</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <ListView
                    initialListSize={14}
                    dataSource={this.state.dataSource}
                    renderRow={(gList)=>this.renderGList(gList)}
                    onEndReached={()=>this.refresh()}
                    onEndReachedThreshold={100}
                ></ListView>
            </View>
        )
    }


    refresh() {
        this.setState({
            page: this.state.page + 1
        })
        this.getListData();
    }

    renderLoadingView() {
        return (
            <View style={{flex:1}}>
                <ListHeader navigator={this.props.navigator}/>
                <View style={{flex:1,justifyContent: 'center',alignItems: 'center',backgroundColor:'#F4F4F4'}}>
                    <Image source={require('../images/loading.gif')} style={{width:70,height:50,resizeMode:'stretch'}}/>
                </View>
            </View>
        );
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
            if (text.length > 30) {
                rtnText = text.substring(0, 30) + '…'
            } else {
                rtnText = text;
            }
            return rtnText;
        }
        return (
            <TouchableWithoutFeedback onPress={(id)=>this.toDetails(gList['Id'])}>
                <View style={styles.goods_view}>
                    <View style={{backgroundColor:'#F6F6F6',flex:1,borderWidth:1,borderColor:'#dadada'}}>
                        <Image source={{uri: gList['SpuDefaultImage']+'@h_300'}}
                               style={{resizeMode:'stretch',height:200}}></Image>
                    </View>
                    <View style={{flex:1,borderBottomWidth:1,borderBottomColor:'#efefef',marginBottom:-5}}>
                        <View style={{paddingLeft:10,paddingRight:10,flex:1}}>
                            <Text style={[{fontSize:12,color:'#555555'}]}>{_textLength(gList['GoodsItemTitle'])}</Text>
                            <View style={{flex:1,justifyContent:'flex-end',paddingBottom:5}}>
                                <View style={{flexDirection:'row'}}>
                                    <View style={{paddingTop:4}}>
                                        <Text style={[styles.price,{fontSize:9}]}>￥</Text>
                                    </View>
                                    <Text style={[styles.price,{fontSize:13}]}>{gList['GoodsItemSalePrice']}</Text>
                                    <View style={{marginLeft:10}}>
                                        <Text
                                            style={[{fontSize:13,color:'#9c9c9c'}]}>{gList['GoodsItemSales']}人付款</Text>
                                    </View>
                                    <View style={{flex:1,alignItems:'flex-end'}}>
                                        <Text style={{color: 'black'}}>…</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({

    goods_view: {
        marginTop: -1,
        marginBottom: 10,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    price: {
        color: '#e43777'
    },
    sort: {
        backgroundColor: '#efefef',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        width: 100,
        height: 30,
        borderRadius: 3
    },
    sortText: {
        fontSize: 12,
        color: '#555555'
    }
})