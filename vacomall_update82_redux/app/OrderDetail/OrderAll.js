/**
 * Created by renyubin on 16/6/25.
 */
'use strict';
import React,{
    Component,
}from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    Text,
    Platform,
    StatusBar,
    ListView,
    Dimensions,
    Navigator,ScrollView
} from 'react-native';
import {API,NetService,Toast,Login,OrderList,Loaddingpage,Guess,MainScreen} from '../util/Path';
import {getHeight} from '../util/response';
export default class OrderAll extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2)=>row1 !== row2
            }),
            page:1,
            listArray:[],
            loaded:false,
            isloaded:false,
            isNull:false
        };
      }
    componentWillReceiveProps() {
        this.setState({
            isloaded:true
        })
        this.componentDidMount();
    }
    componentDidMount() {
        let parentThis=this.props._this;
        if(parentThis.state.activePage!==0||this.state.isloaded){

            this.setState({
                loaded:false,
                isloaded:false
            })
            return;
        }
        setTimeout(()=>{
            this.loadData();
        },500)
    }
    loadData(){
        if(this.state.page===1){
            this.setState({
                listArray:[]
            })
        }
        const {navigator}=this.props._this.props;;
        NetService.getFetchData(API.ORDERDETAIL+'?st=400&size=5&page='+this.state.page,(result)=>{
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
            let list =result['list'];

            if (list.length !== 0) {
                Array.prototype.push.apply(this.state.listArray, list)
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.state.listArray),
                    loaded:true,
                    isNull:true
                });
            } else {
                if (this.state.listArray.length > 0) {
                    this.setState({
                        isNull:true,
                        loaded: true,
                    });
                }else{
                    this.setState({
                        isNull:false,
                        loaded: true,
                    });
                }
            }
        })
    }

    refresh() {
        this.setState({
            page: this.state.page + 1
        })
        this.loadData();
    }
    componentDidUnMount() {

    }
    renderGList(gList) {
        return (
            <OrderList gList={gList} _this={this}/>
        )
    }
    renderLoadingView() {
        return (
            <View style={{flex:1}}>
                <Loaddingpage/>
            </View>
        );
    }
    isNull() {
        return (
            <View
                style={{justifyContent: 'center',alignItems: 'center',backgroundColor:'white',flex:1}}>
                <View style={{flexDirection:'row',alignItems: 'center',}}>
                    <Text
                        style={{color:'#3C3C3C',fontSize:getHeight(14)}}>未查到相关订单!</Text>
                </View>
            </View>
        );
    }
    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        if (!this.state.isNull) {
            return this.isNull();
        }
        return (
            <View style={{backgroundColor:'#FAFAFA',flex:1}}>
                <ListView
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    onEndReached={()=>this.refresh()}
                    onEndReachedThreshold={100}
                    renderRow={(gList)=>this.renderGList(gList)}
                />
                {this.state.loadding}
            </View>
        )
    }
}