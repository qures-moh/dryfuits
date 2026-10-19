import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  fetchProducts,
  fetchCategories,
  fetchTestimonials,
  fetchFaqs,
  fetchSettings,
  fetchProductById,
  DEFAULT_SETTINGS,
} from '../api';
import {
  CATEGORIES as DEFAULT_CATEGORIES,
  PRODUCTS as DEFAULT_PRODUCTS,
  TESTIMONIALS as DEFAULT_TESTIMONIALS,
  FAQ_ITEMS as DEFAULT_FAQS,
} from '../data/products';

const SiteDataContext = createContext(null);

export const SiteDataProvider = ({ children }) => {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [
        fetchedProducts,
        fetchedCategories,
        fetchedTestimonials,
        fetchedFaqs,
        fetchedSettings,
      ] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchTestimonials(),
        fetchFaqs(),
        fetchSettings(),
      ]);

      if (fetchedProducts && fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
      }
      if (fetchedCategories && fetchedCategories.length > 0) {
        setCategories(fetchedCategories);
      }
      if (fetchedTestimonials && fetchedTestimonials.length > 0) {
        setTestimonials(fetchedTestimonials);
      }
      if (fetchedFaqs && fetchedFaqs.length > 0) {
        setFaqs(fetchedFaqs);
      }
      if (fetchedSettings) {
        setSettings(fetchedSettings);
      }
      setIsBackendConnected(true);
    } catch (err) {
      console.error('Error fetching dynamic site data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getProduct = useCallback(
    async (id) => {
      if (!id) return null;
      const found = products.find(
        (p) => String(p.id) === String(id) || String(p._id) === String(id)
      );
      if (found) return found;
      // If not in state, attempt direct fetch from API
      const remote = await fetchProductById(id);
      return remote;
    },
    [products]
  );

  return (
    <SiteDataContext.Provider
      value={{
        products,
        categories,
        testimonials,
        faqs,
        settings,
        loading,
        isBackendConnected,
        refreshData: loadData,
        getProduct,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
};
