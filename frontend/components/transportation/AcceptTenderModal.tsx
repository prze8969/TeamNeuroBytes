'use client';

import React, { useEffect, useState } from 'react';
import { Truck, MapPin, ArrowRight, UserCircle, X, Loader2, IndianRupee, Package } from 'lucide-react';
import type { OpenTenderItem } from './TenderSidePanel';
import { DEFAULT_VEHICLE_TYPE_OPTIONS } from './TransporterOnboardingModal';

/**
 * Accept an open freight tender from the Load Board and assign a driver +
 * vehicle (POST /api/transporter/accept-load). Vehicle type options are
 * reused from the fleet onboarding options so the module stays consistent.
 */

interface AcceptTenderModalProps {
  tender: OpenTenderItem | null;
  isOpen: boolean;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  defaultDriverPhone?: string;
  onClose: () => void;
  onAccept: (tender: OpenTenderItem, assignment: { driver_name: string; driver_phone: string; vehicle_number: string; vehicle_type: string }) => void;
}

export function AcceptTenderModal({ tender, isOpen, isSubmitting, errorMessage, defaultDriverPhone, onClose, onAccept }: AcceptTenderModalProps) {
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState(defaultDriverPhone || '');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState(DEFAULT_VEHICLE_TYPE_OPTIONS[1].label);

  useEffect(() => {
    if (isOpen) {
      setDriverName('');
      setDriverPhone(defaultDriverPhone || '');
      setVehicleNumber('');
      setVehicleType(
        tender?.required_vehicle?.toLowerCase().includes('reefer')
          ? DEFAULT_VEHICLE_TYPE_OPTIONS[3].label
          : tender?.required_vehicle?.toLowerCase().includes('10-wheeler') || tender?.required_vehicle?.toLowerCase().includes('hauler')
          ? DEFAULT_VEHICLE_TYPE_OPTIONS[2].label
          : DEFAULT_VEHICLE_TYPE_OPTIONS[1].label
      );
    }
  }, [isOpen, tender, defaultDriverPhone]);

  if (!isOpen || !tender) return null;

  const valid = driverName.trim() && driverPhone.trim() && vehicleNumber.trim();

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label="Accept freight load">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="shrink-0 px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Accept Freight Load</p>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">{tender.crop_name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{tender.variety} · {tender.quantity_tons} MT · {tender.farmer_name}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0" aria-label="Close">
              <X size={14} className="text-slate-600" />
            </button>
          </div>
          {/* Route summary */}
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
            <MapPin size={12} className="text-emerald-600 shrink-0" />
            <span className="truncate">{tender.origin}</span>
            <ArrowRight size={12} className="text-slate-400 shrink-0" />
            <span className="truncate">{tender.destination}</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-slate-50 py-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Freight</p>
              <p className="text-sm font-black text-slate-900">₹{tender.total_freight_inr.toLocaleString('en-IN')}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 py-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-700">30% Advance</p>
              <p className="text-sm font-black text-emerald-800">₹{tender.advance_30_pct_inr.toLocaleString('en-IN')}</p>
            </div>
            <div className="rounded-lg bg-slate-50 py-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Load</p>
              <p className="text-sm font-black text-slate-900">{tender.quantity_tons} MT</p>
            </div>
          </div>
        </div>
        {/* Assignment form */}
        <form
          className="flex-1 overflow-y-auto p-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid && !isSubmitting) onAccept(tender, { driver_name: driverName.trim(), driver_phone: driverPhone.trim(), vehicle_number: vehicleNumber.trim().toUpperCase(), vehicle_type: vehicleType });
          }}
        >
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Package size={12} /> Pickup window: <span className="font-semibold text-slate-700">{tender.pickup_window}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="driver-name" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Driver Name</label>
              <div className="relative mt-1.5">
                <UserCircle size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="driver-name" value={driverName} onChange={(e) => setDriverName(e.target.value)} placeholder="e.g. Suresh Rathod"
                  className="w-full h-11 pl-9 pr-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm" />
              </div>
            </div>
            <div>
              <label htmlFor="driver-phone" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Driver Phone</label>
              <input id="driver-phone" value={driverPhone} onChange={(e) => setDriverPhone(e.target.value)} placeholder="+91 98231 49821"
                className="w-full h-11 px-3 mt-1.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm" />
            </div>
            <div>
              <label htmlFor="vehicle-number" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vehicle Number</label>
              <div className="relative mt-1.5">
                <Truck size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="vehicle-number" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="MH-15-EG-4421"
                  className="w-full h-11 pl-9 pr-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm font-mono uppercase" />
              </div>
            </div>
            <div>
              <label htmlFor="vehicle-type" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vehicle Type</label>
              <select id="vehicle-type" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}
                className="w-full h-11 px-3 mt-1.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm bg-white">
                {DEFAULT_VEHICLE_TYPE_OPTIONS.map(v => <option key={v.id} value={v.label}>{v.label}</option>)}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">Load requires: {tender.required_vehicle}</p>
            </div>
          </div>

          {errorMessage && (
            <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2" role="alert">{errorMessage}</p>
          )}

          <p className="text-[11px] text-slate-400 flex items-center gap-1"><IndianRupee size={11} /> Balance ₹{(tender.total_freight_inr - tender.advance_30_pct_inr).toLocaleString('en-IN')} settles on delivery</p>

          <button type="submit" disabled={!valid || isSubmitting}
            className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg">
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Truck size={16} />}
            {isSubmitting ? 'Assigning…' : 'Confirm & Assign Truck'}
          </button>
        </form>

      </div>
    </div>
  );
}
