'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  Truck, 
  Scale, 
  Building2, 
  CreditCard, 
  Wallet, 
  Landmark, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Calendar,
  AlertTriangle,
  Sparkles,
  MapPin,
  Snowflake,
  Zap,
  Gauge
} from 'lucide-react';
import { CropLot } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface CarrierOption {
  id: string;
  name: string;
  ratePerKg: number;
  tag: string;
  rating: string;
  icon: string;
  transitHours: string;
  description: string;
}

export const CARRIER_OPTIONS: CarrierOption[] = [
  {
    id: 'KISAN_EXPRESS',
    name: 'Kisan Express Logistics',
    ratePerKg: 1.20,
    tag: '35% Savings • Eco Pooled',
    rating: '4.9 ★ (142 Trips)',
    icon: '🚚',
    transitHours: '4.5 hrs',
    description: 'Shared Corridor Haulage (Nashik - Thane - Vashi APMC)'
  },
  {
    id: 'SAHYADRI_COLD',
    name: 'Sahyadri Cold-Chain',
    ratePerKg: 1.60,
    tag: 'Temperature Controlled (14°C)',
    rating: '4.8 ★ (98 Trips)',
    icon: '❄️',
    transitHours: '4.0 hrs',
    description: 'Reefer Truck with Active IoT Thermal & Humidity Sensors'
  },
  {
    id: 'MANDI_DIRECT',
    name: 'Mandi Direct Express',
    ratePerKg: 1.85,
    tag: 'Fastest Solo Haul',
    rating: '4.6 ★ (64 Trips)',
    icon: '🚛',
    transitHours: '3.0 hrs',
    description: 'Dedicated Solo 16-Wheeler Direct Express Delivery'
  }
];

