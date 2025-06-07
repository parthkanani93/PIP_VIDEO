// Library Imports
import React from 'react';
import {KeyboardAvoidingView, Platform, ScrollView} from 'react-native';

// Local Imports
import {moderateScale} from '../../common/constants';
import {styles} from '../../themes';

// KeyboardAvoidWrapper Component
export default CKeyBoardAvoidWrapper = ({
  children,
  containerStyle,
  contentContainerStyle,
}) => {
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === 'ios' ? moderateScale(10) : null}
      style={[styles.flex, containerStyle]}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
        bounces={false}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
