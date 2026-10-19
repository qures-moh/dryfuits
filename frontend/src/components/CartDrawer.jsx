import React, { useState } from 'react';
import { useStore } from '../redux/useStore';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Gift, Truck } from 'lucide-react';

export const CartDrawer = ({ onOpenBucketBuilder }) => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    shippingFee,
    isFreeShipping,
    freeShippingThreshold,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    formatPrice
  } = useStore();

  const [inputCoupon, setInputCoupon] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    applyCoupon(inputCoupon);
    setInputCoupon('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="cart-backdrop" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Cart Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title">
            <ShoppingBag size={22} className="text-gold" />
            <h3>Your Harvest Cart ({cartItems.length})</h3>
          </div>
          <button
            className="cart-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="shipping-progress-banner">
          <div className="shipping-progress-info">
            <Truck size={16} className="text-gold" />
            {isFreeShipping ? (
              <span className="shipping-unlocked-text">
                🎉 Congratulations! You qualify for <strong>FREE Express Shipping</strong>!
              </span>
            ) : (
              <span>
                Add <strong>{formatPrice(amountNeededForFreeShipping)}</strong> more for <strong>FREE Shipping</strong>!
              </span>
            )}
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${freeShippingProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Items List */}
        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <div className="empty-cart-view">
              <span className="empty-cart-emoji">🧺</span>
              <h4>Your Cart is Empty</h4>
              <p>Explore our premium dry fruits or create a bespoke festive gift bucket!</p>
              <div className="empty-cart-actions">
                <button
                  className="btn-primary"
                  onClick={() => setIsCartOpen(false)}
                >
                  Explore Collection
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setIsCartOpen(false);
                    if (onOpenBucketBuilder) onOpenBucketBuilder();
                  }}
                >
                  <Gift size={16} />
                  <span>Build Custom Bucket</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.key} className="cart-item-card">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-content">
                    <div className="cart-item-top">
                      <div>
                        <h4 className="cart-item-name">{item.name}</h4>
                        <span className="cart-item-spec">
                          {item.isCustomBucket ? 'Artisan Crafted' : item.weight}
                        </span>
                      </div>
                      <button
                        className="item-remove-btn"
                        onClick={() => removeFromCart(item.key)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Custom Bucket details pill if applicable */}
                    {item.isCustomBucket && item.fillers && (
                      <div className="custom-bucket-mini-details">
                        <span className="mini-details-label">Contents:</span>
                        <div className="mini-fillers-tags">
                          {item.fillers.map((f) => (
                            <span key={f.id} className="mini-filler-tag">
                              {f.icon} {f.name}
                            </span>
                          ))}
                        </div>
                        {item.giftMessage && (
                          <p className="mini-gift-note">
                            💌 "{item.giftMessage.substring(0, 45)}..."
                          </p>
                        )}
                      </div>
                    )}

                    <div className="cart-item-bottom">
                      {/* Quantity Stepper */}
                      <div className="item-quantity-stepper">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-item-price">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Area: Coupons, Summary, Checkout */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Promo Code Input & Badges */}
            <div className="promo-code-container">
              {appliedCoupon ? (
                <div className="applied-coupon-pill">
                  <div className="coupon-info">
                    <Tag size={14} />
                    <span>
                      <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.discountPercent}% OFF)
                    </span>
                  </div>
                  <button className="remove-coupon-btn" onClick={removeCoupon}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="coupon-form">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. DRYFRUIT15)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="coupon-input"
                  />
                  <button type="submit" className="coupon-apply-btn">
                    Apply
                  </button>
                </form>
              )}

              {/* Quick Coupon suggestions */}
              {!appliedCoupon && (
                <div className="quick-coupon-hints">
                  <span>Try: </span>
                  <button
                    className="quick-coupon-btn"
                    onClick={() => applyCoupon('DRYFRUIT15')}
                  >
                    DRYFRUIT15 (15% off)
                  </button>
                  <button
                    className="quick-coupon-btn"
                    onClick={() => applyCoupon('GOLDEN10')}
                  >
                    GOLDEN10 (10% off)
                  </button>
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="cart-financial-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="summary-row discount-row">
                  <span>Festive Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Estimated Express Shipping</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald">FREE</strong> : formatPrice(shippingFee)}</span>
              </div>
              <div className="summary-total-row">
                <span>Total Amount</span>
                <span className="total-price-large">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              className="btn-primary checkout-btn"
              onClick={handleProceedToCheckout}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <button
              className="continue-shopping-btn"
              onClick={() => setIsCartOpen(false)}
            >
              Or Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
