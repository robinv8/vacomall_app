/**
 * Created by renyubin on 16/5/4.
 */
'use strict';
import React, {
    Component,
    View,
    Platform,
    Text,
    TouchableWithoutFeedback,
    StyleSheet,
    StatusBar,
    Image
}from 'react-native'

var cartThis = [];
export default class paySuccess extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            CreateTime: '',
            OrderCode: '',
            OrderPayType: '',
            OrderPayMoney: ''
        };
    }

    componentDidMount() {
        var result=this.props.result;
        this.setState({
            CreateTime: result['CreateTime'],
            OrderCode: result['OrderCode'],
            OrderPayType: result['OrderPayType'],
            OrderPayMoney: result['OrderPayMoney']
        })
    }


    _back() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.popToTop()
        }
    }

    render() {
        return (
            <View style={{flex:1,backgroundColor:'white'}}>
                <View>
                    <View style={styles.container}>
                        <StatusBar barStyle="light-content"/>
                        <TouchableWithoutFeedback onPress={()=>this._back()}>
                            <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                                <Image source={require('../../images/login/login_back.png')}
                                       style={styles.backIcon}/>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={styles.searchBox}>
                            <Text style={{color: 'white',fontSize: 20}}>支付成功</Text>
                        </View>
                        <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                        </View>
                    </View>
                </View>
                <View style={{flex:1}}>
                    <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                        <View>
                            <Image source={require('../../images/success_icon.png')}
                                   style={{width:60,height:60,resizeMode:'stretch'}}></Image>
                        </View>
                        <View style={{alignItems:'center',marginTop:10}}>
                            <Text style={{color:'#2f2f2f',fontSize:14}}>支付成功</Text>
                            <Text style={{color:'#B5B5B5',fontSize:14}}>我们尽快安排帮您发货</Text>
                        </View>
                    </View>
                </View>
                <View style={{flex:2}}>
                    <View style={styles.orderList}>
                        <View style={{flex:1,}}>
                            <Text style={{color:'#9B9B9B',fontSize:14}}>订单编号</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={{color:'#9B9B9B',fontSize:14}}>{this.state.OrderCode}</Text>
                        </View>
                    </View>
                    <View style={styles.orderList}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#9B9B9B',fontSize:14}}>支付方式</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={{color:'#9B9B9B',fontSize:14}}>{this.state.OrderPayType}</Text>
                        </View>
                    </View>
                    <View style={styles.orderList}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#9B9B9B',fontSize:14}}>下单时间</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={{color:'#9B9B9B',fontSize:14}}>{this.state.CreateTime}</Text>
                        </View>
                    </View>
                    <View style={styles.orderList}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#9B9B9B',fontSize:14}}>支付金额</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={{color:'#9B9B9B',fontSize:14}}>{this.state.OrderPayMoney}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        height: Platform.OS === 'ios' ? 134 / PPI : 50,
        backgroundColor: '#14A83B',
        alignItems: 'center',
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
    },
    orderList: {
        flexDirection: 'row',
        height: 30,
        borderBottomColor: '#EAEAEA',
        borderBottomWidth: 1,
        marginLeft: 50,
        marginRight: 50,
        alignItems: 'center'
    }
})