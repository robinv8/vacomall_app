/**
 * Created by ren on 16/4/12.
 */
'use strict';
import React, {
    Component,
    Text,
    View,
    PropTypes,
    TouchableWithoutFeedback,
    StyleSheet,
    Navigator,
    TouchableOpacity
} from 'react-native';
import ListPage from '../ListPage'
export default class SubCate extends Component {
    _selectGoodsList(id){
        const {navigator}=this.props;
        if(navigator){
            navigator.push({
                component:ListPage,
                params:{id:id}
            })
        }
    }
    render() {
        return(
            <TouchableOpacity  onPress={()=>this._selectGoodsList(this.props.id)}><View
                style={styles.sublist}><Text style={[styles.text]}>{this.props.name}</Text></View></TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    sublist: {
        height: 40,
        width: 80,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        borderRightWidth: 1,
        borderRightColor: 'white',
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 12
    }
})