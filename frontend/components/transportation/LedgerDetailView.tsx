'use client';

import React from 'react';
import { DollarSign, ShieldCheck, Download, CheckCircle2, FileText, Building2, CreditCard, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LedgerItem } from './LedgerSidePanel';

interface LedgerDetailViewProps {
  item: LedgerItem | null;
  onDownloadInvoice?: (item: LedgerItem) => void;
}

export function LedgerDetailView({ item, onDownloadInvoice }: LedgerDetailViewProps) {
  if (!item) {
    return (
      <div className="flex-1 p-8 text-center bg-white rounded-3xl clay-card flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg shadow-[inset_1px_1px_3px_rgba(46,125,50,0.15)]">
          <DollarSign size={24} />
        </div>
        <h3 className="font-black text-slate-900 text-sm">Select a Payout Record</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Select an invoice or payout record from the side panel to view the complete RBI Escrow settlement breakdown and download tax invoices.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-2xl p-5 space-y-5 clay-card overflow-y-auto font-sans">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-emerald-800 text-white space-y-4 shadow-md border-none">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-emerald-900 text-white shadow-xs">
            E-Way Bill: {item.ewayBillNumber}
          </span>
          <span className={`text-xs font-mono font-extrabold px-3 py-0.5 rounded-full ${
            item.status === 'SETTLED'
              ? 'clay-pill-green'
              : 'bg-blue-50 text-blue-900 shadow-xs'
          }`}>
            Status: {item.status}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight leading-tight">
              {item.cropName} ({item.weightTons} MT)
            </h2>
            <p className="text-xs text-emerald-100 font-mono pt-1">
              Variety: <strong>{item.variety}</strong> • Corridor: <strong>{item.corridor}</strong>
            </p>
          </div>

          <div className="text-left sm:text-right font-mono">
            <span className="text-[10px] text-emerald-100 uppercase font-sans font-bold block">Total Settlement</span>
            <strong className="text-2xl font-black text-white block">
              ₹{item.totalInr.toLocaleString('en-IN')}
            </strong>
            <span className="text-[10px] text-emerald-200 font-bold">
              Processed via DBT Escrow
            </span>
          </div>
        </div>
      </div>

      {/* Escrow Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Advance Card */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 space-y-2 shadow-xs border-none">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-900 uppercase">30% Fuel Advance</span>
            <span className="clay-pill-green text-[10px] font-extrabold px-2 py-0.5">
              DISBURSED
            </span>
          </div>
          <strong className="text-2xl font-black text-emerald-950 font-mono block">
            ₹{item.advanceInr.toLocaleString('en-IN')}
          </strong>
          <p className="text-xs text-slate-600 font-mono">
            Credited directly to Carrier Account.
          </p>
        </div>

        {/* Balance Card */}
        <div className="p-4 rounded-2xl bg-blue-50/50 space-y-2 shadow-xs border-none">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-900 uppercase">70% Mandi Settlement</span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
              item.status === 'SETTLED' ? 'clay-pill-green' : 'clay-pill-amber'
            }`}>
              {item.status === 'SETTLED' ? 'RELEASED' : 'PENDING'}
            </span>
          </div>
          <strong className="text-2xl font-black text-blue-950 font-mono block">
            ₹{item.settlementInr.toLocaleString('en-IN')}
          </strong>
          <p className="text-xs text-slate-600 font-mono">
            Released upon OTP &amp; scale pass.
          </p>
        </div>
      </div>

      {/* Settlement Audit Trail & Invoice Generation */}
      <div className="p-4 sm:p-5 rounded-2xl clay-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-700" />
            <h3 className="font-extrabold text-slate-900 text-xs">
              Banking UTR &amp; GSTIN Audit Trail
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 font-bold">
            RBI Escrow Compliant
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFAF7] font-mono text-xs space-y-2 text-slate-800 shadow-xs border-none">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-sans">Banking UTR Ref:</span>
            <strong className="text-emerald-900 font-bold">{item.utr}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-sans">Settlement Date:</span>
            <strong className="text-slate-900">{item.settledAt}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-sans">Carrier GSTIN:</span>
            <strong className="text-slate-900 font-bold">27AABCK9981F1Z2</strong>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="text-xs text-slate-600 font-mono flex items-center gap-1.5">
            <FileText size={14} className="text-emerald-700" />
            <span>Official GST Tax Invoice (PDF)</span>
          </div>

          <Button
            type="button"
            onClick={() => onDownloadInvoice ? onDownloadInvoice(item) : alert(`Downloading Tax Invoice for ${item.ewayBillNumber}...`)}
            variant="clayPrimary"
            className="h-12 px-6 rounded-2xl text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Download size={14} />
            <span>Download GST Tax Invoice</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
