/**
 * Created by ren on 16/7/5.
 */
import React,{
    Component,
}from 'react';
import {
    View,
    StatusBar,
    StyleSheet,
    TouchableWithoutFeedback,
    Image,
    Text,
    Platform
} from 'react-native';
import {getHeight} from '../util/response';
import {NetService,API,Login,Toast} from '../util/Path'
export default class PersonInfo extends Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            name:null,
            mobile:null,
            address:null
        };
      }
    _back() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.pop()
        }
    }

    componentDidMount() {
        NetService.getFetchData(API.PERSONINFO,(result)=>{
            if (result['success'] === false) {
                Toast.show(result['result']['message']);
                if (result['result']['code'] === 303) {
                    const {navigator}=this.props;
                    if (navigator) {
                        navigator.push({
                            component: Login,
                            sceneConfig: Navigator.SceneConfigs.FadeAndroid
                        })
                    }
                    this.setState({
                        refreshing: true
                    })
                }
                return;
            }
            this.setState({
                name:result['VillageName'],
                mobile:result['VillageMobile'],
                address:result['VillageAddress']
            })
        });
    }
    render(){
        return(
          <View style={{backgroundColor:'#F6F6F6',flex:1}}>
              <View style={styles.container}>
                  <TouchableWithoutFeedback onPress={()=>this._back()}>
                      <View style={{flex:1,height:getHeight(getHeight),justifyContent:'center',alignItems:'center'}}>
                          <Image source={require('../../images/back_icon.png')}
                                 style={styles.backIcon}/>
                      </View>
                  </TouchableWithoutFeedback>
                  <View style={styles.searchBox}>
                      <Text style={{color: '#3C3C3C',fontSize: getHeight(18)}}>个人中心</Text>
                  </View>
                  <TouchableWithoutFeedback onPress={()=>{}}>
                      <View style={{flex:1,height:getHeight(50),justifyContent:'center',alignItems:'center'}}>

                      </View>
                  </TouchableWithoutFeedback>
              </View>
              <View>
                  <View style={[styles.barwrap,{marginTop:getHeight(12),paddingLeft:getHeight(10),paddingRight:getHeight(10),backgroundColor:'white',borderBottomWidth:1,borderBottomColor:'#E2E2E2'}]}>
                      <View style={[styles.barwrap,{height:getHeight(95),flexDirection:'row',flex:1,alignItems:'center',}]}>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                              <Text style={{color:'#3C3C3C',fontSize:getHeight(16)}}>万颗头像</Text>
                          </View>
                          <View style={{flex:1,alignItems:'center',flexDirection:'row',justifyContent:'flex-end'}}>
                              <Image source={require('../../images/person_header.png')} style={styles.person_header}/>
                              <Image source={require('../../images/right_arrows_icon.png')} style={styles.right_arrows}/>
                          </View>
                      </View>
                      <View style={[styles.barwrap,{height:getHeight(49),flexDirection:'row',alignItems:'center',}]}>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                              <Text style={{color:'#3C3C3C',fontSize:getHeight(16)}}>账号名称</Text>
                          </View>
                          <View style={{flex:1,alignItems:'center',flexDirection:'row',justifyContent:'flex-end'}}>
                              <Text style={{marginRight:getHeight(12),color:'#3C3C3C',fontSize:getHeight(16)}}>{this.state.name}</Text>
                              <Image source={require('../../images/right_arrows_icon.png')} style={styles.right_arrows}/>
                          </View>
                      </View>
                      <View style={[styles.barwrap,{height:getHeight(49),flexDirection:'row',alignItems:'center',borderBottomWidth:0}]}>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                              <Text style={{color:'#3C3C3C',fontSize:getHeight(16)}}>手机号</Text>
                          </View>
                          <View style={{flex:1,alignItems:'center',flexDirection:'row',justifyContent:'flex-end'}}>
                              <Text style={{marginRight:getHeight(12),color:'#3C3C3C',fontSize:getHeight(16)}}>{this.state.mobile}</Text>
                              <Image source={require('../../images/right_arrows_icon.png')} style={styles.right_arrows}/>
                          </View>
                      </View>
                  </View>
                  <View style={[styles.barwrap,{marginTop:getHeight(20),height:getHeight(49),flexDirection:'row',alignItems:'center',backgroundColor:'white',borderBottomWidth:1,borderBottomColor:'#E2E2E2'}]}>
                      <View style={{flexDirection:'row',alignItems:'center'}}>
                          <Text style={{marginLeft:getHeight(10),color:'#BFBFBF',fontSize:getHeight(16)}}>收货地址</Text>
                      </View>
                      <View style={{flex:1,alignItems:'flex-end',marginRight:getHeight(15)}}>
                          <Text style={{color:'#BFBFBF',fontSize:getHeight(16)}}>{this.state.address}</Text>
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
        paddingTop: Platform.OS === 'ios' ? getHeight(20) : 0,
        height:Platform.OS === 'ios' ? getHeight(64) : getHeight(50),
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        borderBottomWidth:0.5,
        borderBottomColor:'#B2B2B2',
        justifyContent:'center'
    },
    searchBox: {
        height: getHeight(50),
        flexDirection: 'row',
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        width: getHeight(12),
        height: getHeight(20),
        resizeMode: 'stretch',
    },
    barwrap:{
        //backgroundColor:'white',
        borderBottomWidth:0.5,
        borderBottomColor:'#E7E7E7',

    },
    safe_icon:{
        width:getHeight(32),
        height:getHeight(32),
        resizeMode: 'stretch',
        marginLeft:getHeight(15)
    },
    right_arrows:{
        width:getHeight(7.87),
        height:getHeight(14),
        resizeMode: 'stretch',
    },
    person_header:{
        width:getHeight(63),
        height:getHeight(65),
        resizeMode: 'stretch',
        marginRight:getHeight(12)
    }
})