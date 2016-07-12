/**
 * Created by renyubin on 16/4/25.
 */
import React,{Component} from 'react';
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
    ListView,
    Alert
}from 'react-native';
import ListPage from './ListPage';
var PPI = PixelRatio.get();
import Storage from 'react-native-storage';

var storage = new Storage({
    //最大容量，默认值1000条数据循环存储
    size: 1000,

    //数据过期时间，默认一整天（1000 * 3600 * 24秒）
    defaultExpires: 1000 * 3600 * 24,

    //读写时在内存中缓存数据。默认启用。
    enableCache: true,

    //如果storage中没有相应数据，或数据已过期，
    //则会调用相应的sync同步方法，无缝返回最新数据。
    sync: {
        //同步方法的具体说明会在后文提到
    }
});

//最好在全局范围内创建一个（且只有一个）storage实例，方便使用
//对于react native
global.storage = storage;
global.searchArray = [];
export default class Header extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            clear: null,
            text: '',
            list:[],
        }
    }

    _clear() {
        this.setState({
            text: '',
            clear: null
        })
    }

    componentDidMount() {
        let searchText=this.props.searchText;
        if(searchText!==undefined){
            this.setState({
                text:searchText,
                clear: <TouchableWithoutFeedback onPress={()=>this._clear()}>
                    <Image source={require('../images/close_icon.png')} style={styles.clearIcon}/>
                </TouchableWithoutFeedback>
            })
        }
        this._getSearchArray();
    }

    _pop() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.pop()
        }
    }

    _onChange(text) {
        var _this = this;
        if (text.length === 0) {
            this.setState({
                clear: null,
                text: ''
            })
        } else {
            this.setState({
                clear: <TouchableWithoutFeedback onPress={()=>_this._clear()}>
                    <Image source={require('../images/close_icon.png')} style={styles.clearIcon}/>
                </TouchableWithoutFeedback>,
                text: text
            })
        }
    }

    _getSearchArray() {
        var _this = this;
        storage.load({
            key: 'search',
            autoSync: true,
            syncInBackground: true
        }).then(ret => {
            searchArray = ret.searchArray;
            if (searchArray.length !== 0) {
                var _array=[];
                searchArray.map(function(data,index){
                    _array.push(<TouchableWithoutFeedback key={index} onPress={(text)=>_this.historyOnSubmit(data)}>
                        <View style={[styles.searchText]}><Text style={{color:'#2e2e2e'}}>{data}</Text></View>
                    </TouchableWithoutFeedback>)
                });
                this.setState({
                    list:_array
                });
            }
        }).catch(err => {
            searchArray = err;

        })
    }
    historyOnSubmit(text) {
        if (text === "") {
            return;
        }
        const {navigator}=this.props;
        if (navigator) {
            navigator.replace({
                component: ListPage,
                params: {
                    text: text,
                    Target: null
                }
            })
        }
    }
    _setSearchArray(text) {
        var flag = true;
        if (searchArray === undefined) {
            searchArray = [];
            searchArray.push(text)
        } else {
            searchArray.map(function (data) {
                if (data === text) {
                    flag = false;
                }
            });
            if (flag) {
                searchArray.unshift(text);
                if (searchArray.length > 6) {
                    searchArray.pop();
                }

            }
        }

        storage.save({
            key: 'search',  //注意:请不要在key中使用_下划线符号!
            rawData: {
                searchArray: searchArray
            },

            //如果不指定过期时间，则会使用defaultExpires参数
            //如果设为null，则永不过期
            expires: 1000 * 3600
        });
    }

    _onSubmit() {
        if (this.state.text === "") {
            return;
        }
        this._setSearchArray(this.state.text);

        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: ListPage,
                params: {
                    text: this.state.text,
                    Target: null
                }
            })
        }
    }

    _removeAll() {
        storage.remove({
            key: 'search'
        });
        this.setState({
            list: [],
        });
    }


    render() {
        return (
            <View style={{flex:1,backgroundColor:'#F6F6F6'}}>
                <View style={styles.container}>
                    <StatusBar
                        barStyle="default"
                    />
                    <View style={styles.searchBox}>
                        <Image source={require('../images/list_search_icon.png')} style={styles.searchIcon}/>
                        <TextInput
                            keyboardType='web-search'
                            placeholder='创维家电直送 好礼不停'
                            placeholderTextColor={'#7A797B'}
                            onChangeText={(text)=>this._onChange(text)}
                            style={styles.inputText}
                            value={this.state.text}
                            blurOnSubmit={true}
                            autoFocus={true}
                            onSubmitEditing={()=>this._onSubmit()}
                        />
                        {this.state.clear}
                    </View>
                    <TouchableWithoutFeedback onPress={()=>this._pop()}>
                        <Text style={{fontSize:16,color:'#3C3C3C',marginBottom:0}}>取消</Text>
                    </TouchableWithoutFeedback>
                </View>
                <View
                    style={{height:28,borderBottomWidth:0.5,borderBottomColor:'#CFCFCF',marginLeft:15,marginRight:15}}>
                    <Text style={{color:'#B6B6B6',fontSize:16}}>历史搜索</Text>
                </View>
                {this.state.list}
                <View style={{flex:1,alignItems:'center',marginTop:28}}>
                    <TouchableWithoutFeedback onPress={()=>this._removeAll()}>
                        <View
                            style={styles.clear_btn}>
                            <Text
                            style={{fontSize:12,color:'#EF8200'}}>清楚历史记录</Text></View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        height:Platform.OS === 'ios' ? 64 : 40,
        alignItems: 'center',
    },
    logo: {
        height: 25,
        width: 64,
        resizeMode: 'stretch'

    },
    clear_btn:{
        padding:3,
        borderRadius:3,
        borderWidth:1,
        borderColor:'#FF9700',
        height:28,
        width:108,
        justifyContent:'center',
        alignItems:'center'
    },
    searchBox: {
        height: 28,
        flexDirection: 'row',
        flex: 1,
        borderRadius: 2,
        backgroundColor: '#E0E0E0',
        alignItems: 'center',
        marginLeft: 0,
        marginRight: 12,

    },
    scanIcon: {
        height: 26.7,
        width: 26.7,
        resizeMode: 'stretch'
    },
    searchIcon: {
        marginLeft: 10,
        marginRight: 8,
        width: 15,
        height: 12.87,
        resizeMode: 'stretch',
    },
    clearIcon: {
        marginLeft: 10,
        marginRight: 10,
        width: 14,
        height: 14,
        resizeMode: 'stretch',
    },
    inputText: {
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 14,
        paddingTop:Platform.OS === 'ios' ? 0 : 10,
        flex:1,
        color: '#7A797B',
    },
    searchText: {
        height: 40,
        borderBottomWidth: 0.5,
        borderBottomColor: '#CFCFCF',
        justifyContent: 'center',
        marginLeft: 15,
        marginRight: 15
    }
})