import React from 'react';
import {
  Heart,
  Brain,
  Zap,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Leaf,
  Gift,
} from 'lucide-react';
import { useHealthBenefitsAnimation } from '../hooks/useGSAPAnimations';
import { useSiteData } from '../context/SiteDataContext';

export const HealthBenefits = () => {
  const { settings } = useSiteData();

  const {
    sectionRef,
    headerRef,
    gridRef,
    bannerRef,
  } = useHealthBenefitsAnimation();

  const benefits = [
    {
      icon: Heart,
      title: 'Heart-Friendly Fats',
      desc: 'Almonds, walnuts, and cashews contain unsaturated fats that fit into a balanced, varied diet.',
      tag: 'Everyday Nutrition',
    },
    {
      icon: Brain,
      title: 'Nutrients for Your Mind',
      desc: 'Walnuts provide plant-based omega-3 ALA and other nutrients to complement a varied diet.',
      tag: 'Plant-Based Goodness',
    },
    {
      icon: Zap,
      title: 'Natural Energy',
      desc: 'Dates and figs offer naturally occurring sugars and carbohydrates for everyday energy.',
      tag: 'Daily Energy',
    },
    {
      icon: ShieldCheck,
      title: 'Fiber-Rich Choices',
      desc: 'Many nuts and dried fruits contain dietary fiber that supports normal digestive function.',
      tag: 'Daily Wellness',
    },
  ];

  return (
    <section
      id="health-section"
      className="health-section"
      ref={sectionRef}
    >
      <div className="section-container">
        <div
          className="section-header text-center"
          ref={headerRef}
        >
          <div className="section-subtitle-wrap justify-center">
            <Sparkles size={15} className="text-gold" />

            <span className="section-subtitle">
              {settings?.healthSectionSubtitle || 'GOODNESS IN EVERY HANDFUL'}
            </span>
          </div>

          <h2 className="section-title">
            {settings?.healthSectionTitle || 'Simple Foods, Everyday Goodness'}
          </h2>

          <p className="section-desc max-w-2xl mx-auto">
            {settings?.healthSectionDescription ||
              'Discover the goodness of nuts and dried fruits, thoughtfully selected for everyday enjoyment and sharing.'}
          </p>
        </div>

        <div className="benefits-grid" ref={gridRef}>
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="benefit-card"
              >
                <div className="benefit-card-top">
                  <div className="benefit-icon-wrapper">
                    <Icon size={22} strokeWidth={1.7} />
                  </div>

                  <span className="benefit-tag">
                    {item.tag}
                  </span>
                </div>

                <h3 className="benefit-card-title">
                  {item.title}
                </h3>

                <p className="benefit-card-text">
                  {item.desc}
                </p>

                <div className="benefit-check-footer">
                  <CheckCircle2
                    size={15}
                    className="text-emerald"
                  />

                  <span>Part of a balanced diet</span>
                </div>
              </article>
            );
          })}
        </div>

        <div
          className="approach-banner"
          ref={bannerRef}
        >
          <div className="approach-content">
            <span className="approach-subtitle">
              OUR APPROACH
            </span>

            <h3 className="approach-title">
              Nature’s Goodness, Thoughtfully Presented
            </h3>

            <p className="approach-text">
              From everyday snacking to thoughtful gifting,
              Golden Harvest brings together dry fruits and gift
              buckets for life’s little moments and special occasions.
              Find something to enjoy yourself or share with someone
              special.
            </p>

            <div className="approach-stats">
              <div className="approach-stat">
                <strong>
                  <Leaf size={19} strokeWidth={1.7} />
                </strong>

                <span>Natural Ingredients</span>
              </div>

              <div className="approach-stat">
                <strong>
                  <Heart size={19} strokeWidth={1.7} />
                </strong>

                <span>Everyday Enjoyment</span>
              </div>

              <div className="approach-stat">
                <strong>
                  <Gift size={19} strokeWidth={1.7} />
                </strong>

                <span>Thoughtful Gifting</span>
              </div>
            </div>
          </div>

          <div className="approach-image-wrapper">
            <img
              src="/images/hero.jpg"
              alt="Golden Harvest dry fruits and gift collection"
              className="approach-image"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthBenefits;