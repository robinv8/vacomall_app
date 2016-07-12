/**
 * Created by ren on 16/4/12.
 */
'use strict';
import React,{Component} from 'react';
import {
    Text,
    View,
    PropTypes,
    TouchableWithoutFeedback,
    StyleSheet,
    Navigator,
    Image,
    Dimensions,
    Platform
} from 'react-native';
import {ListPage,} from '../util/Path';
export default class SubCate extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            third: []
        };
    }

    componentWillMount() {
        var rows = [];
        const _this=this;
        this.props.item.map(function (data, index) {
            rows.push(<Third key={index} name={data['Title']} icon={data['Icon']} Target={data['Target']} navigator={_this.props.navigator}/>)
        });
        this.setState({
            third: rows
        })
    }

    render() {
        return (
            <View>
                <View
                    style={styles.sublist}><Text style={[styles.text]}>{this.props.name}</Text></View>
                <View style={{flexDirection: 'row'}}>
                    {this.state.third}
                </View>
            </View>

        );
    }
}
class Third extends Component {
    _selectGoodsList(Target){
        const {navigator}=this.props;
        if(navigator){
            navigator.push({
                component:ListPage,
                params:{Target:Target}
            })
        }
    }
    render() {
        return (
            <TouchableWithoutFeedback onPress={(Target)=>this._selectGoodsList(this.props.Target)}>
                <View
                    style={styles.third}>
                    <Image source={{uri:this.props.icon}} style={{width:124,height:124,resizeMode:'stretch'}}/>
                    <Text style={[styles.Thirdtext]}>{this.props.name}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };
}
const styles = StyleSheet.create({
    sublist: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
    },
    third: {
        height: 168,
        width: Platform.OS === 'ios' ? (Dimensions.get('window').width - 130) / 2 : (Dimensions.get('window').width - 115) / 2,
        marginRight: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 14,
        color: '#3C3C3C',
    },
    Thirdtext: {
        fontSize: 12,
        color: '#3C3C3C',
        marginTop: 8
    }
})