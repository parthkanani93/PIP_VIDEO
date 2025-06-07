import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

//custom imports
import {moderateScale, screenWidth} from '../../common/constants';
import {colors, styles} from '../../themes';
import CText from '../common/CText';
import {StackNav} from '../../navigation/NavigationKeys';
import FastImage from 'react-native-fast-image';

export default function ProductCard(props) {
  const navigation = useNavigation();
  const {item, onPressFavorite, favoriteProducts} = props;

  const onPressDetail = () =>
    navigation.navigate(StackNav.ProductDetails, {item: item});

  return (
    <TouchableOpacity
      style={localStyles.listMainContainer}
      onPress={onPressDetail}>
      <View style={styles.rowSpaceBetween}>
        <View style={localStyles.discountContainer}>
          <CText type={'m10'} color={colors.red}>
            {Math.round(item.discountPercentage)}% OFF
          </CText>
        </View>
        <TouchableOpacity onPress={onPressFavorite}>
          <Ionicons
            name={'heart'}
            size={moderateScale(18)}
            color={
              favoriteProducts?.some(p => p.id === item.id) || item?.isFavorite
                ? colors.red
                : colors.grayScale3
            }
          />
        </TouchableOpacity>
      </View>
      <FastImage
        style={localStyles.image}
        source={{
          uri: item.thumbnail,
          priority: FastImage.priority.high,
          cache: FastImage.cacheControl.web,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
      <CText type={'r12'} color={colors.grayScale5} style={styles.mb5}>
        {item?.brand
          ? item?.brand?.toUpperCase()
          : item?.category?.toUpperCase()}
      </CText>
      <CText type={'r14'} numberOfLines={2} style={styles.flex}>
        {item?.title}
      </CText>
      <View style={localStyles.ratingContainer}>
        <View style={styles.rowStart}>
          {[1, 2, 3, 4, 5].map(i => {
            const ratingValue = item.rating || 0;
            let iconName = 'star-o';
            if (ratingValue >= i) {
              iconName = 'star';
            } else if (ratingValue >= i - 0.5) {
              iconName = 'star-half';
            }
            return (
              <FontAwesome
                key={i}
                name={iconName}
                color={colors.activeYellow}
                size={moderateScale(14)}
              />
            );
          })}
        </View>
        <CText type={'m12'} style={localStyles.rating}>
          {item.rating}
        </CText>
      </View>
      <CText type={'m16'}>${item.price}</CText>
    </TouchableOpacity>
  );
}

const localStyles = StyleSheet.create({
  listMainContainer: {
    backgroundColor: colors.grayScale9,
    ...styles.ph15,
    ...styles.pv10,
    borderRadius: moderateScale(3),
    width: screenWidth / 2.3,
    ...styles.justifyBetween,
  },
  discountContainer: {
    backgroundColor: colors.lightRed,
    paddingVertical: moderateScale(2),
    ...styles.ph5,
    borderRadius: moderateScale(2),
  },
  image: {
    width: '100%',
    height: moderateScale(130),
    resizeMode: 'contain',
    ...styles.mb20,
    ...styles.mt10,
  },
  ratingContainer: {
    ...styles.rowStart,
    gap: moderateScale(5),
    marginVertical: moderateScale(5),
  },
});
