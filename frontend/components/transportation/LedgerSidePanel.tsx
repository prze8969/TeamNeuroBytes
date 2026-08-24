'use client';

import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, DollarSign, CheckCircle2, Clock, X, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface LedgerItem {
  ewayBillNumber: string;
  cropName: string;
  variety: string;
  weightTons: number;
  corridor: string;
  advanceInr: number;
  settlementInr: number;
  totalInr: number;
  status: 'SETTLED' | 'ADVANCE_PAID' | 'PENDING';
  utr: string;
  settledAt: string;
}

export const INITIAL_LEDGER_ITEMS: LedgerItem[] = [
  {
    ewayBillNumber: 'EWB-2026-98412',
    cropName: 'Sharbati Wheat',
    variety: 'Lok-1 Clean Grain',
    weightTons: 5.0,
    corridor: 'Nashik Cluster ➔ Vashi APMC Scale #4',
    advanceInr: 1800.0,
    settlementInr: 4200.0,
    totalInr: 6000.0,
    status: 'SETTLED',
    utr: 'UTR-ICICI-SETTLE-894210',
    settledAt: '2026-08-24 11:30 AM'
  },
  {
    ewayBillNumber: 'EWB-2026-98319',
    cropName: 'Garva Onion',
    variety: 'Grade A Premium',
    weightTons: 12.0,
    corridor: 'Lasalgaon APMC ➔ Pune APMC Mandi',
    advanceInr: 4320.0,
    settlementInr: 10080.0,
    totalInr: 14400.0,
    status: 'SETTLED',
    utr: 'UTR-HDFC-SETTLE-771122',
    settledAt: '2026-08-23 04:15 PM'
  },
  {
    ewayBillNumber: 'EWB-2026-98414',
    cropName: 'Hybrid Tomato',
    variety: 'Abhinav Class-1',
    weightTons: 4.0,
    corridor: 'Narayangaon Hub ➔ Vashi APMC',
    advanceInr: 1920.0,
    settlementInr: 4480.0,
    totalInr: 6400.0,
    status: 'ADVANCE_PAID',
    utr: 'UTR-ICICI-ADV-771120',
    settledAt: 'In Progress (On Highway)'
  }
];

interface LedgerSidePanelProps {
  ledgerItems: LedgerItem[];
  selectedEwayBill: string | null;
  onSelectLedgerItem: (item: LedgerItem) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function LedgerSidePanel({
  ledgerItems,
  selectedEwayBill,
  onSelectLedgerItem,
  isCollapsed,
  onToggleCollapse
}: LedgerSidePanelProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<'total_high' | 'newest'>('total_high');

  const filteredItems = useMemo(() => {
    return ledgerItems.filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.ewayBillNumber.toLowerCase().includes(q) ||
        item.cropName.toLowerCase().includes(q) ||
        item.corridor.toLowerCase().includes(q) ||
        item.utr.toLowerCase().includes(q)
      );
    });
  }, [ledgerItems, searchQuery]);

  const sortedItems = useMemo(() => {
    const list = [...filteredItems];
    list.sort((a, b) => {
      if (sortOption === 'newest') return b.ewayBillNumber.localeCompare(a.ewayBillNumber);
      return b.totalInr - a.totalInr;
    });
    return list;
  }, [filteredItems, sortOption]);

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
          <DollarSign size={14} className="text-emerald-700 rotate-90" />
          <span>LEDGER ({ledgerItems.length})</span>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-full sm:w-[380px] lg:w-[420px] bg-slate-50/50 border-r border-slate-200 flex flex-col h-full shrink-0 relative font-sans transition-all">
      
      {/* HEADER */}
      <div className="p-3.5 bg-white border-b border-slate-200 sticky top-0 z-20 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-slate-900 tracking-tight">
              Payout Ledger &amp; Invoices
            </h2>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
              {sortedItems.length}
            </span>
          </div>

          <button
            onClick={onToggleCollapse}
            title="Collapse Panel"
            className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search E-Way Bill, crop, UTR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-8 h-9 text-xs rounded-xl border-slate-200 bg-slate-50/80 focus:bg-white focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="relative flex items-center">
          <ArrowUpDown size={12} className="absolute left-2.5 text-slate-400 pointer-events-none" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="w-full h-8 pl-7 pr-2 rounded-xl border border-slate-200 bg-white font-sans text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="total_high">Sort: Highest Total Payout</option>
            <option value="newest">Sort: E-Way Bill Reference</option>
          </select>
        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {sortedItems.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 my-4 text-xs text-slate-500">
            No ledger records match search.
          </div>
        ) : (
          sortedItems.map((item) => {
            const isSelected = item.ewayBillNumber === selectedEwayBill;
            return (
              <div
                key={item.ewayBillNumber}
                role="button"
                tabIndex={0}
                onClick={() => onSelectLedgerItem(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectLedgerItem(item);
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 relative group outline-none ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-600 shadow-md shadow-emerald-600/10 ring-1 ring-emerald-600'
                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                {isSelected && (
                  <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-emerald-600 rounded-r-full" />
                )}

                {/* Top row */}
                <div className="flex items-center justify-between gap-2 font-mono">
                  <span className="font-bold text-slate-900 text-[11px]">
                    {item.ewayBillNumber}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    item.status === 'SETTLED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-blue-100 text-blue-900 border border-blue-200'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* Middle row */}
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 text-xs">{item.cropName} ({item.weightTons} MT)</strong>
                    <strong className="text-slate-900 font-mono text-xs">₹{item.totalInr.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{item.corridor}</div>
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                  <span className="text-emerald-800 font-bold">30% Adv: ₹{item.advanceInr.toLocaleString('en-IN')}</span>
                  <span className="text-emerald-800 font-bold">70% Bal: ₹{item.settlementInr.toLocaleString('en-IN')}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </aside>
  );
}
