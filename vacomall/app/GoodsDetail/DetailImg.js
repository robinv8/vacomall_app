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
    RefreshControl,
    ListView,
}from 'react-native';
const {width,height}=Dimensions.get('window');
import {API,NetService,md5,Login,HtmlRender,GoodsDetail,Guess} from '../util/Path';
import imagesize from 'imagesize';

let imgdata = [];
export default class DetailImg extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            height: 0,
            guessFlag: false,
            webImgData: `
<!DOCTYPE html>\n
<html>
  <head>
    <title>Hello Static World</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=320, user-scalable=no">
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
        font: 62.5% arial, sans-serif;
        background: #ccc;
      }
      h1 {
        padding: 45px;
        margin: 0;
        text-align: center;
        color: #33f;
      }
    </style>
  </head>
  <body>
  </body>
</html>
`
        };
    }


    componentDidMount() {
        imgdata = '';
        console.log(this.props.webImgData)
        this.props.webImgData.map(function (data, index) {
            imgdata += '<img src="' + data + '"/>';
            var request = http.get(data, function (response) {
                imagesize(response, function (err, result) {
                    // do something with result

                    // we don't need more data
                    request.abort();
                });
            });
        })
        this.setState({
            webImgData: `
<!DOCTYPE html>\n
<html>
  <head>
    <title>Hello Static World</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
        width:`+width+`;
        font: 62.5% arial, sans-serif;
        background: #ccc;
        overflow: hidden;
      }
      img:{
      width:100%;
      height:100%
      }
    </style>
  </head>
  <body>
    ` + imgdata + `
  </body>
</html>
`
        })
    }

    onNavigationStateChange(navState) {
        this.setState({
            height: navState.target
        });
    }

    render() {
        return (
            <View style={{flex:1,backgroundColor:'#F4F4F4'}}>
                <WebView
                    onNavigationStateChange={(navState)=>this.onNavigationStateChange(navState)}
                    source={{html:this.state.webImgData}}
                    style={{
            backgroundColor: 'white',
            height: this.state.height,
            width:width
          }}
                />
                <ScrollView style={{flex:1,backgroundColor:'#F6F6F6'}}>
                    <Guess navigator={this.props.navigator} type={'goodsdetail'}/>
                </ScrollView>
            </View>
        );
    }
}
class CustomImage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            w: 0,
            h: 0
        };
    }

    componentDidMount() {

    }
    render() {
        return (
            <Image source={{uri:this.props.uri+'@h_500'}} onLoaded={(data)=>this.onLoaded()}
                   style={[styles.img,{height:width}]}/>
        );
    }
}
const styles = StyleSheet.create({
    img: {
        width: width,
        resizeMode: 'stretch'
    },
    p: {
        padding: 0,
        margin: 0
    }
})