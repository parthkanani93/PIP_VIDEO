import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import CText from '../common/CText';
import {colors, styles} from '../../themes';
import {moderateScale} from '../../common/constants';
import strings from '../../i18n/strings';

export default function GeminiProductsDetails(props) {
  const {visible, geminiMessage, onPressClose} = props;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={localStyles.mainContainer}>
        <View style={localStyles.innerContainer}>
          <CText type="s18" style={styles.mb10} align={'center'}>
            {strings.productInsights}
          </CText>
          <ScrollView contentContainerStyle={localStyles.containerStyle}>
            <CText type="r14" color={colors.grayScale5}>
              {geminiMessage}
            </CText>
          </ScrollView>
          <TouchableOpacity
            style={localStyles.buttonStyle}
            onPress={onPressClose}>
            <CText type="m16" color={colors.white} align={'center'}>
              {strings.close}
            </CText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const localStyles = StyleSheet.create({
  mainContainer: {
    ...styles.flex,
    backgroundColor: colors.modalBg,
    ...styles.center,
  },
  innerContainer: {
    width: '85%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: moderateScale(20),
    maxHeight: '60%',
  },
  buttonStyle: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(8),
    ...styles.mt20,
    ...styles.ph25,
    width: '40%',
    ...styles.selfCenter,
  },
  containerStyle: {
    ...styles.flexGrow1,
  },
});
