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
import HTML from 'react-native-fence-html'
export default class GoodsDetail extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            HTML: null,
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
                <TouchableWithoutFeedback onPress={()=>this.toDetail()}>
                    <View
                        style={{backgroundColor:'white',paddingLeft:5,height:50,justifyContent:'center',alignItems:'center'}}>
                        <Text>点击返回商品详情</Text>
                    </View>
                </TouchableWithoutFeedback>
                <ScrollView style={{flex:1,marginTop:10,backgroundColor:'white'}}>
                    <HTML html={this.props.webImgData}
                    htmlStyles={styles}
                    />
                </ScrollView>
            </View>
        );
    }
}
const styles = {
    img: {
        resizeMode: 'cover'
    }
}