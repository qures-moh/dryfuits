import React, { useState } from 'react';
import { useStore } from '../redux/useStore';
import confetti from 'canvas-confetti';
import { X, CheckCircle, ShieldCheck, Truck, CreditCard, Banknote, Smartphone, ArrowRight, Lock } from 'lucide-react';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const { cartItems, clearCart, subtotal, discountAmount, shippingFee, grandTotal, formatPrice } = useStore();

  const [formData, setFormData] = useState({
    fullName: 'Arjun Verma',
    email: 'arjun.verma@example.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Royal Palms Residency, MG Road',
    city: 'Mumbai',
    postalCode: '400001',
    paymentMethod: 'upi',
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvv: '•••'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `GH-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedOrderId(orderId);
      setIsSubmitting(false);
      setOrderConfirmed(true);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error(err);
      }

      clearCart();
    }, 1200);
  };

  const handleCloseModal = () => {
    setOrderConfirmed(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleCloseModal} role="dialog" aria-modal="true">
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleCloseModal} aria-label="Close checkout">
          <X size={20} />
        </button>

        {orderConfirmed ? (
         
          <div className="order-success-view">
            <div className="success-icon-wrap">
              <CheckCircle size={56} className="text-emerald" />
            </div>
            <span className="success-order-tag">ORDER CONFIRMED</span>
            <h2 className="success-headline">Thank You for Choosing Golden Harvest!</h2>
            <p className="success-subtitle">
              Your royal dry fruit package has been scheduled for freshly packed dispatch.
            </p>

            <div className="order-receipt-card">
              <div className="receipt-row">
                <span>Order Reference:</span>
                <strong>{confirmedOrderId}</strong>
              </div>
              <div className="receipt-row">
                <span>Delivery Recipient:</span>
                <strong>{formData.fullName}</strong>
              </div>
              <div className="receipt-row">
                <span>Delivery Destination:</span>
                <strong>{formData.address}, {formData.city}</strong>
              </div>
              <div className="receipt-row">
                <span>Estimated Arrival:</span>
                <strong className="text-emerald">Within 2 - 3 Business Days</strong>
              </div>
              <div className="receipt-row">
                <span>Payment Method:</span>
                <strong style={{ textTransform: 'uppercase' }}>{formData.paymentMethod}</strong>
              </div>
              <div className="receipt-total-row">
                <span>Total Amount Paid:</span>
                <span className="receipt-total-val">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="success-badges">
              <div className="success-badge">
                <Truck size={16} />
                <span>Tracking SMS Sent to {formData.phone}</span>
              </div>
              <div className="success-badge">
                <ShieldCheck size={16} />
                <span>Freshness Insured & Nitrogen Flushed</span>
              </div>
            </div>

            <button className="btn-primary success-home-btn" onClick={handleCloseModal}>
              Continue Exploring The Store
            </button>
          </div>
        ) : (
          /* Checkout Form View */
          <div className="checkout-form-container">
            <div className="checkout-header">
              <div className="checkout-header-title">
                <Lock size={20} className="text-gold" />
                <h2>Secure Harvest Checkout</h2>
              </div>
              <p className="checkout-sub">Encrypted 256-bit checkout with doorstep freshness guarantee</p>
            </div>

            <form onSubmit={handlePlaceOrder} className="checkout-grid">
              {/* Left Column: Delivery & Payment Details */}
              <div className="checkout-inputs-col">
                <h3 className="checkout-col-heading">1. Delivery Address</h3>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address (For Invoicing) *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="yourname@gmail.com"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Street Address & Landmark *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Apartment, suite, street"
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label>Postal / PIN Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <h3 className="checkout-col-heading mt-4">2. Payment Method</h3>
                <div className="payment-options-grid">
                  <label className={`payment-method-card ${formData.paymentMethod === 'upi' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleChange}
                    />
                    <Smartphone size={20} className="payment-icon" />
                    <div>
                      <strong>Instant UPI / QR</strong>
                      <span>GPay, PhonePe, Paytm, BHIM</span>
                    </div>
                  </label>

                  <label className={`payment-method-card ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                    />
                    <CreditCard size={20} className="payment-icon" />
                    <div>
                      <strong>Credit / Debit Card</strong>
                      <span>Visa, Mastercard, RuPay, Amex</span>
                    </div>
                  </label>

                  <label className={`payment-method-card ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                    />
                    <Banknote size={20} className="payment-icon" />
                    <div>
                      <strong>Pay on Delivery</strong>
                      <span>Cash or UPI upon delivery</span>
                    </div>
                  </label>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="card-input-box">
                    <div className="form-group">
                      <label>Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label>Expiry</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group flex-1">
                        <label>CVV</label>
                        <input
                          type="password"
                          name="cardCvv"
                          value={formData.cardCvv}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Order Summary & Place Order */}
              <div className="checkout-summary-col">
                <div className="checkout-order-card">
                  <h3 className="checkout-summary-title">Harvest Order Summary</h3>

                  <div className="checkout-items-preview">
                    {cartItems.map((item) => (
                      <div key={item.key} className="checkout-item-line">
                        <img src={item.image} alt={item.name} className="checkout-thumb" />
                        <div className="checkout-item-details">
                          <span className="checkout-item-name">{item.name}</span>
                          <span className="checkout-item-qty">
                            Qty: {item.quantity} × {item.weight}
                          </span>
                        </div>
                        <span className="checkout-item-price">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="checkout-totals-block">
                    <div className="checkout-total-row">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="checkout-total-row text-emerald">
                        <span>Festive Discount</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="checkout-total-row">
                      <span>Express Shipping</span>
                      <span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
                    </div>
                    <div className="checkout-grand-total-row">
                      <span>Grand Total</span>
                      <span className="grand-total-val">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>

                  <div className="checkout-security-notice">
                    <ShieldCheck size={18} className="text-emerald" />
                    <span>Your order is backed by our 100% Purity & Crispness Guarantee.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary place-order-btn"
                  >
                    {isSubmitting ? (
                      <span>Placing Your Harvest Order...</span>
                    ) : (
                      <>
                        <span>Place Order • {formatPrice(grandTotal)}</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
