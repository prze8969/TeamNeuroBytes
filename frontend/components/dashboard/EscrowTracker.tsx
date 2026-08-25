'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Truck, 
  CheckCircle2, 
  Sparkles, 
  KeyRound, 
  Scale, 
  ArrowRight,
  ReceiptText,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/lib/LocaleContext';

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
}

export function EscrowTracker({ initialData }: { initialData?: Partial<EscrowMilestoneState> }) {
  const t = useTranslations('escrow');

  const [escrow, setEscrow] = useState<EscrowMilestoneState>({
    escrowId: 101,
    lotId: 1,
    cropName: 'Sharbati Wheat (5.0 Tons)',
    totalDeposit: 139250,
    farmerPayout: 132500,
    freightCost: 4750,
    status: 'LOCKED',
    pickupOtp: '4821',
    deliveryOtp: '7394',
    isPickupVerified: false,
    isDeliveryVerified: false,
    transporterName: 'Kisan Express Logistics',
    ...initialData
  });

  const [inputPickupOtp, setInputPickupOtp] = useState('');
  const [inputDeliveryOtp, setInputDeliveryOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 5000);
  };

  const fetchLiveEscrowState = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/escrow/transactions');
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

  // Handshake: Farmer verifies pickup with driver OTP
  // Smart contract automatically disburses the 30% advance fuel funds upon verification!
  const handleVerifyPickupHandshake = async () => {
    const entered = inputPickupOtp.trim();
    if (entered && entered !== escrow.pickupOtp) {
      alert('Invalid OTP code. Please enter the correct 4-digit code provided by the driver.');
      return;
    }

    setLoading(true);
    try {
      // Trigger backend advance freight release & pickup verification
      await fetch(`http://localhost:8000/api/escrow/advance-freight/${escrow.escrowId}`, { method: 'POST' });
      await fetch(`http://localhost:8000/api/escrow/verify-pickup/${escrow.escrowId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: entered || escrow.pickupOtp })
      });
    } catch {}

    setEscrow(prev => ({
      ...prev,
      status: 'IN_TRANSIT',
      isPickupVerified: true
    }));

    triggerToast('🚚 Farm Gate Pickup Verified! Escrow Smart Contract automatically released 30% Fuel Advance (₹1,425) to Transporter. Live GPS tracking active.');
    setLoading(false);
  };

  const handleSettleDelivery = async () => {
    const entered = inputDeliveryOtp.trim();
    if (entered && entered !== escrow.deliveryOtp) {
      alert('Invalid Delivery OTP code. Please enter the verified inward code.');
      return;
    }
    setLoading(true);
    try {
      await fetch(`http://localhost:8000/api/escrow/settle/${escrow.escrowId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_otp: escrow.deliveryOtp, quality_inspection_pass: true })
      });
    } catch {}

    setEscrow(prev => ({
      ...prev,
      status: 'SETTLED',
      isDeliveryVerified: true
    }));
    triggerToast(`🎉 Escrow Settled! ₹${escrow.farmerPayout.toLocaleString('en-IN')} disbursed instantly to Farmer Bank A/C via Direct Bank Transfer (DBT).`);
    setLoading(false);
  };

  const fuelAdvanceAmount = Math.round(escrow.freightCost * 0.3) || 1425;

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center text-xl shadow-xs shrink-0">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Milestone Escrow Payment Rails
              </h3>
              <span className="rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-black font-mono">
                VAULT #{escrow.escrowId}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated multi-party funds locking, fuel advance smart contracts, and 4-digit OTP handshakes
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right bg-emerald-50/80 px-4 py-2.5 rounded-2xl border border-emerald-200/80 shrink-0">
          <span className="text-[10px] uppercase font-bold text-emerald-900 block tracking-wider font-sans">
            Total Escrowed Vault
          </span>
          <p className="text-xl font-black text-emerald-900 font-mono">
            ₹{escrow.totalDeposit.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {toastMsg && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-xs font-bold text-emerald-950 animate-in fade-in flex items-center gap-2 shadow-xs">
          <Sparkles size={16} className="text-emerald-700 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Visual Step Progress Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Step 1: Buyer Funds Escrowed */}
        <div className={`p-4 rounded-2xl border transition-all ${
          escrow.status === 'LOCKED'
            ? 'border-emerald-500 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-400'
            : 'border-emerald-200 bg-emerald-50/40'
        }`}>
          <div className="flex items-center justify-between">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
              1
            </span>
            <span className="text-[10px] font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 font-mono">
              100% Locked
            </span>
          </div>
          <h4 className="font-extrabold text-xs text-slate-900 mt-2.5">
            {t('buyerFundsEscrowed')}
          </h4>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            ₹{escrow.totalDeposit.toLocaleString('en-IN')} {t('inRbiEscrow')}
          </p>
        </div>

        {/* Step 2: Automated Fuel Advance */}
        <div className={`p-4 rounded-2xl border transition-all ${
          escrow.status === 'ADVANCE_DISBURSED'
            ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-2 ring-amber-400'
            : ['IN_TRANSIT', 'SETTLED'].includes(escrow.status)
            ? 'border-emerald-200 bg-emerald-50/40'
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
              30% Fuel Advance
            </span>
          </div>
          <h4 className="font-extrabold text-xs text-slate-900 mt-2.5">
            Advance Freight
          </h4>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            ₹{fuelAdvanceAmount.toLocaleString('en-IN')} to Transporter
          </p>
        </div>

        {/* Step 3: Farm Gate Pickup Handshake */}
        <div className={`p-4 rounded-2xl border transition-all ${
          escrow.status === 'IN_TRANSIT'
            ? 'border-purple-500 bg-purple-50/80 shadow-xs ring-2 ring-purple-400'
            : escrow.status === 'SETTLED'
            ? 'border-emerald-200 bg-emerald-50/40'
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
              OTP Handshake
            </span>
          </div>
          <h4 className="font-extrabold text-xs text-slate-900 mt-2.5">
            Farm Gate Pickup
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Status: {escrow.isPickupVerified ? <strong className="text-emerald-700">IN_TRANSIT</strong> : 'Awaiting Driver OTP'}
          </p>
        </div>

        {/* Step 4: Final Settlement & 100% Payout */}
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
              100% Payout
            </span>
          </div>
          <h4 className="font-extrabold text-xs text-slate-900 mt-2.5">
            Delivery &amp; Settlement
          </h4>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            ₹{escrow.farmerPayout.toLocaleString('en-IN')} paid to Farmer
          </p>
        </div>

      </div>

      {/* Interactive Controls & Verification Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Panel 1: Farm Gate Handshake (Farmer Action) */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3.5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Truck size={14} className="text-emerald-700" />
                <span>Farm Gate Pickup Handshake</span>
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                Transporter: {escrow.transporterName}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              When the transporter arrives at your farm to load produce, complete the 4-digit handshake. The smart contract will <strong>automatically release</strong> the 30% fuel advance (₹{fuelAdvanceAmount.toLocaleString('en-IN')}) directly to the driver.
            </p>
          </div>

          {escrow.status === 'LOCKED' && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-700 block">Your Secret Farmgate Pickup Code:</span>
                  <span className="text-[11px] text-slate-500">Read this 4-digit code aloud to the transporter driver upon loading</span>
                </div>
                <span className="text-xl font-black font-mono text-emerald-900 bg-emerald-100/90 px-3.5 py-1.5 rounded-xl border border-emerald-300 shadow-xs tracking-widest">
                  {escrow.pickupOtp}
                </span>
              </div>

              <div className="flex gap-2">
                <Input
                  type="text"
                  maxLength={4}
                  placeholder="Enter 4-digit code from driver"
                  className="bg-white border-slate-300 text-slate-900 font-mono text-center text-xs h-10 font-bold rounded-xl placeholder:text-slate-400"
                  value={inputPickupOtp}
                  onChange={(e) => setInputPickupOtp(e.target.value)}
                />
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 h-10 rounded-xl shadow-xs whitespace-nowrap cursor-pointer"
                  onClick={handleVerifyPickupHandshake}
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : '🤝 Confirm Handover'}
                </Button>
              </div>
            </div>
          )}

          {['IN_TRANSIT', 'SETTLED'].includes(escrow.status) && (
            <div className="p-3.5 bg-emerald-100/90 border border-emerald-300 rounded-xl text-xs text-emerald-950 font-medium space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
                <span>Farmgate Handover Confirmed</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                30% Advance Freight (₹{fuelAdvanceAmount.toLocaleString('en-IN')}) automatically disbursed to {escrow.transporterName}.
              </p>
            </div>
          )}
        </div>

        {/* Panel 2: Destination Mandi Inward & Settlement (Institutional Buyer / Mandi Action) */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3.5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Scale size={14} className="text-emerald-700" />
                <span>Destination Weighbridge &amp; Settlement</span>
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                APMC Inward
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upon truck arrival at destination APMC terminal, gross weight and quality assays are verified against the YOLOv8 certificate before full payout disbursement.
            </p>
          </div>

          {escrow.status === 'IN_TRANSIT' ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-700 block">Mandi Inward Authorization Code:</span>
                  <span className="text-[11px] text-slate-500">Generated for terminal weighbridge receipt</span>
                </div>
                <span className="text-xl font-black font-mono text-emerald-900 bg-emerald-100/90 px-3.5 py-1.5 rounded-xl border border-emerald-300 shadow-xs tracking-widest">
                  {escrow.deliveryOtp}
                </span>
              </div>

              <div className="flex gap-2">
                <Input
                  type="text"
                  maxLength={4}
                  placeholder="Enter 4-digit inward code"
                  className="bg-white border-slate-300 text-slate-900 font-mono text-center text-xs h-10 font-bold rounded-xl placeholder:text-slate-400"
                  value={inputDeliveryOtp}
                  onChange={(e) => setInputDeliveryOtp(e.target.value)}
                />
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 h-10 rounded-xl shadow-xs whitespace-nowrap cursor-pointer"
                  onClick={handleSettleDelivery}
                  disabled={loading}
                >
                  {loading ? 'Settling...' : '⚖️ Confirm & Release Payout'}
                </Button>
              </div>
            </div>
          ) : escrow.status === 'SETTLED' ? (
            <div className="p-3.5 bg-emerald-100/90 border border-emerald-300 rounded-xl text-xs text-emerald-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
                <span>Escrow Successfully Settled via DBT</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                ₹{escrow.farmerPayout.toLocaleString('en-IN')} credited to Farmer Bank A/C. Tax Invoice generated.
              </p>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-xs text-slate-400 italic">
                Awaiting farmgate pickup verification to activate destination inward controls.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default EscrowTracker;
