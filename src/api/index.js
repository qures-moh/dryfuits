import {
  CATEGORIES as DEFAULT_CATEGORIES,
  PRODUCTS as DEFAULT_PRODUCTS,
  TESTIMONIALS as DEFAULT_TESTIMONIALS,
  FAQ_ITEMS as DEFAULT_FAQS,
  BUCKET_CONTAINERS,
  DRY_FRUIT_FILLERS,
  GIFT_RIBBONS,
} from '../data/products';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const SERVER_BASE_URL =
  import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export const formatImageUrl = (url) => {
  if (!url) return '/images/hero.jpg';

  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:')
  ) {
    return url;
  }

  if (url.startsWith('/uploads')) {
    return `${SERVER_BASE_URL}${url}`;
  }

  return url;
};

export const normalizeProduct = (product) => {
  if (!product) return null;

  const id = String(product._id || product.id || '');

  return {
    ...product,
    id,
    _id: id,
    image: formatImageUrl(product.image),
    gallery:
      Array.isArray(product.gallery) &&
      product.gallery.length > 0
        ? product.gallery.map(formatImageUrl)
        : [formatImageUrl(product.image)],
    basePrice: Number(product.basePrice) || 0,
    rating: Number(product.rating) || 4.5,
    reviewsCount: Number(product.reviewsCount) || 0,
    weightOptions: Array.isArray(product.weightOptions)
      ? product.weightOptions
      : [],
    benefits: Array.isArray(product.benefits)
      ? product.benefits
      : [],
    nutrition: product.nutrition || {},
  };
};

export const DEFAULT_SETTINGS = {
  heroTitle: "Nature's Finest,\nThoughtfully Selected.",
  heroDescription:
    "Discover carefully selected dry fruits and thoughtful gift buckets for everyday enjoyment and special moments.",
  heroBadgeText: "THE ART OF THOUGHTFUL GIFTING",
  heroImage: "/images/hero.jpg",
  heroFloatingBadge1Title: "Gifts with Meaning",
  heroFloatingBadge1Subtitle: "Made for special moments",
  heroFloatingBadge2Title: "Nature's Goodness",
  heroFloatingBadge2Subtitle: "A little goodness, every day",
  announcementText:
    "FESTIVE HARVEST: Direct Farm-Fresh Dry Fruits & Handcrafted Wooden Buckets",
  announcementDelivery:
    "Free Nitrogen-Sealed Express Delivery over Rs. 999",
  announcementWhatsApp:
    "Instant WhatsApp Orders: +91 91795 98991",
  brandName: "Golden Harvest",
  brandTagline: "Dry Fruits • Gift Buckets",
  logoUrl: "/images/logo.svg",
  whatsappNumber: "919179598991",
  phoneNumber: "+91 91795 98991",
  email: "care@goldenharvestdryfruits.com",
  footerDescription:
    "Thoughtfully selected dry fruits and gift buckets for everyday enjoyment and special moments.",
  footerBottomText: "Goodness to enjoy. Gifts to remember.",
  collectionTitle: "Goodness Worth Sharing",
  collectionSubtitle: "THE COLLECTION",
  collectionDescription:
    "Explore our selection of dry fruits and thoughtfully presented gift buckets for everyday moments and special occasions.",
  bucketBannerTitle: "A Gift Made Personal",
  bucketBannerDescription:
    "Create a gift bucket with your preferred selections and make your next occasion more meaningful.",
  bucketBannerImage: "/images/bucket_hamper.jpg",
  healthSectionTitle: "Simple Foods, Everyday Goodness",
  healthSectionSubtitle: "GOODNESS IN EVERY HANDFUL",
  healthSectionDescription:
    "Discover the goodness of nuts and dried fruits, thoughtfully selected for everyday enjoyment and sharing.",
  reviewsSectionTitle: "Stories Worth Sharing",
  reviewsSectionSubtitle: "VOICES OF HARVEST",
  reviewsSectionDescription:
    "A closer look at what customers say about their Golden Harvest experience, from everyday favourites to thoughtful gifts.",
  contactSectionTitle: "Something Special Starts Here",
  contactSectionSubtitle: "LET'S CONNECT",
  contactSectionDescription:
    "Looking for everyday favourites or a thoughtful gift? Tell us what you have in mind, and we'll help you explore the right options.",
  freeShippingThreshold: 999,
  shippingFee: 70,
};

export const fetchProducts = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      return data.map(normalizeProduct);
    }
  } catch (err) {
    console.warn(
      'Backend API /products not available, using fallback:',
      err.message
    );
  }

  return DEFAULT_PRODUCTS.map(normalizeProduct);
};

