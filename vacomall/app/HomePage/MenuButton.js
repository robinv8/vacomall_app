/**
 * Created by yuanguozheng on 16/1/22.
 */
'use strict';
import React, {
    Component,
    View,
    Text,
    Image,
    TouchableWithoutFeedback,
    PropTypes,
    StyleSheet,
    Navigator
} from 'react-native';
import ListPage from '../ListPage';
export default class MenuButton extends React.Component {

    _selectGoodsList(id){
        const {navigator}=this.props;
        if(navigator){
            navigator.push({
                component:ListPage,
                sceneConfig:Navigator.SceneConfigs.FloatFromRight,
                params:{id:id}

            })
        }
    }


    render() {
        return (
            <TouchableWithoutFeedback onPress={(id)=>this._selectGoodsList(this.props.id)}>
                <View style={{alignItems:'center',flex:1}}>
                    <Image source={{uri:this.props.imgUrl}} style={{width:50,height:50,resizeMode:'stretch'}}></Image>
                    <Text style={[styles.showText]}>{this.props.showText}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    iconImg: {
        width: 38,
        height: 38,
        marginBottom: 2
    },
    showText: {
        marginTop:6,
        fontSize: 12,
        color: '#696969',
        fontFamily: 'PingFang SC'
    }
});