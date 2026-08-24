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
      <div className="flex-1 p-8 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
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
    <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-2xs overflow-y-auto font-sans">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-200 border border-emerald-800">
            E-Way Bill: {item.ewayBillNumber}
          </span>
          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
            item.status === 'SETTLED'
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
              : 'bg-blue-950 text-blue-300 border-blue-800'
          }`}>
            Status: {item.status}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {item.cropName} ({item.weightTons} MT)
            </h2>
            <p className="text-xs text-slate-300 font-mono pt-0.5">
              Variety: <strong>{item.variety}</strong> • Corridor: <strong>{item.corridor}</strong>
            </p>
          </div>

          <div className="text-left sm:text-right font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Total Freight Settlement</span>
            <strong className="text-2xl font-black text-emerald-400 block">
              ₹{item.totalInr.toLocaleString('en-IN')}
            </strong>
            <span className="text-[10px] text-slate-300">
              Processed via DBT Escrow Vault
            </span>
          </div>
        </div>
      </div>

      {/* Escrow Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Advance Card */}
        <div className="p-4 rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-900 uppercase">30% Instant Fuel Advance</span>
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
              DISBURSED
            </span>
          </div>
          <strong className="text-2xl font-black text-emerald-950 font-mono block">
            ₹{item.advanceInr.toLocaleString('en-IN')}
          </strong>
          <p className="text-[11px] text-slate-600 font-mono">
            Credited to Carrier Fuel Account via Direct DBT.
          </p>
        </div>

        {/* Balance Card */}
        <div className="p-4 rounded-3xl bg-blue-50/70 border border-blue-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-900 uppercase">70% Mandi Yard Settlement</span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
              item.status === 'SETTLED'
                ? 'bg-white text-blue-800 border-blue-200'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}>
              {item.status === 'SETTLED' ? 'RELEASED' : 'PENDING MANDI HANDOVER'}
            </span>
          </div>
          <strong className="text-2xl font-black text-blue-950 font-mono block">
            ₹{item.settlementInr.toLocaleString('en-IN')}
          </strong>
          <p className="text-[11px] text-slate-600 font-mono">
            Released upon weighbridge verification &amp; buyer OTP handshake.
          </p>
        </div>
      </div>

      {/* Settlement Audit Trail & Invoice Generation */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-700" />
            <h3 className="font-extrabold text-slate-900 text-xs">
              Banking UTR &amp; GSTIN Audit Record
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            RBI Escrow Compliant
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-100 font-mono text-xs space-y-2 text-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-sans">Banking UTR Ref:</span>
            <strong className="text-emerald-900">{item.utr}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-sans">Settlement Timestamp:</span>
            <strong className="text-slate-900">{item.settledAt}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-sans">Carrier GSTIN:</span>
            <strong className="text-slate-900">27AABCK9981F1Z2</strong>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
            <FileText size={14} className="text-emerald-700" />
            <span>Tax Invoice PDF Ready</span>
          </div>

          <Button
            type="button"
            onClick={() => onDownloadInvoice ? onDownloadInvoice(item) : alert(`Downloading Tax Invoice for ${item.ewayBillNumber}...`)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={13} />
            <span>Download GST Tax Invoice</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
