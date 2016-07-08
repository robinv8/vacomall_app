/**
 * Created by renyubin on 16/6/13.
 */
import React,
    {
    Component,
    Text,
    View
    } from 'react-native';
import ViewPull from '../../ViewPull';
export default class pullTest extends Component{
    onDownFunc(){
    }
    render(){
        return(
        <View style={{flex:1}}>
            <View style={{height:64,backgroundColor:'red'}}></View>
            <ViewPull onDownFunc={()=>this.onDownFunc()}>
                <View style={{backgroundColor:'white',flex:1,height:100,alignItems:'center',justifyContent:'center'}}>
                    <Text>你好</Text>
                </View>

            </ViewPull>
        </View>


        );
    }
}