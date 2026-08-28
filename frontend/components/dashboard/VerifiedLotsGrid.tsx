'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Scale, 
  Droplets, 
  ArrowUpDown,
  Truck,
  Lock
} from 'lucide-react';
import { CropLot } from '@/lib/types';
import { CropListingCard } from './CropListingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface VerifiedLotsGridProps {
  initialLots?: CropLot[];
  onPlaceBid?: (lotId: string, bidAmount: number, landedCostPerKg: number, totalAmount: number) => Promise<void> | void;
  placingBidLotId?: string | null;
  isPlacingBid?: boolean;
}

// Realistic Production Mock Dataset for Western & Northern Indian Agri-Trade
export const MOCK_CROP_LOTS: CropLot[] = [
  {
    id: 'LOT-WHEAT-01',
    farmerId: 'FARMER-101',
    farmerName: 'Ramesh Patil',
    cropName: 'Sharbati Wheat',
    variety: 'Lok-1 (Clean Grain)',
    quantityKg: 5000,
    quantityTons: 5.0,
    grade: 'A',
    qualityGrade: 'Grade A',
    qualityScore: 94.2,
    basePricePerKg: 24.50,
    askingFloorPerKg: 24.50,
    mandiAvgPerKg: 23.00,
    defectArea: 1.9,
    moisture: 11.8,
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    origin: 'Nashik, Maharashtra',
    distanceKm: 38,
    logisticsType: 'Shared Freight',
    freightPerKg: 1.20,
    freightSavingsPercent: 35,
    location: { lat: 19.9975, lng: 73.7898, district: 'Nashik', state: 'Maharashtra' },
    harvestDate: '2026-08-20',
    status: 'POOLED'
  },
  {
    id: 'LOT-ONION-02',
    farmerId: 'FARMER-102',
    farmerName: 'Anil Deshmukh',
    cropName: 'Red Onion',
    variety: 'Nashik Garva (Late Kharif)',
    quantityKg: 8000,
    quantityTons: 8.0,
    grade: 'A',
    qualityGrade: 'Grade A',
    qualityScore: 92.0,
    basePricePerKg: 21.00,
    askingFloorPerKg: 21.00,
    mandiAvgPerKg: 19.50,
    defectArea: 2.4,
    moisture: 13.5,
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
    origin: 'Lasalgaon, Maharashtra',
    distanceKm: 46,
    logisticsType: 'Shared Freight',
    freightPerKg: 1.10,
    freightSavingsPercent: 38,
    location: { lat: 20.1472, lng: 74.2285, district: 'Nashik', state: 'Maharashtra' },
    harvestDate: '2026-08-22',
    status: 'POOLED'
  },
  {
    id: 'LOT-TOMATO-03',
    farmerId: 'FARMER-103',
    farmerName: 'Sanjay Shinde',
    cropName: 'Hybrid Tomato',
    variety: 'Vaishali Supreme (Firm Flesh)',
    quantityKg: 4200,
    quantityTons: 4.2,
    grade: 'B',
    qualityGrade: 'Grade B',
    qualityScore: 87.5,
    basePricePerKg: 18.50,
    askingFloorPerKg: 18.50,
    mandiAvgPerKg: 17.00,
    defectArea: 4.8,
    moisture: 88.2,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    origin: 'Dindori, Maharashtra',
    distanceKm: 22,
    logisticsType: 'Direct',
    freightPerKg: 1.80,
    freightSavingsPercent: 0,
    location: { lat: 20.0210, lng: 73.7890, district: 'Nashik', state: 'Maharashtra' },
    harvestDate: '2026-08-23',
    status: 'LISTED'
  },
  {
    id: 'LOT-RICE-04',
    farmerId: 'FARMER-104',
    farmerName: 'Gurpreet Singh',
    cropName: 'Basmati Rice',
    variety: 'Pusa 1121 (Aged 1-Yr Grain)',
    quantityKg: 12500,
    quantityTons: 12.5,
    grade: 'A',
    qualityGrade: 'Grade A',
    qualityScore: 96.5,
    basePricePerKg: 42.00,
    askingFloorPerKg: 42.00,
    mandiAvgPerKg: 39.80,
    defectArea: 0.8,
    moisture: 12.1,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    origin: 'Karnal Hub, Haryana',
    distanceKm: 112,
    logisticsType: 'Shared Freight',
    freightPerKg: 2.10,
    freightSavingsPercent: 42,
    location: { lat: 29.6857, lng: 76.9905, district: 'Karnal', state: 'Haryana' },
    harvestDate: '2026-08-19',
    status: 'POOLED'
  }
];

