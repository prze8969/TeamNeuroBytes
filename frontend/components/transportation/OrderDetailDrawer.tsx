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
    ? "relative w-full lg:w-[440px] xl:w-[480px] bg-white border-l border-slate-200 flex flex-col h-full shrink-0 font-sans shadow-lg z-10 transition-all"
    : "fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col font-sans animate-in slide-in-from-right duration-250";

  return (
    <div className={containerClasses}>
      
      {/* HEADER BAR */}
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-sm shadow-emerald-700/30">
            <Truck size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black tracking-tight">{order.id}</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-200 border border-emerald-800">
                {order.ewayBillNumber}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Customer: <strong className="text-slate-200">{order.customerName}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* DRAWER CONTENT SCROLL AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs text-slate-800">
        
        {/* ========================================================================= */}
        {/* 1. LIVE TRACKING & TELEMETRY BANNER */}
        {/* ========================================================================= */}
        <div className="p-4 rounded-3xl bg-slate-900 text-white space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Radio size={15} className="text-emerald-400 animate-pulse" />
              <span className="text-xs font-black tracking-wider text-emerald-400 uppercase">
                {order.tracking.freshnessStatus === 'LIVE' ? 'Live GPS Telemetry' : 'Vehicle Feed'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
              {order.tracking.lastUpdatedText}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[9px] text-slate-400 uppercase font-sans font-bold block">Speed</span>
              <strong className="text-white text-sm font-black block pt-0.5">
                {order.tracking.speedKmh} km/h
              </strong>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[9px] text-slate-400 uppercase font-sans font-bold block">Temp</span>
              <strong className="text-blue-400 text-sm font-black block pt-0.5 flex items-center gap-1">
                <Thermometer size={13} />
                {order.vehicle.temperatureC ?? 14.2}°C
              </strong>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[9px] text-slate-400 uppercase font-sans font-bold block">Humidity</span>
              <strong className="text-teal-400 text-sm font-black block pt-0.5 flex items-center gap-1">
                <Droplets size={13} />
                {order.vehicle.humidityRh ?? 68}% RH
              </strong>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[9px] text-slate-400 uppercase font-sans font-bold block">Distance</span>
              <strong className="text-emerald-400 text-sm font-black block pt-0.5">
                {order.distanceRemainingKm} km
              </strong>
            </div>
          </div>

          {/* Quick Carrier Milestone Actions */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
            {onClaimAdvance && (
              <Button
                type="button"
                size="sm"
                onClick={() => onClaimAdvance(order)}
                disabled={order.advanceClaimed}
                className="h-8 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl disabled:opacity-40"
              >
                <Fuel size={12} className="mr-1.5" />
                {order.advanceClaimed ? '✓ 30% Disbursed' : 'Claim 30% Advance'}
              </Button>
            )}

            {onVerifyOtp && (
              <Button
                type="button"
                size="sm"
                onClick={() => onVerifyOtp(order)}
                disabled={order.status === 'IN_TRANSIT' || order.status === 'ARRIVED_AT_MANDI'}
                className="h-8 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-40"
              >
                <KeyRound size={12} className="mr-1.5" />
                {order.status === 'IN_TRANSIT' ? '✓ OTP Verified' : 'Verify Farmgate OTP'}
              </Button>
            )}

            {onMarkArrival && (
              <Button
                type="button"
                size="sm"
                onClick={() => onMarkArrival(order)}
                disabled={order.status !== 'IN_TRANSIT'}
                className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-40"
              >
                <Scale size={12} className="mr-1.5" />
                {order.status === 'ARRIVED_AT_MANDI' ? '✓ Arrived at Mandi' : 'Mark Mandi Arrival'}
              </Button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. ROUTE & CORRIDOR PROGRESS */}
        {/* ========================================================================= */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <Navigation size={14} className="text-emerald-700" />
              Highway Transit Progress
            </h3>
            <span className="font-mono text-emerald-800 font-bold text-xs">
              {progressPercent}% ({order.completedDistanceKm} / {order.totalDistanceKm} km)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Route Origin & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 font-mono text-[11px]">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block font-sans">Origin</span>
              <strong className="text-slate-900 block">{order.origin.name}</strong>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block font-sans">Destination</span>
              <strong className="text-emerald-800 block">{order.destination.name}</strong>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. ASSIGNMENT & CARGO SPECIFICATION */}
        {/* ========================================================================= */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs">
          <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
            <User size={14} className="text-emerald-700" />
            Driver &amp; Cargo Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Driver</span>
                <strong className="text-emerald-950 font-extrabold text-xs block">{order.driver.name}</strong>
                <span className="text-[10px] font-mono text-slate-600">{order.driver.phone}</span>
              </div>
              <a
                href={`tel:${order.driver.phone}`}
                className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 transition-all shadow-xs"
              >
                <PhoneCall size={13} />
              </a>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200">
              <span className="text-[10px] uppercase font-bold text-blue-700 block">Vehicle</span>
              <strong className="text-blue-950 font-extrabold text-xs font-mono block">{order.vehicle.registrationNumber}</strong>
              <span className="text-[10px] font-mono text-slate-600">{order.vehicle.type}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. CHRONOLOGICAL ACTIVITY TIMELINE */}
        {/* ========================================================================= */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs">
          <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
            <Clock size={14} className="text-emerald-700" />
            Milestone Timeline
          </h3>

          <div className="relative pl-5 space-y-3.5 border-l-2 border-slate-200 font-mono text-[11px]">
            {order.timeline.map((evt) => (
              <div key={evt.id} className="relative">
                <div className={`absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  evt.status === 'COMPLETED' ? 'bg-emerald-500' :
                  evt.status === 'CURRENT' ? 'bg-blue-600 animate-ping' :
                  evt.status === 'EXCEPTION' ? 'bg-rose-600' : 'bg-slate-300'
                }`} />

                <div className="flex items-center justify-between">
                  <strong className={`font-extrabold text-xs ${
                    evt.status === 'EXCEPTION' ? 'text-rose-700' : 'text-slate-900'
                  }`}>
                    {evt.title}
                  </strong>
                  <span className="text-[10px] text-slate-400">{evt.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-sans leading-relaxed pt-0.5">
                  {evt.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
