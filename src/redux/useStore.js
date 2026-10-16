import { useSelector, useDispatch } from 'react-redux';
import {
  addToCart as addToCartAction,
  addCustomBucketToCart as addCustomBucketAction,
  updateQuantity as updateQuantityAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
  setCartOpen,
  setCheckoutOpen,
  applyCoupon as applyCouponAction,
  removeCoupon as removeCouponAction
} from './slices/cartSlice';
import { toggleWishlist as toggleWishlistAction } from './slices/wishlistSlice';
import { addToast, removeToast } from './slices/uiSlice';

export const useStore = () => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const appliedCoupon = useSelector((state) => state.cart.appliedCoupon);
  const isCartOpen = useSelector((state) => state.cart.isCartOpen);
  const isCheckoutOpen = useSelector((state) => state.cart.isCheckoutOpen);
  const freeShippingThreshold = useSelector((state) => state.cart.freeShippingThreshold) || 999;

  const wishlist = useSelector((state) => state.wishlist.items);
  const toasts = useSelector((state) => state.ui.toasts);

  const showToast = (message, type = 'success') => {
    dispatch(addToast({ message, type }));
  };

  const handleRemoveToast = (id) => {
    dispatch(removeToast(id));
  };

  const addToCart = (product, selectedWeight = null, quantity = 1) => {
    dispatch(addToCartAction({ product, selectedWeight, quantity }));
    const weightLabel = selectedWeight?.weight || product.weightOptions?.[0]?.weight || '500gm';
    showToast(`Added ${product.name} (${weightLabel}) to Cart! 🌰`);
  };

  const addCustomBucketToCart = (customBucket) => {
    dispatch(addCustomBucketAction(customBucket));
    showToast('Custom Festive Bucket added to Cart! 🎁');
  };

  const updateQuantity = (key, quantity) => {
    dispatch(updateQuantityAction({ key, quantity }));
  };

  const removeFromCart = (key) => {
    dispatch(removeFromCartAction(key));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  const setIsCartOpen = (isOpen) => {
    dispatch(setCartOpen(isOpen));
  };

  const setIsCheckoutOpen = (isOpen) => {
    dispatch(setCheckoutOpen(isOpen));
  };

  const toggleWishlist = (productId) => {
    const isCurrentlyIn = wishlist.includes(productId);
    dispatch(toggleWishlistAction(productId));
    if (isCurrentlyIn) {
      showToast('Removed from Wishlist', 'info');
    } else {
      showToast('Saved to Wishlist! ❤️');
    }
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (['DRYFRUIT15', 'GOLDEN10', 'FREESHIP'].includes(cleanCode)) {
      dispatch(applyCouponAction(cleanCode));
      showToast(`Coupon "${cleanCode}" applied! 🎉`);
      return { success: true };
    } else {
      showToast('Invalid coupon. Try DRYFRUIT15 or GOLDEN10', 'error');
      return { success: false };
    }
  };

  const removeCoupon = () => {
    dispatch(removeCouponAction());
    showToast('Coupon removed', 'info');
  };

  // Calculations in INR
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon && appliedCoupon.discountPercent > 0) {
    discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
  }

  const isFreeShipping = subtotal >= freeShippingThreshold || (appliedCoupon && appliedCoupon.freeShipping);
  const shippingFee = cartItems.length === 0 ? 0 : isFreeShipping ? 0 : 70;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Exclusively Indian Currency (Rs. / ₹) format
  const formatPrice = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return 'Rs. 0.00';
    return `Rs. ${Math.round(amount).toLocaleString('en-IN')}.00`;
  };

  return {
    cartItems,
    wishlist,
    isCartOpen,
    setIsCartOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    addToCart,
    addCustomBucketToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    subtotal,
    discountAmount,
    shippingFee,
    isFreeShipping,
    freeShippingThreshold,
    grandTotal,
    cartCount,
    currency: 'INR',
    formatPrice,
    toasts,
    showToast,
    removeToast: handleRemoveToast
  };
};
