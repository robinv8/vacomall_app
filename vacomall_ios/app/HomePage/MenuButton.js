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

    static propTypes = {
        color: PropTypes.string.isRequired,
        showText: PropTypes.string,  // 显示标题\文字
        id: PropTypes.string.isRequired,  // id
    };

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
                    <View
                        style={{width:50,height:50,backgroundColor:this.props.color,borderRadius:50,justifyContent:'center',alignItems:'center'}}>
                        <Text style={[styles.showText]}>{this.props.showText }</Text>
                    </View>
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
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold',
    }
});