export function VerifiedLotsGrid({
  initialLots = MOCK_CROP_LOTS,
  onPlaceBid,
  placingBidLotId = null,
  isPlacingBid = false
}: VerifiedLotsGridProps) {
  const [lots, setLots] = useState<CropLot[]>(initialLots);
  const [selectedCommodity, setSelectedCommodity] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [sharedFreightOnly, setSharedFreightOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'floor_asc' | 'floor_desc' | 'volume_desc' | 'grade_desc' | 'distance_asc'>('floor_asc');

  // AI Inspection Modal State
  const [inspectingLot, setInspectingLot] = useState<CropLot | null>(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);

  // Dynamic Crop Mapping for Modal Inspection
  const isTomato = inspectingLot ? inspectingLot.cropName.toLowerCase().includes('tomato') : false;
  const isOnion = inspectingLot ? inspectingLot.cropName.toLowerCase().includes('onion') : false;
  const isRice = inspectingLot ? inspectingLot.cropName.toLowerCase().includes('rice') : false;
  const isWheat = inspectingLot ? inspectingLot.cropName.toLowerCase().includes('wheat') : true;

  const modalImageSrc = inspectingLot ? (
    inspectingLot.imageUrl || (
      isTomato
        ? 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1000&q=80'
        : isOnion
        ? 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=1000&q=80'
        : isRice
        ? 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80'
        : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80'
    )
  ) : '';

  // Landed calculation for modal instant bid action
  const modalFloor = inspectingLot ? (inspectingLot.askingFloorPerKg ?? inspectingLot.basePricePerKg) : 0;
  const modalFreight = inspectingLot ? (inspectingLot.freightPerKg ?? 1.20) : 0;
  const modalCess = modalFloor * 0.015;
  const modalLanded = modalFloor + modalFreight + modalCess;
  const modalTotal = inspectingLot ? Math.round(modalLanded * (inspectingLot.quantityKg ?? ((inspectingLot.quantityTons ?? 1) * 1000))) : 0;

  // Filter & Sort Logic
  const filteredAndSortedLots = useMemo(() => {
    let result = [...lots];

    // 1. Commodity Filter
    if (selectedCommodity !== 'ALL') {
      result = result.filter(l => l.cropName.toLowerCase().includes(selectedCommodity.toLowerCase()));
    }

    // 2. Grade Filter
    if (selectedGrade !== 'ALL') {
      result = result.filter(l => (l.qualityGrade || `Grade ${l.grade}`) === selectedGrade);
    }

    // 3. Shared Freight Toggle
    if (sharedFreightOnly) {
      result = result.filter(l => l.logisticsType === 'Shared Freight' || l.status === 'POOLED');
    }

    // 4. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l => 
        l.cropName.toLowerCase().includes(q) ||
        l.variety.toLowerCase().includes(q) ||
        l.farmerName.toLowerCase().includes(q) ||
        (l.origin && l.origin.toLowerCase().includes(q)) ||
        (l.location?.district && l.location.district.toLowerCase().includes(q))
      );
    }

    // 5. Sorting
    result.sort((a, b) => {
      const floorA = a.askingFloorPerKg ?? a.basePricePerKg;
      const floorB = b.askingFloorPerKg ?? b.basePricePerKg;
      const volA = a.quantityTons ?? (a.quantityKg / 1000);
      const volB = b.quantityTons ?? (b.quantityKg / 1000);
      const scoreA = a.qualityScore ?? 90;
      const scoreB = b.qualityScore ?? 90;
      const distA = a.distanceKm ?? 50;
      const distB = b.distanceKm ?? 50;

      switch (sortBy) {
        case 'floor_asc':
          return floorA - floorB;
        case 'floor_desc':
          return floorB - floorA;
        case 'volume_desc':
          return volB - volA;
        case 'grade_desc':
          return scoreB - scoreA;
        case 'distance_asc':
          return distA - distB;
        default:
          return 0;
      }
    });

    return result;
  }, [lots, selectedCommodity, selectedGrade, sharedFreightOnly, searchQuery, sortBy]);

  const handleInspect = (lot: CropLot) => {
    setInspectingLot(lot);
    setShowBoundingBoxes(true);
  };

  const handleCardBid = (lotId: string, bidAmount: number, landedCostPerKg: number, totalAmount: number) => {
    if (onPlaceBid) {
      onPlaceBid(lotId, bidAmount, landedCostPerKg, totalAmount);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ========================================================================= */}
      {/* 1. FILTER & SEARCH CONTROL TOOLBAR (Light Theme) */}
      {/* ========================================================================= */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-4 sm:p-5 space-y-4 shadow-sm">
        
        {/* Top Row: Commodity Quick Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: 'ALL', label: '🌾 All Commodities' },
              { id: 'Wheat', label: '🌾 Sharbati Wheat' },
              { id: 'Onion', label: '🧅 Red Onion' },
              { id: 'Tomato', label: '🍅 Hybrid Tomato' },
              { id: 'Rice', label: '🍚 Basmati Rice' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCommodity(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                  selectedCommodity === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-800 font-bold bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              {filteredAndSortedLots.length} Verified Lots Active
            </span>
          </div>
        </div>

        {/* Bottom Row: Search, Grade, Shared Freight & Sort Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
          
          {/* Search Input */}
          <div className="sm:col-span-4 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search variety, farmer, mandi origin..."
              className="pl-9 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs h-10 rounded-xl focus:bg-white focus:border-emerald-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Quality Grade Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold focus:bg-white focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All AI Grades</option>
              <option value="Grade A">Grade A (90%+)</option>
              <option value="Grade B">Grade B (80-89%)</option>
              <option value="Grade C">Grade C (Below 80%)</option>
            </select>
          </div>

          {/* Shared Freight Toggle */}
          <div className="sm:col-span-3">
            <button
              type="button"
              onClick={() => setSharedFreightOnly(!sharedFreightOnly)}
              className={`w-full h-10 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                sharedFreightOnly
                  ? 'bg-purple-100 text-purple-900 border-purple-300 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-purple-50 hover:text-purple-800'
              }`}
            >
              <Truck size={14} className={sharedFreightOnly ? 'text-purple-700' : 'text-purple-500'} />
              <span>Shared Freight (35%+ Saved)</span>
            </button>
          </div>

          {/* Sort By Selector */}
          <div className="sm:col-span-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full h-10 pl-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold focus:bg-white focus:border-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="floor_asc">Lowest Asking Floor (₹/kg)</option>
                <option value="floor_desc">Highest Asking Floor (₹/kg)</option>
                <option value="volume_desc">Largest Available Volume</option>
                <option value="grade_desc">Highest DINOv2 AI Grade</option>
                <option value="distance_asc">Closest Distance to Hub</option>
              </select>
              <ArrowUpDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. CROP LISTINGS 2-COLUMN RESPONSIVE GRID */}
      {/* ========================================================================= */}
      {filteredAndSortedLots.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredAndSortedLots.map((lot, idx) => (
            <CropListingCard
              key={`crop-lot-card-${lot.id}-${idx}`}
              lot={lot}
              onInspect={handleInspect}
              onPlaceBid={handleCardBid}
              isPlacingBid={placingBidLotId === lot.id}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Filter size={24} />
          </div>
          <h4 className="text-base font-bold text-slate-900">No crop lots matched your active filters</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try selecting "All Commodities", clearing the search text, or resetting the Shared Freight toggle.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCommodity('ALL');
              setSelectedGrade('ALL');
              setSharedFreightOnly(false);
              setSearchQuery('');
            }}
            className="border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-bold text-xs"
          >
            Reset All Filters
          </Button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE AI GRADE INSPECTION MODAL (Refined Diagnostic Experience) */}
      {/* ========================================================================= */}
      {inspectingLot && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white border border-emerald-100 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-0 text-slate-900">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-emerald-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    DINOv2 AI Vision Assay: {inspectingLot.cropName}
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 font-mono font-bold">
                      {inspectingLot.id}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {inspectingLot.variety} • Farmer: <strong className="text-slate-800">{inspectingLot.farmerName}</strong> ({inspectingLot.origin || 'Nashik'})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectingLot(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              
              {/* Image with Toggleable Computer Vision Bounding Boxes */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-slate-200 shadow-sm">
                <img
                  src={modalImageSrc}
                  alt={inspectingLot.cropName}
                  className="w-full h-full object-cover"
                />

                {/* Top-Right Toggle: Show Bounding Boxes vs Raw Photo */}
                <button
                  type="button"
                  onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                  className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
                    showBoundingBoxes
                      ? 'bg-emerald-600/90 text-white border border-emerald-400/60 shadow-emerald-950/30'
                      : 'bg-slate-900/85 text-slate-200 border border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <Sparkles size={13} className={showBoundingBoxes ? 'text-emerald-200' : 'text-slate-400'} />
                  <span>{showBoundingBoxes ? '🎯 AI Overlay ON' : '🖼️ Raw Photo (Clean)'}</span>
                </button>

                {/* Dynamic YOLO Detection Boxes matching exact Crop Type */}
                {showBoundingBoxes && (
                  <>
                    {isTomato ? (
                      <>
                        <div className="absolute top-[18%] left-[20%] w-[38%] h-[48%] border-2 border-emerald-400 rounded-xl bg-emerald-500/20 pointer-events-none flex flex-col justify-between p-2 shadow-lg animate-in fade-in">
                          <span className="text-[10px] font-mono font-black bg-emerald-600 text-white px-2 py-0.5 rounded self-start shadow">
                            Ripeness & Firmness: 96.4%
                          </span>
                          <span className="text-[9px] font-mono text-emerald-100 bg-slate-950/80 px-1.5 py-0.5 rounded self-end">
                            Brix: 5.2° • bbox: [0.20, 0.18, 0.38, 0.48]
                          </span>
                        </div>
                        <div className="absolute bottom-[20%] right-[15%] w-[24%] h-[28%] border border-amber-400 rounded-lg bg-amber-500/20 pointer-events-none p-1.5 animate-in fade-in">
                          <span className="text-[9px] font-mono font-bold bg-amber-600 text-white px-1.5 py-0.5 rounded">
                            Minor Sunscald / Defect: 1.2%
                          </span>
                        </div>
                      </>
                    ) : isOnion ? (
                      <>
                        <div className="absolute top-[15%] left-[22%] w-[42%] h-[50%] border-2 border-emerald-400 rounded-xl bg-emerald-500/20 pointer-events-none flex flex-col justify-between p-2 shadow-lg animate-in fade-in">
                          <span className="text-[10px] font-mono font-black bg-emerald-600 text-white px-2 py-0.5 rounded self-start shadow">
                            Dry Outer Skin Retention: 97.2%
                          </span>
                          <span className="text-[9px] font-mono text-emerald-100 bg-slate-950/80 px-1.5 py-0.5 rounded self-end">
                            Layer Integrity: Intact • bbox: [0.22, 0.15, 0.42, 0.50]
                          </span>
                        </div>
                        <div className="absolute top-[12%] right-[16%] w-[25%] h-[25%] border border-emerald-400 rounded-lg bg-emerald-500/15 pointer-events-none p-1.5 animate-in fade-in">
                          <span className="text-[9px] font-mono font-bold bg-emerald-700 text-white px-1.5 py-0.5 rounded">
                            Neck Closure: Tight (99.1%)
                          </span>
                        </div>
                      </>
                    ) : isRice ? (
                      <>
                        <div className="absolute top-[20%] left-[25%] w-[40%] h-[42%] border-2 border-emerald-400 rounded-xl bg-emerald-500/20 pointer-events-none flex flex-col justify-between p-2 shadow-lg animate-in fade-in">
                          <span className="text-[10px] font-mono font-black bg-emerald-600 text-white px-2 py-0.5 rounded self-start shadow">
                            Grain Length: 8.2mm (Avg)
                          </span>
                          <span className="text-[9px] font-mono text-emerald-100 bg-slate-950/80 px-1.5 py-0.5 rounded self-end">
                            Pusa-1121 • bbox: [0.25, 0.20, 0.40, 0.42]
                          </span>
                        </div>
                        <div className="absolute bottom-[18%] right-[15%] w-[22%] h-[25%] border border-blue-400 rounded-lg bg-blue-500/20 pointer-events-none p-1.5 animate-in fade-in">
                          <span className="text-[9px] font-mono font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">
                            Broken / Chalkiness: 0.8%
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="absolute top-[20%] left-[25%] w-[38%] h-[42%] border-2 border-emerald-400 rounded-xl bg-emerald-500/20 pointer-events-none flex flex-col justify-between p-2 shadow-lg animate-in fade-in">
                          <span className="text-[10px] font-mono font-black bg-emerald-600 text-white px-2 py-0.5 rounded self-start shadow">
                            Grain Uniformity: 98.4%
                          </span>
                          <span className="text-[9px] font-mono text-emerald-100 bg-slate-950/80 px-1.5 py-0.5 rounded self-end">
                            Lok-1 Sharbati • bbox: [0.25, 0.20, 0.38, 0.42]
                          </span>
                        </div>
                        <div className="absolute bottom-[18%] right-[15%] w-[22%] h-[25%] border border-blue-400 rounded-lg bg-blue-500/20 pointer-events-none p-1.5 animate-in fade-in">
                          <span className="text-[9px] font-mono font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">
                            Foreign Matter: 0.2%
                          </span>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Live Confidence Watermark */}
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs font-mono font-bold text-white flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Model: DINOv2-ViT-B/14 + CORAL (Acc: 68.14%, QWK: 0.91)</span>
                </div>
              </div>

              {/* Dynamic 4-Assay Quality Matrix matching Crop Type */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Assigned Grade</span>
                  <span className="text-lg font-black text-emerald-700">
                    {inspectingLot.qualityGrade || `Grade ${inspectingLot.grade}`}
                  </span>
                  <span className="text-[9px] text-slate-400 block font-mono">Agmarknet Certified</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">AI Confidence</span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    {inspectingLot.qualityScore || 92.5}%
                  </span>
                  <span className="text-[9px] text-emerald-700 block font-bold">Ultra High Confidence</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    {isTomato ? 'Soluble Solids & Brix' : isOnion ? 'Skin & Curing Index' : 'Moisture Content'}
                  </span>
                  <span className="text-lg font-black text-blue-700 font-mono flex items-center justify-center gap-0.5">
                    <Droplets size={14} className="text-blue-500" />
                    {isTomato ? '5.2° Brix' : isOnion ? '94.5%' : `${inspectingLot.moisture || 12.0}%`}
                  </span>
                  <span className="text-[9px] text-slate-400 block">
                    {isTomato ? 'Firm Flesh Texture' : isOnion ? 'Long Shelf-Life' : 'Optimal Dryness'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    {isTomato ? 'Sunscald / Spots' : isOnion ? 'Black Mould / Spores' : isRice ? 'Broken / Chalkiness' : 'Defect / Spot Area'}
                  </span>
                  <span className="text-lg font-black text-amber-700 font-mono">
                    {inspectingLot.defectArea || 2.1}%
                  </span>
                  <span className="text-[9px] text-slate-400 block">
                    {isTomato ? 'Below 5% Threshold' : isOnion ? 'Zero Rot Detected' : 'Premium Grade Level'}
                  </span>
                </div>
              </div>

              {/* Statutory Audit & Farmer Geotag Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <CheckCircle2 size={14} className="text-emerald-600" /> WhatsApp Direct Ingestion & Geotag Audit
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Harvested: {inspectingLot.harvestDate}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-500 text-[10px] block font-semibold">Verified Smallholder Farmer:</span>
                    <strong className="text-slate-900">{inspectingLot.farmerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-semibold">Cluster Geotag Origin:</span>
                    <span className="text-slate-800">{inspectingLot.origin || 'Nashik, Maharashtra'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-semibold">Mandi Asking Floor:</span>
                    <span className="text-emerald-700 font-mono font-bold">₹{modalFloor.toFixed(2)}/kg</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-semibold">Freight Mode & Savings:</span>
                    <span className="text-purple-700 font-bold">{inspectingLot.logisticsType || 'Shared Freight'} (₹{modalFreight.toFixed(2)}/kg)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer with Dynamic Instant Bid Action */}
            <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Lock size={12} className="text-emerald-600" /> Escrow deposit locked in bank vault upon acceptance
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInspectingLot(null)}
                  className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold px-4 h-9 rounded-xl"
                >
                  Done Inspecting
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    handleCardBid(inspectingLot.id, modalFloor, modalLanded, modalTotal);
                    setInspectingLot(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4.5 h-9 rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Lock size={13} />
                  <span>Place Instant Bid (₹{modalFloor.toFixed(2)}/kg)</span>
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
