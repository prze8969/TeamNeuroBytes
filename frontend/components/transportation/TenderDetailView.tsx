'use client';

import React, { useState } from 'react';
import { PackageCheck, MapPin, Building2, Clock, Truck, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OpenTenderItem } from './TenderSidePanel';

interface TenderDetailViewProps {
  tender: OpenTenderItem | null;
  onAcceptLoad: (tender: OpenTenderItem, driverName: string, driverPhone: string, vehicleNo: string) => void;
}

export function TenderDetailView({ tender, onAcceptLoad }: TenderDetailViewProps) {
  const [driverName, setDriverName] = useState<string>('Suresh Rathod');
  const [driverPhone, setDriverPhone] = useState<string>('+91 98231 49821');
  const [vehicleNo, setVehicleNo] = useState<string>('MH-15-EG-4421');

  if (!tender) {
    return (
      <div className="flex-1 p-8 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
          <PackageCheck size={24} />
        </div>
        <h3 className="font-black text-slate-900 text-sm">Select a Tender</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Select an open freight tender from the side panel to view full corridor specifications and assign dispatch.
        </p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAcceptLoad(tender, driverName, driverPhone, vehicleNo);
  };

  return (
    <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-2xs overflow-y-auto font-sans">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-200 border border-emerald-800">
            {tender.id} • {tender.required_vehicle}
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
            ⚡ 30% Fuel Advance Escrow Guaranteed
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {tender.crop_name} ({tender.variety})
            </h2>
            <p className="text-xs text-slate-300 font-mono pt-0.5">
              Farmer: <strong>{tender.farmer_name}</strong> • Window: <strong className="text-amber-300">{tender.pickup_window}</strong>
            </p>
          </div>

          <div className="text-left sm:text-right font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Total Freight Escrow</span>
            <strong className="text-2xl font-black text-emerald-400 block">
              ₹{tender.total_freight_inr.toLocaleString('en-IN')}
            </strong>
            <span className="text-[11px] text-slate-300">
              ₹{tender.freight_rate_kg.toFixed(2)}/kg • {tender.quantity_tons} MT
            </span>
          </div>
        </div>
      </div>

      {/* Corridor & Financial Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Corridor Details */}
        <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
          <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
            <MapPin size={14} className="text-emerald-700" />
            Freight Corridor Routing
          </h3>

          <div className="space-y-2 font-mono text-xs text-slate-700">
            <div className="p-3 rounded-2xl bg-white border border-slate-100 space-y-0.5">
              <span className="text-[9px] uppercase font-bold text-slate-400 block font-sans">Farmgate Loading Point</span>
              <strong className="text-slate-900 text-sm block">{tender.origin}</strong>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-100 space-y-0.5">
              <span className="text-[9px] uppercase font-bold text-slate-400 block font-sans">APMC Mandi Terminal</span>
              <strong className="text-emerald-800 text-sm block">{tender.destination}</strong>
            </div>
          </div>
        </div>

        {/* Financial Escrow Breakdown */}
        <div className="p-4 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-3">
          <h3 className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-700" />
            Escrow Disbursement Terms
          </h3>

          <div className="p-3 rounded-2xl bg-white border border-emerald-100 font-mono text-xs space-y-2 text-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-sans">30% Instant Fuel Advance:</span>
              <strong className="text-emerald-900 font-black text-sm">₹{tender.advance_30_pct_inr.toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-sans">70% Mandi Yard Settlement:</span>
              <strong className="text-emerald-800 font-black text-sm">₹{(tender.total_freight_inr - tender.advance_30_pct_inr).toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
              <span className="text-slate-500 font-sans font-bold">Total Freight Contract:</span>
              <strong className="text-slate-900 font-black text-sm">₹{tender.total_freight_inr.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Truck & Driver Assignment Form */}
      <form onSubmit={handleSubmit} className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
            <Truck size={16} className="text-emerald-700" />
            Assign Fleet Vehicle &amp; Driver for Dispatch
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            Direct FASTag / AIS-140 Live Tracking Integration
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Driver Full Name:</label>
            <Input
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="h-10 rounded-xl bg-white focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Driver Phone Number:</label>
            <Input
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
              className="h-10 rounded-xl font-mono bg-white focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Vehicle Registration No:</label>
            <Input
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              className="h-10 rounded-xl font-mono uppercase bg-white focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs h-10 px-6 rounded-xl shadow-sm shadow-emerald-700/20 flex items-center gap-2 cursor-pointer"
          >
            <span>Accept Load &amp; Confirm Dispatch</span>
            <ArrowRight size={14} />
          </Button>
        </div>
      </form>
    </div>
  );
}
