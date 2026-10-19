import React, { useState } from 'react';
import { useStore } from '../redux/useStore';
import { useSiteData } from '../context/SiteDataContext';
import {
  Mail,
  Phone,
  ArrowRight,
  Leaf,
  Gift,
} from 'lucide-react';
import { useFooterAnimation } from '../hooks/useGSAPAnimations';
import defaultLogo from '../../public/images/Shudhham.png';

const currentYear = new Date().getFullYear();

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

const DEFAULT_LOGO = defaultLogo;

export const Footer = ({
  onSelectCategory,
  onOpenBucketBuilder,
}) => {
  const { showToast } = useStore();
  const { settings } = useSiteData();

  const {
    footerRef,
    stripRef,
    gridRef,
  } = useFooterAnimation();

  const [emailInput, setEmailInput] = useState('');

  const brandName =
    settings?.brandName || 'Golden Harvest';

  const brandTagline =
    settings?.brandTagline ||
    'Dry Fruits • Gift Buckets';

  const cleanPhone = (
    settings?.phoneNumber || '+91 91795 98991'
  ).replace(/\s+/g, '');

  const cleanWhatsApp = (
    settings?.whatsappNumber || '919179598991'
  ).replace(/\D/g, '');

  const storeEmail =
    settings?.email ||
    'care@goldenharvestdryfruits.com';

  const footerDescription =
    settings?.footerDescription ||
    'Thoughtfully selected dry fruits and gift buckets for everyday enjoyment and special moments.';

  const footerBottomText =
    settings?.footerBottomText ||
    'Goodness to enjoy. Gifts to remember.';

  const logoUrl = settings?.logoUrl
    ? settings.logoUrl.startsWith('http')
      ? settings.logoUrl
      : `${API_URL}${
          settings.logoUrl.startsWith('/')
            ? ''
            : '/'
        }${settings.logoUrl}`
    : DEFAULT_LOGO;

  const handleLogoError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = DEFAULT_LOGO;
  };

  const scrollToSection = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: 'smooth',
      });
  };

  const selectCategory = (category) => {
    onSelectCategory?.(category);
    scrollToSection('collection-section');
  };

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!emailInput.trim()) return;

    showToast(
      'Newsletter signup is not connected yet.',
      'error'
    );
  };

  return (
    <footer
      className="site-footer"
      ref={footerRef}
    >
      <div
        className="footer-top-strip"
        ref={stripRef}
      >
        <div className="section-container footer-strip-grid">
          <div className="strip-item">
            <span className="strip-icon">
              <Leaf size={20} />
            </span>

            <div>
              <strong>
                Everyday Goodness
              </strong>

              <span>
                Dry fruits for every occasion
              </span>
            </div>
          </div>

          <div className="strip-item">
            <span className="strip-icon">
              <Gift size={20} />
            </span>

            <div>
              <strong>
                Thoughtful Gifting
              </strong>

              <span>
                Gifts made personal
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-main-container section-container">
        <div
          className="footer-grid"
          ref={gridRef}
        >
          <div className="footer-col brand-col">
            <div className="brand-logo footer-logo">
              <div className="brand-icon-wrapper">
                <img
                  src={logoUrl}
                  alt={brandName}
                  className="brand-logo-img"
                  onError={handleLogoError}
                />
              </div>

              <div className="brand-text">
                <span className="brand-title">
                  {brandName.toUpperCase()}
                </span>

                <span className="brand-tagline">
                  {brandTagline}
                </span>
              </div>
            </div>

            <p className="footer-desc">
              {footerDescription}
            </p>

            <div className="footer-contact-info">
              <div className="contact-row">
                <Phone size={15} />

                <a
                  href={`tel:${cleanPhone}`}
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  {settings?.phoneNumber ||
                    '+91 91795 98991'}
                </a>
              </div>

              <div className="contact-row">
                <Mail size={15} />

                <a
                  href={`mailto:${storeEmail}`}
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  {storeEmail}
                </a>
              </div>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">
              Explore
            </h4>

            <ul className="footer-links-list">
              <li>
                <button
                  className="footer-link-btn"
                  onClick={() =>
                    selectCategory('all')
                  }
                >
                  All Products
                </button>
              </li>

              <li>
                <button
                  className="footer-link-btn"
                  onClick={() =>
                    selectCategory('nuts')
                  }
                >
                  Nuts & Dry Fruits
                </button>
              </li>

              <li>
                <button
                  className="footer-link-btn"
                  onClick={() =>
                    selectCategory('dates-figs')
                  }
                >
                  Dates & Figs
                </button>
              </li>

              <li>
                <button
                  className="footer-link-btn"
                  onClick={() =>
                    selectCategory('buckets')
                  }
                >
                  Gift Buckets
                </button>
              </li>

              <li>
                <button
                  className="footer-link-btn"
                  onClick={() => {
                    onOpenBucketBuilder?.();
                  }}
                >
                  Create Your Own Gift
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">
              Quick Links
            </h4>

            <ul className="footer-links-list">
              <li>
                <button
                  className="footer-link-btn"
                  onClick={() =>
                    scrollToSection(
                      'health-section'
                    )
                  }
                >
                  Our Approach
                </button>
              </li>

              <li>
                <button
                  className="footer-link-btn"
                  onClick={() =>
                    scrollToSection(
                      'reviews-section'
                    )
                  }
                >
                  Reviews & FAQs
                </button>
              </li>

              <li>
                <button
                  className="footer-link-btn"
                  onClick={() =>
                    scrollToSection(
                      'contact-section'
                    )
                  }
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-col newsletter-col">
            <h4 className="footer-heading">
              Stay Connected
            </h4>

            <p className="newsletter-text">
              Have a question or planning a
              special gift? Get in touch with us.
            </p>

            <a
              href={`https://wa.me/${cleanWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link-btn"
            >
              Chat on WhatsApp
              <ArrowRight size={15} />
            </a>

            <div className="payment-methods-wrapper">
              <span className="payment-label">
                Shop with confidence
              </span>

              <div className="payment-icons-row">
                <span className="payment-pill">
                  Quality
                </span>

                <span className="payment-pill">
                  Care
                </span>

                <span className="payment-pill">
                  Gifting
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>
            © {currentYear} {brandName}. All rights reserved.
          </p>

          <p className="made-with-love">
            {footerBottomText}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;