import React from 'react';
import {StyleSheet, View, TextInput} from 'react-native';

// Local Imports
import {getHeight, moderateScale} from '../../common/constants';
import {colors, styles} from '../../themes';
import typography from '../../themes/typography';
import CText from './CText';

export default CInput = props => {
  let {
    _value,
    label,
    inputContainerStyle,
    inputBoxStyle,
    toGetTextFieldValue,
    placeHolder,
    keyBoardType,
    _onFocus,
    _onBlur,
    _errorText,
    _autoFocus,
    _isSecure,
    _maxLength,
    _editable = true,
    autoCapitalize,
    required = false,
    labelStyle,
    multiline,
    errorStyle,
    fieldRef,
    insideLeftIcon,
    rightAccessory,
  } = props;

  // Change Text Input Value
  const onChangeText = val => {
    toGetTextFieldValue(val);
  };

  return (
    <View style={styles.mv10}>
      {label && (
        <View style={[localStyle.labelContainer, labelStyle]}>
          <View style={styles.flexRow}>
            <CText style={localStyle.labelText} type={'s18'}>
              {label}
            </CText>
            {required && <CText color={colors.lightRed}>{' *'}</CText>}
          </View>
        </View>
      )}
      <View
        style={[
          localStyle.inputContainer,
          {
            borderColor: _errorText ? colors.lightRed : colors.bColor1,
            height: multiline ? getHeight(250) : getHeight(52),
          },
          inputContainerStyle,
        ]}>
        {insideLeftIcon ? (
          <View style={{paddingLeft: moderateScale(15)}}>
            {insideLeftIcon()}
          </View>
        ) : null}
        <TextInput
          ref={fieldRef}
          secureTextEntry={_isSecure}
          value={_value}
          maxLength={_maxLength}
          defaultValue={_value}
          autoFocus={_autoFocus}
          autoCorrect={false}
          autoCapitalize={autoCapitalize}
          placeholderTextColor={colors.placeHolderColor}
          onChangeText={onChangeText}
          keyboardType={keyBoardType}
          multiline={multiline}
          editable={_editable}
          onFocus={_onFocus}
          onBlur={_onBlur}
          placeholder={placeHolder}
          underlineColorAndroid={'transparent'}
          scrollEnabled={multiline}
          style={[
            localStyle.inputBox,
            {height: multiline ? getHeight(230) : getHeight(52)},
            inputBoxStyle,
            _editable == false && {color: colors.placeHolderColor},
            {overflow: 'hidden'},
          ]}
          {...props}
        />
        {/* Right Icon And Content Inside TextInput */}
        <View style={styles.mr15}>
          {rightAccessory ? rightAccessory() : null}
        </View>
      </View>
      {/* Error Text Message Of Input */}
      {!!_errorText?.length ? (
        <CText
          type={'r14'}
          style={{
            ...localStyle.errorText,
            ...errorStyle,
          }}>
          {_errorText}
        </CText>
      ) : null}
    </View>
  );
};

const localStyle = StyleSheet.create({
  labelText: {
    textAlign: 'left',
    opacity: 0.9,
  },
  inputBox: {
    ...typography.fontSizes.f16,
    ...typography.fontWeights.Regular,
    ...styles.ph10,
    ...styles.flex,
    color: colors.textColor1,
  },
  inputContainer: {
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(8),
    ...styles.rowSpaceBetween,
    backgroundColor: colors.bgColor1,
    ...styles.mt5,
    width: '100%',
  },
  labelContainer: {
    ...styles.mt10,
    ...styles.rowSpaceBetween,
    ...styles.mb5,
  },
  errorText: {
    textAlign: 'left',
    ...styles.mt5,
    ...styles.ml10,
    color: colors.lightRed,
  },
});
