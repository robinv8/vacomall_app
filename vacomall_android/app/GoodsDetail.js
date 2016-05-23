/**
 * Created by renyubin on 16/4/26.
 */
import React,{
    Component,
    Navigator,
    View
}from 'react-native';
import DetailHeader from './GoodsDetail/DetailHeader'
import Swiper from 'react-native-swiper2';
import API from './util/api';
import * as NetService from './util/NetService';
import md5 from './util/md5.min';
import Login from './Login';
import Detail from './GoodsDetail/Detail';
export default class GoodsDetail extends Component {
    _back() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.pop()
        }
    }

    render() {
        let defaultName = 'Detail';
        let defaultComponent = Detail;
        return (
            <View style={{flex:1}}>
                <DetailHeader navigator={this.props.navigator} id={this.props.id} _back={()=>this._back()}/>
                <Navigator
                    initialRoute={{ name: defaultName, component: defaultComponent,params:{id:this.props.id,parentProps:this.props}}}
                    style={{backgroundColor:'white'}}
                    configureScene={(route) => {
                if (route.sceneConfig) {
            return route.sceneConfig;
          }
            return Navigator.SceneConfigs.PushFromRight;
          }}
                    renderScene={(route, navigator) => {
            let Component = route.component;
            return <Component {...route.params} navigator={navigator} />
          }}/>
            </View>
        );
    }
}