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
import {API,NetService,md5,Login,HtmlRender,GoodsDetail,Guess} from '../util/Path';
let dataArray = [];
export default class DetailImg extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            HTML: null,
            guessFlag: false,
            webImgData:[]
        };
    }

    componentDidMount() {
        this.props.webImgData.map(function(data,index){
            dataArray.push('<img src='+data+'>')
        })
        this.setState({
            webImgData:dataArray
        })
    }

    render() {
        return (
            <View style={{flex:1,backgroundColor:'#F4F4F4'}}>
                <ScrollView style={{flex:1,backgroundColor:'#F6F6F6'}}>
                    <HtmlRender
                        value={this.state.webImgData}
                        stylesheet={styles}
                    />
                    <Guess navigator={this.props.navigator}/>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    img: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width,
        resizeMode: 'stretch'
    },
    p: {
        padding: 0,
        margin: 0
    }
})