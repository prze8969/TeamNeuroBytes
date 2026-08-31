'use client';

import React from 'react';
import { useLocaleContext } from '@/lib/LocaleContext';
import { LANDING_TRANSLATIONS } from '@/lib/landingTranslations';
import { 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  Lock, 
  Truck, 
  MessageSquare,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const ICONS = [
  { icon: TrendingUp, accent: 'text-amber-400', bgAccent: 'bg-amber-400/15 border-amber-400/30' },
  { icon: Cpu, accent: 'text-teal-300', bgAccent: 'bg-teal-400/15 border-teal-400/30' },
  { icon: ShieldCheck, accent: 'text-emerald-300', bgAccent: 'bg-emerald-400/15 border-emerald-400/30' },
  { icon: Lock, accent: 'text-amber-300', bgAccent: 'bg-amber-400/15 border-amber-400/30' },
  { icon: Truck, accent: 'text-purple-300', bgAccent: 'bg-purple-400/15 border-purple-400/30' },
  { icon: MessageSquare, accent: 'text-emerald-400', bgAccent: 'bg-emerald-400/15 border-emerald-400/30' },
];

export function WhyKrishiNiti() {
  const { currentLocale } = useLocaleContext();
  const t = (LANDING_TRANSLATIONS[currentLocale] || LANDING_TRANSLATIONS.en).why;

  return (
    <section id="why-krishiniti" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 sm:py-20 space-y-12">
      
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/80 text-xs font-mono font-bold text-amber-300">
          <Sparkles size={13} />
          <span>{t.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
          {t.title} <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 bg-clip-text text-transparent">
            {t.titleHighlight}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-emerald-100/80 font-normal leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* 6 Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {t.pillars.map((pillar, idx) => {
          const style = ICONS[idx] || ICONS[0];
          const Icon = style.icon;
          return (
            <div
              key={pillar.title}
              className="group p-6 sm:p-7 rounded-3xl bg-emerald-950/60 border border-emerald-800/80 hover:border-emerald-600/90 hover:bg-emerald-900/60 transition-all duration-300 shadow-xl hover:shadow-2xl backdrop-blur-xl flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`h-13 w-13 rounded-2xl ${style.bgAccent} border flex items-center justify-center ${style.accent} shadow-inner transition-transform group-hover:scale-105`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400/90 px-2.5 py-1 rounded-full bg-emerald-900/70 border border-emerald-800">
                    0{idx + 1}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300/90 block mb-1">
                    {pillar.tagline}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-white group-hover:text-emerald-200 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed mt-2.5 font-normal">
                    {pillar.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-800/60 flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>{t.verifiedBadge}</span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
