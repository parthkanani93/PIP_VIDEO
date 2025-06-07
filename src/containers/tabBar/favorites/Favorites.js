import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

//custom imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import {colors, styles} from '../../../themes';
import CHeader from '../../../components/common/CHeader';
import {moderateScale} from '../../../common/constants';
import ProductCard from '../../../components/homeComponent/ProductCard';
import CInput from '../../../components/common/CInput';
import CDebounce from '../../../components/common/CDebounce';
import {removeProductAction} from '../../../redux/action/favoritesAction';
import CText from '../../../components/common/CText';
import strings from '../../../i18n/strings';

export default function Favorites() {
  const favorites = useSelector(state => state.favorites);
  const dispatch = useDispatch();

  const [favoritesData, setFavoritesData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = CDebounce(searchText, 500);

  useEffect(() => {
    if (favorites.length > 0) {
      setFavoritesData(favorites);
    }
  }, [favorites]);

  useEffect(() => {
    if (debouncedSearchText) {
      const filteredData = favorites.filter(product =>
        product.title.toLowerCase().includes(debouncedSearchText.toLowerCase()),
      );
      setFavoritesData(filteredData);
    } else {
      setFavoritesData(favorites);
    }
  }, [debouncedSearchText, favorites]);

  const handleSearch = text => {
    setSearchText(text);
  };

  const onPressFavorite = item => {
    const updatedFavorites = favoritesData.filter(fav => fav.id !== item.id);
    setFavoritesData(updatedFavorites);
    dispatch(removeProductAction(item.id));
  };

  const renderItem = ({item}) => (
    <ProductCard
      item={item}
      onPressFavorite={() => onPressFavorite(item)}
      favoriteProducts={favorites}
    />
  );

  const insideLeftIcon = () => (
    <Ionicons
      name="search-outline"
      size={moderateScale(20)}
      color={colors.placeHolderColor}
    />
  );

  return (
    <CSafeAreaView style={localStyles.root}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? moderateScale(60) : 0}
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={localStyles.container}>
          <CHeader
            isHideBack={true}
            title={strings.favorites}
            style={{paddingHorizontal: 0}}
          />
          <CInput
            placeHolder={strings.searchFavoriteProducts}
            _value={searchText}
            toGetTextFieldValue={handleSearch}
            insideLeftIcon={insideLeftIcon}
          />
          <FlatList
            data={favoritesData}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.justifyBetween}
            bounces={false}
            contentContainerStyle={localStyles.contentContainerStyle}
            ListEmptyComponent={
              <View style={localStyles.emptyContainer}>
                <Ionicons
                  name="heart-dislike"
                  size={moderateScale(40)}
                  color={colors.grayScale3}
                  style={{marginBottom: 10}}
                />
                <CText type="m20" color={colors.grayScale5}>
                  {strings.noFavoritesFound}
                </CText>
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  root: {
    ...styles.flex,
    backgroundColor: colors.white,
  },
  contentContainerStyle: {
    gap: moderateScale(10),
    ...styles.mv10,
    ...styles.flexGrow1,
  },
  container: {
    ...styles.ph20,
    ...styles.pt20,
    ...styles.flex,
  },
  emptyContainer: {
    ...styles.flexCenter,
  },
});
