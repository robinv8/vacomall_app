/**
 * Created by renyubin on 16/6/25.
 */'use strict';
import React, {
    Component,
    View,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    Text,
    Platform,
    StatusBar,
    ListView,
    Dimensions,
    Navigator,
    ScrollView
} from 'react-native';
import {OrderExpressHeader,NetService,API} from './util/Path';
export default class OrderDetail extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2)=>row1 !== row2
            }),
            loaded:false
        };
    }

    componentDidMount() {
        prevThis=null;
        setTimeout(()=>{
            NetService.getFetchData(API.ORDEREXPRESS + '?orderId=e212070ef5bc4d7b8d9fe88bd967c190&skuCode=LZ160317-L-14-100', (result)=> {
                if (result['success'] === false) {
                    Toast.show(result['result']['message']);
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
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(result),
                    loaded:true
                })
            })
        },500)

    }

    renderGList(gList) {
        return (
            <CartList gList={gList}/>
        )
    }

    renderLoadingView() {
        return (
            <View style={{flex:1}}>
                <OrderDetailHeader navigator={this.props.navigator} id={this.props.id} tab={this.props.tab}/>
                <Loaddingpage/>
            </View>
        );
    }
    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return (
            <View style={{backgroundColor:'#FAFAFA',flex:1}}>
                <OrderExpressHeader navigator={this.props.navigator}/>
                <View
                    style={{height:115,backgroundColor:'white',borderBottomWidth:1,borderBottomColor:'#E6E6E6',flexDirection:'row',alignItems:'center',marginBottom:12}}>
                    <View>
                        <Image
                            source={{uri:this.props.img}}
                            style={{height:80,width:80,resizeMode:'stretch',borderWidth:0.5,borderColor:'#EBEBEB',backgroundColor:'white',marginLeft:14,marginRight:13}}/>
                    </View>
                    <View>
                        <Text style={{marginBottom:10,color:'#3C3C3C'}}>物流状态: <Text style={{color:'#16BD42'}}>{this.props.orderState}</Text></Text>
                        <Text style={{color:'#BFBFBF'}}>订单号: <Text>{this.props.orderCode}</Text></Text>
                    </View>
                </View>
                <View
                    style={{backgroundColor:'white',borderBottomWidth:1,borderBottomColor:'#E6E6E6',flexDirection:'row',alignItems:'center',marginBottom:12}}>
                    <ListView
                        dataSource={this.state.dataSource}
                        enableEmptySections={true}
                        renderRow={(gList)=>this.renderGList(gList)}
                    />
                </View>

            </View>
        )
    }
}
let prevThis = null;
class CartList extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            backgroundColor: 'rgba(68,219,94,0)',
            mincolor:'#EAEAEA',
            textColor:'#BFBFBF'
        };
    }

    componentDidMount() {
        if (prevThis === null) {
            this.setState({
                backgroundColor:'rgba(68,219,94,0.5)',
                mincolor:'#16BD42',
                textColor:'#16BD42'
            })
        }
        prevThis=this;
    }

    render() {
        return (
            <View style={{height:78,flexDirection:'row'}}>
                <View style={{width:54,alignItems:'center'}}>
                    <View
                        style={{width:12,height:12,backgroundColor:this.state.backgroundColor,borderRadius:12,justifyContent:'center',alignItems:'center',marginTop:22}}>
                        <View style={{width:8,height:8,backgroundColor:this.state.mincolor,borderRadius:8}}></View>
                    </View>
                    <View style={{height:78,backgroundColor:'#EAEAEA',width:2,}}>

                    </View>
                </View>
                <View
                    style={{justifyContent:'center',borderBottomWidth:0.5,borderBottomColor:'#E6E6E6',flex:1,marginRight:12}}>
                    <Text style={{color:this.state.textColor}}>{this.props.gList['remark']}</Text>
                    <Text style={{color:this.state.textColor,marginTop:10}}>{this.props.gList['createTime']}</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({})
