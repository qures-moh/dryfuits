
import React, { useState } from "react";
import {
  ArrowLeft,
  Check,
  Gift,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { useStore } from "../redux/useStore";
import { useSiteData } from "../context/SiteDataContext";

export const ProductDetailsModal = ({ product, onClose }) => {
  const { settings } = useSiteData();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  const { formatPrice } = useStore();

  if (!product) return null;

  const galleryImages =
    product.gallery?.length > 0
      ? product.gallery
      : [product.image].filter(Boolean);

  const weightOptions = product.weightOptions || [];
  const currentWeight =
    weightOptions[selectedWeightIndex] ||
    weightOptions[0] || {
      label: "Standard Pack",
      weight: "500gm",
      price: product.basePrice || 0,
      serves: "Standard",
    };

  const currentPrice = currentWeight.price;
  const rating = Number(product.rating);
  const hasRating = Number.isFinite(rating) && rating > 0;
  const brandName = settings?.brandName || "Golden Harvest";
  const cleanWhatsApp = (settings?.whatsappNumber || "919179598991").replace(/\D/g, "");

  const handleOrderWhatsApp = () => {
    const message = [
      `Hello ${brandName}!`,
      "",
      "I would like to enquire about your product.",
      "",
      `Product: ${product.name}`,
      `Pack Size: ${currentWeight.weight}`,
      `Price: ${formatPrice(currentPrice)}`,
      "",
      "Please confirm availability and delivery details.",
    ].join("\n");

    const url = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleInquire = () => {
    onClose?.();

    window.setTimeout(() => {
      document
        .getElementById("contact-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <main className="product-details-page">
      <div className="product-details-container">
        <button
          type="button"
          className="product-back-btn"
          onClick={onClose}
        >
          <ArrowLeft size={16} />
          Back to Collection
        </button>

        <div className="product-details-layout">
          <section className="details-gallery">
            <div className="details-main-image-wrap">
              <img
                src={galleryImages[selectedImgIndex] || product.image}
                alt={product.name}
                className="details-main-img"
              />

              {product.badge && (
                <span className="details-badge">
                  {product.isBucket && <Gift size={13} />}
                  {product.badge}
                </span>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="details-thumbnails-row">
                {galleryImages.map((image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    className={`thumb-btn ${
                      selectedImgIndex === index ? "active" : ""
                    }`}
                    onClick={() => setSelectedImgIndex(index)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} image ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="details-trust-box">
              <div className="trust-pill">
                <ShieldCheck size={16} />
                <span>Quality-focused selection</span>
              </div>

              <div className="trust-pill">
                <Truck size={16} />
                <span>Carefully packed for delivery</span>
              </div>
            </div>
          </section>

          <section className="details-content">
            <div className="details-header-row">
              <span className="details-category-tag">
                {(product.category || "Golden Harvest").toUpperCase()}
              </span>

              <h1 className="details-title">{product.name}</h1>
            </div>

            <div className="details-rating-bar">
              {hasRating && (
                <>
                  <div
                    className="stars-cluster"
                    aria-label={`${rating} out of 5 stars`}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={15}
                        fill={
                          star <= Math.round(rating) ? "#f59e0b" : "none"
                        }
                        color="#f59e0b"
                      />
                    ))}
                  </div>

                  <span className="rating-score-bold">
                    {rating.toFixed(1)}
                  </span>
                </>
              )}

              <span className="happy-customers-badge">
                <Check size={14} />
                250+ Happy Customers
              </span>

              {product.origin && (
                <span className="origin-badge">
                  Harvested in: {product.origin}
                </span>
              )}
            </div>

            <div className="product-trust-summary">
              <ShieldCheck size={17} />
              <span>Premium selection · Thoughtful gifting</span>
            </div>

            <div className="details-price-container">
              <div className="price-primary">
                {formatPrice(currentPrice)}
              </div>

              <span className="tax-inclusive-tag">
                All taxes included · Shipping details confirmed on enquiry
              </span>
            </div>

            <div className="details-section-label">
              Select Pack Size / Weight:
            </div>

            <div className="details-weights-grid">
              {weightOptions.map((option, index) => (
                <button
                  type="button"
                  key={option.weight}
                  className={`weight-choice-card ${
                    selectedWeightIndex === index ? "selected" : ""
                  }`}
                  onClick={() => setSelectedWeightIndex(index)}
                  aria-pressed={selectedWeightIndex === index}
                >
                  <span className="opt-weight">{option.weight}</span>

                  <span className="opt-price">
                    {formatPrice(option.price)}
                  </span>

                  <span className="opt-serves">{option.serves}</span>
                </button>
              ))}
            </div>

            <div className="details-action-row">
              <button
                type="button"
                className="btn-primary details-whatsapp-btn"
                onClick={handleOrderWhatsApp}
              >
                <MessageCircle size={17} />
                Enquire on WhatsApp
              </button>

              <button
                type="button"
                className="btn-secondary details-inquire-btn"
                onClick={handleInquire}
              >
                <PhoneCall size={16} />
                Request a Call
              </button>
            </div>

            <div className="details-tabs-header">
              <button
                type="button"
                className={`tab-btn ${
                  activeTab === "overview" ? "active" : ""
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>

              <button
                type="button"
                className={`tab-btn ${
                  activeTab === "nutrition" ? "active" : ""
                }`}
                onClick={() => setActiveTab("nutrition")}
              >
                Nutritional Value
              </button>

              <button
                type="button"
                className={`tab-btn ${
                  activeTab === "origin" ? "active" : ""
                }`}
                onClick={() => setActiveTab("origin")}
              >
                Packaging & Care
              </button>
            </div>

            <div className="details-tab-content">
              {activeTab === "overview" && (
                <div className="tab-pane">
                  <p className="details-long-desc">
                    {product.description}
                  </p>

                  {product.benefits?.length > 0 && (
                    <div className="benefits-list">
                      <span className="benefits-headline">
                        Key Benefits
                      </span>

                      <ul>
                        {product.benefits.map((benefit, index) => (
                          <li key={`${benefit}-${index}`}>
                            <Check size={15} />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "nutrition" && (
                <div className="tab-pane">
                  {product.nutrition ? (
                    <>
                      <p className="nutrition-intro">
                        Nutritional information per 100g portion:
                      </p>

                      <div className="nutrition-table">
                        {[
                          ["Energy / Calories", product.nutrition.calories],
                          ["Protein", product.nutrition.protein],
                          ["Healthy Fats", product.nutrition.healthyFats],
                          ["Dietary Fiber", product.nutrition.fiber],
                          ["Carbohydrates", product.nutrition.carbs],
                        ]
                          .filter((item) => item[1] != null)
                          .map(([label, value]) => (
                            <div className="nutrition-row" key={label}>
                              <span>{label}</span>
                              <strong>{value}</strong>
                            </div>
                          ))}
                      </div>
                    </>
                  ) : (
                    <p className="details-long-desc">
                      Nutritional information is not currently available.
                      Please contact us for product details.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "origin" && (
                <div className="tab-pane">
                  {product.origin && (
                    <div className="origin-info-item">
                      <strong>Origin</strong>
                      <p>{product.origin}</p>
                    </div>
                  )}

                  {product.storage && (
                    <div className="origin-info-item">
                      <strong>Storage Instructions</strong>
                      <p>{product.storage}</p>
                    </div>
                  )}

                  <div className="origin-info-item">
                    <strong>Packaging & Care</strong>
                    <p>
                      Contact Golden Harvest to confirm packaging and storage
                      recommendations for your selected product.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailsModal;
