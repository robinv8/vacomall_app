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
    RefreshControl,ListView
}from 'react-native';
const {width,height}=Dimensions.get('window');
import {API,NetService,md5,Login,HtmlRender,GoodsDetail,Guess} from '../util/Path';
import resolveAssetSource from "react-native/Libraries/Image/resolveAssetSource"
let imgdata = [];
export default class DetailImg extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            HTML: null,
            guessFlag: false,
            webImgData: null
        };
    }


    componentDidMount() {
        imgdata=[];
        this.props.webImgData.map(function (data, index) {
            imgdata.push(<CustomImage key={index} uri={data}/>);
        })
        this.setState({
            webImgData: imgdata
        })
    }

    /*<HtmlRender
     value={this.state.webImgData}
     stylesheet={styles}
     />*/
    render() {
        return (
            <View style={{flex:1,backgroundColor:'#F4F4F4'}}>
                <ScrollView style={{flex:1,backgroundColor:'#F6F6F6'}}>
                    {this.state.webImgData}
                    <Guess navigator={this.props.navigator} type={'goodsdetail'}/>
                </ScrollView>
            </View>
        );
    }
}
class CustomImage extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            w:0,
            h:0
        };
    }
    getSource(assetNumber) {
        let source = resolveAssetSource(assetNumber)
        console.log(source.width, source.height);
    }
    componentWillMount() {
        this.getSource({uri:this.props.uri+'@h_300'})
        Image.getSize(this.props.uri,(w,h)=>{
            this.setState({
                w:w,
                h:h
            })
        })
    }
    render(){
        return(
            <Image source={{uri:this.props.uri+'@h_300'}} style={[styles.img,{height:width*this.state.h/this.state.w}]}/>
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