/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, Grid, Filter, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Products: React.FC = () => {
  const { products, categories, selectedCategorySlug, navigateTo } = useShop();

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(2500);
  const [stockStatus, setStockStatus] = useState<'all' | 'instock' | 'out'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'low-high' | 'high-low' | 'discount' | 'title'>('popular');
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Sync with selectedCategorySlug from header context
  useEffect(() => {
    if (selectedCategorySlug) {
      setActiveCategory(selectedCategorySlug);
    } else {
      setActiveCategory('all');
    }
  }, [selectedCategorySlug]);

  // Support listening to Header live search input
  useEffect(() => {
    const handleHeaderSearchInput = (e: any) => {
      const searchVal = e.target.value;
      setSearchQuery(searchVal);
    };
    
    const inputElement = document.getElementById('grid-search-input');
    if (inputElement) {
      inputElement.addEventListener('input', handleHeaderSearchInput);
    }
    return () => {
      if (inputElement) {
        inputElement.removeEventListener('input', handleHeaderSearchInput);
      }
    };
  }, []);

  const maxPriceLimit = useMemo(() => {
    if (products.length === 0) return 3000;
    return Math.max(...products.map(p => p.price));
  }, [products]);

  // Reset local sliders when max price changes
  useEffect(() => {
    setPriceRange(maxPriceLimit);
  }, [maxPriceLimit]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query) || 
        (p.brand && p.brand.toLowerCase().includes(query))
      );
    }

    // Filter by Category
    if (activeCategory !== 'all') {
      const selectedCat = categories.find(c => c.slug === activeCategory);
      if (selectedCat) {
        result = result.filter(p => p.categoryId === selectedCat.id);
      }
    }

    // Filter by Price Range
    result = result.filter(p => p.price <= priceRange);

    // Filter by Stock
    if (stockStatus === 'instock') {
      result = result.filter(p => p.stock > 0);
    } else if (stockStatus === 'out') {
      result = result.filter(p => p.stock <= 0);
    }

    // Sort Products
    if (sortBy === 'popular') {
      result.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
    } else if (sortBy === 'low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      result.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, searchQuery, activeCategory, priceRange, stockStatus, sortBy, categories]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setPriceRange(maxPriceLimit);
    setStockStatus('all');
    setSortBy('popular');
    setVisibleCount(8);
    navigateTo('products');
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 4);
      setIsLoadingMore(false);
    }, 600);
  };

  return (
    <div className="w-full bg-[#F8F9FB] dark:bg-slate-950 py-10 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Page Head Header info */}
        <div className="text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#C7F36B] block mb-1 bg-[#C7F36B]/10 dark:bg-[#C7F36B]/5 px-2.5 py-1 rounded-md w-fit">
            Store Catalogue
          </span>
          <h1 className="text-3xl font-black text-slate-950 dark:text-white leading-tight font-sans">
            Browse All Groceries
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search our absolute highest standard collection of grains, fruits, dairy, and local rural sweets of Sindh.
          </p>
        </div>

        {/* Toolbar Stage with Search and Filter buttons */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Internal Live Search bar */}
          <div className="relative w-full lg:max-w-md">
            <input
              type="text"
              id="grid-search-input"
              placeholder="Search by name, brand, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 text-sm font-medium border border-slate-100 dark:border-slate-800 focus:border-[#C7F36B] focus:outline-none dark:text-white shadow-sm transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          </div>

          <div className="flex w-full lg:w-auto items-center justify-between lg:justify-end gap-3">
            {/* Show filters toggle button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl border font-bold text-xs transition-all ${
                showFilters || activeCategory !== 'all' || stockStatus !== 'all' || priceRange < maxPriceLimit
                  ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950 dark:border-white'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-150 dark:border-slate-800'
              }`}
            >
              <SlidersHorizontal className="w-4.5 h-4.5" />
              <span>{showFilters ? 'Hide Filters' : 'Filters'}</span>
              {(activeCategory !== 'all' || stockStatus !== 'all' || priceRange < maxPriceLimit) && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#C7F36B] animate-pulse" />
              )}
            </button>

            {/* Sort options dropdown */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 px-4 py-3 shadow-sm">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none border-none cursor-pointer"
              >
                <option value="popular">Popularity</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters drawer panels */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden w-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm text-left">
                
                {/* Categorized selector tabs */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <span>Store Categories</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveCategory('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeCategory === 'all'
                          ? 'bg-[#C7F36B] text-black'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      All Catalog
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.slug)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          activeCategory === cat.slug
                            ? 'bg-[#C7F36B] text-black'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing slider range */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    <span>Max Price Budget</span>
                  </h4>
                  <input
                    type="range"
                    min="10"
                    max={maxPriceLimit}
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#C7F36B] bg-slate-100 dark:bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mt-1">
                    <span>Rs. 10</span>
                    <span className="text-[#C7F36B] bg-[#C7F36B]/10 px-2 py-0.5 rounded-md font-sans">
                      Under Rs. {priceRange}
                    </span>
                    <span>Rs. {maxPriceLimit}</span>
                  </div>
                </div>

                {/* Stock selectors */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    <span>Stock Availability</span>
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStockStatus('all')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        stockStatus === 'all'
                          ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950 dark:border-white'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-150 dark:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      Show All
                    </button>
                    
                    <button
                      onClick={() => setStockStatus('instock')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        stockStatus === 'instock'
                          ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950 dark:border-white'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-150 dark:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      In Stock
                    </button>
                  </div>

                  <button
                    onClick={handleResetFilters}
                    className="mt-4 text-xs font-bold text-[#C7F36B] hover:underline flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categorized Quick Pills Indicator */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => { setActiveCategory('all'); navigateTo('products'); }}
            className={`px-4 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all ${
              activeCategory === 'all'
                ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.slug); navigateTo('products', { categorySlug: cat.slug }); }}
              className={`px-4 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                activeCategory === cat.slug
                  ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Counter information */}
        <div className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-4">
          <span>Found {filteredProducts.length} premium product(s)</span>
          {activeCategory !== 'all' && (
            <span className="text-[#C7F36B] font-mono uppercase text-[10px]">Filter Active: {activeCategory}</span>
          )}
        </div>

        {/* Real Product Catalogue Grid or Empty Stage */}
        {filteredProducts.length > 0 ? (
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.slice(0, visibleCount).map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>

            {/* Pagination / Load more button */}
            {visibleCount < filteredProducts.length && (
              <div className="flex items-center justify-center mt-6">
                <button
                  disabled={isLoadingMore}
                  onClick={handleLoadMore}
                  className="flex items-center justify-center gap-2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-xs uppercase tracking-widest py-4 px-10 rounded-full hover:bg-[#C7F36B] hover:text-black dark:hover:bg-[#C7F36B] dark:hover:text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-xl"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Loading Fresh Batches...</span>
                    </>
                  ) : (
                    <span>Load More Products</span>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
              <Grid className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-slate-950 dark:text-white">No Groceries Match Your Criteria</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
              We couldn't find any products matching your specific query. Try relaxing your budget slider or clearing your search term.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 bg-[#C7F36B] hover:bg-slate-950 hover:text-white text-black font-extrabold text-xs tracking-wider uppercase py-3 px-6 rounded-xl transition-all"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
};
