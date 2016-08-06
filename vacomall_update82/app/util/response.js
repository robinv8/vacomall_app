/**
 * Created by renyubin on 16/7/14.
 */
'use strict';
import {
    Dimensions
} from 'react-native';
const {width, height}=Dimensions.get('window');
export const getHeight=function(cheight){
    return width*cheight/414
}