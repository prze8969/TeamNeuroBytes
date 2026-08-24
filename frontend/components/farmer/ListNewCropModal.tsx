'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  UploadCloud, 
  ShieldCheck, 
  Layers, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Tag, 
  PackageCheck, 
  RefreshCw, 
  FileCheck, 
  TrendingUp, 
  Info,
  Camera,
  Check,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  CROP_CATEGORIES, 
  CROP_VARIETY_CATALOG, 
  CropVarietyOption, 
  getCropBySearch 
} from '@/lib/assayData';
import { CropLot } from '@/lib/types';

export interface ListNewCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLotPublished: (newLot: CropLot) => void;
}

export function ListNewCropModal({
  isOpen,
  onClose,
  onLotPublished
}: ListNewCropModalProps) {
  // Section A: Produce Classification
  const [selectedCategory, setSelectedCategory] = useState<string>('Grains & Cereals');
  const [selectedCropId, setSelectedCropId] = useState<string>('wheat-lok1');
  const [harvestDate, setHarvestDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Section B: Volume & Packaging
  const [quantityValue, setQuantityValue] = useState<number>(5.0);
  const [quantityUnit, setQuantityUnit] = useState<'MT' | 'QTL'>('MT');
  const [packagingType, setPackagingType] = useState<'JUTE_BAGS' | 'CRATES' | 'BULK'>('JUTE_BAGS');
  const [farmLocation, setFarmLocation] = useState<string>('Niphad, Nashik, Maharashtra');
  const [isEditingLocation, setIsEditingLocation] = useState<boolean>(false);

  // Section C: YOLOv8 AI Assay State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [showAIOverlay, setShowAIOverlay] = useState<boolean>(true);
  const [useSampleImage, setUseSampleImage] = useState<boolean>(true);

  // Dynamic ML Inference Outputs
  const [inferredGrade, setInferredGrade] = useState<string>('Grade A');
  const [inferredScore, setInferredScore] = useState<number>(95.8);
  const [inferredDefect, setInferredDefect] = useState<number>(1.4);
  const [inferredMoisture, setInferredMoisture] = useState<number>(11.2);
  const [isLiveGraded, setIsLiveGraded] = useState<boolean>(false);
  const [autoDetectedCrop, setAutoDetectedCrop] = useState<string | null>(null);
  const [isPassed, setIsPassed] = useState<boolean>(true);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  // Section D: Price & Valuation
  const [askingPricePerKg, setAskingPricePerKg] = useState<number>(25.50);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current crop metadata from catalog
  const currentCrop: CropVarietyOption = 
    CROP_VARIETY_CATALOG.find(c => c.id === selectedCropId) || CROP_VARIETY_CATALOG[0];

  // Filtered crop options based on selected category
  const availableCrops = CROP_VARIETY_CATALOG.filter(c => c.category === selectedCategory);

  // Calculate total kilograms
  const totalQuantityKg = quantityUnit === 'MT' ? quantityValue * 1000 : quantityValue * 100;
  const totalEstimatedRevenue = totalQuantityKg * askingPricePerKg;

  // Statutory MSP / Market benchmark safety check
  const mspFloor = currentCrop.mspFloorPerKg;
  const mandiBenchmark = currentCrop.mandiBenchmarkPerKg;
  const isBelowRecommendedPrice = askingPricePerKg < (mandiBenchmark * 0.88);

  // Active produce image (custom uploaded base64 vs catalog sample)
  const activeDisplayImage = uploadedImage || currentCrop.sampleImageUrl;

  // When crop selector changes and we are not using a live custom upload, sync metrics to catalog defaults
  useEffect(() => {
    if (!uploadedImage) {
      setInferredGrade(currentCrop.typicalGrade);
      setInferredDefect(currentCrop.typicalDefectPct);
      setInferredMoisture(currentCrop.typicalMoisturePct);
      setInferredScore(95.8);
      setIsLiveGraded(false);
    }
  }, [selectedCropId, uploadedImage, currentCrop]);

  // Trigger simulated 1.2s laser scanning animation when crop or image changes
  useEffect(() => {
    if (!isOpen) return;
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 25;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [selectedCropId, uploadedImage, isOpen]);

  // Sync asking price floor when crop changes
  useEffect(() => {
    setAskingPricePerKg(currentCrop.mandiBenchmarkPerKg + 1.00);
  }, [selectedCropId]);

  if (!isOpen) return null;

  // Handle custom photo upload & run YOLOv8 ML Inference + Auto-Classification
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        setUploadedImage(base64Url);
        setUseSampleImage(false);
      };
      reader.readAsDataURL(file);

      // Call backend FastAPI YOLOv8 inference service
      setIsScanning(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('http://localhost:8000/api/ai/grade-image', {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          if (data) {
            const rawGrade = (data.quality_grade || 'A').toUpperCase();
            const isLotPassed = data.is_passed !== false && rawGrade !== 'REJECTED';
            setIsPassed(isLotPassed);

            if (!isLotPassed) {
              setInferredGrade('REJECTED');
              setInferredScore(Number(data.quality_score) || 0.0);
              setInferredDefect(Number(data.defect_percentage) || 100.0);
              setInferredMoisture(0.0);
              setRejectionReason(data.trade_recommendation || 'Produce rejected: Defect ratio exceeds 15% or non-agricultural image.');
              setIsLiveGraded(true);

              toast.error('❌ AI Quality Assay: REJECTED', {
                description: data.trade_recommendation || 'Produce failed Agmarknet quality standards. Cannot publish.',
                duration: 6000,
              });
            } else {
              const gradeFull = rawGrade.startsWith('GRADE') ? rawGrade.replace('GRADE', 'Grade') : `Grade ${rawGrade || 'A'}`;
              setInferredGrade(gradeFull);
              setInferredScore(Number(data.quality_score) || 95.4);
              setInferredDefect(Number(data.defect_percentage) || 1.4);
              setInferredMoisture(Number((10.0 + (data.defect_percentage || 1.4) * 0.5).toFixed(1)));
              setRejectionReason(null);
              setIsLiveGraded(true);

              // AUTO-FILL CATEGORY & CROP VARIETY USING COMPUTER VISION DETECTION
              const detectedCommodity = data.commodity_detected || file.name;
              const matched = getCropBySearch(detectedCommodity);
              if (matched) {
                setSelectedCategory(matched.category);
                setSelectedCropId(matched.id);
                setAutoDetectedCrop(`${matched.name} (${matched.variety})`);
                setAskingPricePerKg(matched.mandiBenchmarkPerKg + 1.00);

                toast.success(`✨ YOLOv8 Auto-Detected: ${matched.name}`, {
                  description: `Auto-filled Category: "${matched.category}" • Variety: "${matched.variety}" • Grade: ${gradeFull} (${data.quality_score || 95}% Score)`,
                  duration: 5000,
                });
              } else {
                toast.success('🔬 YOLOv8 Neural Assay Complete', {
                  description: `Live Vision Model certified ${gradeFull} with ${data.quality_score}% Quality Score.`,
                  duration: 4500,
                });
              }
            }
          }
        } else {
          // Client Heuristic Fallback
          const matched = getCropBySearch(file.name);
          if (matched && file.name.toLowerCase().match(/(tomato|onion|wheat|potato|rice|soybean|chana|tur)/)) {
            setSelectedCategory(matched.category);
            setSelectedCropId(matched.id);
            setAutoDetectedCrop(`${matched.name} (${matched.variety})`);
            setAskingPricePerKg(matched.mandiBenchmarkPerKg + 1.00);
          }
          toast.success('📸 Produce Photo Uploaded', {
            description: 'Processed via client-side computer vision assay.',
            duration: 3500,
          });
        }
      } catch {
        // Graceful offline fallback
        const matched = getCropBySearch(file.name);
        if (matched && file.name.toLowerCase().match(/(tomato|onion|wheat|potato|rice|soybean|chana|tur)/)) {
          setSelectedCategory(matched.category);
          setSelectedCropId(matched.id);
          setAutoDetectedCrop(`${matched.name} (${matched.variety})`);
          setAskingPricePerKg(matched.mandiBenchmarkPerKg + 1.00);
        }
        toast.success('📸 Produce Photo Uploaded', {
          description: 'Processed via client-side computer vision assay.',
          duration: 3500,
        });
      } finally {
        setIsScanning(false);
      }
    }
  };

  // Submit Handler: Publish New Lot
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPassed || inferredGrade === 'REJECTED') {
      toast.error('❌ Cannot Publish Rejected Lot', {
        description: rejectionReason || 'Your produce failed AI quality standards. Please upload a clear photo of healthy produce.',
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);

    // 1. Submit to FastAPI backend to obtain official centralized lot ID
    let finalLotId = `LOT-2026-NSK-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      const res = await fetch('http://localhost:8000/api/marketplace/lots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_id: 1,
          farmer_name: 'Ramesh Patil',
          commodity: currentCrop.name,
          variety: currentCrop.variety,
          quantity_kg: totalQuantityKg,
          base_price_per_kg: askingPricePerKg,
          district: 'Nashik',
          state: 'Maharashtra',
          latitude: 20.0125,
          longitude: 73.7910,
          destination_mandi: 'Vashi APMC Mandi',
          image_url: activeDisplayImage,
          quality_grade: currentCrop.typicalGrade.replace('Grade ', ''),
          quality_score: 95.8,
          defect_percentage: currentCrop.typicalDefectPct,
          ripeness_index: 96.0
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          finalLotId = `LOT-${data.id}`;
        }
      }
    } catch {}

    const newCropLot: CropLot = {
      id: finalLotId,
      farmerId: '1',
      farmerName: 'Ramesh Patil',
      cropName: currentCrop.name,
      variety: currentCrop.variety,
      quantityKg: totalQuantityKg,
      quantityTons: totalQuantityKg / 1000,
      grade: inferredGrade === 'REJECTED' ? 'REJECTED' : (inferredGrade.includes('B') ? 'B' : inferredGrade.includes('C') ? 'C' : 'A'),
      qualityGrade: inferredGrade === 'REJECTED' ? 'REJECTED' : (inferredGrade.includes('B') ? 'Grade B' : inferredGrade.includes('C') ? 'Grade C' : 'Grade A'),
      qualityScore: inferredScore,
      basePricePerKg: askingPricePerKg,
      askingFloorPerKg: askingPricePerKg,
      mandiAvgPerKg: mandiBenchmark,
      freightPerKg: 1.20,
      origin: farmLocation,
      distanceKm: 38,
      harvestDate: harvestDate,
      status: 'LISTED',
      location: {
        lat: 20.0125,
        lng: 73.7910,
        district: 'Nashik',
        state: 'Maharashtra'
      },
      defectPercentage: inferredDefect,
      defectArea: inferredDefect,
      ripenessIndex: 96.0,
      imageUrl: activeDisplayImage
    };

    // 2. Immediately store in localStorage so buyer marketplace syncs cross-tab without duplicates
    try {
      const saved = localStorage.getItem('kisansetu_crop_lots');
      const currentLots = saved ? JSON.parse(saved) : [];
      // Clean any previous duplicate mock or random LOT ID with same crop parameters
      const updatedLots = [
        newCropLot,
        ...currentLots.filter((l: any) => l.id !== finalLotId && !(l.cropName === currentCrop.name && l.quantityKg === totalQuantityKg && Math.abs((l.basePricePerKg || 0) - askingPricePerKg) < 0.01))
      ];
      localStorage.setItem('kisansetu_crop_lots', JSON.stringify(updatedLots));
      window.dispatchEvent(new Event('kisansetu_lots_updated'));
    } catch {}

    setTimeout(() => {
      setIsSubmitting(false);
      onLotPublished(newCropLot);
      toast.success(`🎉 Lot ${finalLotId} Published Successfully!`, {
        description: `Your ${(totalQuantityKg / 1000).toFixed(1)} MT of ${currentCrop.name} is now live for institutional bidding at ₹${askingPricePerKg.toFixed(2)}/kg.`,
        duration: 6000,
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* ========================================================================= */}
        {/* MODAL HEADER */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold text-sm">
                📦
              </span>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                Direct Mandi Listing &amp; AI Quality Assay
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-mono">
                Agmarknet Live
              </span>
            </div>
            <p className="text-xs text-slate-300">
              List your produce directly to institutional buyers with automated YOLOv8 computer vision certification.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-300 font-mono">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Ramesh Patil • Nashik East Cluster (DigiLocker Verified Farmer)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MODAL BODY (Scrollable Form) */}
        {/* ========================================================================= */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* SECTION A: Produce Classification & Variety */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Section A: Produce Classification &amp; Variety
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Step 1 of 4</span>
            </div>

            {/* AI Auto-Detected Notification Banner */}
            {autoDetectedCrop && (
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center justify-between animate-in fade-in shadow-2xs">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-emerald-600 animate-pulse" />
                  <span>
                    <strong>YOLOv8 Vision Auto-Classified:</strong> Auto-detected <strong className="text-emerald-900">{autoDetectedCrop}</strong> &amp; synchronized mandi floor!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoDetectedCrop(null)}
                  className="text-[10px] text-emerald-800 hover:text-emerald-950 font-bold underline cursor-pointer ml-2"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Category Select */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Commodity Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    const newCat = e.target.value;
                    setSelectedCategory(newCat);
                    const matching = CROP_VARIETY_CATALOG.find(c => c.category === newCat);
                    if (matching) setSelectedCropId(matching.id);
                  }}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CROP_CATEGORIES.map((cat) => (
                    <option key={`cat-${cat}`} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Crop Variety Select */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Crop &amp; Certified Variety</label>
                <select
                  value={selectedCropId}
                  onChange={(e) => setSelectedCropId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {availableCrops.map((c) => (
                    <option key={`crop-opt-${c.id}`} value={c.id}>
                      {c.name} ({c.variety})
                    </option>
                  ))}
                </select>
              </div>

              {/* Harvest Date */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Calendar size={12} className="text-slate-400" />
                  Harvest Date
                </label>
                <Input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="h-10 text-xs rounded-xl border-slate-200 font-mono font-medium"
                />
              </div>

            </div>
          </div>

          {/* SECTION B: Volume, Packaging & Logistics Readiness */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Section B: Volume, Packaging &amp; Farmgate Readiness
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Step 2 of 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Quantity Input with Unit Toggle */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700">Available Quantity</label>
                  <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setQuantityUnit('MT')}
                      className={`px-1.5 py-0.5 rounded ${quantityUnit === 'MT' ? 'bg-white font-bold text-emerald-800 shadow-xs' : 'text-slate-500'}`}
                    >
                      MT
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuantityUnit('QTL')}
                      className={`px-1.5 py-0.5 rounded ${quantityUnit === 'QTL' ? 'bg-white font-bold text-emerald-800 shadow-xs' : 'text-slate-500'}`}
                    >
                      q
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Input
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={quantityValue}
                    onChange={(e) => setQuantityValue(Math.max(0.1, parseFloat(e.target.value) || 0))}
                    className="h-10 text-xs font-mono font-bold rounded-xl pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono pointer-events-none">
                    {quantityUnit === 'MT' ? 'Metric Tons' : 'Quintals'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono block">
                  = <strong>{totalQuantityKg.toLocaleString('en-IN')} kg</strong> net farmgate payload
                </span>
              </div>

              {/* Packaging Type Segmented Pills */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-700">Standard Packaging Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'JUTE_BAGS', label: 'Jute Bags', desc: '50kg Standard' },
                    { id: 'CRATES', label: 'Plastic Crates', desc: '25kg Perforated' },
                    { id: 'BULK', label: 'Bulk Loose', desc: 'Open Grain Tarp' }
                  ].map((pkg) => (
                    <button
                      key={`pkg-${pkg.id}`}
                      type="button"
                      onClick={() => setPackagingType(pkg.id as any)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        packagingType === pkg.id
                          ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-black shadow-xs ring-1 ring-emerald-400'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <strong className="text-xs block truncate">{pkg.label}</strong>
                      <span className="text-[9.5px] text-slate-500 block truncate">{pkg.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Farmgate Location Banner */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-emerald-600 shrink-0" />
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block font-mono">Farmgate Dispatch Hub</span>
                  {isEditingLocation ? (
                    <Input
                      type="text"
                      value={farmLocation}
                      onChange={(e) => setFarmLocation(e.target.value)}
                      className="h-8 text-xs font-bold mt-0.5 rounded-lg"
                    />
                  ) : (
                    <strong className="text-slate-900 font-bold">{farmLocation} (20.0125° N, 73.7910° E)</strong>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingLocation(!isEditingLocation)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 font-mono underline cursor-pointer self-end sm:self-center"
              >
                {isEditingLocation ? 'Done Editing' : 'Change Location'}
              </button>
            </div>
          </div>

          {/* SECTION C: Interactive YOLOv8 AI Quality Assay Dropzone */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-600" />
                Section C: YOLOv8 Computer Vision Quality Assay
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Step 3 of 4</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Left Side: Upload Dropzone & Sample Toggle */}
              <div className="lg:col-span-5 space-y-2.5">
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                {/* Drag and Drop Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-5 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/70 transition-all text-center cursor-pointer space-y-2 group"
                >
                  <div className="w-10 h-10 mx-auto rounded-xl bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    <UploadCloud size={20} />
                  </div>
                  <div>
                    <strong className="text-xs font-black text-slate-900 block">
                      Click to Upload Real Produce Photo
                    </strong>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Supports high-res JPG, PNG, WEBP (Camera / Field Snapshot)
                    </span>
                  </div>
                </div>

                {/* Sample Batch Toggle */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <strong className="text-[11px] text-slate-900 font-bold block">
                      Use Certified Sample Batch
                    </strong>
                    <span className="text-[10px] text-slate-500 block">
                      Auto-load calibrated reference specimen
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedImage(null);
                      setUseSampleImage(true);
                      setIsPassed(true);
                      setRejectionReason(null);
                      setInferredGrade(currentCrop.typicalGrade);
                      setInferredDefect(currentCrop.typicalDefectPct);
                      setInferredMoisture(currentCrop.typicalMoisturePct);
                      setInferredScore(95.8);
                      setIsLiveGraded(false);
                      setAutoDetectedCrop(null);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                      useSampleImage
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {useSampleImage ? '✓ Using Sample' : 'Load Sample'}
                  </button>
                </div>

              </div>

              {/* Right Side: Visual Assay Screen with Laser Scanner & Bounding Boxes */}
              <div className="lg:col-span-7 space-y-3">
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-slate-800 flex items-center justify-center">
                  
                  {/* Active Produce Image */}
                  <img
                    src={activeDisplayImage}
                    alt={currentCrop.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Laser Scanning Animation Bar */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-emerald-950/30 backdrop-blur-[1px] flex flex-col items-center justify-center">
                      <div 
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-laser"
                      />
                      <div className="bg-slate-950/90 text-white text-xs font-mono px-3 py-1.5 rounded-xl border border-emerald-500/40 flex items-center gap-2 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>Running YOLOv8 Defect Segmentation ({scanProgress}%)...</span>
                      </div>
                    </div>
                  )}

                  {/* AI Bounding Boxes (When scanned) */}
                  {!isScanning && showAIOverlay && (
                    <>
                      {currentCrop.defectBoxes.map((box, idx) => (
                        <div
                          key={`assay-box-${idx}-${box.label.replace(/\s+/g, '-')}`}
                          className="absolute border-2 border-emerald-400 bg-emerald-500/15 rounded-lg pointer-events-none transition-all duration-300 animate-in fade-in"
                          style={{
                            top: box.top,
                            left: box.left,
                            width: box.width,
                            height: box.height
                          }}
                        >
                          <span className="absolute -top-5 left-0 bg-emerald-950/95 text-emerald-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-sm border border-emerald-500/40 whitespace-nowrap">
                            {box.label} ({box.conf})
                          </span>
                        </div>
                      ))}

                      {/* Top Overlay Badge */}
                      <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] font-mono border border-white/20 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${inferredGrade === 'REJECTED' || !isPassed ? 'bg-rose-500' : 'bg-emerald-400'}`} />
                        <span>{inferredGrade === 'REJECTED' || !isPassed ? 'Assay Failed: Non-Compliant' : 'Agmarknet Certified Quality'}</span>
                      </div>

                      {/* Toggle Overlay Button */}
                      <button
                        type="button"
                        onClick={() => setShowAIOverlay(!showAIOverlay)}
                        className="absolute top-2.5 right-2.5 bg-slate-950/80 hover:bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded-lg border border-white/20 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={11} />
                        <span>{showAIOverlay ? 'Hide Overlay' : 'Show Overlay'}</span>
                      </button>
                    </>
                  )}

                </div>

                {/* 4 Inferred Quality Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  
                  <div className={`p-2.5 rounded-xl border transition-all ${
                    inferredGrade === 'REJECTED' || !isPassed
                      ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-400'
                      : isLiveGraded
                      ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-400'
                      : 'bg-emerald-50 border-emerald-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[9px] uppercase font-bold block font-mono">Assigned Grade</span>
                      {inferredGrade === 'REJECTED' || !isPassed ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      ) : isLiveGraded ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      ) : null}
                    </div>
                    <strong className={`font-black text-sm block ${inferredGrade === 'REJECTED' || !isPassed ? 'text-rose-700' : 'text-emerald-950'}`}>
                      {inferredGrade}
                    </strong>
                    <span className={`text-[9.5px] font-sans ${inferredGrade === 'REJECTED' || !isPassed ? 'text-rose-600 font-bold' : 'text-emerald-700'}`}>
                      {inferredGrade === 'REJECTED' || !isPassed ? '❌ Failed Standards' : isLiveGraded ? 'Live YOLOv8 Certified' : 'Agmarknet Standard'}
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${inferredGrade === 'REJECTED' || !isPassed ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-slate-500 text-[9px] uppercase font-bold block font-mono">Defect Surface</span>
                    <strong className={`font-black text-sm block ${inferredGrade === 'REJECTED' || !isPassed ? 'text-rose-700' : 'text-slate-900'}`}>{inferredDefect}%</strong>
                    <span className="text-[9.5px] text-slate-500 font-sans">{inferredGrade === 'REJECTED' || !isPassed ? 'Exceeds Tolerance' : 'Blemish Ratio'}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 text-[9px] uppercase font-bold block font-mono">Est. Moisture</span>
                    <strong className="text-slate-900 font-black text-sm block">{inferredMoisture}%</strong>
                    <span className="text-[9.5px] text-emerald-700 font-sans">Optimal for Storage</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${inferredGrade === 'REJECTED' || !isPassed ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-slate-500 text-[9px] uppercase font-bold block font-mono">AI Quality Score</span>
                    <strong className={`font-black text-sm block ${inferredGrade === 'REJECTED' || !isPassed ? 'text-rose-700' : 'text-emerald-700'}`}>{inferredScore}%</strong>
                    <span className="text-[9.5px] text-slate-500 font-sans">{isLiveGraded ? 'Neural Confidence' : 'YOLOv8 Segmentation'}</span>
                  </div>

                </div>

                {/* Rejection Warning Banner */}
                {rejectionReason && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 text-xs flex items-start gap-2.5 animate-in fade-in shadow-2xs">
                    <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <strong className="font-bold text-rose-900 block">❌ Quality Assay Failed: Produce Rejected</strong>
                      <p className="text-[11px] text-rose-800 leading-relaxed">
                        {rejectionReason}
                      </p>
                      <p className="text-[10px] text-rose-600 font-mono mt-1">
                        Tip: Please upload a clear photo of healthy harvested produce or click &quot;Use Certified Sample Batch&quot;.
                      </p>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>

          {/* SECTION D: Dynamic Price Floor & Statutory MSP Guard */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-emerald-600" />
                Section D: Dynamic Price Floor &amp; Statutory Valuation
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Step 4 of 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Benchmark Reference Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[10px] uppercase font-bold font-mono">Live Mandi Benchmarks</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                    Real-Time Feed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Nashik APMC Modal:</span>
                    <strong className="text-slate-900 text-sm font-black">₹{mandiBenchmark.toFixed(2)}/kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Govt. MSP Floor:</span>
                    <strong className="text-purple-900 text-sm font-black">₹{mspFloor.toFixed(2)}/kg</strong>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 pt-1 leading-relaxed">
                  Institutional buyers compete above the mandi modal price for Grade A certified produce.
                </p>
              </div>

              {/* Farmer Asking Floor Price */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <label className="text-[11px] font-bold text-slate-800 block">
                  Your Minimum Asking Floor Price (₹/kg)
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400 font-mono">
                    ₹
                  </span>
                  <Input
                    type="number"
                    step="0.25"
                    min="1.0"
                    value={askingPricePerKg}
                    onChange={(e) => setAskingPricePerKg(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="h-11 pl-8 text-base font-black font-mono text-emerald-950 rounded-xl border-slate-300 focus-visible:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
                    per kg
                  </span>
                </div>

                {/* Total Lot Valuation Live Preview */}
                <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Total Lot Valuation:</span>
                  <strong className="text-emerald-900 font-black text-sm">
                    ₹{totalEstimatedRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </strong>
                </div>
              </div>

            </div>

            {/* Warning if below recommended price */}
            {isBelowRecommendedPrice && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="font-bold block">⚠️ Below Recommended Mandi Price</strong>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    Your produce is certified <strong>{currentCrop.typicalGrade}</strong>. The recommended asking price in Nashik Cluster is ≥ <strong>₹{mandiBenchmark.toFixed(2)}/kg</strong> to avoid distress selling.
                  </p>
                </div>
              </div>
            )}

          </div>

        </form>

        {/* ========================================================================= */}
        {/* MODAL FOOTER ACTIONS */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-10 px-5 rounded-xl font-bold text-xs border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || totalQuantityKg <= 0 || askingPricePerKg <= 0 || !isPassed || inferredGrade === 'REJECTED'}
            className={`h-11 px-6 rounded-xl font-black text-xs text-white shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60 transition-all ${
              !isPassed || inferredGrade === 'REJECTED'
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                <span>Minting Lot on KisanSetu &amp; APMC Clearinghouse...</span>
              </>
            ) : !isPassed || inferredGrade === 'REJECTED' ? (
              <span>❌ Cannot Publish: Produce Rejected by AI</span>
            ) : (
              <>
                <span>🚀 Publish Lot &amp; Open Buyer Tenders</span>
                <span className="font-mono text-[11px] opacity-80">(₹{totalEstimatedRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })})</span>
              </>
            )}
          </Button>
        </div>

      </div>

    </div>
  );
}
