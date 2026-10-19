import React from 'react';
import {
  ArrowRight,
  Gift,
  Sparkles,
  Leaf,
} from 'lucide-react';
import { useHeroAnimation } from '../hooks/useGSAPAnimations';
import { useSiteData } from '../context/SiteDataContext';

export const Hero = ({
  onSelectCategory,
  onOpenBucketBuilder,
}) => {
  const { settings } = useSiteData();

  const {
    sectionRef,
    badgeRef,
    titleRef,
    descRef,
    actionsRef,
    proofRef,
    imageCardRef,
    floatingBadge1Ref,
    floatingBadge2Ref,
  } = useHeroAnimation();

  const handleExplore = () => {
    onSelectCategory?.('all');

    document
      .getElementById('collection-section')
      ?.scrollIntoView({
        behavior: 'smooth',
      });
  };

  const brandName =
    settings?.brandName || 'Golden Harvest';

  const heroBadge =
    settings?.heroBadgeText ||
    'PREMIUM DRY FRUITS';

  const heroTitle =
    settings?.heroTitle ||
    'Premium Dry Fruits,\nBeautifully Gifted';

  const heroDescription =
    settings?.heroDescription ||
    'Discover carefully selected dry fruits, premium nuts and thoughtfully crafted gift buckets made for everyday goodness and special moments.';

  const heroImage =
    settings?.heroImage ||
    '/images/hero.jpg';

  return (
    <section
      className="landing-hero"
      ref={sectionRef}
    >
      <div className="section-container">
        <div className="hero-main">
          <div className="hero-content">
            <div
              className="hero-badge"
              ref={badgeRef}
            >
              <Sparkles size={14} />
              <span>{heroBadge}</span>
            </div>

            <h1
              className="hero-title"
              ref={titleRef}
            >
              {heroTitle.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < heroTitle.split('\n').length - 1 && (
                    <br />
                  )}
                </React.Fragment>
              ))}
            </h1>

            <p
              className="hero-description"
              ref={descRef}
            >
              {heroDescription}
            </p>

            <div
              className="hero-actions"
              ref={actionsRef}
            >
              <button
                type="button"
                className="btn-primary"
                onClick={handleExplore}
              >
                Shop Dry Fruits
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={onOpenBucketBuilder}
              >
                <Gift size={17} />
                Build Your Gift
              </button>
            </div>

            <div
              className="hero-proof"
              ref={proofRef}
            >
              <span className="hero-proof-label">
                Goodness You Can Gift
              </span>

              <span className="hero-proof-item">
                <Leaf size={15} />
                <span>Premium Quality</span>
              </span>

              <span className="hero-proof-item">
                <Gift size={15} />
                <span>Perfect for Gifting</span>
              </span>
            </div>
          </div>

          <div
            className="hero-visual"
            ref={imageCardRef}
          >
            <div className="hero-image-wrapper">
              <img
                src={heroImage}
                alt={`${brandName} premium dry fruits and gift collection`}
                className="hero-image"
                fetchPriority="high"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = '/images/hero.jpg';
                }}
              />
            </div>

            <div
              className="hero-floating-badge hero-floating-badge-one"
              ref={floatingBadge1Ref}
            >
              <span className="hero-floating-icon">
                <Gift size={19} />
              </span>

              <span>
                <strong>
                  {settings?.heroFloatingBadge1Title ||
                    'Gifts with Meaning'}
                </strong>

                <small>
                  {settings?.heroFloatingBadge1Subtitle ||
                    'Made for special moments'}
                </small>
              </span>
            </div>

            <div
              className="hero-floating-badge hero-floating-badge-two"
              ref={floatingBadge2Ref}
            >
              <span className="hero-floating-icon">
                <Leaf size={19} />
              </span>

              <span>
                <strong>
                  {settings?.heroFloatingBadge2Title ||
                    'Nature’s Goodness'}
                </strong>

                <small>
                  {settings?.heroFloatingBadge2Subtitle ||
                    'A little goodness, every day'}
                </small>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;