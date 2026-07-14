/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { HelpCircle, ChevronRight, MessageSquare, Info } from 'lucide-react';
import { motion } from 'motion/react';

export const FAQPage: React.FC = () => {
  const { db } = useShop();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  useEffect(() => {
    const loaded = (db as any).getFAQs ? (db as any).getFAQs() : [];
    setFaqs(loaded);
  }, [db]);

  return (
    <div className="w-full bg-[#F8F9FB] dark:bg-slate-950 py-12 px-4 md:px-8 transition-colors duration-300 text-left">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        
        {/* Page Head */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#C7F36B] block mb-2 bg-[#C7F36B]/10 dark:bg-[#C7F36B]/5 px-3 py-1 rounded-full w-fit mx-auto">
            Knowledge Base
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white leading-tight font-sans">
            Store FAQs & Answers
          </h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Quickly browse common queries regarding organic honey, Desi Ghee processing, order dispatch schedules, delivery boundaries, and coupons.
          </p>
        </div>

        {/* FAQ list */}
        <div className="flex flex-col gap-3.5 mt-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white dark:bg-slate-900 rounded-[22px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-sm font-extrabold text-slate-900 dark:text-white hover:text-[#C7F36B] transition-colors focus:outline-none"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-slate-400" />
                  <span className="text-left">{faq.question}</span>
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${activeFaq === faq.id ? 'rotate-90 text-[#C7F36B]' : ''}`} />
              </button>

              {activeFaq === faq.id && (
                <div className="px-5 md:px-6 pb-6 pt-1 border-t border-slate-50 dark:border-slate-800/50">
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Support Callout */}
        <div className="p-6 md:p-8 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm text-center flex flex-col items-center gap-4 mt-4">
          <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-800 text-[#C7F36B] flex items-center justify-center">
            <MessageSquare className="w-5.5 h-5.5 text-slate-900 dark:text-[#C7F36B]" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">Still Have Questions?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
              If you couldn't find your answer here, please contact Shahmeer directly. We are always ready to assist our community family.
            </p>
          </div>
          <a
            href="https://wa.me/923192616627"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#C7F36B] text-black font-extrabold text-xs tracking-wider uppercase px-6 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            Chat Live with Support
          </a>
        </div>

      </div>
    </div>
  );
};
