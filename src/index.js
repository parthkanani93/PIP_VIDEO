import React from 'react';
import {StatusBar, View, SafeAreaView} from 'react-native';

// Local Imports
import AppNavigator from './navigation';
import {colors, styles} from './themes';

import {VideoProvider} from './pip/VideoContext';
import {GlobalVideoModal} from './pip/GlobalVideoModal';

export default function index() {
  return (
    <SafeAreaView style={styles.flex}>
      <VideoProvider>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
        <AppNavigator />
        <GlobalVideoModal />
      </VideoProvider>
    </SafeAreaView>
  );
}
