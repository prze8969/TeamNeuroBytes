'use client';

import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  RefreshCw, 
  Sparkles, 
  LayoutGrid, 
  Truck, 
  Receipt,
  Search,
  CheckCircle2,
  Lock,
  Fuel,
  ArrowRight,
  AlertTriangle,
  PackageCheck,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CropListingListItem } from '@/components/dashboard/CropListingListItem';
import { CropDetailModal } from '@/components/dashboard/CropDetailModal';
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
import { CropLot } from '@/lib/types';

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
    isMounted,
    activeTab,
    setActiveTab,
    lots,
    bids,
    orders,
    analytics,
    // Multi-Deal State
    activeVaults,
    selectedDealId,
    setSelectedDealId,
    selectedVault,
    updateDealMilestone,
    activeDealsCount,
    // Profile & Notifications
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
    fetchLiveMarketplaceData,
    isDemoMode,
    setIsDemoMode
  } = useBuyerState();

  const [selectedDetailLot, setSelectedDetailLot] = React.useState<CropLot | null>(null);

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
            <button
              type="button"
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`h-8 px-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
                isDemoMode
                  ? 'bg-amber-400 text-slate-950 border-amber-500 ring-2 ring-amber-300 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Sparkles size={13} className={isDemoMode ? 'text-slate-950 animate-spin' : 'text-amber-500'} />
              <span>{isDemoMode ? '⚡ Demo Mode: ON' : '⚡ Demo Mode: OFF'}</span>
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchLiveMarketplaceData}
              className="h-8 text-xs font-bold gap-1.5 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <RefreshCw size={13} className="text-slate-500" />
              Sync Mandi Live
            </Button>
          </div>

        </div>

        {/* 3-Tab Command Center Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100">
          <nav className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar">
            
            {/* Tab 1: Marketplace & Discovery */}
            <button
              type="button"
              onClick={() => setActiveTab('marketplace')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'marketplace'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid size={15} />
              <span>Verified Lots Marketplace</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'marketplace' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {lots.length} Lots
              </span>
            </button>

            {/* Tab 2: Active Procurement Corridors (Multi-Deal Collection) */}
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
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-amber-400 text-slate-950 font-bold animate-pulse">
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

            {/* Crop Listing List Format */}
            {lots.length === 0 ? (
              <EmptyListingState onResetFilters={fetchLiveMarketplaceData} />
            ) : (
              <div className="space-y-3">
                {lots.map((lot, idx) => (
                  <CropListingListItem
                    key={`marketplace-lot-${lot.id}-${idx}`}
                    lot={lot}
                    onOpenDetails={(targetLot) => setSelectedDetailLot(targetLot)}
                  />
                ))}
              </div>
            )}

            {/* Active Bids Table */}
            <BidTable bids={bids} isFarmerView={false} />

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: ACTIVE PROCUREMENT & FULFILLMENT (MULTI-DEAL SELECTION) */}
        {/* ========================================================================= */}
        {activeTab === 'active_deals' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* If zero active deals exist */}
            {activeVaults.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center space-y-4 shadow-xs">
                <div className="h-16 w-16 mx-auto rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl">
                  🛒
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">No Active Procurements Found</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    You have not placed any bids or locked escrow for crop lots yet. Explore verified farmer produce in the live market feed to initiate your first order.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => setActiveTab('marketplace')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 h-10 rounded-xl cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                >
                  🔍 Explore Live Crop Lots
                </Button>
              </div>
            ) : (
              <>
                {/* 1. Multi-Deal Carousel / Selector Bar */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 font-mono">
                        Active Procurement Deals ({activeVaults.length})
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        Click deal to focus
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      Total Capital Locked: <strong className="text-emerald-800">₹{activeVaults.reduce((acc, v) => acc + (v.total_locked_amount || 0), 0).toLocaleString('en-IN')}</strong>
                    </span>
                  </div>

                  {/* Horizontal Multi-Deal Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {activeVaults.map((deal, idx) => {
                      const isSelected = selectedDealId === deal.id;
                      const milestoneLabel = 
                        deal.current_milestone === 'LOCKED' ? '🔒 1. Funds Locked' :
                        deal.current_milestone === 'FREIGHT_ADVANCE_PAID' ? '⛽ 2. Fuel Advance' :
                        deal.current_milestone === 'IN_TRANSIT' ? '🚚 3. In Transit' :
                        deal.current_milestone === 'DISPUTED' ? '🚨 Disputed' :
                        '✅ 4. Settled';

                      return (
                        <button
                          key={`deal-tab-${deal.id}-${idx}`}
                          type="button"
                          onClick={() => setSelectedDealId(deal.id)}
                          className={`p-4 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-2.5 shadow-2xs ${
                            isSelected
                              ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-emerald-500 ring-2 ring-emerald-400 shadow-md'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg font-mono">
                              ACTIVE FOCUS
                            </div>
                          )}

                          <div className="space-y-1 pr-12">
                            <span className="text-[10px] font-black font-mono text-emerald-800">
                              VAULT #{deal.id} • LOT #{deal.lot_id}
                            </span>
                            <h4 className="text-sm font-extrabold text-slate-900 truncate">
                              {deal.crop_name}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate">
                              Farmer: <strong>{deal.farmer_name}</strong>
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                            <span className="font-mono font-black text-emerald-900">
                              ₹{(deal.total_locked_amount || 0).toLocaleString('en-IN')}
                            </span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full font-mono ${
                              deal.current_milestone === 'DISPUTED'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : deal.current_milestone === 'IN_TRANSIT'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}>
                              {milestoneLabel}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Focused Deal Status Banner */}
                {selectedVault && (
                  <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 font-mono">
                        ● Focused Procurement Corridor • Vault #{selectedVault.id}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900">
                        {selectedVault.crop_name} • {selectedVault.carrier_name || 'Kisan Express Logistics'}
                      </h3>
                      <p className="text-xs text-slate-600">
                        Farmer: <strong>{selectedVault.farmer_name}</strong> • Total Escrow Locked: <strong className="font-mono text-emerald-800">₹{(selectedVault.total_locked_amount || 0).toLocaleString('en-IN')}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping shrink-0" />
                        Vehicle: {selectedVault.vehicle_number || 'MH-15-EG-4421'} • {selectedVault.status || 'IN_TRANSIT'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. Milestone Escrow Rails (4-Stage State Machine for selected deal) */}
                {selectedVault && (
                  <EscrowRails
                    key={`escrow-rails-${selectedVault.id}`}
                    initialVault={selectedVault}
                    isDemoMode={isDemoMode}
                    onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
                    onOpenWeighbridge={openWeighbridge}
                    onRefresh={fetchLiveMarketplaceData}
                    onReturnToMarketplace={() => setActiveTab('marketplace')}
                    onVaultUpdate={(updated) => updateDealMilestone(selectedVault.id, updated)}
                  />
                )}

                {/* 4. In-Transit Geospatial Logistics Map (Leaflet) */}
                {selectedVault && (
                  <ShipmentTracker
                    key={`shipment-tracker-${selectedVault.id}-${selectedVault.lot_id || 'default'}`}
                    lotId={`LOT-${selectedVault.lot_id || 1}`}
                    cropName={selectedVault.crop_name || 'Sharbati Wheat'}
                    farmerName={selectedVault.farmer_name || 'Ramesh Patil'}
                    carrierName={selectedVault.carrier_name || 'Kisan Express Logistics'}
                    vehicleNumber={selectedVault.vehicle_number || 'MH-15-EG-4421'}
                    originName={selectedVault.farmer_district || 'Nashik Farm Gate Cluster'}
                    destinationName="Vashi APMC Mandi Yard (Navi Mumbai)"
                    onArriveAtTerminal={() => {
                      openWeighbridge();
                      triggerToast('🚛 Mandi Arrival Confirmed! Opening Certified APMC Weighbridge Pass & Settlement.');
                    }}
                  />
                )}
              </>
            )}

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

      {/* 2. Crop Details Pop-up Modal */}
      {selectedDetailLot && (
        <CropDetailModal
          isOpen={!!selectedDetailLot}
          onClose={() => setSelectedDetailLot(null)}
          lot={selectedDetailLot}
          onInspect={(lot) => {
            setSelectedDetailLot(null);
            openInspection(lot);
          }}
          onPlaceBid={(lot) => {
            setSelectedDetailLot(null);
            openBidding(lot);
          }}
        />
      )}

      {/* 3. 3-Tier Bidding & Logistics Drawer */}
      {isBiddingOpen && biddingLot && (
        <BiddingDrawer
          isOpen={isBiddingOpen}
          onClose={closeBidding}
          lot={biddingLot}
          onConfirmBidAndEscrow={handleConfirmBidAndEscrow}
        />
      )}

      {/* 4. Certified Weighbridge Gross/Tare Settlement Modal */}
      {isWeighbridgeOpen && selectedVault && (
        <WeighbridgeSettlement
          isOpen={isWeighbridgeOpen}
          onClose={closeWeighbridge}
          vaultId={selectedVault.id}
          lotId={`LOT-${selectedVault.lot_id || 1}`}
          cropName={selectedVault.crop_name}
          variety={selectedVault.variety}
          farmerName={selectedVault.farmer_name}
          carrierName={selectedVault.carrier_name}
          vehicleNumber={selectedVault.vehicle_number}
          listedQuantityKg={5000}
          cropTotalAmount={selectedVault.crop_total_amount}
          balanceFreightAmount={selectedVault.balance_freight_amount}
          totalEscrowAmount={selectedVault.total_locked_amount}
          onSettlementComplete={handleSettlementComplete}
          onDisputeRaised={handleDisputeRaised}
        />
      )}

      {/* 5. Statutory Tax Invoice Modal */}
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
