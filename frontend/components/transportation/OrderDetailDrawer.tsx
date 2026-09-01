'use client';

import React from 'react';
import { 
  X, 
  Truck, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  PhoneCall, 
  AlertTriangle, 
  Building2, 
  User, 
  FileText, 
  Navigation, 
  Thermometer, 
  Droplets, 
  Radio, 
  Fuel, 
  KeyRound, 
  Scale,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TransportationOrder } from '@/lib/transportation-types';

interface OrderDetailDrawerProps {
  order: TransportationOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onClaimAdvance?: (order: TransportationOrder) => void;
  onVerifyOtp?: (order: TransportationOrder) => void;
  onMarkArrival?: (order: TransportationOrder) => void;
  isInline?: boolean;
}

export function OrderDetailDrawer({
  order,
  isOpen,
  onClose,
  onClaimAdvance,
  onVerifyOtp,
  onMarkArrival,
  isInline = true
}: OrderDetailDrawerProps) {
  if (!isOpen || !order) return null;

  const progressPercent = order.totalDistanceKm > 0 
    ? Math.min(100, Math.round((order.completedDistanceKm / order.totalDistanceKm) * 100))
    : 0;

  // Container styling: inline inside allotted workspace vs modal overlay
  const containerClasses = isInline
    ? "relative w-full lg:w-[440px] xl:w-[480px] bg-[#FAFAF7] flex flex-col h-full shrink-0 font-sans transition-all px-3 py-3"
    : "fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-[#FAFAF7] flex flex-col font-sans animate-in slide-in-from-right duration-250 p-4";

  return (
    <div className={containerClasses}>
      <div className="flex-1 bg-white clay-card flex flex-col h-full overflow-hidden">
        
        {/* HEADER BAR */}
        <div className="p-5 bg-emerald-800 text-white flex items-center justify-between shadow-[inset_3px_3px_6px_rgba(255,255,255,0.3),inset_-3px_-3px_6px_rgba(0,0,0,0.2)] shrink-0 border-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-900 text-white flex items-center justify-center font-bold shadow-[2px_2px_5px_rgba(0,0,0,0.2)]">
              <Truck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight">{order.id}</h2>
                <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-emerald-900 text-white shadow-xs">
                  {order.ewayBillNumber}
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-mono">
                Customer: <strong className="text-white">{order.customerName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-900/60 text-emerald-100 hover:text-white flex items-center justify-center hover:bg-emerald-900 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* DRAWER CONTENT SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-800">
          
          {/* ========================================================================= */}
          {/* 1. LIVE TRACKING & TELEMETRY BANNER */}
          {/* ========================================================================= */}
          <div className="p-5 rounded-3xl bg-[#1E293B] text-white space-y-4 shadow-[5px_5px_12px_rgba(30,41,59,0.22),inset_2px_2px_4px_rgba(255,255,255,0.2),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border-none">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <Radio size={15} className="text-emerald-400 animate-pulse" />
                <span className="text-xs font-black tracking-wider text-emerald-350 uppercase">
                  {order.tracking.freshnessStatus === 'LIVE' ? 'Live GPS Telemetry' : 'Vehicle Feed'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                {order.tracking.lastUpdatedText}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              <div className="p-2.5 rounded-2xl bg-slate-800/80 border-none shadow-[inset_1px_1px_3px_rgba(0,0,0,0.2)]">
                <span className="text-[9px] text-slate-400 uppercase font-sans font-bold block">Speed</span>
                <strong className="text-white text-sm font-black block pt-0.5">
                  {order.tracking.speedKmh} km/h
                </strong>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-800/80 border-none shadow-[inset_1px_1px_3px_rgba(0,0,0,0.2)]">
                <span className="text-[9px] text-slate-400 uppercase font-sans font-bold block">Temp</span>
                <strong className="text-blue-400 text-sm font-black block pt-0.5 flex items-center gap-1">
                  <Thermometer size={13} />
                  {order.vehicle.temperatureC ?? 14.2}°C
                </strong>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-800/80 border-none shadow-[inset_1px_1px_3px_rgba(0,0,0,0.2)]">
                <span className="text-[9px] text-slate-400 uppercase font-sans font-bold block">Humidity</span>
                <strong className="text-teal-400 text-sm font-black block pt-0.5 flex items-center gap-1">
                  <Droplets size={13} />
                  {order.vehicle.humidityRh ?? 68}% RH
                </strong>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-800/80 border-none shadow-[inset_1px_1px_3px_rgba(0,0,0,0.2)]">
                <span className="text-[9px] text-slate-400 uppercase font-sans font-bold block">Distance</span>
                <strong className="text-emerald-400 text-sm font-black block pt-0.5">
                  {order.distanceRemainingKm} km
                </strong>
              </div>
            </div>

            {/* Single Next Action Hero Focus */}
            <div className="pt-2 border-t border-slate-700/60 flex flex-col gap-2">
              {!order.advanceClaimed && onClaimAdvance ? (
                <Button
                  type="button"
                  variant="clayPrimary"
                  onClick={() => onClaimAdvance(order)}
                  className="h-12 px-6 rounded-2xl text-xs font-black w-full flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Fuel size={15} />
                  <span>Claim 30% Fuel Advance (₹{Math.round(order.totalFreightInr * 0.3).toLocaleString('en-IN')})</span>
                </Button>
              ) : (order.status === 'PENDING' || order.status === 'ASSIGNED') && onVerifyOtp ? (
                <Button
                  type="button"
                  variant="clayPrimary"
                  onClick={() => onVerifyOtp(order)}
                  className="h-12 px-6 rounded-2xl text-xs font-black w-full flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <KeyRound size={15} />
                  <span>Verify Farmgate OTP Handshake</span>
                </Button>
              ) : order.status === 'IN_TRANSIT' && onMarkArrival ? (
                <Button
                  type="button"
                  variant="clayPrimary"
                  onClick={() => onMarkArrival(order)}
                  className="h-12 px-6 rounded-2xl text-xs font-black w-full flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Scale size={15} />
                  <span>Mark Mandi Yard Arrival</span>
                </Button>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-center text-xs font-mono font-bold text-emerald-300">
                  ✓ Milestone Actions Completed for Current State
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. ROUTE & CORRIDOR PROGRESS */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-2xl clay-card-flat space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <Navigation size={14} className="text-emerald-700" />
                <span>Highway Transit Progress</span>
              </h3>
              <span className="font-mono text-emerald-850 font-bold text-xs">
                {progressPercent}% ({order.completedDistanceKm} / {order.totalDistanceKm} km)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden p-0.5 shadow-[inset_1px_1px_3px_rgba(163,163,140,0.2)]">
              <div 
                className="h-full rounded-full bg-emerald-600 transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Route Origin & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-xl bg-white font-mono text-xs shadow-xs border-none">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Origin</span>
                <strong className="text-slate-950 block">{order.origin.name}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Destination</span>
                <strong className="text-emerald-850 block">{order.destination.name}</strong>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. ASSIGNMENT & CARGO SPECIFICATION */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-2xl clay-card-flat space-y-3">
            <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <User size={14} className="text-emerald-700" />
              <span>Driver &amp; Cargo Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/60 flex items-center justify-between shadow-xs border-none">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-850 block">Driver</span>
                  <strong className="text-emerald-950 font-black text-xs block">{order.driver.name}</strong>
                  <span className="text-[10px] font-mono text-slate-600">{order.driver.phone}</span>
                </div>
                <a
                  href={`tel:${order.driver.phone}`}
                  className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 transition-all shadow-xs"
                >
                  <PhoneCall size={13} />
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/80 shadow-xs border-none">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Vehicle</span>
                <strong className="text-slate-950 font-black text-xs font-mono block">{order.vehicle.registrationNumber}</strong>
                <span className="text-[10px] font-mono text-slate-600">{order.vehicle.type}</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. CHRONOLOGICAL ACTIVITY TIMELINE */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-2xl clay-card-flat space-y-3">
            <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <Clock size={14} className="text-emerald-700" />
              <span>Milestone Timeline</span>
            </h3>

            <div className="relative pl-6 space-y-4 border-l-2 border-slate-200 font-mono text-xs">
              {order.timeline.map((evt) => (
                <div key={evt.id} className="relative">
                  <div className={`absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center transition-all ${
                    evt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-600' :
                    evt.status === 'CURRENT' ? 'bg-emerald-600 border-2 border-white scale-110 shadow-md ring-2 ring-emerald-500' :
                    evt.status === 'EXCEPTION' ? 'bg-rose-100 text-rose-700 border-2 border-rose-600' : 'bg-slate-200 border-2 border-slate-300'
                  }`}>
                    {evt.status === 'COMPLETED' && <CheckCircle2 size={10} className="text-emerald-700" />}
                    {evt.status === 'CURRENT' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                    {evt.status === 'EXCEPTION' && <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />}
                  </div>

                  <div className="flex items-center justify-between">
                    <strong className={`font-extrabold text-xs ${
                      evt.status === 'EXCEPTION' ? 'text-rose-700' : 'text-slate-950'
                    }`}>
                      {evt.title}
                    </strong>
                    <span className="text-[10px] text-slate-400 font-normal">{evt.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed pt-0.5 font-normal">
                    {evt.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
