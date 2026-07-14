/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Shield, FileText, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, settings } = useShop();

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-950 text-slate-400 font-sans mt-auto border-t border-slate-900 transition-colors duration-300">
      
      {/* Upper Area with Back To Top */}
      <div className="w-full border-b border-slate-900 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C7F36B] text-black flex items-center justify-center font-black text-lg">
              S
            </div>
            <span className="font-extrabold text-base tracking-widest text-white">
              SHAHMEER SHOP
            </span>
          </div>

          <button
            onClick={handleBackToTop}
            className="flex items-center gap-2 text-xs font-extrabold tracking-widest uppercase text-slate-300 hover:text-[#C7F36B] transition-colors py-2 px-4 rounded-xl border border-slate-900 hover:border-[#C7F36B]/25 bg-slate-900/50"
          >
            <span>Back To Top</span>
            <ArrowUp className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 py-12 px-4 md:px-8">
        
        {/* Col 1: Brand Pitch & Socials */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white text-xs font-extrabold uppercase tracking-widest">Our Mission</h4>
          <p className="text-sm text-slate-500 leading-relaxed font-normal">
            To provide fresh, premium quality groceries and local specialities of Sindh to our customers in Village Imzaiz Panhwar and Mirpurkhas. Pure Desi Ghee, fresh buffalo milk, and pure Sindhri mangoes sourced with absolute love and integrity.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-[#C7F36B] hover:text-black text-slate-400 transition-all">
              <Facebook className="w-4 h-4" />
            </a>
            <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-[#C7F36B] hover:text-black text-slate-400 transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-[#C7F36B] hover:text-black text-slate-400 transition-all">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Useful Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white text-xs font-extrabold uppercase tracking-widest">Navigation</h4>
          <ul className="flex flex-col gap-2.5 text-sm font-semibold text-slate-500">
            <li>
              <button onClick={() => navigateTo('home')} className="hover:text-[#C7F36B] transition-colors text-left">Home Base</button>
            </li>
            <li>
              <button onClick={() => navigateTo('products')} className="hover:text-[#C7F36B] transition-colors text-left">Browse Catalog</button>
            </li>
            <li>
              <button onClick={() => navigateTo('offers')} className="hover:text-[#C7F36B] transition-colors text-left">Flash Sales & Offers</button>
            </li>
            <li>
              <button onClick={() => navigateTo('about')} className="hover:text-[#C7F36B] transition-colors text-left">About Shahmeer Shop</button>
            </li>
            <li>
              <button onClick={() => navigateTo('faq')} className="hover:text-[#C7F36B] transition-colors text-left">Read FAQ</button>
            </li>
          </ul>
        </div>

        {/* Col 3: Policies */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white text-xs font-extrabold uppercase tracking-widest">Legal Policies</h4>
          <ul className="flex flex-col gap-2.5 text-sm font-semibold text-slate-500">
            <li>
              <button onClick={() => navigateTo('privacy')} className="flex items-center gap-1.5 hover:text-[#C7F36B] transition-colors text-left">
                <Shield className="w-3.5 h-3.5 text-slate-600" />
                <span>Privacy Policy</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('terms')} className="flex items-center gap-1.5 hover:text-[#C7F36B] transition-colors text-left">
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span>Terms & Conditions</span>
              </button>
            </li>
          </ul>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-900 mt-2 text-xs text-slate-500">
            <span className="font-extrabold text-white block mb-1">⏰ Open Hours</span>
            Everyday: 07:00 AM - 10:00 PM PST
          </div>
        </div>

        {/* Col 4: Contact details */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white text-xs font-extrabold uppercase tracking-widest">Contact Information</h4>
          <ul className="flex flex-col gap-3.5 text-sm text-slate-500">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C7F36B] flex-shrink-0 mt-1" />
              <span>{settings.location}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#C7F36B] flex-shrink-0" />
              <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#C7F36B] transition-colors font-mono">
                +{settings.whatsappNumber}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#C7F36B] flex-shrink-0" />
              <a href="mailto:panhwer0098@gmail.com" className="hover:text-[#C7F36B] transition-colors">
                panhwer0098@gmail.com
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Extreme Bottom Bar */}
      <div className="w-full bg-slate-950 py-6 px-4 md:px-8 border-t border-slate-900 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-600">
          <p>© {new Date().getFullYear()} Shahmeer Shop. All rights reserved.</p>
          <p className="font-sans text-[11px] text-slate-500 bg-slate-900/50 py-1.5 px-3 rounded-full border border-slate-900">
            Developed by Kashif
          </p>
        </div>
      </div>

    </footer>
  );
};
