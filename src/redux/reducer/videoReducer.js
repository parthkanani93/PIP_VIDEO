import {CURRENT_TIME} from '../types';

const INITIAL_STATE = {
  currentTime: 0,
};

export default function videoReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CURRENT_TIME:
      return {
        ...state,
        currentTime: action.payload,
      };

    default:
      return state;
  }
}
