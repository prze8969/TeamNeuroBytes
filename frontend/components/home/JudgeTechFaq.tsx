'use client';

import React, { useState } from 'react';
import { useLocaleContext } from '@/lib/LocaleContext';
import { LANDING_TRANSLATIONS } from '@/lib/landingTranslations';
import { ChevronDown, Cpu, Truck, Lock, MessageSquare, HelpCircle } from 'lucide-react';

const FAQ_ICONS = [
  { icon: Cpu, color: 'text-teal-300' },
  { icon: Truck, color: 'text-purple-300' },
  { icon: Lock, color: 'text-amber-300' },
  { icon: MessageSquare, color: 'text-emerald-400' },
];

export function JudgeTechFaq() {
  const { currentLocale } = useLocaleContext();
  const t = (LANDING_TRANSLATIONS[currentLocale] || LANDING_TRANSLATIONS.en).faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-16 space-y-8 text-left font-sans">
      
      {/* Section Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/90 border border-emerald-700/80 text-xs font-mono font-bold text-teal-300">
          <HelpCircle size={13} />
          <span>{t.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight">
          {t.title}
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl mx-auto font-normal">
          {t.subtitle}
        </p>
      </div>

      {/* Accordion Questions */}
      <div className="space-y-3.5 pt-2">
        {t.questions.map((item, idx) => {
          const isOpen = openIndex === idx;
          const style = FAQ_ICONS[idx] || FAQ_ICONS[0];
          const Icon = style.icon;
          return (
            <div
              key={item.question}
              className="rounded-2xl bg-emerald-950/80 border border-emerald-700/80 overflow-hidden transition-all duration-200 shadow-lg"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-5 sm:px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-emerald-900/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-900/80 border border-emerald-700/80 flex items-center justify-center shrink-0">
                    <Icon size={18} className={style.color} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                      {item.category}
                    </span>
                    <span className="font-bold text-sm sm:text-base text-white">
                      {item.question}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-emerald-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-amber-300' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-emerald-800/60 text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal bg-emerald-900/20">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
}
