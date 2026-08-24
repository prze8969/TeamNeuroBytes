'use client'

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Building2, CheckCircle2, Clock, FileCheck2, Info } from 'lucide-react';

export interface BuyerBadgeProps {
  isVerified?: boolean;
  businessName?: string;
  gstin?: string;
  buyerType?: 'WHOLESALER' | 'PROCESSOR' | 'RETAILER' | 'EXPORTER' | string;
  apmcMandi?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
  onVerifyClick?: () => void;
}

export function BuyerBadge({
  isVerified = true,
  businessName,
  gstin,
  buyerType,
  apmcMandi,
  size = 'md',
  showDetails = false,
  className = '',
  onVerifyClick
}: BuyerBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Size specific styling tokens
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-black'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  if (isVerified) {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <span
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`inline-flex items-center rounded-full font-bold border transition-all cursor-default select-none shadow-sm ${
            sizeClasses[size]
          } bg-emerald-500/15 text-emerald-900 border-emerald-400/80 hover:bg-emerald-500/25 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/70`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <ShieldCheck size={iconSizes[size]} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
          <span className="font-extrabold tracking-tight">Verified Institutional Buyer</span>
          {showDetails && gstin && (
            <span className="hidden sm:inline-block font-mono text-[10px] bg-emerald-200/70 dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 px-1.5 py-0.2 rounded font-semibold ml-1">
              GST: {gstin.slice(0, 2)}...{gstin.slice(-3)}
            </span>
          )}
        </span>

        {/* Hover verification metadata card */}
        {showTooltip && (
          <div className="absolute left-0 top-full mt-1.5 z-50 w-72 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-200 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between pb-1.5 border-b border-emerald-100 dark:border-emerald-800/60">
              <span className="font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <FileCheck2 size={13} /> DigiLocker & GSTN Certified
              </span>
              <span className="bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 text-[10px] font-black px-1.5 py-0.5 rounded">
                ACTIVE
              </span>
            </div>
            
            <div className="space-y-1 text-[11px]">
              {businessName && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Entity:</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[140px]">{businessName}</span>
                </div>
              )}
              {buyerType && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Tier:</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">{buyerType}</span>
                </div>
              )}
              {gstin && (
                <div className="flex justify-between">
                  <span className="text-slate-500">GSTIN:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{gstin}</span>
                </div>
              )}
              {apmcMandi && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Fulfillment Hub:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[140px]">{apmcMandi}</span>
                </div>
              )}
            </div>

            <div className="pt-1 text-[10px] text-emerald-800 dark:text-emerald-400 font-medium flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 p-1.5 rounded-lg">
              <CheckCircle2 size={11} className="shrink-0" />
              <span>Direct Agmarknet Escrow Settlement Enabled</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Unverified state
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <span
        onClick={onVerifyClick}
        className={`inline-flex items-center rounded-full font-bold border transition-all cursor-pointer select-none shadow-sm ${
          sizeClasses[size]
        } bg-amber-500/15 text-amber-900 border-amber-400/80 hover:bg-amber-500/25 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700/70`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <Clock size={iconSizes[size]} className="text-amber-700 dark:text-amber-400 shrink-0" />
        <span className="font-extrabold tracking-tight">KYC Pending / Unverified</span>
        {onVerifyClick && (
          <span className="underline ml-1 font-black text-amber-950 dark:text-amber-200 text-[10px]">
            Verify Now →
          </span>
        )}
      </span>
    </div>
  );
}

export default BuyerBadge;