export interface BiddingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lot: CropLot | null;
  onConfirmBidAndEscrow: (bidData: {
    lotId: string;
    bidPricePerKg: number;
    paymentMethod: string;
    deliveryDays: number;
    totalCropValue: number;
    estimatedFreight: number;
    apmcCessFee: number;
    totalEscrowAmount: number;
    carrierId?: string;
    carrierName?: string;
    freightRatePerKg?: number;
  }) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function BiddingDrawer({
  isOpen,
  onClose,
  lot,
  onConfirmBidAndEscrow,
  isSubmitting = false
}: BiddingDrawerProps) {
  const floorPrice = lot?.askingFloorPerKg ?? lot?.basePricePerKg ?? 24.50;
  const quantityKg = lot?.quantityKg ?? ((lot?.quantityTons ?? 5.0) * 1000);
  const quantityTons = lot?.quantityTons ?? (quantityKg / 1000);
  const distanceKm = lot?.distanceKm ?? 38;
  const origin = lot?.origin ?? `${lot?.location?.district || 'Nashik'}, ${lot?.location?.state || 'Maharashtra'}`;
  const gradeKey = lot?.qualityGrade ?? `Grade ${lot?.grade || 'A'}`;
  const qualityScore = lot?.qualityScore ?? 94.2;

  // Form State (Always declared unconditionally at the top of the component)
  const [bidPrice, setBidPrice] = useState<string>(floorPrice.toFixed(2));
  const [selectedCarrierId, setSelectedCarrierId] = useState<string>('KISAN_EXPRESS');
  const [paymentMethod, setPaymentMethod] = useState<'VIRTUAL_ESCROW' | 'CORPORATE_NETBANKING' | 'TRADE_CREDIT'>('VIRTUAL_ESCROW');
  const [deliveryDays, setDeliveryDays] = useState<number>(3);
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (lot) {
      const price = lot.askingFloorPerKg ?? lot.basePricePerKg ?? 24.50;
      setBidPrice(price.toFixed(2));
    }
  }, [lot]);

  if (!isOpen || !lot) return null;

  const selectedCarrier = CARRIER_OPTIONS.find(c => c.id === selectedCarrierId) || CARRIER_OPTIONS[0];
  const dynamicFreightPerKg = selectedCarrier.ratePerKg;

  const numericBid = parseFloat(bidPrice) || 0;
  const minAllowedBid = floorPrice;
  const isValidBid = numericBid >= minAllowedBid;

  // Real-Time Calculations
  const baseCropValue = Math.round(numericBid * quantityKg);
  const estimatedFreight = Math.round(dynamicFreightPerKg * quantityKg);
  const apmcCessFee = Math.round(baseCropValue * 0.015); // 1.5% Statutory Mandi Cess & APMC Duty
  const totalEscrowAmount = baseCropValue + estimatedFreight + apmcCessFee;
  const landedCostPerKg = numericBid > 0 ? (totalEscrowAmount / quantityKg) : 0;

  const advanceFreight30 = Math.round(estimatedFreight * 0.30);
  const balanceFreight70 = Math.round(estimatedFreight * 0.70);

  const handleStepPrice = (delta: number) => {
    const nextVal = Math.max(minAllowedBid, Math.round((numericBid + delta) * 100) / 100);
    setBidPrice(nextVal.toFixed(2));
  };

  const handleSubmit = () => {
    if (!isValidBid || isSubmitting) return;
    onConfirmBidAndEscrow({
      lotId: lot.id,
      bidPricePerKg: numericBid,
      paymentMethod,
      deliveryDays,
      totalCropValue: baseCropValue,
      estimatedFreight,
      apmcCessFee,
      totalEscrowAmount,
      carrierId: selectedCarrier.id,
      carrierName: selectedCarrier.name,
      freightRatePerKg: selectedCarrier.ratePerKg
    });
  };

  const cropImageSrc = lot.imageUrl || (
    lot.cropName.toLowerCase().includes('tomato')
      ? 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
      : lot.cropName.toLowerCase().includes('onion')
      ? 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80'
      : lot.cropName.toLowerCase().includes('rice')
      ? 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300 border-l border-slate-200 text-slate-900">
        
        {/* ========================================================================= */}
        {/* DRAWER HEADER */}
        {/* ========================================================================= */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-emerald-50/50 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold">
                <Lock size={15} />
              </div>
              <h2 className="text-lg font-black text-slate-900">
                Institutional Bidding &amp; Escrow
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Procure direct from verified farmgate with Milestone Escrow Protection
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SCROLLABLE FORM BODY */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Produce Summary Snapshot Card */}
          <div className="rounded-2xl border border-slate-200 p-3.5 bg-slate-50 flex gap-3.5 items-center">
            <img
              src={cropImageSrc}
              alt={lot.cropName}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900 truncate">
                  {lot.cropName}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold shrink-0">
                  {gradeKey} ({qualityScore}%)
                </span>
              </div>
              <p className="text-slate-500 truncate">
                {lot.variety} • Farmer: <strong className="text-slate-800">{lot.farmerName}</strong>
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-600 font-mono pt-0.5">
                <span>📦 <strong>{quantityTons.toFixed(1)} MT</strong> ({quantityKg.toLocaleString('en-IN')} kg)</span>
                <span>•</span>
                <span>📍 {origin} ({distanceKm} km)</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 1. BID PRICE ENTRY */}
          {/* ========================================================================= */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-black text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span>Offer Rate per kg</span>
                <span className="text-slate-400 font-normal">(Ex-Farmgate)</span>
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                Floor: <strong className="text-emerald-700">₹{minAllowedBid.toFixed(2)}/kg</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-base font-bold text-slate-400">
                  ₹
                </span>
                <Input
                  type="number"
                  step="0.05"
                  min={minAllowedBid}
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  className={`pl-8 pr-12 text-lg font-black font-mono h-11 rounded-xl ${
                    !isValidBid ? 'border-amber-400 focus-visible:ring-amber-400' : 'border-slate-300'
                  }`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400">
                  / kg
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleStepPrice(+0.25)}
                className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 font-black text-xs text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                +0.25
              </button>
              <button
                type="button"
                onClick={() => handleStepPrice(+0.50)}
                className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 font-black text-sm text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                +0.5
              </button>
            </div>

            {!isValidBid && (
              <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                ⚠️ Bid cannot be lower than the asking floor rate of ₹{minAllowedBid.toFixed(2)}/kg.
              </p>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 2. SELECT FREIGHT & LOGISTICS CARRIER OPTION */}
          {/* ========================================================================= */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-black text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Truck size={13} className="text-purple-600" />
                <span>Select Freight &amp; Logistics Partner</span>
              </label>
              <span className="text-[10px] font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {selectedCarrier.tag}
              </span>
            </div>

            <div className="space-y-2">
              {CARRIER_OPTIONS.map((carrier, idx) => (
                <div
                  key={`carrier-${carrier.id}-${idx}`}
                  onClick={() => setSelectedCarrierId(carrier.id)}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    selectedCarrierId === carrier.id
                      ? 'border-purple-600 bg-purple-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{carrier.icon}</span>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="font-extrabold text-slate-900 text-xs">
                          {carrier.name}
                        </strong>
                        <span className="text-[10px] font-mono font-bold text-slate-500">
                          {carrier.rating}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {carrier.description} • <strong className="text-purple-900 font-mono">ETA: {carrier.transitHours}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono">
                    <strong className="text-sm font-black text-purple-900 block">
                      ₹{carrier.ratePerKg.toFixed(2)}/kg
                    </strong>
                    <span className="text-[10px] text-slate-400">
                      ₹{Math.round(carrier.ratePerKg * quantityKg).toLocaleString('en-IN')} total
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. FINANCIAL RAILS & LANDED COST BREAKDOWN */}
          {/* ========================================================================= */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>Financial Escrow Breakdown</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-mono">
                Landed: ₹{landedCostPerKg.toFixed(2)}/kg
              </span>
            </h4>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2.5 text-xs font-mono">
              
              {/* Row 1: Base Crop Value */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5 font-sans">
                  <Scale size={13} className="text-slate-400" />
                  Base Crop Value ({quantityKg.toLocaleString('en-IN')} kg @ ₹{numericBid.toFixed(2)}/kg):
                </span>
                <strong className="text-slate-900 font-bold">
                  ₹{baseCropValue.toLocaleString('en-IN')}
                </strong>
              </div>

              {/* Row 2: Freight Allocation */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5 font-sans">
                  <Truck size={13} className="text-purple-600" />
                  Freight ({selectedCarrier.name} @ ₹{dynamicFreightPerKg.toFixed(2)}/kg):
                </span>
                <strong className="text-purple-700 font-bold">
                  + ₹{estimatedFreight.toLocaleString('en-IN')}
                </strong>
              </div>

              {/* Sub-breakdown: 30% advance vs 70% settlement */}
              <div className="pl-5 text-[10px] text-slate-500 flex justify-between font-sans">
                <span>• 30% Fuel Advance (Released upon Farmgate loading):</span>
                <span className="font-mono">₹{advanceFreight30.toLocaleString('en-IN')}</span>
              </div>
              <div className="pl-5 text-[10px] text-slate-500 flex justify-between font-sans">
                <span>• 70% Balance (Released upon Mandi Weighbridge QC Pass):</span>
                <span className="font-mono">₹{balanceFreight70.toLocaleString('en-IN')}</span>
              </div>

              {/* Row 3: Mandi Cess */}
              <div className="flex items-center justify-between border-t border-slate-200/80 pt-2">
                <span className="text-slate-600 flex items-center gap-1.5 font-sans">
                  <Building2 size={13} className="text-blue-600" />
                  Statutory APMC Mandi Cess &amp; Platform Escrow (1.5%):
                </span>
                <strong className="text-blue-700 font-bold">
                  + ₹{apmcCessFee.toLocaleString('en-IN')}
                </strong>
              </div>

              {/* Total Locked Escrow Header */}
              <div className="flex items-center justify-between border-t-2 border-slate-900/80 pt-2.5 text-sm font-black">
                <span className="text-slate-900 font-sans uppercase tracking-tight flex items-center gap-1.5">
                  <Lock size={15} className="text-emerald-700" />
                  Total Escrow Capital Required:
                </span>
                <span className="text-emerald-800 text-base font-mono">
                  ₹{totalEscrowAmount.toLocaleString('en-IN')}
                </span>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. PAYMENT RAIL SELECTOR */}
          {/* ========================================================================= */}
          <div className="space-y-2.5">
            <label className="font-black text-slate-800 uppercase tracking-wider text-[11px] block">
              Authorization &amp; Escrow Funding Method
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Option 1: Virtual Escrow Account */}
              <div
                onClick={() => setPaymentMethod('VIRTUAL_ESCROW')}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer space-y-1 ${
                  paymentMethod === 'VIRTUAL_ESCROW'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Landmark size={16} className="text-emerald-700" />
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold rounded">
                    Instant (VAN)
                  </span>
                </div>
                <strong className="font-bold text-slate-900 block text-xs">
                  Virtual Escrow
                </strong>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Auto-debit from ICICI Nodal Vault
                </p>
              </div>

              {/* Option 2: Corporate NetBanking */}
              <div
                onClick={() => setPaymentMethod('CORPORATE_NETBANKING')}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer space-y-1 ${
                  paymentMethod === 'CORPORATE_NETBANKING'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <CreditCard size={16} className="text-blue-700" />
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-blue-100 text-blue-800 font-bold rounded">
                    RTGS/NEFT
                  </span>
                </div>
                <strong className="font-bold text-slate-900 block text-xs">
                  Corp NetBanking
                </strong>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Institutional Multi-Auth Gateway
                </p>
              </div>

              {/* Option 3: APMC Trade Credit */}
              <div
                onClick={() => setPaymentMethod('TRADE_CREDIT')}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer space-y-1 ${
                  paymentMethod === 'TRADE_CREDIT'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Wallet size={16} className="text-purple-700" />
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-purple-100 text-purple-800 font-bold rounded">
                    T+7 Credit
                  </span>
                </div>
                <strong className="font-bold text-slate-900 block text-xs">
                  APMC Trade Line
                </strong>
                <p className="text-[10px] text-slate-500 leading-tight">
                  ₹50L Approved Institutional Limit
                </p>
              </div>

            </div>
          </div>

          {/* Delivery Timeline Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800">
                Required Farmgate Pickup Deadline:
              </label>
              <strong className="text-emerald-800 font-mono font-bold">
                {deliveryDays} Days
              </strong>
            </div>
            <input
              type="range"
              min={1}
              max={7}
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>24 Hours (Urgent)</span>
              <span>3 Days (Standard)</span>
              <span>7 Days (Scheduled)</span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* DRAWER FOOTER (SUBMIT ACTION) */}
        {/* ========================================================================= */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-500 font-medium">Total Escrow Commit:</span>
            <strong className="text-base font-black text-emerald-900 font-mono block">
              ₹{totalEscrowAmount.toLocaleString('en-IN')}
            </strong>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 px-4 rounded-xl text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={!isValidBid || isSubmitting}
              onClick={handleSubmit}
              className="h-11 px-6 rounded-xl font-black text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authorizing Escrow...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} />
                  Authorize &amp; Lock Escrow
                  <ArrowRight size={14} />
                </span>
              )}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
