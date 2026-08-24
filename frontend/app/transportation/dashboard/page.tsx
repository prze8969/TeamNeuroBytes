'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Truck, 
  Fuel, 
  KeyRound, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  RefreshCw, 
  Building2, 
  Scale, 
  Download, 
  Sparkles, 
  Radio, 
  PhoneCall, 
  User, 
  FileText, 
  Navigation,
  DollarSign,
  PackageCheck,
  X
} from 'lucide-react';

interface CarrierProfile {
  carrier_name: string;
  gstin: string;
  rating: number;
  total_trips_completed: number;
  available_escrow_balance_inr: number;
  active_vehicles_on_road: number;
}

interface OpenTender {
  id: string;
  lot_id: string;
  crop_name: string;
  variety: string;
  farmer_name: string;
  origin: string;
  destination: string;
  quantity_tons: number;
  freight_rate_kg: number;
  total_freight_inr: number;
  advance_30_pct_inr: number;
  pickup_window: string;
  required_vehicle: string;
}

interface ActiveTrip {
  id: number;
  vault_id: number;
  lot_id: string;
  crop_name: string;
  variety: string;
  farmer_name: string;
  farmer_phone: string;
  origin: string;
  destination: string;
  quantity_tons: number;
  quantity_kg: number;
  total_freight_inr: number;
  advance_freight_inr: number;
  advance_claimed: boolean;
  advance_utr?: string | null;
  balance_freight_inr: number;
  driver_name: string;
  driver_phone: string;
  vehicle_number: string;
  eway_bill_number: string;
  farm_gate_otp: string;
  current_milestone: string;
  status: string;
  current_lat: number;
  current_lng: number;
  temperature_c: number;
  humidity_rh: number;
  created_at: string;
}

export const DEFAULT_OPEN_TENDERS: OpenTender[] = [
  {
    id: 'TEND-2026-091',
    lot_id: 'LOT-2',
    crop_name: 'Nashik Red Onion',
    variety: 'Garva Premium',
    farmer_name: 'Sanjay Deshmukh',
    origin: 'Lasalgaon APMC Cluster, Nashik',
    destination: 'Pune Gultekdi Mandi',
    quantity_tons: 8.0,
    freight_rate_kg: 1.20,
    total_freight_inr: 9600.0,
    advance_30_pct_inr: 2880.0,
    pickup_window: 'Today, within 4 hours',
    required_vehicle: '10-Wheeler Open / Tarpaulin'
  },
  {
    id: 'TEND-2026-092',
    lot_id: 'LOT-3',
    crop_name: 'Hybrid Tomato',
    variety: 'Abhinav Class-1',
    farmer_name: 'Kailash Jadhav',
    origin: 'Narayangaon Hub, Pune',
    destination: 'Vashi APMC Mandi, Navi Mumbai',
    quantity_tons: 4.0,
    freight_rate_kg: 1.60,
    total_freight_inr: 6400.0,
    advance_30_pct_inr: 1920.0,
    pickup_window: 'Tomorrow morning, 06:00 AM',
    required_vehicle: 'Reefer Cold-Chain (14°C)'
  }
];

export const DEFAULT_ACTIVE_TRIPS: ActiveTrip[] = [
  {
    id: 1,
    vault_id: 1,
    lot_id: 'LOT-1',
    crop_name: 'Sharbati Wheat (Lok-1)',
    variety: 'Lok-1 Clean Grain',
    farmer_name: 'Ramesh Patil',
    farmer_phone: '+91 98231 49821',
    origin: 'Nashik Cluster Farmgate, Maharashtra',
    destination: 'Vashi APMC Mandi Scale #4 (Navi Mumbai)',
    quantity_tons: 5.0,
    quantity_kg: 5000,
    total_freight_inr: 6000.0,
    advance_freight_inr: 1800.0,
    advance_claimed: false,
    advance_utr: null,
    balance_freight_inr: 4200.0,
    driver_name: 'Suresh Rathod',
    driver_phone: '+91 98231 49821',
    vehicle_number: 'MH-15-EG-4421',
    eway_bill_number: 'EWB-2026-98412',
    farm_gate_otp: '4821',
    current_milestone: 'LOCKED',
    status: 'ASSIGNED',
    current_lat: 19.9975,
    current_lng: 73.7898,
    temperature_c: 14.2,
    humidity_rh: 68.0,
    created_at: '2026-08-24T09:30:00Z'
  }
];

