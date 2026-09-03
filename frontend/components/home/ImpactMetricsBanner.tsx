'use client';

import React from 'react';
import { useLocaleContext } from '@/lib/LocaleContext';
import { LANDING_TRANSLATIONS } from '@/lib/landingTranslations';
import { Users, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function ImpactMetricsBanner() {
  const { currentLocale } = useLocaleContext();
  const t = (LANDING_TRANSLATIONS[currentLocale] || LANDING_TRANSLATIONS.en).stats;

  return (
    <section className="w-full bg-emerald-950/95 border-y border-emerald-800/80 py-8 sm:py-10 shadow-inner">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 items-center">
          
          {/* Stat 1: Farmers Selling */}
          <div className="p-5 sm:p-6 rounded-3xl bg-emerald-900/50 border border-emerald-700/80 flex items-center gap-5 shadow-lg">
            <div className="h-14 w-14 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0 shadow-inner">
              <Users size={28} />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black font-heading text-white tracking-tight leading-tight">
                {t.stat1Val}
              </div>
              <div className="text-sm sm:text-base font-bold text-amber-300 leading-snug mt-0.5">
                {t.stat1Label}
              </div>
            </div>
          </div>

          {/* Stat 2: Paid Safely */}
          <div className="p-5 sm:p-6 rounded-3xl bg-emerald-900/50 border border-emerald-700/80 flex items-center gap-5 shadow-lg">
            <div className="h-14 w-14 rounded-2xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
              <ShieldCheck size={28} />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black font-heading text-white tracking-tight leading-tight">
                {t.stat2Val}
              </div>
              <div className="text-sm sm:text-base font-bold text-emerald-300 leading-snug mt-0.5">
                {t.stat2Label}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
