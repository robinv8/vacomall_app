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
    Navigator
} from 'react-native';
import CategoryHeader from './Category/CategoryHeader';
import FirstCate from './Category/FirstCate';
import SubCate from './Category/SubCate';

import API from './util/api';
import * as NetService from './util/NetService';
var cateMap = {},firstObj;
export default class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstData: [],
            firstRows: [],
            subData: [],
            subRows: [],
        }
    }

    //组件加载完成,并已渲染之后执行
    componentDidMount() {
        this.fetchData()
    }

    fetchData() {
        NetService.getFetchData(API.CATE + '?type=CAT', (result)=>this._callback(result));
    }

    _callback(result) {
        this.setState({
            firstData: result,
        });
        this._getFirstRows();
    }

    componentWillMount() {
        //this._getFirstCate();
        //this._getSubCate('60a92bc7cee94e21bb129bc985ee92f1')
    }

    _getSubCate(id,obj) {
        if(firstObj!==undefined){
            firstObj.setState({
                color:'#898989',
                background:'#FFFFFF'
            })
        }
        obj.setState({
            color:'#EF8200',
            background:'rgba(0,0,0,0)'
        });
        firstObj=obj;
        //if (cateMap[id] !== undefined) {
        //
        //    this.setState({
        //        subData: cateMap[id]
        //    });
        //    this._getSubRows();
        //
        //} else {
        //    this.componentDidMount(id)
        //}

    }

    _getSubRows() {
        var rows = [];
        var _getGoodsList = this._getGoodsList;
        var _this = this;
        this.state.subData.forEach(function (product, index) {
            rows.push(<SubCate key={index} id={product['Id']} name={product['MobileCatgoryName']}
                               navigator={_this.props.navigator}/>);
        })
        this.setState({
            subRows: rows
        })
    }

    _getFirstCate() {
        if (this.state.firstData.length === 0) {
            this.componentDidMount(0);
        }
    }

    _getFirstRows() {
        var rows = [];
        var _this = this
        this.state.firstData.forEach(function (product, index) {
            rows.push(<FirstCate key={index} id={product['Id']} name={product['GroupName']}
                                 _getSubCate={(id,obj)=>_this._getSubCate(id,obj)}/>);
        })
        this.setState({
            firstRows: rows
        })
    }

    render() {
        return (
            <View style={{backgroundColor:'#F6F6F6',flex:1}}>
                <CategoryHeader/>
                <View style={styles.container}>

                    <ScrollView style={styles.firstCate}>
                        {this.state.firstRows}
                    </ScrollView>
                    <ScrollView style={styles.subScroll}><View
                        style={styles.subCate}>{this.state.subRows}</View></ScrollView>
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
        flex:1,
        marginTop:1
    },
    subScroll: {
        flex: 2.68,
        marginLeft: 5,
    },
    subCate: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
})