'use client';

import React from 'react';
import Link from 'next/link';
import { HeroProductPreview } from '@/components/home/HeroProductPreview';
import { useLocaleContext } from '@/lib/LocaleContext';
import { LANDING_TRANSLATIONS } from '@/lib/landingTranslations';
import { MessageSquare, ShieldCheck, Lock, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  const { currentLocale } = useLocaleContext();
  const t = (LANDING_TRANSLATIONS[currentLocale] || LANDING_TRANSLATIONS.en).hero;

  return (
    <section className="relative w-full overflow-hidden pt-10 sm:pt-16 pb-16 sm:pb-20">
      
      {/* Subtle Background Glows & Mesh Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b98114_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Clear Subtext, Dominant WhatsApp CTA, Big Trust Badges (7 Cols) */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            {/* Top Friendly Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700/80 text-xs sm:text-sm font-bold text-amber-300 shadow-md">
              <span>{t.tag}</span>
            </div>

            {/* Short, Concrete Headline with Mukta font-display */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display font-heading tracking-tight text-white leading-[1.15]">
              {t.title1} <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                {t.titleHighlight}
              </span> <br className="hidden sm:inline" />
              {t.title2}
            </h1>

            {/* Short Plain Sentences (No Jargon) */}
            <div className="space-y-1 text-base sm:text-xl text-emerald-100/90 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              <p>{t.subtitle1}</p>
              <p className="text-emerald-200/80">{t.subtitle2}</p>
            </div>

            {/* Action Group: Dominant WhatsApp Primary CTA */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                
                {/* PRIMARY CTA: Single Most Visually Dominant Element on Page */}
                <Link
                  href="/farmer/dashboard"
                  className="w-full sm:w-auto px-8 py-4.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-base sm:text-lg transition-all transform hover:scale-[1.03] shadow-2xl shadow-amber-400/30 flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <div className="h-9 w-9 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                    <MessageSquare size={20} className="fill-amber-400" />
                  </div>
                  <div className="text-left">
                    <div className="leading-tight">{t.farmerCta}</div>
                    <div className="text-[11px] font-mono font-bold text-slate-900 leading-tight opacity-80 mt-0.5">
                      {t.farmerCtaSub}
                    </div>
                  </div>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform ml-1" />
                </Link>

                {/* Secondary Buyer Link */}
                <Link
                  href="/buyer/dashboard"
                  className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-emerald-900/40 border border-emerald-700/60 hover:bg-emerald-800/60 hover:border-emerald-500 text-emerald-200 hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.buyerCta}</span>
                </Link>

              </div>
            </div>

            {/* Large, Simple Trust Badges (Icon-First with Simple 1-2 Word Labels) */}
            <div className="pt-3 border-t border-emerald-800/60 grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0">
              
              {/* Trust Badge 1 */}
              <div className="p-3 rounded-2xl bg-emerald-900/50 border border-emerald-700/70 text-center space-y-1 shadow-sm">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 mx-auto flex items-center justify-center text-teal-300">
                  <ShieldCheck size={18} />
                </div>
                <div className="font-bold text-xs sm:text-sm text-white leading-tight">
                  {t.trustKyc}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono leading-tight">
                  {t.trustKycSub}
                </div>
              </div>

              {/* Trust Badge 2 */}
              <div className="p-3 rounded-2xl bg-emerald-900/50 border border-emerald-700/70 text-center space-y-1 shadow-sm">
                <div className="h-8 w-8 rounded-xl bg-amber-500/20 border border-amber-400/30 mx-auto flex items-center justify-center text-amber-300">
                  <Lock size={18} />
                </div>
                <div className="font-bold text-xs sm:text-sm text-white leading-tight">
                  {t.trustEscrow}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono leading-tight">
                  {t.trustEscrowSub}
                </div>
              </div>

              {/* Trust Badge 3 */}
              <div className="p-3 rounded-2xl bg-emerald-900/50 border border-emerald-700/70 text-center space-y-1 shadow-sm">
                <div className="h-8 w-8 rounded-xl bg-teal-500/20 border border-teal-400/30 mx-auto flex items-center justify-center text-teal-300">
                  <TrendingUp size={18} />
                </div>
                <div className="font-bold text-xs sm:text-sm text-white leading-tight">
                  {t.trustMandi}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono leading-tight">
                  {t.trustMandiSub}
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: 3-Step Visual Story Card (5 Cols) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <HeroProductPreview />
          </div>

        </div>
      </div>
    </section>
  );
}
