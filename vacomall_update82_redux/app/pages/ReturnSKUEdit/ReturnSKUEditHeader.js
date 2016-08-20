/**
 * Created by renyubin on 16/7/4.
 */
'use strict';
import React,{
    Component,
}from 'react';
import {
    Image,
    TextInput,
    View,
    StyleSheet,
    Platform,
    Text,
    StatusBar,
    PixelRatio,
    TouchableWithoutFeedback,
    Navigator
}from 'react-native';
import {getHeight} from '../util/response';
export default class Header extends Component {
    _back() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.pop()
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="default"
                />
                <TouchableWithoutFeedback onPress={()=>this._back()}>
                    <View style={{flex:1,height:getHeight(50),justifyContent:'center',alignItems:'center'}}>
                        <Image source={require('../../images/back_icon.png')}
                               style={styles.backIcon}/>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.searchBox}>
                    <Text style={{color: '#3C3C3C',fontSize: getHeight(18)}}>申请退货</Text>
                </View>
                <TouchableWithoutFeedback onPress={()=>{}}>
                    <View style={{flex:1,height:getHeight(50),justifyContent:'center',alignItems:'center'}}>

                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? getHeight(20) : 0,
        height:Platform.OS === 'ios' ? getHeight(64) : getHeight(50),
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        borderBottomWidth:1,
        borderBottomColor:'#d3d3d3',
        justifyContent:'center'
    },

    searchBox: {
        height: getHeight(50),
        flexDirection: 'row',
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },

    backIcon: {
        width: getHeight(12),
        height: getHeight(20),
        resizeMode: 'stretch',
    },

})