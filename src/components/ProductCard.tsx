/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, Eye, Star, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isWishlisted, setQuickViewProduct, navigateTo } = useShop();
  
  const wish = isWishlisted(product.id);
  const isOutOfStock = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group bg-white dark:bg-slate-900 rounded-[22px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-[#C7F36B]/30 dark:hover:border-[#C7F36B]/20 transition-all overflow-hidden flex flex-col justify-between"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-center">
        
        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm tracking-wider uppercase">
              -{product.discountPercent}% OFF
            </span>
          )}
          {product.isFlashSale && (
            <span className="bg-[#C7F36B] text-black text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 uppercase tracking-wider">
              <Zap className="w-3 h-3 fill-current" />
              <span>Flash Sale</span>
            </span>
          )}
          {product.isFeatured && !product.isFlashSale && (
            <span className="bg-slate-900 text-white dark:bg-white dark:text-black text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
              Popular
            </span>
          )}
        </div>

        {/* Favorite Trigger Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-4 right-4 z-10 p-2 rounded-full glass-light border border-slate-200/50 dark:border-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-500 hover:text-rose-500 dark:text-slate-400 transition-all shadow-md hover:scale-110 active:scale-95"
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${wish ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Real Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 bg-slate-100"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Quick View Button Hover overlay (Desktop Only) */}
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => setQuickViewProduct(product)}
            className="p-3 rounded-full bg-white text-slate-800 hover:bg-[#C7F36B] hover:text-black shadow-lg hover:scale-110 active:scale-95 transition-all"
            title="Quick View"
          >
            <Eye className="w-4 h-4 font-bold" />
          </button>
          
          {!isOutOfStock && (
            <button
              onClick={() => addToCart(product, 1)}
              className="p-3 rounded-full bg-[#C7F36B] text-black hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black shadow-lg hover:scale-110 active:scale-95 transition-all"
              title="Add To Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Info & Meta details */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div className="flex flex-col gap-1.5 cursor-pointer" onClick={() => navigateTo('product-details', { productId: product.id })}>
          
          {/* Category & Brand details */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#C7F36B] uppercase tracking-widest bg-[#C7F36B]/10 dark:bg-[#C7F36B]/5 px-2 py-0.5 rounded-md">
              {product.category}
            </span>
            <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-bold">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#C7F36B] transition-colors">
            {product.name}
          </h3>

          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium font-sans">
            Brand: {product.brand || 'Local Specialty'} • Unit: {product.unit}
          </p>
        </div>

        {/* Pricing Stage & Add to Cart button */}
        <div className="flex items-center justify-between mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-950 dark:text-white font-sans">
                Rs. {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[11px] text-slate-400 dark:text-slate-500 line-through font-medium">
                  Rs. {product.originalPrice}
                </span>
              )}
            </div>
            
            {/* Stock indicator */}
            <span className={`text-[9px] font-bold mt-1 ${
              isOutOfStock 
                ? 'text-rose-500' 
                : product.stock < 10 
                ? 'text-amber-500' 
                : 'text-emerald-500'
            }`}>
              {isOutOfStock ? 'Out of Stock' : product.stock < 10 ? `Only ${product.stock} left in stock` : 'In Stock'}
            </span>
          </div>

          {/* Add To Cart button (visible on mobile / backup on desktop) */}
          <button
            disabled={isOutOfStock}
            onClick={() => addToCart(product, 1)}
            className={`flex items-center justify-center gap-1 px-4 py-2.5 rounded-[16px] text-xs font-bold shadow-md shadow-black/5 hover:scale-105 active:scale-95 transition-all ${
              isOutOfStock 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-[#C7F36B] text-black hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
