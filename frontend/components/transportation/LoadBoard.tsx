'use client';

import React from 'react';
import { MapPin, ArrowRight, Clock, Truck, IndianRupee, PackageCheck, PackageOpen } from 'lucide-react';
import type { OpenTenderItem } from './TenderSidePanel';

/**
 * Load Board — open freight tenders published by FPOs / buyers.
 * "Accept" opens the driver + vehicle assignment modal (real
 * POST /api/transporter/accept-load flow handled by the parent page).
 */

interface LoadBoardProps {
  tenders: OpenTenderItem[];
  onAccept: (tender: OpenTenderItem) => void;
  isLoading?: boolean;
}

export function LoadBoard({ tenders, onAccept, isLoading }: LoadBoardProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[0, 1].map(i => <div key={i} className="h-56 bg-slate-200 rounded-2xl animate-pulse" />)}
      </div>
    );
  }

  if (tenders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <PackageOpen size={22} className="text-slate-300" />
        </div>
        <h3 className="text-base font-bold text-slate-700">Load Board is clear</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">No open freight tenders right now. New loads published by FPOs and buyers will appear here instantly.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Open Freight Tenders</h2>
        <span className="text-[11px] font-semibold text-slate-500">{tenders.length} load{tenders.length === 1 ? '' : 's'} available</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {tenders.map(t => (
          <article key={t.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col hover:border-slate-300 transition-colors">
            {/* Card header */}
            <div className="px-5 pt-4 pb-3 border-b border-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">{t.id} · {t.lot_id}</p>
                  <h3 className="text-base font-bold text-slate-900 leading-tight mt-0.5">{t.crop_name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{t.variety} · {t.farmer_name}</p>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                  <PackageCheck size={11} /> {t.quantity_tons} MT
                </span>
              </div>
              {/* Route */}
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                <MapPin size={12} className="text-emerald-600 shrink-0" />
                <span className="truncate">{t.origin}</span>
                <ArrowRight size={12} className="text-slate-300 shrink-0" />
                <span className="truncate">{t.destination}</span>
              </div>
            </div>
            {/* Economics */}
            <div className="px-5 py-3.5 grid grid-cols-3 gap-2 border-b border-slate-50">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Freight</p>
                <p className="text-sm font-black text-slate-900 tracking-tight">₹{t.total_freight_inr.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Rate</p>
                <p className="text-sm font-black text-slate-900 tracking-tight">₹{t.freight_rate_kg.toFixed(2)}<span className="text-[10px] font-semibold text-slate-400">/kg</span></p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">30% Advance</p>
                <p className="text-sm font-black text-emerald-700 tracking-tight">₹{t.advance_30_pct_inr.toLocaleString('en-IN')}</p>
              </div>
            </div>
            {/* Constraints + action */}
            <div className="px-5 py-3.5 mt-auto">
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-slate-500 mb-3.5">
                <span className="inline-flex items-center gap-1"><Clock size={11} className="text-amber-500" /> {t.pickup_window}</span>
                <span className="inline-flex items-center gap-1"><Truck size={11} className="text-slate-400" /> Needs: {t.required_vehicle}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] text-slate-400 leading-tight flex items-center gap-1"><IndianRupee size={10} /> Balance ₹{(t.total_freight_inr - t.advance_30_pct_inr).toLocaleString('en-IN')} on delivery</p>
                <button onClick={() => onAccept(t)}
                  className="shrink-0 h-10 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1.5">
                  <Truck size={13} /> Accept Load
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
