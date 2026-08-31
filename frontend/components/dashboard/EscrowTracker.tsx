'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Truck, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ReceiptText,
  Clock,
  Building2,
  Phone,
  Landmark
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export interface EscrowMilestoneState {
  escrowId: number;
  lotId: number;
  cropName: string;
  totalDeposit: number;
  farmerPayout: number;
  freightCost: number;
  status: 'LOCKED' | 'ADVANCE_DISBURSED' | 'IN_TRANSIT' | 'SETTLED' | 'DISPUTED';
  pickupOtp: string;
  deliveryOtp: string;
  isPickupVerified: boolean;
  isDeliveryVerified: boolean;
  transporterName: string;
  buyerName: string;
}

export function EscrowTracker({ initialData, activeCropName }: { initialData?: Partial<EscrowMilestoneState>; activeCropName?: string }) {
  const [escrow, setEscrow] = useState<EscrowMilestoneState>({
    escrowId: 101,
    lotId: 1,
    cropName: activeCropName || 'Sharbati Wheat (5.0 Tons)',
    totalDeposit: 133612.5,
    farmerPayout: 127500,
    freightCost: 4750,
    status: 'LOCKED',
    pickupOtp: '4821',
    deliveryOtp: '7394',
    isPickupVerified: false,
    isDeliveryVerified: false,
    transporterName: 'Kisan Express Logistics',
    buyerName: 'Sahyadri Farms Trading Co. (Vashi Market)',
    ...initialData
  });

  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 5000);
  };

  const fetchLiveEscrowState = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/escrow/transactions`);
      if (res.ok) {
        const txs = await res.json();
        if (Array.isArray(txs) && txs.length > 0) {
          const latest = txs[txs.length - 1];
          setEscrow(prev => ({
            ...prev,
            escrowId: latest.id,
            totalDeposit: latest.total_locked_amount || prev.totalDeposit,
            farmerPayout: latest.farmer_payout_amount || prev.farmerPayout,
            freightCost: latest.freight_amount || prev.freightCost,
            status: latest.status || prev.status,
            pickupOtp: latest.pickup_otp || prev.pickupOtp,
            deliveryOtp: latest.delivery_otp || prev.deliveryOtp,
            isPickupVerified: ['IN_TRANSIT', 'SETTLED'].includes(latest.status),
            isDeliveryVerified: latest.status === 'SETTLED'
          }));
        }
      }
    } catch {
      // Keep local state
    }
  };

  useEffect(() => {
    fetchLiveEscrowState();
  }, []);

  // Simulate Driver verifying code at farmgate
  const handleSimulateDriverPickup = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetch(`${API_BASE_URL}/api/escrow/advance-freight/${escrow.escrowId}`, { method: 'POST' }).catch(() => {}),
        fetch(`${API_BASE_URL}/api/escrow/verify-pickup/${escrow.escrowId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ otp: escrow.pickupOtp })
        }).catch(() => {})
      ]);
    } catch {}

    setEscrow(prev => ({
      ...prev,
      status: 'IN_TRANSIT',
      isPickupVerified: true
    }));

    triggerToast('🚚 Crop Loaded! Driver entered 4821. ₹1,425 diesel money given to driver. Truck is moving to buyer.');
    setLoading(false);
  };

  // Simulate Buyer confirming weighbridge inward at destination
  const handleSimulateBuyerSettlement = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/api/escrow/settle/${escrow.escrowId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_otp: escrow.deliveryOtp, quality_inspection_pass: true })
      }).catch(() => {});
    } catch {}

    setEscrow(prev => ({
      ...prev,
      status: 'SETTLED',
      isDeliveryVerified: true
    }));

    triggerToast(`🎉 Full Payment Done! ₹${escrow.farmerPayout.toLocaleString('en-IN')} deposited directly into your SBI Bank Account.`);
    setLoading(false);
  };

  const fuelAdvanceAmount = Math.round(escrow.freightCost * 0.3) || 1425;

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center text-xl shadow-xs shrink-0">
            <ShieldCheck size={24} className="text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Safe Payment &amp; Delivery Tracker
              </h3>
              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
                Order #{escrow.escrowId}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              100% Safe Payment in Bank • Money directly deposited into your bank account
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto bg-emerald-50/80 border border-emerald-200/80 px-4 py-2 rounded-2xl">
          <div className="text-right">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 block">Total Money in Bank</span>
            <strong className="text-emerald-900 font-mono font-black text-base">
              ₹{escrow.totalDeposit.toLocaleString('en-IN')}
            </strong>
          </div>
        </div>
      </div>

      {/* Global Toast Message */}
      {toastMsg && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-xs font-bold text-emerald-950 animate-in fade-in flex justify-between items-center shadow-xs">
          <span className="flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-700 shrink-0" />
            {toastMsg}
          </span>
          <button onClick={() => setToastMsg(null)} className="text-emerald-800 hover:text-emerald-950 font-extrabold text-sm ml-4 cursor-pointer">✕</button>
        </div>
      )}

      {/* 4-Step Milestone Progress Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Step 1: Buyer Pays Money to Bank */}
        <div className="p-4 rounded-2xl border border-emerald-500 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-400">
          <div className="flex items-center justify-between">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
              1
            </span>
            <span className="text-[10px] font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 font-mono">
              Money Safe in Bank
            </span>
          </div>
          <h4 className="font-extrabold text-xs text-slate-900 mt-2.5">
            1. Buyer Deposited Money
          </h4>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            ₹{escrow.totalDeposit.toLocaleString('en-IN')} locked in bank
          </p>
        </div>

        {/* Step 2: Driver Fuel Advance */}
        <div className={`p-4 rounded-2xl border transition-all ${
          ['IN_TRANSIT', 'SETTLED'].includes(escrow.status)
            ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-400'
            : 'border-slate-200 bg-slate-50/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center ${
              ['IN_TRANSIT', 'SETTLED'].includes(escrow.status) ? 'bg-emerald-600' : 'bg-amber-600'
            }`}>
              2
            </span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border font-mono ${
              ['IN_TRANSIT', 'SETTLED'].includes(escrow.status)
                ? 'text-emerald-900 bg-emerald-100 border-emerald-200'
                : 'text-amber-900 bg-amber-100 border-amber-200'
            }`}>
              Diesel Advance
            </span>
          </div>
          <h4 className="font-extrabold text-xs text-slate-900 mt-2.5">
            2. Driver Fuel Money
          </h4>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            ₹{fuelAdvanceAmount.toLocaleString('en-IN')} paid to driver
          </p>
        </div>

        {/* Step 3: Truck Loads at Farm */}
        <div className={`p-4 rounded-2xl border transition-all ${
          escrow.status === 'IN_TRANSIT'
            ? 'border-purple-500 bg-purple-50/80 shadow-xs ring-2 ring-purple-400'
            : escrow.status === 'SETTLED'
            ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-400'
            : 'border-slate-200 bg-slate-50/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center ${
              escrow.status === 'SETTLED' ? 'bg-emerald-600' : 'bg-purple-600'
            }`}>
              3
            </span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border font-mono ${
              escrow.status === 'SETTLED'
                ? 'text-emerald-900 bg-emerald-100 border-emerald-200'
                : 'text-purple-900 bg-purple-100 border-purple-200'
            }`}>
              4-Digit Code
            </span>
          </div>
          <h4 className="font-extrabold text-xs text-slate-900 mt-2.5">
            3. Truck Loads at Farm
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Status: {escrow.isPickupVerified ? <strong className="text-emerald-700">Truck Moving to Market</strong> : 'Give Code to Driver'}
          </p>
        </div>

        {/* Step 4: Final Payment to Your Bank */}
        <div className={`p-4 rounded-2xl border transition-all ${
          escrow.status === 'SETTLED'
            ? 'border-emerald-600 bg-emerald-50 shadow-xs ring-2 ring-emerald-500'
            : 'border-slate-200 bg-slate-50/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-black flex items-center justify-center">
              4
            </span>
            <span className="text-[10px] font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 font-mono">
              100% Payment Sent
            </span>
          </div>
          <h4 className="font-extrabold text-xs text-slate-900 mt-2.5">
            4. Direct Bank Payment
          </h4>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            ₹{escrow.farmerPayout.toLocaleString('en-IN')} deposited in your bank
          </p>
        </div>

      </div>

      {/* Simplified Farmer Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Panel 1: Truck Pickup at Your Farm */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Truck size={16} className="text-emerald-700" />
                <span>🚚 Truck Pickup at Your Farm</span>
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Driver: Vikram Shinde
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When the truck arrives at your farm to load your crop, tell this 4-digit code to driver Vikram Shinde. Once the driver enters the code, his ₹{fuelAdvanceAmount.toLocaleString('en-IN')} diesel advance is sent automatically and the truck starts moving.
            </p>
          </div>

          {!escrow.isPickupVerified ? (
            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-2xl border-2 border-emerald-300 shadow-sm gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-slate-900 block">Your 4-Digit Pickup Code:</span>
                  <span className="text-[11px] text-slate-500">Tell this code to driver Vikram Shinde after bags are loaded</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black font-mono text-emerald-950 bg-emerald-100/90 px-4 py-2 rounded-xl border border-emerald-300 shadow-xs tracking-widest">
                    {escrow.pickupOtp}
                  </span>
                </div>
              </div>

              {/* Demo Helper for Presentation */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSimulateDriverPickup}
                  disabled={loading}
                  className="text-[11px] font-bold text-purple-700 hover:text-purple-900 font-mono underline cursor-pointer flex items-center gap-1"
                >
                  ⚡ [Demo: Click to simulate driver typing {escrow.pickupOtp}]
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-100/90 border border-emerald-300 rounded-2xl text-xs text-emerald-950 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 font-black text-sm">
                <CheckCircle2 size={17} className="text-emerald-700 shrink-0" />
                <span>Crop Loaded &amp; Truck on the Way!</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Driver Vikram Shinde has entered your code <strong>{escrow.pickupOtp}</strong>. Your produce is loaded on truck (MH-15-EG-4421) and moving safely to the buyer. Driver received ₹{fuelAdvanceAmount.toLocaleString('en-IN')} diesel advance.
              </p>
            </div>
          )}
        </div>

        {/* Panel 2: Delivery & Direct Bank Deposit */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Building2 size={16} className="text-blue-700" />
                <span>🏢 Crop Delivery &amp; Final Bank Payment</span>
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Buyer: Sahyadri Farms
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When the truck reaches the buyer's warehouse, they weigh your bags and check the quality. Once accepted, your total payment will transfer automatically directly into your bank account. You do not need to do anything.
            </p>
          </div>

          {!escrow.isDeliveryVerified ? (
            <div className="space-y-3 pt-1">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Landmark size={14} className="text-slate-400" />
                    Your Bank Account:
                  </span>
                  <span className="font-mono font-bold text-slate-900">State Bank of India (SBI ••••••••4012)</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-500 font-medium">Your Guaranteed Payout:</span>
                  <strong className="text-emerald-800 font-mono font-black text-base">
                    ₹{escrow.farmerPayout.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  <Clock size={13} className="shrink-0 text-amber-600" />
                  <span>Truck is on the way • Money will auto-deposit in your bank once delivered</span>
                </div>
              </div>

              {/* Demo Helper for Presentation */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSimulateBuyerSettlement}
                  disabled={loading}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-900 font-mono underline cursor-pointer flex items-center gap-1"
                >
                  ⚡ [Demo: Click to simulate buyer accepting delivery]
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-100/90 border border-emerald-300 rounded-2xl text-xs text-emerald-950 space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 font-black text-sm">
                <CheckCircle2 size={17} className="text-emerald-700 shrink-0" />
                <span>Payment Done! Money Deposited in Bank</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Full amount of <strong>₹{escrow.farmerPayout.toLocaleString('en-IN')}</strong> has been deposited directly into your SBI Account (••••••••4012). Bank Ref #SBIN2026082599182.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-900 pt-1">
                <ReceiptText size={14} className="text-emerald-700" />
                <span>Official Bill &amp; Payment Receipt Saved in Your Account</span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default EscrowTracker;
