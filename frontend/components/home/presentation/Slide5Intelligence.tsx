'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight, Activity } from 'lucide-react';

export function Slide5Intelligence() {
  return (
    <section className="w-full min-h-[100dvh] snap-start flex flex-col justify-center items-center bg-[#04130c] relative px-6 py-20 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20">
        
        {/* Left: Text Content */}
        <div className="text-center lg:text-left max-w-lg w-full">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-tight">
            Know exactly when to sell.
          </h2>
          <div className="w-16 h-1 bg-amber-400 mt-6 mx-auto lg:mx-0 rounded-full" />
          <p className="mt-6 text-emerald-100/70 text-lg leading-relaxed mb-8">
            Our platform doesn't just list your crops. We predict market prices so you know whether to sell today or wait for a better price.
          </p>
          
          <Link 
            href="/platform" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-emerald-700/60 text-emerald-300 hover:text-white hover:bg-emerald-900/40 hover:border-emerald-500 transition-all text-sm font-bold tracking-wide uppercase"
          >
            <span>See how we're different</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Right: Highly Simplified AI Visual */}
        <div className="w-full max-w-md relative">
          
          <div className="bg-[#061e13]/80 backdrop-blur-xl border border-emerald-800/50 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
              <span className="text-white font-display font-bold text-xl tracking-wide">Nashik APMC</span>
              <span className="px-3 py-1 bg-emerald-950 border border-emerald-700 rounded-full text-[10px] text-emerald-400 font-mono font-bold tracking-widest uppercase flex items-center gap-1.5">
                <Activity size={12} />
                Live Forecast
              </span>
            </div>

            {/* Price Data */}
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-end border-b border-emerald-800/40 pb-4">
                <span className="text-emerald-100/60 text-sm">Current price</span>
                <span className="text-white text-2xl font-bold font-mono">₹25.50<span className="text-sm font-normal text-emerald-100/50">/kg</span></span>
              </div>
              
              <div className="flex justify-between items-end">
                <span className="text-emerald-100/60 text-sm">7-day forecast</span>
                <span className="text-amber-400 text-2xl font-bold font-mono flex items-center gap-2">
                  <TrendingUp size={20} className="text-amber-400" />
                  ₹27.20<span className="text-sm font-normal text-amber-400/50">/kg</span>
                </span>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="mt-8 bg-amber-400/10 border border-amber-400/20 p-5 rounded-2xl relative z-10">
              <div className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">Recommended Action</div>
              <div className="text-white font-display font-bold text-xl mb-2">Wait 7 days</div>
              <div className="text-emerald-400 font-mono font-bold text-sm bg-emerald-950/50 inline-block px-2.5 py-1 rounded-md border border-emerald-800/50">
                +₹6,500 potential value
              </div>
            </div>

          </div>

          {/* Floating decorative element */}
          <div className="absolute -bottom-5 left-2 sm:-bottom-6 sm:-left-6 bg-[#04130c] border border-emerald-800/60 p-3 sm:p-4 rounded-2xl shadow-xl flex items-center gap-2.5 sm:gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
             <span className="text-[11px] sm:text-xs font-bold text-emerald-100 tracking-wide">AI Market Analysis Active</span>
          </div>

        </div>

      </div>
    </section>
  );
}
