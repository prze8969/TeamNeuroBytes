'use client';

import React from 'react';
import Link from 'next/link';
import { useLocaleContext } from '@/lib/LocaleContext';
import { LANDING_TRANSLATIONS } from '@/lib/landingTranslations';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { MessageSquare, Award, Wallet, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export function HowItWorksPreview() {
  const { currentLocale } = useLocaleContext();
  const t = LANDING_TRANSLATIONS[currentLocale] || LANDING_TRANSLATIONS.en;

  const steps = [
    {
      num: '01',
      title: t.showcaseVisual.step1Title,
      sub: t.showcaseVisual.step1Sub,
      icon: MessageSquare,
      color: 'text-emerald-300',
      bg: 'bg-emerald-500/20 border-emerald-400/30',
    },
    {
      num: '02',
      title: t.showcaseVisual.step2Title,
      sub: t.showcaseVisual.step2Sub,
      icon: Award,
      color: 'text-teal-300',
      bg: 'bg-teal-500/20 border-teal-400/30',
    },
    {
      num: '03',
      title: t.showcaseVisual.step3Title,
      sub: t.showcaseVisual.step3Sub,
      icon: Wallet,
      color: 'text-amber-300',
      bg: 'bg-amber-500/20 border-amber-400/30',
    },
  ];

  return (
    <section id="how-it-works-preview" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-20 sm:py-28 space-y-12">
      
      {/* Section Header */}
      <ScrollReveal>
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/80 text-xs font-mono font-bold text-teal-300">
            <Sparkles size={13} />
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
            How Krishi Niti Works
          </h2>
          <p className="text-base sm:text-lg text-emerald-100/80 font-normal leading-relaxed">
            {t.hero.subtitle}
          </p>
        </div>
      </ScrollReveal>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <ScrollReveal key={step.num} delayMs={idx * 150}>
              <div className="h-full p-8 rounded-3xl bg-emerald-950/70 border border-emerald-800/80 hover:border-emerald-600/90 hover:bg-emerald-900/50 transition-all duration-300 shadow-xl backdrop-blur-xl space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`h-14 w-14 rounded-2xl ${step.bg} border flex items-center justify-center ${step.color} shadow-inner`}>
                      <Icon size={26} />
                    </div>
                    <span className="text-2xl font-black font-mono text-emerald-400">
                      {step.num}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-heading text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm text-emerald-100/80 leading-relaxed mt-2 font-normal">
                      {step.sub}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-emerald-800/60 flex items-center justify-between text-xs font-mono text-emerald-400">
                  <span>Zero App Download</span>
                  <ArrowRight size={14} className="text-amber-400" />
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Secondary Buyer Link Card */}
      <ScrollReveal delayMs={300}>
        <div className="p-6 rounded-3xl bg-emerald-900/40 border border-emerald-700/60 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <h4 className="font-bold text-sm sm:text-base text-white">
              Are you an institutional agricultural buyer or processor?
            </h4>
            <p className="text-xs sm:text-sm text-emerald-200/80">
              Procure certified crop lots with 100% escrow security and farmgate provenance.
            </p>
          </div>
          <Link
            href="/buyer/dashboard"
            className="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 border border-emerald-600 text-white font-bold text-xs sm:text-sm transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Explore Buyer Market</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </ScrollReveal>

    </section>
  );
}
