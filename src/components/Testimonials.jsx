import React, { useState } from 'react';
import {
  Star,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { useTestimonialsAnimation } from '../hooks/useGSAPAnimations';
import { useSiteData } from '../context/SiteDataContext';

export const Testimonials = () => {
  const { testimonials, faqs, settings } = useSiteData();
  const [openFaq, setOpenFaq] = useState(0);

  const {
    sectionRef,
    headerRef,
    gridRef,
    faqRef,
  } = useTestimonialsAnimation();

  return (
    <section
      id="reviews-section"
      className="testimonials-section"
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
              {settings?.reviewsSectionSubtitle || 'VOICES OF HARVEST'}
            </span>
          </div>

          <h2 className="section-title">
            {settings?.reviewsSectionTitle || 'Stories Worth Sharing'}
          </h2>

          <p className="section-desc max-w-2xl mx-auto">
            {settings?.reviewsSectionDescription ||
              'A closer look at what customers say about their Golden Harvest experience, from everyday favourites to thoughtful gifts.'}
          </p>
        </div>

        <div
          className="testimonials-grid"
          ref={gridRef}
        >
          {testimonials.map((review) => {
            const starsCount = Math.max(1, Math.min(5, Number(review.rating) || 5));
            return (
              <article
                key={review.id || review._id || review.name}
                className="testimonial-card"
              >
                <div className="testimonial-rating-row">
                  <div
                    className="stars-row"
                    aria-label={`${starsCount} out of 5 stars`}
                  >
                    {[...Array(starsCount)].map((_, index) => (
                      <Star
                        key={index}
                        size={15}
                        fill="#f59e0b"
                        color="#f59e0b"
                      />
                    ))}
                  </div>

                  <span className="review-date">
                    {review.date || 'Recently'}
                  </span>
                </div>

                <p className="testimonial-comment">
                  “{review.comment}”
                </p>

                <div className="testimonial-author">
                  <div
                    className="author-avatar"
                    aria-hidden="true"
                  >
                    {(review.name || 'G').charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h4 className="author-name">
                      {review.name}
                    </h4>

                    <div className="author-verified">
                      <CheckCircle
                        size={13}
                        className="text-emerald"
                      />

                      <span>{review.role || 'Verified Customer'}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div
          className="faq-container"
          ref={faqRef}
        >
          <div className="faq-header">
            <MessageSquare
              size={22}
              className="text-gold"
            />

            <h3 className="faq-title">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="faq-list">
            {faqs.map((item, index) => {
              const isOpen = openFaq === index;
              const question = item.q || item.question;
              const answer = item.a || item.answer;

              return (
                <div
                  key={item.id || item._id || index}
                  className={`faq-card ${isOpen ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() =>
                      setOpenFaq(isOpen ? -1 : index)
                    }
                    aria-expanded={isOpen}
                  >
                    <span>{question}</span>

                    {isOpen ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>

                  {isOpen && (
                    <div className="faq-answer-panel">
                      <p>{answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
