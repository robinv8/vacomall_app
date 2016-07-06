/**
 * Created by renyubin on 16/7/5.
 */
import React, {
    Component,
    View,
    StatusBar,
    StyleSheet,
    TouchableWithoutFeedback,
    Image,
    Text,
    Platform,
    ScrollView
} from 'react-native';
export default class PersonSafe extends Component {
    _back() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.pop()
        }
    }
    toPersonInfo(){
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                component: PersonInfo,
            })
        }
    }
    render() {
        return (
            <View style={{backgroundColor:'#F6F6F6',flex:1}}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={()=>this._back()}>
                        <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                            <Image source={require('../images/back_icon.png')}
                                   style={styles.backIcon}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.searchBox}>
                        <Text style={{color: '#3C3C3C',fontSize: 18}}>关于万颗</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>{}}>
                        <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>

                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <ScrollView style={{flex:1}}>
                    <View style={{flex:1,alignItems:'center',paddingLeft:15,paddingRight:15,marginBottom:50}}>
                        <Image source={require('../images/vacomall_logo.png')} style={{width:200,height: 57,marginTop:25,marginBottom:15}}/>
                        <Text style={{color:'#878787',fontSize:16,letterSpacing:0,lineHeight:28,fontFamily:'.PingFang SC'}}>
                            {'     '}甘肃米粒电子商务有限公司是一家从事涉农互联网服务的企业，与国内多家知名互联网公司及品牌运营商紧密合作，主要面向西北县域电商市场和国际国内农产品市场提供系列电子商务服务，主营业务涉及农村电商代购、农产品代销、农业电商服务、信息技术服务等多个领域。通过与金融机构合作，共建乡村与城市社区实体服务网点，最终形成集网络营销、线下体验、数据化金融于一体的农业电商平台。
                            </Text>
                        <Text style={{color:'#878787',fontSize:16,letterSpacing:0,lineHeight:28,fontFamily:'.PingFang SC'}}>
                            {'     '}公司旗下“万颗商城”(<Text style={{color:'#009934'}}>http://www.vacomall.com</Text>)是以O2O模式运行的网络购销商城。致力于改善地县、乡镇、村落的购物环境，降低人们生活成本，提高生活质量。优化农产品流通环节，增加农民收益，提高农业资源配置效率。最终，搭建优质工业产品下行进村与优质农产品上行至社区的双向流通管道。
                        </Text>
                        <Text style={{color:'#878787',fontSize:16,letterSpacing:0,lineHeight:28,fontFamily:'.PingFang SC'}}>
                            {'     '}甘肃米粒电子商务有限公司以“连接一切，改变三农”为企业使命，致力于打造全球最大的涉农电子商务创业服务平台，秉承“极致服务，快速执行，勇于创新，合作共赢”的经营理念和“成就他人，才能成就自己”的核心价值观，目标是覆盖全国2000个县城，服务全球20亿用户。
                        </Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        height: Platform.OS === 'ios' ? 64 : 40,
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(178,178,178,0.1)',
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
    }
})