'use client';

import React from 'react';
import { useLocaleContext } from '@/lib/LocaleContext';
import { LANDING_TRANSLATIONS } from '@/lib/landingTranslations';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ShieldCheck, Lock, TrendingUp, Headphones, Sparkles } from 'lucide-react';

export function TrustBand() {
  const { currentLocale } = useLocaleContext();
  const t = (LANDING_TRANSLATIONS[currentLocale] || LANDING_TRANSLATIONS.en).trust;

  const trustPoints = [
    {
      title: t.t1Title,
      desc: t.t1Desc,
      icon: ShieldCheck,
      color: 'text-emerald-300',
      bg: 'bg-emerald-500/20 border-emerald-400/30',
    },
    {
      title: t.t2Title,
      desc: t.t2Desc,
      icon: Lock,
      color: 'text-amber-300',
      bg: 'bg-amber-500/20 border-amber-400/30',
    },
    {
      title: t.t3Title,
      desc: t.t3Desc,
      icon: TrendingUp,
      color: 'text-teal-300',
      bg: 'bg-teal-500/20 border-teal-400/30',
    },
    {
      title: t.t4Title,
      desc: t.t4Desc,
      icon: Headphones,
      color: 'text-purple-300',
      bg: 'bg-purple-500/20 border-purple-400/30',
    },
  ];

  return (
    <section id="security" className="w-full bg-emerald-950/80 border-y border-emerald-800/80 py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-900/90 border border-emerald-700/80 text-xs font-mono font-bold text-teal-300">
              <Sparkles size={13} />
              <span>{t.tag}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              {t.title}
            </h2>
            <p className="text-base sm:text-lg text-emerald-100/80 font-normal leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* 4-Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point, idx) => {
            const Icon = point.icon;
            return (
              <ScrollReveal key={point.title} delayMs={idx * 120}>
                <div className="h-full p-7 rounded-3xl bg-emerald-900/50 border border-emerald-700/70 space-y-4 shadow-xl backdrop-blur-md">
                  <div className={`h-14 w-14 rounded-2xl ${point.bg} border flex items-center justify-center ${point.color} shadow-inner`}>
                    <Icon size={26} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-heading text-white">
                      {point.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed mt-2 font-normal">
                      {point.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
