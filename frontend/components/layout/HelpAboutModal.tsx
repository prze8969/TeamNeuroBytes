'use client';

import React, { useEffect } from 'react';
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
  Scale
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface HelpAboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpAboutModal({ isOpen, onClose }: HelpAboutModalProps) {
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-emerald-950 border border-emerald-700/80 rounded-3xl shadow-2xl overflow-hidden text-white font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-800/80 bg-emerald-900/80 sticky top-0 z-10 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-inner">
              <HelpCircle size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">Platform Guide &amp; Architecture</h3>
                <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 uppercase tracking-wider">
                  SIH 2026 • PS 26132
                </span>
              </div>
              <p className="text-xs text-[#E2F1E7]/90 font-medium">
                Krishi Niti: Smart Trading, Market Linkages &amp; Guaranteed Price Discovery
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

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-8 text-left divide-y divide-emerald-800/50">
          
          {/* Section 1: SIH Problem Statement Overview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider">
              <FileText size={14} />
              <span>01. SIH Problem Statement Overview</span>
            </div>
            <h4 className="text-xl font-bold text-white leading-snug">
              Strengthening Agricultural Market Linkages &amp; Direct Price Discovery
            </h4>
            <p className="text-xs text-[#E2F1E7]/90 leading-relaxed font-normal">
              Problem Statement 26132 addresses the structural inefficiencies in traditional agricultural supply chains—specifically middleman price manipulation, asymmetric mandi data, delayed payments, and uncalibrated crop quality assessment. Krishi Niti resolves this by introducing an omnichannel platform powered by AI vision grading, instant WhatsApp bot onboarding, spatial freight milk-runs, and milestone-backed bank escrow rails.
            </p>
          </div>

          {/* Section 2: Core System Architecture & Security */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-black uppercase tracking-wider">
              <Cpu size={14} />
              <span>02. Technical Architecture &amp; Security Rails</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Lock size={16} className="text-amber-400" />
                  <span>Bank Escrow Vault</span>
                </div>
                <p className="text-[11px] text-[#E2F1E7]/80 leading-relaxed">
                  100% buyer funds locked prior to dispatch. 30% fuel advance released to transporters; balance released upon 4-digit OTP farmgate handshake.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 space-y-2">
                <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
                  <Cpu size={16} className="text-teal-400" />
                  <span>Ultralytics YOLOv8 AI</span>
                </div>
                <p className="text-[11px] text-[#E2F1E7]/80 leading-relaxed">
                  Sub-second grain segmentation and defect area measurement providing instant Grade A/B/C digital certificates directly to farmers.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <Truck size={16} className="text-emerald-400" />
                  <span>PostGIS Milk-Runs</span>
                </div>
                <p className="text-[11px] text-[#E2F1E7]/80 leading-relaxed">
                  Spatial 10-km radius clustering that aggregates smallholder harvests into shared 15-ton truckloads, saving ~35% in logistics costs.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Stakeholder User Roles Legend */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-black uppercase tracking-wider">
              <Users size={14} />
              <span>03. Stakeholder Roles &amp; Portal Guide</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-900/70 border border-emerald-700/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">🚜 Farmer Portal</span>
                  <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">FARMER</span>
                </div>
                <p className="text-[11px] text-[#E2F1E7]/80 leading-normal">
                  List crops via WhatsApp or web, receive YOLOv8 quality certificate, compare mandi prices, and accept direct buyer bids.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-900/70 border border-emerald-700/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">🏢 Buyer Marketplace</span>
                  <span className="text-[9px] font-mono bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black">BUYER</span>
                </div>
                <p className="text-[11px] text-[#E2F1E7]/80 leading-normal">
                  Institutional GSTIN e-KYC onboarding, browse AI-graded lots, submit binding bids, and lock 100% escrow payment.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-900/70 border border-emerald-700/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">👥 FPO Collective</span>
                  <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">ORGANIZATION</span>
                </div>
                <p className="text-[11px] text-[#E2F1E7]/80 leading-normal">
                  Aggregate harvest lots across member farmers, dispatch milk-run clusters, and negotiate bulk corporate contracts.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-900/70 border border-emerald-700/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">🚚 Transporter Hub</span>
                  <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">TRANSPORTATION</span>
                </div>
                <p className="text-[11px] text-[#E2F1E7]/80 leading-normal">
                  AIS-140 GPS fleet tracking, claim pooled cluster trips, receive 30% fuel advances, and confirm OTP delivery handshakes.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-900/70 border border-emerald-700/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">🏭 Warehouse &amp; Silo</span>
                  <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">WAREHOUSE</span>
                </div>
                <p className="text-[11px] text-[#E2F1E7]/80 leading-normal">
                  WDRA certified cold bay telemetry, IoT temperature tracking, e-NWR electronic receipt minting, and pledge financing.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-900/70 border border-emerald-700/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">⚖️ Escrow Governance</span>
                  <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">ADMIN</span>
                </div>
                <p className="text-[11px] text-[#E2F1E7]/80 leading-normal">
                  Real-time audit of ₹1.42 Cr escrow vault balance, dispute grievance resolution, and AI model accuracy telemetry.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Platform Compliance & Verification */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider">
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
        <div className="p-4 px-6 border-t border-emerald-800/80 bg-emerald-900/60 flex items-center justify-between text-xs text-emerald-300">
          <span>Smart India Hackathon 2026 • TeamNeuroBytes</span>
          <a
            href={`${API_BASE_URL}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-amber-300 hover:underline flex items-center gap-1"
          >
            <span>View OpenAPI / Swagger Specifications</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
