/**
 * Created by renyubin on 16/4/26.
 */
import React, {
    Component,
}from 'react';
import {
    Navigator,
    View
}from 'react-native';
import {DetailHeader, Detail} from './util/Path';
import {connect} from 'react-redux';
class GoodsDetail extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            specs: null
        };
    }

    _back() {
        const {navigator}=this.props;
        if (navigator) {
            navigator.pop()
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <DetailHeader navigator={this.props.navigator} id={this.props.id} _back={()=>this._back()}
                              type={this.props.type} _this={this.props._this}/>
                <Detail id={this.props.id} parentProps={this.props} _this1={this}/>
                {this.state.specs}
            </View>
        );
    }
}
export default connect()(GoodsDetail)