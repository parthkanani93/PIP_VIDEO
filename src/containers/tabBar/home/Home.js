import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

//custom imports
import CLoader from '../../../components/common/CLoader';
import CDebounce from '../../../components/common/CDebounce';
import {moderateScale, screenWidth} from '../../../common/constants';
import CHeader from '../../../components/common/CHeader';
import {colors, styles} from '../../../themes';
import CInput from '../../../components/common/CInput';
import strings from '../../../i18n/strings';
import ProductCard from '../../../components/homeComponent/ProductCard';
import {useDispatch, useSelector} from 'react-redux';
import {
  addProductAction,
  removeProductAction,
} from '../../../redux/action/favoritesAction';
import CText from '../../../components/common/CText';
import {
  useLazyGetProductsQuery,
  useLazySearchProductsQuery,
} from '../../../redux/api/productsApi';

export default function Home() {
  const [getProductsApi, {isFetching}] = useLazyGetProductsQuery();
  const [searchProductsApi, {isFetching: isSearching}] =
    useLazySearchProductsQuery();

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState('');
  const favoriteProducts = useSelector(state => state.favorites);
  const debouncedSearchText = CDebounce(searchText, 500);
  const dispatch = useDispatch();
  const limit = 10;

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (debouncedSearchText) {
      searchProducts();
    } else {
      setSkip(0);
      setHasMore(true);
      getProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchText]);

  const getProducts = async () => {
    if (!hasMore || isFetching) return;

    try {
      const res = await getProductsApi({limit, skip}).unwrap();

      if (res.products.length < limit) {
        setHasMore(false);
      }

      const newList = [...products, ...res.products];
      setProducts(newList);
      setFiltered(newList);
      setSkip(prev => prev + limit);
    } catch (error) {
      console.error('Fetch error', error);
    }
  };

  const searchProducts = async () => {
    try {
      const res = await searchProductsApi(debouncedSearchText).unwrap();
      setFiltered(res.products);
    } catch (error) {
      setFiltered([]);
    }
  };

  const handleSearch = text => {
    setSearchText(text);
  };

  const onPressFavorite = val => {
    const alreadyFavorite = favoriteProducts.some(item => item.id === val.id);

    if (alreadyFavorite) {
      dispatch(removeProductAction(val.id));
    } else {
      const updatedVal = {
        ...val,
        isFavorite: true,
      };
      dispatch(addProductAction(updatedVal));
    }
  };

  const renderItem = ({item}) => (
    <ProductCard
      item={item}
      onPressFavorite={() => onPressFavorite(item)}
      favoriteProducts={favoriteProducts}
    />
  );

  const insideLeftIcon = () => (
    <Ionicons
      name="search-outline"
      size={moderateScale(20)}
      color={colors.placeHolderColor}
    />
  );

  const ListEmptyComponent = () => {
    return (
      <View style={styles.flex}>
        {!isFetching && (
          <View style={localStyles.emptyContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={moderateScale(40)}
              color={colors.grayScale4}
              style={styles.mb10}
            />
            <CText>{strings.noProductFound}</CText>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={localStyles.root}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? moderateScale(60) : 0}
        style={[styles.flex]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={localStyles.container}>
          <CHeader
            isHideBack={true}
            title={strings.products}
            style={{paddingHorizontal: 0}}
          />
          <CInput
            placeHolder={strings.searchProducts}
            _value={searchText}
            toGetTextFieldValue={handleSearch}
            insideLeftIcon={insideLeftIcon}
          />
          <FlatList
            data={filtered}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            numColumns={2}
            onEndReached={getProducts}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.justifyBetween}
            bounces={false}
            contentContainerStyle={localStyles.contentContainerStyle}
            ListEmptyComponent={ListEmptyComponent}
            ListFooterComponent={
              isFetching && products.length > 0 ? (
                <View style={localStyles.footerLoader}>
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              ) : null
            }
          />
        </View>
      </KeyboardAvoidingView>
      {products.length === 0 && <CLoader />}
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  root: {
    ...styles.flex,
    backgroundColor: colors.white,
  },
  container: {
    ...styles.ph20,
    ...styles.pt20,
    ...styles.flex,
  },
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
  contentContainerStyle: {
    gap: moderateScale(10),
    ...styles.mv10,
    ...styles.flexGrow1,
  },
  emptyContainer: {
    ...styles.flexCenter,
  },
});
