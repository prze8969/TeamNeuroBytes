'use client';

import React, { useMemo } from 'react';
import { IndianRupee, Wallet, Star, Trophy, ArrowDownToLine, ArrowUpRight, Truck } from 'lucide-react';
import type { TransportationOrder } from '@/lib/transportation-types';
import { INITIAL_LEDGER_ITEMS, type LedgerItem } from './LedgerSidePanel';
import type { CarrierProfileSummary } from '@/lib/transportation-client';

/**
 * Earnings — carrier wallet summary + freight ledger.
 * Ledger rows are derived from the REAL order records (advance / balance /
 * UTR / waybill) and merged with the existing ledger history items.
 */

function deriveLedgerFromOrders(orders: TransportationOrder[]): LedgerItem[] {
  return orders
    .filter(o => o.advanceClaimed || ['DELIVERED', 'COMPLETED', 'ARRIVED_AT_MANDI'].includes(o.status))
    .map(o => {
      const settled = o.status === 'DELIVERED' || o.status === 'COMPLETED';
      return {
        ewayBillNumber: o.ewayBillNumber,
        cropName: o.shipment.cropName,
        variety: o.shipment.variety,
        weightTons: o.shipment.weightTons,
        corridor: `${o.origin.name.split(',')[0]} ➔ ${o.destination.name.split(',')[0]}`,
        advanceInr: o.advanceFreightInr,
        settlementInr: o.balanceFreightInr,
        totalInr: o.totalFreightInr,
        status: (settled ? 'SETTLED' : o.advanceClaimed ? 'ADVANCE_PAID' : 'PENDING') as LedgerItem['status'],
        utr: o.advanceUtr || '—',
        settledAt: settled
          ? new Date(o.updatedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })
          : o.advanceClaimed ? 'In Progress (On Highway)' : 'Pending pickup',
      };
    });
}

function ledgerChip(status: LedgerItem['status']): { label: string; cls: string } {
  switch (status) {
    case 'SETTLED': return { label: 'Settled', cls: 'bg-emerald-50 text-emerald-700' };
    case 'ADVANCE_PAID': return { label: 'Advance Paid', cls: 'bg-blue-50 text-blue-700' };
    default: return { label: 'Pending', cls: 'bg-amber-50 text-amber-700' };
  }
}

export function EarningsPanel({ orders, carrierProfile }: { orders: TransportationOrder[]; carrierProfile: CarrierProfileSummary | null }) {
  const { escrowBalance, settledFreight, advancesOutstanding, balanceOnDelivery, rows } = useMemo(() => {
    const completed = orders.filter(o => ['DELIVERED', 'COMPLETED'].includes(o.status));
    const settledFreight = completed.reduce((s, o) => s + o.totalFreightInr, 0);
    const advancesOutstanding = orders
      .filter(o => o.advanceClaimed && !['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(o.status))
      .reduce((s, o) => s + o.advanceFreightInr, 0);
    const balanceOnDelivery = orders
      .filter(o => ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'ARRIVED_AT_MANDI'].includes(o.status))
      .reduce((s, o) => s + o.balanceFreightInr, 0);

    // Merge: live orders first (freshest), then historic ledger rows not already covered by waybill
    const derived = deriveLedgerFromOrders(orders);
    const seenWaybills = new Set(derived.map(r => r.ewayBillNumber));
    const historic = INITIAL_LEDGER_ITEMS.filter(r => !seenWaybills.has(r.ewayBillNumber));
    return {
      escrowBalance: carrierProfile?.available_escrow_balance_inr ?? 0,
      settledFreight,
      advancesOutstanding,
      balanceOnDelivery,
      rows: [...derived, ...historic],
    };
  }, [orders, carrierProfile]);

  const summary = [
    { label: 'Escrow Balance', value: escrowBalance, sub: 'available for fuel advances', icon: <Wallet size={14} />, accent: 'text-slate-300' },
    { label: 'Settled Freight', value: settledFreight, sub: `${orders.filter(o => ['DELIVERED', 'COMPLETED'].includes(o.status)).length} completed hauls`, icon: <ArrowDownToLine size={14} />, accent: 'text-emerald-600' },
    { label: 'Advance Outstanding', value: advancesOutstanding, sub: 'deducted at settlement', icon: <ArrowUpRight size={14} />, accent: 'text-blue-500' },
    { label: 'Balance on Delivery', value: balanceOnDelivery, sub: 'escrow-protected', icon: <IndianRupee size={14} />, accent: 'text-amber-500' },
  ];
  return (
    <div className="space-y-6">
      {/* Carrier identity strip */}
      <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.04] rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Carrier Account</p>
            <h3 className="text-lg font-bold tracking-tight mt-0.5">{carrierProfile?.carrier_name || 'Kisan Express Fleet Logistics'}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">GSTIN {carrierProfile?.gstin || '—'}</p>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-center">
              <p className="flex items-center justify-center gap-1 text-xl font-black tracking-tight"><Star size={14} className="text-amber-400 fill-amber-400" /> {carrierProfile?.rating?.toFixed(1) ?? '4.9'}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Rating</p>
            </div>
            <div className="w-px h-9 bg-white/10" />
            <div className="text-center">
              <p className="text-xl font-black tracking-tight flex items-center gap-1.5"><Truck size={15} className="text-slate-400" /> {carrierProfile?.total_trips_completed ?? 142}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Trips Done</p>
            </div>
            <div className="w-px h-9 bg-white/10 hidden sm:block" />
            <div className="text-center hidden sm:block">
              <p className="text-xl font-black tracking-tight text-emerald-400">₹{escrowBalance.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">In Escrow</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {summary.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200/80 shadow-sm px-4 py-3.5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
              <span className={s.accent}>{s.icon}</span>
            </div>
            <p className={`text-xl font-black tracking-tighter mt-1 ${s.label === 'Settled Freight' ? 'text-emerald-700' : 'text-slate-900'}`}>
              ₹{s.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Ledger */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Freight Ledger</h2>
          <span className="text-[11px] font-semibold text-slate-500">{rows.length} records</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {['Waybill', 'Consignment', 'Corridor', 'Advance', 'Settlement', 'Total', 'Status', 'UTR'].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map(r => {
                  const chip = ledgerChip(r.status);
                  return (
                    <tr key={r.ewayBillNumber} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono font-semibold text-slate-700 whitespace-nowrap">{r.ewayBillNumber}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-slate-900">{r.cropName}</p>
                        <p className="text-[10px] text-slate-400">{r.variety} · {r.weightTons} MT</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 max-w-[200px]"><span className="truncate block">{r.corridor}</span></td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">₹{r.advanceInr.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">₹{r.settlementInr.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm font-black text-slate-900">₹{r.totalInr.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest whitespace-nowrap ${chip.cls}`}>{chip.label}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">{r.settledAt}</p>
                      </td>
                      <td className="px-4 py-3 text-[10px] font-mono text-slate-500 max-w-[150px]"><span className="truncate block">{r.utr}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden px-4 py-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Trophy size={11} /> Swipe horizontally to see all ledger columns
          </div>
        </div>
      </section>
    </div>
  );
}

