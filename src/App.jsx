import React, { useCallback, useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductList } from './components/ProductList';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { BucketBuilder } from './components/BucketBuilder';
import { HealthBenefits } from './components/HealthBenefits';
import { Testimonials } from './components/Testimonials';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { WhatsAppButton } from './components/WhatsAppButton';

function HomePage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBucketBuilderOpen, setIsBucketBuilderOpen] = useState(false);

  const scrollToSection = useCallback((sectionId) => {
    requestAnimationFrame(() => {
      const section = document.getElementById(sectionId);

      if (!section) return;

      const navbar = document.querySelector('.site-header');
      const announcement = document.querySelector('.announcement-bar');

      const navbarHeight =
        navbar?.getBoundingClientRect().height || 0;

      const announcementHeight =
        announcement?.getBoundingClientRect().height || 0;

      const top =
        section.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight -
        announcementHeight -
        16;

      window.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth',
      });
    });
  }, []);

  const openBucketBuilder = useCallback(() => {
    setIsBucketBuilderOpen(true);
    setActiveTab('builder');

    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }, []);

  const closeBucketBuilder = useCallback(() => {
    setIsBucketBuilderOpen(false);
    setActiveTab('home');

    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }, []);

  const handleSelectCategory = useCallback(
    (categoryId) => {
      setIsBucketBuilderOpen(false);
      setSelectedCategory(categoryId || 'all');
      setActiveTab('collection');

      scrollToSection('collection-section');
    },
    [scrollToSection]
  );

  const handleExploreShop = useCallback(() => {
    setIsBucketBuilderOpen(false);
    setSelectedCategory('all');
    setActiveTab('collection');

    scrollToSection('collection-section');
  }, [scrollToSection]);

  const handleNavigation = useCallback(
    (tabId) => {
      if (tabId === 'builder') {
        openBucketBuilder();
        return;
      }

      setIsBucketBuilderOpen(false);
      setActiveTab(tabId);

      const sectionMap = {
        collection: 'collection-section',
        health: 'health-section',
        reviews: 'reviews-section',
        contact: 'contact-section',
      };

      if (tabId === 'home') {
        navigate('/');

        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });

        return;
      }

      if (tabId === 'collection') {
        setSelectedCategory('all');
      }

      const sectionId = sectionMap[tabId];

      if (sectionId) {
        navigate('/');
        setTimeout(() => scrollToSection(sectionId), 0);
      }
    },
    [navigate, openBucketBuilder, scrollToSection]
  );

  return (
    <div className="dryfruit-app-root">
      <ToastContainer />

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenBucketBuilder={openBucketBuilder}
        onSelectCategory={handleSelectCategory}
        onNavigate={handleNavigation}
      />

      {isBucketBuilderOpen ? (
        <main className="main-content bucket-builder-page">
          <BucketBuilder
            isOpen={true}
            onClose={closeBucketBuilder}
          />
        </main>
      ) : (
        <>
          <main className="main-content">
            <Hero
              onExploreShop={handleExploreShop}
              onOpenBucketBuilder={openBucketBuilder}
              onSelectCategory={handleSelectCategory}
            />

            <ProductList
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onQuickView={(product) => {
                const prodId = product?.id || product?._id;
                if (prodId) {
                  navigate(`/product/${prodId}`);
                }
              }}
              onOpenBucketBuilder={openBucketBuilder}
            />

            <HealthBenefits />
            <Testimonials />
            <ContactSection />
          </main>

          <Footer
            onSelectCategory={handleSelectCategory}
            onOpenBucketBuilder={openBucketBuilder}
          />
        </>
      )}

      <WhatsAppButton />
    </div>
  );
}

function ProductPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { getProduct, loading: siteLoading } = useSiteData();

  const [product, setProduct] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    setIsFetching(true);

    if (productId) {
      getProduct(productId)
        .then((foundProduct) => {
          if (isCurrent) {
            setProduct(foundProduct || null);
            setIsFetching(false);
          }
        })
        .catch(() => {
          if (isCurrent) {
            setProduct(null);
            setIsFetching(false);
          }
        });
    } else {
      setIsFetching(false);
    }

    return () => {
      isCurrent = false;
    };
  }, [productId, getProduct]);

  const handleClose = () => {
    navigate('/', { replace: false });
  };

  if (isFetching || siteLoading) {
    return (
      <div className="dryfruit-app-root">
        <Navbar
          activeTab="collection"
          setActiveTab={() => navigate('/')}
          searchQuery=""
          setSearchQuery={() => {}}
          onOpenBucketBuilder={() => navigate('/')}
          onSelectCategory={() => navigate('/')}
          onNavigate={() => navigate('/')}
        />
        <main className="main-content">
          <div className="clean-empty-state" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner-border text-gold inline-block mb-3" />
            <p>Loading product details...</p>
          </div>
        </main>
        <Footer
          onSelectCategory={() => navigate('/')}
          onOpenBucketBuilder={() => navigate('/')}
        />
        <WhatsAppButton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="dryfruit-app-root">
        <Navbar
          activeTab="collection"
          setActiveTab={() => navigate('/')}
          searchQuery=""
          setSearchQuery={() => {}}
          onOpenBucketBuilder={() => navigate('/')}
          onSelectCategory={() => navigate('/')}
          onNavigate={() => navigate('/')}
        />

        <main className="main-content">
          <div className="clean-empty-state">
            <h2>Product not found</h2>
            <p>The product you're looking for doesn't exist.</p>
            <button
              type="button"
              className="clean-reset-btn"
              onClick={() => navigate('/')}
            >
              Back to Collection
            </button>
          </div>
        </main>

        <Footer
          onSelectCategory={() => navigate('/')}
          onOpenBucketBuilder={() => navigate('/')}
        />

        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="dryfruit-app-root">
      <ToastContainer />

      <Navbar
        activeTab="collection"
        setActiveTab={() => navigate('/')}
        searchQuery=""
        setSearchQuery={() => {}}
        onOpenBucketBuilder={() => navigate('/')}
        onSelectCategory={() => navigate('/')}
        onNavigate={() => navigate('/')}
      />

      <main className="main-content">
        <ProductDetailsModal
          product={product}
          onClose={handleClose}
        />
      </main>

      <Footer
        onSelectCategory={() => navigate('/')}
        onOpenBucketBuilder={() => navigate('/')}
      />

      <WhatsAppButton />
    </div>
  );
}

export function App() {
  return (
    <SiteDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
        </Routes>
      </BrowserRouter>
    </SiteDataProvider>
  );
}

export default App;