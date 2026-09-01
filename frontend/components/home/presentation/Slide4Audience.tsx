'use client';

import React from 'react';
import { Tractor, Building2 } from 'lucide-react';

export function Slide4Audience() {
  return (
    <section className="w-full min-h-[100dvh] snap-start flex flex-col justify-center bg-[#04130c] relative">
      
      {/* Title above split */}
      <div className="absolute top-[10vh] md:top-[15vh] left-0 w-full z-20 px-6 text-center">
         <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight drop-shadow-lg">
            Who is it for?
         </h2>
      </div>

      <div className="flex flex-col md:flex-row w-full h-full min-h-[100dvh]">
        
        {/* Left Side: Farmers */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 relative overflow-hidden bg-gradient-to-br from-[#061e13] to-[#04130c]">
          <div className="relative z-10 w-full max-w-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-14 w-14 rounded-2xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20 text-amber-400">
                <Tractor size={32} />
              </div>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-white tracking-wide uppercase">
                Farmers
              </h3>
            </div>
            
            <ul className="space-y-6 text-emerald-100/80 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">✓</span>
                <span>Sell directly to trusted buyers.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">✓</span>
                <span>Know the exact market price.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">✓</span>
                <span>Get secure, guaranteed payment.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">✓</span>
                <span>Reduce your transport costs.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Buyers */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 relative overflow-hidden bg-[#030d07]">
          <div className="relative z-10 w-full max-w-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                <Building2 size={32} />
              </div>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-white tracking-wide uppercase">
                Buyers
              </h3>
            </div>
            
            <ul className="space-y-6 text-emerald-100/80 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-teal-400 mt-1">✓</span>
                <span>Find verified crop supply instantly.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-400 mt-1">✓</span>
                <span>See detailed quality information.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-400 mt-1">✓</span>
                <span>Source directly from verified farms.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-400 mt-1">✓</span>
                <span>Coordinate pickup and logistics.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
