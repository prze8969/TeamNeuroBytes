'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Truck, 
  MapPin, 
  TrendingDown, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Leaf, 
  Snowflake, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Lock, 
  RotateCcw,
  Boxes,
  Percent,
  Compass,
  BadgeAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CropLot } from '@/lib/types';
import { toast } from 'sonner';
import { useCropTranslation } from '@/lib/LocaleContext';

export interface FPOCollectiveViewProps {
  activeLots: CropLot[];
  isPooled?: boolean;
  onTogglePoolMode?: (nextState: boolean) => void;
  onLotSelect?: (lot: CropLot) => void;
  onUpdatePoolSelection: (updatedLots: CropLot[], pooledLotIds: string[]) => void;
  onNavigateToTab?: (tab: string) => void;
}

export function FPOCollectiveView({
  activeLots = [],
  isPooled = true,
  onTogglePoolMode,
  onLotSelect,
  onUpdatePoolSelection,
  onNavigateToTab
}: FPOCollectiveViewProps) {
  const tCrop = useCropTranslation();
  // Constant FPO Collective Details
  const FPO_NAME = "Nashik East Farmers Producer Company";
  const FPO_CODE = "FPC #MH-NSK-4412";
  const HUB_NAME = "Niphad Central Aggregation Yard";
  const HUB_DISTANCE = "4.2 km from your farm";
  const BASELINE_COLLECTIVE_WEIGHT_MT = 32.5; // From other 14 participating farmers
  const TRUCK_CAPACITY_MT = 45.0;
  const SOLO_FREIGHT_PER_KG = 1.85;
  const POOLED_FREIGHT_PER_KG = 1.20;
  const FREIGHT_DISCOUNT_PCT = 35.1;

  // Initialize selected lots from existing lot status or is_fpo_pooled / isPooled flag
  const [selectedLotIds, setSelectedLotIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kisansetu_fpo_pooled_lots');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return activeLots
      .filter(l => l.is_fpo_pooled === true || l.isPooled === true || l.status === 'POOLED')
      .map(l => l.id);
  });

  // Keep selectedLotIds in sync when activeLots load
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('kisansetu_fpo_pooled_lots');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedLotIds(parsed);
          return;
        }
      }
      const existing = activeLots
        .filter(l => l.is_fpo_pooled === true || l.isPooled === true || l.status === 'POOLED')
        .map(l => l.id);
      if (existing.length > 0) {
        setSelectedLotIds(existing);
      }
    } catch {}
  }, [activeLots]);

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'DRY' | 'PERISHABLE'>('ALL');
  const [isSaving, setIsSaving] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Helper to identify crop logistics category
  const isDryCrop = (cropName: string = '') => {
    const norm = cropName.toLowerCase();
    return norm.includes('wheat') || norm.includes('grain') || norm.includes('rice') || 
           norm.includes('basmati') || norm.includes('soybean') || norm.includes('chana') || 
           norm.includes('tur') || norm.includes('dal') || norm.includes('cotton') || norm.includes('paddy');
  };

  // Filter lots based on logistics profile
  const filteredLots = useMemo(() => {
    if (activeFilter === 'DRY') {
      return activeLots.filter(l => isDryCrop(l.cropName));
    }
    if (activeFilter === 'PERISHABLE') {
      return activeLots.filter(l => !isDryCrop(l.cropName));
    }
    return activeLots;
  }, [activeLots, activeFilter]);

  // Total selected tonnage
  const selectedTonnage = useMemo(() => {
    return activeLots
      .filter(l => selectedLotIds.includes(l.id))
      .reduce((sum, l) => sum + (l.quantityTons || (l.quantityKg / 1000)), 0);
  }, [activeLots, selectedLotIds]);

  const selectedWeightKg = selectedTonnage * 1000;

  // Financial calculations
  const soloTotalFreight = selectedWeightKg * SOLO_FREIGHT_PER_KG;
  const pooledTotalFreight = selectedWeightKg * POOLED_FREIGHT_PER_KG;
  const totalFreightSavings = soloTotalFreight - pooledTotalFreight;

  // Collective Capacity Calculation
  const totalCombinedWeightMT = BASELINE_COLLECTIVE_WEIGHT_MT + selectedTonnage;
  const capacityFillPercent = Math.min(
    Math.round((totalCombinedWeightMT / TRUCK_CAPACITY_MT) * 100),
    100
  );

  // Toggle single lot
  const handleToggleLot = (lotId: string, isLocked: boolean) => {
    if (isLocked) {
      toast.warning('🔒 Lot Locked in Active Bidding / Escrow', {
        description: 'This lot cannot change transport allocation while an escrow transaction is locked.',
      });
      return;
    }

    setSelectedLotIds(prev => {
      if (prev.includes(lotId)) {
        return prev.filter(id => id !== lotId);
      } else {
        return [...prev, lotId];
      }
    });
  };

  // Select all eligible lots
  const handleSelectAll = () => {
    const unlockedIds = activeLots
      .filter(l => l.status !== 'SOLD' && l.status !== 'BIDDING')
      .map(l => l.id);
    setSelectedLotIds(unlockedIds);
    toast.info('All eligible lots selected for FPO Pooling.');
  };

  // Select only dry grains
  const handleSelectDryOnly = () => {
    const dryUnlockedIds = activeLots
      .filter(l => isDryCrop(l.cropName) && l.status !== 'SOLD' && l.status !== 'BIDDING')
      .map(l => l.id);
    setSelectedLotIds(dryUnlockedIds);
    toast.info('Selected all dry grains & pulses for optimal bulk freight.');
  };

  // Clear all selections
  const handleClearAll = () => {
    setSelectedLotIds([]);
    toast.info('Cleared pool selection. All lots marked for solo transport.');
  };

  // Save changes
  const handleSaveSelection = async () => {
    setIsSaving(true);

    const updatedLots: CropLot[] = activeLots.map(l => {
      const isSelected = selectedLotIds.includes(l.id);
      return {
        ...l,
        is_fpo_pooled: isSelected,
        isPooled: isSelected,
        fpo_collective_name: isSelected ? FPO_NAME : undefined,
        freightPerKg: isSelected ? POOLED_FREIGHT_PER_KG : SOLO_FREIGHT_PER_KG,
        freightSavingsPercent: isSelected ? FREIGHT_DISCOUNT_PCT : 0,
        logisticsType: isSelected ? 'Shared Freight' : 'Direct',
        pooledClusterId: isSelected ? 'CLST-01' : undefined
      };
    });

    // Save to localStorage for cross-tab synchronicity
    try {
      localStorage.setItem('kisansetu_crop_lots', JSON.stringify(updatedLots));
      localStorage.setItem('kisansetu_fpo_pooled_lots', JSON.stringify(selectedLotIds));
      window.dispatchEvent(new Event('kisansetu_lots_updated'));
    } catch {}

    setTimeout(() => {
      setIsSaving(false);
      onUpdatePoolSelection(updatedLots, selectedLotIds);
      if (selectedLotIds.length > 0) {
        toast.success('🎉 FPO Collective Pool Updated!', {
          description: `${selectedLotIds.length} Lots (${selectedTonnage.toFixed(1)} MT) assigned to ${FPO_NAME} milk-run dispatch. Estimated savings: ₹${Math.round(totalFreightSavings).toLocaleString('en-IN')}.`,
          duration: 6000
        });
      } else {
        toast.info('FPO Pool Updated', {
          description: 'All harvest lots detached to individual solo direct haul.',
          duration: 5000
        });
      }
    }, 500);
  };

  // Leave collective action
  const handleConfirmLeaveCollective = () => {
    setSelectedLotIds([]);
    const updatedLots: CropLot[] = activeLots.map(l => ({
      ...l,
      is_fpo_pooled: false,
      isPooled: false,
      fpo_collective_name: undefined,
      freightPerKg: SOLO_FREIGHT_PER_KG,
      freightSavingsPercent: 0,
      logisticsType: 'Direct',
      pooledClusterId: undefined
    }));

    try {
      localStorage.setItem('kisansetu_crop_lots', JSON.stringify(updatedLots));
      localStorage.setItem('kisansetu_fpo_pooled_lots', JSON.stringify([]));
      window.dispatchEvent(new Event('kisansetu_lots_updated'));
    } catch {}

    onUpdatePoolSelection(updatedLots, []);
    setIsLeaveModalOpen(false);
    toast.warning('Left FPO Collective', {
      description: 'All produce lots reverted to standard solo direct haulage rates (₹1.85/kg).',
      duration: 6000
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* ========================================================================= */}
      {/* 1. HEADER & ACTIVE COLLECTIVE PROFILE BANNER */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-purple-950 via-slate-950 to-emerald-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {/* Background Grid Accent */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          
          {/* Top Metadata Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-purple-800/40 pb-5">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 text-xl font-bold shadow-xs">
                  👥
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      {FPO_NAME}
                    </h2>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-400/20 text-purple-200 border border-purple-400/30 font-mono">
                      {FPO_CODE}
                    </span>
                  </div>
                  <p className="text-xs text-purple-200 font-medium flex items-center gap-1.5 mt-0.5">
                    <MapPin size={13} className="text-purple-400 shrink-0" />
                    <span>{HUB_NAME}</span>
                    <span className="text-purple-400">•</span>
                    <strong className="text-emerald-300">{HUB_DISTANCE}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                SFAC &amp; APMC Certified Milk-Run
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLeaveModalOpen(true)}
                className="text-xs font-bold rounded-xl border-purple-700/60 bg-purple-950/50 text-purple-200 hover:bg-rose-950 hover:text-rose-200 hover:border-rose-700 transition-colors"
              >
                Leave Collective
              </Button>
            </div>
          </div>

          {/* Aggregation Target & Live Truckload Progress Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Metric 1: Milk-Run Target */}
            <div className="rounded-2xl bg-white/5 border border-purple-500/20 p-4 space-y-1.5 backdrop-blur-xs">
              <div className="flex items-center justify-between text-xs text-purple-300">
                <span className="font-bold flex items-center gap-1.5">
                  <Truck size={15} className="text-purple-400" />
                  Active Milk-Run Haul
                </span>
                <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                  Departs in 4h 30m
                </span>
              </div>
              <p className="text-lg font-black text-white">
                45-Ton Multi-Axle Carrier
              </p>
              <p className="text-[11px] text-slate-300 font-mono">
                Route: <strong className="text-purple-200">Niphad Central Hub ➔ Vashi APMC Terminal</strong>
              </p>
            </div>

            {/* Metric 2: Participating Farmers */}
            <div className="rounded-2xl bg-white/5 border border-purple-500/20 p-4 space-y-1.5 backdrop-blur-xs">
              <div className="flex items-center justify-between text-xs text-purple-300">
                <span className="font-bold flex items-center gap-1.5">
                  <Users size={15} className="text-purple-400" />
                  Collective Enrollment
                </span>
                <span className="text-[10px] font-black font-mono text-purple-300">
                  Cluster #CLST-01
                </span>
              </div>
              <p className="text-lg font-black text-white">
                {14 + (selectedLotIds.length > 0 ? 1 : 0)} Farmers Enrolled
              </p>
              <p className="text-[11px] text-purple-200">
                {selectedLotIds.length > 0 ? (
                  <span className="text-emerald-300 font-bold">✓ Your {selectedLotIds.length} lots included in active manifest</span>
                ) : (
                  <span className="text-amber-300">Select produce below to join current truck</span>
                )}
              </p>
            </div>

            {/* Metric 3: Capacity Progress */}
            <div className="rounded-2xl bg-white/5 border border-purple-500/20 p-4 space-y-2 backdrop-blur-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-300 font-bold">Truckload Capacity</span>
                <span className="text-emerald-400 font-black font-mono">
                  {totalCombinedWeightMT.toFixed(1)} MT / {TRUCK_CAPACITY_MT.toFixed(1)} MT ({capacityFillPercent}%)
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-3 bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-purple-900/60">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    capacityFillPercent >= 90
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : capacityFillPercent >= 70
                      ? 'bg-gradient-to-r from-purple-500 to-emerald-400'
                      : 'bg-gradient-to-r from-amber-500 to-purple-400'
                  }`}
                  style={{ width: `${capacityFillPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Baseline: {BASELINE_COLLECTIVE_WEIGHT_MT} MT</span>
                <span className="text-emerald-300 font-bold">Your Share: +{selectedTonnage.toFixed(1)} MT</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LOT-BY-LOT SELECTIVE POOLING TABLE / MATRIX */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>🌾 Select Harvest Lots for Shared FPO Transport</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                {selectedLotIds.length} of {activeLots.length} Selected
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Toggle specific produce lots into the shared 45-Ton milk-run carrier to unlock bulk freight rates.
            </p>
          </div>

          {/* Quick Selection Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Lots ({activeLots.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('DRY')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'DRY'
                    ? 'bg-white text-emerald-900 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Leaf size={12} className="text-emerald-600" />
                Dry Grains
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('PERISHABLE')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'PERISHABLE'
                    ? 'bg-white text-blue-900 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Snowflake size={12} className="text-blue-600" />
                Perishables
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectDryOnly}
                className="text-xs font-bold h-8 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                🌿 Select All Grains
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs font-bold h-8 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs font-bold h-8 rounded-xl text-slate-500 hover:text-rose-600"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Lots Card Matrix */}
        {filteredLots.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Boxes className="w-10 h-10 text-slate-400 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800">No produce lots in this category</h4>
              <p className="text-xs text-slate-500">
                List new harvested produce from the Farmer Command Center to participate in FPO pooling.
              </p>
            </div>
            {onNavigateToTab && (
              <Button
                size="sm"
                onClick={() => onNavigateToTab('overview')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
              >
                + List New Produce Lot
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredLots.map((lot) => {
              const isSelected = selectedLotIds.includes(lot.id);
              const isLocked = lot.status === 'SOLD' || lot.status === 'BIDDING';
              const isDry = isDryCrop(lot.cropName);
              const lotWeightKg = lot.quantityKg || ((lot.quantityTons || 5) * 1000);
              const lotTons = (lotWeightKg / 1000).toFixed(1);

              const lotSoloFreight = lotWeightKg * SOLO_FREIGHT_PER_KG;
              const lotPooledFreight = lotWeightKg * POOLED_FREIGHT_PER_KG;
              const lotSavings = lotSoloFreight - lotPooledFreight;

              return (
                <div
                  key={lot.id}
                  onClick={() => handleToggleLot(lot.id, isLocked)}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  } ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  
                  {/* Left Column: Checkbox, Image & Crop Identification */}
                  <div className="flex items-center gap-4 min-w-[280px]">
                    
                    {/* Custom Checkbox Toggle */}
                    <div 
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'bg-white border-slate-300 text-transparent hover:border-slate-400'
                      }`}
                    >
                      {isLocked ? (
                        <Lock size={12} className="text-slate-400" />
                      ) : (
                        <Check size={14} className={isSelected ? 'stroke-[3]' : 'opacity-0'} />
                      )}
                    </div>

                    {/* Specimen Produce Thumbnail */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                      <img 
                        src={lot.imageUrl || '/logo.png'} 
                        alt={lot.cropName} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Crop Name & Lot Info */}
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black font-mono text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                          {lot.id}
                        </span>
                        <span className="text-xs font-bold text-slate-500 font-mono">
                          {lot.harvestDate}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 truncate">
                        {tCrop(lot.cropName)}
                      </h4>
                      <p className="text-xs text-slate-600 truncate">
                        {tCrop(lot.variety || '')}
                      </p>
                    </div>
                  </div>

                  {/* Middle Column: Volume, Quality Grade & Logistics Profile */}
                  <div className="flex flex-wrap items-center gap-4 lg:gap-8">
                    
                    {/* Volume & Quality Grade */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        Volume &amp; Grade
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900 font-mono">
                          {lotTons} MT
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {lot.qualityGrade || 'Grade A'} ({lot.qualityScore || 95}%)
                        </span>
                      </div>
                    </div>

                    {/* Logistics Profile Tag */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        Logistics Profile
                      </span>
                      {isDry ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <Leaf size={12} className="text-emerald-600" />
                          🌿 Ideal for Bulk Dry Pool
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-lg border border-blue-200">
                          <Snowflake size={12} className="text-blue-600" />
                          ❄️ Perishable Sensitive
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Right Column: Freight Breakdown & Net Savings */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                    
                    <div className="text-left lg:text-right space-y-0.5">
                      <div className="flex items-center lg:justify-end gap-2 text-xs font-mono">
                        <span className="text-slate-400 line-through">₹{SOLO_FREIGHT_PER_KG.toFixed(2)}/kg</span>
                        <strong className="text-emerald-700 font-bold">➔ ₹{POOLED_FREIGHT_PER_KG.toFixed(2)}/kg</strong>
                      </div>
                      <p className="text-xs font-black text-emerald-600 font-mono">
                        Save ₹{Math.round(lotSavings).toLocaleString('en-IN')} (-{FREIGHT_DISCOUNT_PCT}%)
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 text-purple-900 border border-purple-300 text-xs font-black shadow-2xs font-mono">
                          <Users size={13} className="text-purple-700" />
                          👥 FPO Pooled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold font-mono">
                          <Truck size={13} className="text-slate-500" />
                          🚛 Solo Haul
                        </span>
                      )}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 3. REAL-TIME ECONOMIC BENEFIT CALCULATOR (BOTTOM DOCK) */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Summary Breakdown Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
            
            {/* Metric 1: Selected Tonnage */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                Total Pooling Volume
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white font-mono">
                  {selectedTonnage.toFixed(1)}
                </span>
                <span className="text-sm font-bold text-emerald-200">Metric Tons</span>
              </div>
              <p className="text-[11px] text-emerald-200/80 font-mono">
                {selectedLotIds.length} Harvest Lots Enrolled
              </p>
            </div>

            {/* Metric 2: Net Freight Savings */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                Estimated Freight Savings
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-300 font-mono">
                  ₹{Math.round(totalFreightSavings).toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                  -{FREIGHT_DISCOUNT_PCT}%
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                Solo: ₹{Math.round(soloTotalFreight).toLocaleString('en-IN')} ➔ Pooled: ₹{Math.round(pooledTotalFreight).toLocaleString('en-IN')}
              </p>
            </div>

            {/* Metric 3: Dispatch & Escrow Guarantee */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                Dispatch Window &amp; Settlement
              </span>
              <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                <Clock size={16} className="text-emerald-400 shrink-0" />
                <span>Departs in 4 hrs 30 mins</span>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                🛡️ Zero upfront cost • Deducted at Mandi Escrow weighbridge settlement
              </p>
            </div>

          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Button
              type="button"
              onClick={handleSaveSelection}
              disabled={isSaving}
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm h-12 px-8 rounded-2xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>Syncing Collective...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Update Collective Pool Selection</span>
                </>
              )}
            </Button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. CONFIRMATION MODAL: LEAVE COLLECTIVE */}
      {/* ========================================================================= */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-slate-900">
            
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl shadow-xs">
              ⚠️
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-slate-900">
                Leave FPO Collective Pool?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Detaching all lots from <strong className="text-slate-900">{FPO_NAME}</strong> will cancel your shared delivery route reservation. Freight costs for your produce will revert to standard solo direct haul rates (<strong>₹1.85/kg</strong> instead of <strong>₹1.20/kg</strong>).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <strong className="block font-bold">Estimated Financial Impact:</strong>
              <p className="text-[11px] text-amber-800">
                You will forfeit up to <strong className="text-amber-950">₹{Math.round(totalFreightSavings > 0 ? totalFreightSavings : 2850).toLocaleString('en-IN')}</strong> in logistics savings on your active harvest lots.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLeaveModalOpen(false)}
                className="flex-1 text-xs h-11 rounded-xl border-slate-300 font-bold"
              >
                Keep in Pool
              </Button>
              <Button
                type="button"
                onClick={handleConfirmLeaveCollective}
                className="flex-1 text-xs h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-sm"
              >
                Confirm Leave
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default FPOCollectiveView;
