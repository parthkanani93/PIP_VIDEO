import {configureStore} from '@reduxjs/toolkit';
import favoriteReducer from '../reducer/favoriteReducer';
import {rootApi} from '../../api/apiCall';

export default configureStore({
  reducer: {
    favorites: favoriteReducer,
    [rootApi.reducerPath]: rootApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(rootApi.middleware),
});
