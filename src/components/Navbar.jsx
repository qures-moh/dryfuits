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
  Search,
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

  const handleNavClick = (tabId) => {
    setIsMobileMenuOpen(false);

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
      reviews: 'reviews-section',
      contact: 'contact-section'
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

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    setIsMobileMenuOpen(false);

    if (typeof onNavigate === 'function') {
      onNavigate('collection');
      return;
    }

    setActiveTab('collection');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const section =
          document.getElementById(
            'collection-section'
          );

        if (section) {
          section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  };

  const cleanPhone = (
    settings?.phoneNumber ||
    '+91 91795 98991'
  ).replace(/\s+/g, '');

  const cleanWhatsApp = (
    settings?.whatsappNumber ||
    '919179598991'
  ).replace(/\D/g, '');

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
        className="site-header"
        ref={navRef}
      >
        <div className="navbar-pill-wrapper">
          <div className="header-container">

            <button
              type="button"
              className="mobile-toggle-btn"
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

            <div
              className="brand-logo navbar-brand-logo"
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
              <div className="brand-icon-wrapper navbar-logo-wrapper">
                <img
                  src={logoUrl}
                  alt={
                    settings?.brandName ||
                    'Golden Harvest'
                  }
                  className="brand-logo-img navbar-logo-img"
                  onError={handleLogoError}
                />
              </div>
            </div>

            <nav
              className="desktop-nav"
              aria-label="Main navigation"
            >
              <button
                type="button"
                className={`nav-link ${
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
                className={`nav-link ${
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
                className={`nav-link ${
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
                className={`nav-link ${
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
                className={`nav-link ${
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
                className={`nav-link ${
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

            <div className="header-actions">
              <a
                href={`tel:${cleanPhone}`}
                className="nav-action-icon-btn"
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
                className="nav-primary-pill-btn"
                onClick={() =>
                  handleNavClick('contact')
                }
              >
                <span>Enquire</span>
                <ArrowRight size={15} />
              </button>
            </div>
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
            aria-modal="true"
            role="dialog"
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
                  className="brand-logo navbar-brand-logo"
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
                  <div className="brand-icon-wrapper navbar-logo-wrapper">
                    <img
                      src={logoUrl}
                      alt={
                        settings?.brandName ||
                        'Golden Harvest'
                      }
                      className="brand-logo-img navbar-logo-img"
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

              <div className="mobile-drawer-search">
                <form
                  onSubmit={handleSearchSubmit}
                  className="mobile-search-form"
                >
                  <div className="mobile-search-wrapper">
                    <Search
                      size={17}
                      className="mobile-search-icon"
                    />

                    <input
                      type="text"
                      className="mobile-search-input"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery?.(
                          event.target.value
                        )
                      }
                    />

                    {searchQuery && (
                      <button
                        type="button"
                        className="mobile-search-clear-btn"
                        onClick={() =>
                          setSearchQuery?.('')
                        }
                        aria-label="Clear search query"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </form>
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
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                    `Hello ${
                      settings?.brandName ||
                      'Golden Harvest'
                    }! I would like to order fresh dry fruits.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-drawer-whatsapp-btn"
                >
                  <MessageCircle size={18} />
                  <span>
                    Enquiry on WhatsApp
                  </span>
                </a>

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