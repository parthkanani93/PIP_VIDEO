import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local Imports
import CText from './CText';
import {moderateScale} from '../../common/constants';
import {colors, styles} from '../../themes';

export default function CHeader(props) {
  const {
    title,
    onPressBack,
    isHideBack,
    rightIcon = false,
    type,
    leftIcon = false,
    arrowColor = colors.textColor1,
  } = props;
  const navigation = useNavigation();

  const goBack = () => navigation.goBack();
  return (
    <View style={localStyles.container}>
      <View style={styles.rowCenter}>
        {!isHideBack && (
          <TouchableOpacity style={styles.pr10} onPress={onPressBack || goBack}>
            <Ionicons
              name="arrow-back-outline"
              size={moderateScale(26)}
              color={colors.black}
            />
          </TouchableOpacity>
        )}
        {!!leftIcon && leftIcon}
        <CText numberOfLines={1} align={'center'} type={type ? type : 's22'}>
          {title}
        </CText>
      </View>
      {!!rightIcon ? (
        rightIcon
      ) : (
        <View style={localStyles.rightContainer}></View>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    ...styles.rowSpaceBetween,
  },
  rightContainer: {
    height: moderateScale(24),
    width: moderateScale(24),
  },
});
