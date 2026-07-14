/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, FileText, CheckCircle } from 'lucide-react';

export const PrivacyTerms: React.FC<{ type: 'privacy' | 'terms' }> = ({ type }) => {
  return (
    <div className="w-full bg-[#F8F9FB] dark:bg-slate-950 py-12 px-4 md:px-8 transition-colors duration-300 text-left">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 md:p-10 shadow-sm">
        
        {/* Policy Head */}
        <div className="flex items-center gap-4 border-b dark:border-slate-800 pb-6 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-[#C7F36B] flex items-center justify-center">
            {type === 'privacy' ? <Shield className="w-6 h-6 text-slate-950 dark:text-[#C7F36B]" /> : <FileText className="w-6 h-6 text-slate-950 dark:text-[#C7F36B]" />}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-950 dark:text-white leading-tight font-sans">
              {type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
            </h1>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-0.5">
              Last updated: July 13, 2026 • Shahmeer Shop standard guidelines
            </p>
          </div>
        </div>

        {/* Policy body contents */}
        {type === 'privacy' ? (
          <div className="flex flex-col gap-6 text-xs md:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
            <div>
              <h3 className="text-sm font-extrabold text-slate-950 dark:text-white uppercase tracking-wider mb-2">1. Information We Collect</h3>
              <p>
                At Shahmeer Shop, we value our customers' privacy above everything else. Because we process orders exclusively via WhatsApp redirect, we do NOT maintain persistent online tracking, cookie aggregations, or advertising user profiles. We only collect the basic delivery details you provide on checkout (Name, contact phone, delivery physical address) to facilitate immediate cash on delivery fulfillment.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-slate-950 dark:text-white uppercase tracking-wider mb-2">2. How Your Data is Used</h3>
              <p>
                Your shipping name, phone number, and location address are compiled into a temporary digital invoice which you approve and transmit directly to our WhatsApp support number. We utilize this detail solely to load our delivery bikes, transport your groceries securely, and verify payment upon arrival.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-slate-950 dark:text-white uppercase tracking-wider mb-2">3. Storage & Encryption</h3>
              <p>
                Our billing logs are stored locally inside your browser cache using sandboxed standard LocalStorage. We do not transmit or sell your contact or physical location data to external third-party advertisers, market analyzers, or telemetry brokers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#C7F36B]/5 border border-[#C7F36B]/20 text-slate-800 dark:text-slate-300">
              <span className="font-extrabold block mb-1">🔒 Absolute Data Protection Guard</span>
              If you wish to purge all of your checkout order histories, wishlist, and cart lists instantly from this browser, you can request database wipe-out through our settings panel or clear your browser standard cookies.
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 text-xs md:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
            <div>
              <h3 className="text-sm font-extrabold text-slate-950 dark:text-white uppercase tracking-wider mb-2">1. Agreement to Terms</h3>
              <p>
                By browsing Shahmeer Shop website or ordering from our rural specialties catalog, you agree to follow our standard store guidelines. We reserve the absolute right to modify product prices, stock details, and delivery regions based on farm crop harvesting yields and weather circumstances.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-slate-950 dark:text-white uppercase tracking-wider mb-2">2. WhatsApp Order Dispatching</h3>
              <p>
                We do not establish any online credit card or bank card transactions. All checkouts are processed on a direct Cash on Delivery (COD) basis. By clicking "Confirm Order via WhatsApp", you authorize our support representatives to coordinate with your provided phone number to execute physical delivery.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-slate-950 dark:text-white uppercase tracking-wider mb-2">3. Free Delivery Rules</h3>
              <p>
                To qualify for complimentary FREE delivery inside Village Imzaiz Panhwar, the final invoice subtotal after coupon deductions must be greater than or equal to Rs. 1000. Orders below this threshold are subject to our standard rural transport surcharge of Rs. 100.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-slate-300">
              <span className="font-extrabold block mb-1">✅ Quality Fresh Guarantee</span>
              Since our mangoes, Desi Ghee, and fresh buffalo milk are sourced directly from rural villages, you have the absolute right to inspect the quality of the fresh produce on delivery before completing your payment. If any item is found sub-par, we will replace it free of cost!
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
