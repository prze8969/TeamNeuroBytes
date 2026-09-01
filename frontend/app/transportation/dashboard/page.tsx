'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';

import {
  Truck, MapPin, ArrowRight, CheckCircle2, Circle, Clock, IndianRupee, Bell, UserCircle, X,
  Phone, Navigation, Settings2, ChevronRight, Package, AlertTriangle, CalendarDays, Thermometer, Droplets,
  Radio, Shield, Eye, Star, Wallet, ExternalLink, ClipboardCheck, Gauge,
} from 'lucide-react';

import {
  TransporterOnboardingModal,
  TransporterFleetProfile,
  DEMO_TRANSPORTER_PROFILE,
} from '@/components/transportation/TransporterOnboardingModal';

import {
  TransportationOrder,
  OrderStatus,
  DeliveryStatus,
  TimelineEvent,
  INITIAL_TRANSPORTATION_ORDERS,
  adaptTripToOrder,
} from '@/lib/transportation-types';

import { OpenTenderItem } from '@/components/transportation/TenderSidePanel';
import { StatusPipeline } from '@/components/transportation/StatusPipeline';
import { OtpVerifyModal } from '@/components/transportation/OtpVerifyModal';
import { AcceptTenderModal } from '@/components/transportation/AcceptTenderModal';
import { OrdersExplorer } from '@/components/transportation/OrdersExplorer';
import { LoadBoard } from '@/components/transportation/LoadBoard';
import { EarningsPanel } from '@/components/transportation/EarningsPanel';
import { TransportSidebar } from '@/components/transportation/TransportSidebar';
import {
  fetchTrips, fetchTransporterProfile, saveTransporterProfile, acceptFreightLoad,
  claimFuelAdvance, verifyFarmgateOtp, markMandiArrival, mapsDirectionsUrl,
  type CarrierProfileSummary,
} from '@/lib/transportation-client';

import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';

/* ========================================================================== */
/* HELPERS                                                                     */
/* ========================================================================== */

