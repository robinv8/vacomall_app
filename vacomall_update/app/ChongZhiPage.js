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
    Dimensions
}from 'react-native';
import {Flow,HuaFei,ScrollableTabView,DefaultTabBar,API,NetService} from './util/Path';

export let parentThis;

export default class ChongZhiPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            clear: null,
            text: '',
            HuaFei: [],
            Flow: [],
            loadding:null
        };
    }

    componentDidMount() {
        let _this=this;
        parentThis=this;
        NetService.getFetchData(API.HOME + '?keys=CZ_HF,CZ_LL', (result)=> {
            this.setState({
                HuaFei: <HuaFei tabLabel="话费" navigator={_this.props.navigator} hfData={result['CZ_HF']} _this={this}/>,
                Flow: <Flow tabLabel="流量" navigator={_this.props.navigator} llData={result['CZ_LL']} _this={this}/>
            })
        });
    }

    _clear() {
        this.setState({
            text: '',
            clear: null
        });
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
        } else {
            this.setState({
                text: '',
                clear: null,
            });
        }

    }

    render() {
        return (
            <View style={{backgroundColor:'#fafafa',flex:1}}>
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
                        tabBarTextStyle={{fontSize:16}}
                        tabBarInactiveTextColor="#BFBFBF"
                        tabBarActiveTextColor='#16BD42'
                        tabBarUnderlineColor='#16BD42'
                        tabBarBackgroundColor='white'
                        scrollWithoutAnimation={true}
                        renderTabBar={() => <DefaultTabBar underlineHeight={2} style={{borderBottomWidth:2,borderBottomColor:'#BFBFBF',height:60,paddingTop:10}}/>}>
                        {this.state.HuaFei}
                        {this.state.Flow}
                    </ScrollableTabView>
                </View>
                {this.state.loadding}
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
        borderBottomWidth: 0.5,
        borderBottomColor: '#D5D5D5',
        justifyContent: 'center'
    },
    searchBox: {

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input_view: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E5E5',
        justifyContent: 'center',
        height: 49,
        alignItems: 'center',
        marginLeft: 0,
        marginBottom: 11
    },
    textinput: {
        paddingLeft: 12,
        height: 48,
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