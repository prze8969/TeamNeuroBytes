'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { KisanSetuLogo } from '@/components/layout/KisanSetuLogo';
import { HelpAboutModal } from '@/components/layout/HelpAboutModal';
import { useAuth } from '@/lib/AuthContext';
import { HelpCircle, ShieldCheck } from 'lucide-react';

export function KrishiNitiNav() {
  const { role, isAuthenticated } = useAuth();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-emerald-800/80 bg-emerald-950/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Enlarged KrishiNiti Brand Anchor */}
          <Link href="/" className="flex items-center group">
            <KisanSetuLogo size="lg" variant="light" badge="SIH 2026 • PS 26132" showTagline={true} />
          </Link>

          {/* Navigation Action Buttons */}
          <div className="flex items-center space-x-2.5">
            {isAuthenticated && (
              <span className="hidden md:inline-flex text-xs font-mono text-emerald-300 bg-emerald-900/80 px-3 py-1.5 rounded-xl border border-emerald-700/80 mr-1">
                Active: <strong>{role}</strong>
              </span>
            )}

            <button
              onClick={() => setIsHelpOpen(true)}
              className="text-xs font-bold px-3.5 py-2 rounded-xl border border-emerald-700/80 bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800 hover:text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle size={14} className="text-amber-300" />
              <span>Help &amp; Architecture</span>
            </button>

            <Link
              href="/login"
              className="text-xs font-bold px-3.5 py-2 rounded-xl border border-emerald-700/80 bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800 hover:text-white transition-all shadow-sm"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="text-xs font-black px-4.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition-all shadow-lg shadow-amber-400/20 tracking-wide flex items-center gap-1 cursor-pointer"
            >
              <span>Register</span>
              <span className="font-mono">→</span>
            </Link>
          </div>

        </div>
      </header>

      <HelpAboutModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}
