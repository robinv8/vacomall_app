/**
 * Created by renyubin on 16/7/3.
 */
import React,{Component} from 'react';
import {
    View,
    Image,
    Text
} from 'react-native';

export default class Loaddingpage extends Component {
    render() {
        return (
            <View style={{flex:1,backgroundColor:'#F4F4F4',justifyContent:'center',alignItems:'center'}}>
                <Image source={require('../images/loadding_icon.png')} style={{width:129,height:152}}/>
                <Text style={{color:'#D4D4D4',marginTop:16}}>正在努力加载,请等待……</Text>
            </View>
        );
    }
}