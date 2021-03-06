/**
 * Created by renyubin on 16/7/4.
 */
import React,{
Component,
    View,
    ListView,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    Dimensions,Text
} from 'react-native';
import {NetService,API,GoodsDetail} from './util/Path';
let listFlag = 0;
export default class Guess extends Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2)=>row1 !== row2
            })
        };
      }

    componentDidMount() {
        NetService.getFetchData(API.GUESS, (result)=> {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(result)
            });
        });
    }
    toDetails(id) {
        const {navigator}=this.props;
        if(this.props.type==='goodsdetail'){
            if (navigator) {
                navigator.replace({
                    component: GoodsDetail,
                    params: {id: id}
                })
            }
            return;
        }
        if (navigator) {
            navigator.push({
                component: GoodsDetail,
                params: {id: id}
            })
        }
    }
    render(){
        return(
            <View style={{flex:1}}>
                <View
                    style={styles.cnxh_view}>
                    <Image source={require('../images/cnxh_tit.png')} style={styles.cnxh_view_img}/>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(gList)=>this.renderGList(gList)}
                    contentContainerStyle={styles.listview}/>
            </View>
        )
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
                        style={{alignItems: 'center',justifyContent: 'center',borderBottomWidth:1,borderBottomColor:'#F3F3F3'}}>
                        <Image source={{uri:gList['SpuDefaultImage']+'@h_300'}}
                               style={{width: Dimensions.get('window').width/2-3,height: Dimensions.get('window').width/2-3}}/>
                    </View>
                    <View style={{marginLeft:7,marginRight:4}}>
                        <View style={{marginBottom:1,height:32,paddingTop:5}}>
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
    cnxh_view: {
        alignItems: 'center',
        marginTop:16,
        marginBottom:16,
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