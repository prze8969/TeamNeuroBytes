'use client';

import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Truck, 
  KeyRound, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  RefreshCw, 
  ArrowRight,
  ShieldCheck,
  Fuel,
  Scale,
  Sparkles,
  Download,
  Building2,
  PhoneCall,
  MapPin,
  Clock,
  Store,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export interface EscrowVaultData {
  id: number;
  bid_id?: number;
  lot_id?: number;
  crop_name?: string;
  variety?: string;
  farmer_name?: string;
  farmer_district?: string;
  total_locked_amount: number;
  crop_total_amount: number;
  total_freight_cost: number;
  advance_freight_amount: number;
  advance_freight_disbursed: number;
  balance_freight_amount: number;
  farmer_payout_amount: number;
  platform_fee_inr: number;
  current_milestone: 'LOCKED' | 'FREIGHT_ADVANCE_PAID' | 'IN_TRANSIT' | 'SETTLED' | 'DISPUTED' | 'DECLINED';
  status: string;
  farm_gate_otp?: string;
  destination_delivery_otp?: string;
  carrier_name?: string;
  vehicle_number?: string;
  tax_invoice_number?: string;
  dispute_reason?: string | null;
}

export interface EscrowRailsProps {
  initialVault?: EscrowVaultData;
  onOpenWeighbridge?: () => void;
  onRefresh?: () => void;
  onReturnToMarketplace?: () => void;
  onVaultUpdate?: (updatedVault: EscrowVaultData) => void;
}

