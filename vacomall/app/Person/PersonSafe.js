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
export default class PersonSafe extends Component{
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
                      <Text style={{color: '#3C3C3C',fontSize: 18}}>更多设置</Text>
                  </View>
                  <TouchableWithoutFeedback onPress={()=>{}}>
                      <View style={{flex:1,height:50,justifyContent:'center',alignItems:'center'}}>

                      </View>
                  </TouchableWithoutFeedback>
              </View>
              <View>
                  <View style={[styles.barwrap,{marginTop:17,height:62,flexDirection:'row',alignItems:'center',}]}>
                      <View style={{flexDirection:'row',alignItems:'center'}}>
                          <Image source={require('../../images/person_icon1.png')} style={styles.safe_icon}/>
                          <Text style={{marginLeft:10,color:'#3C3C3C',fontSize:16}}>个人安全中心</Text>
                      </View>
                      <View style={{flex:1,alignItems:'flex-end',marginRight:15}}>
                          <Image source={require('../../images/right_arrows_icon.png')} style={styles.right_arrows}/>
                      </View>
                  </View>
                  <View style={[styles.barwrap,{marginTop:17,paddingLeft:10,paddingRight:10}]}>
                      <View style={[styles.barwrap,{height:62,flexDirection:'row',flex:1,alignItems:'center',}]}>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                              <Image source={require('../../images/person_icon2.png')} style={[styles.safe_icon,{marginLeft:0}]}/>
                              <Text style={{marginLeft:10,color:'#3C3C3C',fontSize:16}}>关于万颗</Text>
                          </View>
                          <View style={{flex:1,alignItems:'flex-end'}}>
                              <Image source={require('../../images/right_arrows_icon.png')} style={styles.right_arrows}/>
                          </View>
                      </View>
                      <View style={[styles.barwrap,{height:62,flexDirection:'row',alignItems:'center',}]}>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                              <Image source={require('../../images/person_icon3.png')} style={[styles.safe_icon,{marginLeft:0}]}/>
                              <Text style={{marginLeft:10,color:'#3C3C3C',fontSize:16}}>清除缓存</Text>
                          </View>
                          <View style={{flex:1,alignItems:'flex-end'}}>
                              <Image source={require('../../images/right_arrows_icon.png')} style={styles.right_arrows}/>
                          </View>
                      </View>
                  </View>
                  <View style={[styles.barwrap,{marginTop:17,height:62,flexDirection:'row',alignItems:'center',}]}>
                      <View style={{flexDirection:'row',alignItems:'center'}}>
                          <Image source={require('../../images/person_icon4.png')} style={styles.safe_icon}/>
                          <Text style={{marginLeft:10,color:'#3C3C3C',fontSize:16}}>客服中心</Text>
                      </View>
                      <View style={{flex:1,alignItems:'flex-end',marginRight:15}}>
                          <Image source={require('../../images/right_arrows_icon.png')} style={styles.right_arrows}/>
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
    }
})