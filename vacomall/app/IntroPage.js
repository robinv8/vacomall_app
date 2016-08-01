/**
 * Created by renyubin on 16/7/2.
 */
'use strict';
import React, {
    Component,
    Alert,
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    StatusBar,
    Navigator,
    AsyncStorage,
    TouchableWithoutFeedback
} from 'react-native';
import {MainScreen, AppIntro,} from './util/Path';
import Version from './Version'
export default class IntroPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            second: null
        };
    }

    componentDidMount() {
        this._saveValue_One();
    }

    async _saveValue_One() {
        await AsyncStorage.setItem('installedVersion', Version);
    }

    onSkipBtnHandle = (index) => {
        // Alert.alert('Skip');
        // console.log(index);
        clearTimeout(this.timer)
        const {navigator}=this.props;
        if (navigator) {
            navigator.resetTo({
                component: MainScreen,
                sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                params: {
                    Ad: null//不加载广告
                }
            })
        }
    }
    doneBtnHandle = () => {
        // Alert.alert('Done');

    }

    nextBtnHendle = (index) => {
        //Alert.alert('Next');
        //console.log(index);
    }

    onSlideChangeHandle = (index, total) => {
        if (index === 2) {
            this.timer = setTimeout(()=> {
                const {navigator}=this.props;
                if (navigator) {
                    navigator.resetTo({
                        component: MainScreen,
                        sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                        params: {
                            Ad: null//不加载广告
                        }
                    })
                }
            }, 4000)

        } else {
            clearTimeout(this.timer)
        }
    }

    render() {
        return (
            <View>
                <StatusBar
                    barStyle="default"
                />
                <AppIntro
                    dotColor='rgba(216,216,216,0.3)'
                    activeDotColor='#09B55F'
                    skipBtnLabel=''
                    nextBtnLabel=''
                    doneBtnLabel=''
                    rightTextColor="black"
                    onNextBtnClick={this.nextBtnHendle}
                    onDoneBtnClick={this.doneBtnHandle}
                    onSkipBtnClick={this.onSkipBtnHandle}
                    onSlideChange={this.onSlideChangeHandle}
                >
                    <View style={[styles.slide,{ backgroundColor: '#FFFFFF' }]}>
                        <View level={10}>
                            <Image source={require('../images/intro1.png')}
                                   style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height,resizeMode: 'stretch'}}/>
                        </View>
                    </View>
                    <View style={[styles.slide, { backgroundColor: '#FFFFFF' }]}>
                        <View level={10}><Image source={require('../images/intro2.png')}
                                                style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height,resizeMode: 'stretch'}}/></View>
                    </View>
                    <View style={[styles.slide,{ backgroundColor: '#FFFFFF' }]}>
                        <TouchableWithoutFeedback onPress={()=>this.onSkipBtnHandle()}>
                            <View
                                style={{marginTop:20,position:'absolute',right:14,top:0,width:48,height:24,borderRadius:23,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'white',fontSize:12}}>跳过</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <View level={10}><Image source={require('../images/intro3.png')}
                                                style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height,resizeMode: 'stretch'}}/></View>
                    </View>
                </AppIntro>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    slide: {
        flex: 1,
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
});