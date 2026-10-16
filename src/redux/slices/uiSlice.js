import { createSlice } from '@reduxjs/toolkit';

const loadCurrencyFromStorage = () => {
  try {
    return localStorage.getItem('dryfruit_redux_currency') || 'INR';
  } catch {
    return 'INR';
  }
};

const initialState = {
  currency: loadCurrencyFromStorage(),
  toasts: []
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
      try {
        localStorage.setItem('dryfruit_redux_currency', action.payload);
      } catch (e) {
        console.error(e);
      }
    },
    addToast: (state, action) => {
      const { message, type = 'success' } = action.payload;
      state.toasts.push({
        id: Date.now() + Math.random(),
        message,
        type
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    }
  }
});

export const { setCurrency, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
