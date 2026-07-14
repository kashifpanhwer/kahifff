/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, Sparkles, Tag, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Cart: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    getCartSubtotal,
    getCartDiscount,
    getCartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigateTo,
    settings
  } = useShop();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const delivery = subtotal >= 1000 ? 0 : settings.deliveryCharges;
  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="w-full bg-[#F8F9FB] dark:bg-slate-950 py-16 px-4 md:px-8 text-center transition-colors duration-300">
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 md:p-12 shadow-sm flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-inner">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Your Shopping Cart is Empty</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Looks like you haven't added any fresh Sindhri mangoes, pure Desi Ghee, or grains to your basket yet. Let's browse some fresh items!
            </p>
          </div>
          <button
            onClick={() => navigateTo('products')}
            className="w-full bg-[#C7F36B] hover:bg-slate-950 hover:text-white text-black font-extrabold text-xs tracking-wider uppercase py-4 rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            Browse Fresh Catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8F9FB] dark:bg-slate-950 py-10 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Page Head */}
        <div className="text-left border-b border-slate-100 dark:border-slate-900 pb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Basket Overview</span>
          <h1 className="text-3xl font-black text-slate-950 dark:text-white leading-tight font-sans">
            Your Shopping Cart
          </h1>
        </div>

        {/* Cart Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Area: Cart Items Table */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider mb-2 text-left">Cart Items</h3>
            
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-slate-900 rounded-[22px] border border-slate-100 dark:border-slate-800 p-4 md:p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-4 text-left justify-between"
                  >
                    {/* Item Thumbnail & info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover bg-slate-50 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-[#C7F36B] uppercase tracking-wider block bg-[#C7F36B]/10 w-fit px-1.5 py-0.5 rounded">
                          {item.product.category}
                        </span>
                        <h4 className="text-xs md:text-sm font-bold text-slate-950 dark:text-white truncate mt-1">
                          {item.product.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                          Unit Price: Rs. {item.product.price} / {item.product.unit}
                        </p>
                      </div>
                    </div>

                    {/* Qty and Subtotal controls */}
                    <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                      
                      {/* Qty controllers */}
                      <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 rounded-full p-1 border dark:border-slate-800">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold hover:bg-[#C7F36B] hover:text-black transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-800 dark:text-slate-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold hover:bg-[#C7F36B] hover:text-black transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Total Price */}
                      <div className="text-right min-w-[80px]">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Subtotal</p>
                        <p className="text-sm font-black text-slate-950 dark:text-white">
                          Rs. {item.product.price * item.quantity}
                        </p>
                      </div>

                      {/* Remove item button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                        title="Remove from Cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Area: Order Summary */}
          <div className="flex flex-col gap-6 text-left">
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider mb-2">Order Summary</h3>

            {/* Price Calculations Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-6 shadow-sm flex flex-col gap-4">
              
              {/* Promo Coupon Entry */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-emerald-800 dark:text-emerald-300">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-500" />
                      <div>
                        <p className="text-xs font-bold uppercase">{appliedCoupon.code}</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Coupon code is applied! ({appliedCoupon.discountPercent}% OFF)</p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="p-1 rounded bg-black/5 hover:bg-black/10 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo coupon..."
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-white uppercase placeholder-slate-400 focus:outline-none focus:border-[#C7F36B]"
                    />
                    <button
                      type="submit"
                      className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-[#C7F36B] hover:text-black dark:hover:bg-[#C7F36B] dark:hover:text-black px-4 rounded-xl text-xs font-extrabold uppercase transition-all"
                    >
                      Apply
                    </button>
                  </form>
                )}
                
                {/* Coupon helper cues */}
                {!appliedCoupon && (
                  <div className="flex gap-1.5 flex-wrap mt-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Coupons:</span>
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded">SHAHMEER5</span>
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded">SINDHRI10</span>
                  </div>
                )}
              </div>

              {/* Price rows */}
              <div className="flex flex-col gap-3.5 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs font-bold text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-extrabold text-slate-950 dark:text-white">Rs. {subtotal}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount Coupon ({appliedCoupon.discountPercent}%)</span>
                    <span>-Rs. {discount}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span>Standard Delivery</span>
                  {delivery === 0 ? (
                    <span className="text-emerald-500 font-extrabold uppercase tracking-wide">FREE Delivery</span>
                  ) : (
                    <span className="font-extrabold text-slate-950 dark:text-white">Rs. {delivery}</span>
                  )}
                </div>

                {/* Free Delivery alert banner */}
                {subtotal < 1000 && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400 text-[10px] leading-relaxed flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0 animate-pulse" />
                    <span>Add items of <strong>Rs. {1000 - subtotal}</strong> more to qualify for <strong>FREE Delivery!</strong></span>
                  </div>
                )}
              </div>

              {/* Final total block */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Order Total</span>
                <span className="text-xl font-black text-slate-950 dark:text-white font-sans">
                  Rs. {total}
                </span>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => navigateTo('checkout')}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-[#C7F36B] hover:bg-slate-950 hover:text-white text-black dark:hover:bg-white dark:hover:text-black py-4 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#C7F36B]/15"
              >
                <span>Proceed To Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateTo('products')}
                className="w-full text-center text-xs font-bold text-slate-400 hover:text-[#C7F36B] mt-1 hover:underline"
              >
                Continue Shopping
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
