/**
 * Created by ren on 16/4/12.
 */
'use strict';
import React,{
    Component,
}from 'react';
import {
    Text,
    View,
    PropTypes,
    TouchableWithoutFeedback,
    StyleSheet,
    Navigator,
    Image,
    Dimensions,
    Platform
} from 'react-native';
import {ListPage,GoodsDetail} from '../util/Path';
import {getHeight} from '../util/response';
export default class SubCate extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            third: []
        };
    }

    componentWillMount() {
        var rows = [];
        const _this=this;
        this.props.item.map(function (data, index) {
            rows.push(<Third key={index} name={data['Title']} icon={data['Icon']} Xtype={data['Xtype']} Target={data['Target']} navigator={_this.props.navigator}/>)
        });
        this.setState({
            third: rows
        })
    }

    render() {
        return (
            <View>
                <View
                    style={styles.sublist}><Text style={[styles.text]}>{this.props.name}</Text></View>
                <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
                    {this.state.third}
                </View>
            </View>

        );
    }
}
class Third extends Component {
    _selectGoodsList(Target){
        const {navigator}=this.props;
        switch (this.props.Xtype){
            case 10:
                if (navigator) {
                    navigator.push({
                        component: GoodsDetail,
                        params: {id: Target}
                    })
                }
                break;
            case 20:
                if (navigator) {
                    navigator.push({
                        component: ListPage,
                        sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                        params: {Target: Target}
                    })
                }
                break;
            case 30:
                if (navigator) {
                    navigator.push({
                        component: ListPage,
                        params: {
                            text: Target,//关键字搜索
                            Target: null
                        }
                    })
                }
                break;
            case 50:
                if(navigator){
                    navigator.push({
                        component:CategoryList,
                        //sceneConfig:Navigator.SceneConfigs.FloatFromRight
                    });
                }
                break;
            default:
                break
        }
    }
    render() {
        return (
            <TouchableWithoutFeedback onPress={(Target)=>this._selectGoodsList(this.props.Target)}>
                <View
                    style={styles.third}>
                    <Image source={{uri:this.props.icon+'@h_300'}} style={{width:getHeight(124),height:getHeight(124)}}/>
                    <Text style={[styles.Thirdtext]}>{this.props.name}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };
}
const styles = StyleSheet.create({
    sublist: {
        flex: 1,
        height: getHeight(51),
        justifyContent: 'center',
    },
    third: {
        height: getHeight(168),
        width: getHeight(137),
        marginRight: getHeight(5),
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:getHeight(5)
    },
    text: {
        fontSize: getHeight(14),
        color: '#3C3C3C',
    },
    Thirdtext: {
        fontSize: getHeight(12),
        color: '#3C3C3C',
        marginTop: 8
    }
})