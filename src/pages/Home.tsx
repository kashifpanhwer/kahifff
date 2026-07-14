/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { 
  Sparkles, ArrowRight, Zap, Trophy, ShieldCheck, 
  Truck, Star, MessageSquare, Mail, ChevronRight, HelpCircle,
  Apple, Milk, Package, Coffee, Cookie
} from 'lucide-react';
import { motion } from 'motion/react';

// Category icons helper
const getCategoryIcon = (iconName: string, className = "w-6 h-6") => {
  switch (iconName) {
    case 'Apple': return <Apple className={className} />;
    case 'Milk': return <Milk className={className} />;
    case 'Package': return <Package className={className} />;
    case 'Coffee': return <Coffee className={className} />;
    case 'Cookie': return <Cookie className={className} />;
    default: return <Sparkles className={className} />;
  }
};

export const Home: React.FC = () => {
  const { products, categories, navigateTo, db, showToast } = useShop();
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  
  // Real dynamic countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 }; // Reset
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const flashSaleProducts = products.filter(p => p.isFlashSale).slice(0, 4);
  const testimonials = products.length > 0 ? (window as any).testimonialsList || [] : [];
  
  // Try loading testimonials from localStorage if not available in memory
  const [localTestimonials, setLocalTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    // Get FAQs and Testimonials from db Layer
    const loadedTestimonials = (db as any).getTestimonials ? (db as any).getTestimonials() : [];
    const loadedFaqs = (db as any).getFAQs ? (db as any).getFAQs() : [];
    setLocalTestimonials(loadedTestimonials);
    setFaqs(loadedFaqs);
  }, [db, products]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      showToast('Successfully subscribed to Shahmeer Shop newsletters!', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="w-full bg-[#F8F9FB] dark:bg-slate-950 transition-colors duration-300">
      
      {/* Luxury Hero Banner Section */}
      <section className="relative w-full py-16 md:py-28 px-4 md:px-8 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 dark:from-black dark:via-slate-950 dark:to-black">
        
        {/* Background ambient highlights */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#C7F36B]/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-slate-800/10 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 relative z-10">
          
          {/* Hero Left Content */}
          <div className="flex flex-col gap-6 text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit"
            >
              <Sparkles className="w-4 h-4 text-[#C7F36B] animate-spin-slow" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
                Premium Kiryana & Grocery Shop
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-white leading-tight font-sans"
            >
              Taste of Purity, <br />
              Direct from <br />
              <span className="text-[#C7F36B] tracking-tight relative underline decoration-[#C7F36B]/30">
                Mirpurkhas
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-base text-slate-400 font-medium leading-relaxed max-w-lg"
            >
              Welcome to <strong>Shahmeer Shop</strong> in Village Imzaiz Panhwar, Sindh. 
              We offer hand-picked premium Sindhri mangoes, pure wood-churned Desi Ghee, 
              raw Sidr honey, and daily fresh groceries delivered directly to your doorstep with absolute trust.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mt-4"
            >
              <button
                onClick={() => navigateTo('products')}
                className="group flex items-center gap-2 bg-[#C7F36B] text-black font-extrabold text-xs tracking-wider uppercase py-4 px-8 rounded-full shadow-lg shadow-[#C7F36B]/15 hover:bg-white transition-all hover:scale-105 active:scale-95"
              >
                <span>Shop Catalogue</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => navigateTo('about')}
                className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-extrabold text-xs tracking-wider uppercase py-4 px-8 rounded-full bg-white/5 transition-all hover:scale-105 active:scale-95"
              >
                <span>Our Story</span>
              </button>
            </motion.div>

            {/* Quick trust bullet stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8 mt-4 max-w-md font-sans"
            >
              <div>
                <span className="block text-2xl font-black text-[#C7F36B]">100%</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Pure & Fresh</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white">FREE</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Delivery above Rs. 1k</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white">4.9★</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Customer Rating</span>
              </div>
            </motion.div>

          </div>

          {/* Hero Right Media Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            {/* Visual Glass floating card */}
            <div className="absolute -left-6 top-1/4 z-20 p-4 rounded-2xl glass-light border border-white/10 shadow-2xl flex items-center gap-3 backdrop-blur-md hidden sm:flex">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                ★
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">Sindhri Mangoes</p>
                <p className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5 tracking-wider">King of Fruit Available</p>
              </div>
            </div>

            <div className="absolute -right-4 bottom-10 z-20 p-4 rounded-2xl glass-light border border-white/10 shadow-2xl flex items-center gap-3 backdrop-blur-md hidden sm:flex">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">Imzaiz Express</p>
                <p className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5 tracking-wider">Fast WhatsApp Delivery</p>
              </div>
            </div>

            {/* Immersive Image Canvas */}
            <div className="relative w-full max-w-md aspect-[4/3] md:aspect-square rounded-[36px] overflow-hidden border border-white/10 shadow-2xl bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800"
                alt="Premium Grocery Shop Stall"
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-left">
                <span className="text-[10px] font-black text-black bg-[#C7F36B] px-2.5 py-1 rounded-full uppercase tracking-widest">
                  Our Pride
                </span>
                <p className="text-sm font-bold text-white mt-2">Authentic Rural Delicacies</p>
                <p className="text-xs text-slate-400 mt-1">Village Imzaiz Panhwar, Mirpurkhas, Sindh</p>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Trust Badges Features Bar */}
      <section className="w-full py-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#C7F36B]/15 text-slate-900 dark:text-[#C7F36B] flex items-center justify-center font-bold">
              <Zap className="w-6 h-6 text-slate-900 dark:text-[#C7F36B]" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">Fast Village Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Quickly order on WhatsApp</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#C7F36B]/15 text-slate-900 dark:text-[#C7F36B] flex items-center justify-center">
              <Trophy className="w-6 h-6 text-slate-900 dark:text-[#C7F36B]" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">Top-Tier Quality</h4>
              <p className="text-xs text-slate-400 mt-0.5">Sourced from selected local farms</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#C7F36B]/15 text-slate-900 dark:text-[#C7F36B] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-slate-900 dark:text-[#C7F36B]" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">100% Pure Ghee & Grains</h4>
              <p className="text-xs text-slate-400 mt-0.5">Chemical-free traditional processing</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#C7F36B]/15 text-slate-900 dark:text-[#C7F36B] flex items-center justify-center">
              <Truck className="w-6 h-6 text-slate-900 dark:text-[#C7F36B]" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">Free Shipping</h4>
              <p className="text-xs text-slate-400 mt-0.5">Free delivery on orders above Rs. 1000</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid Section */}
      <section className="max-w-7xl mx-auto py-16 px-4 md:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Explore Selection</span>
          <h2 className="text-2xl md:text-3.5xl font-black text-slate-950 dark:text-white leading-tight font-sans">
            Our Fresh Categories
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Handpicked premium quality everyday essentials processed with pure traditional care.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => navigateTo('products', { categorySlug: cat.slug })}
              className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-[#C7F36B]/30 transition-all text-center cursor-pointer flex flex-col items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center group-hover:bg-[#C7F36B] group-hover:text-black shadow-inner transition-colors">
                {getCategoryIcon(cat.icon, "w-7 h-7")}
              </div>
              
              <div>
                <h3 className="text-xs font-extrabold text-slate-950 dark:text-white group-hover:text-[#C7F36B] transition-colors leading-tight">
                  {cat.name}
                </h3>
                <span className="text-[10px] font-medium text-slate-400 mt-1 block uppercase tracking-wider">
                  {cat.productsCount} Items
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Flash Sale Countdown & Banner section */}
      <section className="max-w-7xl mx-auto py-12 px-4 md:px-8">
        <div className="bg-gradient-to-r from-slate-950 to-slate-900 dark:from-black dark:to-slate-950 rounded-[32px] p-6 md:p-10 border border-slate-900 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C7F36B]/5 rounded-full blur-[100px] pointer-events-none" />
          
          {/* Sale details */}
          <div className="flex flex-col gap-4 text-left max-w-lg">
            <span className="bg-[#C7F36B] text-black text-[10px] font-black px-3 py-1 rounded-full w-fit uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Limited Offer Campaign</span>
            </span>

            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight font-sans">
              Mirpurkhas Mango Crop <br />
              Flash Sale is Active!
            </h2>

            <p className="text-xs text-slate-400 font-medium">
              Get an extra 25% discount on the legendary sweet <strong>Sindhri Mangoes</strong> directly sourced from Imzaiz village farms. Stock is selling out very fast!
            </p>

            {/* Countdown layout */}
            <div className="flex items-center gap-3 mt-2 font-mono">
              <div className="flex flex-col items-center">
                <span className="bg-white/5 border border-white/10 text-white font-extrabold text-lg w-12 h-12 rounded-xl flex items-center justify-center">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-500 mt-1 tracking-widest">Hrs</span>
              </div>
              <span className="text-white font-black text-xl">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-white/5 border border-white/10 text-white font-extrabold text-lg w-12 h-12 rounded-xl flex items-center justify-center">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-500 mt-1 tracking-widest">Min</span>
              </div>
              <span className="text-white font-black text-xl">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-white/5 border border-white/10 text-[#C7F36B] font-extrabold text-lg w-12 h-12 rounded-xl flex items-center justify-center animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-500 mt-1 tracking-widest">Sec</span>
              </div>
            </div>
          </div>

          {/* Flash items display */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {flashSaleProducts.slice(0, 2).map(prod => (
                <div key={prod.id} className="bg-white/5 border border-white/10 rounded-[22px] p-4 flex gap-4 items-center">
                  <img src={prod.image} alt={prod.name} className="w-16 h-16 rounded-xl object-cover bg-white/5 flex-shrink-0" referrerPolicy="no-referrer" />
                  <div className="text-left min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Unit: {prod.unit}</p>
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="text-sm font-extrabold text-[#C7F36B]">Rs. {prod.price}</span>
                      {prod.originalPrice && <span className="text-[10px] text-slate-500 line-through">Rs. {prod.originalPrice}</span>}
                    </div>
                    <button 
                      onClick={() => navigateTo('product-details', { productId: prod.id })}
                      className="mt-2 text-[10px] font-bold text-[#C7F36B] flex items-center gap-1 hover:underline"
                    >
                      <span>Claim Deal</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Popular Products Showcase (Bento segment) */}
      <section className="max-w-7xl mx-auto py-16 px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Selected Specialties</span>
            <h2 className="text-2xl md:text-3.5xl font-black text-slate-950 dark:text-white leading-tight font-sans">
              Popular Fresh Products
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Our absolute top selling grocery supplies from local orchards and fields of Sindh.
            </p>
          </div>

          <button
            onClick={() => navigateTo('products')}
            className="group flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white hover:text-[#C7F36B] transition-colors py-2.5 px-5 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800"
          >
            <span>View All Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Customer Testimonials reviews Slider */}
      <section className="max-w-7xl mx-auto py-16 px-4 md:px-8 border-t border-slate-100 dark:border-slate-900">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Our Testimonials</span>
          <h2 className="text-2xl md:text-3.5xl font-black text-slate-950 dark:text-white leading-tight font-sans">
            What Our Customers Say
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Trusted by hundreds of local families in Sindh and rural areas of Mirpurkhas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {localTestimonials.map((t: any) => (
            <div key={t.id} className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm text-left flex flex-col justify-between">
              <div>
                {/* Rating */}
                <div className="flex items-center gap-0.5 text-amber-500 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal italic mb-6">
                  "{t.comment}"
                </p>
              </div>

              {/* Author info */}
              <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover bg-slate-100" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-950 dark:text-white">{t.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Home FAQ Segment Accordion */}
      <section className="max-w-4xl mx-auto py-16 px-4 md:px-8 border-t border-slate-100 dark:border-slate-900">
        <div className="text-center mb-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Have Questions?</span>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white leading-tight font-sans">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.slice(0, 4).map((faq: any) => (
            <div
              key={faq.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm text-left"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-5 text-sm font-extrabold text-slate-900 dark:text-white hover:text-[#C7F36B] transition-colors focus:outline-none"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4.5 h-4.5 text-slate-400" />
                  <span>{faq.question}</span>
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === faq.id ? 'rotate-90 text-[#C7F36B]' : ''}`} />
              </button>
              
              {activeFaq === faq.id && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-50 dark:border-slate-800/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup form */}
      <section className="max-w-7xl mx-auto py-12 px-4 md:px-8 mb-16">
        <div className="bg-slate-900 dark:bg-slate-950 rounded-[32px] border border-white/5 p-8 md:p-14 text-center relative overflow-hidden shadow-xl">
          
          <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-[#C7F36B]/5 rounded-full blur-[80px]" />
          
          <div className="max-w-lg mx-auto flex flex-col items-center gap-5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#C7F36B] flex items-center justify-center shadow-lg mb-2">
              <Mail className="w-6 h-6" />
            </div>

            <h3 className="text-xl md:text-2xl font-black text-white font-sans leading-snug">
              Get Notified on Fresh Mango Crops
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Subscribe to our notification circular to receive instant announcements about fresh mango shipments, pure village Ghee stock batches, and active coupons. Zero spam.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="w-full flex flex-col sm:flex-row gap-3 mt-4">
              <input
                type="email"
                placeholder="Enter your personal email..."
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-xs font-semibold text-white placeholder-slate-500 focus:border-[#C7F36B] focus:outline-none focus:bg-white/10 transition-all text-center sm:text-left"
              />
              <button
                type="submit"
                className="bg-[#C7F36B] hover:bg-white text-black font-extrabold text-xs tracking-wider uppercase px-8 py-3.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};
