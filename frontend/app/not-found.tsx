'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  ShieldAlert,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KisanSetuLogo } from '@/components/layout/KisanSetuLogo';

export default function NotFound() {
  const stakeholderLinks = [
    { title: 'Farmer Command Center', href: '/farmer/dashboard', icon: '🚜' },
    { title: 'Buyer Marketplace', href: '/buyer/dashboard', icon: '🏢' },
    { title: 'FPO Aggregation Hub', href: '/fpo/dashboard', icon: '👥' },
    { title: 'Transporter Logistics', href: '/transportation/dashboard', icon: '🚚' },
    { title: 'Warehouse & Silos', href: '/warehouse/dashboard', icon: '🏭' },
    { title: 'Governance & Escrow', href: '/admin/dashboard', icon: '⚖️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 p-6 sm:p-12">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <KisanSetuLogo size="md" variant="light" badge="404 Error" showTagline={false} />
        </Link>
        <Link href="/">
          <Button variant="outline" size="sm" className="bg-emerald-900/60 border-emerald-700/80 text-emerald-200 hover:bg-emerald-800 hover:text-white text-xs font-bold rounded-xl">
            <Home size={14} className="mr-1.5" /> Return Home
          </Button>
        </Link>
      </header>

      {/* Main 404 Card */}
      <main className="max-w-3xl mx-auto w-full my-auto py-12 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold shadow-sm">
          <Compass size={14} className="animate-spin text-emerald-300" />
          <span>HTTP 404 • Page Not Found</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white">
            Lost in the Fields?
          </h1>
          <p className="text-sm sm:text-base text-emerald-200/80 max-w-lg mx-auto font-medium">
            The page or resource you are searching for does not exist, has been moved, or the URL might be mistyped.
          </p>
        </div>

        {/* Stakeholder Navigation Grid */}
        <div className="bg-emerald-950/80 border border-emerald-700/60 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4 text-left">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 block font-mono">
            Direct Access to Active Stakeholder Portals:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {stakeholderLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-700/50 hover:border-emerald-400 text-xs font-bold text-white transition-all hover:scale-[1.02]"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="truncate">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button className="h-11 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25">
              <Home size={14} className="mr-1.5" /> Back to Homepage
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="h-11 px-6 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-white border-emerald-700 text-xs font-bold">
              Sign In to Account →
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-emerald-400/60">
        © 2026 Krishi Niti • TeamNeuroBytes • Smart India Hackathon PS 26132
      </footer>
    </div>
  );
}
