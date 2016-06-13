/**
 * Created by renyubin on 16/5/9.
 */
import React,{
    Component,
    View,
    StyleSheet,
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    TextInput,
    Alert,
    WebView,
    ViewPagerAndroid,
    Navigator,
    RefreshControl
}from 'react-native';
import DetailHeader from './DetailHeader'
import Swiper from 'react-native-swiper2';
import API from '../util/api';
import * as NetService from '../util/NetService';
import md5 from '../util/md5.min';
import Login from '../Login';
import HtmlRender from 'react-native-html-render';
export default class GoodsDetail extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            HTML: null,
            guessFlag:false
        };
    }

    toDetail() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        return (
            <View style={{flex:1,backgroundColor:'#F4F4F4'}}>
                <ScrollView style={{flex:1,backgroundColor:'white'}}
                            refreshControl={
                              <RefreshControl
                                onRefresh={()=>this.toDetail()}
                                colors={['#ff0000', '#00ff00', '#0000ff','#3ad564']}
                                progressBackgroundColor="#ffffff"
                                title={'释放,返回商品详情'}
                              />
                            }
                >
                    <HtmlRender
                        value={this.props.webImgData}
                        stylesheet={styles}
                    />
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    img: {
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').width,
        resizeMode: 'stretch'
    },
    p:{
        padding:0,
        margin:0
    }
})