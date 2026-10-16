import React from 'react';
import { useWhatsAppAnimation } from '../hooks/useGSAPAnimations';
import { useSiteData } from '../context/SiteDataContext';

export const WhatsAppButton = () => {
  const { settings } = useSiteData();
  const { btnRef } = useWhatsAppAnimation();

  const brandName = settings?.brandName || 'Golden Harvest';
  const cleanWhatsApp = (settings?.whatsappNumber || '919179598991').replace(/\D/g, '');

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hello ${brandName}! I would like to inquire about your premium dry fruits and custom gift buckets.`);
    window.open(`https://wa.me/${cleanWhatsApp}?text=${message}`, '_blank');
  };

  return (
    <button
      className="floating-whatsapp-btn"
      onClick={handleWhatsAppClick}
      aria-label="Chat with Golden Harvest on WhatsApp"
      title="Chat with us on WhatsApp"
      ref={btnRef}
    >
      {/* Radar Wave Pulse Rings */}
      <span className="whatsapp-radar-ring-1" aria-hidden="true"></span>
      <span className="whatsapp-radar-ring-2" aria-hidden="true"></span>

      {/* Floating Hover Tooltip */}
      <div className="whatsapp-hover-tooltip" aria-hidden="true">
        <span>Chat with us on WhatsApp</span>
        <span style={{ fontSize: '10px' }}>🟢 Online</span>
      </div>

      <div className="whatsapp-icon-inner">
        {/* SVG WhatsApp icon */}
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="#ffffff" stroke="#ffffff"></path>
        </svg>
      </div>
    </button>
  );
};
