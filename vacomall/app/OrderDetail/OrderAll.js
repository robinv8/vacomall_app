/**
 * Created by renyubin on 16/6/25.
 */
'use strict';
import React,{
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
    Navigator
} from 'react-native';
import {API,NetService,Toast,Login,OrderList} from '../util/Path';
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
            isloaded:false
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
        this.loadData();
    }
    loadData(){
        const {navigator}=this.props;
        NetService.getFetchData(API.ORDERDETAIL+'?size=5&page='+this.state.page,(result)=>{
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
            let list = result['list'];
            if (list.length !== 0) {
                Array.prototype.push.apply(this.state.listArray, list)
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.state.listArray),
                });
                this.setState({
                    loaded:true,
                })
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
                <View style={{flex:1,justifyContent: 'center',alignItems: 'center',backgroundColor:'#F4F4F4'}}>
                    <Image source={require('../../images/loading.gif')} style={{width:70,height:50,resizeMode:'stretch'}}/>
                </View>
            </View>
        );
    }
    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
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
            </View>
        )
    }
}