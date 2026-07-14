/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import { Trophy, ShieldCheck, Leaf, MapPin, Apple, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const About: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <div className="w-full bg-[#F8F9FB] dark:bg-slate-950 py-12 px-4 md:px-8 transition-colors duration-300 text-left">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        
        {/* Page Head */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#C7F36B] block mb-2 bg-[#C7F36B]/10 dark:bg-[#C7F36B]/5 px-3 py-1 rounded-full w-fit mx-auto">
            Our Legacy
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white leading-tight font-sans">
            About Shahmeer Shop
          </h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Discover the rich traditions, pristine village orchards, and farm fresh values behind Sindh's premium Kiryana and online grocery provider.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">
              Rooted in the Soil of Village Imzaiz Panhwar
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Shahmeer Shop was founded in <strong>Village Imzaiz Panhwar, Mirpurkhas, Sindh</strong> with a humble, powerful vision: to bridge the gap between traditional rural pureness and modern luxury shopping. 
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Mirpurkhas is globally celebrated as the ultimate crown territory for growing rich, fiber-free, heavenly aromatic <strong>Sindhri Mangoes</strong>. In our private ancestral orchards, we cultivate and harvest these golden fruits under optimal natural heat, watering them daily from pure canal distributaries.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              We also source pure, unadulterated cow and buffalo milk directly from rural farm animals, wood-churning it slowly to make pristine granular <strong>Desi Ghee</strong> and packing fresh, highly nutritious organic brown eggs daily.
            </p>
          </div>

          <div className="relative aspect-[4/3] rounded-[28px] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 bg-slate-900 group">
            <img
              src="https://images.unsplash.com/photo-1610832958506-ee5633619144?auto=format&fit=crop&q=80&w=600"
              alt="Fresh Local Greens"
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 opacity-90"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Value Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4 text-left">
            <div className="w-11 h-11 rounded-xl bg-[#C7F36B]/10 text-[#C7F36B] flex items-center justify-center">
              <Leaf className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">100% Organic Sourcing</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Zero synthetic flavorings, zero industrial preservatives, and zero chemical colors. We only process goods utilizing clean, traditional, ancestral techniques passed down over generations.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4 text-left">
            <div className="w-11 h-11 rounded-xl bg-[#C7F36B]/10 text-[#C7F36B] flex items-center justify-center">
              <Trophy className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">Unrivalled Premium Quality</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Every item is strictly inspected, cleaned, and premium-packaged with ultimate care. If any item fails our highest grading standard, it never leaves the store.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4 text-left">
            <div className="w-11 h-11 rounded-xl bg-[#C7F36B]/10 text-[#C7F36B] flex items-center justify-center">
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">Absolute Community Trust</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              We stand by our words. Our pricing is transparent, local home deliveries are quick, and customer satisfaction is our absolute priority. We operate like a family.
            </p>
          </div>
        </div>

        {/* CTA section */}
        <div className="bg-slate-900 dark:bg-slate-950 rounded-[32px] p-8 md:p-12 text-center border border-white/5 relative overflow-hidden shadow-xl mt-6">
          <div className="max-w-lg mx-auto flex flex-col items-center gap-4 relative z-10">
            <Heart className="w-10 h-10 text-rose-500 fill-rose-500 animate-pulse" />
            <h3 className="text-xl font-extrabold text-white font-sans leading-tight">
              Ready to Taste the True Sindh Delicacy?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Order fresh premium Sindhri mangoes and pure wood-churned Desi Ghee directly from Village Imzaiz Panhwar today. Hand-delivered via WhatsApp!
            </p>
            <button
              onClick={() => navigateTo('products')}
              className="mt-4 bg-[#C7F36B] hover:bg-white text-black font-extrabold text-xs tracking-wider uppercase px-8 py-3.5 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              Browse Fresh Catalog
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
