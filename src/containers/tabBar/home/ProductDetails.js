import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';

//custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import {moderateScale, screenWidth} from '../../../common/constants';
import {colors, styles} from '../../../themes';
import CDivider from '../../../components/common/CDivider';
import CText from '../../../components/common/CText';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import {
  addProductAction,
  removeProductAction,
} from '../../../redux/action/favoritesAction';
import {
  useGetGeminiAnalysisMutation,
  useGetProductByIdQuery,
} from '../../../redux/api/productsApi';
import CLoader from '../../../components/common/CLoader';
import FastImage from 'react-native-fast-image';
import images from '../../../assets/images';
import GeminiProductsDetails from '../../../components/models/GeminiProductsDetails';

export default function ProductDetails({route}) {
  const item = route?.params?.item;

  const {data: product, isLoading} = useGetProductByIdQuery(item?.id);
  const [getGeminiAnalysis, {isLoading: loadingGemini}] =
    useGetGeminiAnalysisMutation();

  const favoriteProducts = useSelector(state => state.favorites);
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [geminiMessage, setGeminiMessage] = useState('');

  useEffect(() => {
    if (product?.images?.[0]) {
      setSelectedImage(product?.images?.[0]);
    }
  }, [product]);

  const onPressImage = item => setSelectedImage(item);

  const onPressClose = () => setModalVisible(false);

  const onPressFavorite = () => {
    const isAlreadyFavorite = favoriteProducts.some(p => p.id === product?.id);

    if (isAlreadyFavorite) {
      dispatch(removeProductAction(product?.id));
    } else {
      const updatedItem = {
        ...product,
        isFavorite: true,
      };
      dispatch(addProductAction(updatedItem));
    }
  };

  const onPressAnalyze = async () => {
    try {
      const response = await getGeminiAnalysis(product).unwrap();
      const message = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      setGeminiMessage(message || 'No insights available.');
      setModalVisible(true);
    } catch (error) {
      setGeminiMessage('Unable to fetch analysis.');
      setModalVisible(true);
    }
  };

  const renderImage = ({item: image}) => (
    <TouchableOpacity onPress={() => onPressImage(image)}>
      <FastImage
        style={[
          localStyles.minImageStyle,
          selectedImage === image && localStyles.activeThumbnail,
        ]}
        source={{
          uri: image,
          priority: FastImage.priority.high,
          cache: FastImage.cacheControl.web,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
    </TouchableOpacity>
  );

  const renderReview = ({item: review, index}) => (
    <View>
      <View style={styles.mv10}>
        <View style={localStyles.reviewContainer}>
          <View style={localStyles.reviewAvatar}>
            <CText type={'m18'} color={colors.white}>
              {review.reviewerName.charAt(0).toUpperCase()}
            </CText>
          </View>
          <View style={styles.flex}>
            <View style={localStyles.reviewHeader}>
              <View style={{gap: moderateScale(3)}}>
                <CText type={'r14'}>{review.reviewerName}</CText>
                <CText type={'r12'} color={colors.grayScale5}>
                  {strings.reviewedOn}{' '}
                  {new Date(review.date).toLocaleDateString('en-GB')}
                </CText>
              </View>
              <View style={[styles.rowStart, {gap: moderateScale(5)}]}>
                {[1, 2, 3, 4, 5].map(i => {
                  const ratingValue = review.rating || 0;
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
            </View>
            <CText type={'r14'} style={styles.mt10}>
              {review.comment}
            </CText>
          </View>
        </View>
      </View>
      {index !== product?.reviews.length - 1 && <CDivider />}
    </View>
  );

  const renderTag = tag => (
    <View key={tag} style={localStyles.tag}>
      <CText type={'r14'}>{tag}</CText>
    </View>
  );

  return (
    <CSafeAreaView style={localStyles.container}>
      <View style={localStyles.innerContainer}>
        <CHeader title={product?.title} type={'s18'} />

        <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
          <View style={localStyles.deliveryContainer}>
            <View style={localStyles.deliveryRow}>
              <Ionicons
                name="location-outline"
                size={moderateScale(20)}
                color={colors.grayScale4}
              />
              <CText type={'r14'}>
                {strings.deliveringTo + ' ' + strings.home}
              </CText>
            </View>
            <CText type={'m14'} color={colors.primary}>
              {strings.change}
            </CText>
          </View>
          <FastImage
            style={localStyles.image}
            source={{
              uri: selectedImage,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.web,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <FlatList
            data={product?.images}
            renderItem={renderImage}
            keyExtractor={(image, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.mv20}
          />
          <CText type={'r12'} color={colors.grayScale5} style={styles.mb5}>
            {product?.brand
              ? product?.brand?.toUpperCase()
              : product?.category?.toUpperCase()}
          </CText>
          <View style={styles.rowSpaceBetween}>
            <CText type={'r20'} numberOfLines={2} style={styles.flex}>
              {product?.title}
            </CText>
            <TouchableOpacity
              onPress={onPressFavorite}
              style={localStyles.likeContainer}>
              <Ionicons
                name={'heart'}
                size={moderateScale(24)}
                color={
                  favoriteProducts?.some(p => p.id === product?.id) ||
                  product?.isFavorite
                    ? colors.red
                    : colors.grayScale3
                }
              />
            </TouchableOpacity>
          </View>
          <View style={localStyles.ratingContainer}>
            <View style={styles.rowStart}>
              {[1, 2, 3, 4, 5].map(i => {
                const ratingValue = product?.rating || 0;
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
              {product?.rating}
            </CText>
          </View>
          <View style={[styles.rowSpaceBetween, styles.mt5]}>
            <View style={styles.rowStart}>
              <CText type={'m18'}>${product?.price}</CText>
              <CText type={'m18'} color={colors.green} style={styles.ml10}>
                {product?.discountPercentage + '% Off'}
              </CText>
            </View>
            <CText
              type={'m14'}
              color={
                product?.availabilityStatus === strings.inStock
                  ? colors.green
                  : colors.red
              }>
              {product?.availabilityStatus}
            </CText>
          </View>
          <View style={styles.mt20}>
            <CText type={'r18'} style={styles.mb10}>
              {strings.tags}
            </CText>
            <View style={localStyles.tagsRow}>
              {product?.tags.map(renderTag)}
            </View>
          </View>
          <View style={styles.mt15}>
            <CText type={'r18'} style={styles.mb10}>
              {strings.description}
            </CText>
            <CText
              type={'r14'}
              color={colors.grayScale5}
              style={localStyles.descStyle}>
              {product?.description}
            </CText>
          </View>
          <View style={styles.mt15}>
            <CText type={'r18'} style={styles.mb10}>
              {strings.reviews}
            </CText>
            <FlatList
              data={product?.reviews}
              renderItem={renderReview}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
        <TouchableOpacity
          style={localStyles.geminiContainer}
          onPress={onPressAnalyze}>
          <Image
            source={images.gemini}
            style={localStyles.geminiImageStyle}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <GeminiProductsDetails
        visible={modalVisible}
        geminiMessage={geminiMessage}
        onPressClose={onPressClose}
      />
      {(!!isLoading || !!loadingGemini) && <CLoader />}
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    ...styles.flex,
    backgroundColor: colors.white,
  },
  deliveryRow: {
    ...styles.rowStart,
    gap: moderateScale(5),
  },
  image: {
    width: screenWidth - moderateScale(40),
    height: moderateScale(250),
    resizeMode: 'contain',
    borderRadius: 8,
    backgroundColor: colors.grayScale6,
    ...styles.center,
  },
  innerContainer: {
    ...styles.flex,
    ...styles.p20,
  },
  ratingContainer: {
    ...styles.rowStart,
    gap: moderateScale(5),
    marginTop: moderateScale(10),
  },
  deliveryContainer: {
    ...styles.rowSpaceBetween,
    backgroundColor: colors.grayScale6,
    ...styles.p15,
    ...styles.mv20,
  },
  minImageStyle: {
    backgroundColor: colors.grayScale6,
    height: moderateScale(60),
    width: moderateScale(60),
    borderRadius: moderateScale(5),
    ...styles.mr10,
  },
  activeThumbnail: {
    borderWidth: moderateScale(1),
    borderColor: colors.primary,
  },
  likeContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(5),
    backgroundColor: colors.grayScale6,
    ...styles.center,
  },
  descStyle: {
    lineHeight: moderateScale(22),
  },
  tagsRow: {
    ...styles.flexRow,
    gap: 10,
    ...styles.mb10,
  },
  tag: {
    backgroundColor: colors.grayScale6,
    ...styles.p10,
    borderRadius: moderateScale(3),
  },
  reviewAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    backgroundColor: colors.green,
    borderRadius: moderateScale(20),
    ...styles.center,
  },
  reviewContainer: {
    ...styles.flexRow,
    gap: moderateScale(10),
  },
  reviewHeader: {
    ...styles.rowSpaceBetween,
  },
  geminiImageStyle: {
    width: moderateScale(32),
    height: moderateScale(32),
  },
  geminiContainer: {
    position: 'absolute',
    bottom: moderateScale(20),
    right: moderateScale(20),
    width: moderateScale(50),
    height: moderateScale(50),
    backgroundColor: colors.grayScale3,
    borderRadius: moderateScale(40),
    ...styles.center,
  },
});
