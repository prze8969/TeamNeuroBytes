'use client';

import React, { useState, useEffect, useMemo } from 'react';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';

import {
  Truck,
  Sparkles,
  Navigation,
  DollarSign,
  PackageCheck,
  Settings2,
  RotateCcw,
  Compass,
  MapPin,
  ShieldCheck,
  Activity,
  ArrowRight,
  RefreshCw,
  UserRound,
  Thermometer,
  Droplets,
  Route,
  Clock3,
  IndianRupee,
  CheckCircle2,
  Circle,
  Warehouse,
  Gauge,
} from 'lucide-react';

import { ShipmentTracker } from '@/components/dashboard/ShipmentTracker';

import { OrderSidePanel } from '@/components/transportation/OrderSidePanel';

import { OrderDetailDrawer } from '@/components/transportation/OrderDetailDrawer';

import {
  TenderSidePanel,
  OpenTenderItem,
} from '@/components/transportation/TenderSidePanel';

import { TenderDetailView } from '@/components/transportation/TenderDetailView';

import {
  LedgerSidePanel,
  LedgerItem,
  INITIAL_LEDGER_ITEMS,
} from '@/components/transportation/LedgerSidePanel';

import { LedgerDetailView } from '@/components/transportation/LedgerDetailView';

import {
  TransporterOnboardingModal,
  TransporterFleetProfile,
  DEMO_TRANSPORTER_PROFILE,
} from '@/components/transportation/TransporterOnboardingModal';

import {
  TransportationOrder,
  INITIAL_TRANSPORTATION_ORDERS,
} from '@/lib/transportation-types';

import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';

/* ========================================================================== */
/* OPEN FREIGHT LOADS                                                         */
/* ========================================================================== */

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
    freight_rate_kg: 1.2,
    total_freight_inr: 9600.0,
    advance_30_pct_inr: 2880.0,
    pickup_window: 'Today, within 4 hours',
    required_vehicle: '10-Wheeler Open / Tarpaulin',
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
    freight_rate_kg: 1.6,
    total_freight_inr: 6400.0,
    advance_30_pct_inr: 1920.0,
    pickup_window: 'Tomorrow morning, 06:00 AM',
    required_vehicle: 'Reefer Cold-Chain (14°C)',
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
    freight_rate_kg: 1.8,
    total_freight_inr: 10800.0,
    advance_30_pct_inr: 3240.0,
    pickup_window: 'Tomorrow, 08:00 AM',
    required_vehicle: 'Reefer Cold-Chain (14°C)',
  },
];

/* ========================================================================== */
/* MAIN PAGE                                                                  */
/* ========================================================================== */

