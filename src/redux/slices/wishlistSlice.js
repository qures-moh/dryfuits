import { createSlice } from '@reduxjs/toolkit';

const loadWishlistFromStorage = () => {
  try {
    const data = localStorage.getItem('dryfruit_redux_wishlist');
    return data ? JSON.parse(data) : ['prod-bucket-1', 'prod-almonds'];
  } catch {
    return ['prod-bucket-1', 'prod-almonds'];
  }
};

const initialState = {
  items: loadWishlistFromStorage()
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const productId = action.payload;
      if (state.items.includes(productId)) {
        state.items = state.items.filter((id) => id !== productId);
      } else {
        state.items.push(productId);
      }
      localStorage.setItem('dryfruit_redux_wishlist', JSON.stringify(state.items));
    }
  }
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
