import React, { useState } from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  Sparkles,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { useStore } from "../redux/useStore";
import { useSiteData } from "../context/SiteDataContext";
import { useContactAnimation } from "../hooks/useGSAPAnimations";

export const ContactSection = () => {
  const { showToast } = useStore();
  const { settings } = useSiteData();

  const { sectionRef, headerRef, infoCardRef, formCardRef } =
    useContactAnimation();

  const initialFormData = {
    name: "",
    interest: "Gift Buckets & Hampers",
    message: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const brandName = settings?.brandName || "Golden Harvest";
  const cleanPhone = (settings?.phoneNumber || "+91 91795 98991").replace(/\s+/g, "");
  const cleanWhatsApp = (settings?.whatsappNumber || "919179598991").replace(/\D/g, "");
  const storeEmail = settings?.email || "care@goldenharvestdryfruits.com";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast("Please enter your name", "error");
      return;
    }

    const waText = encodeURIComponent(
      `Hello ${brandName}!

I would like to enquire about your products.

Name: ${formData.name.trim()}
Interest: ${formData.interest}
Details: ${
        formData.message.trim() ||
        "Please share your product catalog and pricing."
      }`,
    );

    const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${waText}`;

    setIsSubmitted(true);
    showToast("Opening WhatsApp to send your enquiry...");

    const whatsappWindow = window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer",
    );

    if (!whatsappWindow) {
      window.location.href = whatsappUrl;
    }

    setFormData(initialFormData);
    setIsSubmitted(false);
  };

  return (
    <section
      id="contact-section"
      className="landing-contact-section"
      ref={sectionRef}
    >
      <div className="section-container">
        <div className="section-header text-center" ref={headerRef}>
          <div className="section-subtitle-wrap justify-center">
            <Sparkles size={15} className="text-gold" />
            <span className="section-subtitle">{settings?.contactSectionSubtitle || "LET'S CONNECT"}</span>
          </div>

          <h2 className="section-title">{settings?.contactSectionTitle || "Something Special Starts Here"}</h2>

          <p className="section-desc max-w-2xl mx-auto">
            {settings?.contactSectionDescription ||
              "Looking for everyday favourites or a thoughtful gift? Tell us what you have in mind, and we’ll help you explore the right options."}
          </p>
        </div>

        <div className="landing-contact-grid">
          <div className="landing-contact-info-card" ref={infoCardRef}>
            <h3 className="contact-card-title">We're Here to Help</h3>

            <p className="contact-card-sub">
              {`Connect with ${brandName} for product enquiries, gift bucket selections, bulk orders, and pricing.`}
            </p>

            <div className="contact-methods-list">
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hi ${brandName}! I would like to enquire about your products.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-channel-item whatsapp-channel"
              >
                <div className="channel-icon-box bg-whatsapp">
                  <MessageCircle size={22} color="#ffffff" />
                </div>

                <div className="channel-details">
                  <span className="channel-label">WhatsApp Enquiries</span>

                  <strong className="channel-value">{settings?.phoneNumber || "+91 91795 98991"}</strong>

                  <span className="channel-hint">
                    Chat with us about your order
                  </span>
                </div>
              </a>

              <a
                href={`tel:${cleanPhone}`}
                className="contact-channel-item"
              >
                <div className="channel-icon-box bg-gold">
                  <Phone size={22} color="#ffffff" />
                </div>

                <div className="channel-details">
                  <span className="channel-label">Call Us</span>

                  <strong className="channel-value">{settings?.phoneNumber || "+91 91795 98991"}</strong>

                  <span className="channel-hint">
                    Speak with us about your requirements
                  </span>
                </div>
              </a>

              <a
                href={`mailto:${storeEmail}`}
                className="contact-channel-item"
              >
                <div className="channel-icon-box bg-dark">
                  <Mail size={22} color="#ffffff" />
                </div>

                <div className="channel-details">
                  <span className="channel-label">
                    Corporate & Bulk Enquiries
                  </span>

                  <strong className="channel-value">
                    {storeEmail}
                  </strong>

                  <span className="channel-hint">
                    For business and gifting enquiries
                  </span>
                </div>
              </a>
            </div>

            <div className="contact-perks-row">
              <div className="perk-box">
                <Truck size={18} className="text-emerald" />
                <span>Delivery Options Available</span>
              </div>

              <div className="perk-box">
                <ShieldCheck size={18} className="text-gold" />
                <span>Carefully Selected Products</span>
              </div>
            </div>
          </div>

          <div className="landing-inquiry-form-card" ref={formCardRef}>
            <h3 className="form-card-title">Tell Us What You Need</h3>

            <p className="form-card-sub">
              Share a few details, and continue to WhatsApp to discuss your
              requirements with us.
            </p>

            <form onSubmit={handleSubmit} className="inquiry-form">
              <div className="form-group">
                <label className="form-label" htmlFor="inquiry-name">
                  Your Full Name *
                </label>

                <input
                  id="inquiry-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={100}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inquiry-interest">
                  What Are You Looking For?
                </label>

                <select
                  id="inquiry-interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Gift Buckets & Hampers">
                    Custom Gift Buckets & Hampers
                  </option>

                  <option value="Personal Pantry Pack">
                    Everyday Dry Fruits
                  </option>

                  <option value="Corporate / Wedding Gifting">
                    Corporate & Wedding Gifting
                  </option>

                  <option value="Exotic Dates & Sun-Dried Figs">
                    Dates & Dried Figs
                  </option>

                  <option value="General Inquiry / Price Catalog">
                    Product Catalog & Pricing
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inquiry-msg">
                  Message or Specific Requirements
                </label>

                <textarea
                  id="inquiry-msg"
                  name="message"
                  rows={3}
                  maxLength={1000}
                  placeholder="Share your preferred products, quantities, or delivery location..."
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitted}
                className="btn-primary landing-submit-btn"
              >
                <MessageCircle size={18} />
                <span>Continue on WhatsApp</span>
              </button>

              <p className="privacy-note">
                Your details will be included in your WhatsApp enquiry so we
                can understand your requirements.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;