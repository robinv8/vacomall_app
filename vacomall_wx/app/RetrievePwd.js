/**
 * Created by renyubin on 16/6/20.
 */
'use strict';
import React,
{
    Component,
    View
} from 'react-native';
import {RetrievePwdHeader} from './util/Path';

export default class RetrievePwd extends Component{
    render(){
        return(
            <View>
                <RetrievePwdHeader navigator={this.props.navigator}/>

            </View>
        );
    }
}