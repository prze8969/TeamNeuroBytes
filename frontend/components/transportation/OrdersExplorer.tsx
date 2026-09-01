'use client';

import React, { useMemo, useState } from 'react';
import { Search, ChevronRight, ArrowRight, Package, Inbox } from 'lucide-react';
import type { TransportationOrder, OrderStatus } from '@/lib/transportation-types';

/**
 * Searchable, filterable list of ALL transport assignments.
 * Desktop: table. Mobile: cards. Every row opens the Order Details drawer.
 */

type QuickFilter = 'ALL' | 'ACTIVE' | 'PENDING' | 'IN_TRANSIT' | 'ARRIVED_AT_MANDI' | 'COMPLETED' | 'CANCELLED';

const FILTERS: { key: QuickFilter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'IN_TRANSIT', label: 'In Transit' },
  { key: 'ARRIVED_AT_MANDI', label: 'Arrived' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

function statusLabel(o: TransportationOrder): string {
  const map: Record<OrderStatus, string> = {
    PENDING: 'Pending', ASSIGNED: 'Assigned', IN_TRANSIT: 'In Transit', ARRIVED_AT_MANDI: 'Arrived',
    DELIVERED: 'Delivered', COMPLETED: 'Completed', CANCELLED: 'Cancelled',
  };
  return map[o.status];
}

function statusChip(o: TransportationOrder): string {
  switch (o.status) {
    case 'PENDING': return 'bg-amber-50 text-amber-700';
    case 'ASSIGNED': return 'bg-blue-50 text-blue-700';
    case 'IN_TRANSIT': return 'bg-emerald-50 text-emerald-700';
    case 'ARRIVED_AT_MANDI': return 'bg-violet-50 text-violet-700';
    case 'DELIVERED':
    case 'COMPLETED': return 'bg-emerald-50 text-emerald-700';
    case 'CANCELLED': return 'bg-red-50 text-red-700';
    default: return 'bg-slate-100 text-slate-600';
  }
}

export function shortLoc(name: string): string {
  const first = name.split(',')[0].trim();
  if (first.length > 28) return first.split(' ').slice(0, 3).join(' ');
  return first;
}

export function OrdersExplorer({ orders, onOpen }: { orders: TransportationOrder[]; onOpen: (o: TransportationOrder) => void }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<QuickFilter>('ALL');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter(o => {
      if (filter === 'ACTIVE' && !['PENDING', 'ASSIGNED', 'IN_TRANSIT'].includes(o.status)) return false;
      if (filter === 'COMPLETED' && !['DELIVERED', 'COMPLETED'].includes(o.status)) return false;
      if (!['ALL', 'ACTIVE', 'COMPLETED'].includes(filter) && o.status !== filter) return false;
      if (!q) return true;
      return [o.id, o.shipment.cropName, o.shipment.variety, o.origin.name, o.destination.name, o.farmerName, o.vehicle.registrationNumber, o.ewayBillNumber]
        .some(v => String(v).toLowerCase().includes(q));
    });
  }, [orders, query, filter]);

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">All Orders</h2>
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order, crop, route, vehicle…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-xs"
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-3 -mx-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors border ${
              filter === f.key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 text-center">
          <Inbox size={20} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-medium text-slate-500">No orders match your search.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {['Shipment', 'Route', 'Vehicle', 'Schedule', 'Freight', 'Status', ''].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 py-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(o => (
                  <tr key={o.id} onClick={() => onOpen(o)} className="hover:bg-slate-50/60 transition-colors cursor-pointer group">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                        {o.shipment.cropName}
                        {(o.deliveryStatus === 'DELAYED' || o.deliveryStatus === 'AT_RISK') && !['COMPLETED', 'DELIVERED', 'CANCELLED'].includes(o.status) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" title="Delay / risk" />
                        )}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">{o.shipment.weightTons} MT · {o.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <span className="truncate max-w-[110px]">{shortLoc(o.origin.name)}</span>
                        <ArrowRight size={11} className="text-slate-300 shrink-0" />
                        <span className="truncate max-w-[110px]">{shortLoc(o.destination.name)}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{o.totalDistanceKm} km</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-mono font-semibold text-slate-700">{o.vehicle.registrationNumber}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{o.driver.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-slate-600">
                        {o.status === 'IN_TRANSIT' ? 'ETA' : 'Pickup'}:{' '}
                        <span className="font-semibold text-slate-800">
                          {o.status === 'ARRIVED_AT_MANDI' ? '—' : new Date(o.status === 'IN_TRANSIT' ? o.estimatedArrivalTime : o.pickupTime).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                      </p>
                    </td>
                    <td className="px-4 py-3"><p className="text-sm font-bold text-slate-900">₹{o.totalFreightInr.toLocaleString('en-IN')}</p></td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${statusChip(o)}`}>{statusLabel(o)}</span>
                    </td>
                    <td className="px-2 py-3 text-right"><ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {filtered.map(o => (
              <button key={o.id} onClick={() => onOpen(o)} className="w-full bg-white rounded-xl border border-slate-200/80 p-4 text-left hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                      {o.shipment.cropName}
                      {(o.deliveryStatus === 'DELAYED' || o.deliveryStatus === 'AT_RISK') && !['COMPLETED', 'DELIVERED', 'CANCELLED'].includes(o.status) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      )}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">{o.id}</p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${statusChip(o)}`}>{statusLabel(o)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                  <Package size={11} className="shrink-0" /> {o.shipment.weightTons} MT · {o.totalDistanceKm} km
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                  <span className="truncate">{shortLoc(o.origin.name)}</span>
                  <ArrowRight size={11} className="text-slate-300 shrink-0" />
                  <span className="truncate">{shortLoc(o.destination.name)}</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                  <span className="text-xs font-mono text-slate-500">{o.vehicle.registrationNumber}</span>
                  <span className="text-sm font-bold text-slate-900">₹{o.totalFreightInr.toLocaleString('en-IN')}</span>
                </div>
              </button>
            ))}
          </div>

        </>
      )}
    </section>
  );
}