export default function TransportationDashboardPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'active_trips' | 'load_board' | 'ledger'
  >('active_trips');

  /* ------------------------------------------------------------------------ */
  /* ONBOARDING                                                               */
  /* ------------------------------------------------------------------------ */

  const [isOnboardingModalOpen, setIsOnboardingModalOpen] =
    useState<boolean>(false);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  /* ------------------------------------------------------------------------ */
  /* TRANSPORTER PROFILE                                                      */
  /* ------------------------------------------------------------------------ */

  const [carrierProfile, setCarrierProfile] =
    useState<TransporterFleetProfile>(() => {
      return DEMO_TRANSPORTER_PROFILE;
    });

  /* ------------------------------------------------------------------------ */
  /* ORDERS                                                                   */
  /* ------------------------------------------------------------------------ */

  const [orders, setOrders] = useState<TransportationOrder[]>([]);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [isDetailDrawerOpen, setIsDetailDrawerOpen] =
    useState<boolean>(false);

  const [isOrdersSidePanelCollapsed, setIsOrdersSidePanelCollapsed] =
    useState<boolean>(false);

  /* ------------------------------------------------------------------------ */
  /* TENDERS                                                                  */
  /* ------------------------------------------------------------------------ */

  const [openTenders, setOpenTenders] =
    useState<OpenTenderItem[]>(DEFAULT_OPEN_TENDERS);

  const [selectedTenderId, setSelectedTenderId] =
    useState<string | null>('TEND-2026-091');

  const [isTendersSidePanelCollapsed, setIsTendersSidePanelCollapsed] =
    useState<boolean>(false);

  /* ------------------------------------------------------------------------ */
  /* LEDGER                                                                   */
  /* ------------------------------------------------------------------------ */

  const [ledgerItems, setLedgerItems] =
    useState<LedgerItem[]>(INITIAL_LEDGER_ITEMS);

  const [selectedEwayBill, setSelectedEwayBill] =
    useState<string | null>('EWB-2026-98412');

  const [isLedgerSidePanelCollapsed, setIsLedgerSidePanelCollapsed] =
    useState<boolean>(false);

  /* ------------------------------------------------------------------------ */
  /* TOAST                                                                    */
  /* ------------------------------------------------------------------------ */

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    toast.success(msg);

    setTimeout(() => {
      setToastMsg(null);
    }, 5000);
  };

  /* ======================================================================== */
  /* LOAD PROFILE + ORDERS                                                    */
  /* ======================================================================== */

  useEffect(() => {
    const loadProfileAndOrders = async () => {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      let foundDbProfile = false;

      try {
        localStorage.removeItem('kisansetu_transporter_profile');
        localStorage.removeItem('kisansetu_transporter_onboarded');
      } catch { }

      const userStorageKey = user?.email
        ? `kisansetu_transporter_profile_${user.email.toLowerCase()}`
        : null;

      const userOnboardedKey = user?.email
        ? `kisansetu_transporter_onboarded_${user.email.toLowerCase()}`
        : null;

      let dbUserName = user?.name || null;
      let dbUserPhone = user?.phone || null;

      if (user?.email) {
        try {
          const res = await fetch(
            `${apiUrl}/api/transporter/profile/me?email=${encodeURIComponent(
              user.email.trim()
            )}`
          );

          if (res.ok) {
            const data = await res.json();

            if (
              data.status === 'SUCCESS' &&
              data.profile &&
              data.is_onboarded
            ) {
              setCarrierProfile(data.profile);

              if (userStorageKey && userOnboardedKey) {
                localStorage.setItem(
                  userStorageKey,
                  JSON.stringify(data.profile)
                );

                localStorage.setItem(userOnboardedKey, 'true');
              }

              foundDbProfile = true;
            } else {
              if (data.user_name) {
                dbUserName = data.user_name;
              }

              if (data.user_phone) {
                dbUserPhone = data.user_phone;
              }
            }
          }
        } catch { }
      }

      if (!foundDbProfile) {
        try {
          const savedProfile = userStorageKey
            ? localStorage.getItem(userStorageKey)
            : null;

          const isOnboarded = userOnboardedKey
            ? localStorage.getItem(userOnboardedKey)
            : null;

          if (savedProfile && isOnboarded === 'true') {
            try {
              const parsed = JSON.parse(savedProfile);
              setCarrierProfile(parsed);
            } catch { }
          } else {
            const dynamicCarrierName =
              dbUserName || user?.name || 'My Fleet Logistics';

            setCarrierProfile({
              ...DEMO_TRANSPORTER_PROFILE,
              carrier_name: dynamicCarrierName,
              contact_phone:
                dbUserPhone || user?.phone || '+91 99887 76655',
              total_trips_completed: 0,
              available_escrow_balance_inr: 0,
              active_vehicles_on_road: 0,
              isOnboarded: false,
            });

            setIsOnboardingModalOpen(true);
            setIsEditMode(false);
            setOrders([]);
          }
        } catch { }
      }

      try {
        const orderStorageKey = user?.email
          ? `kisansetu_transporter_orders_${user.email.toLowerCase()}`
          : 'kisansetu_transporter_orders';

        const savedOrders = localStorage.getItem(orderStorageKey);

        const savedTenders = localStorage.getItem(
          'kisansetu_transporter_tenders'
        );

        if (savedOrders) {
          try {
            const parsedOrders = JSON.parse(savedOrders);

            if (Array.isArray(parsedOrders)) {
              setOrders(parsedOrders);

              if (parsedOrders.length > 0) {
                setSelectedOrderId(parsedOrders[0].id);
              }
            }
          } catch { }
        }

        if (savedTenders) {
          try {
            const parsedTenders = JSON.parse(savedTenders);

            if (Array.isArray(parsedTenders) && parsedTenders.length > 0) {
              setOpenTenders(parsedTenders);
            }
          } catch { }
        }
      } catch { }
    };

    loadProfileAndOrders();
  }, [user]);

  /* ======================================================================== */
  /* SELECTED DATA                                                            */
  /* ======================================================================== */

  const selectedOrder = useMemo(() => {
    if (orders.length === 0) {
      return null;
    }

    return (
      orders.find((o) => o.id === selectedOrderId) ||
      orders[0] ||
      null
    );
  }, [orders, selectedOrderId]);

  const selectedTender = useMemo(() => {
    return (
      openTenders.find((t) => t.id === selectedTenderId) ||
      openTenders[0] ||
      null
    );
  }, [openTenders, selectedTenderId]);

  const selectedLedgerItem = useMemo(() => {
    return (
      ledgerItems.find(
        (l) => l.ewayBillNumber === selectedEwayBill
      ) ||
      ledgerItems[0] ||
      null
    );
  }, [ledgerItems, selectedEwayBill]);

  const activeHauls = orders.filter(
    (o) => o.status === 'IN_TRANSIT'
  ).length;

  /* ======================================================================== */
  /* ORDER SELECTION                                                          */
  /* ======================================================================== */

  const handleSelectOrder = (order: TransportationOrder) => {
    setSelectedOrderId(order.id);

    /*
     * Detail is deliberately NOT opened as a floating drawer.
     * It is rendered below the map so the active trip remains
     * the main operational focus.
     */
    setIsDetailDrawerOpen(true);
  };

  /* ======================================================================== */
  /* SAVE FLEET PROFILE                                                       */
  /* ======================================================================== */

  const handleSaveFleetProfile = (
    profile: TransporterFleetProfile
  ) => {
    setCarrierProfile(profile);

    setIsOnboardingModalOpen(false);

    try {
      const userStorageKey = user?.email
        ? `kisansetu_transporter_profile_${user.email.toLowerCase()}`
        : 'kisansetu_transporter_profile';

      const userOnboardedKey = user?.email
        ? `kisansetu_transporter_onboarded_${user.email.toLowerCase()}`
        : 'kisansetu_transporter_onboarded';

      localStorage.setItem(
        userStorageKey,
        JSON.stringify(profile)
      );

      localStorage.setItem(userOnboardedKey, 'true');
    } catch { }

    showToast(
      `Fleet Profile for '${profile.carrier_name}' saved. Dashboard active with ${profile.total_trucks} registered trucks.`
    );
  };

  /* ======================================================================== */
  /* ACCEPT LOAD                                                              */
  /* ======================================================================== */

  const handleAcceptLoadFromDetail = (
    tender: OpenTenderItem,
    driverName: string,
    driverPhone: string,
    vehicleNo: string
  ) => {
    const newOrder: TransportationOrder = {
      id: `ORD-${Date.now() % 10000}`,

      lotId: tender.lot_id,

      ewayBillNumber: `EWB-2026-${Math.floor(
        10000 + Math.random() * 90000
      )}`,

      customerName: 'KisanSetu Mandi Procurement',

      farmerName: tender.farmer_name,

      farmerPhone: '+91 98231 77112',

      status: 'ASSIGNED',

      deliveryStatus: 'ON_TIME',

      priority: 'HIGH',

      transportMode: tender.required_vehicle.includes('Reefer')
        ? 'Reefer Truck'
        : 'Truck',

      origin: {
        name: tender.origin,
        lat: 19.9975,
        lng: 73.7898,
      },

      destination: {
        name: tender.destination,
        lat: 19.076,
        lng: 72.998,
      },

      pickupTime: new Date().toISOString(),

      estimatedArrivalTime: new Date(
        Date.now() + 4 * 3600 * 1000
      ).toISOString(),

      totalDistanceKm: 168,

      completedDistanceKm: 0,

      distanceRemainingKm: 168,

      delayMinutes: 0,

      totalFreightInr: tender.total_freight_inr,

      advanceFreightInr: tender.advance_30_pct_inr,

      advanceClaimed: false,

      balanceFreightInr:
        tender.total_freight_inr -
        tender.advance_30_pct_inr,

      farmGateOtp: '7192',

      driver: {
        name: driverName,
        phone: driverPhone,
      },

      vehicle: {
        registrationNumber: vehicleNo,

        type: tender.required_vehicle.includes('Reefer')
          ? 'Reefer Truck'
          : 'Truck',

        capacityTons: tender.quantity_tons,

        temperatureC: 14.2,

        humidityRh: 68,
      },

      shipment: {
        packagesCount: Math.round(
          tender.quantity_tons * 20
        ),

        weightTons: tender.quantity_tons,

        weightKg: Math.round(
          tender.quantity_tons * 1000
        ),

        cropName: tender.crop_name,

        variety: tender.variety,

        notes:
          'Assigned via KisanSetu Freight Load Board',
      },

      tracking: {
        isLive: true,

        lastUpdatedText: 'Assigned just now',

        currentLat: 19.9975,

        currentLng: 73.7898,

        speedKmh: 0,

        freshnessStatus: 'LIVE',
      },

      timeline: [
        {
          id: 'evt-101',

          title: 'Load Accepted & Assigned',

          description: `Assigned to ${driverName} (${vehicleNo})`,

          timestamp: 'Just now',

          status: 'COMPLETED',
        },
      ],

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...orders];

    const updatedTenders = openTenders.filter(
      (t) => t.id !== tender.id
    );

    setOrders(updatedOrders);

    setOpenTenders(updatedTenders);

    setSelectedOrderId(newOrder.id);

    setActiveTab('active_trips');

    setIsDetailDrawerOpen(true);

    setCarrierProfile((prev) => ({
      ...prev,

      available_escrow_balance_inr:
        prev.available_escrow_balance_inr +
        tender.total_freight_inr,

      active_vehicles_on_road:
        prev.active_vehicles_on_road + 1,
    }));

    try {
      const orderStorageKey = user?.email
        ? `kisansetu_transporter_orders_${user.email.toLowerCase()}`
        : 'kisansetu_transporter_orders';

      localStorage.setItem(
        orderStorageKey,
        JSON.stringify(updatedOrders)
      );

      localStorage.setItem(
        'kisansetu_transporter_tenders',
        JSON.stringify(updatedTenders)
      );
    } catch { }

    showToast(
      `Load accepted! ${tender.crop_name} assigned to ${driverName} (${vehicleNo}). Live tracking enabled.`
    );
  };

  /* ======================================================================== */
  /* CLAIM ADVANCE                                                            */
  /* ======================================================================== */

  const handleClaimAdvanceForOrder = (
    targetOrder: TransportationOrder
  ) => {
    const updated = orders.map((o) =>
      o.id === targetOrder.id
        ? {
          ...o,
          advanceClaimed: true,
          advanceUtr: 'UTR-ICICI-ADV-894210',
          status: 'IN_TRANSIT' as const,
        }
        : o
    );

    setOrders(updated);

    try {
      const orderStorageKey = user?.email
        ? `kisansetu_transporter_orders_${user.email.toLowerCase()}`
        : 'kisansetu_transporter_orders';

      localStorage.setItem(
        orderStorageKey,
        JSON.stringify(updated)
      );
    } catch { }

    setLedgerItems((prev) => [
      {
        ewayBillNumber:
          targetOrder.ewayBillNumber,

        cropName:
          targetOrder.shipment.cropName,

        variety:
          targetOrder.shipment.variety,

        weightTons:
          targetOrder.shipment.weightTons,

        corridor: `${targetOrder.origin.name} ➔ ${targetOrder.destination.name}`,

        advanceInr:
          targetOrder.advanceFreightInr,

        settlementInr:
          targetOrder.balanceFreightInr,

        totalInr:
          targetOrder.totalFreightInr,

        status: 'ADVANCE_PAID',

        utr: 'UTR-ICICI-ADV-894210',

        settledAt: 'Today',
      },

      ...prev,
    ]);

    showToast(
      `30% advance of ₹${targetOrder.advanceFreightInr.toLocaleString(
        'en-IN'
      )} credited to Fuel Card.`
    );
  };

  /* ======================================================================== */
  /* VERIFY FARM GATE OTP                                                     */
  /* ======================================================================== */

  const handleVerifyOtpForOrder = (
    targetOrder: TransportationOrder
  ) => {
    const updated = orders.map((o) =>
      o.id === targetOrder.id
        ? {
          ...o,
          status: 'IN_TRANSIT' as const,
          deliveryStatus: 'ON_TIME' as const,
        }
        : o
    );

    setOrders(updated);

    try {
      const orderStorageKey = user?.email
        ? `kisansetu_transporter_orders_${user.email.toLowerCase()}`
        : 'kisansetu_transporter_orders';

      localStorage.setItem(
        orderStorageKey,
        JSON.stringify(updated)
      );
    } catch { }

    showToast(
      `Farm gate verification completed. Produce loaded onto ${targetOrder.vehicle.registrationNumber}.`
    );
  };

  /* ======================================================================== */
  /* MARK ARRIVAL                                                             */
  /* ======================================================================== */

  const handleMarkArrivalForOrder = (
    targetOrder: TransportationOrder
  ) => {
    const updated = orders.map((o) =>
      o.id === targetOrder.id
        ? {
          ...o,
          status: 'ARRIVED_AT_MANDI' as const,
          deliveryStatus: 'ON_TIME' as const,
          completedDistanceKm: o.totalDistanceKm,
          distanceRemainingKm: 0,
        }
        : o
    );

    setOrders(updated);

    try {
      const orderStorageKey = user?.email
        ? `kisansetu_transporter_orders_${user.email.toLowerCase()}`
        : 'kisansetu_transporter_orders';

      localStorage.setItem(
        orderStorageKey,
        JSON.stringify(updated)
      );
    } catch { }

    setLedgerItems((prev) =>
      prev.map((l) =>
        l.ewayBillNumber ===
          targetOrder.ewayBillNumber
          ? {
            ...l,
            status: 'SETTLED',
            utr: 'UTR-ICICI-SETTLE-998822',
            settledAt: 'Just Now',
          }
          : l
      )
    );

    showToast(
      `Vehicle ${targetOrder.vehicle.registrationNumber} arrived at Mandi Yard. Buyer notified for weighbridge handover.`
    );
  };

  /* ======================================================================== */
  /* DEMO TRIP                                                                */
  /* ======================================================================== */

  const handleLoadDemoTrip = () => {
    setOrders(INITIAL_TRANSPORTATION_ORDERS);

    setSelectedOrderId('ORD-2026-881');

    setIsDetailDrawerOpen(true);

    setCarrierProfile(DEMO_TRANSPORTER_PROFILE);

    try {
      localStorage.setItem(
        'kisansetu_transporter_orders',
        JSON.stringify(INITIAL_TRANSPORTATION_ORDERS)
      );

      localStorage.setItem(
        'kisansetu_transporter_profile',
        JSON.stringify(DEMO_TRANSPORTER_PROFILE)
      );

      localStorage.setItem(
        'kisansetu_transporter_onboarded',
        'true'
      );
    } catch { }

    showToast(
      'Demo active trip loaded for testing.'
    );
  };

  /* ======================================================================== */
  /* RESET                                                                    */
  /* ======================================================================== */

  const handleResetToEmptyState = () => {
    setOrders([]);

    setSelectedOrderId(null);

    setIsDetailDrawerOpen(false);

    setOpenTenders(DEFAULT_OPEN_TENDERS);

    try {
      localStorage.removeItem(
        'kisansetu_transporter_orders'
      );

      localStorage.removeItem(
        'kisansetu_transporter_tenders'
      );
    } catch { }

    showToast(
      'Clean empty state initialized. Looking for new loads.'
    );
  };

  /* ======================================================================== */
  /* RENDER                                                                   */
  /* ======================================================================== */

  return (
    <ProtectedRoute
      allowedRoles={['TRANSPORTATION', 'ADMIN']}
    >
      <div className="min-h-screen flex flex-col bg-[#faf7f2] text-slate-900 font-sans overflow-x-hidden">
        <Navbar activeRole="TRANSPORTATION" />

        {/* ================================================================== */}
        {/* ONBOARDING                                                         */}
        {/* ================================================================== */}

        <TransporterOnboardingModal
          isOpen={isOnboardingModalOpen}
          onClose={() =>
            setIsOnboardingModalOpen(false)
          }
          onSaveProfile={handleSaveFleetProfile}
          initialProfile={carrierProfile}
          isEditMode={isEditMode}
          userEmail={user?.email}
          userId={user?.id}
        />

        {/* ================================================================== */}
        {/* FLEET HEADER                                                        */}
        {/* ================================================================== */}

        <header className="sticky top-0 z-40 bg-[#014532] text-white border-b border-emerald-950 shadow-lg">
          <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

              {/* Transporter Identity */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                  <Truck
                    size={23}
                    className="text-emerald-100"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-bold tracking-tight truncate">
                      {carrierProfile.carrier_name}
                    </h1>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800/80 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-bold tracking-wide text-emerald-50">
                      <ShieldCheck size={11} />
                      VERIFIED
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-emerald-100/75">
                    <span>
                      GSTIN:{' '}
                      <strong className="text-white">
                        {carrierProfile.gstin}
                      </strong>
                    </span>

                    <span className="hidden sm:inline">
                      •
                    </span>

                    <span>
                      {carrierProfile.total_trucks}{' '}
                      trucks managed
                    </span>

                    <span className="hidden sm:inline">
                      •
                    </span>

                    <span>
                      ★ {carrierProfile.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Metrics */}
              <div className="flex flex-wrap items-center gap-2">

                <div className="rounded-xl bg-white/10 border border-white/10 px-4 py-2.5 min-w-[150px]">
                  <p className="text-[10px] uppercase tracking-wide text-emerald-100/60">
                    Available Freight
                  </p>

                  <p className="text-lg font-bold text-white">
                    ₹
                    {carrierProfile.available_escrow_balance_inr.toLocaleString(
                      'en-IN'
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 border border-white/10 px-4 py-2.5 min-w-[125px]">
                  <p className="text-[10px] uppercase tracking-wide text-emerald-100/60">
                    Active Trips
                  </p>

                  <p className="text-lg font-bold text-white flex items-center gap-2">
                    {activeHauls > 0 && (
                      <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                    )}

                    {activeHauls}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditMode(true);
                    setIsOnboardingModalOpen(true);
                  }}
                  className="h-10 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  <Settings2
                    size={14}
                    className="mr-2"
                  />
                  Fleet & Rates
                </Button>

                {orders.length === 0 ? (
                  <Button
                    size="sm"
                    onClick={handleLoadDemoTrip}
                    className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    <Sparkles
                      size={14}
                      className="mr-2 text-amber-300"
                    />
                    Demo Trip
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleResetToEmptyState}
                    className="h-10 rounded-xl border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <RotateCcw
                      size={13}
                      className="mr-2"
                    />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* NAVIGATION                                                        */}
          {/* ================================================================= */}

          <div className="border-t border-white/10">
            <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex gap-2 py-2 overflow-x-auto">

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab('active_trips')
                  }
                  className={`shrink-0 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeTab === 'active_trips'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-emerald-100/75 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <Navigation size={14} />
                  Active Trips
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${activeTab === 'active_trips'
                        ? 'bg-white/15'
                        : 'bg-white/10'
                      }`}
                  >
                    {orders.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab('load_board')
                  }
                  className={`shrink-0 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeTab === 'load_board'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-emerald-100/75 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <PackageCheck size={14} />
                  Find Loads
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${activeTab === 'load_board'
                        ? 'bg-white/15'
                        : 'bg-white/10'
                      }`}
                  >
                    {openTenders.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab('ledger')
                  }
                  className={`shrink-0 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeTab === 'ledger'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-emerald-100/75 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <DollarSign size={14} />
                  Payments
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* ================================================================== */}
        {/* MAIN                                                                */}
        {/* ================================================================== */}

        <main className="flex-1 w-full min-w-0">

          {/* Toast */}
          {toastMsg && (
            <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2
                  size={17}
                  className="text-emerald-700 shrink-0"
                />

                <span className="truncate">
                  {toastMsg}
                </span>
              </div>

              <button
                onClick={() => setToastMsg(null)}
                className="text-emerald-800 hover:text-emerald-950 font-bold shrink-0"
              >
                ×
              </button>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 1 — ACTIVE TRIPS                                             */}
          {/* ================================================================= */}

          {activeTab === 'active_trips' && (
            <div className="w-full px-4 sm:px-6 lg:px-8 py-5">

              {/* ============================================================= */}
              {/* EMPTY STATE                                                    */}
              {/* ============================================================= */}

              {orders.length === 0 ? (
                <div className="max-w-[1300px] mx-auto">

                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                    <div className="px-6 sm:px-8 py-7 border-b border-slate-100">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />

                            <span className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                              Fleet ready
                            </span>
                          </div>

                          <h2 className="text-2xl font-bold text-slate-900">
                            No active trips
                          </h2>

                          <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
                            {carrierProfile.carrier_name} is verified and has{' '}
                            <strong className="text-slate-700">
                              {carrierProfile.total_trucks} commercial trucks
                            </strong>{' '}
                            registered. Browse available loads when you're ready to dispatch.
                          </p>
                        </div>

                        <Button
                          onClick={() =>
                            setActiveTab('load_board')
                          }
                          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shrink-0"
                        >
                          <PackageCheck
                            size={16}
                            className="mr-2"
                          />
                          Find Available Loads
                          <ArrowRight
                            size={15}
                            className="ml-2"
                          />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100">

                      <div className="p-5">
                        <p className="text-xs text-slate-400">
                          Fleet Size
                        </p>

                        <p className="mt-1 text-xl font-bold text-slate-900">
                          {carrierProfile.total_trucks}
                        </p>

                        <p className="text-xs text-slate-500">
                          trucks
                        </p>
                      </div>

                      <div className="p-5">
                        <p className="text-xs text-slate-400">
                          Base Rate
                        </p>

                        <p className="mt-1 text-xl font-bold text-slate-900">
                          ₹{carrierProfile.base_rate}
                        </p>

                        <p className="text-xs text-slate-500">
                          {carrierProfile.rate_unit ===
                            'INR_PER_KG'
                            ? 'per kg'
                            : 'per tonne-km'}
                        </p>
                      </div>

                      <div className="p-5">
                        <p className="text-xs text-slate-400">
                          Minimum Freight
                        </p>

                        <p className="mt-1 text-xl font-bold text-slate-900">
                          ₹
                          {carrierProfile.min_freight_charge.toLocaleString(
                            'en-IN'
                          )}
                        </p>
                      </div>

                      <div className="p-5 bg-emerald-50/50">
                        <p className="text-xs text-emerald-700">
                          Fuel Advance
                        </p>

                        <p className="mt-1 text-xl font-bold text-emerald-800">
                          30%
                        </p>

                        <p className="text-xs text-emerald-700">
                          available after assignment
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center gap-3">
                      <Compass
                        size={18}
                        className="text-blue-600"
                      />

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Live tracking becomes available after a load is accepted
                        </p>

                        <p className="text-xs text-slate-500 mt-0.5">
                          GPS location, vehicle speed, temperature, humidity and farm-gate verification will appear here.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ============================================================= */
                /* ACTIVE TRIP WORKSPACE                                        */
                /* ============================================================= */

                <div className="w-full max-w-[1700px] mx-auto min-w-0">

                  {/* =========================================================== */}
                  {/* TOP: ORDER LIST + MAP                                      */}
                  {/* =========================================================== */}

                  <div className="grid grid-cols-12 gap-5 items-stretch">

                    {/* --------------------------------------------------------- */}
                    {/* LEFT ORDERS PANEL                                        */}
                    {/* --------------------------------------------------------- */}

                    <aside
                      className={`${isOrdersSidePanelCollapsed
                          ? 'col-span-12 lg:col-span-1'
                          : 'col-span-12 lg:col-span-3 xl:col-span-3'
                        } min-w-0 overflow-hidden transition-all duration-300`}
                    >
                      <div className="h-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <OrderSidePanel
                          orders={orders}
                          selectedOrderId={
                            selectedOrderId
                          }
                          onSelectOrder={
                            handleSelectOrder
                          }
                          isCollapsed={
                            isOrdersSidePanelCollapsed
                          }
                          onToggleCollapse={() =>
                            setIsOrdersSidePanelCollapsed(
                              !isOrdersSidePanelCollapsed
                            )
                          }
                          onBrowseTenders={() =>
                            setActiveTab('load_board')
                          }
                        />
                      </div>
                    </aside>

                    {/* --------------------------------------------------------- */}
                    {/* MAIN ACTIVE TRIP MAP                                     */}
                    {/* --------------------------------------------------------- */}

                    <section
                      className={`${isOrdersSidePanelCollapsed
                          ? 'col-span-12 lg:col-span-11'
                          : 'col-span-12 lg:col-span-9 xl:col-span-9'
                        } min-w-0`}
                    >
                      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                        {/* Active Trip Header */}
                        {selectedOrder && (
                          <div className="px-5 sm:px-6 py-5 border-b border-slate-100">

                            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">

                              <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                    Active Trip
                                  </span>

                                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                                    {selectedOrder.status.replace(
                                      /_/g,
                                      ' '
                                    )}
                                  </span>
                                </div>

                                <h2 className="mt-2 text-xl font-bold text-slate-900">
                                  {selectedOrder.id}
                                </h2>

                                <p className="mt-1 text-sm text-slate-600">
                                  {selectedOrder.shipment.cropName}
                                  {' • '}
                                  {selectedOrder.shipment.weightTons} MT
                                  {' • '}
                                  {selectedOrder.shipment.variety}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">

                                <div>
                                  <p className="text-xs text-slate-400">
                                    Transporter
                                  </p>

                                  <p className="font-semibold text-slate-800">
                                    {carrierProfile.carrier_name}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-slate-400">
                                    Driver
                                  </p>

                                  <p className="font-semibold text-slate-800">
                                    {selectedOrder.driver.name}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-slate-400">
                                    Vehicle
                                  </p>

                                  <p className="font-semibold text-slate-800">
                                    {selectedOrder.vehicle.registrationNumber}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Route */}
                            <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 text-sm">

                              <div className="flex items-center gap-2 min-w-0">
                                <MapPin
                                  size={16}
                                  className="text-emerald-600 shrink-0"
                                />

                                <span className="font-medium text-slate-700 truncate">
                                  {selectedOrder.origin.name}
                                </span>
                              </div>

                              <ArrowRight
                                size={16}
                                className="hidden sm:block text-slate-300 shrink-0"
                              />

                              <div className="flex items-center gap-2 min-w-0">
                                <Warehouse
                                  size={16}
                                  className="text-blue-600 shrink-0"
                                />

                                <span className="font-medium text-slate-700 truncate">
                                  {selectedOrder.destination.name}
                                </span>
                              </div>

                              <div className="sm:ml-auto flex items-center gap-4 text-xs text-slate-500">
                                <span>
                                  {selectedOrder.distanceRemainingKm} km remaining
                                </span>

                                <span>
                                  ETA{' '}
                                  {new Date(
                                    selectedOrder.estimatedArrivalTime
                                  ).toLocaleTimeString(
                                    'en-IN',
                                    {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Map */}
                        <div className="h-[520px] min-h-[420px] w-full relative">
                          <ShipmentTracker
                            lotId={
                              selectedOrder?.lotId ||
                              'LOT-1'
                            }
                            cropName={
                              selectedOrder?.shipment
                                .cropName ||
                              'Sharbati Wheat'
                            }
                            farmerName={
                              selectedOrder?.farmerName ||
                              'Ramesh Patil'
                            }
                            carrierName={
                              carrierProfile.carrier_name
                            }
                            vehicleNumber={
                              selectedOrder?.vehicle
                                .registrationNumber ||
                              'MH-15-EG-4421'
                            }
                            driverName={
                              selectedOrder?.driver
                                .name ||
                              'Suresh Rathod'
                            }
                            driverPhone={
                              selectedOrder?.driver
                                .phone ||
                              '+91 98231 49821'
                            }
                            originName={
                              selectedOrder?.origin
                                .name ||
                              'Nashik Farm Gate Cluster'
                            }
                            destinationName={
                              selectedOrder
                                ?.destination.name ||
                              'Vashi APMC Mandi Yard'
                            }
                          />
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* =========================================================== */}
                  {/* TRIP DETAILS — DELIBERATELY BELOW MAP                     */}
                  {/* =========================================================== */}

                  {selectedOrder && (
                    <section className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                      {/* Section Heading */}
                      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Trip details
                          </p>

                          <h3 className="mt-1 text-lg font-bold text-slate-900">
                            {selectedOrder.id}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">
                            E-Way Bill
                          </span>

                          <span className="text-xs font-semibold text-slate-800">
                            {selectedOrder.ewayBillNumber}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setIsDetailDrawerOpen(
                                !isDetailDrawerOpen
                              )
                            }
                            className="ml-2 text-xs font-semibold text-blue-600 hover:text-blue-800"
                          >
                            {isDetailDrawerOpen
                              ? 'Hide details'
                              : 'Show details'}
                          </button>
                        </div>
                      </div>

                      {/* ======================================================= */}
                      {/* SUMMARY METRICS                                         */}
                      {/* ======================================================= */}

                      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-100">

                        <div className="p-4 sm:p-5 border-r border-slate-100">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Gauge size={15} />
                            <span className="text-xs">
                              Speed
                            </span>
                          </div>

                          <p className="mt-2 text-xl font-bold text-slate-900">
                            {selectedOrder.tracking.speedKmh}{' '}
                            <span className="text-xs font-medium text-slate-400">
                              km/h
                            </span>
                          </p>
                        </div>

                        <div className="p-4 sm:p-5 border-r border-slate-100">
                          <div className="flex items-center gap-2 text-amber-600">
                            <Thermometer size={15} />
                            <span className="text-xs">
                              Temperature
                            </span>
                          </div>

                          <p className="mt-2 text-xl font-bold text-slate-900">
                            {selectedOrder.vehicle.temperatureC}
                            °C
                          </p>
                        </div>

                        <div className="p-4 sm:p-5 border-r border-slate-100">
                          <div className="flex items-center gap-2 text-blue-600">
                            <Droplets size={15} />
                            <span className="text-xs">
                              Humidity
                            </span>
                          </div>

                          <p className="mt-2 text-xl font-bold text-slate-900">
                            {selectedOrder.vehicle.humidityRh}
                            %
                          </p>
                        </div>

                        <div className="p-4 sm:p-5">
                          <div className="flex items-center gap-2 text-emerald-600">
                            <Route size={15} />
                            <span className="text-xs">
                              Distance
                            </span>
                          </div>

                          <p className="mt-2 text-xl font-bold text-slate-900">
                            {selectedOrder.distanceRemainingKm}
                            <span className="text-xs font-medium text-slate-400">
                              {' '}
                              km left
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* ======================================================= */}
                      {/* DETAILS ONLY WHEN REQUESTED                             */}
                      {/* ======================================================= */}

                      {isDetailDrawerOpen && (
                        <div className="p-5 sm:p-6">

                          <div className="grid grid-cols-12 gap-5">

                            {/* LEFT — TRIP INFORMATION */}
                            <div className="col-span-12 lg:col-span-8 min-w-0">

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

                                <div className="flex items-start gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                    <UserRound
                                      size={16}
                                      className="text-slate-600"
                                    />
                                  </div>

                                  <div>
                                    <p className="text-xs text-slate-400">
                                      Driver
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                      {selectedOrder.driver.name}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                      {selectedOrder.driver.phone}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                    <Truck
                                      size={16}
                                      className="text-slate-600"
                                    />
                                  </div>

                                  <div>
                                    <p className="text-xs text-slate-400">
                                      Vehicle
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                      {selectedOrder.vehicle.registrationNumber}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                      {selectedOrder.vehicle.type}
                                      {' • '}
                                      {selectedOrder.vehicle.capacityTons}
                                      {' MT'}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                    <UserRound
                                      size={16}
                                      className="text-emerald-700"
                                    />
                                  </div>

                                  <div>
                                    <p className="text-xs text-slate-400">
                                      Farmer
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                      {selectedOrder.farmerName}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                      {selectedOrder.farmerPhone}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                    <IndianRupee
                                      size={16}
                                      className="text-blue-700"
                                    />
                                  </div>

                                  <div>
                                    <p className="text-xs text-slate-400">
                                      Freight
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                      ₹
                                      {selectedOrder.totalFreightInr.toLocaleString(
                                        'en-IN'
                                      )}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                      Advance ₹
                                      {selectedOrder.advanceFreightInr.toLocaleString(
                                        'en-IN'
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Highway progress */}
                              <div className="mt-7 pt-6 border-t border-slate-100">

                                <div className="flex items-center justify-between gap-4">
                                  <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                      Highway progress
                                    </p>

                                    <p className="text-xs text-slate-500 mt-0.5">
                                      {selectedOrder.completedDistanceKm}
                                      {' km completed of '}
                                      {selectedOrder.totalDistanceKm}
                                      {' km'}
                                    </p>
                                  </div>

                                  <span className="text-sm font-bold text-blue-700">
                                    {Math.round(
                                      (selectedOrder.completedDistanceKm /
                                        Math.max(
                                          selectedOrder.totalDistanceKm,
                                          1
                                        )) *
                                      100
                                    )}
                                    %
                                  </span>
                                </div>

                                <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-blue-600 transition-all"
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        Math.max(
                                          0,
                                          (selectedOrder.completedDistanceKm /
                                            Math.max(
                                              selectedOrder.totalDistanceKm,
                                              1
                                            )) *
                                          100
                                        )
                                      )}%`,
                                    }}
                                  />
                                </div>

                                <div className="mt-3 flex justify-between text-[11px] text-slate-400">
                                  <span>
                                    {selectedOrder.origin.name}
                                  </span>

                                  <span>
                                    {selectedOrder.destination.name}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* RIGHT — ACTIONS */}
                            <div className="col-span-12 lg:col-span-4 min-w-0">

                              <div className="h-full rounded-xl bg-slate-50 border border-slate-200 p-4">

                                <div className="flex items-center gap-2">
                                  <Activity
                                    size={16}
                                    className="text-blue-600"
                                  />

                                  <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                      Trip actions
                                    </p>

                                    <p className="text-xs text-slate-500">
                                      Complete each step as the trip progresses.
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-5 space-y-3">

                                  <div className="flex items-center gap-3">
                                    {selectedOrder.advanceClaimed ? (
                                      <CheckCircle2
                                        size={17}
                                        className="text-emerald-600 shrink-0"
                                      />
                                    ) : (
                                      <Circle
                                        size={17}
                                        className="text-slate-300 shrink-0"
                                      />
                                    )}

                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-slate-700">
                                        30% advance
                                      </p>

                                      {!selectedOrder.advanceClaimed && (
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            handleClaimAdvanceForOrder(
                                              selectedOrder
                                            )
                                          }
                                          className="mt-2 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                        >
                                          Get Advance
                                        </Button>
                                      )}
                                    </div>
                                  </div>

                                  <div className="h-px bg-slate-200" />

                                  <div className="flex items-center gap-3">
                                    {selectedOrder.status ===
                                      'IN_TRANSIT' ||
                                      selectedOrder.status ===
                                      'ARRIVED_AT_MANDI' ? (
                                      <CheckCircle2
                                        size={17}
                                        className="text-emerald-600 shrink-0"
                                      />
                                    ) : (
                                      <Circle
                                        size={17}
                                        className="text-slate-300 shrink-0"
                                      />
                                    )}

                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-slate-700">
                                        Confirm farm loading
                                      </p>

                                      {selectedOrder.status !==
                                        'IN_TRANSIT' &&
                                        selectedOrder.status !==
                                        'ARRIVED_AT_MANDI' && (
                                          <Button
                                            size="sm"
                                            onClick={() =>
                                              handleVerifyOtpForOrder(
                                                selectedOrder
                                              )
                                            }
                                            className="mt-2 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                          >
                                            Confirm Load
                                          </Button>
                                        )}
                                    </div>
                                  </div>

                                  <div className="h-px bg-slate-200" />

                                  <div className="flex items-center gap-3">
                                    {selectedOrder.status ===
                                      'ARRIVED_AT_MANDI' ? (
                                      <CheckCircle2
                                        size={17}
                                        className="text-emerald-600 shrink-0"
                                      />
                                    ) : (
                                      <Circle
                                        size={17}
                                        className="text-slate-300 shrink-0"
                                      />
                                    )}

                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-slate-700">
                                        Mandi arrival
                                      </p>

                                      {selectedOrder.status !==
                                        'ARRIVED_AT_MANDI' && (
                                          <Button
                                            size="sm"
                                            onClick={() =>
                                              handleMarkArrivalForOrder(
                                                selectedOrder
                                              )
                                            }
                                            className="mt-2 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                          >
                                            Mark Arrival
                                          </Button>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </section>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2 — FIND LOADS                                               */}
          {/* ================================================================= */}

          {activeTab === 'load_board' && (
            <div className="w-full px-4 sm:px-6 lg:px-8 py-5">

              <div className="w-full max-w-[1700px] mx-auto min-w-0">

                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    Freight marketplace
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    Available Loads
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Review farm-to-mandi transport requirements and accept the loads that fit your fleet.
                  </p>
                </div>

                <div className="grid grid-cols-12 gap-5 min-w-0">

                  <aside
                    className={`${isTendersSidePanelCollapsed
                        ? 'col-span-12 lg:col-span-1'
                        : 'col-span-12 lg:col-span-4 xl:col-span-3'
                      } min-w-0 overflow-hidden`}
                  >
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                      <TenderSidePanel
                        tenders={openTenders}
                        selectedTenderId={
                          selectedTenderId
                        }
                        onSelectTender={(t) =>
                          setSelectedTenderId(t.id)
                        }
                        isCollapsed={
                          isTendersSidePanelCollapsed
                        }
                        onToggleCollapse={() =>
                          setIsTendersSidePanelCollapsed(
                            !isTendersSidePanelCollapsed
                          )
                        }
                      />
                    </div>
                  </aside>

                  <section
                    className={`${isTendersSidePanelCollapsed
                        ? 'col-span-12 lg:col-span-11'
                        : 'col-span-12 lg:col-span-8 xl:col-span-9'
                      } min-w-0`}
                  >
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden p-1">
                      <TenderDetailView
                        tender={selectedTender}
                        onAcceptLoad={
                          handleAcceptLoadFromDetail
                        }
                      />
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3 — PAYMENTS                                                 */}
          {/* ================================================================= */}

          {activeTab === 'ledger' && (
            <div className="w-full px-4 sm:px-6 lg:px-8 py-5">

              <div className="w-full max-w-[1700px] mx-auto min-w-0">

                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                    Payments
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    Payout Ledger
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Track advances, freight settlements and e-way bill payments.
                  </p>
                </div>

                <div className="grid grid-cols-12 gap-5 min-w-0">

                  <aside
                    className={`${isLedgerSidePanelCollapsed
                        ? 'col-span-12 lg:col-span-1'
                        : 'col-span-12 lg:col-span-4 xl:col-span-3'
                      } min-w-0 overflow-hidden`}
                  >
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                      <LedgerSidePanel
                        ledgerItems={ledgerItems}
                        selectedEwayBill={
                          selectedEwayBill
                        }
                        onSelectLedgerItem={(l) =>
                          setSelectedEwayBill(
                            l.ewayBillNumber
                          )
                        }
                        isCollapsed={
                          isLedgerSidePanelCollapsed
                        }
                        onToggleCollapse={() =>
                          setIsLedgerSidePanelCollapsed(
                            !isLedgerSidePanelCollapsed
                          )
                        }
                      />
                    </div>
                  </aside>

                  <section
                    className={`${isLedgerSidePanelCollapsed
                        ? 'col-span-12 lg:col-span-11'
                        : 'col-span-12 lg:col-span-8 xl:col-span-9'
                      } min-w-0`}
                  >
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden p-1">
                      <LedgerDetailView
                        item={selectedLedgerItem}
                        onDownloadInvoice={(item) =>
                          showToast(
                            `Tax Invoice for ${item.ewayBillNumber} downloaded.`
                          )
                        }
                      />
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}