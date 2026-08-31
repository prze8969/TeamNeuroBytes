'use client';

import React from 'react';
import Link from 'next/link';
import { useLocaleContext } from '@/lib/LocaleContext';
import { LANDING_TRANSLATIONS } from '@/lib/landingTranslations';
import { 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Wallet, 
  Sparkles,
  TrendingUp,
  Award,
  Lock
} from 'lucide-react';

export function MetaMaskHero() {
  const { currentLocale } = useLocaleContext();
  const t = LANDING_TRANSLATIONS[currentLocale] || LANDING_TRANSLATIONS.en;

  return (
    <section className="relative w-full overflow-hidden pt-16 sm:pt-24 pb-20 sm:pb-28 text-center">
      
      {/* MetaMask-Style Ambient Glows & Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b98118_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-amber-400/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 space-y-8 sm:space-y-10">
        
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700/80 text-xs sm:text-sm font-bold text-amber-300 shadow-md">
          <Sparkles size={14} className="text-amber-400" />
          <span>{t.hero.tag}</span>
        </div>

        {/* Bolder, Massive Headline (MetaMask Scale) */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading tracking-tight text-white leading-[1.12] max-w-4xl mx-auto">
          {t.hero.title} <br />
          <span className="bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
            {t.hero.titleHighlight}
          </span>
        </h1>

        {/* Lighter-Weight, Single-Line Subhead */}
        <p className="text-lg sm:text-2xl text-emerald-100/90 font-medium max-w-2xl mx-auto leading-relaxed">
          {t.hero.subtitle}
        </p>

        {/* Single Dominant Primary CTA Button (MetaMask Style) */}
        <div className="pt-2 flex flex-col items-center justify-center space-y-3.5">
          <a
            href="https://wa.me/918000000000?text=Hi%20Krishi%20Niti%20I%20want%20to%20sell%20my%20crop"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-10 py-5 rounded-full bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-lg sm:text-xl transition-all transform hover:scale-[1.03] shadow-2xl shadow-amber-400/30 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <div className="h-9 w-9 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
              <MessageSquare size={20} className="fill-amber-400" />
            </div>
            <span>{t.hero.farmerCta}</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform ml-1" />
          </a>

          {/* Sub-label under CTA */}
          <span className="text-xs font-mono font-medium text-emerald-300/80">
            {t.hero.farmerCtaSub}
          </span>

          {/* Demoted Secondary Buyer Link */}
          <div className="pt-2">
            <Link
              href="/buyer/dashboard"
              className="text-xs sm:text-sm font-semibold text-emerald-300 hover:text-amber-300 underline underline-offset-4 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{t.hero.buyerLink}</span>
            </Link>
          </div>
        </div>

        {/* Micro Trust Row */}
        <div className="pt-2 text-xs sm:text-sm font-mono text-emerald-400/90 flex flex-wrap items-center justify-center gap-2">
          <span>{t.hero.microTrust}</span>
        </div>

        {/* Centered Hero Graphic Showcase (MetaMask App Teaser Style) */}
        <div className="pt-6 sm:pt-10 max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-emerald-950/70 border border-emerald-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
            
            {/* Top Bar of Showcase */}
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
                  The 3-Step Transaction Flow
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300 bg-emerald-900/90 px-3 py-1 rounded-full border border-emerald-700">
                100% Safe Escrow
              </span>
            </div>

            {/* 3 Horizontal Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              
              {/* Step 1 */}
              <div className="p-5 rounded-2xl bg-emerald-900/60 border border-emerald-700/70 space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">{t.showcaseVisual.step1Title}</h4>
                  <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">{t.showcaseVisual.step1Sub}</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-2xl bg-emerald-900/60 border border-emerald-700/70 space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-inner">
                  <Award size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">{t.showcaseVisual.step2Title}</h4>
                  <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">{t.showcaseVisual.step2Sub}</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl bg-emerald-900/60 border border-emerald-700/70 space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner">
                  <Wallet size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">{t.showcaseVisual.step3Title}</h4>
                  <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">{t.showcaseVisual.step3Sub}</p>
                </div>
              </div>

            </div>

            {/* Bottom Footer Line */}
            <div className="mt-6 pt-4 border-t border-emerald-800/80 flex items-center justify-between text-xs font-mono text-emerald-400/90">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Zero Risk • Nodal Bank Protected</span>
              </span>
              <span className="text-amber-300 font-bold">
                No Registration Fees
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
