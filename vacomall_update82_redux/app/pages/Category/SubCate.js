/**
 * Created by ren on 16/4/12.
 */
'use strict';
import React, {
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
import {ListPage, GoodsDetail} from '../util/Path';
import {getHeight} from '../util/response';
import {TO_NEXT_TYPE10, TO_NEXT_TYPE20, TO_NEXT_TYPE30} from '../../actions/route';
import {connect} from 'react-redux';
class SubCate extends Component {
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
        this.props.item.map((data, index)=> {
            rows.push(<Third key={index} name={data['Title']} icon={data['Icon']}
                             _selectGoodsList={(id,Xtype)=>this._selectGoodsList(data['Target'],data['Xtype'])}/>)
        });
        this.setState({
            third: rows
        })
    }

    _selectGoodsList(id,Xtype) {
        const {navigator, dispatch}=this.props;
        let opt = {
            id: id
        };
        switch (Xtype) {
            case 10:
                if (navigator) {
                    navigator.push({
                        component: GoodsDetail
                    })
                }
                dispatch(TO_NEXT_TYPE10(opt))
                break;
            case 20:
                if (navigator) {
                    navigator.push({
                        component: ListPage,
                        sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                        params: {Target: id}
                    })
                }
                dispatch(TO_NEXT_TYPE20(opt))
                break;
            case 30:
                if (navigator) {
                    navigator.push({
                        component: ListPage,
                        params: {
                            text: id,//关键字搜索
                            Target: null
                        }
                    })
                }
                dispatch(TO_NEXT_TYPE30(opt))
                break;
            case 50:
                if (navigator) {
                    navigator.push({
                        component: CategoryList,
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
            <View>
                <View
                    style={styles.sublist}><Text style={[styles.text]}>{this.props.name}</Text></View>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {this.state.third}
                </View>
            </View>

        );
    }
}
export default connect()(SubCate);

class Third extends Component {
    render() {
        return (
            <TouchableWithoutFeedback onPress={(id,Xtype)=>this.props._selectGoodsList(id,Xtype)}>
                <View
                    style={styles.third}>
                    <Image source={{uri: this.props.icon + '@h_300'}}
                           style={{width: getHeight(124), height: getHeight(124)}}/>
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
        marginBottom: getHeight(5)
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