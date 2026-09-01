'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Warehouse, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Edit, 
  QrCode, 
  Thermometer, 
  Droplets,
  Boxes,
  FileText,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resolveCropImageUrl } from '@/lib/assayData';
import { updateFPOLotStatus } from '@/lib/api/fpo-api';
import { toast } from 'sonner';

interface FPOAccordionItemProps {
  lot: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRefresh: () => void;
  onEdit: (lot: any) => void;
}

export function FPOAccordionItem({
  lot,
  isExpanded,
  onToggleExpand,
  onRefresh,
  onEdit
}: FPOAccordionItemProps) {
  const [activeSubTab, setActiveSubTab] = useState<'quality' | 'storage' | 'pooling' | 'escrow'>('quality');
  const [updating, setUpdating] = useState(false);

  const lotIdStr = typeof lot.id === 'string' ? lot.id : `LOT-${lot.id}`;
  const numericId = typeof lot.id === 'string' ? parseInt(lot.id.replace('LOT-', ''), 10) || 1 : lot.id;
  const commodity = lot.commodity || lot.cropName || 'Crop Produce';
  const variety = lot.variety || 'Certified Variety';
  const farmerName = lot.farmer_name || lot.farmerName || 'Ramesh Patil';
  const quantityKg = lot.quantity_kg || lot.quantityKg || 5000;
  const quantityTons = (quantityKg / 1000).toFixed(1);
  const basePrice = lot.base_price_per_kg || lot.basePricePerKg || 24.50;
  const gradeStr = (lot.quality_grade || lot.qualityGrade || 'Grade A').toString();
  const qualityScore = lot.quality_score || lot.qualityScore || 94.0;
  const defectPct = lot.defect_percentage || 1.8;
  const ripenessIdx = lot.ripeness_index || 95.0;
  const statusStr = (lot.status || 'LISTED').toString().toUpperCase();
  const imageUrl = resolveCropImageUrl(commodity, lot.image_url || lot.imageUrl);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await updateFPOLotStatus(numericId, newStatus);
      toast.success(`Lot #${lotIdStr} Status Updated`, {
        description: `Marked lot as ${newStatus}`
      });
      onRefresh();
    } catch (err: any) {
      toast.error('Failed to update status', {
        description: err.message
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleIssueENWR = () => {
    toast.success(`e-NWR Receipt Issued for ${lotIdStr}`, {
      description: 'Electronic Warehouse Receipt pledged with ICICI Bank for 70% pledge loan liquidity.'
    });
  };

  return (
    <div className={`rounded-2xl border transition-all duration-200 bg-white ${
      isExpanded 
        ? 'border-purple-400 ring-2 ring-purple-400/20 shadow-md' 
        : 'border-slate-200 hover:border-slate-300 shadow-2xs'
    }`}>
      
      {/* ========================================================================= */}
      {/* COMPACT SUMMARY ROW (COLLAPSED STATE) */}
      {/* ========================================================================= */}
      <div 
        onClick={onToggleExpand}
        className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer selection:bg-none"
      >
        
        {/* Left Column: Identifier & Commodity Info */}
        <div className="flex items-center gap-3.5 min-w-[280px]">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
            <img 
              src={imageUrl} 
              alt={commodity} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black font-mono text-purple-900 bg-purple-100 px-1.5 py-0.2 rounded">
                {lotIdStr}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {farmerName}
              </span>
            </div>
            <h4 className="text-sm font-black text-slate-900 tracking-tight">
              {commodity} <span className="text-slate-500 font-medium text-xs">({variety})</span>
            </h4>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <MapPin size={12} className="text-purple-600 shrink-0" />
              <span>{lot.district || 'Nashik'}, {lot.state || 'Maharashtra'}</span>
            </p>
          </div>
        </div>

        {/* Middle Column: Volume, Base Price & Grade */}
        <div className="flex flex-wrap items-center gap-4 lg:gap-8">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Volume &amp; Price
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900 font-mono">
                {quantityKg.toLocaleString('en-IN')} kg <span className="text-xs text-slate-500 font-normal">({quantityTons} MT)</span>
              </span>
              <strong className="text-emerald-700 text-sm font-mono font-black">
                ₹{Number(basePrice).toFixed(2)}/kg
              </strong>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Quality Grade
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Sparkles size={12} className="text-emerald-600" />
              {gradeStr.includes('C') ? 'Grade C' : gradeStr.includes('B') ? 'Grade B' : 'Grade A'} ({qualityScore}%)
            </span>
          </div>
        </div>

        {/* Right Column: Operational Status & Expand Toggle */}
        <div className="flex items-center justify-between lg:justify-end gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
          
          <span className={`text-[10px] font-black px-3 py-1 rounded-full border font-mono ${
            statusStr === 'POOLED'
              ? 'bg-purple-100 text-purple-900 border-purple-300'
              : statusStr === 'BID_ACCEPTED'
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
              : statusStr === 'REJECTED'
              ? 'bg-rose-100 text-rose-800 border-rose-300'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}>
            {statusStr}
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(lot);
              }}
              className="h-8 text-xs font-bold rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Edit size={13} />
              <span>Edit</span>
            </Button>

            <button 
              type="button"
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                isExpanded ? 'bg-purple-100 text-purple-900' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* EXPANDED FULL DETAILS CONTAINER */}
      {/* ========================================================================= */}
      {isExpanded && (
        <div className="border-t border-slate-200/80 p-5 sm:p-6 bg-slate-50/60 rounded-b-2xl space-y-5 animate-in fade-in duration-200">
          
          {/* Sub-Tab Navigation Header */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
            <button
              type="button"
              onClick={() => setActiveSubTab('quality')}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'quality'
                  ? 'bg-white text-purple-900 shadow-2xs border border-purple-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles size={13} className="text-purple-600" />
              <span>AI Quality &amp; Assay</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('storage')}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'storage'
                  ? 'bg-white text-blue-900 shadow-2xs border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Warehouse size={13} className="text-blue-600" />
              <span>Storage &amp; e-NWR</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('pooling')}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'pooling'
                  ? 'bg-white text-emerald-900 shadow-2xs border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck size={13} className="text-emerald-600" />
              <span>Freight Pooling</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('escrow')}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'escrow'
                  ? 'bg-white text-amber-900 shadow-2xs border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck size={13} className="text-amber-600" />
              <span>Bids &amp; Escrow</span>
            </button>
          </div>

          {/* Sub-Tab 1: AI Quality Telemetry */}
          {activeSubTab === 'quality' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  AI Assayed Quality Score
                </span>
                <p className="text-2xl font-black text-purple-900 font-mono">
                  {qualityScore}% Score
                </p>
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> DINOv2 Computer Vision Verified
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Defect &amp; Foreign Material
                </span>
                <p className="text-2xl font-black text-slate-900 font-mono">
                  {defectPct}% Defect
                </p>
                <span className="text-[11px] text-slate-500">
                  Agmarknet Grade Threshold: &lt; 3.0%
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Ripeness / Moisture Index
                </span>
                <p className="text-2xl font-black text-blue-700 font-mono">
                  {ripenessIdx}% Index
                </p>
                <span className="text-[11px] text-blue-600 font-bold">
                  Optimal Harvest Window
                </span>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Storage & e-NWR */}
          {activeSubTab === 'storage' && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h5 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Warehouse size={15} className="text-purple-600" />
                    <span>Niphad Cold Bay A-1 Allocation</span>
                  </h5>
                  <p className="text-xs text-slate-500">WDRA Certified e-NWR Receipt #eNWR-WDRA-A1-2026-8812</p>
                </div>
                <Button
                  size="sm"
                  className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl h-9"
                  onClick={handleIssueENWR}
                >
                  <FileText size={14} />
                  <span>Issue e-NWR Receipt</span>
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Temperature</span>
                  <strong className="text-slate-900 font-mono font-black">12.4°C</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Humidity</span>
                  <strong className="text-slate-900 font-mono font-black">88% RH</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">NABARD Subsidy</span>
                  <strong className="text-emerald-700 font-mono font-black">33.3% Subsidized</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Net Storage Rate</span>
                  <strong className="text-purple-900 font-mono font-black">₹0.14/kg/mo</strong>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Freight Pooling */}
          {activeSubTab === 'pooling' && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Truck size={15} className="text-emerald-600" />
                  PostGIS Spatial Geo-Cluster #CLST-01 (Nashik East)
                </span>
                <span className="font-black text-purple-900 font-mono">
                  -35.1% Freight Savings
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consolidated into 45-Ton Multi-Axle carrier milk-run originating from Niphad Central Aggregation Hub to Vashi APMC.
              </p>
            </div>
          )}

          {/* Sub-Tab 4: Bids & Escrow */}
          {activeSubTab === 'escrow' && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-amber-600" />
                  100% RBI Escrow Vault Locking
                </span>
                <span className="font-black text-emerald-700 font-mono">
                  2 Active Buyer Bids
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Buyer <strong>AgroProcure Private Ltd</strong> submitted bid of <strong>₹28.50/kg</strong> (₹1,42,500 total). Escrow locked.
              </p>
            </div>
          )}

          {/* Action Control Bar */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Workflow Actions:</span>
              {statusStr !== 'POOLED' && (
                <Button
                  size="sm"
                  disabled={updating}
                  onClick={() => handleStatusChange('POOLED')}
                  className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl h-9"
                >
                  <CheckCircle2 size={14} />
                  <span>Approve &amp; Pool</span>
                </Button>
              )}

              {statusStr !== 'REJECTED' && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={updating}
                  onClick={() => handleStatusChange('REJECTED')}
                  className="border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl h-9"
                >
                  <XCircle size={14} />
                  <span>Reject Lot</span>
                </Button>
              )}

              {statusStr === 'POOLED' && (
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl h-9"
                  disabled={updating}
                  onClick={() => handleStatusChange('IN_TRANSIT')}
                >
                  <Truck size={14} />
                  <span>Mark In-Transit</span>
                </Button>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(lot)}
              className="text-xs font-bold rounded-xl border-slate-300 text-slate-700 h-9"
            >
              <Edit size={14} />
              <span>Edit Details</span>
            </Button>
          </div>

        </div>
      )}

    </div>
  );
}
