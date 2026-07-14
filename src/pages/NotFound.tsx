/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <div className="w-full bg-[#F8F9FB] dark:bg-slate-950 py-16 px-4 md:px-8 text-center transition-colors duration-300 flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 md:p-12 shadow-sm flex flex-col items-center gap-6">
        
        {/* Error code display */}
        <div className="relative">
          <h1 className="text-8xl font-black text-slate-100 dark:text-slate-800 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#C7F36B] font-extrabold text-sm uppercase tracking-widest bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-3 py-1 rounded-full">
              Lost In Sindh?
            </span>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-lg font-black text-slate-950 dark:text-white uppercase tracking-wider">
            Page Not Found
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            The farm-fresh segment or product link you tried to look up doesn't exist anymore, or has been relocated back to the village warehouses. Let's send you back home.
          </p>
        </div>

        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={() => navigateTo('home')}
            className="w-full bg-[#C7F36B] hover:bg-slate-950 hover:text-white text-black font-extrabold text-xs tracking-wider uppercase py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            Go To Homepage
          </button>

          <button
            onClick={() => navigateTo('products')}
            className="w-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs tracking-wider uppercase py-4 rounded-xl transition-all"
          >
            Browse Food Catalog
          </button>
        </div>

      </div>
    </div>
  );
};
