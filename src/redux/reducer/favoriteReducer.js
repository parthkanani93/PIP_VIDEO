import {ADD_PRODUCT, REMOVE_PRODUCT} from '../types';

const INITIAL_STATE = [];

export default function favoriteReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD_PRODUCT:
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? {...item, quantity: action.payload.quantity}
            : item,
        );
      }
      return [...state, {...action.payload}];

    case REMOVE_PRODUCT:
      return state.filter(item => item.id !== action.payload);

    default:
      return state;
  }
}