export function EscrowRails({
  initialVault,
  onOpenWeighbridge,
  onRefresh,
  onReturnToMarketplace,
  onVaultUpdate
}: EscrowRailsProps) {
  // Default interactive demo vault state with Lazy Initializer
  const [vault, setVault] = useState<EscrowVaultData>(() => {
    if (initialVault) return initialVault;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kisansetu_active_vault');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {
      id: 1,
      bid_id: 101,
      lot_id: 1,
      crop_name: 'Sharbati Wheat (Lok-1)',
      variety: 'Lok-1 Clean Grain',
      farmer_name: 'Ramesh Patil',
      farmer_district: 'Nashik Cluster, Maharashtra',
      total_locked_amount: 130338,
      crop_total_amount: 122500,
      total_freight_cost: 6000,
      advance_freight_amount: 1800,
      advance_freight_disbursed: 0,
      balance_freight_amount: 4200,
      farmer_payout_amount: 122500,
      platform_fee_inr: 1838,
      current_milestone: 'LOCKED',
      status: 'FUNDS_LOCKED',
      farm_gate_otp: '4821',
      destination_delivery_otp: '7394',
      carrier_name: 'Kisan Express Logistics',
      vehicle_number: 'MH-15-EG-4421',
      tax_invoice_number: undefined,
      dispute_reason: null
    };
  });

  const [isFarmerAccepted, setIsFarmerAccepted] = useState<boolean>(() => {
    const v = initialVault || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('kisansetu_active_vault') || '{}') : {});
    return v?.current_milestone === 'FREIGHT_ADVANCE_PAID' || 
           v?.current_milestone === 'IN_TRANSIT' || 
           v?.current_milestone === 'SETTLED';
  });

  const [isArrivedAtMandi, setIsArrivedAtMandi] = useState<boolean>(() => {
    const v = initialVault || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('kisansetu_active_vault') || '{}') : {});
    return v?.status === 'ARRIVED_AT_MANDI' || v?.current_milestone === 'SETTLED';
  });

  const [isDeclined, setIsDeclined] = useState<boolean>(() => {
    const v = initialVault || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('kisansetu_active_vault') || '{}') : {});
    return v?.current_milestone === 'DECLINED' || v?.status === 'REFUNDED';
  });

  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [destinationOtp, setDestinationOtp] = useState<string>('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [isDisbursingFuel, setIsDisbursingFuel] = useState<boolean>(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState<boolean>(false);
  const [disputeReason, setDisputeReason] = useState<string>('Quality / Blemish Grade Mismatch');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync initialVault updates into local state with strict primitive dependency guard
  useEffect(() => {
    if (initialVault) {
      setVault(prev => {
        if (
          prev.id === initialVault.id &&
          prev.current_milestone === initialVault.current_milestone &&
          prev.status === initialVault.status &&
          prev.total_locked_amount === initialVault.total_locked_amount &&
          prev.advance_freight_disbursed === initialVault.advance_freight_disbursed
        ) {
          return prev;
        }
        return initialVault;
      });

      setIsFarmerAccepted(
        initialVault.current_milestone === 'FREIGHT_ADVANCE_PAID' || 
        initialVault.current_milestone === 'IN_TRANSIT' || 
        initialVault.current_milestone === 'SETTLED'
      );
      setIsArrivedAtMandi(
        initialVault.status === 'ARRIVED_AT_MANDI' || 
        initialVault.current_milestone === 'SETTLED'
      );
      setIsDeclined(
        initialVault.current_milestone === 'DECLINED' || 
        initialVault.status === 'REFUNDED'
      );
    }
  }, [
    initialVault?.id,
    initialVault?.current_milestone,
    initialVault?.status,
    initialVault?.total_locked_amount,
    initialVault?.advance_freight_disbursed
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Milestone Progress Calculation (1 to 4)
  const getMilestoneStep = () => {
    switch (vault.current_milestone) {
      case 'LOCKED':
        return 1;
      case 'FREIGHT_ADVANCE_PAID':
        return 2;
      case 'IN_TRANSIT':
        return 3;
      case 'SETTLED':
        return 4;
      case 'DISPUTED':
        return 0; // Dispute state
      case 'DECLINED':
        return 0; // Declined state
      default:
        return 1;
    }
  };

  const syncCarrierTripsFromVault = (v: EscrowVaultData) => {
    try {
      const savedTripsStr = localStorage.getItem('kisansetu_carrier_trips');
      let trips: any[] = savedTripsStr ? JSON.parse(savedTripsStr) : [];
      const isAdvanceDisbursed = (v.advance_freight_disbursed || 0) > 0 || v.current_milestone === 'FREIGHT_ADVANCE_PAID' || v.current_milestone === 'IN_TRANSIT' || v.current_milestone === 'SETTLED';
      const tripIndex = trips.findIndex(t => t.id === v.id || t.lot_id === `LOT-${v.lot_id}`);
      
      const tripData = {
        id: v.id,
        lot_id: `LOT-${v.lot_id || 1}`,
        crop_name: v.crop_name || 'Sharbati Wheat',
        farmer_name: v.farmer_name || 'Ramesh Patil',
        farmer_phone: '+91 98221 48210',
        origin_mandi: v.farmer_district || 'Nashik East Cluster',
        destination_mandi: 'Vashi APMC Mandi Terminal (Navi Mumbai)',
        quantity_tons: 5.0,
        quantity_kg: 5000,
        total_freight_inr: v.total_freight_cost || 6000.0,
        advance_freight_inr: v.advance_freight_amount || 1800.0,
        advance_claimed: isAdvanceDisbursed,
        advance_utr: isAdvanceDisbursed ? 'UTR-ICICI-ADV-894210' : null,
        balance_freight_inr: (v.total_freight_cost || 6000.0) - (v.advance_freight_amount || 1800.0),
        driver_name: 'Suresh Rathod',
        driver_phone: '+91 98231 49821',
        vehicle_number: v.vehicle_number || 'MH-15-EG-4421',
        eway_bill_number: 'EWB-2026-98412',
        farm_gate_otp: v.farm_gate_otp || '4821',
        current_milestone: v.current_milestone,
        status: v.status === 'ARRIVED_AT_MANDI' ? 'ARRIVED_AT_MANDI' : v.current_milestone === 'IN_TRANSIT' ? 'IN_TRANSIT' : isAdvanceDisbursed ? 'ADVANCE_PAID' : 'ASSIGNED',
        current_lat: 19.4285,
        current_lng: 73.2941,
        temperature_c: 14.2,
        humidity_rh: 68.0,
        created_at: new Date().toISOString()
      };

      if (tripIndex >= 0) {
        trips[tripIndex] = { ...trips[tripIndex], ...tripData };
      } else {
        trips = [tripData, ...trips];
      }
      localStorage.setItem('kisansetu_carrier_trips', JSON.stringify(trips));
    } catch {}
  };

  const updateVaultState = (updater: (prev: EscrowVaultData) => EscrowVaultData) => {
    setVault(prev => {
      const next = updater(prev);
      if (onVaultUpdate) {
        onVaultUpdate(next);
      }
      return next;
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem('kisansetu_active_vault', JSON.stringify(vault));
      syncCarrierTripsFromVault(vault);
    } catch {}
  }, [vault]);

  const currentStep = getMilestoneStep();
  const isDisputed = vault.current_milestone === 'DISPUTED';

  // API Action Handlers
  const handleAdvanceFreight = async () => {
    setLoadingAction('advance');
    try {
      const res = await fetch(`http://localhost:8000/api/escrow/${vault.id}/advance-freight`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        updateVaultState(prev => ({
          ...prev,
          current_milestone: 'FREIGHT_ADVANCE_PAID',
          status: 'ADVANCE_DISBURSED',
          advance_freight_disbursed: prev.advance_freight_amount || 1800
        }));
        showToast(data.message || '⚡ 30% Fuel Advance Disbursed to Carrier!');
      } else {
        // Optimistic fallback
        updateVaultState(prev => ({
          ...prev,
          current_milestone: 'FREIGHT_ADVANCE_PAID',
          status: 'ADVANCE_DISBURSED',
          advance_freight_disbursed: prev.advance_freight_amount || 1800
        }));
        showToast('⚡ 30% Fuel Advance Disbursed to Kisan Express Logistics!');
      }
    } catch {
      updateVaultState(prev => ({
        ...prev,
        current_milestone: 'FREIGHT_ADVANCE_PAID',
        status: 'ADVANCE_DISBURSED',
        advance_freight_disbursed: prev.advance_freight_amount || 1800
      }));
      showToast('⚡ 30% Fuel Advance Disbursed to Kisan Express Logistics!');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleVerifyOtp = async () => {
    setLoadingAction('otp');
    try {
      const res = await fetch(`http://localhost:8000/api/escrow/${vault.id}/verify-pickup-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: vault.farm_gate_otp || '4821' })
      });
      if (res.ok) {
        const data = await res.json();
        updateVaultState(prev => ({
          ...prev,
          current_milestone: 'IN_TRANSIT',
          status: 'IN_TRANSIT'
        }));
        showToast(data.message || '🔑 Farmgate OTP 4821 Verified! Produce is now IN_TRANSIT.');
      } else {
        updateVaultState(prev => ({
          ...prev,
          current_milestone: 'IN_TRANSIT',
          status: 'IN_TRANSIT'
        }));
        showToast('🔑 Farmgate OTP 4821 Verified! Produce is now IN_TRANSIT with live GPS.');
      }
      toast.success('🔑 Farm-Gate OTP Verified', {
        description: 'Produce loaded onto truck MH-15-EG-4421. Vehicle is now en route on NH-160 with live GPS broadcast.',
        duration: 5000,
      });
    } catch {
      updateVaultState(prev => ({
        ...prev,
        current_milestone: 'IN_TRANSIT',
        status: 'IN_TRANSIT'
      }));
      showToast('🔑 Farmgate OTP 4821 Verified! Produce is now IN_TRANSIT with live GPS.');
      toast.success('🔑 Farm-Gate OTP Verified', {
        description: 'Produce loaded onto truck MH-15-EG-4421. Vehicle is now en route on NH-160 with live GPS broadcast.',
        duration: 5000,
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSettle = async () => {
    setLoadingAction('settle');
    const invNum = `INV-KS-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      const res = await fetch(`http://localhost:8000/api/escrow/${vault.id}/complete-settlement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delivery_otp: vault.destination_delivery_otp || '7394',
          weighbridge_receipt_url: 'https://kisansetu.in/docs/receipts/WB-2026-APMC-942.pdf',
          quality_inspection_pass: true
        })
      });
      if (res.ok) {
        const data = await res.json();
        updateVaultState(prev => ({
          ...prev,
          current_milestone: 'SETTLED',
          status: 'SETTLED',
          tax_invoice_number: data.tax_invoice_number || invNum
        }));
        showToast(data.message || `🎉 100% Escrow Settled! Tax Invoice ${invNum} generated.`);
      } else {
        updateVaultState(prev => ({
          ...prev,
          current_milestone: 'SETTLED',
          status: 'SETTLED',
          tax_invoice_number: invNum
        }));
        showToast(`🎉 100% Escrow Settled! Tax Invoice ${invNum} generated.`);
      }
      toast.success('⚖️ Weighbridge Verified — 100% Escrow Settled', {
        description: `₹${vault.crop_total_amount.toLocaleString('en-IN')} credited to ${vault.farmer_name} via DBT. Tax Invoice ${invNum} ready for download.`,
        duration: 6000,
      });
    } catch {
      updateVaultState(prev => ({
        ...prev,
        current_milestone: 'SETTLED',
        status: 'SETTLED',
        tax_invoice_number: invNum
      }));
      showToast(`🎉 100% Escrow Settled! Tax Invoice ${invNum} generated.`);
      toast.success('⚖️ Weighbridge Verified — 100% Escrow Settled', {
        description: `₹${vault.crop_total_amount.toLocaleString('en-IN')} credited to ${vault.farmer_name} via DBT. Tax Invoice ${invNum} ready for download.`,
        duration: 6000,
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDispute = async () => {
    setLoadingAction('dispute');
    try {
      await fetch(`http://localhost:8000/api/escrow/${vault.id}/raise-dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 2,
          category: 'QUALITY_MISMATCH',
          subject: 'Produce Rotten / Weight Mismatch',
          description: 'Substantial quality deterioration and broken produce detected upon gate arrival.'
        })
      });
      updateVaultState(prev => ({
        ...prev,
        current_milestone: 'DISPUTED',
        status: 'DISPUTED',
        dispute_reason: 'Quality Inspection Failed: Rotten produce & weight shortage detected.'
      }));
      showToast('🚨 Escrow Vault FROZEN! Grievance logged with APMC Nodal Officer for arbitration.');
      toast.error('🚨 Escrow Frozen — Arbitration Pending', {
        description: 'Arbitration ticket #ARB-2026-9841 submitted to Vashi APMC Grievance Cell Bench #3.',
        duration: 6000,
      });
    } catch {
      updateVaultState(prev => ({
        ...prev,
        current_milestone: 'DISPUTED',
        status: 'DISPUTED',
        dispute_reason: 'Quality Inspection Failed: Rotten produce & weight shortage detected.'
      }));
      showToast('🚨 Escrow Vault FROZEN! Grievance logged with APMC Nodal Officer for arbitration.');
      toast.error('🚨 Escrow Frozen — Arbitration Pending', {
        description: 'Arbitration ticket #ARB-2026-9841 submitted to Vashi APMC Grievance Cell Bench #3.',
        duration: 6000,
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeclineTender = () => {
    setIsDeclined(true);
    setIsFarmerAccepted(false);
    updateVaultState(prev => ({
      ...prev,
      current_milestone: 'DECLINED',
      status: 'REFUNDED'
    }));
    toast.info('💸 Escrow Capital 100% Refunded', {
      description: `₹${vault.total_locked_amount.toLocaleString('en-IN')} returned to your Virtual Escrow Account with ₹0 deductions.`,
      duration: 6000,
    });
    showToast(`❌ Tender declined by ${vault.farmer_name || 'farmer'}. ₹${vault.total_locked_amount.toLocaleString('en-IN')} refunded to your account.`);
  };

  const handleReset = async () => {
    setLoadingAction('reset');
    setIsFarmerAccepted(false);
    setIsArrivedAtMandi(false);
    setIsDeclined(false);
    try {
      await fetch(`http://localhost:8000/api/escrow/${vault.id}/reset-demo`, { method: 'POST' });
      updateVaultState(prev => ({
        ...prev,
        current_milestone: 'LOCKED',
        status: 'FUNDS_LOCKED',
        advance_freight_disbursed: 0,
        tax_invoice_number: undefined,
        dispute_reason: null
      }));
      showToast('🔄 Escrow Vault reset to Milestone 1 (Awaiting Farmer Acceptance).');
    } catch {
      updateVaultState(prev => ({
        ...prev,
        current_milestone: 'LOCKED',
        status: 'FUNDS_LOCKED',
        advance_freight_disbursed: 0,
        tax_invoice_number: undefined,
        dispute_reason: null
      }));
      showToast('🔄 Escrow Vault reset to Milestone 1 (Awaiting Farmer Acceptance).');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDownloadInvoice = () => {
    const inv = vault.tax_invoice_number || 'INV-KS-20260824-8942';
    const invoiceContent = `
=====================================================
          KISANSETU AGRI-MARKETPLACE
      OFFICIAL GST-COMPLIANT TAX INVOICE
=====================================================
Invoice Number : ${inv}
Date & Time    : ${new Date().toLocaleString('en-IN')}
APMC Mandi     : Vashi APMC Terminal, Navi Mumbai
HSN Code       : 1001 (Wheat) / 0702 (Tomato)

BUYER DETAILS:
Business Name  : AgroProcure Private Ltd
GSTIN          : 27AABCA1234F1Z5
APMC License   : APMC-MH-NSK-2024-892

FARMER / SELLER:
Name           : ${vault.farmer_name || 'Ramesh Patil'}
Origin         : ${vault.farmer_district || 'Nashik, Maharashtra'}

TRANSPORTER:
Fleet Carrier  : ${vault.carrier_name || 'Kisan Express Logistics'}
Vehicle Number : ${vault.vehicle_number || 'MH-15-EG-8942'}

-----------------------------------------------------
FINANCIAL DISBURSEMENT BREAKDOWN (INR):
-----------------------------------------------------
1. 100% Farmer Crop Payment (DBT)  : ₹${vault.farmer_payout_amount.toLocaleString('en-IN')}
2. 30% Advance Transit & Fuel Paid : ₹${vault.advance_freight_amount.toLocaleString('en-IN')}
3. 70% Final Transit Settlement    : ₹${vault.balance_freight_amount.toLocaleString('en-IN')}
4. 1.5% APMC Mandi Cess & Duty     : ₹${vault.platform_fee_inr.toLocaleString('en-IN')}
-----------------------------------------------------
TOTAL ESCROW SETTLED VALUE         : ₹${vault.total_locked_amount.toLocaleString('en-IN')}
=====================================================
Status: 100% PAID VIA ESCROW VAULT | WEIGHBRIDGE PASS VERIFIED
=====================================================
    `;
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`📄 Tax Invoice ${inv} downloaded successfully!`);
  };

  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-5 sm:p-6 space-y-6 shadow-sm text-slate-900">
      
      {/* ========================================================================= */}
      {/* TOP HEADER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Live Milestone Escrow Rails
            </h3>
            <span className="text-[11px] font-mono font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Vault #{vault.id}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {vault.crop_name || 'Crop Lot'} • Farmer: <strong className="text-slate-800">{vault.farmer_name}</strong> ({vault.farmer_district})
          </p>
        </div>

        {/* Status Tag & Total Value */}
        <div className="flex items-center gap-2">
          {isDisputed ? (
            <span className="px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-800 border border-red-200 flex items-center gap-1.5 animate-pulse">
              <AlertTriangle size={14} className="text-red-600" />
              ESCROW FUNDS FROZEN
            </span>
          ) : currentStep === 4 ? (
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              100% SETTLED & PAID
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-blue-600" />
              BANK ESCROW ACTIVE (₹{vault.total_locked_amount.toLocaleString('en-IN')})
            </span>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-bold text-emerald-950 flex justify-between items-center animate-in fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 font-bold ml-3">✕</button>
        </div>
      )}

      {/* Dispute Alert Banner */}
      {isDisputed && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs space-y-1 text-red-950 animate-in fade-in">
          <div className="flex items-center gap-2 font-black text-red-800 text-sm">
            <AlertTriangle size={16} className="text-red-600" />
            <span>DISPUTE ARBITRATION TICKET #GRV-2026-8942 OPENED</span>
          </div>
          <p className="text-red-800">
            {vault.dispute_reason || 'Produce rot and quality degradation reported. All disbursements are cryptographically held.'}
          </p>
          <p className="text-[11px] text-red-700 font-mono">
            Assigned Arbitrator: APMC Nodal Dispute Officer (Nashik Terminal)
          </p>
        </div>
      )}

      {/* Tender Declined & 100% Refund Banner */}
      {isDeclined && (
        <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 animate-in zoom-in-95 text-xs shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold shrink-0">
                <X size={18} />
              </div>
              <div>
                <strong className="text-sm font-black text-white block">
                  Tender Offer Declined by {vault.farmer_name || 'Farmer'}
                </strong>
                <span className="text-[11px] text-emerald-400 font-mono font-bold">
                  ✓ 100% Escrow Capital (₹{vault.total_locked_amount.toLocaleString('en-IN')}) Refunded Instantly
                </span>
              </div>
            </div>

            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 w-max">
              ₹0 Platform Fee Deducted
            </span>
          </div>

          <p className="text-slate-300 leading-relaxed text-xs">
            Farmer <strong>{vault.farmer_name || 'Ramesh Patil'}</strong> opted not to accept this tender offer. Your earnest escrow capital of <strong>₹{vault.total_locked_amount.toLocaleString('en-IN')}</strong> has been 100% unlocked and refunded instantly to your Virtual Escrow Account.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {onReturnToMarketplace && (
              <Button
                type="button"
                size="sm"
                onClick={onReturnToMarketplace}
                className="h-9 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Store size={13} />
                <span>Browse Marketplace &amp; Place New Bid</span>
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-9 px-3.5 rounded-xl font-bold text-xs border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              <RefreshCw size={12} className="mr-1.5" />
              <span>Reset Simulation</span>
            </Button>
          </div>
        </div>
      )}

      {/* Farmer Tender Acceptance Banner (Handshake Step) */}
      {!isFarmerAccepted && !isDeclined && currentStep === 1 && !isDisputed && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-200 text-xs space-y-2.5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
              <span className="font-extrabold text-amber-950 text-sm flex items-center gap-1.5">
                <Clock size={15} className="text-amber-700" />
                Awaiting Farmer Tender Acceptance
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300 w-max">
              WhatsApp Notification Sent • 2h Tender Window
            </span>
          </div>

          <p className="text-amber-900 leading-relaxed">
            Your bid is locked in the ICICI Escrow Vault. An instant tender alert was dispatched to <strong>{vault.farmer_name} (+91 98231 49821)</strong>. Advance freight will only unlock once the farmer confirms tender.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setIsFarmerAccepted(true);
                showToast(`🌾 ${vault.farmer_name} accepted your tender via WhatsApp! Carrier Kisan Express Logistics assigned.`);
              }}
              className="h-8 px-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 size={13} />
              <span>🌾 1. Simulate Farmer Accepts (WhatsApp)</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDeclineTender}
              className="h-8 px-3 rounded-xl font-bold text-xs border-amber-300 text-amber-900 hover:bg-amber-100 cursor-pointer"
            >
              <span>❌ Simulate Decline (Instant Refund)</span>
            </Button>
          </div>
        </div>
      )}

      {/* Confirmed Farmer Acceptance Badge */}
      {isFarmerAccepted && currentStep === 1 && !isDisputed && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-950 font-bold">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>Tender Accepted by {vault.farmer_name}! Vehicle {vault.vehicle_number || 'MH-15-EG-8942'} assigned for farm-gate dispatch.</span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 w-max">
            Proceed to Step 2 (Advance Freight)
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4-STAGE HORIZONTAL MILESTONE TRACKER */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        
        {/* Step 1: 100% Escrow Locked */}
        <div className={`p-4 rounded-2xl border transition-all space-y-2 relative ${
          currentStep >= 1 && !isDisputed
            ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/20'
            : isDisputed ? 'bg-red-50/60 border-red-200' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              Stage 1
            </span>
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Lock size={13} />
            </div>
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">100% Escrow Locked</h4>
            <p className="text-xs text-slate-500 font-mono pt-0.5">
              ₹{vault.total_locked_amount.toLocaleString('en-IN')} locked
            </p>
          </div>
          <div className="pt-1 border-t border-emerald-100 text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
            <ShieldCheck size={12} />
            <span>ICICI Nodal Escrow Vault</span>
          </div>
        </div>

        {/* Step 2: 30% Freight Advance */}
        <div className={`p-4 rounded-2xl border transition-all space-y-2 relative ${
          currentStep >= 2 && !isDisputed
            ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/20'
            : currentStep === 1 && !isDisputed
            ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-300/30'
            : isDisputed ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
              currentStep >= 2 ? 'text-emerald-800 bg-emerald-100' : 'text-blue-800 bg-blue-100'
            }`}>
              Stage 2
            </span>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              currentStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
            }`}>
              <Fuel size={13} />
            </div>
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">30% Fuel Advance</h4>
            <p className="text-xs text-slate-500 font-mono pt-0.5">
              ₹{vault.advance_freight_amount.toLocaleString('en-IN')} (30% transit fee)
            </p>
          </div>
          <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-600 truncate font-semibold flex items-center gap-1">
            <Truck size={12} className="text-purple-600 shrink-0" />
            <span>{vault.carrier_name || 'Kisan Express'}</span>
          </div>
        </div>

        {/* Step 3: Farm-Gate Pickup Handshake */}
        <div className={`p-4 rounded-2xl border transition-all space-y-2 relative ${
          currentStep >= 3 && !isDisputed
            ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/20'
            : currentStep === 2 && !isDisputed
            ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-300/30'
            : isDisputed ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
              currentStep >= 3 ? 'text-emerald-800 bg-emerald-100' : 'text-slate-600 bg-slate-200'
            }`}>
              Stage 3
            </span>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              currentStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
            }`}>
              <KeyRound size={13} />
            </div>
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Farmgate Pickup OTP</h4>
            <p className="text-xs text-slate-500 font-mono pt-0.5">
              {currentStep >= 3 ? 'OTP: 4821 Verified' : 'OTP: **** Pending Handshake'}
            </p>
          </div>
          <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-600 font-semibold flex items-center gap-1">
            <MapPin size={12} className="text-emerald-600 shrink-0" />
            <span>{currentStep >= 3 ? 'In Transit (Live GPS)' : 'Farmgate Handshake'}</span>
          </div>
        </div>

        {/* Step 4: Weighbridge & 100% Settlement */}
        <div className={`p-4 rounded-2xl border transition-all space-y-2 relative ${
          currentStep >= 4 && !isDisputed
            ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/20'
            : currentStep === 3 && isArrivedAtMandi && !isDisputed
            ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/20 animate-pulse'
            : currentStep === 3 && !isDisputed
            ? 'bg-blue-50/50 border-blue-200'
            : isDisputed ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
              currentStep >= 4 || (currentStep === 3 && isArrivedAtMandi) ? 'text-emerald-800 bg-emerald-100' : 'text-slate-600 bg-slate-200'
            }`}>
              Stage 4
            </span>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              currentStep >= 4 || (currentStep === 3 && isArrivedAtMandi) ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
            }`}>
              <Scale size={13} />
            </div>
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Weighbridge Settle</h4>
            <p className="text-xs text-slate-500 font-mono pt-0.5">
              {currentStep >= 4 
                ? '100% Crop + 70% Freight Paid' 
                : isArrivedAtMandi 
                ? '📍 Arrived at Scale #4 (Ready to Settle)' 
                : 'In-Transit on Highway (ETA: 42 mins)'}
            </p>
          </div>
          <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-600 font-semibold flex items-center gap-1">
            <CheckCircle2 size={12} className={currentStep >= 4 || isArrivedAtMandi ? 'text-emerald-600' : 'text-slate-400'} />
            <span>
              {currentStep >= 4 
                ? 'GST Tax Invoice Ready' 
                : isArrivedAtMandi 
                ? 'Weighbridge Pass Unlocked' 
                : 'Pending Mandi Arrival'}
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE ACTION BAR (For Live Demos / Testing) */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} className="text-emerald-600" />
            Interactive Milestone Simulation Controls
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Current: <strong className="text-emerald-700">{vault.current_milestone}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Milestone 2 Action */}
          <Button
            type="button"
            size="sm"
            onClick={handleAdvanceFreight}
            disabled={currentStep !== 1 || !isFarmerAccepted || isDisputed || loadingAction === 'advance'}
            className="h-9 px-3.5 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-700 text-white shadow-xs disabled:opacity-40"
          >
            {loadingAction === 'advance' ? (
              <span className="animate-spin w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full mr-1.5" />
            ) : (
              <Fuel size={13} className="mr-1.5" />
            )}
            ⚡ 2. Disburse 30% Freight Advance
          </Button>

          {/* Milestone 3 Action */}
          <Button
            type="button"
            size="sm"
            onClick={handleVerifyOtp}
            disabled={currentStep !== 2 || isDisputed || loadingAction === 'otp'}
            className="h-9 px-3.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs disabled:opacity-40"
          >
            {loadingAction === 'otp' ? (
              <span className="animate-spin w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full mr-1.5" />
            ) : (
              <KeyRound size={13} className="mr-1.5" />
            )}
            🔑 2. Verify Farmgate OTP (4821)
          </Button>

          {/* Milestone 4 Action */}
          <Button
            type="button"
            size="sm"
            onClick={() => {
              if (onOpenWeighbridge) {
                onOpenWeighbridge();
              } else {
                handleSettle();
              }
            }}
            disabled={currentStep !== 3 || !isArrivedAtMandi || isDisputed || loadingAction === 'settle'}
            className="h-9 px-3.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs disabled:opacity-40"
          >
            {loadingAction === 'settle' ? (
              <span className="animate-spin w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full mr-1.5" />
            ) : (
              <Scale size={13} className="mr-1.5" />
            )}
            {currentStep === 3 && !isArrivedAtMandi ? '⏳ 3. Awaiting Mandi Arrival' : '⚖️ 3. Weighbridge Pass & Settle 100%'}
          </Button>

          {/* Simulate Mandi Arrival Helper Button when In-Transit */}
          {currentStep === 3 && !isArrivedAtMandi && !isDisputed && (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setIsArrivedAtMandi(true);
                showToast('🚛 Vehicle MH-15-EG-4421 arrived at Vashi APMC Terminal Scale #4! Weighbridge settlement is now unlocked.');
              }}
              className="h-9 px-3 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-white shadow-xs animate-in fade-in cursor-pointer flex items-center gap-1"
            >
              <MapPin size={13} />
              <span>📍 Transporter Marks Arrival</span>
            </Button>
          )}

          {/* Dispute Action */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDispute}
            disabled={currentStep === 4 || isDisputed || loadingAction === 'dispute'}
            className="h-9 px-3.5 rounded-xl font-bold text-xs border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-40"
          >
            <AlertTriangle size={13} className="mr-1.5 text-red-600" />
            🚨 Raise Dispute
          </Button>

          {/* Download Tax Invoice (Active when Settled) */}
          {currentStep === 4 && (
            <Button
              type="button"
              size="sm"
              onClick={handleDownloadInvoice}
              className="h-9 px-3.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
            >
              <Download size={13} className="mr-1.5 text-emerald-400" />
              📄 Download Tax Invoice ({vault.tax_invoice_number || 'INV-2026-KS'})
            </Button>
          )}

          {/* Reset Demo Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={loadingAction === 'reset'}
            className="h-9 px-3 rounded-xl font-bold text-xs border-slate-300 text-slate-700 hover:bg-slate-100 ml-auto"
          >
            <RefreshCw size={13} className="mr-1" />
            Reset Demo
          </Button>

        </div>
      </div>

    </div>
  );
}
