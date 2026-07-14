/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { MessageCircle, ShoppingBag, ArrowLeft, CheckCircle2, FileText, Printer, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../storage/db';

export const Checkout: React.FC = () => {
  const {
    cart,
    clearCart,
    getCartSubtotal,
    getCartDiscount,
    getCartTotal,
    appliedCoupon,
    navigateTo,
    settings,
    showToast
  } = useShop();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const delivery = subtotal >= 1000 ? 0 : settings.deliveryCharges;
  const total = getCartTotal();

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      showToast('Please fill out all the shipping details.', 'error');
      return;
    }

    setIsOrdering(true);

    setTimeout(() => {
      // Generate a unique order ID
      const orderId = 'SHM-' + Math.floor(100000 + Math.random() * 900000).toString();
      
      // Construct Order detail schema
      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        customerName,
        phone: customerPhone,
        address: customerAddress,
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          unit: item.product.unit
        })),
        subtotal,
        deliveryCharges: delivery,
        couponCode: appliedCoupon?.code || '',
        discountAmount: discount,
        total,
        status: 'Pending' as const
      };

      // Add to local database layer
      db.addOrder(newOrder);

      // Generate invoice text for WhatsApp
      let itemsListText = '';
      cart.forEach((item, index) => {
        itemsListText += `${index + 1}. *${item.product.name}*\n   Qty: ${item.quantity} ${item.product.unit} @ Rs.${item.product.price} = *Rs.${item.product.price * item.quantity}*\n`;
      });

      const invoiceText = 
