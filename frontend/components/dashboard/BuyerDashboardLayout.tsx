'use client';

import React from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  RefreshCw, 
  TrendingUp, 
  Store, 
  Truck, 
  Receipt, 
  Scale, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Gavel,
  Lock,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CropListingCard } from '@/components/dashboard/CropListingCard';
import { BuyerBadge } from '@/components/ui/BuyerBadge';
import { BidTable } from '@/components/dashboard/BidTable';
import { EscrowRails } from '@/components/dashboard/EscrowRails';
import { ShipmentTracker } from '@/components/dashboard/ShipmentTracker';
import { WeighbridgeSettlement } from '@/components/dashboard/WeighbridgeSettlement';
import { BuyerAnalyticsCards } from '@/components/dashboard/BuyerAnalyticsCards';
import { OrderHistoryTable } from '@/components/dashboard/OrderHistoryTable';
import { BiddingDrawer } from '@/components/dashboard/BiddingDrawer';
import { AIInspectionModal } from '@/components/dashboard/AIInspectionModal';
import { TaxInvoiceModal } from '@/components/dashboard/TaxInvoiceModal';
import { EmptyListingState } from '@/components/dashboard/EmptyListingState';
import { useBuyerState, BuyerTabType } from '@/lib/useBuyerState';

const MANDI_TICKER_ITEMS = [
  { mandi: 'Nashik APMC', crop: 'Sharbati Wheat', price: '₹2,450/qtl', trend: '+1.8%' },
  { mandi: 'Lasalgaon Hub', crop: 'Red Onion', price: '₹1,800/qtl', trend: '+2.4%' },
  { mandi: 'Pune Mandi', crop: 'Hybrid Tomato', price: '₹1,450/qtl', trend: '-0.9%' },
  { mandi: 'Karnal Yard', crop: '1121 Basmati', price: '₹6,800/qtl', trend: '+3.1%' },
  { mandi: 'Latur APMC', crop: 'Yellow Soybean', price: '₹4,400/qtl', trend: '+0.5%' },
  { mandi: 'Vashi Terminal', crop: 'Lok-1 Wheat', price: '₹2,580/qtl', trend: '+1.2%' }
];

