'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  RefreshCw, 
  Sparkles, 
  LayoutGrid, 
  Truck, 
  Receipt,
  CheckCircle2,
  ArrowRight,
  PackageCheck,
  ChevronDown,
  User,
  MapPin,
  Hash,
  LogOut,
  Settings
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

/* ─────────────────────────────────────────────────────────────
   Badge primitives — 3 types, no exceptions
   ───────────────────────────────────────────────────────────── */

/** Status badge: green = verified/good, amber = pending/active, red = alert */
function StatusBadge({ 
  label, 
  variant = 'green', 
  icon 
}: { 
  label: string; 
  variant?: 'green' | 'amber' | 'red'; 
  icon?: React.ReactNode; 
}) {
  const colors = {
    green:  'bg-emerald-100 text-emerald-800 border-emerald-200',
    amber:  'bg-amber-100  text-amber-800  border-amber-200',
    red:    'bg-rose-100   text-rose-800   border-rose-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border font-mono ${colors[variant]}`}>
      {icon}
      {label}
    </span>
  );
}

/** Count badge: neutral gray, always same shape */
function CountBadge({ count, label }: { count: number; label?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-mono">
      {count}{label ? ` ${label}` : ''}
    </span>
  );
}

/** Price-change badge: always with an arrow icon, never text-color alone */
function PriceChangeBadge({ trend }: { trend: string }) {
  const isUp = trend.startsWith('+');
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-full font-mono ${
      isUp 
        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
        : 'bg-rose-100 text-rose-700 border border-rose-200'
    }`}>
      <span>{isUp ? '▲' : '▼'}</span>
      {trend}
    </span>
  );
}

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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* ========================================================================= */}
      {/* 1. STICKY TOP COMMAND HEADER — consolidated, single visual weight tier    */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        
        {/* Single row: profile pill + tabs + account menu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          
          {/* LEFT: compact company identity */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs shadow-emerald-700/20">
              <Building2 size={14} />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-slate-900 tracking-tight">
                  {buyerProfile.business_name}
                </span>
                {/* Status badge — green = verified */}
                <StatusBadge
                  label="VERIFIED"
                  variant="green"
                  icon={<ShieldCheck size={9} />}
                />
                {isDemoMode && (
                  <StatusBadge label="DEMO" variant="amber" icon={<Sparkles size={9} />} />
                )}
              </div>
            </div>
          </div>

          {/* CENTER: 3-tab navigation */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {/* Tab 1: Marketplace */}
            <button
              type="button"
              onClick={() => setActiveTab('marketplace')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'marketplace'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid size={14} />
              <span className="hidden sm:inline">Verified Lots</span>
              <span className="sm:hidden">Lots</span>
              {/* Count badge — neutral gray */}
              <CountBadge count={lots.length} label="Lots" />
            </button>

            {/* Tab 2: Active Procurement */}
            <button
              type="button"
              onClick={() => setActiveTab('active_deals')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'active_deals'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Truck size={14} />
              <span className="hidden sm:inline">Procurement</span>
              <span className="sm:hidden">Orders</span>
              {/* Count badge for active deals — amber if >0 = active/pending */}
              {activeDealsCount > 0 ? (
                <StatusBadge label={`${activeDealsCount} Active`} variant="amber" />
              ) : (
                <CountBadge count={0} label="Active" />
              )}
            </button>

            {/* Tab 3: Settled Ledger */}
            <button
              type="button"
              onClick={() => setActiveTab('ledger')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'ledger'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Receipt size={14} />
              <span className="hidden sm:inline">Ledger</span>
              <CountBadge count={orders.length} label="Settled" />
            </button>
          </nav>

          {/* RIGHT: account/profile dropdown — hides all secondary info */}
          <div className="relative shrink-0" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setProfileMenuOpen(prev => !prev)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              aria-label="Account menu"
              aria-expanded={profileMenuOpen}
            >
              <User size={13} className="text-slate-500" />
              <span className="hidden sm:inline">Account</span>
              <ChevronDown size={12} className={`text-slate-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown panel */}
            {profileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                {/* Profile header */}
                <div className="px-4 py-3 border-b border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-slate-900">{buyerProfile.business_name}</span>
                    <StatusBadge label="VERIFIED BUYER" variant="green" icon={<ShieldCheck size={9} />} />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                    <Hash size={10} className="text-slate-400" />
                    <span>GSTIN: <strong className="text-slate-700">{buyerProfile.gstin}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <MapPin size={10} className="text-emerald-600" />
                    <span>Hub: <strong className="text-slate-700">{buyerProfile.preferred_apmc_mandi}</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2 space-y-1">
                  {/* Demo mode toggle */}
                  <button
                    type="button"
                    onClick={() => { setIsDemoMode(!isDemoMode); setProfileMenuOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isDemoMode
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles size={13} className={isDemoMode ? 'text-amber-600 animate-spin' : 'text-slate-400'} />
                      Demo Mode
                    </span>
                    {isDemoMode 
                      ? <StatusBadge label="ON" variant="amber" /> 
                      : <StatusBadge label="OFF" variant="green" />
                    }
                  </button>

                  {/* Sync button */}
                  <button
                    type="button"
                    onClick={() => { fetchLiveMarketplaceData(); setProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 border border-transparent transition-all cursor-pointer"
                  >
                    <RefreshCw size={13} className="text-slate-400" />
                    Sync Mandi Prices
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN VIEW CONTAINER                                                    */}
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
        {/* VIEW 1: MARKETPLACE & LIVE FEED                                          */}
        {/* ========================================================================= */}
        {activeTab === 'marketplace' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            {/* Marketplace section header — muted, secondary visual weight */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  🌾 Verified Institutional Crop Lots
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  YOLOv8 computer-vision graded • PostGIS freight pooling • 100% escrow backed
                </p>
              </div>

              {/* Status badge only — green = guaranteed */}
              <StatusBadge
                label="100% Escrow Guaranteed"
                variant="green"
                icon={<ShieldCheck size={10} />}
              />
            </div>

            {/* Crop Listing — DOMINANT FOCAL ELEMENT: larger spacing, full width */}
            {lots.length === 0 ? (
              <EmptyListingState onResetFilters={fetchLiveMarketplaceData} />
            ) : (
              <div className="space-y-4">
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
        {/* VIEW 2: ACTIVE PROCUREMENT & FULFILLMENT (MULTI-DEAL SELECTION)         */}
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
                        Active Procurement Deals
                      </span>
                      {/* Count badge — neutral gray */}
                      <CountBadge count={activeVaults.length} />
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      Capital Locked: <strong className="text-emerald-800">₹{activeVaults.reduce((acc, v) => acc + (v.total_locked_amount || 0), 0).toLocaleString('en-IN')}</strong>
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
                          className={`p-4 rounded-2xl text-left transition-all duration-200 border cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-2.5 ${
                            isSelected
                              ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-300 shadow-md'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md hover:bg-slate-50/60'
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

                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono font-bold text-slate-700">
                              ₹{(deal.total_locked_amount || 0).toLocaleString('en-IN')}
                            </span>
                            {/* Status badge for milestone */}
                            <StatusBadge 
                              label={milestoneLabel} 
                              variant={deal.current_milestone === 'DISPUTED' ? 'red' : deal.current_milestone === 'SETTLED' ? 'green' : 'amber'} 
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Full EscrowRails Detail Panel for the selected deal */}
                {selectedVault && (
                  <EscrowRails
                    key={`escrow-rails-${selectedVault.id}`}
                    initialVault={selectedVault}
                    isDemoMode={isDemoMode}
                    onOpenWeighbridge={openWeighbridge}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: SETTLED LEDGER & TAX INVOICES                                   */}
        {/* ========================================================================= */}
        {activeTab === 'ledger' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900 tracking-tight">Settled Ledger & Tax Invoices</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Completed purchases, GST invoices, and full transaction history
                </p>
              </div>
              {/* Count badge — neutral gray */}
              <CountBadge count={orders.length} label="Settled" />
            </div>

            <BuyerAnalyticsCards data={analytics} />
            <OrderHistoryTable orders={orders} />
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 3. MODALS & DRAWERS                                                       */}
      {/* ========================================================================= */}

      {/* 1. YOLOv8 AI Inspection Modal */}
      {isInspectionOpen && inspectionLot && (
        <AIInspectionModal
          isOpen={isInspectionOpen}
          onClose={closeInspection}
          lot={inspectionLot}
        />
      )}

      {/* 2. Crop Details Pop-up Modal */}
      {selectedDetailLot && (
        <CropDetailModal
          isOpen={!!selectedDetailLot}
          onClose={() => setSelectedDetailLot(null)}
          lot={selectedDetailLot}
          onInspect={openInspection}
          onPlaceBid={openBidding}
        />
      )}

      {/* 3. Bidding & Logistics Drawer */}
      {isBiddingOpen && biddingLot && (
        <BiddingDrawer
          isOpen={isBiddingOpen}
          onClose={closeBidding}
          lot={biddingLot}
          onConfirmBidAndEscrow={handleConfirmBidAndEscrow}
          isSubmitting={!!loadingBidLotId}
        />
      )}

      {/* 4. Weighbridge Settlement Modal */}
      {isWeighbridgeOpen && selectedVault && (
        <WeighbridgeSettlement
          isOpen={isWeighbridgeOpen}
          onClose={closeWeighbridge}
          vaultId={selectedVault.id}
        />
      )}

      {/* 5. Tax Invoice Modal */}
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
