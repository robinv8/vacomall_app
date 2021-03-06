/**
 * Created by renyubin on 16/4/25.
 */
'use strict';
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
import {connect} from 'react-redux';
import {CateEdit,CateSubmit} from '../../actions/cart';
import {getHeight} from '../util/response';
class CartHeader extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            opacity:1,
            editState:<TouchableWithoutFeedback onPress={()=>this._edit()}>
                <View style={{flex:1,height:getHeight(50),justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#3C3C3C',fontSize: getHeight(16)}}>编辑</Text>
                </View>
            </TouchableWithoutFeedback>,

            event:null
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
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.text!==this.props.text){
            this.setState({
                text:nextProps.text
            });
        }
        return true;
    }
    componentDidMount() {

        if(this.props.tab){
            this.setState({
                opacity:0
            })
        }
        if(this.props.topEvent===false){
            this.setState({
                editState:<TouchableWithoutFeedback onPress={()=>{}}>
                    <View style={{flex:1,height:getHeight(50),justifyContent:'center',alignItems:'center',opacity:0}}>
                        <Text style={{color:'#3C3C3C',fontSize: getHeight(16)}}>完成</Text>
                    </View>
                </TouchableWithoutFeedback>
            });
            return;
        }
    }
    _edit(){
        const {dispatch,nextOper}=this.props;
        if(nextOper==='CATE_EDIT'){
            dispatch(CateEdit());
            this.props._edit();
        }else{
            dispatch(CateSubmit());
            this.props._editsubmit();

        }
    }
    render() {
        const {text} =this.props;
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="default"
                />
                <TouchableWithoutFeedback onPress={()=>this._back()}>
                    <View style={{flex:1,height:getHeight(50),justifyContent:'center',alignItems:'center',opacity:this.state.opacity}}>
                    <Image source={require('../../images/back_icon.png')}
                           style={styles.backIcon}/>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.searchBox}>
                    <Text style={{color: '#3C3C3C',fontSize: getHeight(18)}}>购物车</Text>
                </View>
                <TouchableWithoutFeedback onPress={()=>this._edit()}>
                    <View style={{flex:1,height:getHeight(50),justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#3C3C3C',fontSize: getHeight(16)}}>{text}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}
function select(store) {
    return{
        text:store.cartStore.text,
        nextOper:store.cartStore.nextOper
    }
}
export default connect(select)(CartHeader)
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? getHeight(20) : 0,
        height:Platform.OS === 'ios' ? getHeight(64) : getHeight(50),
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        borderBottomWidth:1,
        borderBottomColor:'#d3d3d3',
        justifyContent:'center'
    },
    searchBox: {
        height: getHeight(50),
        flexDirection: 'row',
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanIcon: {
        height: getHeight(27),
        width: getHeight(27),
        resizeMode: 'stretch'
    },
    searchIcon: {
        width: getHeight(20),
        height: getHeight(20),
        resizeMode: 'stretch',
        backgroundColor: '#00702d'
    },
    backIcon: {
        width: getHeight(12),
        height: getHeight(20),
        resizeMode: 'stretch',
    }
})