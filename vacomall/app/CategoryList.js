/**
 * Created by renyubin on 16/6/2.
 */
'use strict';
import React, {
    View,
    Text,
    ListView,
    Component,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    PropTypes,
    Navigator,
    Image
} from 'react-native';
import {API,NetService,CategoryHeader,FirstCate,SubCate,Loaddingpage} from './util/Path';

var cateMap = {}, beforeObj,fObj=[];
export default class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstData: [],
            firstRows: [],
            subData: [],
            subRows: [],
            loaded:false
        }
    }

    //组件加载完成,并已渲染之后执行
    componentDidMount() {
        cateMap = {}, beforeObj=undefined,fObj=[];
        this.fetchData(0, 0);
    }

    fetchData(num, lazy) {
        setTimeout(function(){
            NetService.getFetchData(API.CATE + '?pid=' + num + '&lazy=' + lazy, (result)=>_callback(result));
        },400)

        var _this = this;
        function _callback(result) {
            if (num === 0) {
                _this.setState({
                    firstData: result,
                    loaded:true
                });
                _this._getFirstRows();
            } else {
                _this.setState({
                    subData: result,
                });
                _this._getSubRows();
                cateMap[num] = result;
            }
        }
    }


    _getSubCate(id, obj) {
        if(obj===beforeObj){
            return;
        }
        this.setState({
           subRows:[]
        });
        if (beforeObj !== undefined) {
            beforeObj.setState({
                color: '#9B9B9B',
                background: '#FFFFFF'
            })
        }else{
            fObj[0].setState({
                color: '#9B9B9B',
                background: '#FFFFFF'
            })
        }
        obj.setState({
            color: '#16BD42',
            background: 'rgba(0,0,0,0)'
        });
        beforeObj = obj;
        if (cateMap[id] !== undefined) {
            this.setState({
                subData: cateMap[id]
            });
            this._getSubRows();
        } else {
            this.fetchData(id, 1);
        }
    }

    _getFirstRows() {
        var rows = [];
        var _this = this
        this.state.firstData.forEach(function (product, index) {
            if (index === 0) {
                _this.fetchData(product['Id'], 1);
                rows.push(<FirstCate key={index} id={product['Id']} name={product['Title']} init={true} fObj={fObj}
                                     _getSubCate={(id,obj)=>_this._getSubCate(id,obj)}/>);

            }else{
                rows.push(<FirstCate key={index} id={product['Id']} name={product['Title']}
                                     _getSubCate={(id,obj)=>_this._getSubCate(id,obj)}/>);
            }
        })
        this.setState({
            firstRows: rows
        })
    }

    _getSubRows() {
        var rows = [];
        var _getGoodsList = this._getGoodsList;
        var _this = this;
        this.state.subData.forEach(function (product, index) {
            if(product['items'].length!==0){
                rows.push(<SubCate key={index} id={product['Id']} item={product['items']}  name={product['Title']}
                                   navigator={_this.props.navigator}/>);
            }
        });
        this.setState({
            subRows: rows
        })
    }
    renderLoadingView() {
        return (
            <View style={{flex:1}}>
                <CategoryHeader navigator={this.props.navigator}/>
               <Loaddingpage/>
            </View>
        );
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return (
            <View style={{backgroundColor:'#F6F6F6',flex:1}}>
                <CategoryHeader navigator={this.props.navigator}/>
                <View style={styles.container}>
                    <ScrollView style={styles.firstCate}>
                        {this.state.firstRows}
                    </ScrollView>
                    <ScrollView style={styles.subScroll}>{this.state.subRows}</ScrollView>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    firstCate: {
        width: 103,
        marginTop: 1
    },
    subScroll: {
        flex: 2.68,
        marginLeft: 9,
        marginTop: 1
    }
})