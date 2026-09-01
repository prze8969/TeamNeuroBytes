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
      <div className="flex-1 p-8 text-center bg-white rounded-3xl clay-card flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg shadow-[inset_1px_1px_3px_rgba(46,125,50,0.15)]">
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
    <div className="flex-1 bg-white rounded-2xl p-5 space-y-5 clay-card overflow-y-auto font-sans">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-emerald-800 text-white space-y-4 shadow-md border-none">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-emerald-900 text-white shadow-xs">
            {tender.id} • {tender.required_vehicle}
          </span>
          <span className="text-xs font-mono font-extrabold text-emerald-100 bg-emerald-900/60 px-3 py-1 rounded-full shadow-xs">
            ⚡ 30% Fuel Advance Escrow Guaranteed
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight leading-tight">
              {tender.crop_name} ({tender.variety})
            </h2>
            <p className="text-xs text-emerald-100 font-mono pt-1">
              Farmer: <strong className="text-white">{tender.farmer_name}</strong> • Window: <strong className="text-amber-300 font-bold">{tender.pickup_window}</strong>
            </p>
          </div>

          <div className="text-left sm:text-right font-mono">
            <span className="text-[10px] text-emerald-100 uppercase font-sans font-bold block">Total Freight Escrow</span>
            <strong className="text-2xl font-black text-white block">
              ₹{tender.total_freight_inr.toLocaleString('en-IN')}
            </strong>
            <span className="text-[11px] text-emerald-200 font-bold">
              ₹{tender.freight_rate_kg.toFixed(2)}/kg • {tender.quantity_tons} MT
            </span>
          </div>
        </div>
      </div>

      {/* Corridor & Financial Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Corridor Details */}
        <div className="p-4 rounded-2xl clay-card-flat space-y-3">
          <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
            <MapPin size={14} className="text-emerald-700" />
            <span>Freight Corridor Routing</span>
          </h3>

          <div className="space-y-2 font-mono text-xs text-slate-700">
            <div className="p-3 rounded-xl bg-white space-y-0.5 shadow-xs border-none">
              <span className="text-[9px] uppercase font-bold text-slate-400 block font-sans">Farmgate Loading Point</span>
              <strong className="text-slate-950 text-xs block">{tender.origin}</strong>
            </div>

            <div className="p-3 rounded-xl bg-white space-y-0.5 shadow-xs border-none">
              <span className="text-[9px] uppercase font-bold text-slate-400 block font-sans">APMC Mandi Terminal</span>
              <strong className="text-emerald-850 text-xs block">{tender.destination}</strong>
            </div>
          </div>
        </div>

        {/* Financial Escrow Breakdown */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 space-y-3 shadow-xs border-none">
          <h3 className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-700" />
            <span>Escrow Disbursement Terms</span>
          </h3>

          <div className="p-3 rounded-xl bg-white font-mono text-xs space-y-2 text-slate-800 shadow-xs border-none">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-sans text-xs">30% Fuel Advance:</span>
              <strong className="text-emerald-900 font-black text-sm">₹{tender.advance_30_pct_inr.toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-sans text-xs">70% Mandi Settlement:</span>
              <strong className="text-emerald-850 font-black text-sm">₹{(tender.total_freight_inr - tender.advance_30_pct_inr).toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
              <span className="text-slate-500 font-sans font-bold text-xs">Total Freight:</span>
              <strong className="text-slate-950 font-black text-sm">₹{tender.total_freight_inr.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Truck & Driver Assignment Form */}
      <div className="p-4 sm:p-5 rounded-2xl clay-card bg-slate-50/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h3 className="font-black text-slate-950 text-xs flex items-center gap-2">
            <Truck size={15} className="text-emerald-700" />
            <span>Assigned Fleet Vehicle &amp; Driver</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            AIS-140 GPS Telemetry Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Driver Name:</label>
            <Input
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="clay-input h-11 w-full text-xs bg-white font-medium"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Driver Phone:</label>
            <Input
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
              className="clay-input h-11 w-full font-mono text-xs bg-white font-medium"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Vehicle Registration:</label>
            <Input
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              className="clay-input h-11 w-full font-mono uppercase text-xs bg-white font-medium"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            onClick={handleSubmit}
            variant="clayPrimary"
            className="w-full sm:w-auto h-12 px-8 rounded-2xl text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>Accept Load &amp; Confirm Dispatch</span>
            <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}
