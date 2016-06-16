/**
 * Created by renyubin on 16/6/16.
 */
import React,
{
    Component,
    View,
    Text,
    StyleSheet,
    StatusBar,
    Platform
}
    from 'react-native';

export default class ChongZhiPage extends Component {
    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="default"
                />

                <View style={styles.searchBox}>
                    <Text style={{color: '#3C3C3C',fontSize: 18}}>手机充值</Text>
                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        height: Platform.OS === 'ios' ? 64 : 40,
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#B2B2B2',
        justifyContent: 'center'
    },
    logo: {
        height: 25,
        width: 64,
        resizeMode: 'stretch'

    },
    searchBox: {
        height: 40,
        flexDirection: 'row',
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanIcon: {
        height: 23,
        width: 26,
        resizeMode: 'stretch'
    },
    moreIcon: {
        width: 20,
        height: 5,
        resizeMode: 'stretch',
    },
    searchIcon: {
        width: 20,
        height: 20,
        resizeMode: 'stretch',
        backgroundColor: '#00702d'
    },
    backIcon: {
        width: 12,
        height: 20,
        resizeMode: 'stretch',
        marginLeft: 9
    },
    inputText: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 14,
        width: 860,
        color: 'white'
    }
})