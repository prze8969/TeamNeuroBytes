'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KrishiNitiNav } from '@/components/layout/KrishiNitiNav';
import { LivePriceEngine } from '@/components/home/LivePriceEngine';
import { AiGradingSimulator } from '@/components/home/AiGradingSimulator';
import { EscrowTrackerWidget } from '@/components/home/EscrowTrackerWidget';
import { useAuth } from '@/lib/AuthContext';
import { API_BASE_URL } from '@/lib/api';
import { toast } from 'sonner';
import { 
  ShieldCheck, 
  TrendingUp, 
  Cpu, 
  Truck, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  Boxes, 
  Building2, 
  Warehouse, 
  Scale, 
  Users 
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, role, isAuthenticated } = useAuth();
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'price' | 'ai' | 'escrow'>('price');

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
      description: 'Ultralytics YOLOv8 crop grading, Agmarknet Sell vs. Wait profit calculator & zero-friction WhatsApp Bot simulator.'
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
      route: '/admin/dashboard',
      role: 'ADMIN',
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. Header Navigation */}
      <KrishiNitiNav />

      {/* 2. Hero Section */}
      <section className="max-w-7xl mx-auto w-full px-6 pt-16 pb-16 flex flex-col items-center text-center space-y-8">
        
        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading tracking-tight text-white max-w-5xl leading-[1.15]">
          Empowering Indian Farmers With <br />
          <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
            Guaranteed Price Discovery
          </span> &amp; Escrow
        </h1>

        {/* Hero Subtitle with High-Contrast Mint Text */}
        <p className="max-w-3xl text-lg sm:text-xl text-[#E2F1E7] leading-relaxed font-medium drop-shadow-xs">
          An omnichannel agricultural ecosystem combining zero-friction WhatsApp bot crop listing, Ultralytics YOLOv8 AI vision grading, PostGIS shared freight milk-runs, and milestone-backed bank escrow settlement.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/farmer/dashboard"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-400/25 tracking-wide flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare size={18} />
            <span>List Crop via WhatsApp Bot</span>
          </Link>

          <Link
            href="/buyer/dashboard"
            className="px-6 py-3.5 rounded-2xl bg-emerald-900/80 border border-emerald-700/80 hover:bg-emerald-800 text-white font-bold text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Buyer Marketplace</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Trust Badges Bar */}
        <div className="flex flex-wrap justify-center items-center gap-6 pt-4 text-xs font-semibold text-emerald-200">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>DigiLocker Aadhaar KYC</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>RBI Escrow Vault Standard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>AGMARKNET Real-time API</span>
          </div>
        </div>

      </section>

      {/* 4. Interactive Product Engine Showcase */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16 space-y-8">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-extrabold uppercase text-amber-300 tracking-wider">
            Live Product Demonstrator
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight">
            See Krishi Niti In Action
          </h2>
          <p className="text-sm text-[#E2F1E7]/90 max-w-2xl mx-auto font-normal">
            Interact with live price trajectory algorithms, YOLOv8 grain quality vision, and milestone bank escrow release.
          </p>
        </div>

        {/* Tab Switcher Bar */}
        <div className="flex justify-center">
          <div className="bg-emerald-950/80 p-1.5 rounded-2xl border border-emerald-700/80 inline-flex flex-wrap gap-1">
            <button
              onClick={() => setActiveShowcaseTab('price')}
              className={`px-5 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeShowcaseTab === 'price'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black rounded-xl'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60 rounded-xl'
              }`}
            >
              <TrendingUp size={15} className={activeShowcaseTab === 'price' ? 'text-slate-950' : 'text-amber-400'} />
              <span>01. AGMARKNET Price Engine</span>
            </button>

            <button
              onClick={() => setActiveShowcaseTab('ai')}
              className={`px-5 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeShowcaseTab === 'ai'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black rounded-xl'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60 rounded-xl'
              }`}
            >
              <Cpu size={15} className={activeShowcaseTab === 'ai' ? 'text-slate-950' : 'text-teal-300'} />
              <span>02. YOLOv8 AI Quality Scanner</span>
            </button>

            <button
              onClick={() => setActiveShowcaseTab('escrow')}
              className={`px-5 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeShowcaseTab === 'escrow'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black rounded-xl'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60 rounded-xl'
              }`}
            >
              <Lock size={15} className={activeShowcaseTab === 'escrow' ? 'text-slate-950' : 'text-amber-400'} />
              <span>03. Milestone Escrow Vault</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="pt-4">
          {activeShowcaseTab === 'price' && <LivePriceEngine />}
          {activeShowcaseTab === 'ai' && <AiGradingSimulator />}
          {activeShowcaseTab === 'escrow' && <EscrowTrackerWidget />}
        </div>

      </section>

      {/* 5. 4-Step Omnichannel How-It-Works Flow */}
      <section className="bg-emerald-950/80 border-y border-emerald-800/80 py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-12 text-center">
          
          <div className="space-y-3">
            <span className="text-xs font-mono font-extrabold uppercase text-emerald-300 tracking-wider">
              Omnichannel Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight">
              How Krishi Niti Works End-to-End
            </h2>
            <p className="text-sm text-[#E2F1E7]/90 max-w-2xl mx-auto">
              From WhatsApp farmgate listing to instant bank account settlement in 4 transparent steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            
            <div className="p-6 rounded-3xl bg-emerald-900/70 border border-emerald-700/70 space-y-4 shadow-xl backdrop-blur-md">
              <div className="h-12 w-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 font-extrabold text-xl font-mono">
                01
              </div>
              <h3 className="font-bold text-lg text-white">Zero-Friction WhatsApp Bot</h3>
              <p className="text-xs text-[#E2F1E7]/90 leading-relaxed font-normal">
                Farmers list produce, drop GPS location pins, and receive market price advice via simple WhatsApp chat messages in 8 regional languages.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-900/70 border border-emerald-700/70 space-y-4 shadow-xl backdrop-blur-md">
              <div className="h-12 w-12 rounded-2xl bg-teal-400/20 border border-teal-300/40 flex items-center justify-center text-teal-300 font-extrabold text-xl font-mono">
                02
              </div>
              <h3 className="font-bold text-lg text-white">YOLOv8 Neural Quality Vision</h3>
              <p className="text-xs text-[#E2F1E7]/90 leading-relaxed font-normal">
                Sub-second grain defect surface area calculation, moisture measurement, and Grade A/B/C digital certificate generation.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-900/70 border border-emerald-700/70 space-y-4 shadow-xl backdrop-blur-md">
              <div className="h-12 w-12 rounded-2xl bg-purple-400/20 border border-purple-300/40 flex items-center justify-center text-purple-300 font-extrabold text-xl font-mono">
                03
              </div>
              <h3 className="font-bold text-lg text-white">PostGIS Shared Freight</h3>
              <p className="text-xs text-[#E2F1E7]/90 leading-relaxed font-normal">
                Spatial 10-km radius clustering aggregates smallholder harvest lots into consolidated 15-Ton milk-run trucks, saving ~35% in logistics.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-900/70 border border-emerald-700/70 space-y-4 shadow-xl backdrop-blur-md">
              <div className="h-12 w-12 rounded-2xl bg-emerald-400/20 border border-emerald-300/40 flex items-center justify-center text-emerald-300 font-extrabold text-xl font-mono">
                04
              </div>
              <h3 className="font-bold text-lg text-white">Bank Escrow OTP Settlement</h3>
              <p className="text-xs text-[#E2F1E7]/90 leading-relaxed font-normal">
                100% buyer deposit locked in bank vault. 30% fuel advance to driver, and balance disbursed to farmer upon 4-digit OTP handshake.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Stakeholder Role Grid (Main Entry Points) */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16 space-y-8 text-center">
        
        <div className="space-y-3">
          <span className="text-xs font-mono font-extrabold uppercase text-amber-300 tracking-wider">
            Stakeholder Gateways
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight">
            Launch Your Role Command Center
          </h2>
          <p className="text-sm text-[#E2F1E7]/90 max-w-2xl mx-auto">
            Select your persona to access specialized dashboards for farmers, buyers, FPOs, transporters, warehouses, and escrow governance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {visiblePortals.map((portal) => (
            <div
              key={portal.title}
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(portal.route, portal.role, portal.roleKey)}
              onKeyDown={(e) => e.key === 'Enter' && handleCardClick(portal.route, portal.role, portal.roleKey)}
              className="group p-6 rounded-3xl bg-emerald-900/70 border border-emerald-700/70 hover:border-amber-400/80 hover:bg-emerald-900/95 transition-all hover:scale-[1.02] space-y-4 shadow-2xl backdrop-blur-md cursor-pointer select-none flex flex-col justify-between"
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
                  <h3 className="font-black text-lg text-white group-hover:text-amber-300 transition-colors">
                    {portal.title}
                  </h3>
                  <p className="text-xs text-[#E2F1E7]/90 leading-relaxed mt-2 font-normal">
                    {portal.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-800/70 flex items-center justify-between text-xs font-bold text-amber-300 font-mono">
                <span>Launch Portal</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 7. Substantial Footer */}
      <footer className="bg-emerald-950 text-white border-t border-emerald-800/80 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-left text-xs">
          
          <div className="space-y-3 md:col-span-2">
            <div className="font-heading font-black text-xl text-white">
              <span>Krishi</span><span className="text-amber-400 ml-1">Niti</span>
            </div>
            <p className="text-[#E2F1E7]/80 max-w-sm leading-relaxed">
              Smart India Hackathon SIH 2026 • Problem Statement 26132 (TeamNeuroBytes). Strengthening agricultural market linkages, guaranteed price discovery, YOLOv8 AI grading, and milestone bank escrow settlement.
            </p>
            <p className="text-emerald-400 font-mono font-bold">
              ✓ DigiLocker KYC • RBI Bank Escrow Standard • WDRA Silo Compliant
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase font-mono tracking-wider text-[11px]">Platform Portals</h4>
            <ul className="space-y-1.5 text-emerald-200/90 font-medium">
              <li><Link href="/farmer/dashboard" className="hover:text-amber-300">Farmer Command Center</Link></li>
              <li><Link href="/buyer/dashboard" className="hover:text-amber-300">Buyer Institutional Marketplace</Link></li>
              <li><Link href="/fpo/dashboard" className="hover:text-amber-300">FPO Aggregation &amp; Milk-Runs</Link></li>
              <li><Link href="/transportation/dashboard" className="hover:text-amber-300">Transporter Fleet Logistics</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase font-mono tracking-wider text-[11px]">Technical API</h4>
            <ul className="space-y-1.5 text-emerald-200/90 font-medium">
              <li>
                <a href={`${API_BASE_URL}/docs`} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 flex items-center gap-1">
                  <span>FastAPI OpenAPI Specs</span>
                  <span>↗</span>
                </a>
              </li>
              <li><Link href="/login" className="hover:text-amber-300">DigiLocker Login Gateway</Link></li>
              <li><Link href="/register" className="hover:text-amber-300">Stakeholder Onboarding</Link></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-emerald-800/80 text-center text-emerald-400/80 text-xs font-mono">
          <p>© 2026 Krishi Niti • Developed by TeamNeuroBytes for Smart India Hackathon PS 26132.</p>
        </div>
      </footer>

    </div>
  );
}
