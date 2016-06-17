/**
 * Created by renyubin on 16/6/16.
 */
import React,
{
    Component,
    View,
    Text,
    StyleSheet,
    StatusBar,
    Platform,
    TextInput,
    TouchableWithoutFeedback,
    Image,
}from 'react-native';
import WeChat from 'react-native-wechat-ios';
import Flow from './ChongZhi/Flow';
import HuaFei from './ChongZhi/HuaFei';
import ScrollableTabView,{DefaultTabBar}  from 'react-native-scrollable-tab-view';
import API from './util/api';
import * as NetService from './util/NetService';
export let mobile=null;
import Toast from 'react-native-root-toast';
const appid = 'wx0ccd9f577013dab0';
export default class ChongZhiPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            clear: null,
            text: null,
            HuaFei: [],
            Flow: []
        };
    }
    registerApp() {
        WeChat.registerApp(appid, (res) => {
            Toast.show(res);
        });
    }
    componentDidMount() {
        this.registerApp();
        NetService.getFetchData(API.HOME + '?keys=CZ_HF,CZ_LL', (result)=> {
            this.setState({
                HuaFei: <HuaFei tabLabel="话费" navigator={this.props.navigator} hfData={result['CZ_HF']}/>,
                Flow: <Flow tabLabel="流量" navigator={this.props.navigator} llData={result['CZ_LL']}/>
            })
        });
    }

    _clear() {
        this.setState({
            text: '',
            clear: null
        })
    }

    _onChange(text) {
        var res = /^[0-9]*$/;
        if (res.test(text) && text !== "") {
            this.setState({
                clear: <TouchableWithoutFeedback onPress={()=>this._clear()}>
                    <Image source={require('../images/header/clear.png')} style={styles.clearIcon}/>
                </TouchableWithoutFeedback>,
                text: text
            });
            mobile=text;
        } else {
            this.setState({
                text: '',
                clear: null,
            })
        }

    }

    render() {
        return (
            <View style={{backgroundColor:'#FAFAFA',flex:1}}>
                <View style={styles.container}>
                    <StatusBar
                        barStyle="default"
                    />

                    <View style={styles.searchBox}>
                        <Text style={{color: '#3C3C3C',fontSize: 18}}>手机充值</Text>
                    </View>
                </View>
                <View style={styles.input_view}>
                    <TextInput
                        keyboardType='numeric'
                        placeholder='请输入手机号'
                        placeholderTextColor={'#d2d2d2'}
                        onChangeText={(text)=>this._onChange(text)}
                        value={this.state.text}
                        blurOnSubmit={true}
                        style={styles.textinput}/>
                    {this.state.clear}
                </View>
                <View style={{flex:1,backgroundColor:'#fafafa'}}>
                    <ScrollableTabView
                        //tabBarTextStyle={{color:'#BFBFBF',fontSize:16}}
                        tabBarInactiveTextColor="#BFBFBF"
                        tabBarActiveTextColor='#16BD42'
                        tabBarUnderlineColor='#16BD42'
                        tabBarBackgroundColor='white'
                        scrollWithoutAnimation={true}
                        renderTabBar={() => <DefaultTabBar />}>
                        {this.state.HuaFei}
                        {this.state.Flow}
                    </ScrollableTabView>
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
        borderBottomWidth: 1,
        borderBottomColor: '#D5D5D5',
        justifyContent: 'center'
    },
    searchBox: {
        height: 40,
        flexDirection: 'row',
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input_view: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderBottomColor: '#E6E6E6',
        justifyContent: 'center',
        height: 49,
        alignItems: 'center',
        marginLeft: 0,
        marginBottom: 11
    },
    textinput: {
        paddingLeft: 12,
        height: 47,
        backgroundColor: 'white',
        fontSize: 18,
        flex: 1
    },
    clearIcon: {
        marginLeft: 10,
        marginRight: 10,
        width: 14,
        height: 14,
        resizeMode: 'stretch',
    },
})