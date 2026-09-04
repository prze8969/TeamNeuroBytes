'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, PackageCheck } from 'lucide-react';
import { EscrowRails } from '@/components/dashboard/EscrowRails';
import { ShipmentTracker } from '@/components/dashboard/ShipmentTracker';
import { WeighbridgeSettlement } from '@/components/dashboard/WeighbridgeSettlement';
import { useBuyerState } from '@/lib/useBuyerState';
import { toast } from 'sonner';

export function BuyerActiveDealsLayout() {
  const {
    activeVaults,
    selectedDealId,
    setSelectedDealId,
    selectedVault,
    updateDealMilestone,
    fetchLiveMarketplaceData,
    isDemoMode,
    setIsDemoMode,
    isWeighbridgeOpen,
    openWeighbridge,
    closeWeighbridge,
    handleSettlementComplete,
    handleDisputeRaised,
    triggerToast
  } = useBuyerState();

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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
              onClick={() => window.location.href = '/buyer/dashboard'}
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
                onReturnToMarketplace={() => window.location.href = '/buyer/dashboard'}
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

      {/* Certified Weighbridge Gross/Tare Settlement Modal */}
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
    </div>
  );
}
