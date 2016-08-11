/**
 * Created by renyubin on 16/7/4.
 */
import React,{
    Component,
}from 'react';
import {
    View,
    StyleSheet,
    Image,
    StatusBar,
    TouchableWithoutFeedback,
    Platform,
    Text,
    Navigator,
    Dimensions,
    Animated
} from 'react-native';
import BarcodeScanner from 'react-native-barcodescanner';
import {GoodsDetail,Toast} from './Path'
export default class BarCodeAndroid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            torchMode: 'off',
            cameraType: 'back',
            isScan: false,
            isLoad:false,
            isReturn:false,
            fadeAnim: new Animated.Value(0)
        };
    }
    _back() {
        this.setState({
            isLoad:false
        })
        this.interval &&clearInterval(this.interval)
        const {navigator}=this.props;
        if (navigator) {
            navigator.pop()
        }
    }
    componentWillReceiveProps() {
        this.setState({
            isScan:false,
        })
        if(this.state.isReturn){
            this.setTime()
        }

    }

    componentDidMount() {
        this.setTime();
        Animated.timing(          // Uses easing functions
            this.state.fadeAnim,    // The value to drive
            {
                toValue: Dimensions.get('window').height * 0.40,
                duration: 1500, // 动画时间
            }         // Configuration
        ).start();
        setInterval(()=>{
            this.setState({
                fadeAnim:new Animated.Value(0)
            })
            Animated.timing(          // Uses easing functions
                this.state.fadeAnim,    // The value to drive
                {
                    toValue: Dimensions.get('window').height * 0.40,
                    duration: 1500, // 动画时间
                }         // Configuration
            ).start();
        },1500)
    }
    setTime(){
        setTimeout(()=>{
            this.setState({
                isLoad:true,
                isReturn:false
            })
        },500)
    }

    barcodeReceived(e) {
        /*if (!this.state.isScan) {
            this.setState({
                isLoad:false
            })
            Toast.show(JSON.stringify(e))
            const {navigator}=this.props;
            let data = JSON.parse(e.data);
            if(data['t']===undefined){
                return;
            }
            switch (data['t']){
                case 0:
                    if (navigator) {
                        navigator.push({
                            component:GoodsDetail,
                            params:{id:data['g'],type:'barcode',_this:this},
                            sceneConfig: Navigator.SceneConfigs.FadeAndroid
                        })
                    }
                    break;
            }
        }
        this.setState({
            isScan:true
        })*/
    }
    renderLoadingView() {
        return (
            <View style={{flex:1,backgroundColor:'black'}}>
                <View style={styles.container}>
                    <StatusBar
                        barStyle="light-content"
                    />
                    <TouchableWithoutFeedback onPress={()=>this._back()}>
                        <View style={{flex:2,justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
                            <Image source={require('../../images/white_left_arrows.png')}
                                   style={styles.backIcon}/>
                            <Text style={{marginLeft:2,fontSize:16,color: '#FFFFFF'}}>返回</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.searchBox}>
                        <Text style={{color: '#FFFFFF',fontSize: 18}}>扫描二维码</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>{}}>
                        <View style={{flex:2,height:50,justifyContent:'center',alignItems:'center'}}>

                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'white'}}>正在加载……</Text>
                </View>
            </View>
        );
    }
    render() {
        if(!this.state.isLoad){
            return this.renderLoadingView();
        }
        return (
            <View style={{flex:1}}>
                <View style={styles.container}>
                    <StatusBar
                        barStyle="light-content"
                    />
                    <TouchableWithoutFeedback onPress={()=>this._back()}>
                        <View style={{flex:2,justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
                            <Image source={require('../../images/white_left_arrows.png')}
                                   style={styles.backIcon}/>
                            <Text style={{marginLeft:2,fontSize:16,color: '#FFFFFF'}}>返回</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.searchBox}>
                        <Text style={{color: '#FFFFFF',fontSize: 18}}>扫描二维码</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>{}}>
                        <View style={{flex:2,height:50,justifyContent:'center',alignItems:'center'}}>

                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <BarcodeScanner
                    onBarCodeRead={(e)=>this.barcodeReceived(e)}
                    style={{ flex: 1}}
                    torchMode={this.state.torchMode}
                    cameraType={this.state.cameraType}
                    showViewFinder={false}
                >
                    <View style={styles.preview}>
                        <View style={styles.top_shade}/>
                        <View style={{flexDirection:'row'}}>
                            <View
                                style={styles.left_shade}/>
                            <View
                                style={styles.scan}>
                                <View style={{position:'absolute',top:0,left:0}}>
                                    <Image source={require('../../images/top_left.png')} style={{width:16,height:16}}/>
                                </View>
                                <View style={{position:'absolute',top:0,right:0}}>
                                    <Image source={require('../../images/top_right.png')} style={{width:16,height:16}}/>
                                </View>
                                <View style={{position:'absolute',bottom:0,left:0}}>
                                    <Image source={require('../../images/bottom_left.png')}
                                           style={{width:16,height:16}}/>
                                </View>
                                <View style={{position:'absolute',bottom:0,right:0}}>
                                    <Image source={require('../../images/bottom_right.png')}
                                           style={{width:16,height:16}}/>
                                </View>
                                <Animated.View style={{marginTop:this.state.fadeAnim,width:Dimensions.get('window').width * 0.7}}>
                                    <Image source={require('../../images/code_line.png')}
                                           style={{resizeMode: 'stretch',width:Dimensions.get('window').width * 0.7}}/>
                                </Animated.View>
                            </View>
                            <View
                                style={styles.left_shade}/>
                        </View>
                        <View
                            style={{backgroundColor:'black',height: Dimensions.get('window').height*0.37,width: Dimensions.get('window').width,alignItems:'center',paddingTop:29}}>
                            <Text style={{color:'#898989'}}>
                                将二维码放入框内,即可自动扫描
                            </Text>
                        </View>
                    </View>
                </BarcodeScanner>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    preview: {
        flex: 1,
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
    },
    top_shade: {
        backgroundColor: 'black',
        height: Dimensions.get('window').height * 0.20,
        width: Dimensions.get('window').width,
    },
    left_shade: {
        backgroundColor: 'black',
        height: Dimensions.get('window').height * 0.40,
        width: Dimensions.get('window').width,
    },
    scan: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        height: Dimensions.get('window').height * 0.40,
        width: Dimensions.get('window').width * 0.7,
        borderWidth: 1,
        borderColor: '#3C3C3C'
    },
    container: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        height: Platform.OS === 'ios' ? 64 : 40,
        backgroundColor: '#0A0F0B',
        alignItems: 'center',
        justifyContent: 'center'
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
        marginLeft: 9
    }
});