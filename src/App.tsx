/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { NotificationToast } from './components/NotificationToast';
import { QuickViewModal } from './components/QuickViewModal';

// Pages
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Offers } from './pages/Offers';
import { Wishlist } from './pages/Wishlist';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQPage } from './pages/FAQPage';
import { PrivacyTerms } from './pages/PrivacyTerms';
import { NotFound } from './pages/NotFound';

// Admin Pages
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';

// PWA Install Prompt component
const PWAInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = React.useState(false);

  useEffect(() => {
    const shown = localStorage.getItem('shahmeer_pwa_dismissed');
    if (!shown) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleInstall = () => {
    localStorage.setItem('shahmeer_pwa_dismissed', 'true');
    setShowPrompt(false);
    alert('Thank you! Shahmeer Shop app is being installed on your device launcher.');
  };

  const handleDismiss = () => {
    localStorage.setItem('shahmeer_pwa_dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm w-[90vw] bg-slate-900 border border-white/10 p-5 rounded-2xl shadow-2xl text-left flex flex-col gap-3 backdrop-blur">
      <div>
        <p className="text-xs font-black text-white uppercase tracking-wider">Install Shahmeer Shop App</p>
        <p className="text-[10px] text-slate-400 mt-1">
          Add Shahmeer Shop shortcut directly to your mobile home screen or computer taskbar for quick, offline-capable access.
        </p>
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={handleDismiss} className="text-[10px] text-slate-400 hover:text-white font-black uppercase py-1 px-3">
          Dismiss
        </button>
        <button onClick={handleInstall} className="text-[10px] bg-[#C7F36B] hover:bg-white text-black font-black uppercase py-1.5 px-4 rounded-lg">
          Install App
        </button>
      </div>
    </div>
  );
};

// Central Navigation Controller and layout wrapper
const CentralAppContent: React.FC = () => {
  const { currentPage, isAdminLoggedIn, settings } = useShop();

  // Dynamically update document head meta details for search engine spiders (SEO)
  useEffect(() => {
    if (settings) {
      document.title = settings.metaTitle || 'Shahmeer Shop - Premium Grocery';
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', settings.metaDescription || '');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = settings.metaDescription || '';
        document.head.appendChild(meta);
      }

      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', settings.metaKeywords || '');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = settings.metaKeywords || '';
        document.head.appendChild(meta);
      }
    }
  }, [settings, currentPage]);

  // If inside the executive dashboard, render without header/footer borders
  if (currentPage === 'admin' && isAdminLoggedIn) {
    return (
      <div className="w-full min-h-screen bg-slate-950 text-slate-200">
        <AdminDashboard />
        <NotificationToast />
      </div>
    );
  }

  if (currentPage === 'admin-login') {
    return (
      <div className="w-full min-h-screen bg-slate-950 text-slate-200">
        <AdminLogin />
        <NotificationToast />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-between bg-[#F8F9FB] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-all duration-300">
      
      {/* Dynamic Announcement header bar */}
      {settings?.announcementActive && (
        <div className="bg-[#C7F36B] text-black py-2 px-4 text-center font-black text-[10px] uppercase tracking-widest leading-none select-none">
          ✨ {settings.announcementText}
        </div>
      )}

      {/* Primary storefront header navbar */}
      <Header />

      {/* Main Page Stage area */}
      <main className="flex-1 w-full flex flex-col">
        {currentPage === 'home' && <Home />}
        {currentPage === 'products' && <Products />}
        {currentPage === 'product-details' && <ProductDetails />}
        {currentPage === 'cart' && <Cart />}
        {currentPage === 'checkout' && <Checkout />}
        {currentPage === 'offers' && <Offers />}
        {currentPage === 'wishlist' && <Wishlist />}
        {currentPage === 'about' && <About />}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'faq' && <FAQPage />}
        {currentPage === 'privacy' && <PrivacyTerms type="privacy" />}
        {currentPage === 'terms' && <PrivacyTerms type="terms" />}
        {currentPage === 'not-found' && <NotFound />}
      </main>

      {/* Universal footer */}
      <Footer />

      {/* Overlay modals */}
      <QuickViewModal />
      <NotificationToast />
      <PWAInstallPrompt />

    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <CentralAppContent />
    </ShopProvider>
  );
}
