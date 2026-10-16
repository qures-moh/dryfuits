const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    heroTitle: {
      type: String,
      default: "Nature's Finest,\nThoughtfully Selected.",
      trim: true,
    },

    heroDescription: {
      type: String,
      default:
        "Discover carefully selected dry fruits and thoughtful gift buckets for everyday enjoyment and special moments.",
      trim: true,
    },

    heroBadgeText: {
      type: String,
      default: "THE ART OF THOUGHTFUL GIFTING",
      trim: true,
    },

    heroImage: {
      type: String,
      default: "/images/hero.jpg",
      trim: true,
    },

    heroFloatingBadge1Title: {
      type: String,
      default: "Gifts with Meaning",
      trim: true,
    },

    heroFloatingBadge1Subtitle: {
      type: String,
      default: "Made for special moments",
      trim: true,
    },

    heroFloatingBadge2Title: {
      type: String,
      default: "Nature's Goodness",
      trim: true,
    },

    heroFloatingBadge2Subtitle: {
      type: String,
      default: "A little goodness, every day",
      trim: true,
    },

    announcementText: {
      type: String,
      default:
        "FESTIVE HARVEST: Direct Farm-Fresh Dry Fruits & Handcrafted Wooden Buckets",
      trim: true,
    },

    announcementDelivery: {
      type: String,
      default: "Free Nitrogen-Sealed Express Delivery over Rs. 999",
      trim: true,
    },

    announcementWhatsApp: {
      type: String,
      default: "Instant WhatsApp Orders: +91 91795 98991",
      trim: true,
    },

    brandName: {
      type: String,
      default: "Golden Harvest",
      trim: true,
    },

    brandTagline: {
      type: String,
      default: "Dry Fruits • Gift Buckets",
      trim: true,
    },

    logoUrl: {
      type: String,
      default: "/images/logo.svg",
      trim: true,
    },

    whatsappNumber: {
      type: String,
      default: "919179598991",
      trim: true,
    },

    phoneNumber: {
      type: String,
      default: "+91 91795 98991",
      trim: true,
    },

    email: {
      type: String,
      default: "care@goldenharvestdryfruits.com",
      trim: true,
      lowercase: true,
    },

    footerDescription: {
      type: String,
      default:
        "Thoughtfully selected dry fruits and gift buckets for everyday enjoyment and special moments.",
      trim: true,
    },

    footerBottomText: {
      type: String,
      default: "Goodness to enjoy. Gifts to remember.",
      trim: true,
    },

    collectionTitle: {
      type: String,
      default: "Goodness Worth Sharing",
      trim: true,
    },

    collectionSubtitle: {
      type: String,
      default: "THE COLLECTION",
      trim: true,
    },

    collectionDescription: {
      type: String,
      default:
        "Explore our selection of dry fruits and thoughtfully presented gift buckets for everyday moments and special occasions.",
      trim: true,
    },

    bucketBannerTitle: {
      type: String,
      default: "A Gift Made Personal",
      trim: true,
    },

    bucketBannerDescription: {
      type: String,
      default:
        "Create a gift bucket with your preferred selections and make your next occasion more meaningful.",
      trim: true,
    },

    bucketBannerImage: {
      type: String,
      default: "/images/bucket_hamper.jpg",
      trim: true,
    },

    healthSectionTitle: {
      type: String,
      default: "Simple Foods, Everyday Goodness",
      trim: true,
    },

    healthSectionSubtitle: {
      type: String,
      default: "GOODNESS IN EVERY HANDFUL",
      trim: true,
    },

    healthSectionDescription: {
      type: String,
      default:
        "Discover the goodness of nuts and dried fruits, thoughtfully selected for everyday enjoyment and sharing.",
      trim: true,
    },

    reviewsSectionTitle: {
      type: String,
      default: "Stories Worth Sharing",
      trim: true,
    },

    reviewsSectionSubtitle: {
      type: String,
      default: "VOICES OF HARVEST",
      trim: true,
    },

    reviewsSectionDescription: {
      type: String,
      default:
        "A closer look at what customers say about their Golden Harvest experience, from everyday favourites to thoughtful gifts.",
      trim: true,
    },

    contactSectionTitle: {
      type: String,
      default: "Something Special Starts Here",
      trim: true,
    },

    contactSectionSubtitle: {
      type: String,
      default: "LET'S CONNECT",
      trim: true,
    },

    contactSectionDescription: {
      type: String,
      default:
        "Looking for everyday favourites or a thoughtful gift? Tell us what you have in mind, and we'll help you explore the right options.",
      trim: true,
    },

    freeShippingThreshold: {
      type: Number,
      default: 999,
      min: 0,
    },

    shippingFee: {
      type: Number,
      default: 70,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);