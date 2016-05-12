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
            content:''
        };
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', ()=>this.onBackAndroid());
        }
    }
    onBackAndroid(){
        const {navigator} = this.props;
        const routers = navigator.getCurrentRoutes();
        if (routers.length > 1) {
            navigator.pop();
            return true;
        }
        return false;
    };

    componentDidMount() {
        NetService.getFetchData(API.HOME + '?keys=INDEX_IMAGE,INDEX_CAT_DATA,INDEX_HOT_GOODS,INDEX_NOTE', (result)=>this._callback(result));
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', (BackAndroid)=>this.onBackAndroid(BackAndroid));
        }
    }
    _selectGoodsList(id){
        const {navigator}=this.props;
        if(navigator){
            navigator.push({
                component:ListPage,
                sceneConfig:Navigator.SceneConfigs.FloatFromRight,
                params:{id:id}

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
    _callback(result) {
        var index_img = result['INDEX_IMAGE']['DataValue'];
        var imgArray = [];
        var _this=this;
        JSON.parse(index_img).map(function (data, index) {
            switch (data['Type']){
                case 1:
                    imgArray.push(<TouchableWithoutFeedback key={index} onPress={()=>_this.toDetails(data['ItemId'])}>
                            <View style={styles.wrapper}>
                                <Image style={styles.slide} source={{uri:data["ImgUrl"]}}></Image>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                    break;
                case 2:
                    imgArray.push(<TouchableWithoutFeedback key={index} onPress={()=>_this._selectGoodsList(data['Cid'])}>
                            <View style={styles.wrapper}>
                                <Image style={styles.slide} source={{uri:data["ImgUrl"]}}></Image>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                    break;
                case 3:
                    imgArray.push(<TouchableWithoutFeedback key={index} onPress={()=>_this.historyOnSubmit(data['keywords'])}>
                            <View style={styles.wrapper}>
                                <Image style={styles.slide} source={{uri:data["ImgUrl"]}}></Image>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                    break;
            }

        })
        this.setState({
            swiper: <Swiper autoplay={true} height={150} paginationStyle={{bottom: 5}}>
                {imgArray}
            </Swiper>
        });

        var index_cat_data = result['INDEX_CAT_DATA']['DataValue'];

        var _this = this;
        var catArray1 = [], catArray2 = []
        JSON.parse(index_cat_data).map(function (data, index) {
            if (index < 5) {
                catArray1.push(<MenuButton key={index}
                                           id={data['Id']}
                                           color={data['BgColor']}
                                           showText={data['Title']}
                                           navigator={_this.props.navigator}/>)
            } else {
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

        var index_note=result['INDEX_NOTE']['DataValue'];
        this.setState({
            content:JSON.parse(index_note)['Note']
        });
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
                <ScrollView style={{backgroundColor:'#f4f4f4'}}>
                    <View style={{height:150}}>
                        {this.state.swiper}
                    </View>
                    <View >
                        <View style={styles.menuView}>
                            {this.state.catArray1}
                        </View>
                        <View style={styles.menuView}>
                            {this.state.catArray2}
                        </View>
                        <View style={styles.ad}>
                            <Text style={{fontWeight:'bold'}}>万颗头条:</Text><Text>{this.state.content}</Text>
                        </View>
                    </View>
                    <View
                        style={{backgroundColor:'white',alignItems:'center',marginTop:10,height:40,justifyContent:'center'}}>
                        <Text style={{fontSize:16,color:'#c1c1c1'}}>/推荐热卖/</Text>
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
        marginTop: 10
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
        backgroundColor: 'white',
        marginLeft: 20,
        marginTop: 20,
        marginRight: 20,
        height: 30,
        paddingLeft: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    listview: {
        marginTop: 5,
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
    }
});