export function BuyerDashboardLayout() {
  const {
    activeTab,
    setActiveTab,
    lots,
    bids,
    orders,
    analytics,
    activeVault,
    activeDealsCount,
    buyerProfile,
    toastMsg,
    setToastMsg,
    triggerToast,
    loadingBidLotId,
    // Inspection
    inspectionLot,
    isInspectionOpen,
    openInspection,
    closeInspection,
    // Bidding
    biddingLot,
    isBiddingOpen,
    openBidding,
    closeBidding,
    handleConfirmBidAndEscrow,
    // Weighbridge
    isWeighbridgeOpen,
    openWeighbridge,
    closeWeighbridge,
    handleSettlementComplete,
    handleDisputeRaised,
    // Invoice
    selectedInvoiceOrder,
    isInvoiceOpen,
    openInvoice,
    closeInvoice,
    // Refresh
    fetchLiveMarketplaceData
  } = useBuyerState();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* ========================================================================= */}
      {/* 1. STICKY TOP COMMAND HEADER */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        
        {/* Top Profile & Live Mandi Ticker Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Buyer Profile Pill */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs shadow-emerald-700/20">
              <Building2 size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-slate-900 tracking-tight">
                  {buyerProfile.business_name}
                </h1>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-mono">
                  <ShieldCheck size={11} className="text-emerald-700" />
                  VERIFIED BUYER
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                GSTIN: <strong className="text-slate-800">{buyerProfile.gstin}</strong> • Hub: <strong className="text-slate-800">{buyerProfile.preferred_apmc_mandi}</strong>
              </p>
            </div>
          </div>

          {/* Continuous Stock Market Live Mandi Price Ticker */}
          <div className="hidden md:flex items-center gap-2.5 bg-slate-900 text-slate-100 px-3.5 py-1.5 rounded-2xl border border-slate-800 shadow-inner flex-1 max-w-xl overflow-hidden relative group">
            
            {/* Live Indicator Dot */}
            <div className="flex items-center gap-1.5 shrink-0 z-10 pr-2 border-r border-slate-700 bg-slate-900">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 font-mono whitespace-nowrap">
                LIVE TICKER
              </span>
            </div>

            {/* Seamless Infinite Running Ticker Track */}
            <div 
              className="flex-1 overflow-hidden relative"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 12px, black calc(100% - 12px), transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 12px, black calc(100% - 12px), transparent)'
              }}
            >
              <div className="animate-ticker flex items-center gap-6 text-[11px] font-mono whitespace-nowrap select-none">
                {/* 1st Loop Copy */}
                {MANDI_TICKER_ITEMS.map((item, idx) => (
                  <div key={`ticker-1-${idx}`} className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[10px] font-sans font-medium">{item.crop}:</span>
                    <strong className="text-white font-bold">{item.price}</strong>
                    <span className={`text-[10px] font-black px-1 rounded ${
                      item.trend.startsWith('+') ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'
                    }`}>
                      {item.trend}
                    </span>
                    <span className="text-slate-600 pl-2">•</span>
                  </div>
                ))}

                {/* 2nd Loop Copy for Seamless Loop */}
                {MANDI_TICKER_ITEMS.map((item, idx) => (
                  <div key={`ticker-2-${idx}`} className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[10px] font-sans font-medium">{item.crop}:</span>
                    <strong className="text-white font-bold">{item.price}</strong>
                    <span className={`text-[10px] font-black px-1 rounded ${
                      item.trend.startsWith('+') ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'
                    }`}>
                      {item.trend}
                    </span>
                    <span className="text-slate-600 pl-2">•</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 rounded-xl font-bold border-slate-300 text-slate-700 hover:bg-slate-100"
              onClick={() => {
                window.location.href = '/kyc?role=BUYER';
              }}
            >
              <FileText size={12} className="mr-1" />
              e-KYC
            </Button>

            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 rounded-xl shadow-xs"
              onClick={fetchLiveMarketplaceData}
            >
              <RefreshCw size={12} className="mr-1" />
              Refresh
            </Button>
          </div>

        </div>

        {/* Sub-Navigation Tab Switcher */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100">
          <nav className="flex space-x-1 sm:space-x-4 py-2">
            
            {/* Tab 1: Marketplace & Live Feed */}
            <button
              type="button"
              onClick={() => setActiveTab('marketplace')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'marketplace'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Store size={15} />
              <span>Marketplace &amp; Live Feed</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'marketplace' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {lots.length} Lots
              </span>
            </button>

            {/* Tab 2: Active Procurement & Fulfillment */}
            <button
              type="button"
              onClick={() => setActiveTab('active_deals')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'active_deals'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Truck size={15} />
              <span>Active Procurement &amp; Fulfillment</span>
              {activeDealsCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-amber-400 text-amber-950 animate-pulse">
                  {activeDealsCount} Active
                </span>
              )}
            </button>

            {/* Tab 3: Settled Ledger & Tax Invoices */}
            <button
              type="button"
              onClick={() => setActiveTab('ledger')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'ledger'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Receipt size={15} />
              <span>Settled Ledger &amp; Tax Invoices</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'ledger' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {orders.length} Settled
              </span>
            </button>

          </nav>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN VIEW CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Global Toast Alert */}
        {toastMsg && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-xs font-bold text-emerald-950 animate-in fade-in flex justify-between items-center shadow-xs">
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-700 shrink-0" />
              {toastMsg}
            </span>
            <button onClick={() => setToastMsg(null)} className="text-emerald-800 hover:text-emerald-950 font-extrabold text-sm ml-4 cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: MARKETPLACE & LIVE FEED */}
        {/* ========================================================================= */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Marketplace Grid Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>🌾</span> Verified Institutional Crop Lots
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time harvest lots inspected by YOLOv8 Computer Vision with PostGIS freight pooling
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
                  <ShieldCheck size={13} /> 100% Escrow Guaranteed
                </span>
              </div>
            </div>

            {/* Crop Listing Cards Grid */}
            {lots.length === 0 ? (
              <EmptyListingState onResetFilters={fetchLiveMarketplaceData} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {lots.map((lot) => (
                  <CropListingCard
                    key={lot.id}
                    lot={lot}
                    onInspect={(targetLot) => openInspection(targetLot)}
                    onPlaceBid={(lotId, bidAmt, landedCost, totalAmount) => {
                      openBidding(lot);
                    }}
                    isPlacingBid={loadingBidLotId === lot.id}
                  />
                ))}
              </div>
            )}

            {/* Active Bids Table */}
            <BidTable bids={bids} isFarmerView={false} />

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: ACTIVE PROCUREMENT & FULFILLMENT */}
        {/* ========================================================================= */}
        {activeTab === 'active_deals' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Active Deal Status Header */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 font-mono">
                  ● Active Procurement Corridor
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  {activeVault.crop_name || 'Sharbati Wheat'} • {activeVault.carrier_name || 'Kisan Express Logistics'}
                </h3>
                <p className="text-xs text-slate-600">
                  Farmer: <strong>{activeVault.farmer_name || 'Ramesh Patil'}</strong> • Total Escrow Locked: <strong className="font-mono text-emerald-800">₹{(activeVault.total_locked_amount || 130338).toLocaleString('en-IN')}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping shrink-0" />
                  Vehicle: {activeVault.vehicle_number || 'MH-15-EG-4421'} • {activeVault.status || 'IN_TRANSIT'}
                </span>
              </div>
            </div>

            {/* Milestone Escrow Rails (4-Stage State Machine) */}
            <EscrowRails
              initialVault={activeVault}
              onOpenWeighbridge={openWeighbridge}
              onRefresh={fetchLiveMarketplaceData}
              onReturnToMarketplace={() => setActiveTab('marketplace')}
            />

            {/* In-Transit Geospatial Logistics Map (Leaflet) */}
            <ShipmentTracker
              lotId={`LOT-${activeVault.lot_id || 1}`}
              cropName={activeVault.crop_name || 'Sharbati Wheat'}
              farmerName={activeVault.farmer_name || 'Ramesh Patil'}
              carrierName={activeVault.carrier_name || 'Kisan Express Logistics'}
              vehicleNumber={activeVault.vehicle_number || 'MH-15-EG-4421'}
              originName={activeVault.farmer_district || 'Nashik Farm Gate Cluster'}
              destinationName="Vashi APMC Mandi Yard (Navi Mumbai)"
              onArriveAtTerminal={() => {
                openWeighbridge();
                triggerToast('🚛 Mandi Arrival Confirmed! Opening Certified APMC Weighbridge Pass & Settlement.');
              }}
            />

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: SETTLED LEDGER & TAX INVOICES */}
        {/* ========================================================================= */}
        {activeTab === 'ledger' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Procurement Analytics KPI Cards */}
            <BuyerAnalyticsCards data={analytics} />

            {/* Historical Order Ledger Table */}
            <OrderHistoryTable orders={orders} />

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 3. MODAL & DRAWER CONTAINER MOUNTS */}
      {/* ========================================================================= */}

      {/* 1. YOLOv8 AI Inspection Modal */}
      {isInspectionOpen && inspectionLot && (
        <AIInspectionModal
          isOpen={isInspectionOpen}
          onClose={closeInspection}
          lot={inspectionLot}
          onInstantBid={(lot) => {
            closeInspection();
            openBidding(lot);
          }}
        />
      )}

      {/* 2. Interactive Bidding & Escrow Drawer */}
      {isBiddingOpen && biddingLot && (
        <BiddingDrawer
          isOpen={isBiddingOpen}
          onClose={closeBidding}
          lot={biddingLot}
          isSubmitting={loadingBidLotId !== null}
          onConfirmBidAndEscrow={handleConfirmBidAndEscrow}
        />
      )}

      {/* 3. Certified Weighbridge Settlement & Dispute Modal */}
      {isWeighbridgeOpen && (
        <WeighbridgeSettlement
          isOpen={isWeighbridgeOpen}
          onClose={closeWeighbridge}
          vaultId={activeVault.id || 1}
          lotId={`LOT-${activeVault.lot_id || 1}`}
          cropName={activeVault.crop_name || 'Sharbati Wheat'}
          variety={activeVault.variety || 'Lok-1 (Clean Grain)'}
          farmerName={activeVault.farmer_name || 'Ramesh Patil'}
          carrierName={activeVault.carrier_name || 'Kisan Express Logistics'}
          vehicleNumber={activeVault.vehicle_number || 'MH-15-EG-4421'}
          listedQuantityKg={5000}
          cropTotalAmount={activeVault.crop_total_amount || 122500}
          balanceFreightAmount={activeVault.balance_freight_amount || 4200}
          totalEscrowAmount={activeVault.total_locked_amount || 130338}
          onSettlementComplete={handleSettlementComplete}
          onDisputeRaised={handleDisputeRaised}
        />
      )}

      {/* 4. GST-Compliant Digital Tax Invoice Modal */}
      {isInvoiceOpen && selectedInvoiceOrder && (
        <TaxInvoiceModal
          isOpen={isInvoiceOpen}
          onClose={closeInvoice}
          order={selectedInvoiceOrder}
        />
      )}

    </div>
  );
}
