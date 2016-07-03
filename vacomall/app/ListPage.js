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
    TouchableWithoutFeedback,
    RefreshControl,
    BackAndroid,
    Platform,
    ActivityIndicatorIOS,
    Navigator
}from 'react-native'
import {ListHeader, GoodsDetail, API, NetService, Toast,MainScreen,Loaddingpage} from './util/Path';
var SortItemArray = [];
var beforeSortItem;
var listFlag = 0;

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
            size: 600,
            sort: 0,
            listArray: [],
            sortItem: null,
            searchText: null,
        }
    }

    componentWillMount() {
        if (this.props.id === null) {
            this.setState({
                searchText: this.props.text
            })
        }
    }

    componentDidMount() {
        SortItemArray = [];
        beforeSortItem;
        listFlag = 0;
        this.setState({
            sortItem: <View style={styles.sort_view}>
                <SortItem text={'综合排序'} color={'#EF8200'} img={require('../images/sort_icon_hover.png')}
                          onclick={(num)=>this._sort(0)}/>
                <SortItem text={'价格'} color={'#555555'} img={require('../images/sort_icon.png')}
                          onclick={(num)=>this._sort(3)}/>
                <SortItem text={'销量'} color={'#555555'} img={require('../images/sort_icon.png')}
                          onclick={(num)=>this._sort(2)}/>
            </View>
        });
        setTimeout(()=> {
            this.getListData(1)
        }, 400);
    }

    getListData() {
        if (this.props.id === null) {

            NetService.postFetchData(API.SEARCH, 'wd=' + this.props.text + '&page=' + this.state.page + '&size=' + this.state.size + '&sort=' + this.state.sort, (result)=>this._callback(result));
        } else {
            NetService.postFetchData(API.LIST, 'cart=' + this.props.id + '&page=' + this.state.page + '&size=' + this.state.size + '&sort=' + this.state.sort, (result)=>this._callback(result));
        }
        //NetService.postFetchData(API.LIST, 'cart=02dea4921ef5402a871d198925ac7a88&page=' + this.state.page + '&size=' + this.state.size + '&sort=' + this.state.sort, (result)=>this._callback(result));
    }

    _callback(result) {
        if (result['success'] === false) {
            Toast.show(result['result']['message']);
            return;
        }
        let list = result['result']['list'];
        if (list.length !== 0) {
            Array.prototype.push.apply(this.state.listArray, list)
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.state.listArray),
                loaded: true,
                isRefreshing: false,
                isNull: false
            })
        } else {
            if (this.state.listArray.length > 0) {
                this.setState({
                    isNull:false,
                    loaded: true,
                });
            } else {
                this.setState({
                    isNull:true,
                    loaded: true,
                });
                NetService.getFetchData(API.GUESS, (result)=> {
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(result)
                    });
                });
            }

        }
    }

    _sort(num) {
        listFlag = 0;
        this.setState({
            sort: num,
            page: 1,
            listArray: []
        });
        this.setState({
            flag: num
        });
        switch (num) {
            case 0:
                SortItemArray[0].setState({
                    color: '#EF8200',
                    img: require('../images/sort_icon_hover.png')
                });
                beforeSortItem.setState({
                    color: '#555555',
                    img: require('../images/sort_icon.png')
                });

                beforeSortItem = SortItemArray[0];
                break;
            case 3:
                SortItemArray[1].setState({
                    color: '#EF8200',
                    img: require('../images/sort_icon_hover.png')
                });
                beforeSortItem.setState({
                    color: '#555555',
                    img: require('../images/sort_icon.png')
                });
                beforeSortItem = SortItemArray[1];
                break;
            case 2:
                SortItemArray[2].setState({
                    color: '#EF8200',
                    img: require('../images/sort_icon_hover.png')
                });
                beforeSortItem.setState({
                    color: '#555555',
                    img: require('../images/sort_icon.png')
                });
                beforeSortItem = SortItemArray[2];
                break;
        }
        this.setState({
            listArray:[]
        })
        this.getListData();

    }
    toHome() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.popToTop()
        }
    }
    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        if (this.state.isNull) {
            return this.isNull();
        }

        return (
            <View style={{flex:1,backgroundColor:'#F6F6F6'}}>
                <ListHeader navigator={this.props.navigator} id={this.props.id} searchText={this.state.searchText}/>

                {this.state.sortItem}
                <ListView
                    initialListSize={10}
                    dataSource={this.state.dataSource}
                    renderRow={(gList)=>this.renderGList(gList)}
                    onEndReached={()=>this.refresh()}
                    onEndReachedThreshold={100}
                    contentContainerStyle={styles.listview}
                />
            </View>
        )
    }
    

    refresh() {
        this.setState({
            page: this.state.page + 1
        })
        this.getListData();
    }

    isNull() {
        return (
            <ScrollView style={{flex:1,backgroundColor:'#F6F6F6'}}>
                <ListHeader navigator={this.props.navigator} id={this.props.id} searchText={this.state.searchText}/>
                <View
                    style={{justifyContent: 'center',alignItems: 'center',backgroundColor:'white',height:350,marginTop:11}}>
                    <View style={{flexDirection:'row',alignItems: 'center',}}>
                        <Image source={require('../images/list_search_icon.png')}
                               style={{ width: 15,height: 15,marginRight:5}}/>
                        <Text style={{color:'#3C3C3C'}}>未找到相关商品,您可以</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>this.toHome()}>
                        <View
                            style={{backgroundColor: '#FF9700',width:88,height:28,borderRadius:5,justifyContent: 'center',alignItems: 'center',marginTop:22}}>
                            <Text style={{color:'white'}}>随便逛逛</Text>
                        </View>
                    </TouchableWithoutFeedback>
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
        );
    }

    renderLoadingView() {
        return (
            <View style={{flex:1}}>
                <ListHeader navigator={this.props.navigator} id={this.props.id} searchText={this.state.searchText}/>
                <Loaddingpage/>
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
            if (text.length > 20) {
                rtnText = text.substring(0, 25)
            } else {
                rtnText = text;
            }
            return rtnText;
        }
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
                               style={{width: 150,height: 150,marginBottom:10}}></Image>
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
}
class SortItem extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            text: null,
            sortnum: null,
            color: '#3C3C3C',
            img: require('../images/sort_icon_hover.png')
        };
    }

    componentDidMount() {
        this.setState({
            text: this.props.text,
            color: this.props.color,
            img: this.props.img
        });

        SortItemArray.push(this);
        beforeSortItem = SortItemArray[0];
    }

    render() {
        return (
            <View style={styles.sortItem}>
                <TouchableWithoutFeedback onPress={this.props.onclick}>
                    <View style={styles.sortItemView}>
                        <Text style={[styles.sortItem_text,{color:this.state.color}]}>{this.state.text}</Text>
                        <Image
                            source={this.state.img}
                            style={styles.sortItem_img}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}
const styles = StyleSheet.create({
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
    listview: {
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
        borderRadius: 3,
        flexDirection: 'row'
    },
    sort_view: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#FAFAFA',
        height: 32,
        borderBottomColor: '#E7E7E7',
        borderBottomWidth: 1,
    },
    sortItemView: {
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
        height: 32,
        alignItems: 'center'
    },
    sortItem: {
        flex: 1,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    sortItem_text: {
        color: '#3C3C3C',
        fontSize: 14
    },
    sortItem_img: {
        width: 7,
        height: 8,
        resizeMode: 'stretch',
        marginLeft: 3
    },
    sortText: {
        fontSize: 12,
        color: '#555555'
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
    price1: {
        color: '#FF0200',
        fontSize: 18
    },
    bprice: {
        color: '#BFBFBF',
        fontSize: 12,
        justifyContent: 'flex-end'
    },
})