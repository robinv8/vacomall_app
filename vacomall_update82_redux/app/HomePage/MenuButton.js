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
import {mainColor} from '../util/global';
import {getHeight} from '../util/response';
export default class MenuButton extends React.Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {

        };
      }

    _selectGoodsList(id){
        const {navigator}=this.props;
        switch (this.props.Xtype){
            case 10:
                if (navigator) {
                    navigator.push({
                        component: GoodsDetail,
                        params: {id: id}
                    })
                }
                break;
            case 20:
                if (navigator) {
                    navigator.push({
                        component: ListPage,
                        sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                        params: {Target: id}
                    })
                }
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