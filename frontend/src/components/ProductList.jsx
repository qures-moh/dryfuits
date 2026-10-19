import React, { useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { useSiteData } from '../context/SiteDataContext';
import {
  Gift,
  Sparkles,
  X,
  MessageCircle,
  ArrowRight,
  Nut,
  Search,
  Sun,
  Heart,
  Flame,
} from 'lucide-react';
import { useProductGridAnimation } from '../hooks/useGSAPAnimations';

const renderCategoryIcon = (iconName, categoryId) => {
  const key = `${iconName || ''} ${categoryId || ''}`.toLowerCase();

  if (key.includes('gift') || key.includes('bucket')) {
    return <Gift size={14} className="pill-icon" />;
  }

  if (key.includes('nut')) {
    return <Nut size={14} className="pill-icon" />;
  }

  if (key.includes('sun') || key.includes('date') || key.includes('fig')) {
    return <Sun size={14} className="pill-icon" />;
  }

  if (key.includes('heart') || key.includes('berr') || key.includes('raisin')) {
    return <Heart size={14} className="pill-icon" />;
  }

  if (key.includes('flame') || key.includes('spice') || key.includes('seed')) {
    return <Flame size={14} className="pill-icon" />;
  }

  return <Sparkles size={14} className="pill-icon" />;
};

export const ProductList = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  onQuickView,
  onOpenBucketBuilder,
}) => {
  const { products, categories, settings, loading } = useSiteData();

  const {
    gridRef,
    bannerRef,
    headerRef,
    pillsRef,
    calloutRef,
  } = useProductGridAnimation();

  const cleanWhatsApp = (
    settings?.whatsappNumber || '919179598991'
  ).replace(/\D/g, '');

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const prodCategory =
        typeof product.category === 'object' &&
        product.category?.categoryId
          ? product.category.categoryId
          : String(product.category || '');

      const matchesCategory =
        selectedCategory === 'all' ||
        prodCategory === selectedCategory;

      if (!matchesCategory) return false;

      if (!query) return true;

      const name = product.name?.toLowerCase() || '';
      const description = product.description?.toLowerCase() || '';
      const shortDesc = product.shortDesc?.toLowerCase() || '';

      return (
        name.includes(query) ||
        description.includes(query) ||
        shortDesc.includes(query)
      );
    });
  }, [products, selectedCategory, searchQuery]);

  const handleContact = () => {
    document
      .getElementById('contact-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReset = () => {
    onSelectCategory('all');
    setSearchQuery('');
  };

  return (
    <section
      id="collection-section"
      className="landing-collection-section"
    >
      <div className="section-container">
        <div
          className="section-header text-center"
          ref={headerRef}
        >
          <div className="section-subtitle-wrap justify-center">
            <Sparkles size={15} className="text-gold" />

            <span className="section-subtitle">
              {settings?.collectionSubtitle || 'THE COLLECTION'}
            </span>
          </div>

          <h2 className="section-title">
            {settings?.collectionTitle || 'Goodness Worth Sharing'}
          </h2>

          <p className="section-desc max-w-2xl mx-auto">
            {settings?.collectionDescription ||
              'Explore our selection of dry fruits and thoughtfully presented gift buckets for everyday moments and special occasions.'}
          </p>
        </div>

        <div
          id="buckets-section"
          className="gh-bucket-banner"
          ref={bannerRef}
        >
          <div className="gh-bucket-banner-text">
            <span className="gh-banner-tag">
              <Gift size={14} />
              THOUGHTFUL GIFTING
            </span>

            <h3 className="gh-banner-title">
              {settings?.bucketBannerTitle || 'A Gift Made Personal'}
            </h3>

            <p className="gh-banner-sub">
              {settings?.bucketBannerDescription ||
                'Create a gift bucket with your preferred selections and make your next occasion more meaningful.'}
            </p>

            <div className="gh-banner-actions">
              <button
                type="button"
                className="gh-banner-primary"
                onClick={onOpenBucketBuilder}
              >
                <Sparkles size={15} />

                <span>Create Your Bucket</span>

                <ArrowRight size={15} />
              </button>

              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  `Hi ${
                    settings?.brandName || 'Golden Harvest'
                  }! I'm interested in dry fruit gift buckets.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="gh-banner-secondary"
              >
                <MessageCircle size={15} />

                <span>Ask on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="gh-bucket-image-wrap">
            <img
              src={
                settings?.bucketBannerImage ||
                '/images/bucket_hamper.jpg'
              }
              alt={`${
                settings?.brandName || 'Golden Harvest'
              } dry fruit gift bucket`}
              className="gh-bucket-image"
              loading="lazy"
            />
          </div>
        </div>

        <div
          className="landing-category-pills-bar"
          ref={pillsRef}
        >
          <div className="category-pills-scroll">
            {categories.map((cat) => {
              const catId = cat.categoryId || cat.id;
              const isActive = selectedCategory === catId;

              return (
                <button
                  key={catId}
                  type="button"
                  className={`landing-cat-pill ${
                    isActive ? 'active' : ''
                  }`}
                  onClick={() => onSelectCategory(catId)}
                  aria-pressed={isActive}
                >
                  {renderCategoryIcon(cat.icon, catId)}

                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {searchQuery.trim() && (
          <div className="clean-search-pill-bar">
            <span>
              <Search size={14} />

              Results for{' '}

              <strong>
                "{searchQuery.trim()}"
              </strong>
            </span>

            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="clear-pill-btn"
            >
              <X size={14} />

              <span>Clear</span>
            </button>
          </div>
        )}

        {loading && filteredProducts.length === 0 ? (
          <div className="clean-loading-state text-center py-12">
            <div className="spinner-border text-gold inline-block mb-3" />

            <p>
              Loading fresh harvests from our store...
            </p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="collection-results-info">
              <span>
                {filteredProducts.length}{' '}
                {filteredProducts.length === 1
                  ? 'product'
                  : 'products'}
              </span>
            </div>

            <div
              className="clean-products-grid"
              ref={gridRef}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="clean-empty-state">
            <span className="clean-empty-icon">
              <Nut size={28} />
            </span>

            <h3>
              {searchQuery.trim()
                ? `No products found for "${searchQuery.trim()}"`
                : 'No products in this category yet'}
            </h3>

            <p>
              Try another search or explore the full collection.
            </p>

            <button
              type="button"
              className="clean-reset-btn"
              onClick={handleReset}
            >
              View Full Collection

              <ArrowRight size={15} />
            </button>
          </div>
        )}

        <div
          className="collection-bottom-callout"
          ref={calloutRef}
        >
          <div className="bottom-callout-content">
            <h3>
              Planning a Special Gift?
            </h3>

            <p>
              Get in touch for personal gifting, celebrations,
              and bulk order enquiries.
            </p>
          </div>

          <div className="bottom-callout-actions">
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                `Hi ${
                  settings?.brandName || 'Golden Harvest'
                }! I'd like to ask about bulk gifting.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <MessageCircle size={16} />

              <span>Bulk Gifting</span>
            </a>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleContact}
            >
              <span>Contact Us</span>

              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductList;