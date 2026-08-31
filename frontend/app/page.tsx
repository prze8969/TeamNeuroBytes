'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KrishiNitiNav } from '@/components/layout/KrishiNitiNav';
import { MinimalMetaMaskHero } from '@/components/home/MinimalMetaMaskHero';
import { LandingPageBody } from '@/components/home/LandingPageBody';
import { DifferentiationMatrix } from '@/components/home/DifferentiationMatrix';
import { JudgeTechFaq } from '@/components/home/JudgeTechFaq';
import { LivePriceEngine } from '@/components/home/LivePriceEngine';
import { AiGradingSimulator } from '@/components/home/AiGradingSimulator';
import { EscrowTrackerWidget } from '@/components/home/EscrowTrackerWidget';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useAuth } from '@/lib/AuthContext';
import { useLocaleContext } from '@/lib/LocaleContext';
import { LANDING_TRANSLATIONS } from '@/lib/landingTranslations';
import { API_BASE_URL } from '@/lib/api';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  Cpu, 
  Lock, 
  Users, 
  Zap, 
  ArrowRight 
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, role, isAuthenticated } = useAuth();
  const { currentLocale } = useLocaleContext();
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'price' | 'ai' | 'escrow'>('price');

  const pageCopy = LANDING_TRANSLATIONS[currentLocale] || LANDING_TRANSLATIONS.en;

  const handleCardClick = (targetRoute: string, requiredRole: string, roleKey: string) => {
    if (!isAuthenticated || !user) {
      const loginUrl = `/login?redirectTo=${encodeURIComponent(targetRoute)}&preselectedRole=${encodeURIComponent(roleKey)}`;
      router.push(loginUrl);
      return;
    }

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

  const stakeholderPortals = [
    {
      title: 'Farmer Command Center',
      icon: '🚜',
      route: '/farmer/dashboard',
      role: 'FARMER',
      roleKey: 'farmer',
      badge: 'Farmgate AI & Bids',
      description: 'Ultralytics YOLOv8 crop grading, AGMARKNET Sell-vs-Wait profit advisor & zero-friction WhatsApp bot listing simulator.'
    },
    {
      title: 'Buyer Marketplace',
      icon: '🏢',
      route: '/buyer/dashboard',
      role: 'BUYER',
      roleKey: 'buyer',
      badge: 'Institutional Procurement',
      description: 'Direct procurement of AI-certified crop lots with automated 100% Escrow deposit locking & real-time counter-bidding.'
    },
    {
      title: 'FPO Aggregation Hub',
      icon: '👥',
      route: '/fpo/dashboard',
      role: 'ORGANIZATION',
      roleKey: 'fpo',
      badge: 'PostGIS Clustering',
      description: 'Consolidated member harvest lots with 10-km milk-run spatial routing, saving ~35% in freight costs & bulk tenders.'
    },
    {
      title: 'Transporter Fleet Hub',
      icon: '🚚',
      route: '/transportation/dashboard',
      role: 'TRANSPORTATION',
      roleKey: 'transporter',
      badge: 'Corridor Logistics',
      description: 'AIS-140 GPS fleet tracking, instant 30% fuel advance credits, e-Way bill management & farmgate OTP handshakes.'
    },
    {
      title: 'Warehouse & Cold Storage',
      icon: '🏭',
      route: '/warehouse/dashboard',
      role: 'WAREHOUSE',
      roleKey: 'warehouse',
      badge: 'WDRA e-NWR Silos',
      description: 'IoT temperature & humidity telemetry, certified cold bays, gate outward dispatch & instant e-NWR pledge minting.'
    },
    {
      title: 'Escrow Governance',
      icon: '⚖️',
      role: 'ADMIN',
      route: '/admin/dashboard',
      roleKey: 'admin',
      badge: 'RBI Escrow Oversight',
      description: '₹1.42 Cr escrow vault surveillance, dispute grievance arbitration, AI model telemetry & platform transaction audits.'
    },
  ];

  const visiblePortals = isAuthenticated
    ? stakeholderPortals.filter((portal) => {
        if (role === 'ADMIN') return portal.role === 'ADMIN';
        if (role === 'ORGANIZATION') return portal.role === 'ORGANIZATION';
        return portal.role === role;
      })
    : stakeholderPortals;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#04130c] via-[#061e13] to-[#030d07] text-white font-sans flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">
      
      {/* 1. Header Navigation */}
      <KrishiNitiNav />

      {/* 2. Ultra-Minimal Hero: 3-Line Tagline & Dominant WhatsApp CTA (UNTOUCHED) */}
      <MinimalMetaMaskHero />

      {/* 3. Refactored Body: Metrics Bar -> 6-Step Pipeline -> Safe by Design -> Dual-Role CTA */}
      <LandingPageBody />

      {/* 4. Interactive Live Product Demonstrator (Sandbox) */}
      <section id="live-demo" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-20 sm:py-28 space-y-12">
        <ScrollReveal>
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/80 text-xs font-mono font-bold text-amber-300">
              <Zap size={13} />
              <span>{pageCopy.showcase.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display font-heading text-white tracking-tight leading-tight">
              {pageCopy.showcase.title}
            </h2>
            <p className="text-base sm:text-lg text-emerald-100/80 font-normal leading-relaxed">
              {pageCopy.showcase.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Tab Switcher Bar */}
        <div className="flex justify-center">
          <div className="bg-emerald-950/90 p-1.5 rounded-2xl border border-emerald-700/80 inline-flex flex-wrap gap-1.5 shadow-xl backdrop-blur-md">
            <button
              onClick={() => setActiveShowcaseTab('price')}
              className={`px-4 sm:px-5 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeShowcaseTab === 'price'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black rounded-xl'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60 rounded-xl'
              }`}
            >
              <TrendingUp size={15} className={activeShowcaseTab === 'price' ? 'text-slate-950' : 'text-amber-400'} />
              <span>{pageCopy.showcase.tabPrice}</span>
            </button>

            <button
              onClick={() => setActiveShowcaseTab('ai')}
              className={`px-4 sm:px-5 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeShowcaseTab === 'ai'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black rounded-xl'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60 rounded-xl'
              }`}
            >
              <Cpu size={15} className={activeShowcaseTab === 'ai' ? 'text-slate-950' : 'text-teal-300'} />
              <span>{pageCopy.showcase.tabAi}</span>
            </button>

            <button
              onClick={() => setActiveShowcaseTab('escrow')}
              className={`px-4 sm:px-5 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeShowcaseTab === 'escrow'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black rounded-xl'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60 rounded-xl'
              }`}
            >
              <Lock size={15} className={activeShowcaseTab === 'escrow' ? 'text-slate-950' : 'text-amber-400'} />
              <span>{pageCopy.showcase.tabEscrow}</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="pt-2">
          {activeShowcaseTab === 'price' && <LivePriceEngine />}
          {activeShowcaseTab === 'ai' && <AiGradingSimulator />}
          {activeShowcaseTab === 'escrow' && <EscrowTrackerWidget />}
        </div>
      </section>

      {/* 5. Strategic Comparison Matrix */}
      <ScrollReveal>
        <DifferentiationMatrix />
      </ScrollReveal>

      {/* 6. Technical & Judge Architecture FAQs */}
      <ScrollReveal>
        <JudgeTechFaq />
      </ScrollReveal>

      {/* 7. Role Gateways */}
      <section id="portals" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-20 sm:py-28 space-y-12 text-center">
        <ScrollReveal>
          <div className="space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/80 text-xs font-mono font-bold text-amber-300">
              <Users size={13} />
              <span>{pageCopy.portals.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display font-heading text-white tracking-tight leading-tight">
              {pageCopy.portals.title}
            </h2>
            <p className="text-base sm:text-lg text-emerald-100/80 font-normal leading-relaxed">
              {pageCopy.portals.subtitle}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {visiblePortals.map((portal, idx) => (
            <ScrollReveal key={portal.title} delayMs={idx * 100}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick(portal.route, portal.role, portal.roleKey)}
                onKeyDown={(e) => e.key === 'Enter' && handleCardClick(portal.route, portal.role, portal.roleKey)}
                className="group h-full p-7 rounded-3xl bg-emerald-950/70 border border-emerald-700/70 hover:border-amber-400/80 hover:bg-emerald-900/90 transition-all duration-300 hover:scale-[1.02] space-y-4 shadow-2xl backdrop-blur-md cursor-pointer select-none flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl shadow-inner">
                      {portal.icon}
                    </div>
                    <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-700/80">
                      {portal.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-xl text-white group-hover:text-amber-300 transition-colors font-display">
                      {portal.title}
                    </h3>
                    <p className="text-sm text-emerald-100/80 leading-relaxed mt-2 font-normal">
                      {portal.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-800/70 flex items-center justify-between text-xs font-bold text-amber-300 font-mono">
                  <span>{pageCopy.portals.launch}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 8. Technical & SIH Footer */}
      <footer className="bg-[#020a05] text-white border-t border-emerald-800/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-left text-xs">
          
          <div className="space-y-4 md:col-span-2">
            <div className="font-heading font-black text-2xl text-white">
              <span>Krishi</span><span className="text-amber-400 ml-1">Niti</span>
            </div>
            <p className="text-emerald-100/80 max-w-sm leading-relaxed text-sm">
              Smart India Hackathon SIH 2026 • Problem Statement 26132 (TeamNeuroBytes). Strengthening agricultural market linkages, transparent price discovery, YOLOv8 AI grading, and milestone bank escrow settlement.
            </p>
            <div className="text-emerald-400 font-mono font-bold text-xs space-y-1">
              <p>✓ DigiLocker Aadhaar KYC • RBI-Compliant Escrow Vault • WDRA Silo Compliant</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase font-mono tracking-wider text-xs text-amber-300">
              Platform Portals
            </h4>
            <ul className="space-y-2 text-emerald-200/90 font-medium text-sm">
              <li><Link href="/farmer/dashboard" className="hover:text-amber-300 transition-colors">🌾 Farmer Command Center</Link></li>
              <li><Link href="/buyer/dashboard" className="hover:text-amber-300 transition-colors">🏢 Buyer Marketplace</Link></li>
              <li><Link href="/fpo/dashboard" className="hover:text-amber-300 transition-colors">👥 FPO Aggregation</Link></li>
              <li><Link href="/transportation/dashboard" className="hover:text-amber-300 transition-colors">🚚 Transporter Fleet</Link></li>
              <li><Link href="/warehouse/dashboard" className="hover:text-amber-300 transition-colors">🏭 WDRA Silos</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase font-mono tracking-wider text-xs text-teal-300">
              Governance &amp; Tech
            </h4>
            <ul className="space-y-2 text-emerald-200/90 font-medium text-sm">
              <li>
                <a href={`${API_BASE_URL}/docs`} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 flex items-center gap-1">
                  <span>FastAPI OpenAPI Specs</span>
                  <span>↗</span>
                </a>
              </li>
              <li><Link href="/admin/dashboard" className="hover:text-amber-300 transition-colors">⚖️ Escrow Governance Oversight</Link></li>
              <li><Link href="/login" className="hover:text-amber-300 transition-colors">🔐 DigiLocker Login Gateway</Link></li>
              <li><Link href="/register" className="hover:text-amber-300 transition-colors">📝 Stakeholder Onboarding</Link></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 mt-10 border-t border-emerald-800/80 text-center text-emerald-400/80 text-xs font-mono">
          <p>© 2026 Krishi Niti • Built by TeamNeuroBytes for Smart India Hackathon PS 26132.</p>
        </div>
      </footer>

    </div>
  );
}
