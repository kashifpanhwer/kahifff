/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Heart, ShoppingBag, Star, Share2, MessageCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isWishlisted, showToast, settings } = useShop();
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const wish = isWishlisted(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/#product-details/${product.id}`);
    showToast('Product link copied to clipboard!', 'success');
  };

  const handleWhatsAppOrder = () => {
    const text = `Assalamu Alaikum Shahmeer Shop, I want to order:\n\n*${product.name}*\nQty: ${quantity} ${product.unit}\nPrice: Rs. ${product.price}/${product.unit}\nTotal: Rs. ${product.price * quantity}\n\nPlease deliver to my address.`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
          onClick={() => setQuickViewProduct(null)}
        />

        {/* Modal Stage container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative max-w-3xl w-full bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-none"
        >
          {/* Close button absolute */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#C7F36B] hover:text-black dark:text-slate-300 transition-colors shadow-md"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Leftside: Hero Product Image */}
          <div className="md:w-1/2 bg-slate-50 dark:bg-slate-950 p-6 flex items-center justify-center relative">
            <div className="absolute top-4 left-4 z-10">
              {product.discountPercent && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>
            
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-square object-cover rounded-2xl shadow-md bg-slate-100"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Rightside: Full Detailed Form & Specs */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-[600px]">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C7F36B] bg-[#C7F36B]/15 dark:bg-[#C7F36B]/5 px-2.5 py-1 rounded-lg">
                  {product.category}
                </span>
                
                <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-xl font-extrabold text-slate-950 dark:text-white leading-snug">
                {product.name}
              </h2>

              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1 font-mono uppercase tracking-wider">
                Brand: {product.brand || 'Local Specialty'} • Packaging: {product.unit}
              </p>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl font-black text-slate-950 dark:text-white">
                  Rs. {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through font-medium">
                    Rs. {product.originalPrice}
                  </span>
                )}
                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  {isOutOfStock ? 'Sold Out' : 'Ready to Ship'}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-4 font-normal line-clamp-4">
                {product.description}
              </p>
            </div>

            {/* Selection & CTA Actions */}
            <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
              
              {/* Qty controller */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Select Quantity</span>
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-full p-1 border dark:border-slate-800">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold hover:bg-[#C7F36B] hover:text-black transition-colors disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-800 dark:text-slate-200">
                    {quantity}
                  </span>
                  <button
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold hover:bg-[#C7F36B] hover:text-black transition-colors disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    disabled={isOutOfStock}
                    onClick={() => {
                      addToCart(product, quantity);
                      setQuickViewProduct(null);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs shadow-lg shadow-[#C7F36B]/10 hover:scale-[1.02] active:scale-95 transition-all ${
                      isOutOfStock
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-[#C7F36B] hover:text-black dark:hover:bg-[#C7F36B] dark:hover:text-black'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {quantity} to Cart (Rs. {product.price * quantity})</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-500 hover:text-rose-500 dark:text-slate-400 transition-all shadow-md"
                  >
                    <Heart className={`w-4 h-4 ${wish ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Instant Order via WhatsApp */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/10 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Direct Order via WhatsApp</span>
                </button>

                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-2">
                  <button onClick={handleShare} className="flex items-center gap-1 hover:text-[#C7F36B]">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Product</span>
                  </button>
                  <span className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-slate-600" />
                    <span>Store ID: {product.id}</span>
                  </span>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
