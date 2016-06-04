/**
 * Created by renyubin on 16/6/4.
 */
'use strict';
import React,{
    Component,
    TouchableWithoutFeedback,
    Animated,
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TextInput
}from 'react-native';
export default class GoodsSpec extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            specColor: '#C3C3C3',
            bottom: new Animated.Value(-364),
        };
    }

    cancelshade() {
        var _this = this;
        Animated.timing(this.state.bottom, {
            toValue: -364,                         // 将其值以动画的形式改到一个较小值
            decay: 0.1,
        }).start(function () {
            _this.props._this.setState({
                specs: null
            })
        })
    }

    _shade() {
        this.props._this.setState({
            specs: <TouchableWithoutFeedback onPress={()=>this.cancelshade()}>
                <View style={styles.drawer}>
                    <Animated.View
                        style={{position:'absolute',bottom:this.state.bottom,width:Dimensions.get('window').width,backgroundColor:'white'}}>
                        <View style={{height:364}}>
                            <TouchableWithoutFeedback >
                                <View>{this.props.specifications}</View>
                            </TouchableWithoutFeedback>
                            <View style={{padding:5}}>
                                <View style={{marginBottom:10}}>
                                    <View style={{flexDirection:'row',marginBottom:5}}>
                                        <Text style={{fontSize:12,color:'#2F2F2F'}}>数量</Text><Text
                                        style={{fontSize:12,marginLeft:3,color:'#F08100',marginTop:1}}>({this.state.num}件)</Text>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <TouchableWithoutFeedback onPress={(flag)=>this._num('sub')}>
                                            <View
                                                style={{borderWidth:1,borderColor:'#C3C3C3',width:30,height:30,justifyContent:'center',alignItems:'center'}}>
                                                <Image source={require('../../images/sub.png')}
                                                       style={{width:10,height:2,resizeMode:'stretch'}}/>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <View
                                            style={{borderTopWidth:1,borderTopColor:'#C3C3C3',borderBottomWidth:1,borderBottomColor:'#C3C3C3',width:30,height:30}}>
                                            <TextInput
                                                style={{height: 30,width:30,paddingLeft:5,paddingRight:5,textAlign:'center',fontSize:12}}
                                                keyboardType={'numeric'}
                                                onChangeText={(num)=>this._onChange(num)}
                                                underlineColorAndroid='transparent'
                                                value={this.state.num}
                                            />
                                        </View>
                                        <TouchableWithoutFeedback onPress={(flag)=>this._num('add')}>
                                            <View
                                                style={{borderWidth:1,borderColor:'#C3C3C3',width:30,height:30,justifyContent:'center',alignItems:'center'}}><Image
                                                source={require('../../images/add.png')}
                                                style={{width:10,height:10,resizeMode:'stretch'}}/></View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        })
        Animated.timing(this.state.bottom, {
            toValue: 0,// 将其值以动画的形式改到一个较小值
            decay: 0.1,
        }).start()
    }

    render() {
        return (
            <View>
                <TouchableWithoutFeedback onPress={()=>this._shade()}>
                    <View
                        style={{flexDirection:'row',padding:10,marginBottom:10,paddingBottom:0,paddingTop:0,backgroundColor:'white',height:44,alignItems:'center'}}>
                        <View style={{flexDirection:'row',flex:1,justifyContent:'flex-start'}}>
                            <Text style={styles.spec}>选择规格</Text>
                        </View>
                        <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                            <Image source={require('../../images/detail/right_arrows.png')}
                                   style={styles.right_arrows}/>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    };
}
const styles = StyleSheet.create({
    drawer: {
        position: 'absolute',
        top: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    right_arrows: {
        resizeMode: 'stretch',
        width: 10,
        height: 15
    },
    goods_name: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingBottom: 5,
        borderBottomColor: '#E7E7E7'
    },
});