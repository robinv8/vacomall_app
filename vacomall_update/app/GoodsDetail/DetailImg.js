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
            imgdata.push(<Image key={index} source={{uri:data+'@h_400'}} style={[styles.img]}/>);
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

const styles = StyleSheet.create({
    img: {
        width: width,
        height:width,
        resizeMode: 'stretch'
    },
    p: {
        padding: 0,
        margin: 0
    }
})