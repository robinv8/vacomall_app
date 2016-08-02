/**
 * Created by renyubin on 16/4/26.
 */
import React,{
    Component,
    Navigator,
    View
}from 'react-native';
import {DetailHeader,Detail} from './util/Path';
export default class GoodsDetail extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            specs:null
        };
      }
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
                <DetailHeader navigator={this.props.navigator} id={this.props.id} _back={()=>this._back()} type={this.props.type} _this={this.props._this}/>
                <Navigator
                    initialRoute={{ name: defaultName, component: defaultComponent,params:{id:this.props.id,parentProps:this.props,_this1:this}}}
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
                {this.state.specs}
            </View>
        );
    }
}