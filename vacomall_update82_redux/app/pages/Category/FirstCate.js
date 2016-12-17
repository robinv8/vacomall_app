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
    TouchableWithoutFeedback,
    StyleSheet,
    Platform,
    PixelRatio
} from 'react-native';
import {cutColor,mainColor} from '../util/global';
import {getHeight} from '../util/response';
import {connect} from 'react-redux';
class FirstCate extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            color: '#9B9B9B',
            background: '#FFFFFF'
        };
    }

    componentDidMount() {
        if(this.props.init){
            this.setState({
                color: mainColor,
                background: 'rgba(0,0,0,0)'
            });
            this.props.fObj.push(this);
        }
    }
    render() {
        return (
            <TouchableWithoutFeedback onPress={(id,obj)=>this.props._getSubCate(this.props.id,this)}><View
                style={[styles.firstlist,{backgroundColor:this.state.background}]}><Text
                style={{color:this.state.color,fontSize:getHeight(14)}}>{this.props.name}</Text></View></TouchableWithoutFeedback>
        );
    }
}
export default connect()(FirstCate);
const styles = StyleSheet.create({
    firstlist: {
        height: getHeight(51),
        borderBottomWidth: 0.5,
        borderBottomColor: Platform.OS === 'ios' ? 'rgba(207,207,207,0.3)' : 'rgba(207,207,207,1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Platform.OS === 'ios' ? 0 : 0.5
    },
})