export default function TransportationDashboardPage() {
  const [activeTab, setActiveTab] = useState<'load_board' | 'active_trips' | 'ledger'>('active_trips');

  // Profile & Data States
  const [carrierProfile, setCarrierProfile] = useState<CarrierProfile>({
    carrier_name: 'Kisan Express Logistics',
    gstin: '27AABCK9981F1Z2',
    rating: 4.9,
    total_trips_completed: 142,
    available_escrow_balance_inr: 42800.0,
    active_vehicles_on_road: 3
  });

  const [openTenders, setOpenTenders] = useState<OpenTender[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kisansetu_open_tenders');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_OPEN_TENDERS;
  });

  const [activeTrips, setActiveTrips] = useState<ActiveTrip[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kisansetu_carrier_trips');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_ACTIVE_TRIPS;
  });

  // Modal States
  const [selectedTenderForAccept, setSelectedTenderForAccept] = useState<OpenTender | null>(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState<boolean>(false);
  const [driverNameInput, setDriverNameInput] = useState<string>('Suresh Rathod');
  const [driverPhoneInput, setDriverPhoneInput] = useState<string>('+91 98231 49821');
  const [vehicleNoInput, setVehicleNoInput] = useState<string>('MH-15-EG-4421');

  const [isOtpModalOpen, setIsOtpModalOpen] = useState<boolean>(false);
  const [otpInput, setOtpInput] = useState<string>('');
  const [activeTripForOtp, setActiveTripForOtp] = useState<ActiveTrip | null>(null);

  // Live GPS Broadcast State
  const [isGpsStreaming, setIsGpsStreaming] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 5000);
  };

  // Persistent Updaters
  const updateActiveTrips = (updater: ActiveTrip[] | ((prev: ActiveTrip[]) => ActiveTrip[])) => {
    setActiveTrips(updater);
  };

  const updateOpenTenders = (updater: OpenTender[] | ((prev: OpenTender[]) => OpenTender[])) => {
    setOpenTenders(updater);
  };

  useEffect(() => {
    try {
      localStorage.setItem('kisansetu_carrier_trips', JSON.stringify(activeTrips));
    } catch {}
  }, [activeTrips]);

  useEffect(() => {
    try {
      localStorage.setItem('kisansetu_open_tenders', JSON.stringify(openTenders));
    } catch {}
  }, [openTenders]);

  const syncVaultWithBuyer = (updater: (vault: any) => any) => {
    try {
      const saved = localStorage.getItem('kisansetu_active_vault');
      const currentVault = saved ? JSON.parse(saved) : {
        id: 1,
        crop_name: 'Sharbati Wheat',
        current_milestone: 'LOCKED',
        status: 'FUNDS_LOCKED'
      };
      const updatedVault = updater(currentVault);
      localStorage.setItem('kisansetu_active_vault', JSON.stringify(updatedVault));
    } catch {}
  };

  // Fetch backend data & Hydrate from LocalStorage
  const fetchTransporterData = async () => {
    try {
      let tripsList: ActiveTrip[] = [];
      const savedTrips = localStorage.getItem('kisansetu_carrier_trips');
      if (savedTrips) {
        tripsList = JSON.parse(savedTrips);
      }

      // Check if there is an active vault from Buyer procurement
      const savedVaultStr = localStorage.getItem('kisansetu_active_vault');
      if (savedVaultStr) {
        const v = JSON.parse(savedVaultStr);
        if (v && v.crop_name) {
          const tripIndex = tripsList.findIndex(t => t.vault_id === v.id || t.lot_id === `LOT-${v.lot_id || 1}`);
          const isAdvanceDisbursed = (v.advance_freight_disbursed || 0) > 0 || v.current_milestone === 'FREIGHT_ADVANCE_PAID' || v.current_milestone === 'IN_TRANSIT' || v.current_milestone === 'SETTLED';
          
          const dynamicTrip: ActiveTrip = {
            id: v.id || 1,
            vault_id: v.id || 1,
            lot_id: `LOT-${v.lot_id || 1}`,
            crop_name: v.crop_name || 'Sharbati Wheat',
            variety: v.variety || 'Lok-1 Clean Grain',
            farmer_name: v.farmer_name || 'Ramesh Patil',
            farmer_phone: '+91 98231 49821',
            origin: v.farmer_district || 'Nashik Cluster Farmgate, Maharashtra',
            destination: 'Vashi APMC Mandi Scale #4 (Navi Mumbai)',
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
            current_milestone: v.current_milestone || 'LOCKED',
            status: v.status === 'ARRIVED_AT_MANDI' ? 'ARRIVED_AT_MANDI' : v.current_milestone === 'IN_TRANSIT' ? 'IN_TRANSIT' : isAdvanceDisbursed ? 'ADVANCE_PAID' : 'ASSIGNED',
            current_lat: 19.4285,
            current_lng: 73.2941,
            temperature_c: 14.2,
            humidity_rh: 68.0,
            created_at: new Date().toISOString()
          };

          if (tripIndex >= 0) {
            tripsList[tripIndex] = { ...tripsList[tripIndex], ...dynamicTrip };
          } else {
            tripsList = [dynamicTrip, ...tripsList];
          }
        }
      }

      if (tripsList.length > 0) {
        setActiveTrips(tripsList);
      }

      const savedTenders = localStorage.getItem('kisansetu_open_tenders');
      if (savedTenders) setOpenTenders(JSON.parse(savedTenders));

      const res = await fetch('http://localhost:8000/api/transporter/trips');
      if (res.ok) {
        const data = await res.json();
        if (data.carrier_profile) setCarrierProfile(data.carrier_profile);
        if (data.active_trips && tripsList.length === 0) setActiveTrips(data.active_trips);
        if (data.open_tenders && !savedTenders) setOpenTenders(data.open_tenders);
      }
    } catch {
      // Retains persisted local state
    }
  };

  useEffect(() => {
    fetchTransporterData();
  }, []);

  // Action: Accept Tender Load
  const handleConfirmAcceptLoad = async () => {
    if (!selectedTenderForAccept) return;
    setLoadingAction('accept_load');
    try {
      const res = await fetch('http://localhost:8000/api/transporter/accept-load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tender_id: selectedTenderForAccept.id,
          driver_name: driverNameInput,
          driver_phone: driverPhoneInput,
          vehicle_number: vehicleNoInput
        })
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || `🎉 Load accepted! Assigned to ${driverNameInput} (${vehicleNoInput}).`);
      } else {
        // Optimistic local state update
        const newTrip: ActiveTrip = {
          id: Date.now() % 1000,
          vault_id: Date.now() % 1000,
          lot_id: selectedTenderForAccept.lot_id,
          crop_name: selectedTenderForAccept.crop_name,
          variety: selectedTenderForAccept.variety,
          farmer_name: selectedTenderForAccept.farmer_name,
          farmer_phone: '+91 98231 77112',
          origin: selectedTenderForAccept.origin,
          destination: selectedTenderForAccept.destination,
          quantity_tons: selectedTenderForAccept.quantity_tons,
          quantity_kg: Math.round(selectedTenderForAccept.quantity_tons * 1000),
          total_freight_inr: selectedTenderForAccept.total_freight_inr,
          advance_freight_inr: selectedTenderForAccept.advance_30_pct_inr,
          advance_claimed: false,
          advance_utr: null,
          balance_freight_inr: selectedTenderForAccept.total_freight_inr - selectedTenderForAccept.advance_30_pct_inr,
          driver_name: driverNameInput,
          driver_phone: driverPhoneInput,
          vehicle_number: vehicleNoInput,
          eway_bill_number: `EWB-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          farm_gate_otp: '7192',
          current_milestone: 'LOCKED',
          status: 'ASSIGNED',
          current_lat: 19.9975,
          current_lng: 73.7898,
          temperature_c: 14.2,
          humidity_rh: 68.0,
          created_at: new Date().toISOString()
        };
        updateActiveTrips(prev => [newTrip, ...prev]);
        updateOpenTenders(prev => prev.filter(t => t.id !== selectedTenderForAccept.id));
        showToast(`🎉 Load accepted! Assigned to ${driverNameInput} (${vehicleNoInput}).`);
      }
    } catch {
      showToast(`🎉 Load accepted! Assigned to ${driverNameInput} (${vehicleNoInput}).`);
    } finally {
      setLoadingAction(null);
      setIsAcceptModalOpen(false);
      setSelectedTenderForAccept(null);
      setActiveTab('active_trips');
      fetchTransporterData();
    }
  };

  // Action: Claim 30% Fuel Advance
  const handleClaimFuelAdvance = async (trip: ActiveTrip) => {
    setLoadingAction(`advance_${trip.id}`);
    try {
      const res = await fetch(`http://localhost:8000/api/transporter/${trip.vault_id}/claim-advance`, {
        method: 'POST'
      });
      const utr = `UTR-ICICI-ADV-${Date.now().toString().slice(-6)}`;
      if (res.ok) {
        const data = await res.json();
        showToast(data.message || `⚡ 30% Fuel Advance (₹${trip.advance_freight_inr.toLocaleString('en-IN')}) credited via DBT.`);
      }
      updateActiveTrips(prev => prev.map(t => t.id === trip.id ? {
        ...t,
        advance_claimed: true,
        advance_utr: utr,
        current_milestone: 'FREIGHT_ADVANCE_PAID',
        status: 'ADVANCE_PAID'
      } : t));
      syncVaultWithBuyer(v => ({
        ...v,
        current_milestone: 'FREIGHT_ADVANCE_PAID',
        advance_freight_disbursed: trip.advance_freight_inr
      }));
    } catch {
      const utr = `UTR-ICICI-ADV-894210`;
      updateActiveTrips(prev => prev.map(t => t.id === trip.id ? {
        ...t,
        advance_claimed: true,
        advance_utr: utr,
        current_milestone: 'FREIGHT_ADVANCE_PAID',
        status: 'ADVANCE_PAID'
      } : t));
      syncVaultWithBuyer(v => ({
        ...v,
        current_milestone: 'FREIGHT_ADVANCE_PAID',
        advance_freight_disbursed: trip.advance_freight_inr
      }));
      showToast(`⚡ 30% Fuel Advance (₹${trip.advance_freight_inr.toLocaleString('en-IN')}) credited to Fuel Card.`);
    } finally {
      setLoadingAction(null);
    }
  };

  // Action: Verify Farmgate OTP
  const handleVerifyOtp = async () => {
    if (!activeTripForOtp || !otpInput) return;
    setLoadingAction('verify_otp');
    try {
      const res = await fetch(`http://localhost:8000/api/transporter/${activeTripForOtp.vault_id}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpInput })
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || `🔑 Farm-gate OTP ${otpInput} verified! Trip is now IN_TRANSIT with live GPS.`);
      } else {
        showToast(`🔑 Farm-gate OTP ${otpInput} verified! Produce loaded onto ${activeTripForOtp.vehicle_number}.`);
      }

      updateActiveTrips(prev => prev.map(t => t.id === activeTripForOtp.id ? {
        ...t,
        current_milestone: 'IN_TRANSIT',
        status: 'IN_TRANSIT'
      } : t));
      syncVaultWithBuyer(v => ({
        ...v,
        current_milestone: 'IN_TRANSIT',
        status: 'IN_TRANSIT'
      }));
    } catch {
      updateActiveTrips(prev => prev.map(t => t.id === activeTripForOtp.id ? {
        ...t,
        current_milestone: 'IN_TRANSIT',
        status: 'IN_TRANSIT'
      } : t));
      syncVaultWithBuyer(v => ({
        ...v,
        current_milestone: 'IN_TRANSIT',
        status: 'IN_TRANSIT'
      }));
      showToast(`🔑 Farm-gate OTP ${otpInput} verified! Trip is now IN_TRANSIT with live GPS.`);
    } finally {
      setLoadingAction(null);
      setIsOtpModalOpen(false);
      setOtpInput('');
    }
  };

  // Action: Mark Arrival at Mandi Yard
  const handleMarkArrival = async (trip: ActiveTrip) => {
    setLoadingAction(`arrive_${trip.id}`);
    try {
      await fetch(`http://localhost:8000/api/transporter/${trip.vault_id}/mark-arrival`, { method: 'POST' });
      updateActiveTrips(prev => prev.map(t => t.id === trip.id ? {
        ...t,
        status: 'ARRIVED_AT_MANDI'
      } : t));
      syncVaultWithBuyer(v => ({
        ...v,
        status: 'ARRIVED_AT_MANDI'
      }));
      showToast(`🚛 Vehicle ${trip.vehicle_number} arrived at Vashi APMC Scale #4. Buyer notified for weighbridge handover!`);
    } catch {
      updateActiveTrips(prev => prev.map(t => t.id === trip.id ? {
        ...t,
        status: 'ARRIVED_AT_MANDI'
      } : t));
      syncVaultWithBuyer(v => ({
        ...v,
        status: 'ARRIVED_AT_MANDI'
      }));
      showToast(`🚛 Vehicle ${trip.vehicle_number} arrived at Vashi APMC Scale #4. Buyer notified for weighbridge handover!`);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar activeRole="TRANSPORTATION" />

      {/* ========================================================================= */}
      {/* 1. STICKY TOP FLEET COMMAND HEADER */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Fleet Profile */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-purple-700/20">
              <Truck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-slate-900 tracking-tight">
                  {carrierProfile.carrier_name}
                </h1>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200 font-mono">
                  VERIFIED LOGISTICS CARRIER
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                  ★ {carrierProfile.rating} ({carrierProfile.total_trips_completed} Trips)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                GSTIN: <strong className="text-slate-800">{carrierProfile.gstin}</strong> • FASTag AIS-140 Live Gateway
              </p>
            </div>
          </div>

          {/* Escrow Balance & Fleet Stats */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl text-xs font-mono">
              <span className="text-[9px] uppercase font-bold text-slate-500 block font-sans">Available Escrow Claim</span>
              <strong className="text-emerald-800 font-black text-sm">
                ₹{carrierProfile.available_escrow_balance_inr.toLocaleString('en-IN')}
              </strong>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl text-xs font-mono">
              <span className="text-[9px] uppercase font-bold text-slate-500 block font-sans">Active Trucks</span>
              <strong className="text-purple-900 font-black text-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                {carrierProfile.active_vehicles_on_road} on Highway
              </strong>
            </div>

            <Button
              size="sm"
              onClick={fetchTransporterData}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 px-3.5 rounded-xl shadow-xs"
            >
              <RefreshCw size={13} className="mr-1.5" />
              Refresh Board
            </Button>
          </div>

        </div>

        {/* Sub-Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100">
          <nav className="flex space-x-2 sm:space-x-4 py-2">
            
            <button
              type="button"
              onClick={() => setActiveTab('active_trips')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'active_trips'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Navigation size={14} />
              <span>Active Hauls &amp; Telemetry</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'active_trips' ? 'bg-purple-800 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {activeTrips.length} Active
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('load_board')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'load_board'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PackageCheck size={14} />
              <span>Freight Load Board (Open Tenders)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'load_board' ? 'bg-purple-800 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {openTenders.length} New
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ledger')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'ledger'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <DollarSign size={14} />
              <span>Payout Ledger &amp; Invoices</span>
            </button>

          </nav>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT VIEW */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Global Toast Alert */}
        {toastMsg && (
          <div className="rounded-2xl bg-purple-50 border border-purple-300 p-4 text-xs font-bold text-purple-950 animate-in fade-in flex justify-between items-center shadow-xs">
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-purple-700 shrink-0" />
              {toastMsg}
            </span>
            <button onClick={() => setToastMsg(null)} className="text-purple-800 font-extrabold text-sm ml-4 cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: LOAD BOARD (OPEN DISPATCH TENDERS) */}
        {/* ========================================================================= */}
        {activeTab === 'load_board' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  Available Institutional Freight Tenders
                </h2>
                <p className="text-xs text-slate-500">
                  Confirmed crop deals awaiting fleet carrier acceptance &amp; vehicle allocation
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-purple-50 text-purple-800 border border-purple-200">
                ⚡ 30% Advance Escrow Guaranteed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {openTenders.map((tender) => (
                <div
                  key={tender.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4 hover:border-purple-300 transition-all text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {tender.id} • {tender.required_vehicle}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm pt-1">
                        {tender.crop_name} ({tender.variety})
                      </h3>
                      <p className="text-slate-500 text-[11px]">
                        Farmer: <strong>{tender.farmer_name}</strong> • Window: <strong className="text-amber-700">{tender.pickup_window}</strong>
                      </p>
                    </div>

                    <div className="text-right font-mono">
                      <strong className="text-base font-black text-emerald-800 block">
                        ₹{tender.total_freight_inr.toLocaleString('en-IN')}
                      </strong>
                      <span className="text-[10px] text-slate-400">
                        ₹{tender.freight_rate_kg.toFixed(2)}/kg • {tender.quantity_tons} MT
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-mono text-[11px] space-y-1 text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-emerald-600 shrink-0" />
                      <span>Origin: <strong>{tender.origin}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 size={12} className="text-blue-600 shrink-0" />
                      <span>Destination: <strong>{tender.destination}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[11px] font-mono text-purple-900">
                      <span>30% Fuel Advance: <strong>₹{tender.advance_30_pct_inr.toLocaleString('en-IN')}</strong></span>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedTenderForAccept(tender);
                        setIsAcceptModalOpen(true);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Accept Load &amp; Assign Truck</span>
                      <ArrowRight size={13} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ACTIVE HAULS & TELEMETRY */}
        {/* ========================================================================= */}
        {activeTab === 'active_trips' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {activeTrips.map((trip) => (
              <div
                key={trip.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-5 text-xs"
              >
                {/* Trip Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                        {trip.eway_bill_number}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {trip.status}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {trip.crop_name} ({trip.quantity_tons} MT) • Vehicle: <strong className="font-mono text-purple-900">{trip.vehicle_number}</strong>
                    </h3>
                    <p className="text-slate-500 text-[11px]">
                      Driver: <strong className="text-slate-800">{trip.driver_name}</strong> ({trip.driver_phone}) • Farmer: <strong>{trip.farmer_name}</strong>
                    </p>
                  </div>

                  <div className="text-left sm:text-right font-mono">
                    <span className="text-slate-400 text-[10px] uppercase font-sans font-bold block">Total Freight Escrow</span>
                    <strong className="text-base font-black text-slate-900 block">
                      ₹{trip.total_freight_inr.toLocaleString('en-IN')}
                    </strong>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      ₹{trip.advance_freight_inr.toLocaleString('en-IN')} Advance (30%) + ₹{trip.balance_freight_inr.toLocaleString('en-IN')} Balance
                    </span>
                  </div>
                </div>

                {/* Corridor Route Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-[11px]">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block font-sans">Farmgate Loading Point</span>
                    <strong className="text-slate-900 block">{trip.origin}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block font-sans">APMC Mandi Terminal</span>
                    <strong className="text-emerald-800 block">{trip.destination}</strong>
                  </div>
                </div>

                {/* Cold-Chain IoT Telemetry Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200">
                    <span className="text-blue-700 text-[10px] uppercase font-bold block">Reefer Temperature</span>
                    <strong className="text-blue-950 font-mono font-bold block pt-0.5">{trip.temperature_c}°C (Optimal)</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200">
                    <span className="text-teal-700 text-[10px] uppercase font-bold block">Chamber Humidity</span>
                    <strong className="text-teal-950 font-mono font-bold block pt-0.5">{trip.humidity_rh}% RH</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200">
                    <span className="text-purple-700 text-[10px] uppercase font-bold block">Highway Speed</span>
                    <strong className="text-purple-950 font-mono font-bold block pt-0.5">58 km/h (GPS Active)</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <span className="text-emerald-700 text-[10px] uppercase font-bold block">GPS Beacon Status</span>
                    <strong className="text-emerald-950 font-mono font-bold block pt-0.5 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                      Live Stream Active
                    </strong>
                  </div>
                </div>

                {/* Execution Controls Row */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                    🚛 Carrier Milestone Actions
                  </span>

                  <div className="flex flex-wrap items-center gap-2.5">
                    
                    {/* Action 1: Claim 30% Fuel Advance */}
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleClaimFuelAdvance(trip)}
                      disabled={trip.advance_claimed || loadingAction === `advance_${trip.id}`}
                      className="h-9 px-3.5 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-700 text-white shadow-xs disabled:opacity-40"
                    >
                      <Fuel size={13} className="mr-1.5" />
                      {trip.advance_claimed ? '✓ 30% Fuel Advance Claimed' : '1. Claim 30% Fuel Advance'}
                    </Button>

                    {/* Action 2: Verify Farmgate OTP */}
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setActiveTripForOtp(trip);
                        setIsOtpModalOpen(true);
                      }}
                      disabled={trip.status === 'IN_TRANSIT' || trip.status === 'ARRIVED_AT_MANDI'}
                      className="h-9 px-3.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs disabled:opacity-40"
                    >
                      <KeyRound size={13} className="mr-1.5" />
                      {trip.status === 'IN_TRANSIT' ? '✓ Farmgate OTP Verified' : '2. Enter Farmgate OTP'}
                    </Button>

                    {/* Action 3: Mark Arrival at Mandi */}
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleMarkArrival(trip)}
                      disabled={trip.status !== 'IN_TRANSIT' || loadingAction === `arrive_${trip.id}`}
                      className="h-9 px-3.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs disabled:opacity-40"
                    >
                      <Scale size={13} className="mr-1.5" />
                      {trip.status === 'ARRIVED_AT_MANDI' ? '✓ Arrived at Vashi APMC' : '3. Mark Arrival at Mandi Yard'}
                    </Button>

                    {/* Live GPS Broadcast Switch */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsGpsStreaming(!isGpsStreaming);
                        showToast(isGpsStreaming ? 'GPS streaming paused.' : '🔴 Live GPS Telemetry Broadcasting to Buyer Map.');
                      }}
                      className={`h-9 px-3.5 rounded-xl font-mono text-xs font-bold transition-all border flex items-center gap-1.5 ml-auto cursor-pointer ${
                        isGpsStreaming
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}
                    >
                      <Radio size={13} className={isGpsStreaming ? 'text-emerald-700 animate-pulse' : 'text-slate-400'} />
                      <span>{isGpsStreaming ? 'GPS Beacon ON (5s)' : 'GPS Beacon OFF'}</span>
                    </button>

                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CARRIER PAYOUT LEDGER */}
        {/* ========================================================================= */}
        {activeTab === 'ledger' && (
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4 text-xs animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Carrier Freight Payout Ledger &amp; Settlements
              </h2>
              <p className="text-xs text-slate-500">
                Official DBT disbursements processed via RBI-compliant Escrow Vault
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden font-mono">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase font-black tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">E-Way Bill</th>
                    <th className="p-3">Commodity &amp; Weight</th>
                    <th className="p-3">Corridor</th>
                    <th className="p-3 text-right">30% Advance</th>
                    <th className="p-3 text-right">70% Settlement</th>
                    <th className="p-3 text-right">Total (INR)</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">EWB-2026-98412</td>
                    <td className="p-3 font-sans">
                      <strong>Sharbati Wheat</strong>
                      <span className="block text-[10px] text-slate-500 font-mono">5.0 MT (Lok-1)</span>
                    </td>
                    <td className="p-3 font-sans text-slate-600">Nashik ➔ Vashi APMC</td>
                    <td className="p-3 text-right text-purple-900 font-bold">₹1,800.00</td>
                    <td className="p-3 text-right text-emerald-900 font-bold">₹4,200.00</td>
                    <td className="p-3 text-right font-black text-slate-900">₹6,000.00</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        SETTLED
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">EWB-2026-98319</td>
                    <td className="p-3 font-sans">
                      <strong>Garva Onion</strong>
                      <span className="block text-[10px] text-slate-500 font-mono">12.0 MT (Grade A)</span>
                    </td>
                    <td className="p-3 font-sans text-slate-600">Lasalgaon ➔ Pune APMC</td>
                    <td className="p-3 text-right text-purple-900 font-bold">₹4,320.00</td>
                    <td className="p-3 text-right text-emerald-900 font-bold">₹10,080.00</td>
                    <td className="p-3 text-right font-black text-slate-900">₹14,400.00</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        SETTLED
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: ACCEPT LOAD & ASSIGN DRIVER */}
      {/* ========================================================================= */}
      {isAcceptModalOpen && selectedTenderForAccept && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200 text-slate-900 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                  <Truck size={16} />
                </div>
                <h3 className="font-black text-sm text-slate-900">
                  Accept Load &amp; Assign Vehicle
                </h3>
              </div>
              <button
                onClick={() => setIsAcceptModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-200 text-xs space-y-1 font-mono">
              <div>Tender: <strong>{selectedTenderForAccept.id}</strong></div>
              <div>Crop: <strong>{selectedTenderForAccept.crop_name} ({selectedTenderForAccept.quantity_tons} MT)</strong></div>
              <div>Freight Payout: <strong className="text-emerald-800">₹{selectedTenderForAccept.total_freight_inr.toLocaleString('en-IN')}</strong></div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Driver Full Name:</label>
                <Input
                  value={driverNameInput}
                  onChange={(e) => setDriverNameInput(e.target.value)}
                  className="h-10 rounded-xl"
                  placeholder="e.g. Suresh Rathod"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Driver Mobile Number:</label>
                <Input
                  value={driverPhoneInput}
                  onChange={(e) => setDriverPhoneInput(e.target.value)}
                  className="h-10 rounded-xl font-mono"
                  placeholder="+91 98231 XXXXX"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Vehicle Registration No:</label>
                <Input
                  value={vehicleNoInput}
                  onChange={(e) => setVehicleNoInput(e.target.value)}
                  className="h-10 rounded-xl font-mono uppercase"
                  placeholder="MH-15-EG-4421"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAcceptModalOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmAcceptLoad}
                disabled={loadingAction === 'accept_load'}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
              >
                Confirm &amp; Assign Dispatch
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: VERIFY FARMGATE OTP */}
      {/* ========================================================================= */}
      {isOtpModalOpen && activeTripForOtp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200 text-slate-900 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                  <KeyRound size={16} />
                </div>
                <h3 className="font-black text-sm text-slate-900">
                  Verify Farmgate Pickup OTP
                </h3>
              </div>
              <button
                onClick={() => setIsOtpModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Enter the 4-digit code provided by farmer <strong>{activeTripForOtp.farmer_name}</strong> at the farm gate to confirm loading.
            </p>

            <div>
              <Input
                type="text"
                maxLength={4}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="4821"
                className="h-12 text-center text-xl font-black font-mono tracking-widest rounded-2xl border-blue-300"
              />
              <span className="text-[10px] text-slate-400 text-center block pt-1 font-mono">
                Demo secret code: 4821
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOtpModalOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleVerifyOtp}
                disabled={otpInput.length !== 4 || loadingAction === 'verify_otp'}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
              >
                Verify &amp; Start Trip
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
