'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { 
  Truck, 
  RefreshCw, 
  Sparkles, 
  Navigation, 
  DollarSign, 
  PackageCheck, 
  MapPin, 
  Building2, 
  X,
  Settings2,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  RotateCcw,
  Boxes,
  Activity
} from 'lucide-react';
import { ShipmentTracker } from '@/components/dashboard/ShipmentTracker';
import { OrderSidePanel } from '@/components/transportation/OrderSidePanel';
import { OrderDetailDrawer } from '@/components/transportation/OrderDetailDrawer';
import { TenderSidePanel, OpenTenderItem } from '@/components/transportation/TenderSidePanel';
import { TenderDetailView } from '@/components/transportation/TenderDetailView';
import { LedgerSidePanel, LedgerItem, INITIAL_LEDGER_ITEMS } from '@/components/transportation/LedgerSidePanel';
import { LedgerDetailView } from '@/components/transportation/LedgerDetailView';
import { 
  TransporterOnboardingModal, 
  TransporterFleetProfile, 
  DEMO_TRANSPORTER_PROFILE 
} from '@/components/transportation/TransporterOnboardingModal';
import { 
  TransportationOrder, 
  INITIAL_TRANSPORTATION_ORDERS, 
  adaptTripToOrder 
} from '@/lib/transportation-types';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';

export const DEFAULT_OPEN_TENDERS: OpenTenderItem[] = [
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
  },
  {
    id: 'TEND-2026-093',
    lot_id: 'LOT-4',
    crop_name: 'Thompson Seedless Grapes',
    variety: 'Export Grade-A',
    farmer_name: 'Anil Thorat',
    origin: 'Pimpalgaon Cluster, Nashik',
    destination: 'Vashi APMC Terminal Scale #2',
    quantity_tons: 6.0,
    freight_rate_kg: 1.80,
    total_freight_inr: 10800.0,
    advance_30_pct_inr: 3240.0,
    pickup_window: 'Tomorrow, 08:00 AM',
    required_vehicle: 'Reefer Cold-Chain (14°C)'
  }
];

