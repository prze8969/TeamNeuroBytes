'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Landmark,
  Layers
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import { Bid, CropLot } from '@/lib/types';

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
  driverName?: string;
  vehicleNumber?: string;
}

interface EscrowTrackerProps {
  initialData?: Partial<EscrowMilestoneState>;
  activeCropName?: string;
  acceptedBids?: Bid[];
  lots?: CropLot[];
  selectedOrderId?: number;
  onSelectOrder?: (orderId: number) => void;
}

export function EscrowTracker({ 
  initialData, 
  activeCropName,
  acceptedBids = [],
  lots = [],
  selectedOrderId,
  onSelectOrder
}: EscrowTrackerProps) {

  // Generate dynamic deals list from accepted bids and default state
  const defaultDeals: EscrowMilestoneState[] = useMemo(() => {
    // If we have accepted bids passed from parent dashboard
    if (acceptedBids && acceptedBids.length > 0) {
      return acceptedBids.map((b, idx) => {
        const numericId = parseInt(b.id.replace(/\D/g, ''), 10) || (101 + idx);
        const matchingLot = lots.find(l => l.id === b.lotId);
        const cropTitle = matchingLot?.cropName || (idx === 0 ? (activeCropName || 'Potato (Kufri Jyoti • 5.0 Tons)') : 'Sharbati Wheat (5.0 Tons)');
        const total = b.totalAmount || 150000;
        const payout = Math.round(total * 0.95);
        const freight = Math.round(total * 0.04) || 4750;
        const otps = ['4821', '7193', '3954', '8261'];
        const drivers = ['Vikram Shinde', 'Santosh Pawar', 'Ganesh Kadam', 'Pravin Jadhav'];
        const vehicles = ['MH-15-EG-4421', 'MH-12-RN-8812', 'MH-14-BT-9021', 'MH-04-AB-3319'];

        return {
          escrowId: numericId,
          lotId: parseInt(String(b.lotId).replace(/\D/g, ''), 10) || (idx + 1),
          cropName: cropTitle,
          totalDeposit: total,
          farmerPayout: payout,
          freightCost: freight,
          status: (idx === 1 ? 'IN_TRANSIT' : 'LOCKED') as any,
          pickupOtp: otps[idx % otps.length],
          deliveryOtp: '7394',
          isPickupVerified: idx === 1,
          isDeliveryVerified: false,
          transporterName: 'Kisan Express Logistics',
          buyerName: b.buyerName || 'Sahyadri Farms Trading Co.',
          driverName: drivers[idx % drivers.length],
          vehicleNumber: vehicles[idx % vehicles.length]
        };
      });
    }

    // Default 2 realistic orders for demonstration
    return [
      {
        escrowId: 101,
        lotId: 1,
        cropName: activeCropName || 'Potato (Kufri Jyoti • 5.0 Tons)',
        totalDeposit: 150000,
        farmerPayout: 142500,
        freightCost: 5500,
        status: 'LOCKED',
        pickupOtp: '4821',
        deliveryOtp: '7394',
        isPickupVerified: false,
        isDeliveryVerified: false,
        transporterName: 'Kisan Express Logistics',
        buyerName: 'AgroProcure Private Ltd (Nashik Hub)',
        driverName: 'Vikram Shinde',
        vehicleNumber: 'MH-15-EG-4421',
        ...initialData
      },
      {
        escrowId: 102,
        lotId: 2,
        cropName: 'Sharbati Wheat (Lok-1 • 5.0 Tons)',
        totalDeposit: 133612.5,
        farmerPayout: 127500,
        freightCost: 4750,
        status: 'IN_TRANSIT',
        pickupOtp: '7193',
        deliveryOtp: '9124',
        isPickupVerified: true,
        isDeliveryVerified: false,
        transporterName: 'Kisan Express Logistics',
        buyerName: 'Sahyadri Farms Trading Co. (Vashi Market)',
        driverName: 'Santosh Pawar',
        vehicleNumber: 'MH-12-RN-8812'
      }
    ];
  }, [acceptedBids, lots, activeCropName, initialData]);

  const [deals, setDeals] = useState<EscrowMilestoneState[]>(defaultDeals);
  const [activeDealId, setActiveDealId] = useState<number>(selectedOrderId || defaultDeals[0]?.escrowId || 101);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    setDeals(defaultDeals);
    if (!deals.some(d => d.escrowId === activeDealId)) {
      setActiveDealId(defaultDeals[0]?.escrowId || 101);
    }
  }, [defaultDeals]);

  useEffect(() => {
    if (selectedOrderId) {
      setActiveDealId(selectedOrderId);
    }
  }, [selectedOrderId]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 5000);
  };

  // Currently selected active deal
  const currentDeal = useMemo(() => {
    return deals.find(d => d.escrowId === activeDealId) || deals[0] || defaultDeals[0];
  }, [deals, activeDealId, defaultDeals]);

  // Simulate Driver verifying code at farmgate for CURRENT order
  const handleSimulateDriverPickup = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetch(`${API_BASE_URL}/api/escrow/advance-freight/${currentDeal.escrowId}`, { method: 'POST' }).catch(() => {}),
        fetch(`${API_BASE_URL}/api/escrow/verify-pickup/${currentDeal.escrowId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ otp: currentDeal.pickupOtp })
        }).catch(() => {})
      ]);
    } catch {}

    setDeals(prev => prev.map(d => {
      if (d.escrowId === currentDeal.escrowId) {
        return {
          ...d,
          status: 'IN_TRANSIT',
          isPickupVerified: true
        };
      }
      return d;
    }));

    triggerToast(`🚚 Order #${currentDeal.escrowId} Loaded! Driver entered ${currentDeal.pickupOtp}. Diesel advance paid. Truck moving to buyer.`);
    setLoading(false);
  };

  // Simulate Buyer confirming weighbridge inward at destination for CURRENT order
  const handleSimulateBuyerSettlement = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/api/escrow/settle/${currentDeal.escrowId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_otp: currentDeal.deliveryOtp, quality_inspection_pass: true })
      }).catch(() => {});
    } catch {}

    setDeals(prev => prev.map(d => {
      if (d.escrowId === currentDeal.escrowId) {
        return {
          ...d,
          status: 'SETTLED',
          isDeliveryVerified: true
        };
      }
      return d;
    }));

    triggerToast(`🎉 Full Payment Done for Order #${currentDeal.escrowId}! ₹${currentDeal.farmerPayout.toLocaleString('en-IN')} deposited into your SBI Bank Account.`);
    setLoading(false);
  };

  const fuelAdvanceAmount = Math.round(currentDeal.freightCost * 0.3) || 1425;

  return (
    <div id="payment-tracker" className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      
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
                {deals.length} Active {deals.length === 1 ? 'Order' : 'Orders'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              100% Safe Payment in Bank • Money directly deposited into your bank account
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto bg-emerald-50/80 border border-emerald-200/80 px-4 py-2 rounded-2xl">
          <div className="text-right">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 block">Current Order Locked</span>
            <strong className="text-emerald-900 font-mono font-black text-base">
              ₹{currentDeal.totalDeposit.toLocaleString('en-IN')}
            </strong>
          </div>
        </div>
      </div>

      {/* MULTI-ORDER SELECTOR BAR (When 2 or more accepted orders exist) */}
      {deals.length > 1 && (
        <div className="bg-slate-50/90 p-3 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers size={14} className="text-emerald-700" />
              <span>Select Order to Track ({deals.length} Active Orders):</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Click any order below to view its live status</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
            {deals.map((deal) => {
              const isSelected = activeDealId === deal.escrowId;
              const isDone = deal.status === 'SETTLED';
              const isInTransit = deal.status === 'IN_TRANSIT';

              return (
                <button
                  key={`deal-selector-${deal.escrowId}`}
                  type="button"
                  onClick={() => {
                    setActiveDealId(deal.escrowId);
                    if (onSelectOrder) onSelectOrder(deal.escrowId);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-md shadow-emerald-900/20 ring-2 ring-emerald-500 scale-[1.01]'
                      : 'bg-white hover:bg-slate-100/90 text-slate-800 border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-black font-mono px-2 py-0.5 rounded-lg ${
                      isSelected ? 'bg-emerald-950/80 text-emerald-200' : 'bg-slate-100 text-slate-700'
                    }`}>
                      Order #{deal.escrowId}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isDone 
                        ? 'bg-emerald-100 text-emerald-900' 
                        : isInTransit 
                        ? (isSelected ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-900')
                        : (isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-100 text-emerald-900')
                    }`}>
                      {isDone ? '✓ Payment Done' : isInTransit ? '🚚 On the Way' : '🔒 Money in Bank'}
                    </span>
                  </div>

                  <div>
                    <strong className={`text-xs font-bold block truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {deal.cropName}
                    </strong>
                    <div className="flex items-center justify-between text-[11px] font-mono mt-1">
                      <span className={isSelected ? 'text-emerald-200' : 'text-slate-500'}>Total:</span>
                      <strong className={isSelected ? 'text-white font-black' : 'text-emerald-900 font-black'}>
                        ₹{deal.totalDeposit.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

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

      {/* 4-Step Milestone Progress Bar for Currently Selected Deal */}
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
            ₹{currentDeal.totalDeposit.toLocaleString('en-IN')} locked in bank
          </p>
        </div>

        {/* Step 2: Driver Fuel Advance */}
        <div className={`p-4 rounded-2xl border transition-all ${
          ['IN_TRANSIT', 'SETTLED'].includes(currentDeal.status)
            ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-400'
            : 'border-slate-200 bg-slate-50/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center ${
              ['IN_TRANSIT', 'SETTLED'].includes(currentDeal.status) ? 'bg-emerald-600' : 'bg-amber-600'
            }`}>
              2
            </span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border font-mono ${
              ['IN_TRANSIT', 'SETTLED'].includes(currentDeal.status)
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
          currentDeal.status === 'IN_TRANSIT'
            ? 'border-purple-500 bg-purple-50/80 shadow-xs ring-2 ring-purple-400'
            : currentDeal.status === 'SETTLED'
            ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-400'
            : 'border-slate-200 bg-slate-50/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center ${
              currentDeal.status === 'SETTLED' ? 'bg-emerald-600' : 'bg-purple-600'
            }`}>
              3
            </span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border font-mono ${
              currentDeal.status === 'SETTLED'
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
            Status: {currentDeal.isPickupVerified ? <strong className="text-emerald-700">Truck Moving to Market</strong> : 'Give Code to Driver'}
          </p>
        </div>

        {/* Step 4: Final Payment to Your Bank */}
        <div className={`p-4 rounded-2xl border transition-all ${
          currentDeal.status === 'SETTLED'
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
            ₹{currentDeal.farmerPayout.toLocaleString('en-IN')} deposited in your bank
          </p>
        </div>

      </div>

      {/* Detailed Action & Status Cards for Currently Selected Deal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Panel 1: Truck Pickup at Your Farm */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Truck size={16} className="text-emerald-700" />
                <span>🚚 Truck Pickup for {currentDeal.cropName}</span>
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Driver: {currentDeal.driverName || 'Vikram Shinde'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When the truck arrives at your farm to load your {currentDeal.cropName}, tell this 4-digit code to driver <strong>{currentDeal.driverName || 'Vikram Shinde'}</strong>. Once the driver enters the code, his ₹{fuelAdvanceAmount.toLocaleString('en-IN')} diesel advance is sent automatically and the truck starts moving.
            </p>
          </div>

          {!currentDeal.isPickupVerified ? (
            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-2xl border-2 border-emerald-300 shadow-sm gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-slate-900 block">Your 4-Digit Pickup Code (Order #{currentDeal.escrowId}):</span>
                  <span className="text-[11px] text-slate-500">Tell this code to driver {currentDeal.driverName || 'Vikram Shinde'} after bags are loaded</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black font-mono text-emerald-950 bg-emerald-100/90 px-4 py-2 rounded-xl border border-emerald-300 shadow-xs tracking-widest">
                    {currentDeal.pickupOtp}
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
                  ⚡ [Demo: Simulate driver typing {currentDeal.pickupOtp}]
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-100/90 border border-emerald-300 rounded-2xl text-xs text-emerald-950 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 font-black text-sm">
                <CheckCircle2 size={17} className="text-emerald-700 shrink-0" />
                <span>{currentDeal.cropName} Loaded &amp; In Transit!</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Driver {currentDeal.driverName || 'Vikram Shinde'} entered code <strong>{currentDeal.pickupOtp}</strong>. Produce is on vehicle ({currentDeal.vehicleNumber || 'MH-15-EG-4421'}) moving to buyer. Driver received ₹{fuelAdvanceAmount.toLocaleString('en-IN')} diesel money.
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
                <span>🏢 Delivery &amp; Bank Payment (Order #{currentDeal.escrowId})</span>
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 truncate max-w-[150px]">
                Buyer: {currentDeal.buyerName}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When the truck reaches the buyer's warehouse, they weigh your bags and check the quality. Once accepted, your total payment will transfer automatically directly into your bank account. You do not need to do anything.
            </p>
          </div>

          {!currentDeal.isDeliveryVerified ? (
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
                    ₹{currentDeal.farmerPayout.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  <Clock size={13} className="shrink-0 text-amber-600" />
                  <span>Truck is on the way • Money will auto-deposit once delivered</span>
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
                  ⚡ [Demo: Simulate buyer accepting Order #{currentDeal.escrowId}]
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
                Full amount of <strong>₹{currentDeal.farmerPayout.toLocaleString('en-IN')}</strong> has been deposited directly into your SBI Account (••••••••4012). Bank Ref #SBIN2026082599182.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-900 pt-1">
                <ReceiptText size={14} className="text-emerald-700" />
                <span>Official Bill &amp; Payment Receipt Saved</span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default EscrowTracker;
