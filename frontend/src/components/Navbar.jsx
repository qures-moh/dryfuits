import React, { useState, useEffect } from 'react';
import { useNavbarAnimation } from '../hooks/useGSAPAnimations';
import { useSiteData } from '../context/SiteDataContext';
import { createPortal } from 'react-dom';
import {
  Menu,
  X,
  Sparkles,
  MessageCircle,
  Phone,
  ArrowRight,
  Truck,
  ShieldCheck,
  Home,
  ShoppingBag,
  Star
} from 'lucide-react';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

const DEFAULT_LOGO = '/images/Shudhham.png';

export const Navbar = ({
  activeTab,
  setActiveTab,
  searchQuery = '',
  setSearchQuery,
  onOpenBucketBuilder,
  onSelectCategory,
  onNavigate
}) => {
  const { settings } = useSiteData();

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const {
    navRef,
    announcementRef
  } = useNavbarAnimation();

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

  useEffect(() => {
    document.body.style.overflow =
      isMobileMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const scrollToContact = () => {
    const section = document.getElementById(
      'contact-section'
    );

    if (!section) return;

    const navbar = document.querySelector(
      '.gh-navbar'
    );

    const navbarHeight = navbar
      ? navbar.getBoundingClientRect().height
      : 90;

    const sectionTop =
      section.getBoundingClientRect().top +
      window.scrollY;

    window.scrollTo({
      top: sectionTop - navbarHeight - 20,
      behavior: 'smooth'
    });
  };

  const handleNavClick = (tabId) => {
    setIsMobileMenuOpen(false);

    if (tabId === 'contact') {
      setActiveTab('contact');
      scrollToContact();
      return;
    }

    if (tabId === 'builder') {
      setActiveTab('builder');
      onOpenBucketBuilder?.();
      return;
    }

    if (tabId === 'collection') {
      onSelectCategory?.('all');
    }

    if (typeof onNavigate === 'function') {
      onNavigate(tabId);
      return;
    }

    setActiveTab(tabId);

    const sectionIds = {
      collection: 'collection-section',
      health: 'health-section',
      reviews: 'reviews-section'
    };

    if (tabId === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      return;
    }

    const section = document.getElementById(
      sectionIds[tabId]
    );

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const cleanPhone = (
    settings?.phoneNumber ||
    '+91 91795 98991'
  ).replace(/\s+/g, '');

  return (
    <>
      <div
        className="announcement-bar"
        ref={announcementRef}
      >
        <div className="announcement-content">
          <span className="announcement-item">
            <Sparkles size={14} />

            <span>
              {settings?.announcementText ||
                'FESTIVE HARVEST: Direct Farm-Fresh Dry Fruits & Handcrafted Wooden Buckets'}
            </span>
          </span>

          <span className="announcement-separator">
            •
          </span>

          <span className="announcement-item hide-mobile">
            <Truck size={14} />

            <span>
              {settings?.announcementDelivery ||
                'Free Nitrogen-Sealed Express Delivery over Rs. 999'}
            </span>
          </span>

          <span className="announcement-separator hide-mobile">
            •
          </span>

          <span className="announcement-item hide-mobile">
            <MessageCircle size={14} />

            <span>
              {settings?.announcementWhatsApp ||
                `Instant WhatsApp Orders: ${
                  settings?.phoneNumber ||
                  '+91 91795 98991'
                }`}
            </span>
          </span>
        </div>
      </div>

      <header
        className="gh-navbar"
        ref={navRef}
      >
        <div className="gh-navbar-wrapper">
          <div className="gh-navbar-container">

            <div
              className="gh-navbar-logo"
              onClick={() =>
                handleNavClick('home')
              }
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' ||
                  event.key === ' '
                ) {
                  event.preventDefault();
                  handleNavClick('home');
                }
              }}
            >
              <div className="gh-desktop-logo-box">
                <img
                  src={logoUrl}
                  alt={
                    settings?.brandName ||
                    'Golden Harvest'
                  }
                  className="gh-desktop-logo-image"
                  onError={handleLogoError}
                />
              </div>
            </div>

            <nav
              className="gh-desktop-navigation"
              aria-label="Main navigation"
            >
              <button
                type="button"
                className={`gh-nav-link ${
                  activeTab === 'home'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleNavClick('home')
                }
              >
                Home
              </button>

              <button
                type="button"
                className={`gh-nav-link ${
                  activeTab === 'collection'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleNavClick('collection')
                }
              >
                Collection
              </button>

              <button
                type="button"
                className={`gh-nav-link ${
                  activeTab === 'builder'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleNavClick('builder')
                }
              >
                Custom Studio
              </button>

              <button
                type="button"
                className={`gh-nav-link ${
                  activeTab === 'health'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleNavClick('health')
                }
              >
                Health &amp; Origin
              </button>

              <button
                type="button"
                className={`gh-nav-link ${
                  activeTab === 'reviews'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleNavClick('reviews')
                }
              >
                Reviews
              </button>

              <button
                type="button"
                className={`gh-nav-link ${
                  activeTab === 'contact'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleNavClick('contact')
                }
              >
                Contact
              </button>
            </nav>

            <div className="gh-desktop-actions">
              <a
                href={`tel:${cleanPhone}`}
                className="gh-call-button"
                title={`Call Directly: ${
                  settings?.phoneNumber ||
                  '+91 91795 98991'
                }`}
                aria-label="Call Directly"
              >
                <Phone size={17} />
              </a>

              <button
                type="button"
                className="gh-enquire-button"
                onClick={() =>
                  handleNavClick('contact')
                }
              >
                <span>Enquire</span>
                <ArrowRight size={15} />
              </button>
            </div>

            <button
              type="button"
              className="gh-mobile-menu-button"
              onClick={() =>
                setIsMobileMenuOpen(
                  (previous) => !previous
                )
              }
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>

          </div>
        </div>
      </header>

      {isMobileMenuOpen &&
        createPortal(
          <div
            className="mobile-menu-overlay"
            onClick={() =>
              setIsMobileMenuOpen(false)
            }
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div
              className="mobile-menu-panel"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="mobile-menu-header">

                <div
                  className="gh-mobile-drawer-logo"
                  onClick={() =>
                    handleNavClick('home')
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter' ||
                      event.key === ' '
                    ) {
                      event.preventDefault();
                      handleNavClick('home');
                    }
                  }}
                >
                  <div className="gh-mobile-drawer-logo-box">
                    <img
                      src={logoUrl}
                      alt={
                        settings?.brandName ||
                        'Golden Harvest'
                      }
                      className="gh-mobile-drawer-logo-image"
                      onError={handleLogoError}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="mobile-drawer-close-btn"
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                  aria-label="Close navigation drawer"
                >
                  <X size={20} />
                </button>

              </div>

              <nav
                className="mobile-nav-list"
                aria-label="Mobile navigation"
              >
                <button
                  type="button"
                  className={`mobile-nav-item ${
                    activeTab === 'home'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    handleNavClick('home')
                  }
                >
                  <Home
                    size={19}
                    className="mobile-nav-icon"
                  />
                  <span>Home</span>
                </button>

                <button
                  type="button"
                  className={`mobile-nav-item ${
                    activeTab === 'collection'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    handleNavClick('collection')
                  }
                >
                  <ShoppingBag
                    size={19}
                    className="mobile-nav-icon"
                  />
                  <span>Collection</span>
                </button>

                <button
                  type="button"
                  className={`mobile-nav-item ${
                    activeTab === 'builder'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    handleNavClick('builder')
                  }
                >
                  <Sparkles
                    size={19}
                    className="mobile-nav-icon"
                  />
                  <span>Custom Studio</span>
                </button>

                <button
                  type="button"
                  className={`mobile-nav-item ${
                    activeTab === 'health'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    handleNavClick('health')
                  }
                >
                  <ShieldCheck
                    size={19}
                    className="mobile-nav-icon"
                  />
                  <span>
                    Health &amp; Origin
                  </span>
                </button>

                <button
                  type="button"
                  className={`mobile-nav-item ${
                    activeTab === 'reviews'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    handleNavClick('reviews')
                  }
                >
                  <Star
                    size={19}
                    className="mobile-nav-icon"
                  />
                  <span>Reviews</span>
                </button>

                <button
                  type="button"
                  className={`mobile-nav-item ${
                    activeTab === 'contact'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    handleNavClick('contact')
                  }
                >
                  <Phone
                    size={19}
                    className="mobile-nav-icon"
                  />
                  <span>Contact</span>
                </button>
              </nav>

              <div className="mobile-drawer-footer">
                <div className="mobile-drawer-perk">
                  <Truck size={14} />
                  <span>
                    Pan-India Express Doorstep
                    Shipping
                  </span>
                </div>

                <div className="mobile-drawer-perk">
                  <ShieldCheck size={14} />
                  <span>
                    100% Farm Fresh Harvest
                    Guarantee
                  </span>
                </div>
              </div>

            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default Navbar;