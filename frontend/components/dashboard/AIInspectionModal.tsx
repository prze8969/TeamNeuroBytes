'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  Layers, 
  Scale, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Gavel
} from 'lucide-react';
import { CropLot } from '@/lib/types';
import { Button } from '@/components/ui/button';

export interface AIInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: CropLot | null;
  onInstantBid?: (lot: CropLot) => void;
}

export function AIInspectionModal({
  isOpen,
  onClose,
  lot,
  onInstantBid
}: AIInspectionModalProps) {
  const [showAIOverlay, setShowAIOverlay] = useState<boolean>(true);

  if (!isOpen || !lot) return null;

  const cropNameLower = lot.cropName.toLowerCase();

  // Dynamic Image & Bounding Box Routing
  let cropTypeKey: 'tomato' | 'onion' | 'wheat' | 'rice' = 'wheat';
  let dynamicImage = lot.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80';
  let defectBoxes = [{ top: '38%', left: '44%', width: '18%', height: '18%', label: 'Broken Grain: 1.2%', conf: '94.2%' }];
  let assayMetrics = {
    uniformity: `${lot.ripenessIndex || 97.4}% (Lot-1 Premium)`,
    blemish: `${lot.defectPercentage || 1.2}% (Agmarknet Pass)`,
    size: '6.8 mm (Uniform Grain)',
    moisture: '10.8% (Target < 12%)'
  };

  if (cropNameLower.includes('tomato')) {
    cropTypeKey = 'tomato';
    if (!lot.imageUrl) {
      dynamicImage = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80';
    }
    defectBoxes = [
      { top: '24%', left: '32%', width: '22%', height: '22%', label: `Skin Blemish: ${lot.defectPercentage || 1.4}%`, conf: '96.1%' },
      { top: '56%', left: '60%', width: '20%', height: '20%', label: 'Firm Red Ripeness', conf: '98.4%' },
      { top: '48%', left: '18%', width: '18%', height: '18%', label: 'Caliber: 62mm', conf: '94.8%' }
    ];
    assayMetrics = {
      uniformity: `${lot.ripenessIndex || 94.8}% (Firm Red)`,
      blemish: `${lot.defectPercentage || 1.4}% (Class-1 Grade)`,
      size: '62-68 mm (Grade A)',
      moisture: '91.2% (Optimal Firmness)'
    };
  } else if (cropNameLower.includes('onion')) {
    cropTypeKey = 'onion';
    if (!lot.imageUrl) {
      dynamicImage = 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80';
    }
    defectBoxes = [
      { top: '30%', left: '38%', width: '28%', height: '28%', label: 'Outer Tunic Dry: 98%', conf: '97.5%' },
      { top: '62%', left: '22%', width: '24%', height: '24%', label: 'Diameter: 55mm (Grade A)', conf: '95.2%' }
    ];
    assayMetrics = {
      uniformity: `${lot.ripenessIndex || 96.2}% (Garva Standard)`,
      blemish: `${lot.defectPercentage || 0.8}% (Tight Skin)`,
      size: '50-60 mm (Export Grade)',
      moisture: '12.4% (Cured Dry)'
    };
  } else if (cropNameLower.includes('rice') || cropNameLower.includes('basmati')) {
    cropTypeKey = 'rice';
    if (!lot.imageUrl) {
      dynamicImage = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80';
    }
    defectBoxes = [
      { top: '35%', left: '30%', width: '40%', height: '35%', label: '1121 Grain Length: 8.4mm', conf: '98.1%' },
      { top: '20%', left: '60%', width: '25%', height: '25%', label: 'Chalkiness: 0.4%', conf: '96.8%' }
    ];
    assayMetrics = {
      uniformity: `${lot.ripenessIndex || 98.6}% (Steam Extra Long)`,
      blemish: `${lot.defectPercentage || 0.4}% (Chalkiness < 1%)`,
      size: '8.4 mm (Aged Basmati)',
      moisture: '11.8% (Milling Grade)'
    };
  } else if (cropNameLower.includes('soybean') || cropNameLower.includes('soya')) {
    if (!lot.imageUrl) {
      dynamicImage = 'https://images.unsplash.com/photo-1599579086118-ff3599903b41?auto=format&fit=crop&w=800&q=80';
    }
    defectBoxes = [
      { top: '28%', left: '34%', width: '24%', height: '24%', label: `Pod Blemish: ${lot.defectPercentage || 0.9}%`, conf: '95.5%' },
      { top: '54%', left: '48%', width: '22%', height: '22%', label: 'Oil Content: 19.8%', conf: '97.2%' }
    ];
    assayMetrics = {
      uniformity: `${lot.ripenessIndex || 97.2}% (JS-335 Yellow)`,
      blemish: `${lot.defectPercentage || 0.9}% (Clean Pods)`,
      size: '7.2 mm (Bold Sieve)',
      moisture: '10.2% (Oil Milling Pass)'
    };
  }

  const floorPrice = lot.askingFloorPerKg ?? lot.basePricePerKg;
  const gradeKey = lot.qualityGrade ?? `Grade ${lot.grade}`;
  const qualityScore = lot.qualityScore ?? 94.2;

  const handleInstantBid = () => {
    if (onInstantBid) {
      onInstantBid(lot);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-slate-900 space-y-0 animate-in zoom-in-95 duration-200">
        
        {/* ========================================================================= */}
        {/* MODAL HEADER */}
        {/* ========================================================================= */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-emerald-50/50 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold">
                <Sparkles size={16} />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                YOLOv8 Computer Vision Assay &amp; Quality Inspection
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              {lot.cropName} ({lot.variety}) • Farmer: <strong className="text-slate-800">{lot.farmerName}</strong> ({lot.origin || 'Nashik'})
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MODAL BODY */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          
          {/* Main Inspection Viewport with Overlays */}
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group">
            
            {/* Produce Photo */}
            <img
              src={dynamicImage}
              alt={lot.cropName}
              className="w-full h-full object-cover"
            />

            {/* Toggle Overlay Switch (Top Right) */}
            <div className="absolute top-3 right-3 z-10">
              <button
                type="button"
                onClick={() => setShowAIOverlay(!showAIOverlay)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all backdrop-blur-md border shadow-md flex items-center gap-1.5 cursor-pointer ${
                  showAIOverlay
                    ? 'bg-emerald-600/90 text-white border-emerald-400/50 ring-2 ring-emerald-500/30'
                    : 'bg-slate-900/80 text-slate-200 border-white/20 hover:bg-slate-900'
                }`}
              >
                {showAIOverlay ? <Layers size={13} /> : <Eye size={13} />}
                <span>{showAIOverlay ? '🎯 AI Overlay ON' : '🖼️ Raw Photo'}</span>
              </button>
            </div>

            {/* AI Bounding Boxes */}
            {showAIOverlay && (
              <>
                {defectBoxes.map((box, idx) => (
                  <div
                    key={`defect-box-${idx}-${box.label.replace(/\s+/g, '-')}`}
                    className="absolute border-2 border-emerald-400 bg-emerald-500/15 rounded-lg pointer-events-none transition-all duration-300 animate-in fade-in"
                    style={{
                      top: box.top,
                      left: box.left,
                      width: box.width,
                      height: box.height
                    }}
                  >
                    <span className="absolute -top-5 left-0 bg-emerald-950/90 text-emerald-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-sm border border-emerald-500/40 whitespace-nowrap">
                      {box.label} ({box.conf})
                    </span>
                  </div>
                ))}

                {/* Bottom Verification Banner */}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-950/85 backdrop-blur-md p-2.5 px-3.5 rounded-xl border border-emerald-500/30 text-white text-xs flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                    <span>Agmarknet Statutory Standard: <strong>Passed</strong></span>
                  </div>
                  <span className="text-emerald-400 font-bold">
                    {gradeKey} ({qualityScore}%)
                  </span>
                </div>
              </>
            )}

          </div>

          {/* 4 Quality Assay Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Color Uniformity</span>
              <strong className="text-slate-900 font-mono font-bold block pt-0.5">{assayMetrics.uniformity}</strong>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Surface Blemish</span>
              <strong className="text-emerald-700 font-mono font-bold block pt-0.5">{assayMetrics.blemish}</strong>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Size Calibration</span>
              <strong className="text-slate-900 font-mono font-bold block pt-0.5">{assayMetrics.size}</strong>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Moisture Index</span>
              <strong className="text-slate-900 font-mono font-bold block pt-0.5">{assayMetrics.moisture}</strong>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* MODAL FOOTER WITH INSTANT BID ACTION */}
        {/* ========================================================================= */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div className="text-xs">
            <span className="text-slate-500">Asking Floor Rate:</span>
            <strong className="text-emerald-800 font-mono font-black text-sm block">
              ₹{floorPrice.toFixed(2)} / kg
            </strong>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-4 rounded-xl text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Close
            </Button>

            <Button
              type="button"
              onClick={handleInstantBid}
              className="h-10 px-5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
            >
              <Gavel size={14} />
              <span>Place Instant Bid (₹{floorPrice.toFixed(2)}/kg)</span>
              <ArrowRight size={13} />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
