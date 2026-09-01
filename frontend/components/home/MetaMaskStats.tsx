'use client';

import React from 'react';
import { useLocaleContext } from '@/lib/LocaleContext';
import { LANDING_TRANSLATIONS } from '@/lib/landingTranslations';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function MetaMaskStats() {
  const { currentLocale } = useLocaleContext();
  const t = (LANDING_TRANSLATIONS[currentLocale] || LANDING_TRANSLATIONS.en).stats;

  const statList = [
    { value: t.stat1Val, label: t.stat1Label, color: 'text-amber-400' },
    { value: t.stat2Val, label: t.stat2Label, color: 'text-emerald-300' },
    { value: t.stat3Val, label: t.stat3Label, color: 'text-teal-300' },
    { value: t.stat4Val, label: t.stat4Label, color: 'text-amber-300' },
  ];

  return (
    <section className="w-full bg-emerald-950/90 border-y border-emerald-800/80 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 text-center">
            {statList.map((stat, idx) => (
              <div key={stat.label} className="space-y-2">
                <div className={`text-4xl sm:text-5xl lg:text-6xl font-black font-heading ${stat.color} tracking-tight`}>
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base font-bold text-emerald-100/90 tracking-wide font-sans">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