`━━━━━━━━━━━━━━━━━━━━━━
🌟 *SHAHMEER SHOP - DIGITAL INVOICE* 🌟
━━━━━━━━━━━━━━━━━━━━━━
*Order ID:* ${orderId}
*Date:* ${new Date().toLocaleDateString('en-PK')} ${new Date().toLocaleTimeString('en-PK')}

👤 *CUSTOMER DETAILS:*
*Name:* ${customerName}
*Phone:* ${customerPhone}
*Address:* ${customerAddress}

📦 *ITEMS ORDERED:*
${itemsListText}
💰 *BILLING SUMMARY:*
*Subtotal:* Rs. ${subtotal}
${appliedCoupon ? `*Coupon Applied:* ${appliedCoupon.code} (-${appliedCoupon.discountPercent}%)\n*Discount:* -Rs. ${discount}\n` : ''}*Delivery Charges:* ${delivery === 0 ? 'FREE' : `Rs. ${delivery}`}
━━━━━━━━━━━━━━━━━━━━━━
🔥 *TOTAL BILL:* *Rs. ${total}*
━━━━━━━━━━━━━━━━━━━━━━
⚠️ *Payment Mode:* Cash on Delivery (COD)
📍 *Location:* Village Imzaiz Panhwar, Mirpurkhas, Sindh

Developed by Kashif
━━━━━━━━━━━━━━━━━━━━━━
_Please process my order as soon as possible. Thank you!_`;

      // Construct WhatsApp Direct Endpoint
      const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(invoiceText)}`;
      
      setPlacedOrderId(orderId);
      setIsOrdering(false);
      setIsOrderPlaced(true);

      // Instantly open WhatsApp in new tab
      window.open(waUrl, '_blank');
      
      // Clear shopping cart state securely
      clearCart();
      showToast('Invoice generated! Directing to WhatsApp...', 'success');
    }, 1500);
  };

  // Safe Guard: If cart is empty and order is not placed yet, send back to home
  if (cart.length === 0 && !isOrderPlaced) {
    return (
      <div className="w-full bg-[#F8F9FB] dark:bg-slate-950 py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border rounded-3xl p-8 shadow-sm">
          <ShoppingBag className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <p className="text-sm text-slate-500 font-bold">Checkout is locked. No items in basket.</p>
          <button onClick={() => navigateTo('home')} className="mt-6 bg-[#C7F36B] text-black font-extrabold text-xs uppercase px-6 py-2.5 rounded-xl">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Success view
  if (isOrderPlaced) {
    return (
      <div className="w-full bg-[#F8F9FB] dark:bg-slate-950 py-16 px-4 md:px-8 transition-colors duration-300">
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 md:p-12 shadow-2xl text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Invoice Generated
            </span>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white mt-4 font-sans">
              Thank You for Your Order!
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Your digital invoice <strong className="text-slate-900 dark:text-white">#{placedOrderId}</strong> has been generated successfully and sent to our official WhatsApp support channel.
            </p>
          </div>

          {/* Quick Order details */}
          <div className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span>Customer Name</span>
              <span className="font-extrabold text-slate-950 dark:text-white">{customerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Contact Phone</span>
              <span className="font-extrabold text-slate-950 dark:text-white font-mono">{customerPhone}</span>
            </div>
            <div className="flex items-center justify-between border-t dark:border-slate-800 pt-2 mt-1">
              <span>Deliver To</span>
              <span className="font-extrabold text-slate-950 dark:text-white truncate max-w-[200px]">{customerAddress}</span>
            </div>
            <div className="flex items-center justify-between border-t dark:border-slate-800 pt-2 mt-1 text-sm text-slate-950 dark:text-white font-bold">
              <span>Total Bill (COD)</span>
              <span className="font-sans font-black text-[#C7F36B]">Rs. {total}</span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            {/* Direct button to launch WhatsApp again if blocked or failed */}
            <button
              onClick={() => {
                showToast('Re-dispatching order to WhatsApp...', 'info');
                // Simulating redispatch trigger
                const orderHistory = db.getOrders();
                const ord = orderHistory.find(o => o.id === placedOrderId);
                if (ord) {
                  let itemsListText = '';
                  ord.items.forEach((item, index) => {
                    itemsListText += `${index + 1}. *${item.productName}*\n   Qty: ${item.quantity} ${item.unit} @ Rs.${item.price} = *Rs.${item.price * item.quantity}*\n`;
                  });
                  const reText = `━━━━━━━━━━━━━━━━━━━━━━\n🌟 *SHAHMEER SHOP - DIGITAL INVOICE* 🌟\n━━━━━━━━━━━━━━━━━━━━━━\n*Order ID:* ${ord.id}\n*Date:* ${new Date(ord.date).toLocaleDateString('en-PK')}\n\n👤 *CUSTOMER DETAILS:*\n*Name:* ${ord.customerName}\n*Phone:* ${ord.phone}\n*Address:* ${ord.address}\n\n📦 *ITEMS ORDERED:*\n${itemsListText}\n💰 *BILLING SUMMARY:*\n*Subtotal:* Rs. ${ord.subtotal}\n${ord.couponCode ? `*Coupon Applied:* ${ord.couponCode}\n*Discount:* -Rs. ${ord.discountAmount}\n` : ''}*Delivery Charges:* ${ord.deliveryCharges === 0 ? 'FREE' : `Rs. ${ord.deliveryCharges}`}\n━━━━━━━━━━━━━━━━━━━━━━\n🔥 *TOTAL BILL:* *Rs. ${ord.total}*\n━━━━━━━━━━━━━━━━━━━━━━\n📍 *Location:* Village Imzaiz Panhwar, Mirpurkhas, Sindh\nDeveloped by Kashif`;
                  window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(reText)}`, '_blank');
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs tracking-wider uppercase py-4 rounded-xl transition-all hover:scale-105"
            >
              <MessageCircle className="w-4.5 h-4.5" />
              <span>Retry Send on WhatsApp</span>
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="w-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs tracking-wider uppercase py-4 rounded-xl transition-all"
            >
              Return To Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8F9FB] dark:bg-slate-950 py-10 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Page Head */}
        <div className="text-left flex items-center gap-4 border-b border-slate-100 dark:border-slate-900 pb-4">
          <button
            onClick={() => navigateTo('cart')}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300 transition-all"
            title="Go back to cart"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Secure Checkout Gateway</span>
            <h1 className="text-3xl font-black text-slate-950 dark:text-white leading-tight font-sans">
              Enter Delivery Details
            </h1>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Left: Input Shipping Form */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-6 md:p-8 shadow-sm text-left">
              <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider mb-6 pb-2 border-b dark:border-slate-800 flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-slate-400" />
                <span>Shipping Details</span>
              </h3>

              <form onSubmit={handleOrderSubmit} className="flex flex-col gap-5">
                
                {/* Full name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Your Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your first and last name..."
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#C7F36B] focus:bg-white dark:focus:bg-slate-900 transition-all"
                  />
                </div>

                {/* WhatsApp number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Your WhatsApp Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 03192616627 or +92..."
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#C7F36B] focus:bg-white dark:focus:bg-slate-900 transition-all font-mono"
                  />
                </div>

                {/* Full delivery address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Complete Physical Shipping Address</label>
                  <textarea
                    rows={4}
                    placeholder="Provide complete street, landmark, sector details in Village Imzaiz Panhwar, rural areas or Mirpurkhas City..."
                    required
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#C7F36B] focus:bg-white dark:focus:bg-slate-900 transition-all"
                  />
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400 text-xs leading-relaxed flex items-start gap-2.5">
                  <Printer className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <strong className="block mb-0.5">Note on payment processing:</strong>
                    We support direct <strong>Cash on Delivery (COD)</strong> inside Sindh. No digital payment gateway setup is required. Standard billing details are generated instantly on WhatsApp dispatch.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isOrdering}
                  className="w-full bg-[#C7F36B] hover:bg-slate-950 hover:text-white text-black dark:hover:bg-white dark:hover:text-black py-4 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-[#C7F36B]/10"
                >
                  {isOrdering ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Generating Premium Bill Invoice...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4.5 h-4.5" />
                      <span>Confirm Order via WhatsApp</span>
                    </>
                  )}
                </button>

              </form>

            </div>
          </div>

          {/* Right: Premium Digital Invoice Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-6 shadow-sm text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-950 dark:bg-white" />
              
              <div className="flex items-center justify-between border-b dark:border-slate-800 pb-4 mb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">Digital Bill</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Shahmeer Shop Invoice Preview</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>

              {/* Items Summary list */}
              <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-start gap-4 text-xs">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{item.product.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.quantity} {item.product.unit} @ Rs. {item.product.price}</p>
                    </div>
                    <span className="font-extrabold text-slate-950 dark:text-white font-mono">Rs. {item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="border-t border-dashed dark:border-slate-800 pt-4 mt-4 flex flex-col gap-3 text-xs font-bold text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">Rs. {subtotal}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Coupon Promo Code ({appliedCoupon.code})</span>
                    <span>-Rs. {discount}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span>Standard Delivery Charges</span>
                  <span>{delivery === 0 ? 'FREE' : `Rs. ${delivery}`}</span>
                </div>

                {/* Final Total */}
                <div className="flex items-center justify-between border-t border-dashed dark:border-slate-800 pt-4 mt-2 text-sm font-black text-slate-950 dark:text-white">
                  <span>GRAND TOTAL</span>
                  <span className="font-sans text-lg text-slate-950 dark:text-white font-black">
                    Rs. {total}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-400 leading-relaxed font-semibold text-center uppercase tracking-wider">
                📍 Village Imzaiz Panhwar • COD Gateway Active
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
