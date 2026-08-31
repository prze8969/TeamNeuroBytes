'use client';

import React from 'react';
import { useLocaleContext } from '@/lib/LocaleContext';
import { LANDING_TRANSLATIONS } from '@/lib/landingTranslations';
import { Check, X, Sparkles, Award } from 'lucide-react';

export function DifferentiationMatrix() {
  const { currentLocale } = useLocaleContext();
  const t = (LANDING_TRANSLATIONS[currentLocale] || LANDING_TRANSLATIONS.en).diff;

  return (
    <section id="differentiation" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 sm:py-20 space-y-12">
      
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/90 border border-emerald-700/80 text-xs font-mono font-bold text-amber-300">
          <Award size={13} />
          <span>{t.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
          {t.title1} <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 bg-clip-text text-transparent">
            {t.titleHighlight}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-emerald-100/80 font-normal leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Comparison Table / Cards */}
      <div className="overflow-x-auto rounded-3xl border border-emerald-700/80 bg-emerald-950/70 shadow-2xl backdrop-blur-xl">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="border-b border-emerald-800/90 bg-emerald-900/80 text-xs font-mono font-extrabold">
              <th className="py-4.5 px-6 text-emerald-300 uppercase tracking-wider w-[22%]">
                {t.headers.feature}
              </th>
              <th className="py-4.5 px-6 text-slate-300 uppercase tracking-wider w-[25%] opacity-80">
                {t.headers.traditional}
              </th>
              <th className="py-4.5 px-6 text-slate-300 uppercase tracking-wider w-[25%] opacity-80">
                {t.headers.marketplace}
              </th>
              <th className="py-4.5 px-6 text-amber-300 uppercase tracking-wider w-[28%] bg-emerald-800/90 border-l border-emerald-700">
                <span className="flex items-center gap-1.5 font-black text-amber-300">
                  <Sparkles size={14} /> {t.headers.krishiniti}
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-800/60 text-xs font-sans">
            {t.rows.map((row, idx) => (
              <tr key={row.feature} className={idx % 2 === 0 ? 'bg-emerald-950/40' : 'bg-emerald-900/30'}>
                <td className="py-4 px-6 font-bold text-white font-mono">
                  {row.feature}
                </td>
                <td className="py-4 px-6 text-emerald-200/70 font-normal">
                  <div className="flex items-start gap-2">
                    <X size={15} className="text-rose-400 shrink-0 mt-0.5" />
                    <span>{row.traditional}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-emerald-200/70 font-normal">
                  <div className="flex items-start gap-2">
                    <X size={15} className="text-amber-400/80 shrink-0 mt-0.5" />
                    <span>{row.marketplace}</span>
                  </div>
                </td>
                <td className="py-4 px-6 bg-emerald-900/60 border-l border-emerald-700 font-medium text-emerald-100">
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-teal-300 shrink-0 mt-0.5 font-black" />
                    <span className="font-semibold text-white">{row.krishiniti}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </section>
  );
}
