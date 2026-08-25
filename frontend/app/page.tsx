'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KisanSetuLogo } from '@/components/layout/KisanSetuLogo';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, role, isAuthenticated } = useAuth();

  const handleCardClick = (targetRoute: string, requiredRole: string, roleKey: string) => {
    // 1. If unauthenticated -> intercept and redirect to /login with target & preselected role
    if (!isAuthenticated || !user) {
      const loginUrl = `/login?redirectTo=${encodeURIComponent(targetRoute)}&preselectedRole=${encodeURIComponent(roleKey)}`;
      router.push(loginUrl);
      return;
    }

    // 2. If authenticated -> verify role compatibility
    const isRoleMatched = 
      role === requiredRole || 
      role === 'ADMIN' || 
      (requiredRole === 'ORGANIZATION' && (role === 'ORGANIZATION' || (role as any) === 'FPO'));

    if (isRoleMatched) {
      if (targetRoute.includes('/buyer')) {
        try {
          localStorage.setItem('kisansetu_buyer_tab', 'marketplace');
        } catch {}
      }
      router.push(targetRoute);
    } else {
      toast.error('Unauthorized access: Please switch roles to access this portal', {
        description: `Your active role is [${role}]. This portal requires [${requiredRole}]. Please switch roles in the login gateway to continue.`
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-emerald-800/60 bg-emerald-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <KisanSetuLogo size="md" variant="light" badge="SIH 2026 • PS 26132" showTagline={true} />
          </Link>
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-emerald-300 bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-700/60">
                  Active: <strong>{role}</strong>
                </span>
                <Link
                  href={
                    role === 'BUYER' ? '/buyer/dashboard' :
                    role === 'ORGANIZATION' ? '/fpo/dashboard' :
                    role === 'ADMIN' ? '/admin/dashboard' :
                    role === 'TRANSPORTATION' ? '/transportation/dashboard' :
                    role === 'WAREHOUSE' ? '/warehouse/dashboard' : '/farmer/dashboard'
                  }
                  className="text-xs font-black px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/30 tracking-wide"
                >
                  My Dashboard →
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-bold px-4 py-2 rounded-xl border border-emerald-700 bg-emerald-900/80 text-white hover:bg-emerald-800 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-black px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/30 tracking-wide"
                >
                  Get Started →
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-6 py-16 flex flex-col items-center text-center space-y-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-400/40 text-emerald-200 text-xs font-extrabold shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          Next-Gen AI Agricultural Trade &amp; Price Discovery Platform
        </div>

        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl leading-[1.1]">
          Empowering Indian Farmers With <br />
          <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
            Guaranteed Price Discovery
          </span> &amp; Escrow
        </h2>

        <p className="max-w-3xl text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
          An omnichannel agricultural ecosystem combining zero-friction WhatsApp bot crop listing, Ultralytics YOLOv8 AI vision grading, PostGIS shared freight milk-runs, and milestone-backed bank escrow settlement.
        </p>

        {/* 4 Interactive Stakeholder Launchpads with Authentication Interception */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-6xl pt-4 text-left">
          
          {/* Card 1: Farmer Command Center */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => handleCardClick('/farmer/dashboard', 'FARMER', 'farmer')}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick('/farmer/dashboard', 'FARMER', 'farmer')}
            className="group p-6 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 hover:border-emerald-400 hover:bg-emerald-900/90 transition-all hover:scale-[1.02] space-y-3.5 shadow-xl backdrop-blur-md cursor-pointer select-none"
          >
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl">
              🚜
            </div>
            <h3 className="font-black text-lg text-white group-hover:text-emerald-300 flex items-center justify-between">
              <span>Farmer Command Center</span>
              <span className="text-xs text-emerald-300 font-mono group-hover:translate-x-1 transition-transform">→</span>
            </h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              YOLOv8 AI crop grading, Agmarknet Sell vs. Wait profit calculator &amp; WhatsApp Bot simulator.
            </p>
          </div>

          {/* Card 2: Buyer Marketplace */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => handleCardClick('/buyer/dashboard', 'BUYER', 'buyer')}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick('/buyer/dashboard', 'BUYER', 'buyer')}
            className="group p-6 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 hover:border-emerald-400 hover:bg-emerald-900/90 transition-all hover:scale-[1.02] space-y-3.5 shadow-xl backdrop-blur-md cursor-pointer select-none"
          >
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl">
              🏢
            </div>
            <h3 className="font-black text-lg text-white group-hover:text-emerald-300 flex items-center justify-between">
              <span>Buyer Marketplace</span>
              <span className="text-xs text-emerald-300 font-mono group-hover:translate-x-1 transition-transform">→</span>
            </h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Direct procurement of AI-certified crop lots with automated 100% Escrow deposit locking.
            </p>
          </div>

          {/* Card 3: FPO Aggregation */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => handleCardClick('/fpo/dashboard', 'ORGANIZATION', 'fpo')}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick('/fpo/dashboard', 'ORGANIZATION', 'fpo')}
            className="group p-6 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 hover:border-emerald-400 hover:bg-emerald-900/90 transition-all hover:scale-[1.02] space-y-3.5 shadow-xl backdrop-blur-md cursor-pointer select-none"
          >
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl">
              👥
            </div>
            <h3 className="font-black text-lg text-white group-hover:text-emerald-300 flex items-center justify-between">
              <span>FPO Aggregation</span>
              <span className="text-xs text-emerald-300 font-mono group-hover:translate-x-1 transition-transform">→</span>
            </h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              PostGIS 10-km milk-run spatial clustering saving ~30% in freight charges and bulk tenders.
            </p>
          </div>

          {/* Card 4: Escrow Governance */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => handleCardClick('/admin/dashboard', 'ADMIN', 'admin')}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick('/admin/dashboard', 'ADMIN', 'admin')}
            className="group p-6 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 hover:border-emerald-400 hover:bg-emerald-900/90 transition-all hover:scale-[1.02] space-y-3.5 shadow-xl backdrop-blur-md cursor-pointer select-none"
          >
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl">
              ⚖️
            </div>
            <h3 className="font-black text-lg text-white group-hover:text-emerald-300 flex items-center justify-between">
              <span>Escrow Governance</span>
              <span className="text-xs text-emerald-300 font-mono group-hover:translate-x-1 transition-transform">→</span>
            </h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              ₹1.42 Cr escrow vault oversight, dispute grievance mediation &amp; ML model telemetry.
            </p>
          </div>
        </div>

        {/* Live Architecture Feature Banner */}
        <div className="w-full max-w-5xl rounded-3xl border border-emerald-700/60 bg-emerald-950/80 p-8 shadow-2xl backdrop-blur-xl text-left grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <span className="text-emerald-300 text-xs font-black uppercase tracking-wider block">01 / Zero-Friction Farmer Bot</span>
            <h4 className="text-white font-bold text-sm">WhatsApp Business API Webhook</h4>
            <p className="text-xs text-emerald-200/70">Farmers list produce, drop location pins, and receive AI certificates via simple WhatsApp messages.</p>
          </div>
          <div className="space-y-1.5">
            <span className="text-teal-300 text-xs font-black uppercase tracking-wider block">02 / Neural Quality Vision</span>
            <h4 className="text-white font-bold text-sm">Ultralytics YOLOv8 Grading</h4>
            <p className="text-xs text-emerald-200/70">Sub-second grain segmentation, defect surface area calculation, and Grade A/B/C certification.</p>
          </div>
          <div className="space-y-1.5">
            <span className="text-amber-300 text-xs font-black uppercase tracking-wider block">03 / Zero-Default Escrow</span>
            <h4 className="text-white font-bold text-sm">Milestone 4-Digit OTP Rails</h4>
            <p className="text-xs text-emerald-200/70">100% buyer lock, 30% transporter fuel advance, and instant farmgate OTP settlement release.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-8 border-t border-emerald-800/60 text-center text-xs text-emerald-300 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© 2026 KisanSetu • TeamNeuroBytes • Smart India Hackathon PS 26132.</p>
        <div className="flex gap-6 text-emerald-300 font-bold">
          <Link href="/login" className="hover:text-white">Sign In</Link>
          <Link href="/register" className="hover:text-white">Register</Link>
          <a href="http://localhost:8000/docs" target="_blank" className="hover:text-white">Swagger API Docs ↗</a>
        </div>
      </footer>
    </div>
  );
}
