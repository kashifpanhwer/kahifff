/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const Wishlist: React.FC = () => {
  const { wishlist, products, navigateTo } = useShop();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlist.length === 0) {
    return (
      <div className="w-full bg-[#F8F9FB] dark:bg-slate-950 py-16 px-4 md:px-8 text-center transition-colors duration-300">
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 md:p-12 shadow-sm flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-inner">
            <Heart className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Your Wishlist is Empty</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Looks like you haven't favorited any premium items yet. Go to catalog and tap the heart icon to curate your personal collection of favorite groceries!
            </p>
          </div>
          <button
            onClick={() => navigateTo('products')}
            className="w-full bg-[#C7F36B] hover:bg-slate-950 hover:text-white text-black font-extrabold text-xs tracking-wider uppercase py-4 rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            Explore Catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8F9FB] dark:bg-slate-950 py-10 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Page Head */}
        <div className="text-left border-b border-slate-100 dark:border-slate-900 pb-4 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Your Saved Items</span>
            <h1 className="text-3xl font-black text-slate-950 dark:text-white leading-tight font-sans">
              Curated Wishlist
            </h1>
          </div>
          
          <button
            onClick={() => navigateTo('products')}
            className="group flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-[#C7F36B] transition-colors"
          >
            <span>Back to Shop</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Saved Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

      </div>
    </div>
  );
};
