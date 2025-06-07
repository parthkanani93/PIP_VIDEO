import {SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';

// Local Imports
import {colors, styles} from '../../themes';

export default CSafeAreaView = ({children, ...props}) => {
  return (
    <SafeAreaView {...props} style={[localStyles(props.style).root]}>
      {children}
    </SafeAreaView>
  );
};

const localStyles = style =>
  StyleSheet.create({
    root: {
      ...styles.flex,
      backgroundColor: colors.backgroundColor,
      ...style,
    },
  });
