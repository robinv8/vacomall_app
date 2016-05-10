/**
 * Created by renyubin on 16/5/7.
 */
import React,{
    Component,
    ScrollView,
    Text,
    View,
    WebView
} from 'react-native';
//<WebView  style={{flex:1}}
//          source={{uri:'http://www.lcode.org'}}
//          startInLoadingState={true}
//          domStorageEnabled={true}
//          javaScriptEnabled={true}
//></WebView>
export default class MessageList extends Component {
    render() {
        return (
            <View style={{flex:1}}>
                <View style={{flex:10000}}>
                    <ScrollView ref={component => this._scrollView = component}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((message, i) => {
                            return <Text key={i}>{message}</Text>;
                        })}
                    </ScrollView>
                </View>
                <View style={{flex:1}}>
                    <WebView
                             source={{uri:'http://www.lcode.org'}}
                             startInLoadingState={true}
                             domStorageEnabled={true}
                             javaScriptEnabled={true}
                    ></WebView>
                </View>
            </View>
        );
    }
}