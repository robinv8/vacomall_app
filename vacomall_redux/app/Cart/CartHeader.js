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
import {Toast} from '../util/Path';
export default class Header extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            opacity:1,
            editState:<TouchableWithoutFeedback onPress={()=>this._edit()}>
                <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#3C3C3C',fontSize: 16}}>编辑</Text>
                </View>
            </TouchableWithoutFeedback>
        };
      }
    _back() {
        if(this.props.tab){
            return;
        }
        const {navigator}=this.props;
        if (navigator) {
            navigator.pop()
        }
    }

    componentDidMount() {
        if(this.props.tab){
            this.setState({
                opacity:0
            })
        }
    }
    _editsubmit(){
        this.setState({
            editState:<TouchableWithoutFeedback onPress={()=>this._edit()}>
                <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#3C3C3C',fontSize: 16}}>编辑</Text>
                </View>
            </TouchableWithoutFeedback>
        });
        this.props._editsubmit()
    }
    _edit(){
        this.setState({
            editState:<TouchableWithoutFeedback onPress={()=>this._editsubmit()}>
                <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#3C3C3C',fontSize: 16}}>完成</Text>
                </View>
            </TouchableWithoutFeedback>
        });
        this.props._edit()
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="default"
                />
                <TouchableWithoutFeedback onPress={()=>this._back()}>
                    <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center',opacity:this.state.opacity}}>
                    <Image source={require('../../images/back_icon.png')}
                           style={styles.backIcon}/>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.searchBox}>
                    <Text style={{color: '#3C3C3C',fontSize: 18}}>购物车</Text>
                </View>
                {this.state.editState}
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
        borderBottomWidth:0.5,
        borderBottomColor:'#B2B2B2',
        justifyContent:'center'
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