import {CURRENT_TIME} from '../types';

export const changeCurrentTime = time => {
  return dispatch => {
    dispatch({
      type: CURRENT_TIME,
      payload: time,
    });
  };
};
