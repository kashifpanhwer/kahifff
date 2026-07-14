/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Tag, Zap, Copy, CheckCircle, Ticket } from 'lucide-react';
import { motion } from 'motion/react';

export const Offers: React.FC = () => {
  const { products, coupons, showToast } = useShop();

  const activeOfferProducts = products.filter(p => p.discountPercent && p.discountPercent > 0);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Coupon code "${code}" copied! Use it at Cart page.`, 'success');
  };

  return (
    <div className="w-full bg-[#F8F9FB] dark:bg-slate-950 py-12 px-4 md:px-8 transition-colors duration-300 text-left">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Page Head */}
        <div className="text-left border-b border-slate-100 dark:border-slate-900 pb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#C7F36B] block mb-1 bg-[#C7F36B]/10 dark:bg-[#C7F36B]/5 px-2.5 py-1 rounded-md w-fit">
            Campaign Hub
          </span>
          <h1 className="text-3xl font-black text-slate-950 dark:text-white leading-tight font-sans">
            Special Offers & Promotions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Claim huge discounts on Sindhri mangoes, honey, Desi Ghee, and apply exclusive store coupon codes.
          </p>
        </div>

        {/* Coupons Banner list */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Ticket className="w-4.5 h-4.5 text-[#C7F36B]" />
            <span>Active Store Coupons</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between"
              >
                {/* Decorative cut circles on sides to make it look like a ticket */}
                <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-[#F8F9FB] dark:bg-slate-950 border-r dark:border-slate-800 rounded-full" />
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-[#F8F9FB] dark:bg-slate-950 border-l dark:border-slate-800 rounded-full" />

                <div className="text-left">
                  <span className="bg-[#C7F36B]/15 text-slate-900 dark:text-[#C7F36B] text-[10px] font-black px-2.5 py-1 rounded-md">
                    Save {coupon.discountPercent}% OFF
                  </span>
                  
                  <h4 className="text-base font-extrabold text-slate-950 dark:text-white mt-4 font-mono tracking-widest uppercase">
                    {coupon.code}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {coupon.description}
                  </p>
                </div>

                <button
                  onClick={() => handleCopyCoupon(coupon.code)}
                  className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-[#C7F36B] hover:text-black dark:hover:bg-[#C7F36B] dark:hover:text-black rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Coupon Code</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Offer products grid */}
        <div className="flex flex-col gap-6 mt-6">
          <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4.5 h-4.5 text-[#C7F36B] fill-current" />
            <span>Discounted Sale items</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeOfferProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
