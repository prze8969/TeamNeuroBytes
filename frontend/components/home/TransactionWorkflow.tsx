'use client';

import React from 'react';
import { useLocaleContext } from '@/lib/LocaleContext';
import { LANDING_TRANSLATIONS } from '@/lib/landingTranslations';
import { 
  MessageSquare, 
  Cpu, 
  TrendingUp, 
  Lock, 
  Truck, 
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const STEP_STYLES = [
  { icon: MessageSquare, color: 'text-amber-400', bg: 'bg-amber-400/20 border-amber-400/30' },
  { icon: Cpu, color: 'text-teal-300', bg: 'bg-teal-400/20 border-teal-400/30' },
  { icon: TrendingUp, color: 'text-emerald-300', bg: 'bg-emerald-400/20 border-emerald-400/30' },
  { icon: Lock, color: 'text-amber-300', bg: 'bg-amber-400/20 border-amber-400/30' },
  { icon: Truck, color: 'text-purple-300', bg: 'bg-purple-400/20 border-purple-400/30' },
  { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/20 border-emerald-400/30' },
];

export function TransactionWorkflow() {
  const { currentLocale } = useLocaleContext();
  const t = (LANDING_TRANSLATIONS[currentLocale] || LANDING_TRANSLATIONS.en).workflow;

  return (
    <section id="workflow" className="w-full bg-emerald-950/80 border-y border-emerald-800/80 py-16 sm:py-20 relative overflow-hidden">
      
      {/* Background Accent Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b98110_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-14">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/90 border border-emerald-700/80 text-xs font-mono font-bold text-teal-300">
            <Sparkles size={13} />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
            {t.title1} <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
              {t.titleHighlight}
            </span>
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/80 font-normal leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 6-Step Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.steps.map((step, idx) => {
            const style = STEP_STYLES[idx] || STEP_STYLES[0];
            const Icon = style.icon;
            return (
              <div 
                key={step.step}
                className="relative p-6 sm:p-7 rounded-3xl bg-emerald-900/60 border border-emerald-700/70 hover:border-amber-400/80 hover:bg-emerald-900/90 transition-all duration-300 shadow-xl backdrop-blur-md space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-2xl ${style.bg} border flex items-center justify-center ${style.color} shadow-inner`}>
                      <Icon size={22} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-amber-300 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800">
                        {step.badge}
                      </span>
                      <span className="text-lg font-black font-mono text-emerald-400">
                        {step.step}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-heading text-white group-hover:text-amber-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed mt-2 font-normal">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-800/70 flex items-center justify-between text-xs font-mono text-emerald-400">
                  <span>Automated Protocol</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 text-amber-300 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner Callout */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-900/90 via-emerald-800/80 to-emerald-900/90 border border-emerald-700 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <h4 className="font-bold text-sm sm:text-base text-white">
              {t.bannerTitle}
            </h4>
            <p className="text-xs text-emerald-200/80">
              {t.bannerSub}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/918000000000?text=Hi%20Krishi%20Niti%20I%20want%20to%20list%20my%20crop"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare size={15} />
              <span>{t.bannerCta}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
