/**
 * Created by renyubin on 16/4/25.
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
import EditCart from '../EditCart'
var PPI = PixelRatio.get();
export default class Header extends Component {
    _back() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.pop()
        }
    }
    _edit() {
        if(this.props.gList.length===0){
            ToastAndroid.show('购物车数量为0,不能进行编辑!', ToastAndroid.SHORT);
            return;
        }
        const {navigator}=this.props;
        if (navigator) {
            navigator.replace({
                component: EditCart,
                params: {id: this.props.id}
            })
        }
    }
    render() {
        return (
            <View style={styles.container}>
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
                    <Text style={{color: '#3C3C3C',fontSize: 18}}>购物车</Text>
                </View>
                <TouchableWithoutFeedback onPress={()=>this._edit()}>
                    <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#3C3C3C',fontSize: 16}}>编辑</Text>
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
        height:Platform.OS === 'ios' ? 64 : 40,
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
    logo: {
        height: 25,
        width: 64,
        resizeMode: 'stretch'

    },
    searchBox: {
        height: 40,
        flexDirection: 'row',
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanIcon: {
        height: 27,
        width: 27,
        resizeMode: 'stretch'
    },
    searchIcon: {
        width: 20,
        height: 20,
        resizeMode: 'stretch',
        backgroundColor: '#00702d'
    },
    backIcon: {
        width: 12,
        height: 20,
        resizeMode: 'stretch',
    },
    inputText: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 14,
        width: 860,
        color: 'white'
    }
})