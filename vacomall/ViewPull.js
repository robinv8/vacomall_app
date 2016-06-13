/**
 * Created by renyubin on 16/6/9.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    PanResponder,
    Dimensions,
    Image,
    ScrollView
} from 'react-native';
const {height, width} = Dimensions.get('window');
var AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
export default class ViewPull extends Component {
    propTypes:{
        onDownFunc:React.PropTypes.func,
        children:React.PropTypes.node.isRequired
    }
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            pan: new Animated.ValueXY(),
            flag: false,
            statusView: <Text>下拉刷新……</Text>,
            isTop:false
        };
    }

    componentDidMount() {
        this.onDownFunc = this.props.onDownFunc;//下拉操作
        let statusView = this.props.statusView;
        if (statusView !== undefined) {
            this.setState({
                statusView: statusView
            });
        }
    }

    componentWillMount() {
        this._animatedValueY = 0;
        this.state.pan.y.addListener((value) => this._animatedValueY = value.value);

        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderGrant: () => {
                this.state.pan.setOffset({y: this._animatedValueY});
                this.state.pan.setValue({y: 0});
                this.setState({
                    isTop: true
                });
            },
            /*onPanResponderMove:Animated.event([
             null, {dy: this.state.pan.y},
             ]),*/
            onPanResponderMove: (event, gestureState) => {
                if (gestureState.dy < 0) {
                    return;
                } else if (gestureState.dy <100 /*&& this.state.flag === false&&this.state.isTop*/) {
                    /*this.setState({
                        flag: true
                    });*/
                    this.onDownFunc();
                    Animated.spring(this.state.pan, {
                        toValue: gestureState.dy
                    }).start();
                }
            },
            onPanResponderRelease: () => {
                Animated.spring(this.state.pan, {
                    toValue: 0
                }).start();

                this.setState({
                    flag: false,
                    isTop: false
                });
            }
        });
    }


    componentWillUnmount() {
        this.state.pan.y.removeAllListeners();
    }


    getStyle() {
        return [
            styles.square,
            {
                transform: [
                    {
                        translateY:this.state.pan.y
                    },
                ]
            }
        ];
    }

    handleScroll(event:Object) {
        //console.log(event.nativeEvent.contentOffset.y)
        //if (event.nativeEvent.contentOffset.y<0) {
        //    this.setState({
        //        isTop: false
        //    })
        //}else{
        //    this.setState({
        //        isTop: true
        //    })
        //}
    }
    render() {
        return (
            <View style={{flex:1,backgroundColor:'rgba(222,223,224,1)',overflow:'hidden'}}>

                <Animated.View
                    style={this.getStyle()}
                    {...this._panResponder.panHandlers}
                >
                    <View style={styles.topView}>
                        {this.state.statusView}
                    </View>
                    <ScrollView>
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                        {this.props.children}
                    </ScrollView>

                </Animated.View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    square: {
        flex:1,
        marginTop:-80
    },
    topView: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },

});
