import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';

// Custom Imports
import {moderateScale} from '../../common/constants';
import {colors, styles} from '../../themes';

const CDivider = ({style}) => {
  return <View style={[localStyles.divider, style]} />;
};

const localStyles = StyleSheet.create({
  divider: {
    height: moderateScale(1),
    ...styles.mv10,
    backgroundColor: colors.bColor1,
  },
});

export default memo(CDivider);
