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
  X
} from 'lucide-react';
import { ShipmentTracker } from '@/components/dashboard/ShipmentTracker';
import { OrderSidePanel } from '@/components/transportation/OrderSidePanel';
import { OrderDetailDrawer } from '@/components/transportation/OrderDetailDrawer';
import { TenderSidePanel, OpenTenderItem } from '@/components/transportation/TenderSidePanel';
import { TenderDetailView } from '@/components/transportation/TenderDetailView';
import { LedgerSidePanel, LedgerItem, INITIAL_LEDGER_ITEMS } from '@/components/transportation/LedgerSidePanel';
import { LedgerDetailView } from '@/components/transportation/LedgerDetailView';
import { 
  TransportationOrder, 
  INITIAL_TRANSPORTATION_ORDERS, 
  adaptTripToOrder 
} from '@/lib/transportation-types';

interface CarrierProfile {
  carrier_name: string;
  gstin: string;
  rating: number;
  total_trips_completed: number;
  available_escrow_balance_inr: number;
  active_vehicles_on_road: number;
}

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
  }
];

export default function TransportationDashboardPage() {
  const [activeTab, setActiveTab] = useState<'active_trips' | 'load_board' | 'ledger'>('active_trips');

  // Profile State
  const [carrierProfile, setCarrierProfile] = useState<CarrierProfile>({
    carrier_name: 'Kisan Express Logistics',
    gstin: '27AABCK9981F1Z2',
    rating: 4.9,
    total_trips_completed: 142,
    available_escrow_balance_inr: 42800.0,
    active_vehicles_on_road: 3
  });

  // TAB 1: Transportation Orders & Map State
  const [orders, setOrders] = useState<TransportationOrder[]>(INITIAL_TRANSPORTATION_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('ORD-2026-881');
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
    setTimeout(() => setToastMsg(null), 5000);
  };

  // Selected Order computed
  const selectedOrder = useMemo(() => {
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

  // Action: Accept Load in Tender View
  const handleAcceptLoadFromDetail = (tender: OpenTenderItem, driverName: string, driverPhone: string, vehicleNo: string) => {
    const newOrder: TransportationOrder = {
      id: `ORD-${Date.now() % 1000}`,
      lotId: tender.lot_id,
      ewayBillNumber: `EWB-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: 'KisanSetu Mandi Procurement',
      farmerName: tender.farmer_name,
      farmerPhone: '+91 98231 77112',
      status: 'ASSIGNED',
      deliveryStatus: 'ON_TIME',
      priority: 'HIGH',
      transportMode: 'Reefer Truck',
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
      vehicle: { registrationNumber: vehicleNo, type: 'Reefer Truck', capacityTons: tender.quantity_tons },
      shipment: {
        packagesCount: Math.round(tender.quantity_tons * 20),
        weightTons: tender.quantity_tons,
        weightKg: Math.round(tender.quantity_tons * 1000),
        cropName: tender.crop_name,
        variety: tender.variety
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

    setOrders(prev => [newOrder, ...prev]);
    setOpenTenders(prev => prev.filter(t => t.id !== tender.id));
    setSelectedOrderId(newOrder.id);
    setActiveTab('active_trips');
    showToast(`🎉 Load accepted! Assigned to ${driverName} (${vehicleNo}).`);
  };

  // Action: Claim Fuel Advance
  const handleClaimAdvanceForOrder = (targetOrder: TransportationOrder) => {
    setOrders(prev => prev.map(o => o.id === targetOrder.id ? {
      ...o,
      advanceClaimed: true,
      advanceUtr: 'UTR-ICICI-ADV-894210',
      status: 'IN_TRANSIT'
    } : o));

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
    setOrders(prev => prev.map(o => o.id === targetOrder.id ? {
      ...o,
      status: 'IN_TRANSIT',
      deliveryStatus: 'ON_TIME'
    } : o));
    showToast(`🔑 Farmgate OTP verified! Produce loaded onto ${targetOrder.vehicle.registrationNumber}.`);
  };

  // Action: Mark Arrival at Mandi Yard
  const handleMarkArrivalForOrder = (targetOrder: TransportationOrder) => {
    setOrders(prev => prev.map(o => o.id === targetOrder.id ? {
      ...o,
      status: 'ARRIVED_AT_MANDI',
      deliveryStatus: 'ON_TIME',
      completedDistanceKm: o.totalDistanceKm,
      distanceRemainingKm: 0
    } : o));

    setLedgerItems(prev => prev.map(l => l.ewayBillNumber === targetOrder.ewayBillNumber ? {
      ...l,
      status: 'SETTLED',
      utr: 'UTR-ICICI-SETTLE-998822',
      settledAt: 'Just Now'
    } : l));

    showToast(`🚛 Vehicle ${targetOrder.vehicle.registrationNumber} arrived at Mandi Yard. Buyer notified for weighbridge handover!`);
  };

  return (
    <ProtectedRoute allowedRoles={['TRANSPORTATION', 'ADMIN']}>
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
        <Navbar activeRole="TRANSPORTATION" />

      {/* ========================================================================= */}
      {/* 1. STICKY TOP FLEET COMMAND HEADER */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Fleet Profile */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-emerald-700/20">
              <Truck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-slate-900 tracking-tight">
                  {carrierProfile.carrier_name}
                </h1>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-mono">
                  VERIFIED LOGISTICS CARRIER
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono">
                  ★ {carrierProfile.rating} ({carrierProfile.total_trips_completed} Trips)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                GSTIN: <strong className="text-slate-800">{carrierProfile.gstin}</strong> • AIS-140 Live Fleet Control
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
              <strong className="text-emerald-900 font-black text-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                {orders.filter(o => o.status === 'IN_TRANSIT').length} On Highway
              </strong>
            </div>

            <Button
              size="sm"
              onClick={() => showToast('Fleet command board refreshed!')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs h-9 px-3.5 rounded-xl shadow-xs"
            >
              <RefreshCw size={13} className="mr-1.5" />
              Refresh Board
            </Button>
          </div>

        </div>

        {/* Sub-Navigation Tabs */}
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 border-t border-slate-100">
          <nav className="flex space-x-2 sm:space-x-4 py-1.5">
            
            <button
              type="button"
              onClick={() => setActiveTab('active_trips')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'active_trips'
                  ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Navigation size={14} />
              <span>Transportation Orders &amp; Map</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'active_trips' ? 'bg-emerald-900 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {orders.length} Orders
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('load_board')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'load_board'
                  ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PackageCheck size={14} />
              <span>Freight Load Board (Open Tenders)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'load_board' ? 'bg-emerald-900 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {openTenders.length} New
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ledger')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
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
            />

            {/* CENTER MAP AREA */}
            <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-3">
              {selectedOrder && (
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shrink-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{selectedOrder.id}</span>
                      <span className="font-mono text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px] font-bold">
                        {selectedOrder.shipment.cropName} ({selectedOrder.shipment.weightTons} MT)
                      </span>
                      <span className="font-mono text-emerald-800 text-[11px] font-bold">
                        Vehicle: {selectedOrder.vehicle.registrationNumber}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] pt-0.5">
                      Route: <strong>{selectedOrder.origin.name}</strong> ➔ <strong className="text-emerald-800">{selectedOrder.destination.name}</strong>
                    </p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => setIsDetailDrawerOpen(!isDetailDrawerOpen)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs h-8 px-3 rounded-xl shadow-xs"
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

            {/* INLINE NON-OVERLAPPING DETAIL PANEL ON RIGHT */}
            {isDetailDrawerOpen && (
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
