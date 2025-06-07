import React from 'react';
import {StatusBar, View} from 'react-native';

// Local Imports
import AppNavigator from './navigation';
import {colors, styles} from './themes';

export default function index() {
  return (
    <View style={styles.flex}>
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
      <AppNavigator />
    </View>
  );
}
