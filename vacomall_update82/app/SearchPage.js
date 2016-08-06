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
    ListView,
    Alert
}from 'react-native';
import ListPage from './ListPage';
import Storage from 'react-native-storage';
import {cutColor,mainColor} from './util/global';
import {getHeight} from './util/response';
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
            //searchArray = err;

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
                        <View>
                            <Text style={{fontSize:getHeight(16),color:'#3C3C3C',marginBottom:0}}>取消</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View
                    style={{height:getHeight(28),borderBottomWidth:0.5,borderBottomColor:'#CFCFCF',marginLeft:getHeight(13),marginRight:getHeight(15)}}>
                    <Text style={{color:'#B6B6B6',fontSize:getHeight(16)}}>历史搜索</Text>
                </View>
                {this.state.list}
                <View style={{flex:1,alignItems:'center',marginTop:28}}>
                    <TouchableWithoutFeedback onPress={()=>this._removeAll()}>
                        <View
                            style={styles.clear_btn}>
                            <Text
                            style={{fontSize:getHeight(12),color:'#EF8200'}}>清除历史记录</Text></View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingLeft: getHeight(10),
        paddingRight: getHeight(10),
        paddingTop: Platform.OS === 'ios' ? getHeight(20) : 0,
        height:Platform.OS === 'ios' ? getHeight(64) : getHeight(50),
        alignItems: 'center',
    },
    clear_btn:{
        padding:3,
        borderRadius:3,
        borderWidth:1,
        borderColor:'#FF9700',
        height:getHeight(28),
        width:getHeight(108),
        justifyContent:'center',
        alignItems:'center'
    },
    searchBox: {
        height: getHeight(28),
        flexDirection: 'row',
        flex: 1,
        borderRadius: 5,
        backgroundColor: '#E0E0E0',
        alignItems: 'center',
        marginLeft: 0,
        marginRight: 12,

    },
    scanIcon: {
        height: getHeight(26.7),
        width: getHeight(26.7)
    },
    searchIcon: {
        marginLeft: getHeight(5.95),
        marginRight: getHeight(0.95),
        width: getHeight(15),
        height: getHeight(12.87)
    },
    clearIcon: {
        marginLeft: getHeight(10),
        marginRight: getHeight(10),
        width: getHeight(14),
        height: getHeight(14)
    },
    inputText: {
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: getHeight(14),
        flex:1,
        color: '#7A797B',
        height:getHeight(28),
        justifyContent:'center',
        padding:0
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