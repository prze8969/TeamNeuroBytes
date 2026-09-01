// @ts-nocheck
'use client';

import React from 'react';
import { useLocaleContext } from '@/lib/LocaleContext';
import { LANDING_TRANSLATIONS } from '@/lib/landingTranslations';
import { 
  MessageSquare, 
  CheckCircle2, 
  Wallet, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export function HeroProductPreview() {
  const { currentLocale } = useLocaleContext();
  const t = (LANDING_TRANSLATIONS[currentLocale] || LANDING_TRANSLATIONS.en).story;

  const steps = [
    {
      num: t.step1Num,
      title: t.step1Title,
      desc: t.step1Desc,
      icon: MessageSquare,
      color: 'text-emerald-300',
      bg: 'bg-emerald-500/20 border-emerald-400/30',
      numBg: 'bg-emerald-400 text-slate-950',
    },
    {
      num: t.step2Num,
      title: t.step2Title,
      desc: t.step2Desc,
      icon: CheckCircle2,
      color: 'text-teal-300',
      bg: 'bg-teal-500/20 border-teal-400/30',
      numBg: 'bg-teal-400 text-slate-950',
    },
    {
      num: t.step3Num,
      title: t.step3Title,
      desc: t.step3Desc,
      icon: Wallet,
      color: 'text-amber-300',
      bg: 'bg-amber-500/20 border-amber-400/30',
      numBg: 'bg-amber-400 text-slate-950',
    },
  ];

  return (
    <div className="w-full max-w-lg mx-auto lg:max-w-none">
      {/* 3-Step Clean Card with Emerald Border & Soft Glow */}
      <div className="relative rounded-3xl bg-emerald-950/80 border border-emerald-700/80 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl space-y-5">
        
        {/* Top Header Badge */}
        <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="font-extrabold text-base sm:text-lg text-white font-heading tracking-tight">
              {t.title}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-amber-300 bg-emerald-900/90 px-3 py-1 rounded-full border border-emerald-700">
            {t.badge}
          </span>
        </div>

        {/* 3 Large Steps */}
        <div className="space-y-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={s.num}
                className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 hover:border-emerald-500/70 hover:bg-emerald-900/80 transition-all flex items-start gap-4 shadow-sm"
              >
                {/* Large Icon Container with Step Number */}
                <div className="relative shrink-0">
                  <div className={`h-13 w-13 rounded-2xl ${s.bg} border flex items-center justify-center ${s.color} shadow-inner`}>
                    <Icon size={24} />
                  </div>
                  <span className={`absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full ${s.numBg} font-black font-mono text-xs flex items-center justify-center shadow-md`}>
                    {s.num}
                  </span>
                </div>

                {/* Step Text */}
                <div className="space-y-1">
                  <h4 className="font-bold text-sm sm:text-base text-white leading-snug">
                    {s.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed font-normal">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="pt-3 border-t border-emerald-800/80 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-amber-300 text-center font-mono">
          <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
          <span>{t.guarantee}</span>
        </div>

      </div>
    </div>
  );
}
