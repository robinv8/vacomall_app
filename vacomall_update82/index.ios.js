/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

'use strict';
import React from 'react';
import {
    AppRegistry,
} from 'react-native';
import MainPage from './MainPage';
import {HomePage,PayError,CategoryList,SearchPage} from './app/util/Path'
AppRegistry.registerComponent('vacomall', () => MainPage);