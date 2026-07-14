/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Search, Heart, ShoppingBag, Menu, X, Sun, Moon, 
  ChevronDown, Sparkles, MapPin, CheckCircle, Apple, 
  Milk, Package, Coffee, Cookie, Settings, LogOut, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Map icon name string to Lucide component
const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Apple': return <Apple className="w-4 h-4" />;
    case 'Milk': return <Milk className="w-4 h-4" />;
    case 'Package': return <Package className="w-4 h-4" />;
    case 'Coffee': return <Coffee className="w-4 h-4" />;
    case 'Cookie': return <Cookie className="w-4 h-4" />;
    case 'Sparkles': return <Sparkles className="w-4 h-4" />;
    default: return <Sparkles className="w-4 h-4" />;
  }
};

export const Header: React.FC = () => {
  const {
    products,
    categories,
    cart,
    wishlist,
    settings,
    currentPage,
    navigateTo,
    theme,
    toggleTheme,
    isAdminLoggedIn,
    setAdminLoggedIn,
    selectedCategorySlug
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<typeof products>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Live Search suggestions
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query))
      ).slice(0, 5);
      setSearchSuggestions(filtered);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, products]);

  // Click outside search dismisses suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      // Navigate to products tab with query parameter
      navigateTo('products');
      // Trigger a custom event to update search in the products page
      setTimeout(() => {
        const searchInput = document.getElementById('grid-search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.value = searchQuery;
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, 100);
    }
  };

  const handleSuggestionClick = (prod: any) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    navigateTo('product-details', { productId: prod.id });
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      {/* Announcement Bar */}
      {settings.announcementActive && (
        <div className="w-full bg-slate-900 text-[#C7F36B] text-center py-2 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 dark:bg-[#C7F36B] dark:text-black">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>{settings.announcementText}</span>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="w-full glass-light border-b border-slate-200/55 dark:border-slate-800/50 py-4 px-4 md:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-[#C7F36B] flex items-center justify-center font-black text-xl shadow-lg group-hover:scale-105 transition-transform duration-300 dark:bg-[#C7F36B] dark:text-black">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-wider text-slate-950 dark:text-white font-sans group-hover:text-[#C7F36B] transition-colors">
                SHAHMEER
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono font-medium -mt-1 dark:text-slate-400">
                Kiryan & Grocery
              </span>
            </div>
          </div>

          {/* Desktop Search Engine */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-lg relative">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search sweet Sindhri mangoes, organic pure Desi Ghee..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-sm font-medium border border-transparent focus:border-[#C7F36B] focus:bg-white dark:focus:bg-slate-900 focus:outline-none dark:text-white transition-all shadow-inner"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </form>

            {/* Instant Suggestions Dropdown */}
            <AnimatePresence>
              {isSearchFocused && (searchQuery.trim().length >= 2 || searchSuggestions.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Suggestions</h4>
                  {searchSuggestions.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {searchSuggestions.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => handleSuggestionClick(prod)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                        >
                          <img src={prod.image} alt={prod.name} className="w-9 h-9 rounded-lg object-cover bg-slate-100" referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{prod.name}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{prod.category} • Rs. {prod.price}/{prod.unit}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 py-2 px-2">No matching products found...</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Icons Panel */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 transition-all"
              aria-label="Theme Toggle"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => navigateTo('wishlist')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 transition-all relative"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-bounce">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Icon */}
            <button
              onClick={() => navigateTo('cart')}
              className="p-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 hover:scale-105 transition-all relative flex items-center gap-1.5 shadow-lg shadow-slate-900/10"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartItems > 0 && (
                <span className="bg-[#C7F36B] text-black dark:bg-slate-900 dark:text-white rounded-full px-1.5 py-0.5 text-[9px] font-black min-w-4 text-center">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Admin status marker if logged in */}
            {isAdminLoggedIn && (
              <button 
                onClick={() => navigateTo('admin')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
              >
                <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Admin Panel</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl md:hidden border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>
        </div>
      </div>

      {/* Navigation Subbar (Desktop Only) */}
      <div className="hidden md:block w-full bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 py-3 px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Leftside: Navigation Links */}
          <nav className="flex items-center gap-6">
            
            {/* Elegant Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-[#C7F36B] hover:text-black dark:hover:bg-[#C7F36B] dark:hover:text-black font-semibold text-xs tracking-wider uppercase transition-all"
              >
                <span>Shop by Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {isCategoryMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50 flex flex-col gap-1"
                  >
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setIsCategoryMenuOpen(false);
                          navigateTo('products', { categorySlug: cat.slug });
                        }}
                        className="flex items-center gap-3 w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                          {getCategoryIcon(cat.icon)}
                        </div>
                        <div className="flex-1">
                          <p>{cat.name}</p>
                          <p className="text-[9px] text-slate-400 font-normal">{cat.productsCount} products available</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Direct Menu Links */}
            <button 
              onClick={() => navigateTo('home')}
              className={`text-xs font-bold uppercase tracking-widest hover:text-[#C7F36B] transition-colors ${currentPage === 'home' ? 'text-[#C7F36B] dark:text-[#C7F36B]' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Home
            </button>

            <button 
              onClick={() => navigateTo('products')}
              className={`text-xs font-bold uppercase tracking-widest hover:text-[#C7F36B] transition-colors ${currentPage === 'products' && !selectedCategorySlug ? 'text-[#C7F36B] dark:text-[#C7F36B]' : 'text-slate-600 dark:text-slate-300'}`}
            >
              All Products
            </button>

            <button 
              onClick={() => navigateTo('offers')}
              className={`text-xs font-bold uppercase tracking-widest hover:text-[#C7F36B] transition-colors ${currentPage === 'offers' ? 'text-[#C7F36B] dark:text-[#C7F36B]' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Offers
            </button>

            <button 
              onClick={() => navigateTo('about')}
              className={`text-xs font-bold uppercase tracking-widest hover:text-[#C7F36B] transition-colors ${currentPage === 'about' ? 'text-[#C7F36B] dark:text-[#C7F36B]' : 'text-slate-600 dark:text-slate-300'}`}
            >
              About Shop
            </button>

            <button 
              onClick={() => navigateTo('contact')}
              className={`text-xs font-bold uppercase tracking-widest hover:text-[#C7F36B] transition-colors ${currentPage === 'contact' ? 'text-[#C7F36B] dark:text-[#C7F36B]' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Contact
            </button>
          </nav>

          {/* Rightside: Fast Location / Store Info */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <MapPin className="w-4 h-4 text-[#C7F36B] animate-bounce" />
            <span>Mirpurkhas, Sindh</span>
          </div>

        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 top-[110px] bg-slate-900/40 backdrop-blur-md z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-6">
                
                {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search fresh products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm font-medium focus:outline-none dark:text-white"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </form>

                {/* Navigation Links */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b pb-2 dark:border-slate-800">Navigation</h4>
                  
                  <button 
                    onClick={() => { navigateTo('home'); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-left font-bold text-sm text-slate-800 dark:text-slate-100 hover:text-[#C7F36B] transition-colors"
                  >
                    Home
                  </button>
                  
                  <button 
                    onClick={() => { navigateTo('products'); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-left font-bold text-sm text-slate-800 dark:text-slate-100 hover:text-[#C7F36B] transition-colors"
                  >
                    All Products
                  </button>

                  <button 
                    onClick={() => { navigateTo('offers'); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-left font-bold text-sm text-slate-800 dark:text-slate-100 hover:text-[#C7F36B] transition-colors"
                  >
                    Special Offers
                  </button>

                  <button 
                    onClick={() => { navigateTo('about'); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-left font-bold text-sm text-slate-800 dark:text-slate-100 hover:text-[#C7F36B] transition-colors"
                  >
                    About Shahmeer Shop
                  </button>

                  <button 
                    onClick={() => { navigateTo('contact'); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-left font-bold text-sm text-slate-800 dark:text-slate-100 hover:text-[#C7F36B] transition-colors"
                  >
                    Contact & Location
                  </button>
                </div>

                {/* Categories */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b pb-2 dark:border-slate-800">Categories</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          navigateTo('products', { categorySlug: cat.slug });
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-[#C7F36B]/25 transition-colors"
                      >
                        {getCategoryIcon(cat.icon)}
                        <span className="truncate">{cat.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Mobile Sidebar Footer info */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-4">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span>Imzaiz Panhwar, Mirpurkhas</span>
                </div>
                {isAdminLoggedIn ? (
                  <button
                    onClick={() => {
                      setAdminLoggedIn(false);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full justify-center py-2.5 px-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout Admin</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigateTo('admin-login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full justify-center py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-[#C7F36B] hover:text-black transition-all"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Admin Access</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
