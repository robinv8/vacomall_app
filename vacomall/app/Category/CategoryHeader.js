/**
 * Created by renyubin on 16/6/2.
 */
import React, {
    Component,
    Image,
    TextInput,
    View,
    StyleSheet,
    Platform,
    Text,
    StatusBar,
    PixelRatio,
    TouchableWithoutFeedback,
    Navigator,
    ToastAndroid
}from 'react-native';
import {API,NetService,Toast,Login} from '../util/Path';

export default class Header extends Component {
    _back() {
        const {navigator}=this.props;
        //const test=navigator.getCurrentRoutes();
        if (navigator) {
            navigator.pop()
        }
    }


    toHome() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.popToTop()
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
                        分类
                    </Text>
                </View>
                <TouchableWithoutFeedback onPress={()=>this.toHome()}>
                    <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                        <Image source={require('../../images/home_icon.png')}
                               style={styles.scanIcon}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
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