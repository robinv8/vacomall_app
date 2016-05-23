/**
 * Created by renyubin on 16/4/23.
 */
import React,{
    Component,
    View,
    Text,
    TouchableOpacity
}from 'react-native';
import Login from './Login';
export default class Person extends Component {
    getPersion(){
        const {navigator}=this.props;
        if(navigator){
            navigator.push({
                component:Login,
            })
        }
    }
    render() {
        return (
            <TouchableOpacity onPress={()=>this.getPersion()}>
                <View>
                    <Text>个人中心</Text>
                </View>
            </TouchableOpacity>
        );
    }
}