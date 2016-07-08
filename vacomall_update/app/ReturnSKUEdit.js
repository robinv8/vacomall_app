/**
 * Created by renyubin on 16/7/4.
 */
'use strict';
import React, {
    Component,
    View,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    Text,
    Platform,
    StatusBar,
    ListView,
    Dimensions,
    Navigator,
    TextInput
} from 'react-native';
import {API, NetService, Toast, Login,ReturnSKUEditHeader,Picker,OrderSelectPage} from './util/Path';
const option = [
    '包装/商品破损/污渍',
    '少件/漏发',
    '卖家发错货',
    '7天无理由退换货',
    '做工问题',
    '未按约定时间发货',
    '材质面料与描述不符',
    '颜色/图案/款式与描述不符',
    '大小/尺寸与描述不符'
]
export default class ReturnSKUEdit extends Component {
// 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            text: '',
            selectedOption: '包装/商品破损/污渍'
        };
    }


    onPickerDone(pickedValue) {
        this.setState({
            selectedOption: pickedValue
        })
    }

    _onChange(text) {
        this.setState({
            text: text
        })
    }

    /**
     * @parame null
     */
    submitReturnSKU() {
        const {navigator}=this.props;
        NetService.postFetchData(API.SUBMITRETURNSKU,'orderGoodsId='+this.props.goodsId+'&returnRemark='+this.state.selectedOption+'&otherReason='+this.state.text,(result)=>{
            if (result['success'] === false) {
                Toast.show(result['result']['message']);
                if (result['result']['code'] === 303) {
                    if (navigator) {
                        navigator.push({
                            component: Login,
                            sceneConfig: Navigator.SceneConfigs.FadeAndroid
                        })
                    }
                }
                return;
            }else{
                Toast.show(result['result']['message']);
                if (navigator) {
                    console.log(navigator.getCurrentRoutes())
                    let routes=navigator.getCurrentRoutes();

                    let index=routes.findIndex((value,index,err)=>{
                        return value['component']['name']==='OrderSelectPage'
                    })
                    navigator.popToRoute(routes[index])
                }
            }
        });
    }

    render() {
        return (
            <View style={{backgroundColor:'#FAFAFA',flex:1}}>
                <ReturnSKUEditHeader navigator={this.props.navigator}/>
                <View style={{paddingLeft:12,paddingRight:12,paddingTop:20,flex:1}}>
                    <View style={styles.text_wrap}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{color:'#FD3824',fontSize:18,marginTop:5}}>*</Text><Text
                            style={{color:'#BFBFBF'}}>退货原因</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>this.picker.toggle()}>
                            <View style={{marginLeft:12,flexDirection:'row',flex:1}}>
                                <View>
                                    <Text>{this.state.selectedOption}</Text>
                                </View>
                                <View style={{alignItems:'flex-end',flex:1,marginRight:16,justifyContent:'center'}}>
                                    <Image source={require('../images/down_icon.png')} style={{width:16,height:8.96}}/>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.text_wrap}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{color:'#FD3824',fontSize:18,marginTop:5,opacity:0}}>*</Text><Text
                            style={{color:'#BFBFBF'}}>退货说明</Text>
                        </View>
                        <View style={{marginLeft:12,flexDirection:'row',flex:1}}>
                            <TextInput
                                placeholder='最多200字'
                                placeholderTextColor={'#898989'}
                                onChangeText={(text)=>this._onChange(text)}
                                underlineColorAndroid='transparent'
                                value={this.state.text}
                                style={{height:45,fontSize:14,flex:1}}
                            />
                        </View>
                    </View>
                </View>
                <View style={{height:49,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                    <TouchableWithoutFeedback onPress={()=>this.submitReturnSKU()}>
                        <View style={[styles.btn,styles.btn1]}><Text style={{color:'white'}}>提交申请</Text></View>
                    </TouchableWithoutFeedback>
                </View>
                <Picker style={{height: 300}}
                        ref={picker => this.picker = picker}
                        showDuration={300}
                        showMask={true}
                        pickerCancelBtnText='取消'
                        pickerBtnText='完成'
                        pickerData={option}//picker`s value List
                        selectedValue={this.state.selectedOption}//default to be selected value
                        onPickerDone={(pickedValue)=>this.onPickerDone(pickedValue)}//when confirm your choice
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    text_wrap: {
        height: 45,
        borderWidth: 0.5,
        borderColor: '#DBDBDB',
        borderRadius: 5.57,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 11,
        backgroundColor: 'white'
    },
    btn: {
        width: 90,
        height: 32,
        borderWidth: 1,
        borderColor: '#898989',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn1: {
        marginLeft: 10,
        backgroundColor: '#16BD42',
        borderWidth: 0,
        marginRight: 12,
    },
})