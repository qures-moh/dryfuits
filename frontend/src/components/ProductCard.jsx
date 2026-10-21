import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../redux/useStore';
import {
  Eye,
  Gift,
  ArrowUpRight,
} from 'lucide-react';

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  'https://dryfuits-backend.onrender.com';

const getProductImageUrl = (image) => {
  if (!image) {
    return '/images/bucket_hamper.jpg';
  }

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  if (image.startsWith('/uploads/')) {
    return `${BACKEND_URL}${image}`;
  }

  if (image.startsWith('uploads/')) {
    return `${BACKEND_URL}/${image}`;
  }

  if (image.startsWith('/images/')) {
    return image;
  }

  if (image.startsWith('images/')) {
    return `/${image}`;
  }

  return image;
};

export const ProductCard = ({ product }) => {
  const { formatPrice } = useStore();
  const navigate = useNavigate();
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(0);

  if (!product) return null;

  const weightOptions = product.weightOptions || [];

  const safeIndex = Math.min(
    selectedWeightIndex,
    Math.max(weightOptions.length - 1, 0)
  );

  const currentWeightOption = weightOptions[safeIndex];

  const prodId = product.id || product._id;

  const productImage = getProductImageUrl(product.image);

  const openProductPage = () => {
    navigate(`/product/${prodId}`);

    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  };

  const handleCardKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProductPage();
    }
  };

  return (
    <article
      className={`gh-product-card ${
        product.isBucket ? 'gh-product-card--bucket' : ''
      }`}
      onClick={openProductPage}
      onKeyDown={handleCardKeyDown}
      tabIndex={0}
      role="link"
      aria-label={`View details for ${product.name}`}
    >
      <div className="gh-product-card__image-box">
        <img
          src={productImage}
          alt={product.name}
          className="gh-product-card__image"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = '/images/bucket_hamper.jpg';
          }}
        />

        {product.badge && (
          <div className="gh-product-card__badge-wrap">
            <span
              className={`gh-product-card__badge ${
                product.badge === 'Sold out'
                  ? 'gh-product-card__badge--soldout'
                  : product.isBucket
                    ? 'gh-product-card__badge--bucket'
                    : 'gh-product-card__badge--best'
              }`}
            >
              {product.isBucket && (
                <Gift
                  size={12}
                  strokeWidth={2.2}
                />
              )}

              <span>{product.badge}</span>
            </span>
          </div>
        )}

        <div className="gh-product-card__quick-view">
          <button
            type="button"
            className="gh-product-card__quick-btn"
            onClick={(event) => {
              event.stopPropagation();
              openProductPage();
            }}
            aria-label={`Quick view ${product.name}`}
          >
            <Eye size={15} />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      <div className="gh-product-card__content">
        <span className="gh-product-card__brand">
          {product.brand || 'GOLDEN HARVEST'}
        </span>

        <h3 className="gh-product-card__title">
          {product.name}
        </h3>

        <div className="gh-product-card__price">
          <span className="gh-product-card__from">
            From
          </span>

          <span className="gh-product-card__amount">
            {formatPrice(
              currentWeightOption
                ? currentWeightOption.price
                : product.basePrice
            )}
          </span>

          {currentWeightOption?.weight && (
            <span className="gh-product-card__weight-label">
              ({currentWeightOption.weight})
            </span>
          )}
        </div>

        {weightOptions.length > 0 && (
          <div className="gh-product-card__weights">
            {weightOptions.map((option, index) => (
              <button
                key={`${option.weight}-${index}`}
                type="button"
                className={`gh-product-card__weight-btn ${
                  safeIndex === index
                    ? 'gh-product-card__weight-btn--active'
                    : ''
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedWeightIndex(index);
                }}
                aria-pressed={safeIndex === index}
              >
                {option.weight}
              </button>
            ))}
          </div>
        )}

        <div className="gh-product-card__footer">
          <button
            type="button"
            className="gh-product-card__details-btn"
            onClick={(event) => {
              event.stopPropagation();
              openProductPage();
            }}
            aria-label={`View details for ${product.name}`}
          >
            <span>View Details</span>
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;