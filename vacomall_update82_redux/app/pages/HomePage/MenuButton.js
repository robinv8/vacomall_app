/**
 * Created by yuanguozheng on 16/1/22.
 */
'use strict';
import React,{
    Component,
}from 'react';
import {
    View,
    Text,
    Image,
    TouchableWithoutFeedback,
    PropTypes,
    StyleSheet,
    Navigator
} from 'react-native';
import {ListPage,CategoryList,GoodsDetail} from '../util/Path';
import {connect} from 'react-redux';
import {TO_NEXT_TYPE10,TO_NEXT_TYPE20,TO_NEXT_TYPE30} from '../../actions/route';
import {getHeight} from '../util/response';
class MenuButton extends React.Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {

        };
      }

    _selectGoodsList(id){
        const {navigator,dispatch}=this.props;
        let opt={
            id:id
        };
        switch (this.props.Xtype){
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
            <TouchableWithoutFeedback onPress={(id)=>this._selectGoodsList(this.props.id)}>
                <View style={{alignItems:'center',flex:1,justifyContent:'center'}}>
                    <Image source={{uri:this.props.imgUrl}} style={{width:getHeight(50),height:getHeight(50),resizeMode:'stretch'}}></Image>
                    <Text style={[styles.showText]}>{this.props.showText}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
export default connect()(MenuButton)
const styles = StyleSheet.create({
    iconImg: {
        width: getHeight(38),
        height: getHeight(38),
        marginBottom: 2
    },
    showText: {
        marginTop:6,
        fontSize: getHeight(12),
        color: '#696969',

    }
});