function getStatusConfig(status: OrderStatus) {
  const map: Record<OrderStatus, { label: string; bg: string; text: string; dot: string; ring: string }> = {
    PENDING:          { label: 'Pending',     bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-500',   ring: 'ring-amber-200' },
    ASSIGNED:         { label: 'Assigned',    bg: 'bg-blue-50',     text: 'text-blue-700',    dot: 'bg-blue-500',    ring: 'ring-blue-200' },
    IN_TRANSIT:       { label: 'In Transit',  bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500', ring: 'ring-emerald-200' },
    ARRIVED_AT_MANDI: { label: 'Arrived',     bg: 'bg-violet-50',   text: 'text-violet-700',  dot: 'bg-violet-500',  ring: 'ring-violet-200' },
    DELIVERED:        { label: 'Delivered',   bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-600', ring: 'ring-emerald-200' },
    COMPLETED:        { label: 'Completed',   bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-600', ring: 'ring-emerald-200' },
    CANCELLED:        { label: 'Cancelled',   bg: 'bg-red-50',      text: 'text-red-700',     dot: 'bg-red-500',     ring: 'ring-red-200' },
  };
  return map[status] || map.PENDING;
}

function getDeliveryStatusConfig(ds: DeliveryStatus) {
  const map: Record<DeliveryStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    ON_TIME:   { label: 'On Time',   bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <CheckCircle2 size={12} /> },
    DELAYED:   { label: 'Delayed',   bg: 'bg-red-50',     text: 'text-red-700',     icon: <AlertTriangle size={12} /> },
    AT_RISK:   { label: 'At Risk',   bg: 'bg-amber-50',   text: 'text-amber-700',   icon: <AlertTriangle size={12} /> },
    COMPLETED: { label: 'Completed', bg: 'bg-slate-50',   text: 'text-slate-600',   icon: <CheckCircle2 size={12} /> },
  };
  return map[ds] || map.ON_TIME;
}

function fmt(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch { return '--:--'; }
}

function fmtDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch { return '--'; }
}

function shortLoc(name: string): string {
  const first = name.split(',')[0].trim();
  if (first.length > 28) return first.split(' ').slice(0, 3).join(' ');
  return first;
}

function getNextAction(order: TransportationOrder): { label: string; description: string } | null {
  if (order.status === 'ASSIGNED' && !order.advanceClaimed) return { label: 'Claim Advance', description: `Claim ₹${order.advanceFreightInr.toLocaleString('en-IN')} advance` };
  if (order.status === 'ASSIGNED' && order.advanceClaimed) return { label: 'Confirm Loading', description: 'Verify farm loading OTP' };
  if (order.status === 'IN_TRANSIT') return { label: 'Mark Arrival', description: `Arrive at ${shortLoc(order.destination.name)}` };
  return null;
}

function getProgressPercent(order: TransportationOrder): number {
  if (order.totalDistanceKm <= 0) return 0;
  return Math.min(100, Math.round((order.completedDistanceKm / order.totalDistanceKm) * 100));
}
/* ========================================================================== */
/* OPEN FREIGHT LOADS (PRESERVED — offline fallback for the Load Board)         */
/* ========================================================================== */
export const DEFAULT_OPEN_TENDERS: OpenTenderItem[] = [
  {
    id: 'TEND-2026-091', lot_id: 'LOT-2', crop_name: 'Nashik Red Onion', variety: 'Garva Premium',
    farmer_name: 'Sanjay Deshmukh', origin: 'Lasalgaon APMC Cluster, Nashik', destination: 'Pune Gultekdi Mandi',
    quantity_tons: 8.0, freight_rate_kg: 1.2, total_freight_inr: 9600.0, advance_30_pct_inr: 2880.0,
    pickup_window: 'Today, within 4 hours', required_vehicle: '10-Wheeler Open / Tarpaulin',
  },
  {
    id: 'TEND-2026-092', lot_id: 'LOT-3', crop_name: 'Hybrid Tomato', variety: 'Abhinav Class-1',
    farmer_name: 'Kailash Jadhav', origin: 'Narayangaon Hub, Pune', destination: 'Vashi APMC Mandi, Navi Mumbai',
    quantity_tons: 4.0, freight_rate_kg: 1.6, total_freight_inr: 6400.0, advance_30_pct_inr: 1920.0,
    pickup_window: 'Tomorrow morning, 06:00 AM', required_vehicle: 'Reefer Cold-Chain (14°C)',
  },
];

/* ========================================================================== */
/* ORDER DETAIL DRAWER                                                         */
/* ========================================================================== */
function OrderDetailDrawer({
  order, isOpen, onClose,
  onClaimAdvance, onOpenOtpModal, onMarkArrival,
}: {
  order: TransportationOrder | null; isOpen: boolean; onClose: () => void;
  onClaimAdvance: (o: TransportationOrder) => void;
  onOpenOtpModal: (o: TransportationOrder) => void;
  onMarkArrival: (o: TransportationOrder) => void;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'financial'>('overview');

  if (!isOpen || !order) return null;

  const sc = getStatusConfig(order.status);
  const dsc = getDeliveryStatusConfig(order.deliveryStatus);
  const progress = getProgressPercent(order);
  const nextAction = getNextAction(order);

  const tabs = [
    { key: 'overview' as const, label: 'Overview' },
    { key: 'timeline' as const, label: 'Timeline' },
    { key: 'financial' as const, label: 'Financial' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg max-h-[90vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">

        {/* ── Drawer Header ───────────────────────────────────── */}
        <div className="shrink-0 bg-white border-b border-slate-100 px-5 pt-4 pb-0">
          <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-3 sm:hidden" />
          

          <div className="flex items-start justify-between mb-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${sc.bg} ${sc.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${order.status === 'IN_TRANSIT' ? 'animate-pulse' : ''}`} />
                  {sc.label}
                </span>
                {order.deliveryStatus === 'DELAYED' || order.deliveryStatus === 'AT_RISK' ? (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${dsc.bg} ${dsc.text}`}>
                    {dsc.icon} {dsc.label}
                  </span>
                ) : null}
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-2 leading-tight">{order.shipment.cropName}</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{order.id} · {order.ewayBillNumber}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0 ml-3 mt-0.5">
              <X size={14} className="text-slate-600" />
            </button>
          </div>

          <div className="flex gap-1">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors ${activeTab === t.key ? 'bg-slate-50 text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Drawer Body ─────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-6">

          {activeTab === 'overview' && (<>
            {/* Shipment */}
            <div className="grid grid-cols-3 gap-3">
              <InfoCell label="Quantity" value={`${order.shipment.weightTons} MT`} sub={order.shipment.variety} />
              <InfoCell label="Packages" value={`${order.shipment.packagesCount}`} sub="crates" />
              <InfoCell label="Priority" value={order.priority} sub={order.transportMode} />
            </div>

            {/* Status pipeline */}
            <section>
              <SectionLabel>Delivery Progress</SectionLabel>
              <div className="border border-slate-100 rounded-xl p-4">
                <StatusPipeline order={order} />
              </div>
            </section>

            {/* Route */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <SectionLabel>Route</SectionLabel>
                <a
                  href={mapsDirectionsUrl(order.origin, order.destination)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Navigation size={11} /> Open Route in Maps <ExternalLink size={10} />
                </a>
              </div>
              <div className="border border-slate-100 rounded-xl p-4 space-y-5 relative">
                <div className="absolute left-[31px] top-[52px] bottom-[52px] w-px bg-slate-200 z-0" />
                <RouteNode icon={<MapPin size={14} />} iconColor="text-emerald-600" iconBg="bg-emerald-50" label="Pickup" name={order.origin.name} time={`${fmt(order.pickupTime)} · ${fmtDate(order.pickupTime)}`} facility={order.origin.facility} />
                <RouteNode icon={<MapPin size={14} />} iconColor="text-blue-600" iconBg="bg-blue-50" label="Destination" name={order.destination.name} time={`ETA ${fmt(order.estimatedArrivalTime)} · ${fmtDate(order.estimatedArrivalTime)}`} facility={order.destination.facility} />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <InfoCell label="Distance" value={`${order.totalDistanceKm} km`} sub={`${order.distanceRemainingKm} km left`} />
                <InfoCell label="Progress" value={`${progress}%`} sub={`${order.completedDistanceKm} km done`} />
                {order.delayMinutes > 0 ? (
                  <InfoCell label="Delay" value={`${order.delayMinutes} min`} sub="behind schedule" alert />
                ) : (
                  <InfoCell label="Status" value="On Schedule" sub="no delays" />
                )}
              </div>
            </section>

            {/* Vehicle & Driver */}
            <section>
              <SectionLabel>Vehicle & Driver</SectionLabel>
              <div className="border border-slate-100 rounded-xl divide-y divide-slate-50">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center"><Truck size={16} className="text-slate-600" /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 font-mono tracking-wide">{order.vehicle.registrationNumber}</p>
                      <p className="text-xs text-slate-500">{order.vehicle.type} · {order.vehicle.capacityTons} MT capacity</p>
                    </div>
                  </div>
                  {order.vehicle.temperatureC != null && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <Thermometer size={12} /> {order.vehicle.temperatureC}°C
                        {order.vehicle.humidityRh != null && <><span className="text-slate-300 mx-0.5">·</span><Droplets size={12} /> {order.vehicle.humidityRh}%</>}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center"><UserCircle size={16} className="text-slate-600" /></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{order.driver.name}</p>
                      <p className="text-xs text-slate-500">{order.driver.rating ? `★ ${order.driver.rating}` : 'Driver'}</p>
                    </div>
                  </div>
                  {order.driver.phone && order.driver.phone !== 'N/A' && (
                    <a href={`tel:${order.driver.phone.replace(/\s/g, '')}`} className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center transition-colors" aria-label={`Call ${order.driver.name}`}>
                      <Phone size={14} className="text-emerald-700" />
                    </a>
                  )}
                </div>
              </div>
            </section>

            {/* Contacts */}
            <section>
              <SectionLabel>Contacts</SectionLabel>
              <div className="border border-slate-100 rounded-xl divide-y divide-slate-50">
                <ContactRow label="Farmer / Origin" name={order.farmerName} phone={order.farmerPhone} />
                <ContactRow label="Buyer / Destination" name={order.customerName} />
              </div>
            </section>

            {/* Special Handling */}
            {order.shipment.specialHandling && order.shipment.specialHandling.length > 0 && (
              <section>
                <SectionLabel>Handling Instructions</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {order.shipment.specialHandling.map((h, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-medium">
                      <Shield size={10} /> {h}
                    </span>
                  ))}
                </div>
                {order.shipment.notes && <p className="text-xs text-slate-500 mt-2 leading-relaxed">{order.shipment.notes}</p>}
              </section>
            )}
          </>)}

          {activeTab === 'timeline' && (
            <section>
              <div className="space-y-0">
                {order.timeline.map((evt, i) => (
                  <TimelineRow key={evt.id} event={evt} isLast={i === order.timeline.length - 1} />
                ))}
              </div>
              {order.tracking.isLive && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center"><Radio size={14} className="text-emerald-700 animate-pulse" /></div>
                  <div>
                    <p className="text-xs font-bold text-emerald-800">Live Tracking Active</p>
                    <p className="text-[11px] text-emerald-700">{order.tracking.lastUpdatedText} · {order.tracking.speedKmh} km/h</p>
                  </div>
                </div>
              )}
            </section>
          )}

          {activeTab === 'financial' && (
            <section className="space-y-4">
              <div className="bg-slate-900 rounded-xl p-5 text-white">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Freight</p>
                  <p className="text-2xl font-black tracking-tight">₹{order.totalFreightInr.toLocaleString('en-IN')}</p>
                </div>
                <div className="space-y-3">
                  <FinancialRow label="30% Advance" amount={order.advanceFreightInr} status={order.advanceClaimed ? 'Paid' : 'Pending'} statusColor={order.advanceClaimed ? 'text-emerald-400 bg-emerald-500/15' : 'text-amber-400 bg-amber-500/15'} />
                  <FinancialRow label="70% Balance" amount={order.balanceFreightInr} status={(order.status === 'DELIVERED' || order.status === 'COMPLETED') ? 'Settled' : 'On Delivery'} statusColor={(order.status === 'DELIVERED' || order.status === 'COMPLETED') ? 'text-emerald-400 bg-emerald-500/15' : 'text-slate-500 bg-slate-700'} />
                </div>
                {order.advanceUtr && (
                  <p className="text-[10px] text-slate-500 font-mono mt-4 pt-3 border-t border-slate-700/50">UTR: {order.advanceUtr}</p>
                )}
              </div>
              {order.farmGateOtp && (
                <div className="border border-slate-100 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Farmgate OTP</p>
                    <p className="text-lg font-black text-slate-900 font-mono tracking-[0.3em] mt-0.5">{order.farmGateOtp}</p>
                  </div>
                  <Shield size={20} className="text-slate-300" />
                </div>
              )}
            </section>
          )}
        </div>

        {/* ── Drawer Footer (Action) ──────────────────────────── */}
        {nextAction && (
          <div className="shrink-0 bg-white border-t border-slate-100 p-4">
            {order.status === 'ASSIGNED' && !order.advanceClaimed && (
              <button onClick={() => onClaimAdvance(order)} className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20">
                <IndianRupee size={16} /> Claim Advance (₹{order.advanceFreightInr.toLocaleString('en-IN')})
              </button>
            )}
            {order.status === 'ASSIGNED' && order.advanceClaimed && (
              <button onClick={() => onOpenOtpModal(order)} className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20">
                <ClipboardCheck size={16} /> Confirm Farm Loading (OTP)
              </button>
            )}
            {order.status === 'IN_TRANSIT' && (
              <button onClick={() => onMarkArrival(order)} className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20">
                <Navigation size={16} /> Mark Arrival at Destination
              </button>
            )}
          </div>
        )}
        {!nextAction && (order.status === 'ARRIVED_AT_MANDI' || order.status === 'DELIVERED' || order.status === 'COMPLETED') && (
          <div className="shrink-0 bg-white border-t border-slate-100 p-4">
            <div className="w-full h-12 rounded-xl border border-slate-200 text-slate-400 font-medium text-sm flex items-center justify-center gap-2">
              <CheckCircle2 size={16} /> {order.status === 'ARRIVED_AT_MANDI' ? 'Awaiting buyer weighbridge settlement' : 'Order Completed'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Drawer Sub-Components ──────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{children}</p>;
}

function InfoCell({ label, value, sub, alert }: { label: string; value: string; sub?: string; alert?: boolean }) {
  return (
    <div className={`rounded-lg p-3 ${alert ? 'bg-red-50' : 'bg-slate-50'}`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
      <p className={`text-sm font-bold ${alert ? 'text-red-700' : 'text-slate-900'} tracking-tight`}>{value}</p>
      {sub && <p className={`text-[11px] ${alert ? 'text-red-500' : 'text-slate-500'} mt-0.5`}>{sub}</p>}
    </div>
  );
}

function RouteNode({ icon, iconColor, iconBg, label, name, time, facility }: { icon: React.ReactNode; iconColor: string; iconBg: string; label: string; name: string; time: string; facility?: string }) {
  return (
    <div className="flex gap-3 relative z-10">
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0 ${iconColor}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-900 mt-0.5 truncate">{name}</p>
        <p className="text-[11px] text-slate-500">{time}</p>
        {facility && <p className="text-[10px] text-slate-400 mt-0.5">{facility}</p>}
      </div>
    </div>
  );
}

function ContactRow({ label, name, phone }: { label: string; name: string; phone?: string }) {
  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"><UserCircle size={14} className="text-slate-500" /></div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
          <p className="text-sm font-semibold text-slate-900">{name}</p>
        </div>
      </div>
      {phone && phone !== 'N/A' && (
        <a href={`tel:${phone.replace(/\s/g, '')}`} className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center transition-colors" aria-label={`Call ${name}`}>
          <Phone size={14} className="text-emerald-700" />
        </a>
      )}
    </div>
  );
}

function TimelineRow({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const isCompleted = event.status === 'COMPLETED';
  const isCurrent = event.status === 'CURRENT';
  const isException = event.status === 'EXCEPTION';

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-emerald-100 text-emerald-600' : isCurrent ? 'bg-blue-100 text-blue-600' : isException ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
          {isCompleted ? <CheckCircle2 size={12} /> : isCurrent ? <Radio size={12} className="animate-pulse" /> : isException ? <AlertTriangle size={12} /> : <Circle size={12} />}
        </div>
        {!isLast && <div className={`w-px flex-1 my-1 ${isCompleted ? 'bg-emerald-200' : 'bg-slate-200'}`} />}
      </div>
      <div className="pb-5 min-w-0">
        <p className={`text-sm font-semibold ${isException ? 'text-red-800' : 'text-slate-900'}`}>{event.title}</p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{event.description}</p>
        <p className="text-[10px] text-slate-400 font-mono mt-1">{event.timestamp}</p>
      </div>
    </div>
  );
}

function FinancialRow({ label, amount, status, statusColor }: { label: string; amount: number; status: string; statusColor: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">₹{amount.toLocaleString('en-IN')}</span>
        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${statusColor}`}>{status}</span>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* MAIN PAGE                                                                   */
/* ========================================================================== */

type MainTab = 'operations' | 'loadboard' | 'earnings';

export default function TransportationDashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>('operations');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const [carrierProfile, setCarrierProfile] = useState<TransporterFleetProfile>(() => DEMO_TRANSPORTER_PROFILE);
  const [carrierStats, setCarrierStats] = useState<CarrierProfileSummary | null>(null);
  const [orders, setOrders] = useState<TransportationOrder[]>([]);
  const [openTenders, setOpenTenders] = useState<OpenTenderItem[]>(DEFAULT_OPEN_TENDERS);
  const [drawerOrder, setDrawerOrder] = useState<TransportationOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // OTP + Accept modals state
  const [otpOrder, setOtpOrder] = useState<TransportationOrder | null>(null);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [acceptTender, setAcceptTender] = useState<OpenTenderItem | null>(null);
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);
  const [acceptSubmitting, setAcceptSubmitting] = useState(false);

  const orderCacheKey = user?.email ? `kisansetu_transporter_orders_${user.email.toLowerCase()}` : 'kisansetu_transporter_orders';
  const tenderCacheKey = user?.email ? `kisansetu_transporter_tenders_${user.email.toLowerCase()}` : 'kisansetu_transporter_tenders';

  const openDrawer = useCallback((order: TransportationOrder) => {
    setDrawerOrder(order);
    setIsDrawerOpen(true);
    setIsNotifOpen(false);
  }, []);
  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setTimeout(() => setDrawerOrder(null), 200);
  }, []);

  const cacheOrders = useCallback((updated: TransportationOrder[]) => {
    try { localStorage.setItem(orderCacheKey, JSON.stringify(updated)); } catch { /* storage full / private mode */ }
  }, [orderCacheKey]);

  /* ── Data Loading: backend first → localStorage cache → demo seed ── */
  const reloadFromApi = useCallback(async (): Promise<boolean> => {
    const res = await fetchTrips();
    if (res.ok && res.data?.status === 'SUCCESS') {
      const mapped = (res.data.active_trips || []).map(adaptTripToOrder);
      const tenders = (res.data.open_tenders || []) as unknown as OpenTenderItem[];
      if (res.data.carrier_profile) setCarrierStats(res.data.carrier_profile);
      if (mapped.length > 0) { setOrders(mapped); cacheOrders(mapped); }
      if (tenders.length > 0) {
        setOpenTenders(tenders);
        try { localStorage.setItem(tenderCacheKey, JSON.stringify(tenders)); } catch { /* ignore */ }
      }
      return true;
    }
    return false;
  }, [cacheOrders, tenderCacheKey]);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        // 1) Seed from cache/demo immediately for instant paint
        const savedOrders = localStorage.getItem(orderCacheKey);
        const savedTenders = localStorage.getItem(tenderCacheKey);
        let seeded = savedOrders ? (JSON.parse(savedOrders) as TransportationOrder[]) : INITIAL_TRANSPORTATION_ORDERS;
        let seededTenders = savedTenders ? (JSON.parse(savedTenders) as OpenTenderItem[]) : DEFAULT_OPEN_TENDERS;
        if (!seeded.length) seeded = INITIAL_TRANSPORTATION_ORDERS;
        if (!seededTenders.length) seededTenders = DEFAULT_OPEN_TENDERS;
        if (!cancelled) { setOrders(seeded); setOpenTenders(seededTenders); }

        // 2) Real backend is source of truth when reachable
        await reloadFromApi();

        // 3) Fleet profile from DB → real onboarding gate for new users
        const pres = await fetchTransporterProfile({ email: user?.email, userId: user?.id });
        if (!cancelled && pres.ok && pres.data) {
          if (pres.data.status === 'SUCCESS' && pres.data.profile) {
            const p = pres.data.profile as Record<string, unknown>;
            setCarrierProfile(prev => ({
              ...prev,
              carrier_name: String(p.carrier_name ?? prev.carrier_name),
              gstin: String(p.gstin ?? prev.gstin),
              contact_phone: String(p.contact_phone ?? prev.contact_phone),
              total_trucks: Number(p.total_trucks ?? prev.total_trucks),
              vehicle_types: Array.isArray(p.vehicle_types) ? (p.vehicle_types as string[]) : prev.vehicle_types,
              total_drivers: Number(p.total_drivers ?? prev.total_drivers),
              base_rate: Number(p.base_rate ?? prev.base_rate),
              min_freight_charge: Number(p.min_freight_charge ?? prev.min_freight_charge),
              operating_corridors: Array.isArray(p.operating_corridors) ? (p.operating_corridors as string[]) : prev.operating_corridors,
              rating: Number(p.rating ?? prev.rating),
              total_trips_completed: Number(p.total_trips_completed ?? prev.total_trips_completed),
              available_escrow_balance_inr: Number(p.available_escrow_balance_inr ?? prev.available_escrow_balance_inr),
              isOnboarded: true,
            }));
          } else if (pres.data.is_onboarded === false) {
            setCarrierProfile(prev => ({
              ...prev,
              carrier_name: pres.data!.user_name || prev.carrier_name,
              contact_phone: pres.data!.user_phone || prev.contact_phone,
              isOnboarded: false,
            }));
            if (!cancelled) setIsOnboardingModalOpen(true); // real onboarding gate
          }
        }
      } catch { if (!cancelled) setHasError(true); }
      if (!cancelled) setIsLoading(false);
    };
    loadData();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /* ── Derived Data ──────────────────────────────────────── */
  const currentDelivery = useMemo(() => {
    return orders.find(o => o.status === 'IN_TRANSIT') || orders.find(o => o.status === 'ASSIGNED') || null;
  }, [orders]);

  const nextDelivery = useMemo(() => {
    const active = orders.filter(o => ['PENDING', 'ASSIGNED', 'IN_TRANSIT'].includes(o.status));
    if (currentDelivery) {
      return active.find(o => o.id !== currentDelivery.id) || null;
    }
    return active[0] || null;
  }, [orders, currentDelivery]);

  const recentDeliveries = useMemo(() => {
    return orders.filter(o => ['ARRIVED_AT_MANDI', 'DELIVERED', 'COMPLETED'].includes(o.status));
  }, [orders]);

  const alerts = useMemo(() => {
    return orders.filter(o =>
      (o.deliveryStatus === 'DELAYED' || o.deliveryStatus === 'AT_RISK') &&
      o.status !== 'DELIVERED' && o.status !== 'COMPLETED' && o.status !== 'CANCELLED'
    );
  }, [orders]);

  const todaySummary = useMemo(() => {
    const deliveries = orders.filter(o => ['IN_TRANSIT', 'ASSIGNED'].includes(o.status)).length;
    const pickups = orders.filter(o => ['PENDING', 'ASSIGNED'].includes(o.status)).length;
    const earnings = orders.filter(o => ['ARRIVED_AT_MANDI', 'DELIVERED', 'COMPLETED'].includes(o.status)).reduce((s, o) => s + o.totalFreightInr, 0);
    return { deliveries, pickups, earnings };
  }, [orders]);

  /* ── Handlers: real API first, graceful offline fallback (preserved) ── */
  const refreshDrawer = (updated: TransportationOrder[]) => {
    if (isDrawerOpen && drawerOrder) {
      setDrawerOrder(updated.find(o => o.id === drawerOrder.id) || null);
    }
  };

  const handleClaimAdvanceForOrder = async (targetOrder: TransportationOrder) => {
    const vaultId = targetOrder.vaultId ? Number(targetOrder.vaultId) : null;
    if (vaultId) {
      const res = await claimFuelAdvance(vaultId);
      if (res.ok && res.data?.status === 'DISBURSED') {
        const updated = orders.map(o => o.id === targetOrder.id
          ? { ...o, advanceClaimed: true, advanceUtr: res.data!.utr_number, status: 'ASSIGNED' as const }
          : o);
        setOrders(updated); cacheOrders(updated); refreshDrawer(updated);
        toast.success(res.data.message);
        return;
      }
      toast.error(res.error || 'Could not reach the escrow vault for the advance.');
      return;
    }
    // Offline / legacy fallback — preserved original behaviour
    const updated = orders.map(o => o.id === targetOrder.id ? { ...o, advanceClaimed: true, status: 'ASSIGNED' as const } : o);
    setOrders(updated); cacheOrders(updated); refreshDrawer(updated);
    toast.success(`30% advance of ₹${targetOrder.advanceFreightInr.toLocaleString('en-IN')} credited.`);
  };

  const openOtpModal = (targetOrder: TransportationOrder) => {
    setOtpOrder(targetOrder);
    setOtpError(null);
    setIsOtpOpen(true);
    setIsDrawerOpen(false);
  };

  const handleVerifyOtp = async (targetOrder: TransportationOrder, otp: string) => {
    setOtpSubmitting(true); setOtpError(null);
    const vaultId = targetOrder.vaultId ? Number(targetOrder.vaultId) : null;
    if (vaultId) {
      const res = await verifyFarmgateOtp(vaultId, otp);
      setOtpSubmitting(false);
      if (res.ok && res.data?.status === 'VERIFIED') {
        const updated = orders.map(o => o.id === targetOrder.id ? { ...o, status: 'IN_TRANSIT' as const, deliveryStatus: 'ON_TIME' as const } : o);
        setOrders(updated); cacheOrders(updated); refreshDrawer(updated);
        setIsOtpOpen(false); setOtpOrder(null);
        toast.success(res.data.message);
        return;
      }
      setOtpError(res.error || 'OTP verification failed.');
      return;
    }
    // Offline fallback — demo continuity
    setOtpSubmitting(false);
    const updated = orders.map(o => o.id === targetOrder.id ? { ...o, status: 'IN_TRANSIT' as const, deliveryStatus: 'ON_TIME' as const } : o);
    setOrders(updated); cacheOrders(updated); refreshDrawer(updated);
    setIsOtpOpen(false); setOtpOrder(null);
    toast.success('Farm loading confirmed. Pick up complete.');
  };

  const handleMarkArrivalForOrder = async (targetOrder: TransportationOrder) => {
    const vaultId = targetOrder.vaultId ? Number(targetOrder.vaultId) : null;
    if (vaultId) {
      const res = await markMandiArrival(vaultId);
      if (res.ok && res.data?.status === 'ARRIVED') {
        const updated = orders.map(o => o.id === targetOrder.id
          ? { ...o, status: 'ARRIVED_AT_MANDI' as const, distanceRemainingKm: 0, completedDistanceKm: o.totalDistanceKm, actualArrivalTime: new Date().toISOString() }
          : o);
        setOrders(updated); cacheOrders(updated); refreshDrawer(updated);
        toast.success(res.data.message);
        return;
      }
      toast.error(res.error || 'Could not mark arrival. Please try again.');
      return;
    }
    const updated = orders.map(o => o.id === targetOrder.id ? { ...o, status: 'ARRIVED_AT_MANDI' as const, distanceRemainingKm: 0 } : o);
    setOrders(updated); cacheOrders(updated); refreshDrawer(updated);
    toast.success('Vehicle arrived at destination. Buyer notified.');
  };

  const handleAcceptTender = async (tender: OpenTenderItem, assignment: { driver_name: string; driver_phone: string; vehicle_number: string; vehicle_type: string }) => {
    setAcceptSubmitting(true); setAcceptError(null);
    const res = await acceptFreightLoad({ tender_id: tender.id, ...assignment });
    setAcceptSubmitting(false);
    if (res.ok && res.data?.status === 'ACCEPTED') {
      setIsAcceptOpen(false); setAcceptTender(null);
      toast.success(res.data.message || `Load accepted for ${tender.crop_name}.`);
      const synced = await reloadFromApi();
      if (!synced) {
        // Offline fallback: build the trip locally from the tender
        const newOrder: TransportationOrder = adaptTripToOrder({
          id: orders.length + 1, vault_id: orders.length + 1, lot_id: tender.lot_id,
          crop_name: tender.crop_name, variety: tender.variety, farmer_name: tender.farmer_name, farmer_phone: '',
          origin: tender.origin, destination: tender.destination,
          quantity_tons: tender.quantity_tons, quantity_kg: Math.round(tender.quantity_tons * 1000),
          total_freight_inr: tender.total_freight_inr, advance_freight_inr: tender.advance_30_pct_inr,
          advance_claimed: false, balance_freight_inr: tender.total_freight_inr - tender.advance_30_pct_inr,
          driver_name: assignment.driver_name, driver_phone: assignment.driver_phone, vehicle_number: assignment.vehicle_number,
          status: 'ASSIGNED', current_milestone: 'LOCKED', farm_gate_otp: '7192',
          created_at: new Date().toISOString(),
        });
        const updated = [newOrder, ...orders];
        setOrders(updated); cacheOrders(updated);
      }
      setActiveTab('operations');
      return;
    }
    setAcceptError(res.error || 'Could not accept the load. It may have been taken already.');
  };

  const handleSaveProfile = async (profile: TransporterFleetProfile) => {
    setCarrierProfile(profile);
    setIsOnboardingModalOpen(false);
    const res = await saveTransporterProfile({
      user_email: user?.email,
      user_id: user?.id ? Number(String(user.id).replace(/\D/g, '')) || undefined : undefined,
      carrier_name: profile.carrier_name,
      gstin: profile.gstin,
      contact_phone: profile.contact_phone,
      total_trucks: profile.total_trucks,
      vehicle_types: profile.vehicle_types,
      total_drivers: profile.total_drivers,
      base_rate: profile.base_rate,
      rate_unit: profile.rate_unit,
      min_freight_charge: profile.min_freight_charge,
      reefer_surcharge_enabled: profile.reefer_surcharge_enabled,
      reefer_surcharge_type: profile.reefer_surcharge_type,
      reefer_surcharge_value: profile.reefer_surcharge_value,
      preferred_target_trips: profile.preferred_target_trips,
      target_frequency: profile.target_frequency,
      operating_corridors: profile.operating_corridors,
      rating: profile.rating,
      total_trips_completed: profile.total_trips_completed,
      available_escrow_balance_inr: profile.available_escrow_balance_inr,
    });
    if (res.ok && res.data?.status === 'SUCCESS') {
      toast.success('Fleet profile saved to your KrishiNiti account.');
    } else {
      toast.info('Fleet profile saved locally. It will sync when the server is reachable.');
    }
  };

  /* ── Loading State ─────────────────────────────────────── */
  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['TRANSPORTATION', 'ADMIN']}>
        <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
          <Navbar activeRole="TRANSPORTATION" />
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-slate-200 rounded w-48" />
              <div className="grid grid-cols-3 gap-4"><div className="h-20 bg-slate-200 rounded-xl" /><div className="h-20 bg-slate-200 rounded-xl" /><div className="h-20 bg-slate-200 rounded-xl" /></div>
              <div className="h-72 bg-slate-200 rounded-xl" />
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  /* ── Error State ───────────────────────────────────────── */
  if (hasError) {
    return (
      <ProtectedRoute allowedRoles={['TRANSPORTATION', 'ADMIN']}>
        <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
          <Navbar activeRole="TRANSPORTATION" />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Truck size={40} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">Unable to load transport orders</h3>
              <p className="text-sm text-slate-500 mt-1">Please check your connection and try again.</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="mt-6 h-10 px-6 rounded-xl">
                Try Again
              </Button>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  /* ── RENDER ────────────────────────────────────────────── */
  const escrowBalance = carrierStats?.available_escrow_balance_inr ?? carrierProfile.available_escrow_balance_inr;
  const activeTripsCount = orders.filter(o => o.status === 'IN_TRANSIT').length;
  const pendingPickupsCount = orders.filter(o => ['PENDING', 'ASSIGNED'].includes(o.status)).length;
  const activeOnRoad = carrierStats?.active_vehicles_on_road ?? activeTripsCount;
  const utilizationPct = carrierProfile.total_trucks > 0 ? Math.min(100, Math.round((activeOnRoad / carrierProfile.total_trucks) * 100)) : 0;
  const alertsCount = alerts.length;
  const pendingSettlementCount = orders.filter(o => o.status === 'ARRIVED_AT_MANDI').length;

  return (
    <ProtectedRoute allowedRoles={['TRANSPORTATION', 'ADMIN']}>
      <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-900">
        <Navbar activeRole="TRANSPORTATION" />

        <TransporterOnboardingModal isOpen={isOnboardingModalOpen} onClose={() => setIsOnboardingModalOpen(false)} onSaveProfile={handleSaveProfile} initialProfile={carrierProfile} isEditMode={isEditMode} userEmail={user?.email} />
        <OrderDetailDrawer order={drawerOrder} isOpen={isDrawerOpen} onClose={closeDrawer} onClaimAdvance={handleClaimAdvanceForOrder} onOpenOtpModal={openOtpModal} onMarkArrival={handleMarkArrivalForOrder} />
        <OtpVerifyModal order={otpOrder} isOpen={isOtpOpen} isSubmitting={otpSubmitting} errorMessage={otpError} onClose={() => { setIsOtpOpen(false); setOtpOrder(null); setOtpError(null); }} onVerify={handleVerifyOtp} />
        <AcceptTenderModal tender={acceptTender} isOpen={isAcceptOpen} isSubmitting={acceptSubmitting} errorMessage={acceptError} defaultDriverPhone={carrierProfile.contact_phone} onClose={() => { setIsAcceptOpen(false); setAcceptTender(null); setAcceptError(null); }} onAccept={handleAcceptTender} />

        {/* ═══════════════ SHELL: sidebar + content ═══════════════ */}
        <div className="flex-1 flex min-h-0">
          <TransportSidebar
            activeTab={activeTab}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenFleetSettings={() => { setIsEditMode(true); setIsOnboardingModalOpen(true); }}
            orders={orders}
            carrierStats={carrierStats}
            carrierName={carrierProfile.carrier_name}
            rating={carrierProfile.rating}
            totalTrucks={carrierProfile.total_trucks}
            escrowBalance={escrowBalance}
            tendersCount={openTenders.length}
          />

          <div className="flex-1 min-w-0 flex flex-col">

        {/* ═══════════════ HEADER (Command Center) ═══════════════ */}
        <header className="bg-white border-b border-slate-200/80 relative z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">Command Center</p>
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight truncate mt-0.5">{carrierProfile.carrier_name}</h1>
                <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <CalendarDays size={12} />
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded">
                    <Star size={9} className="fill-amber-500 text-amber-500" /> {carrierProfile.rating.toFixed(1)}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                    <Wallet size={9} /> ₹{escrowBalance.toLocaleString('en-IN')} in escrow
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 relative">
                <button
                  onClick={() => setIsNotifOpen(v => !v)}
                  className="w-9 h-9 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell size={16} className="text-slate-600" />
                  {alerts.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />}
                </button>
                <button
                  onClick={() => { setIsEditMode(true); setIsOnboardingModalOpen(true); }}
                  className="h-9 px-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                >
                  <Settings2 size={15} className="text-slate-600" />
                  <span className="text-xs font-semibold text-slate-700 hidden sm:inline">Fleet & Profile</span>
                </button>

                {/* Notifications popover */}
                {isNotifOpen && (
                  <div className="absolute right-0 top-11 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Notifications</p>
                      <button onClick={() => setIsNotifOpen(false)} className="w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center" aria-label="Close notifications"><X size={12} className="text-slate-500" /></button>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {alerts.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <CheckCircle2 size={20} className="mx-auto text-emerald-400 mb-2" />
                          <p className="text-sm font-medium text-slate-500">You&apos;re all caught up.</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">No delays or risks on any active hauls.</p>
                        </div>
                      ) : (
                        alerts.map(a => {
                          const dsc = getDeliveryStatusConfig(a.deliveryStatus);
                          return (
                            <button key={a.id} onClick={() => openDrawer(a)} className="w-full px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${a.deliveryStatus === 'DELAYED' ? 'bg-red-100' : 'bg-amber-100'}`}>
                                <AlertTriangle size={12} className={a.deliveryStatus === 'DELAYED' ? 'text-red-600' : 'text-amber-600'} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900">{a.shipment.cropName} — {dsc.label}</p>
                                <p className="text-[11px] text-slate-500 truncate">{a.shipment.notes || `${a.delayMinutes} min delay · ${shortLoc(a.origin.name)} → ${shortLoc(a.destination.name)}`}</p>
                                <p className="text-[10px] font-mono text-slate-400 mt-0.5">{a.id}</p>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ═══════════════ TAB BAR ═══════════════ */}
        <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {([
                { key: 'operations' as const, label: 'Operations', badge: orders.filter(o => ['PENDING', 'ASSIGNED', 'IN_TRANSIT'].includes(o.status)).length },
                { key: 'loadboard' as const, label: 'Load Board', badge: openTenders.length },
                { key: 'earnings' as const, label: 'Earnings', badge: 0 },
              ]).map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={`shrink-0 px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === t.key ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}>
                  {t.label}
                  {t.badge > 0 && (
                    <span className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${activeTab === t.key ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* ═══════════════ MAIN ═══════════════ */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {activeTab === 'loadboard' && (
            <LoadBoard tenders={openTenders} isLoading={false} onAccept={(t) => { setAcceptTender(t); setAcceptError(null); setIsAcceptOpen(true); }} />
          )}

          {activeTab === 'earnings' && (
            <EarningsPanel orders={orders} carrierProfile={carrierStats} />
          )}

          {activeTab === 'operations' && (<>
            {/* ── Alerts Banner ──────────────────────────────── */}
            {alerts.length > 0 && (
              <div className="mb-6">
                {alerts.map(alert => {
                  const dsc = getDeliveryStatusConfig(alert.deliveryStatus);
                  return (
                    <button key={alert.id} onClick={() => openDrawer(alert)} className="w-full mb-2 last:mb-0 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100/60 transition-colors text-left">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                        <AlertTriangle size={14} className="text-red-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-red-900">{alert.shipment.cropName} — {dsc.label}</p>
                        <p className="text-xs text-red-700/80 truncate">{alert.shipment.notes || `${alert.delayMinutes} min delay on ${shortLoc(alert.origin.name)} → ${shortLoc(alert.destination.name)}`}</p>
                      </div>
                      <ChevronRight size={16} className="text-red-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}

            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#121821] px-4 py-3 text-[11px] font-medium text-slate-300 shadow-[0_20px_60px_rgba(15,23,42,0.6)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Active</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                  <span>Idle</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                  <span>Maintenance</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">Show routes</button>
                  <button className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-300">Show alerts</button>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#121821] shadow-[0_30px_80px_rgba(2,6,23,0.75)] min-h-[560px]">
                <div className="absolute inset-0 opacity-90" style={{
                  backgroundImage: `linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px), radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 35%), linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.8))`,
                  backgroundSize: '28px 28px, 28px 28px, 100% 100%, 100% 100%',
                }} />

                <div className="absolute inset-0" style={{
                  backgroundImage: `linear-gradient(120deg, transparent 0 25%, rgba(255,255,255,0.03) 25.5% 26.5%, transparent 27% 100%), linear-gradient(20deg, transparent 0 58%, rgba(255,255,255,0.04) 58.5% 59.5%, transparent 60% 100%), linear-gradient(90deg, transparent 0 72%, rgba(255,255,255,0.03) 72.5% 73.5%, transparent 74% 100%)`,
                }} />

                <div className="absolute left-5 top-5 z-20 w-[340px] rounded-2xl border border-white/10 bg-[#171d27]/90 p-4 shadow-2xl backdrop-blur">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Live Trip
                      </div>
                      <div className="mt-2 text-[15px] font-black text-white">TX-4821-HX</div>
                    </div>
                    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      AT RISK
                    </div>
                  </div>

                  <div className="mt-4 text-[11px] text-slate-300">Dallas, TX + Memphis, TN</div>
                  <div className="mt-3 h-2 rounded-full bg-white/10">
                    <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400" />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>ETA time to arrival</span>
                    <span className="font-semibold text-slate-200">72.9 mi</span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-[#1a212c] p-3">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Speed</div>
                      <div className="mt-3 flex items-center justify-center">
                        <div className="relative h-16 w-16">
                          <div className="absolute inset-0 rounded-full border-[5px] border-white/10" />
                          <div className="absolute inset-[5px] rounded-full border-[5px] border-amber-400/80 border-t-transparent border-r-amber-300" style={{ transform: 'rotate(35deg)' }} />
                          <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">98</div>
                        </div>
                      </div>
                      <div className="mt-2 text-center text-[10px] text-slate-300">mph</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#1a212c] p-3">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Fuel level</div>
                      <div className="mt-3 flex items-center justify-center">
                        <div className="relative h-16 w-16">
                          <div className="absolute inset-0 rounded-full border-[5px] border-white/10" />
                          <div className="absolute inset-[5px] rounded-full border-[5px] border-transparent bg-gradient-to-t from-amber-300 via-amber-300 to-transparent" style={{ clipPath: 'inset(18% 0 0 0 round 999px)' }} />
                          <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">31%</div>
                        </div>
                      </div>
                      <div className="mt-2 text-center text-[10px] text-slate-300">3.61 gal</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-[11px] font-medium text-amber-200">
                    <AlertTriangle size={12} className="text-amber-300" />
                    Required Break: 30 min (After 8h of driving)
                  </div>
                </div>

                <div className="absolute right-6 top-6 z-20 h-28 w-28 rounded-full border border-white/10 bg-[#212a35]/80 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-sm" />
                <div className="absolute right-10 top-10 z-30 h-20 w-20 rounded-full border border-white/10 bg-[#1a222d]/90">
                  <div className="absolute inset-3 rounded-full border border-dashed border-white/20" />
                  <div className="absolute left-1/2 top-1/2 h-8 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-white/80" />
                  <div className="absolute left-1/2 top-1/2 h-[2px] w-8 -translate-x-1/2 -translate-y-1/2 bg-white/80" />
                  <div className="absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-amber-400" style={{ transform: 'translate(-50%, -50%) rotate(90deg)' }} />
                </div>

                <div className="absolute inset-0 z-10">
                  <div className="absolute left-[34%] top-[48%] h-2 w-40 rounded-full bg-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.8)]" style={{ transform: 'rotate(-18deg)' }} />
                  <div className="absolute left-[42%] top-[32%] h-2 w-28 rounded-full bg-emerald-400/70 shadow-[0_0_18px_rgba(52,211,153,0.8)]" style={{ transform: 'rotate(12deg)' }} />
                  <div className="absolute left-[62%] top-[44%] h-2 w-24 rounded-full bg-emerald-400/70 shadow-[0_0_18px_rgba(52,211,153,0.8)]" style={{ transform: 'rotate(24deg)' }} />

                  <div className="absolute left-[52%] top-[44%] flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-[#b8bec6]/80 shadow-[0_0_24px_rgba(255,255,255,0.35)]">
                    <Truck size={20} className="text-slate-800" />
                  </div>

                  <div className="absolute left-[59%] top-[60%] h-4 w-4 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
                  <div className="absolute left-[29%] top-[38%] h-4 w-4 rounded-full bg-red-400 shadow-[0_0_18px_rgba(251,113,133,0.8)]" />
                </div>

                <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-[#171d27]/80 px-4 py-2 text-[11px] text-slate-300 backdrop-blur-sm">
                  <span>Space • Drag to pan</span>
                  <span className="text-slate-500">•</span>
                  <span>Scroll to zoom</span>
                </div>

                <div className="absolute bottom-5 right-6 z-20 rounded-full border border-white/10 bg-[#171d27]/80 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-slate-300 backdrop-blur-sm">
                  Map updates every 3 minutes
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div id="all-orders">
                  <OrdersExplorer orders={orders} onOpen={openDrawer} />
                </div>
              </div>

              {/* RIGHT: Sidebar (1/3) */}
              <div className="space-y-6">

                {/* ── Up Next ───────────────────────────────── */}
                {nextDelivery ? (
                  <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Up Next</h2>
                    <button onClick={() => openDrawer(nextDelivery)} className="w-full bg-slate-900 rounded-xl p-5 text-left text-white hover:bg-slate-800 transition-colors shadow-lg relative overflow-hidden group">
                      <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/[0.03] rounded-full blur-xl" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-white/10 text-slate-300">
                            <Clock size={9} /> {fmt(nextDelivery.pickupTime)}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono">{nextDelivery.id}</span>
                        </div>
                        <h3 className="text-base font-bold tracking-tight">{nextDelivery.shipment.cropName}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{nextDelivery.shipment.weightTons} MT · {nextDelivery.vehicle.registrationNumber}</p>
                        <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                          <p className="text-[11px] text-slate-300 flex items-center gap-1.5"><MapPin size={10} className="text-emerald-400 shrink-0" /> <span className="truncate">{shortLoc(nextDelivery.origin.name)}</span></p>
                          <p className="text-[11px] text-slate-300 flex items-center gap-1.5"><MapPin size={10} className="text-blue-400 shrink-0" /> <span className="truncate">{shortLoc(nextDelivery.destination.name)}</span></p>
                        </div>
                        <p className="mt-3 text-[11px] font-semibold text-emerald-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          View assignment <ChevronRight size={11} />
                        </p>
                      </div>
                    </button>
                  </section>
                ) : openTenders.length > 0 ? (
                  <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Find Your Next Haul</h2>
                    <button onClick={() => setActiveTab('loadboard')} className="w-full bg-slate-900 rounded-xl p-5 text-left text-white hover:bg-slate-800 transition-colors shadow-lg relative overflow-hidden group">
                      <div className="relative z-10">
                        <p className="text-sm font-bold">{openTenders.length} open tender{openTenders.length === 1 ? '' : 's'} on the Load Board</p>
                        <p className="text-xs text-slate-400 mt-1">Claim a load, assign a truck and keep your fleet moving.</p>
                        <p className="mt-3 text-[11px] font-semibold text-emerald-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">Open Load Board <ChevronRight size={11} /></p>
                      </div>
                    </button>
                  </section>
                ) : null}

                {/* ── Fleet Snapshot ────────────────────────── */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">My Fleet</h2>
                    <button onClick={() => { setIsEditMode(true); setIsOnboardingModalOpen(true); }} className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">Manage</button>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm divide-y divide-slate-50">
                    <div className="px-4 py-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center gap-2"><Truck size={13} className="text-slate-400" /> Trucks</span>
                      <span className="text-sm font-bold text-slate-900">{carrierProfile.total_trucks}</span>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center gap-2"><UserCircle size={13} className="text-slate-400" /> Drivers</span>
                      <span className="text-sm font-bold text-slate-900">{carrierProfile.total_drivers}</span>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center gap-2"><Navigation size={13} className="text-slate-400" /> On the road now</span>
                      <span className="text-sm font-bold text-emerald-700">{carrierStats?.active_vehicles_on_road ?? orders.filter(o => o.status === 'IN_TRANSIT').length}</span>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center gap-2"><Star size={13} className="text-amber-400" /> Rating</span>
                      <span className="text-sm font-bold text-slate-900">★ {carrierProfile.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </section>

                {/* ── Earnings teaser ───────────────────────── */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Earnings</h2>
                    <button onClick={() => setActiveTab('earnings')} className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">View ledger</button>
                  </div>
                  <button onClick={() => setActiveTab('earnings')} className="w-full bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 text-left hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Escrow balance</span>
                      <Wallet size={13} className="text-slate-300" />
                    </div>
                    <p className="text-xl font-black text-slate-900 tracking-tighter mt-1">₹{(carrierStats?.available_escrow_balance_inr ?? carrierProfile.available_escrow_balance_inr).toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">+ ₹{todaySummary.earnings.toLocaleString('en-IN')} freight earned</p>
                  </button>
                </section>
              </div>
            </div>
          </>)}
        </main>
          </div> {/* end content column */}
        </div> {/* end shell row */}
      </div>
    </ProtectedRoute>
  );
}



















