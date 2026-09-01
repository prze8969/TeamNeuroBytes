'use client';

import React from 'react';
import {
  LayoutDashboard,
  Truck,
  PackageOpen,
  Wallet,
  Settings2,
  Activity,
  CircleDot,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import type { TransportationOrder } from '@/lib/transportation-types';
import type { CarrierProfileSummary } from '@/lib/transportation-client';

/**
 * Haulix-style dark command-center rail for the Transport module.
 * Drives the SAME tabs/modals as the rest of the dashboard (no feature loss).
 * Visible on xl+; on smaller screens the existing tab bar remains the nav.
 */

export type FleetTab = 'operations' | 'loadboard' | 'earnings';

interface TransportSidebarProps {
  activeTab: FleetTab;
  onNavigate: (tab: FleetTab) => void;
  onOpenFleetSettings: () => void;
  orders: TransportationOrder[];
  carrierStats: CarrierProfileSummary | null;
  carrierName: string;
  rating: number;
  totalTrucks: number;
  escrowBalance: number;
  tendersCount: number;
}

export function TransportSidebar({
  activeTab, onNavigate, onOpenFleetSettings, orders, carrierStats, carrierName, rating, totalTrucks, escrowBalance, tendersCount,
}: TransportSidebarProps) {
  const activeTrips = orders.filter(o => o.status === 'IN_TRANSIT').length;
  const pendingPickups = orders.filter(o => ['PENDING', 'ASSIGNED'].includes(o.status)).length;
  const activeOnRoad = carrierStats?.active_vehicles_on_road ?? activeTrips;
  const idleVehicles = Math.max(0, totalTrucks - activeOnRoad);
  const utilization = totalTrucks > 0 ? Math.min(100, Math.round((activeOnRoad / totalTrucks) * 100)) : 0;

  const navItems: { key: FleetTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: 'operations', label: 'Command Center', icon: <LayoutDashboard size={17} /> },
    { key: 'operations', label: 'Live Trips', icon: <Truck size={17} />, badge: activeTrips + pendingPickups },
    { key: 'loadboard', label: 'Load Board', icon: <PackageOpen size={17} />, badge: tendersCount },
    { key: 'earnings', label: 'Earnings', icon: <Wallet size={17} /> },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-64 shrink-0 bg-emerald-950 text-emerald-100/80 border-r border-emerald-900 sticky top-0 self-start min-h-[calc(100vh-0px)]">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-emerald-900/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/40">
            <Truck size={19} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-black text-white tracking-tight leading-none">Fleet Control</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300/90 mt-1">KrishiNiti 🌾</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Fleet navigation">
        <p className="px-2 pb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-500">Operations</p>
        {navItems.map((item, i) => {
          const renderActive = activeTab === item.key;
          return (
            <button
              key={`${item.label}-${i}`}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all text-left group ${
                renderActive ? 'bg-emerald-800/70 text-white shadow-sm ring-1 ring-emerald-700/60' : 'text-emerald-200/70 hover:bg-emerald-900/60 hover:text-white'
              }`}
            >
              <span className={`${renderActive ? 'text-amber-300' : 'text-emerald-500 group-hover:text-amber-200'} transition-colors`}>{item.icon}</span>
              <span className="flex-1 truncate">{item.label}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center ${renderActive ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-800 text-emerald-200'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <p className="px-2 pt-4 pb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-500">Management</p>
        <button
          onClick={onOpenFleetSettings}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-emerald-200/70 hover:bg-emerald-900/60 hover:text-white transition-all text-left"
        >
          <Settings2 size={17} className="text-emerald-500" /> Fleet &amp; Profile
        </button>
      </nav>
{/* Fleet status widget */}
      <div className="px-4 pb-5 space-y-3">
        <div className="rounded-2xl bg-emerald-900/50 border border-emerald-800/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">Fleet Status</p>
            <Activity size={13} className="text-emerald-500" />
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-emerald-200/70 flex items-center gap-1.5"><CircleDot size={10} className="text-emerald-400" /> Active on road</span>
              <span className="font-black text-white">{activeOnRoad}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-emerald-200/70 flex items-center gap-1.5"><CircleDot size={10} className="text-amber-400" /> Idle / Standby</span>
              <span className="font-black text-white">{idleVehicles}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-emerald-200/70 flex items-center gap-1.5"><ShieldCheck size={10} className="text-emerald-400" /> Fleet size</span>
              <span className="font-black text-white">{totalTrucks}</span>
            </div>
            {/* Utilization bar */}
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                <span>Utilization</span><span>{utilization}%</span>
              </div>
              <div className="h-1.5 bg-emerald-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full" style={{ width: `${utilization}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Escrow / rating strip */}
        <div className="flex items-center justify-between px-1">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-500">In Escrow</p>
            <p className="text-sm font-black text-white mt-0.5">₹{escrowBalance.toLocaleString('en-IN')}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-500">Rating</p>
            <p className="text-sm font-black text-amber-300 mt-0.5">★ {rating.toFixed(1)}</p>
          </div>
        </div>

        {/* Carrier context */}
        <div className="flex items-center gap-2 px-1 pt-1">
          <MapPin size={12} className="text-emerald-600 shrink-0" />
          <p className="text-[10px] text-emerald-300/60 truncate">{carrierName}</p>
        </div>
      </div>
    </aside>
  );
}