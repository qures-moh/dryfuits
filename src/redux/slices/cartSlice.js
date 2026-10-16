import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const data = localStorage.getItem('dryfruit_redux_cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const COUPONS = {
  DRYFRUIT15: { discountPercent: 15, label: '15% Off Your Entire Harvest' },
  GOLDEN10: { discountPercent: 10, label: '10% Welcome Discount' },
  FREESHIP: { freeShipping: true, discountPercent: 0, label: 'Free Express Shipping' }
};

const initialState = {
  cartItems: loadCartFromStorage(),
  appliedCoupon: null,
  isCartOpen: false,
  isCheckoutOpen: false,
  freeShippingThreshold: 999.0 // Free shipping over ₹999
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, selectedWeight, quantity = 1 } = action.payload;
      const weightObj = selectedWeight || product.weightOptions?.[0] || { weight: '500gm', price: product.basePrice };
      const itemKey = `${product.id}-${weightObj.weight}`;

      const existingIndex = state.cartItems.findIndex((item) => item.key === itemKey);
      if (existingIndex >= 0) {
        state.cartItems[existingIndex].quantity += quantity;
      } else {
        state.cartItems.push({
          key: itemKey,
          productId: product.id,
          name: product.name,
          brand: product.brand || 'GOLDEN HARVEST',
          weight: weightObj.weight,
          price: weightObj.price,
          image: product.image,
          quantity,
          isBucket: product.isBucket || false
        });
      }
      localStorage.setItem('dryfruit_redux_cart', JSON.stringify(state.cartItems));
    },

    addCustomBucketToCart: (state, action) => {
      const customBucket = action.payload;
      const customKey = `custom-bucket-${Date.now()}`;
      state.cartItems.push({
        key: customKey,
        isCustomBucket: true,
        name: customBucket.name || 'Custom Artisan Dry Fruit Bucket',
        brand: 'GOLDEN HARVEST',
        container: customBucket.container,
        fillers: customBucket.fillers,
        ribbon: customBucket.ribbon,
        giftMessage: customBucket.giftMessage,
        weight: customBucket.totalWeight || '750g Custom',
        price: customBucket.totalPrice,
        image: customBucket.container.image,
        quantity: 1
      });
      state.isCartOpen = true;
      localStorage.setItem('dryfruit_redux_cart', JSON.stringify(state.cartItems));
    },

    updateQuantity: (state, action) => {
      const { key, quantity } = action.payload;
      if (quantity <= 0) {
        state.cartItems = state.cartItems.filter((item) => item.key !== key);
      } else {
        const item = state.cartItems.find((i) => i.key === key);
        if (item) {
          item.quantity = quantity;
        }
      }
      localStorage.setItem('dryfruit_redux_cart', JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      const key = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.key !== key);
      localStorage.setItem('dryfruit_redux_cart', JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.appliedCoupon = null;
      localStorage.removeItem('dryfruit_redux_cart');
    },

    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    },

    setCheckoutOpen: (state, action) => {
      state.isCheckoutOpen = action.payload;
    },

    applyCoupon: (state, action) => {
      const code = action.payload.trim().toUpperCase();
      if (COUPONS[code]) {
        state.appliedCoupon = { code, ...COUPONS[code] };
      }
    },

    removeCoupon: (state) => {
      state.appliedCoupon = null;
    }
  }
});

export const {
  addToCart,
  addCustomBucketToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  setCartOpen,
  setCheckoutOpen,
  applyCoupon,
  removeCoupon
} = cartSlice.actions;

export default cartSlice.reducer;
