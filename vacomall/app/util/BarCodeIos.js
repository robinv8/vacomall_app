/**
 * Created by ren on 16/7/4.
 */
'use strict';
import React, { Component ,
    Dimensions,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    Alert
} from 'react-native';
import Camera from 'react-native-camera';

export default class BarCodeIos extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Camera
                    ref={(cam) => {
            this.camera = cam;
          }}
                    style={styles.preview}
                    onBarCodeRead={(data,bounds)=>this.onBarCodeRead}
                    aspect={Camera.constants.Aspect.fill}>
                </Camera>
            </View>
        );
    }
    onBarCodeRead(data,bounds){
        Alert.alert(data)
    }
    takePicture() {
        this.camera.capture()
            .then((data) => console.log(data))
            .catch(err => console.error(err));
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
    }
});