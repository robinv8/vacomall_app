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
    ToastAndroid,
    ViewPagerAndroid,
    Navigator,
}from 'react-native';
import DetailHeader from './DetailHeader'
import Swiper from 'react-native-swiper2';
import API from '../util/api';
import * as NetService from '../util/NetService';
import md5 from '../util/md5.min';
import Login from '../Login';
export default class GoodsDetail extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            HTML: '',
        };
    }

    componentDidMount() {
        this.setState({
            HTML: `<!DOCTYPE html>\n
            <html>
              <head>
                <title>HTML字符串</title>
                <meta http-equiv="content-type" content="text/html; charset=utf-8">
                <meta name="viewport" content="width=320, user-scalable=no">
                <script type="text/javascript" src="http://cdn.vacomall.com/web/v2/js/jquery-1.10.1.min.js"></script>
              </head>
              <style>
              img{
              width:350px
              }
              </style>
              <body>` + this.props.webImgData + `
              </body>
            </html>`
        });
    }

    toDetail(){
        const {navigator}=this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    render() {
        return (
            <View style={{flex:1,backgroundColor:'#F4F4F4'}}>
                <TouchableWithoutFeedback onPress={()=>this.toDetail()}>
                    <View
                        style={{backgroundColor:'white',paddingLeft:5,height:50,justifyContent:'center',alignItems:'center'}}>
                        <Text>点击返回商品详情</Text>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{flex:1,marginTop:10,backgroundColor:'white'}}>
                        <View style={{flexDirection:'row',marginBottom:5,paddingLeft:5}}>
                            <Text style={{fontSize:10,color:'#2F2F2F'}}>商品详情</Text>
                        </View>
                        <WebView
                            source={{html:this.state.HTML}}
                            startInLoadingState={true}
                            domStorageEnabled={true}
                            javaScriptEnabled={true}
                            scalesPageToFit={true}
                        >
                        </WebView >
                </View>
            </View>
        );
    }
}