export const fetchProductById = async (id) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/products/${encodeURIComponent(id)}`
    );

    if (res.ok) {
      const data = await res.json();

      if (data && (data._id || data.id)) {
        return normalizeProduct(data);
      }
    }
  } catch (err) {
    console.warn(
      `Backend API /products/${id} not available, checking fallback:`,
      err.message
    );
  }

  const fallback = DEFAULT_PRODUCTS.find(
    (p) =>
      String(p.id) === String(id) ||
      String(p._id) === String(id)
  );

  return fallback ? normalizeProduct(fallback) : null;
};

export const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      return data.map((c) => ({
        id: c.categoryId || c.id || c._id,
        categoryId: c.categoryId || c.id || c._id,
        name: c.name,
        icon: c.icon || 'Sparkles',
        sortOrder: c.sortOrder ?? 0,
      }));
    }
  } catch (err) {
    console.warn(
      'Backend API /categories not available, using fallback:',
      err.message
    );
  }

  return DEFAULT_CATEGORIES;
};

export const fetchTestimonials = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/testimonials`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      return data.map((t) => ({
        id: t._id || t.id,
        name: t.name,
        role: t.role || '',
        rating: Number(t.rating) || 5,
        comment: t.comment,
        date: t.date || 'Recently',
        verified:
          t.verified !== undefined ? t.verified : true,
      }));
    }
  } catch (err) {
    console.warn(
      'Backend API /testimonials not available, using fallback:',
      err.message
    );
  }

  return DEFAULT_TESTIMONIALS;
};

export const fetchFaqs = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/faqs`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      return data.map((f) => ({
        id: f._id || f.id,
        q: f.question,
        question: f.question,
        a: f.answer,
        answer: f.answer,
      }));
    }
  } catch (err) {
    console.warn(
      'Backend API /faqs not available, using fallback:',
      err.message
    );
  }

  return DEFAULT_FAQS;
};

export const fetchSettings = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (data && typeof data === 'object') {
      return {
        ...DEFAULT_SETTINGS,
        ...data,
        heroImage: formatImageUrl(
          data.heroImage || DEFAULT_SETTINGS.heroImage
        ),
        bucketBannerImage: formatImageUrl(
          data.bucketBannerImage ||
            DEFAULT_SETTINGS.bucketBannerImage
        ),
        logoUrl: formatImageUrl(
          data.logoUrl || DEFAULT_SETTINGS.logoUrl
        ),
      };
    }
  } catch (err) {
    console.warn(
      'Backend API /settings not available, using fallback:',
      err.message
    );
  }

  return DEFAULT_SETTINGS;
};

export const fetchCustomStudio = async () => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom-studio`
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    const studioData = data?.data || data;

    if (
      !studioData ||
      typeof studioData !== 'object'
    ) {
      throw new Error(
        'Invalid Custom Studio response'
      );
    }

    const containers = Array.isArray(
      studioData.containers
    )
      ? studioData.containers.map((container) => ({
          id: String(
            container._id ||
              container.id ||
              ''
          ),
          _id: String(
            container._id ||
              container.id ||
              ''
          ),
          name: container.name || '',
          material: container.material || '',
          capacity: container.capacity || '',
          price: Number(container.price) || 0,
          image: formatImageUrl(container.image),
          badge: container.badge || '',
        }))
      : [];

    const fillers = Array.isArray(
      studioData.fillers
    )
      ? studioData.fillers.map((filler) => ({
          id: String(
            filler._id ||
              filler.id ||
              ''
          ),
          _id: String(
            filler._id ||
              filler.id ||
              ''
          ),
          name: filler.name || '',
          price: Number(filler.price) || 0,
          category:
            filler.category || 'Nuts',
          weight: Number(filler.weight) || 150,
          image: formatImageUrl(
            filler.image
          ),
        }))
      : [];

    const ribbons = Array.isArray(
      studioData.ribbons
    )
      ? studioData.ribbons.map((ribbon) => ({
          id: String(
            ribbon._id ||
              ribbon.id ||
              ''
          ),
          _id: String(
            ribbon._id ||
              ribbon.id ||
              ''
          ),
          name: ribbon.name || '',
          price: Number(
            ribbon.price ??
              ribbon.cost ??
              0
          ),
          cost: Number(
            ribbon.price ??
              ribbon.cost ??
              0
          ),
          color:
            ribbon.color || '#eab308',
          image: ribbon.image
            ? formatImageUrl(ribbon.image)
            : '',
        }))
      : [];

    return {
      containers,
      fillers,
      ribbons,
    };
  } catch (err) {
    console.error(
      'Custom Studio backend error:',
      err
    );

    return {
      containers: [],
      fillers: [],
      ribbons: [],
    };
  }
};