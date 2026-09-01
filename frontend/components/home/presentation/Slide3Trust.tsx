'use client';

import React from 'react';
import { ShieldCheck, LineChart, Lock, Landmark } from 'lucide-react';
import { useLocaleContext } from '@/lib/LocaleContext';

export function Slide3Trust() {
  const { currentLocale } = useLocaleContext();

  const pillars = [
    {
      title: 'Verified Buyers',
      desc: 'Only verified participants can purchase.',
      icon: <ShieldCheck size={32} className="text-amber-400" />
    },
    {
      title: 'Transparent Prices',
      desc: 'Live mandi rates help farmers understand fair value.',
      icon: <LineChart size={32} className="text-teal-400" />
    },
    {
      title: 'Secure Payment',
      desc: 'Buyer payment is secured before pickup.',
      icon: <Lock size={32} className="text-emerald-400" />
    },
    {
      title: 'Direct Bank Payout',
      desc: 'Money goes directly to the farmer.',
      icon: <Landmark size={32} className="text-amber-400" />
    }
  ];

  return (
    <section className="w-full min-h-[100dvh] snap-start flex flex-col justify-center items-center bg-[#030d07] relative px-6 py-20 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-950/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left: Section Header */}
        <div className="text-center lg:text-left max-w-lg">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-tight">
            Is it safe to sell on Krishi Niti?
          </h2>
          <div className="w-16 h-1 bg-amber-400 mt-6 mx-auto lg:mx-0 rounded-full" />
          <p className="mt-6 text-emerald-100/70 text-lg leading-relaxed">
            We built a platform where farmers are always protected. No middlemen taking huge cuts, and no uncertainty about getting paid.
          </p>
        </div>

        {/* Right: Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="bg-[#061e13] border border-emerald-800/40 p-6 rounded-3xl flex flex-col items-start hover:border-amber-400/30 transition-colors shadow-lg">
              <div className="h-14 w-14 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center mb-5">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-wide font-display">
                {pillar.title}
              </h3>
              <p className="text-emerald-100/60 text-sm leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
