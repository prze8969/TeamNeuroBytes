'use client';

import React from 'react';
import { useLocaleContext } from '@/lib/LocaleContext';
import { LANDING_TRANSLATIONS } from '@/lib/landingTranslations';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { MessageSquare, Award, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export function MetaMaskFeatures() {
  const { currentLocale } = useLocaleContext();
  const t = (LANDING_TRANSLATIONS[currentLocale] || LANDING_TRANSLATIONS.en).features;

  const featureCards = [
    {
      title: t.f1Title,
      subtitle: t.f1Sub,
      detail: t.f1Detail,
      icon: MessageSquare,
      iconBg: 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300',
    },
    {
      title: t.f2Title,
      subtitle: t.f2Sub,
      detail: t.f2Detail,
      icon: Award,
      iconBg: 'bg-teal-500/20 border-teal-400/30 text-teal-300',
    },
    {
      title: t.f3Title,
      subtitle: t.f3Sub,
      detail: t.f3Detail,
      icon: Lock,
      iconBg: 'bg-amber-500/20 border-amber-400/30 text-amber-300',
    },
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-20 sm:py-28 space-y-14">
      
      {/* Section Header */}
      <ScrollReveal>
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/80 text-xs font-mono font-bold text-amber-300">
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

      {/* 3 Clean MetaMask Feature Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featureCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <ScrollReveal key={card.title} delayMs={idx * 150}>
              <div className="h-full p-8 rounded-3xl bg-emerald-950/70 border border-emerald-800/80 hover:border-emerald-600/90 hover:bg-emerald-900/50 transition-all duration-300 shadow-xl backdrop-blur-xl space-y-6 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className={`h-16 w-16 rounded-2xl ${card.iconBg} border flex items-center justify-center shadow-inner`}>
                    <Icon size={30} />
                  </div>

                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300/90 block mb-1">
                      {card.subtitle}
                    </span>
                    <h3 className="text-2xl font-bold font-heading text-white">
                      {card.title}
                    </h3>
                    <p className="text-sm text-emerald-100/80 leading-relaxed mt-3 font-normal">
                      {card.detail}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-emerald-800/60 flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  <span>Farmer Guaranteed</span>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

    </section>
  );
}
