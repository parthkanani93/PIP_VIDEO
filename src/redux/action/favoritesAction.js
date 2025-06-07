import {ADD_PRODUCT, REMOVE_PRODUCT} from '../types';

export const addProductAction = type => {
  return dispatch => {
    dispatch({
      type: ADD_PRODUCT,
      payload: type,
    });
  };
};

export const removeProductAction = data => {
  return dispatch => {
    dispatch({
      type: REMOVE_PRODUCT,
      payload: data,
    });
  };
};
