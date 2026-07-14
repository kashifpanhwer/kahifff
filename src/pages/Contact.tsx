/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { MapPin, Phone, Mail, Clock, MessageSquare, Compass, Send } from 'lucide-react';
import { motion } from 'motion/react';

export const Contact: React.FC = () => {
  const { settings, showToast } = useShop();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill out all the fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setName('');
      setEmail('');
      setMessage('');
      showToast('Your message has been sent successfully! We will contact you back shortly.', 'success');
      
      // Optionally open WhatsApp with the contact message
      const text = `Assalamu Alaikum Shahmeer Shop,\n\nMy Name is *${name}* (${email}).\nI want to inquire about:\n"${message}"`;
      const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }, 1200);
  };

  return (
    <div className="w-full bg-[#F8F9FB] dark:bg-slate-950 py-12 px-4 md:px-8 transition-colors duration-300 text-left">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Page Head */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#C7F36B] block mb-2 bg-[#C7F36B]/10 dark:bg-[#C7F36B]/5 px-3 py-1 rounded-full w-fit mx-auto">
            Get In Touch
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white leading-tight font-sans">
            Contact Shahmeer Shop
          </h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Have any questions about custom mango orders, delivery locations, or stock batches? Send us a direct message or chat with us on WhatsApp.
          </p>
        </div>

        {/* Contact Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Leftside: Contact cards */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-[#C7F36B] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-slate-900 dark:text-[#C7F36B]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider mb-1">Our Store Address</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">{settings.location}</p>
                <span className="text-[10px] text-slate-400 block mt-2 font-semibold">📍 Imzaiz Panhwar Road, near main highway</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-[#C7F36B] flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-slate-900 dark:text-[#C7F36B]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider mb-1">WhatsApp & Call Support</h4>
                <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-xs font-extrabold text-slate-800 dark:text-slate-200 hover:text-[#C7F36B] transition-colors font-mono block">
                  +{settings.whatsappNumber}
                </a>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Click to chat directly with Shahmeer</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-[#C7F36B] flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-slate-900 dark:text-[#C7F36B]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider mb-1">Official Email Address</h4>
                <a href="mailto:panhwer0098@gmail.com" className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-[#C7F36B] transition-colors block">
                  panhwer0098@gmail.com
                </a>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Standard support within 24 hours</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-[#C7F36B] flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-slate-900 dark:text-[#C7F36B]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider mb-1">Store Operating Hours</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Everyday: 07:00 AM - 10:00 PM PST</p>
                <p className="text-[10px] text-emerald-500 font-bold mt-1 uppercase tracking-wide">📍 Farm fresh deliveries daily</p>
              </div>
            </div>

          </div>

          {/* Rightside: Interactive Message Form */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
              <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider mb-6 pb-2 border-b dark:border-slate-800 flex items-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 text-slate-400" />
                <span>Send Quick Message</span>
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Your Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name..."
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#C7F36B] focus:bg-white dark:focus:bg-slate-900 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email address..."
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#C7F36B] focus:bg-white dark:focus:bg-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Message details</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your question or special order requirements..."
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#C7F36B] focus:bg-white dark:focus:bg-slate-900 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#C7F36B] hover:bg-slate-950 hover:text-white text-black dark:hover:bg-white dark:hover:text-black py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message (Redirects to WhatsApp)</span>
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>

        {/* Custom Visual Map Representation */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm mt-6 text-center flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-[#C7F36B] flex items-center justify-center">
            <Compass className="w-6 h-6 text-slate-900 dark:text-[#C7F36B] animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">Map Directions Reference</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg mx-auto">
              We are located right off the main road inside Village Imzaiz Panhwar. Look for our elegant physical green sign and wooden gates. Click below to view on Google Maps.
            </p>
          </div>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
          >
            Open Google Maps Directions
          </a>
        </div>

      </div>
    </div>
  );
};
