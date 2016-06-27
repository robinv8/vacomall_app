/**
 * Created by renyubin on 16/6/20.
 */
'use strict';
import React,
{
    Component,
    View,
    TouchableWithoutFeedback,
    Image,
    Text,
    StatusBar,
    Platform,
    StyleSheet
} from 'react-native';
import {API,NetService} from '../util/Path';

export default class RetrievePwd extends Component {
    _back() {
        const {navigator}=this.props;
        //const test=navigator.getCurrentRoutes();
        if (navigator) {
            navigator.pop()
        }
    }

    render() {
        return (
            <View style={[styles.container]}>
                <StatusBar
                    barStyle="default"
                />
                <TouchableWithoutFeedback onPress={()=>this._back()}>
                    <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                        <Image source={require('../../images/back_icon.png')}
                               style={styles.backIcon}/>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.searchBox}>
                    <Text style={{color:'#3C3C3C',fontSize:18}}>
                        找回密码
                    </Text>
                </View>
                <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>

                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        height: Platform.OS === 'ios' ? 64 : 40,
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        shadowColor: 'rgb(178,178,178)',
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 0.5,
            width: 0
        }
    },
    searchBox: {
        height: 28,
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanIcon: {
        height: 19,
        width: 21,
        resizeMode: 'stretch'
    },
    backIcon: {
        width: 14,
        height: 20,
        resizeMode: 'stretch',
    },
});