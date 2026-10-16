
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../redux/useStore';
import {
  Eye,
  Gift,
  ArrowUpRight,
} from 'lucide-react';

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
      className={`clean-product-card ${
        product.isBucket ? 'bucket-highlight-card' : ''
      }`}
      onClick={openProductPage}
      onKeyDown={handleCardKeyDown}
      tabIndex={0}
      role="link"
      aria-label={`View details for ${product.name}`}
    >
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="clean-product-img"
          loading="lazy"
        />

        <div className="card-top-badges">
          {product.badge && (
            <span
              className={`clean-badge ${
                product.badge === 'Sold out'
                  ? 'badge-soldout'
                  : product.isBucket
                    ? 'badge-bucket'
                    : 'badge-bestseller'
              }`}
            >
              {product.isBucket && (
                <Gift size={12} className="mr-1" />
              )}
              {product.badge}
            </span>
          )}
        </div>

        <div className="image-hover-action">
          <button
            type="button"
            className="clean-quick-view-btn"
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

      <div className="clean-product-info">
        <span className="product-brand-tag">
          {product.brand || 'GOLDEN HARVEST'}
        </span>

        <h3 className="clean-product-title">
          {product.name}
        </h3>

        <div className="clean-price-row">
          <span className="price-prefix">From</span>

          <span className="clean-price-val">
            {formatPrice(currentWeightOption ? currentWeightOption.price : product.basePrice)}
          </span>

          {currentWeightOption?.weight && (
            <span className="clean-serves-tag">
              ({currentWeightOption.weight})
            </span>
          )}
        </div>

        {weightOptions.length > 0 && (
          <div className="clean-weight-pills">
            {weightOptions.map((option, index) => (
              <button
                key={`${option.weight}-${index}`}
                type="button"
                className={`clean-weight-pill ${
                  safeIndex === index ? 'active' : ''
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

        <div className="landing-card-actions">
          <button
            type="button"
            className="card-details-btn"
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
