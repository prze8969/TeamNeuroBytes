'use client';

import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, PackageCheck, MapPin, Building2, Clock, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface OpenTenderItem {
  id: string;
  lot_id: string;
  crop_name: string;
  variety: string;
  farmer_name: string;
  origin: string;
  destination: string;
  quantity_tons: number;
  freight_rate_kg: number;
  total_freight_inr: number;
  advance_30_pct_inr: number;
  pickup_window: string;
  required_vehicle: string;
}

interface TenderSidePanelProps {
  tenders: OpenTenderItem[];
  selectedTenderId: string | null;
  onSelectTender: (tender: OpenTenderItem) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function TenderSidePanel({
  tenders,
  selectedTenderId,
  onSelectTender,
  isCollapsed,
  onToggleCollapse
}: TenderSidePanelProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<'freight_high' | 'advance_high' | 'tons_high'>('freight_high');

  const filteredTenders = useMemo(() => {
    return tenders.filter((t) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.crop_name.toLowerCase().includes(q) ||
        t.farmer_name.toLowerCase().includes(q) ||
        t.origin.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        t.required_vehicle.toLowerCase().includes(q)
      );
    });
  }, [tenders, searchQuery]);

  const sortedTenders = useMemo(() => {
    const list = [...filteredTenders];
    list.sort((a, b) => {
      if (sortOption === 'advance_high') return b.advance_30_pct_inr - a.advance_30_pct_inr;
      if (sortOption === 'tons_high') return b.quantity_tons - a.quantity_tons;
      return b.total_freight_inr - a.total_freight_inr;
    });
    return list;
  }, [filteredTenders, sortOption]);

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-slate-200 flex flex-col items-center py-4 space-y-4 shrink-0 transition-all">
        <button
          onClick={onToggleCollapse}
          title="Expand Side Panel"
          className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-950 flex items-center justify-center hover:bg-emerald-200 cursor-pointer shadow-xs border border-emerald-300"
        >
          <ChevronRight size={18} />
        </button>
        <div className="writing-mode-vertical text-xs font-black text-slate-700 tracking-wider font-mono flex items-center gap-2 pt-4">
          <PackageCheck size={14} className="text-emerald-700 rotate-90" />
          <span>TENDERS ({tenders.length})</span>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-full sm:w-[380px] lg:w-[420px] bg-[#FAFAF7] flex flex-col h-full shrink-0 relative font-sans transition-all px-2 pt-2">
      
      {/* HEADER */}
      <div className="p-4 bg-white sticky top-0 z-20 space-y-4 clay-card mb-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-widest text-emerald-800 uppercase block font-mono mb-1">
              MODE: LOAD BOARD TENDERS
            </span>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-950 tracking-tight leading-none">
                Open Freight Tenders
              </h2>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-950 shadow-[inset_1px_1px_3px_rgba(163,163,140,0.2)]">
                {sortedTenders.length}
              </span>
            </div>
          </div>

          <button
            onClick={onToggleCollapse}
            title="Collapse Panel"
            className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors shadow-xs"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search tender ID, crop, origin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 h-12 text-sm rounded-xl clay-input focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="relative flex items-center">
          <ArrowUpDown size={12} className="absolute left-3 text-slate-400 pointer-events-none" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="w-full h-12 pl-8 pr-2 rounded-xl bg-white font-sans text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 cursor-pointer border-none shadow-[3px_3px_8px_rgba(163,163,140,0.15),-3px_-3px_8px_rgba(255,255,255,0.8)]"
          >
            <option value="freight_high">Sort: Highest Freight Payout</option>
            <option value="advance_high">Sort: Highest 30% Advance</option>
            <option value="tons_high">Sort: Quantity (Highest MT)</option>
          </select>
        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {sortedTenders.length === 0 ? (
          <div className="p-8 text-center clay-card my-4 text-sm text-slate-500">
            No tenders match your search.
          </div>
        ) : (
          sortedTenders.map((tender) => {
            const isSelected = tender.id === selectedTenderId;
            return (
              <div
                key={tender.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectTender(tender)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTender(tender);
                  }
                }}
                className={`p-4 rounded-2xl transition-all cursor-pointer text-xs space-y-3 relative group outline-none ${
                  isSelected
                    ? 'clay-pressed bg-[#FAFAF7]'
                    : 'clay-card hover:translate-y-[-1px]'
                }`}
              >
                {isSelected && (
                  <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-emerald-600 rounded-r-full" />
                )}

                {/* Top row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="clay-pill-green text-[10px] font-extrabold px-2.5 py-0.5 font-mono">
                    {tender.id}
                  </span>
                  <strong className="text-emerald-850 font-mono font-black text-sm">
                    ₹{tender.total_freight_inr.toLocaleString('en-IN')}
                  </strong>
                </div>

                {/* Middle row */}
                <div className="p-3 rounded-xl clay-card-flat space-y-1.5">
                  <div className="font-extrabold text-slate-950 text-xs">
                    {tender.crop_name} • {tender.quantity_tons} MT
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-mono truncate">
                    <MapPin size={11} className="text-emerald-700 shrink-0" />
                    <span className="truncate">{tender.origin}</span>
                    <span className="text-slate-400 font-bold shrink-0">➔</span>
                    <Building2 size={11} className="text-blue-600 shrink-0" />
                    <span className="truncate">{tender.destination}</span>
                  </div>
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 pt-0.5">
                  <span className="text-emerald-850 font-bold">
                    30% Adv: ₹{tender.advance_30_pct_inr.toLocaleString('en-IN')}
                  </span>
                  <span className="clay-pill-amber flex items-center gap-1 px-2 py-0.5 font-bold text-[10px]">
                    <Clock size={11} />
                    {tender.pickup_window}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </aside>
  );
}
