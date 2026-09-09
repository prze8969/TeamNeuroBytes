'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowRight } from 'lucide-react';

export function Slide6CTA() {
  return (
    <section className="w-full min-h-[100dvh] snap-start flex flex-col justify-between bg-[#030d07] relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent pointer-events-none" />

      {/* Main CTA Content - Centered */}
      <div className="flex-grow flex flex-col justify-center items-center px-6 relative z-10 w-full max-w-4xl mx-auto text-center">
        
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-xl">
          Ready to trade your harvest <br className="hidden md:block"/> at a fair price?
        </h2>
        
        <p className="text-lg md:text-xl text-emerald-100/80 max-w-2xl mx-auto mb-12">
          Free for farmers on WhatsApp. No app to download. Secure payment.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
          {/* Primary CTA */}
          <a
            href="https://wa.me/918000000000?text=Hi%20Krishi%20Niti%20I%20want%20to%20trade%20my%20harvest"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-[#04130c] font-black text-lg uppercase tracking-wider transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(251,191,36,0.3)]"
          >
            <MessageSquare size={20} className="fill-[#04130c]" />
            <span>Start on WhatsApp</span>
          </a>

          {/* Secondary CTA */}
          <Link
            href="/buyer/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-emerald-700 hover:border-emerald-500 text-white hover:bg-emerald-900/30 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <span>I'm a Buyer</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-emerald-900/50 bg-[#020a05] py-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-emerald-100/50">
          
          <div className="flex items-center gap-6">
            <div className="font-heading font-black text-lg text-white">
              <span>Krishi</span><span className="text-amber-400 ml-1">Niti</span>
            </div>
            <span>© 2026 TeamNeuroBytes</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/platform" className="hover:text-amber-400 transition-colors uppercase tracking-widest">
              Tech Platform & APIs
            </Link>
            <Link href="/login" className="hover:text-amber-400 transition-colors uppercase tracking-widest">
              Login Gateway
            </Link>
          </div>

        </div>
      </footer>

    </section>
  );
}
