/**
 * Created by renyubin on 16/7/1.
 */
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
import {API,NetService,Toast,Login} from '../util/Path';
import OrderDetail from './OrderDetail'
export default class OrderDSH extends Component {
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
            isLoad:false
        };
    }
    componentWillReceiveProps() {
        this.componentDidMount()
    }
    componentDidMount() {
        if(!this.props.isLoad||this.state.isLoad){
            return;
        }
       this.loadData();
        this.setState({
            isLoad:true
        })
    }
    loadData(){
        const {navigator}=this.props;
        NetService.getFetchData(API.ORDERDETAIL+'?st=300&size=5&page='+this.state.page,(result)=>{
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
            <OrderDetail gList={gList}/>
        )
    }
    render() {
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