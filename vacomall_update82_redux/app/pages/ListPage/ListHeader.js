/**
 * Created by renyubin on 16/4/25.
 */
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
    Navigator,
    ToastAndroid
}from 'react-native';
import {SearchPage, CartPage, API, NetService, Login} from '../util/Path';

import {cutColor,mainColor} from '../util/global';
import {getHeight} from '../util/response';

export default class Header extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            searchText: null
        };
    }

    _back() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.pop()
        }
    }

    componentDidMount() {
        let searchText = this.props.searchText;
        if (searchText !== null) {
            this.setState({
                searchText: searchText
            })
        }
    }

    _toSearchPage() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: SearchPage,
                sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                params: {searchText: this.props.searchText}
            })
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
                    <Image source={require('../../images/list_search_icon.png')} style={styles.searchIcon}/>
                    <TextInput
                        keyboardType='web-search'
                        placeholder='创维家电直送 好礼不停'
                        onFocus={()=>this._toSearchPage()}
                        placeholderTextColor={'#7A797B'}
                        value={this.state.searchText}
                        style={styles.inputText}/>
                    <Image source={require('../../images/close_icon.png')} style={styles.clearIcon}/>
                </View>
                <TouchableWithoutFeedback onPress={()=>this.toHome()}>
                    <View style={{flex:1,height:getHeight(50),justifyContent:'center',alignItems:'center'}}>
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
        paddingTop: Platform.OS === 'ios' ? getHeight(20) : 0,
        height: Platform.OS === 'ios' ? getHeight(64) : getHeight(50),
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        borderBottomWidth:1,
        borderBottomColor:'#d3d3d3',
    },
    searchBox: {
        height: getHeight(28),
        flexDirection: 'row',
        flex: 6,
        borderRadius: 2,
        backgroundColor: '#E0E0E0',
        alignItems: 'center',
    },
    scanIcon: {
        height: getHeight(22),
        width: getHeight(23),
        resizeMode: 'stretch'
    },
    searchIcon: {
        marginLeft: getHeight(5.45),
        marginRight: getHeight(5.45),
        width: getHeight(15),
        height: getHeight(12.87),
        resizeMode: 'stretch',
    },
    clearIcon: {
        marginLeft: getHeight(10),
        marginRight: getHeight(10),
        width: getHeight(14),
        height: getHeight(14),
        resizeMode: 'stretch',
    },
    backIcon: {
        width: getHeight(14),
        height: getHeight(22),
    },
    inputText: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: getHeight(13.32),
        padding:0,
        color: '#7A797B',
    }
})