export default function TransportationDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'active_trips' | 'load_board' | 'ledger'>('active_trips');

  // Transporter Onboarding Modal State
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Dynamic Fleet Profile State
  const [carrierProfile, setCarrierProfile] = useState<TransporterFleetProfile>(() => {
    return DEMO_TRANSPORTER_PROFILE;
  });

  // Dynamic Orders State (Initialized as empty for fresh onboarded transporters)
  const [orders, setOrders] = useState<TransportationOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState<boolean>(true);
  const [isOrdersSidePanelCollapsed, setIsOrdersSidePanelCollapsed] = useState<boolean>(false);

  // TAB 2: Open Tenders State
  const [openTenders, setOpenTenders] = useState<OpenTenderItem[]>(DEFAULT_OPEN_TENDERS);
  const [selectedTenderId, setSelectedTenderId] = useState<string | null>('TEND-2026-091');
  const [isTendersSidePanelCollapsed, setIsTendersSidePanelCollapsed] = useState<boolean>(false);

  // TAB 3: Payout Ledger State
  const [ledgerItems, setLedgerItems] = useState<LedgerItem[]>(INITIAL_LEDGER_ITEMS);
  const [selectedEwayBill, setSelectedEwayBill] = useState<string | null>('EWB-2026-98412');
  const [isLedgerSidePanelCollapsed, setIsLedgerSidePanelCollapsed] = useState<boolean>(false);

  // Toast State
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    toast.success(msg);
    setTimeout(() => setToastMsg(null), 5000);
  };

  // Hydrate Profile & Orders on initial mount
  useEffect(() => {
    const loadProfileAndOrders = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      let foundDbProfile = false;

      // Clear legacy shared unkeyed storage that leaked old demo profiles
      try {
        localStorage.removeItem('kisansetu_transporter_profile');
        localStorage.removeItem('kisansetu_transporter_onboarded');
      } catch {}

      const userStorageKey = user?.email ? `kisansetu_transporter_profile_${user.email.toLowerCase()}` : null;
      const userOnboardedKey = user?.email ? `kisansetu_transporter_onboarded_${user.email.toLowerCase()}` : null;
      let dbUserName = user?.name || null;
      let dbUserPhone = user?.phone || null;

      if (user?.email) {
        try {
          const res = await fetch(`${apiUrl}/api/transporter/profile/me?email=${encodeURIComponent(user.email.trim())}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === 'SUCCESS' && data.profile && data.is_onboarded) {
              setCarrierProfile(data.profile);
              if (userStorageKey && userOnboardedKey) {
                localStorage.setItem(userStorageKey, JSON.stringify(data.profile));
                localStorage.setItem(userOnboardedKey, 'true');
              }
              foundDbProfile = true;
            } else {
              // Extract registered account name & phone directly from DB Users table
              if (data.user_name) dbUserName = data.user_name;
              if (data.user_phone) dbUserPhone = data.user_phone;
            }
          }
        } catch (e) {
          // Fallback to localStorage below
        }
      }

      if (!foundDbProfile) {
        try {
          const savedProfile = userStorageKey ? localStorage.getItem(userStorageKey) : null;
          const isOnboarded = userOnboardedKey ? localStorage.getItem(userOnboardedKey) : null;

          if (savedProfile && isOnboarded === 'true') {
            try {
              const parsed = JSON.parse(savedProfile);
              setCarrierProfile(parsed);
            } catch {}
          } else {
            // Fresh un-onboarded transporter: bind registered user name from DB directly
            const dynamicCarrierName = dbUserName || user?.name || 'My Fleet Logistics';
            setCarrierProfile({
              ...DEMO_TRANSPORTER_PROFILE,
              carrier_name: dynamicCarrierName,
              contact_phone: dbUserPhone || user?.phone || '+91 99887 76655',
              total_trips_completed: 0,
              available_escrow_balance_inr: 0,
              active_vehicles_on_road: 0,
              isOnboarded: false
            });
            setIsOnboardingModalOpen(true);
            setIsEditMode(false);
            setOrders([]);
          }
        } catch {}
      }

      // Load saved orders or tenders if any
      try {
        const orderStorageKey = user?.email ? `kisansetu_transporter_orders_${user.email.toLowerCase()}` : 'kisansetu_transporter_orders';
        const savedOrders = localStorage.getItem(orderStorageKey);
        const savedTenders = localStorage.getItem('kisansetu_transporter_tenders');

        if (savedOrders) {
          try {
            const parsedOrders = JSON.parse(savedOrders);
            if (Array.isArray(parsedOrders)) {
              setOrders(parsedOrders);
              if (parsedOrders.length > 0) {
                setSelectedOrderId(parsedOrders[0].id);
              }
            }
          } catch {}
        }

        if (savedTenders) {
          try {
            const parsedTenders = JSON.parse(savedTenders);
            if (Array.isArray(parsedTenders) && parsedTenders.length > 0) {
              setOpenTenders(parsedTenders);
            }
          } catch {}
        }
      } catch {}
    };

    loadProfileAndOrders();
  }, [user]);

  // Selected Order computed
  const selectedOrder = useMemo(() => {
    if (orders.length === 0) return null;
    return orders.find(o => o.id === selectedOrderId) || orders[0] || null;
  }, [orders, selectedOrderId]);

  // Selected Tender computed
  const selectedTender = useMemo(() => {
    return openTenders.find(t => t.id === selectedTenderId) || openTenders[0] || null;
  }, [openTenders, selectedTenderId]);

  // Selected Ledger Item computed
  const selectedLedgerItem = useMemo(() => {
    return ledgerItems.find(l => l.ewayBillNumber === selectedEwayBill) || ledgerItems[0] || null;
  }, [ledgerItems, selectedEwayBill]);

  // Handle Order Selection
  const handleSelectOrder = (order: TransportationOrder) => {
    setSelectedOrderId(order.id);
    setIsDetailDrawerOpen(true);
  };

  // Handle Onboarding Completion
  const handleSaveFleetProfile = (profile: TransporterFleetProfile) => {
    setCarrierProfile(profile);
    setIsOnboardingModalOpen(false);

    try {
      const userStorageKey = user?.email ? `kisansetu_transporter_profile_${user.email.toLowerCase()}` : 'kisansetu_transporter_profile';
      const userOnboardedKey = user?.email ? `kisansetu_transporter_onboarded_${user.email.toLowerCase()}` : 'kisansetu_transporter_onboarded';
      localStorage.setItem(userStorageKey, JSON.stringify(profile));
      localStorage.setItem(userOnboardedKey, 'true');
    } catch {}

    showToast(`🎉 Fleet Profile for '${profile.carrier_name}' saved to Supabase! Dashboard active with ${profile.total_trucks} registered trucks.`);
  };

  // Action: Accept Load in Tender View
  const handleAcceptLoadFromDetail = (tender: OpenTenderItem, driverName: string, driverPhone: string, vehicleNo: string) => {
    const newOrder: TransportationOrder = {
      id: `ORD-${Date.now() % 10000}`,
      lotId: tender.lot_id,
      ewayBillNumber: `EWB-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: 'KisanSetu Mandi Procurement',
      farmerName: tender.farmer_name,
      farmerPhone: '+91 98231 77112',
      status: 'ASSIGNED',
      deliveryStatus: 'ON_TIME',
      priority: 'HIGH',
      transportMode: tender.required_vehicle.includes('Reefer') ? 'Reefer Truck' : 'Truck',
      origin: { name: tender.origin, lat: 19.9975, lng: 73.7898 },
      destination: { name: tender.destination, lat: 19.0760, lng: 72.9980 },
      pickupTime: new Date().toISOString(),
      estimatedArrivalTime: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      totalDistanceKm: 168,
      completedDistanceKm: 0,
      distanceRemainingKm: 168,
      delayMinutes: 0,
      totalFreightInr: tender.total_freight_inr,
      advanceFreightInr: tender.advance_30_pct_inr,
      advanceClaimed: false,
      balanceFreightInr: tender.total_freight_inr - tender.advance_30_pct_inr,
      farmGateOtp: '7192',
      driver: { name: driverName, phone: driverPhone },
      vehicle: { 
        registrationNumber: vehicleNo, 
        type: tender.required_vehicle.includes('Reefer') ? 'Reefer Truck' : 'Truck', 
        capacityTons: tender.quantity_tons,
        temperatureC: 14.2,
        humidityRh: 68
      },
      shipment: {
        packagesCount: Math.round(tender.quantity_tons * 20),
        weightTons: tender.quantity_tons,
        weightKg: Math.round(tender.quantity_tons * 1000),
        cropName: tender.crop_name,
        variety: tender.variety,
        notes: 'Assigned via KisanSetu Freight Load Board'
      },
      tracking: {
        isLive: true,
        lastUpdatedText: 'Assigned just now',
        currentLat: 19.9975,
        currentLng: 73.7898,
        speedKmh: 0,
        freshnessStatus: 'LIVE'
      },
      timeline: [
        {
          id: 'evt-101',
          title: 'Load Accepted & Assigned',
          description: `Assigned to ${driverName} (${vehicleNo})`,
          timestamp: 'Just now',
          status: 'COMPLETED'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedOrders = [newOrder, ...orders];
    const updatedTenders = openTenders.filter(t => t.id !== tender.id);

    setOrders(updatedOrders);
    setOpenTenders(updatedTenders);
    setSelectedOrderId(newOrder.id);
    setActiveTab('active_trips');

    // Update fleet metrics
    setCarrierProfile(prev => ({
      ...prev,
      available_escrow_balance_inr: prev.available_escrow_balance_inr + tender.total_freight_inr,
      active_vehicles_on_road: prev.active_vehicles_on_road + 1
    }));

    try {
      localStorage.setItem('kisansetu_transporter_orders', JSON.stringify(updatedOrders));
      localStorage.setItem('kisansetu_transporter_tenders', JSON.stringify(updatedTenders));
    } catch {}

    showToast(`🎉 Load accepted! ${tender.crop_name} assigned to ${driverName} (${vehicleNo}). Live tracking enabled!`);
  };

  // Action: Claim Fuel Advance
  const handleClaimAdvanceForOrder = (targetOrder: TransportationOrder) => {
    const updated = orders.map(o => o.id === targetOrder.id ? {
      ...o,
      advanceClaimed: true,
      advanceUtr: 'UTR-ICICI-ADV-894210',
      status: 'IN_TRANSIT' as const
    } : o);

    setOrders(updated);
    try {
      localStorage.setItem('kisansetu_transporter_orders', JSON.stringify(updated));
    } catch {}

    setLedgerItems(prev => [
      {
        ewayBillNumber: targetOrder.ewayBillNumber,
        cropName: targetOrder.shipment.cropName,
        variety: targetOrder.shipment.variety,
        weightTons: targetOrder.shipment.weightTons,
        corridor: `${targetOrder.origin.name} ➔ ${targetOrder.destination.name}`,
        advanceInr: targetOrder.advanceFreightInr,
        settlementInr: targetOrder.balanceFreightInr,
        totalInr: targetOrder.totalFreightInr,
        status: 'ADVANCE_PAID',
        utr: 'UTR-ICICI-ADV-894210',
        settledAt: 'Today'
      },
      ...prev
    ]);

    showToast(`⚡ 30% Fuel Advance (₹${targetOrder.advanceFreightInr.toLocaleString('en-IN')}) credited to Fuel Card.`);
  };

  // Action: Verify Farmgate OTP
  const handleVerifyOtpForOrder = (targetOrder: TransportationOrder) => {
    const updated = orders.map(o => o.id === targetOrder.id ? {
      ...o,
      status: 'IN_TRANSIT' as const,
      deliveryStatus: 'ON_TIME' as const
    } : o);

    setOrders(updated);
    try {
      localStorage.setItem('kisansetu_transporter_orders', JSON.stringify(updated));
    } catch {}

    showToast(`🔑 Farmgate OTP verified! Produce loaded onto ${targetOrder.vehicle.registrationNumber}.`);
  };

  // Action: Mark Arrival at Mandi Yard
  const handleMarkArrivalForOrder = (targetOrder: TransportationOrder) => {
    const updated = orders.map(o => o.id === targetOrder.id ? {
      ...o,
      status: 'ARRIVED_AT_MANDI' as const,
      deliveryStatus: 'ON_TIME' as const,
      completedDistanceKm: o.totalDistanceKm,
      distanceRemainingKm: 0
    } : o);

    setOrders(updated);
    try {
      localStorage.setItem('kisansetu_transporter_orders', JSON.stringify(updated));
    } catch {}

    setLedgerItems(prev => prev.map(l => l.ewayBillNumber === targetOrder.ewayBillNumber ? {
      ...l,
      status: 'SETTLED',
      utr: 'UTR-ICICI-SETTLE-998822',
      settledAt: 'Just Now'
    } : l));

    showToast(`🚛 Vehicle ${targetOrder.vehicle.registrationNumber} arrived at Mandi Yard. Buyer notified for weighbridge handover!`);
  };

  // Helper: Load Demo Trip for Testing
  const handleLoadDemoTrip = () => {
    setOrders(INITIAL_TRANSPORTATION_ORDERS);
    setSelectedOrderId('ORD-2026-881');
    setCarrierProfile(DEMO_TRANSPORTER_PROFILE);
    try {
      localStorage.setItem('kisansetu_transporter_orders', JSON.stringify(INITIAL_TRANSPORTATION_ORDERS));
      localStorage.setItem('kisansetu_transporter_profile', JSON.stringify(DEMO_TRANSPORTER_PROFILE));
      localStorage.setItem('kisansetu_transporter_onboarded', 'true');
    } catch {}
    showToast('⚡ Demo active trip loaded for testing!');
  };

  // Helper: Reset to Empty State
  const handleResetToEmptyState = () => {
    setOrders([]);
    setSelectedOrderId(null);
    setOpenTenders(DEFAULT_OPEN_TENDERS);
    try {
      localStorage.removeItem('kisansetu_transporter_orders');
      localStorage.removeItem('kisansetu_transporter_tenders');
    } catch {}
    showToast('Clean empty state initialized. Looking for new loads!');
  };

  return (
    <ProtectedRoute allowedRoles={['TRANSPORTATION', 'ADMIN']}>
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
        <Navbar activeRole="TRANSPORTATION" />

        {/* ========================================================================= */}
        {/* ONBOARDING MODAL COMPONENT */}
        {/* ========================================================================= */}
        <TransporterOnboardingModal
          isOpen={isOnboardingModalOpen}
          onClose={() => setIsOnboardingModalOpen(false)}
          onSaveProfile={handleSaveFleetProfile}
          initialProfile={carrierProfile}
          isEditMode={isEditMode}
          userEmail={user?.email}
          userId={user?.id}
        />

        {/* ========================================================================= */}
        {/* 1. STICKY TOP FLEET COMMAND HEADER */}
        {/* ========================================================================= */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            {/* Fleet Profile & Dynamic Info */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-sm shadow-emerald-700/20 shrink-0">
                <Truck size={22} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {carrierProfile.carrier_name}
                  </h1>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-mono">
                    VERIFIED FLEET CARRIER
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                    ★ {carrierProfile.rating} ({carrierProfile.total_trips_completed} Trips)
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-slate-500 font-mono">
                  <span>GSTIN: <strong className="text-slate-800">{carrierProfile.gstin}</strong></span>
                  <span>•</span>
                  <span>Base Rate: <strong className="text-emerald-800">₹{carrierProfile.base_rate}/{carrierProfile.rate_unit === 'INR_PER_KG' ? 'kg' : 'tonne-km'}</strong></span>
                  <span>•</span>
                  <span className="text-slate-600">{carrierProfile.total_trucks} Trucks Managed</span>
                </div>
              </div>
            </div>

            {/* Escrow Balance, Fleet Actions & Setup Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Escrow Claim Pill */}
              <div className="bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl text-xs font-mono">
                <span className="text-[9px] uppercase font-bold text-slate-500 block font-sans">Available Escrow Claim</span>
                <strong className="text-emerald-800 font-black text-sm">
                  ₹{carrierProfile.available_escrow_balance_inr.toLocaleString('en-IN')}
                </strong>
              </div>

              {/* Active Trucks Pill */}
              <div className="bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl text-xs font-mono">
                <span className="text-[9px] uppercase font-bold text-slate-500 block font-sans">Active Hauls</span>
                <strong className="text-emerald-900 font-black text-sm flex items-center gap-1.5">
                  {orders.filter(o => o.status === 'IN_TRANSIT').length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  )}
                  {orders.filter(o => o.status === 'IN_TRANSIT').length} On Highway
                </strong>
              </div>

              {/* Edit Fleet Setup Button */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditMode(true);
                  setIsOnboardingModalOpen(true);
                }}
                className="text-xs font-bold h-9 px-3 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
                title="Edit Fleet Profile & Rates"
              >
                <Settings2 size={13} className="mr-1 text-emerald-700" />
                Fleet &amp; Rates
              </Button>

              {/* Demo Toggle Options */}
              {orders.length === 0 ? (
                <Button
                  size="sm"
                  onClick={handleLoadDemoTrip}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs h-9 px-3 rounded-xl shadow-xs cursor-pointer"
                >
                  <Sparkles size={13} className="mr-1.5 text-amber-300" />
                  Load Demo Haul
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleResetToEmptyState}
                  className="text-xs font-bold h-9 px-3 rounded-xl border-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
                  title="Clear orders to test empty state"
                >
                  <RotateCcw size={12} className="mr-1" />
                  Reset to Empty
                </Button>
              )}

            </div>

          </div>

          {/* Sub-Navigation Tabs */}
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 border-t border-slate-100">
            <nav className="flex space-x-2 sm:space-x-4 py-1.5 overflow-x-auto">
              
              <button
                type="button"
                onClick={() => setActiveTab('active_trips')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'active_trips'
                    ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Navigation size={14} />
                <span>Transportation Orders &amp; Map</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  activeTab === 'active_trips' ? 'bg-emerald-900 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {orders.length} Active
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('load_board')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'load_board'
                    ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <PackageCheck size={14} />
                <span>Freight Load Board (Open Tenders)</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  activeTab === 'load_board' ? 'bg-emerald-900 text-white' : 'bg-emerald-100 text-emerald-900 font-bold'
                }`}>
                  {openTenders.length} Available
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ledger')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'ledger'
                    ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/20'
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
        {/* 2. MAIN WORKSPACE AREA */}
        {/* ========================================================================= */}
        <main className="flex-1 flex flex-col w-full">
          
          {/* Global Toast Notification */}
          {toastMsg && (
            <div className="mx-4 sm:mx-6 mt-3 rounded-2xl bg-emerald-50 border border-emerald-300 p-3.5 text-xs font-bold text-emerald-950 animate-in fade-in flex justify-between items-center shadow-xs">
              <span className="flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-700 shrink-0" />
                {toastMsg}
              </span>
              <button onClick={() => setToastMsg(null)} className="text-emerald-900 font-extrabold text-sm ml-4 cursor-pointer">
                ✕
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: TRANSPORTATION ORDERS & MAP (SPLIT SIDE PANEL + MAP + INLINE DETAIL) */}
          {/* ========================================================================= */}
          {activeTab === 'active_trips' && (
            <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-130px)] min-h-[650px] overflow-hidden">
              
              {/* LEFT SIDE PANEL */}
              <OrderSidePanel
                orders={orders}
                selectedOrderId={selectedOrderId}
                onSelectOrder={handleSelectOrder}
                isCollapsed={isOrdersSidePanelCollapsed}
                onToggleCollapse={() => setIsOrdersSidePanelCollapsed(!isOrdersSidePanelCollapsed)}
                onBrowseTenders={() => setActiveTab('load_board')}
              />

              {/* CENTER AREA: EITHER EMPTY STATE OR LIVE ACTIVE TRIP MAP */}
              {orders.length === 0 ? (
                /* ========================================================================= */
                /* EMPTY STATE: LOOKING FOR LOADS */
                /* ========================================================================= */
                <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6 justify-center max-w-4xl mx-auto w-full">
                  
                  {/* Hero Empty State Card */}
                  <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm text-center space-y-5">
                    
                    <div className="mx-auto w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-4xl shadow-inner animate-in zoom-in duration-300">
                      🚚
                    </div>

                    <div className="space-y-2 max-w-lg mx-auto">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-mono font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                        Fleet Ready for Dispatch • 0 Active Hauls
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        No Active Hauls Currently Assigned
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                        Your transporter profile for <strong className="text-slate-800">{carrierProfile.carrier_name}</strong> is verified with <strong>{carrierProfile.total_trucks} commercial trucks</strong>. Browse available farmgate harvest lots &amp; bulk FPO tenders to start accepting corridor freight.
                      </p>
                    </div>

                    {/* Fleet Stats Pill Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-2 text-xs font-mono">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 block font-sans font-bold">Fleet Size</span>
                        <strong className="text-slate-900 text-sm">{carrierProfile.total_trucks} Trucks</strong>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 block font-sans font-bold">Base Rate</span>
                        <strong className="text-emerald-800 text-sm">₹{carrierProfile.base_rate}/{carrierProfile.rate_unit === 'INR_PER_KG' ? 'kg' : 't-km'}</strong>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 block font-sans font-bold">Min Freight</span>
                        <strong className="text-slate-900 text-sm">₹{carrierProfile.min_freight_charge}</strong>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 block font-sans font-bold">Fuel Advance</span>
                        <strong className="text-emerald-800 text-sm">30% Instant</strong>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                      <Button
                        size="lg"
                        onClick={() => setActiveTab('load_board')}
                        className="w-full sm:w-auto h-12 px-8 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <PackageCheck size={16} />
                        <span>Browse Open Freight Load Board ({openTenders.length} Available) →</span>
                      </Button>

                      <Button
                        size="lg"
                        variant="outline"
                        onClick={handleLoadDemoTrip}
                        className="w-full sm:w-auto h-12 px-6 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                      >
                        <Sparkles size={14} className="mr-1.5 text-amber-500" />
                        Load Demo Active Trip
                      </Button>
                    </div>

                  </div>

                  {/* Telemetry Map Placeholder */}
                  <div className="p-6 rounded-3xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-mono font-bold">
                      <Compass size={16} className="animate-spin text-emerald-600" />
                      <span>AIS-140 GPS Corridor Telemetry &amp; Cold-Chain Sensor Hub</span>
                    </div>
                    <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                      Interactive Leaflet route maps, speed monitors, temperature telemetry, and 4-digit farmgate OTP handshakes activate automatically as soon as an open tender is accepted from the Load Board.
                    </p>
                  </div>

                </div>
              ) : (
                /* ========================================================================= */
                /* ACTIVE ORDERS MAP & CONTROLS VIEW */
                /* ========================================================================= */
                <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-3">
                  {selectedOrder && (
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shrink-0">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">{selectedOrder.id}</span>
                          <span className="font-mono text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px] font-bold">
                            {selectedOrder.shipment.cropName} ({selectedOrder.shipment.weightTons} MT)
                          </span>
                          <span className="font-mono text-emerald-800 text-[11px] font-bold">
                            Vehicle: {selectedOrder.vehicle.registrationNumber}
                          </span>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {selectedOrder.status}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] pt-0.5">
                          Route: <strong>{selectedOrder.origin.name}</strong> ➔ <strong className="text-emerald-800">{selectedOrder.destination.name}</strong>
                        </p>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => setIsDetailDrawerOpen(!isDetailDrawerOpen)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs h-8 px-3 rounded-xl shadow-xs cursor-pointer shrink-0"
                      >
                        {isDetailDrawerOpen ? 'Hide Order Details' : 'Show Order Details'}
                      </Button>
                    </div>
                  )}

                  {/* Embedded Live Map */}
                  <div className="flex-1 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative min-h-[420px]">
                    <ShipmentTracker
                      lotId={selectedOrder?.lotId || 'LOT-1'}
                      cropName={selectedOrder?.shipment.cropName || 'Sharbati Wheat'}
                      farmerName={selectedOrder?.farmerName || 'Ramesh Patil'}
                      carrierName={carrierProfile.carrier_name}
                      vehicleNumber={selectedOrder?.vehicle.registrationNumber || 'MH-15-EG-4421'}
                      driverName={selectedOrder?.driver.name || 'Suresh Rathod'}
                      driverPhone={selectedOrder?.driver.phone || '+91 98231 49821'}
                      originName={selectedOrder?.origin.name || 'Nashik Farm Gate Cluster'}
                      destinationName={selectedOrder?.destination.name || 'Vashi APMC Mandi Yard'}
                    />
                  </div>
                </div>
              )}

              {/* INLINE NON-OVERLAPPING DETAIL PANEL ON RIGHT (ONLY WHEN ORDERS EXIST) */}
              {orders.length > 0 && isDetailDrawerOpen && selectedOrder && (
                <OrderDetailDrawer
                  order={selectedOrder}
                  isOpen={isDetailDrawerOpen}
                  onClose={() => setIsDetailDrawerOpen(false)}
                  onClaimAdvance={handleClaimAdvanceForOrder}
                  onVerifyOtp={handleVerifyOtpForOrder}
                  onMarkArrival={handleMarkArrivalForOrder}
                  isInline={true}
                />
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: FREIGHT LOAD BOARD (TENDER SIDE PANEL + DETAIL VIEW - NO MAP) */}
          {/* ========================================================================= */}
          {activeTab === 'load_board' && (
            <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-130px)] min-h-[650px] overflow-hidden">
              
              {/* TENDER SIDE PANEL */}
              <TenderSidePanel
                tenders={openTenders}
                selectedTenderId={selectedTenderId}
                onSelectTender={(t) => setSelectedTenderId(t.id)}
                isCollapsed={isTendersSidePanelCollapsed}
                onToggleCollapse={() => setIsTendersSidePanelCollapsed(!isTendersSidePanelCollapsed)}
              />

              {/* TENDER DETAIL WORKSPACE */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col">
                <TenderDetailView
                  tender={selectedTender}
                  onAcceptLoad={handleAcceptLoadFromDetail}
                />
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: PAYOUT LEDGER (LEDGER SIDE PANEL + INVOICE DETAIL VIEW - NO MAP) */}
          {/* ========================================================================= */}
          {activeTab === 'ledger' && (
            <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-130px)] min-h-[650px] overflow-hidden">
              
              {/* LEDGER SIDE PANEL */}
              <LedgerSidePanel
                ledgerItems={ledgerItems}
                selectedEwayBill={selectedEwayBill}
                onSelectLedgerItem={(l) => setSelectedEwayBill(l.ewayBillNumber)}
                isCollapsed={isLedgerSidePanelCollapsed}
                onToggleCollapse={() => setIsLedgerSidePanelCollapsed(!isLedgerSidePanelCollapsed)}
              />

              {/* LEDGER DETAIL WORKSPACE */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col">
                <LedgerDetailView
                  item={selectedLedgerItem}
                  onDownloadInvoice={(item) => showToast(`📄 Tax Invoice for ${item.ewayBillNumber} downloaded.`)}
                />
              </div>

            </div>
          )}

        </main>

      </div>
    </ProtectedRoute>
  );
}
