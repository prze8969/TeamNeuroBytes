'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  ShieldCheck, 
  Layers, 
  Users, 
  Cpu, 
  Lock, 
  CheckCircle2, 
  HelpCircle,
  FileText,
  Truck,
  Building,
  Scale,
  Zap,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth, UserRole } from '@/lib/AuthContext';
import { API_BASE_URL } from '@/lib/api';
import { toast } from 'sonner';

interface HelpAboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpAboutModal({ isOpen, onClose }: HelpAboutModalProps) {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleQuickLogin = (role: UserRole, targetRoute: string, name: string) => {
    login(`${role.toLowerCase()}@kisansetu.in`, role);
    toast.success(`Evaluator Mode: Active as [${name}]`, {
      description: `Loaded pre-configured mock testing state for ${name}.`
    });
    onClose();
    router.push(targetRoute);
  };

  const handlePortalNavigate = (route: string, role: UserRole, name: string) => {
    login(`${role.toLowerCase()}@kisansetu.in`, role);
    onClose();
    router.push(route);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/90 backdrop-blur-lg animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-emerald-950 border border-emerald-700/80 rounded-3xl shadow-2xl overflow-hidden text-white font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-emerald-800/80 bg-emerald-900/90 sticky top-0 z-20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-inner">
              <HelpCircle size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-display text-white tracking-tight">Platform Guide &amp; Architecture</h3>
                <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 uppercase tracking-wider">
                  SIH 2026 • PS 26132
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-medium">
                Krishi Niti: Smart Agricultural Ecosystem &amp; Guaranteed Price Discovery
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-emerald-900/80 border border-emerald-700/60 text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Sandbox Switcher Banner for Evaluators */}
        <div className="bg-emerald-900/70 border-b border-emerald-800/80 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-bold font-mono">
            <Zap size={15} className="text-amber-400 animate-pulse" />
            <span>⚡ Quick Evaluator Demo:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleQuickLogin('FARMER', '/farmer/dashboard', 'Farmer')}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/90 hover:bg-amber-400 hover:text-slate-950 border border-emerald-700/80 text-emerald-100 font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1"
            >
              <span>🌾 Farmer</span>
            </button>
            <button
              onClick={() => handleQuickLogin('BUYER', '/buyer/dashboard', 'Institutional Buyer')}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/90 hover:bg-amber-400 hover:text-slate-950 border border-emerald-700/80 text-emerald-100 font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1"
            >
              <span>🏢 Buyer</span>
            </button>
            <button
              onClick={() => handleQuickLogin('TRANSPORTATION', '/transportation/dashboard', 'Transporter Fleet')}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/90 hover:bg-amber-400 hover:text-slate-950 border border-emerald-700/80 text-emerald-100 font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1"
            >
              <span>🚚 Transporter</span>
            </button>
            <button
              onClick={() => handleQuickLogin('ORGANIZATION', '/fpo/dashboard', 'FPO Collective')}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/90 hover:bg-amber-400 hover:text-slate-950 border border-emerald-700/80 text-emerald-100 font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1"
            >
              <span>👥 FPO Collective</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-8 text-left divide-y divide-emerald-800/50">
          
          {/* Section 1: SIH Problem Statement Overview & Innovation Metrics */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider font-mono">
              <FileText size={14} />
              <span>01. SIH Problem Statement &amp; Innovation Metrics</span>
            </div>
            <h4 className="text-xl font-bold font-display text-white leading-snug">
              Strengthening Agricultural Market Linkages &amp; Direct Price Discovery
            </h4>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-normal">
              Problem Statement 26132 addresses structural inefficiencies in traditional agricultural supply chains—specifically middleman price manipulation, asymmetric mandi data, delayed payments, and uncalibrated crop quality assessment. Krishi Niti resolves this through an omnichannel platform powered by AI computer vision grading, zero-friction WhatsApp bot onboarding, spatial freight milk-runs, and milestone-backed bank escrow rails.
            </p>

            {/* 3 Compact KPI Tags */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/80 border border-emerald-700/80 text-xs font-mono font-bold text-amber-300 shadow-sm">
                🎯 Middleman Cost Reduction: ~35%
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/80 border border-emerald-700/80 text-xs font-mono font-bold text-teal-300 shadow-sm">
                ⏱️ AI Grading Latency: &lt;0.5s
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/80 border border-emerald-700/80 text-xs font-mono font-bold text-emerald-300 shadow-sm">
                🔒 Payment Default Risk: 0% (Escrow Locked)
              </span>
            </div>
          </div>

          {/* Section 2: Deep-Tech Architecture & Stack Badges */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-black uppercase tracking-wider font-mono">
              <Cpu size={14} />
              <span>02. Deep-Tech Architecture &amp; Tech Stack</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: Bank Escrow */}
              <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm font-display">
                    <Lock size={16} className="text-amber-400" />
                    <span>Bank Escrow Vault</span>
                  </div>
                  <p className="text-[11px] text-emerald-100/85 leading-relaxed font-normal">
                    100% buyer funds locked prior to transit dispatch. 30% fuel advance released to transporters; balance released upon 4-digit OTP farmgate handshake.
                  </p>
                </div>
                <div className="pt-2.5 border-t border-emerald-800/60 flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-amber-300 border border-emerald-700">RBI Nodal Vault Standard</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">Milestone Smart Contract / Webhooks</span>
                </div>
              </div>

              {/* Card 2: YOLOv8 AI */}
              <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-teal-300 font-bold text-sm font-display">
                    <Cpu size={16} className="text-teal-400" />
                    <span>Ultralytics YOLOv8 AI</span>
                  </div>
                  <p className="text-[11px] text-emerald-100/85 leading-relaxed font-normal">
                    Sub-second grain segmentation and defect area measurement providing instant Grade A/B/C digital certificates directly to farmers.
                  </p>
                </div>
                <div className="pt-2.5 border-t border-emerald-800/60 flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-teal-300 border border-emerald-700">PyTorch</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-amber-300 border border-emerald-700">Farmgate Edge Inference</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">Grade A/B/C Certificate</span>
                </div>
              </div>

              {/* Card 3: PostGIS Milk-Runs */}
              <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm font-display">
                    <Truck size={16} className="text-emerald-400" />
                    <span>PostGIS Milk-Runs</span>
                  </div>
                  <p className="text-[11px] text-emerald-100/85 leading-relaxed font-normal">
                    Spatial 10-km radius clustering that aggregates smallholder harvests into shared 15-ton truckloads, saving ~35% in logistics costs.
                  </p>
                </div>
                <div className="pt-2.5 border-t border-emerald-800/60 flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-teal-300 border border-emerald-700">PostgreSQL Spatial Indexing</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-amber-300 border border-emerald-700">10-km Cluster Optimization</span>
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: Interactive Stakeholder Portals (Clickable Action Cards) */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-black uppercase tracking-wider font-mono">
              <Users size={14} />
              <span>03. Interactive Stakeholder Portals (Click to Launch)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              
              {/* Card 1: Farmer */}
              <div 
                onClick={() => handlePortalNavigate('/farmer/dashboard', 'FARMER', 'Farmer')}
                className="group p-4 rounded-2xl bg-emerald-900/70 border border-emerald-700/70 hover:border-emerald-400 hover:bg-emerald-900 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors font-display">
                      🚜 Farmer Portal
                    </span>
                    <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                      /farmer
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100/80 leading-relaxed font-normal">
                    List crops via WhatsApp or web, receive YOLOv8 quality certificate, compare mandi prices, and accept direct buyer bids.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-emerald-800/60 flex items-center justify-between text-[11px] font-bold text-amber-300 font-mono">
                  <span>Launch Portal</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2: Buyer */}
              <div 
                onClick={() => handlePortalNavigate('/buyer/dashboard', 'BUYER', 'Buyer')}
                className="group p-4 rounded-2xl bg-emerald-900/70 border border-emerald-700/70 hover:border-emerald-400 hover:bg-emerald-900 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors font-display">
                      🏢 Buyer Marketplace
                    </span>
                    <span className="text-[9px] font-mono bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black">
                      /buyer
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100/80 leading-relaxed font-normal">
                    Institutional GSTIN e-KYC onboarding, browse AI-graded lots, submit binding bids, and lock 100% escrow payment.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-emerald-800/60 flex items-center justify-between text-[11px] font-bold text-amber-300 font-mono">
                  <span>Launch Portal</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 3: FPO */}
              <div 
                onClick={() => handlePortalNavigate('/fpo/dashboard', 'ORGANIZATION', 'FPO Collective')}
                className="group p-4 rounded-2xl bg-emerald-900/70 border border-emerald-700/70 hover:border-emerald-400 hover:bg-emerald-900 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors font-display">
                      👥 FPO Collective
                    </span>
                    <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                      /fpo
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100/80 leading-relaxed font-normal">
                    Aggregate harvest lots across member farmers, dispatch milk-run clusters, and negotiate bulk corporate contracts.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-emerald-800/60 flex items-center justify-between text-[11px] font-bold text-amber-300 font-mono">
                  <span>Launch Portal</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 4: Transporter */}
              <div 
                onClick={() => handlePortalNavigate('/transportation/dashboard', 'TRANSPORTATION', 'Transporter')}
                className="group p-4 rounded-2xl bg-emerald-900/70 border border-emerald-700/70 hover:border-emerald-400 hover:bg-emerald-900 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors font-display">
                      🚚 Transporter Hub
                    </span>
                    <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                      /transportation
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100/80 leading-relaxed font-normal">
                    AIS-140 GPS fleet tracking, claim pooled cluster trips, receive 30% fuel advances, and confirm OTP delivery handshakes.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-emerald-800/60 flex items-center justify-between text-[11px] font-bold text-amber-300 font-mono">
                  <span>Launch Portal</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 5: Warehouse */}
              <div 
                onClick={() => handlePortalNavigate('/warehouse/dashboard', 'WAREHOUSE', 'Warehouse')}
                className="group p-4 rounded-2xl bg-emerald-900/70 border border-emerald-700/70 hover:border-emerald-400 hover:bg-emerald-900 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors font-display">
                      🏭 Warehouse &amp; Silo
                    </span>
                    <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                      /warehouse
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100/80 leading-relaxed font-normal">
                    WDRA certified cold bay telemetry, IoT temperature tracking, e-NWR electronic receipt minting, and pledge financing.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-emerald-800/60 flex items-center justify-between text-[11px] font-bold text-amber-300 font-mono">
                  <span>Launch Portal</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 6: Governance */}
              <div 
                onClick={() => handlePortalNavigate('/admin/dashboard', 'ADMIN', 'Escrow Admin')}
                className="group p-4 rounded-2xl bg-emerald-900/70 border border-emerald-700/70 hover:border-emerald-400 hover:bg-emerald-900 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors font-display">
                      ⚖️ Escrow Governance
                    </span>
                    <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                      /admin
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100/80 leading-relaxed font-normal">
                    Real-time audit of ₹1.42 Cr escrow vault balance, dispute grievance resolution, and AI model accuracy telemetry.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-emerald-800/60 flex items-center justify-between text-[11px] font-bold text-amber-300 font-mono">
                  <span>Launch Portal</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          </div>

          {/* Section 4: Platform Compliance & Verification */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider font-mono">
              <ShieldCheck size={14} />
              <span>04. Platform Verification &amp; Trust Compliance</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-900/50 border border-emerald-700/60 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-200">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>DigiLocker Aadhaar KYC</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>RBI Bank Escrow Guidelines</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>AGMARKNET Price Sync API</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>WDRA e-NWR Compliant</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="p-4 px-6 border-t border-emerald-800/80 bg-emerald-900/80 flex items-center justify-between text-xs text-emerald-300">
          <span>Smart India Hackathon 2026 • Problem Statement 26132</span>
          <a
            href={`${API_BASE_URL}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-amber-300 hover:underline flex items-center gap-1"
          >
            <span>FastAPI Swagger OpenAPI Specs</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
