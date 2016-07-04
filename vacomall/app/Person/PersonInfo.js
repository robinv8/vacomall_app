/**
 * Created by ren on 16/7/5.
 */
import React, {
    Component,
    View,
    StatusBar,
    StyleSheet,
    TouchableWithoutFeedback,
    Image,
    Text,
    Platform
} from 'react-native';
export default class PersonInfo extends Component{
    _back() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.pop()
        }
    }
    render(){
        return(
          <View style={{backgroundColor:'#F6F6F6',flex:1}}>
              <View style={styles.container}>
                  <TouchableWithoutFeedback onPress={()=>this._back()}>
                      <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>
                          <Image source={require('../../images/back_icon.png')}
                                 style={styles.backIcon}/>
                      </View>
                  </TouchableWithoutFeedback>
                  <View style={styles.searchBox}>
                      <Text style={{color: '#3C3C3C',fontSize: 18}}>个人中心</Text>
                  </View>
                  <TouchableWithoutFeedback onPress={()=>{}}>
                      <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>

                      </View>
                  </TouchableWithoutFeedback>
              </View>
              <View>
                  <View style={[styles.barwrap,{marginTop:12,paddingLeft:10,paddingRight:10}]}>
                      <View style={[styles.barwrap,{height:95,flexDirection:'row',flex:1,alignItems:'center',}]}>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                              <Text style={{color:'#3C3C3C',fontSize:16}}>万颗头像</Text>
                          </View>
                          <View style={{flex:1,alignItems:'center',flexDirection:'row',justifyContent:'flex-end'}}>
                              <Image source={require('../../images/person_header.png')} style={styles.person_header}/>
                              <Image source={require('../../images/right_arrows_icon.png')} style={styles.right_arrows}/>
                          </View>
                      </View>
                      <View style={[styles.barwrap,{height:49,flexDirection:'row',alignItems:'center',}]}>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                              <Text style={{color:'#3C3C3C',fontSize:16}}>账号名称</Text>
                          </View>
                          <View style={{flex:1,alignItems:'center',flexDirection:'row',justifyContent:'flex-end'}}>
                              <Text style={{marginRight:12,color:'#3C3C3C',fontSize:16}}>万小颗</Text>
                              <Image source={require('../../images/right_arrows_icon.png')} style={styles.right_arrows}/>
                          </View>
                      </View>
                      <View style={[styles.barwrap,{height:49,flexDirection:'row',alignItems:'center',}]}>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                              <Text style={{color:'#3C3C3C',fontSize:16}}>性别</Text>
                          </View>
                          <View style={{flex:1,alignItems:'center',flexDirection:'row',justifyContent:'flex-end'}}>
                              <Text style={{marginRight:12,color:'#3C3C3C',fontSize:16}}>男</Text>
                              <Image source={require('../../images/right_arrows_icon.png')} style={styles.right_arrows}/>
                          </View>
                      </View>
                      <View style={[styles.barwrap,{height:49,flexDirection:'row',alignItems:'center',}]}>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                              <Text style={{color:'#3C3C3C',fontSize:16}}>手机号</Text>
                          </View>
                          <View style={{flex:1,alignItems:'center',flexDirection:'row',justifyContent:'flex-end'}}>
                              <Text style={{marginRight:12,color:'#3C3C3C',fontSize:16}}>13800000000</Text>
                              <Image source={require('../../images/right_arrows_icon.png')} style={styles.right_arrows}/>
                          </View>
                      </View>
                  </View>
                  <View style={[styles.barwrap,{marginTop:20,height:49,flexDirection:'row',alignItems:'center',}]}>
                      <View style={{flexDirection:'row',alignItems:'center'}}>
                          <Text style={{marginLeft:10,color:'#BFBFBF',fontSize:16}}>客服中心</Text>
                      </View>
                      <View style={{flex:1,alignItems:'flex-end',marginRight:15}}>
                          <Text style={{color:'#BFBFBF',fontSize:16}}>甘肃省张掖市甘州区上秦镇服务站</Text>
                      </View>
                  </View>
              </View>
          </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        height:Platform.OS === 'ios' ? 64 : 40,
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        borderBottomWidth:0.5,
        borderBottomColor:'#B2B2B2',
        justifyContent:'center'
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
    },
    inputText: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 14,
        width: 860,
        color: 'white'
    },
    barwrap:{
        backgroundColor:'white',
        borderBottomWidth:0.5,
        borderBottomColor:'#E2E2E2',

    },
    safe_icon:{
        width:32,
        height:32,
        resizeMode: 'stretch',
        marginLeft:15
    },
    right_arrows:{
        width:7.87,
        height:14,
        resizeMode: 'stretch',
    },
    person_header:{
        width:63,
        height:65,
        resizeMode: 'stretch',
        marginRight:12
    }
})