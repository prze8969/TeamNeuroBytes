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
import { useCropTranslation, useLocaleContext, toLocalizedDigits } from '@/lib/LocaleContext';

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
  const { currentLocale } = useLocaleContext();
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

  const fpoNameDisplay = useMemo(() => {
    switch (currentLocale) {
      case 'hi': return 'नासिक ईस्ट फार्मर्स प्रोड्यूसर कंपनी';
      case 'mr': return 'नाशिक ईस्ट फार्मर्स प्रोड्युसर कंपनी';
      case 'pa': return 'ਨਾਸਿਕ ਈਸਟ ਫਾਰਮਰਜ਼ ਪ੍ਰੋਡਿਊਸਰ ਕੰਪਨੀ';
      case 'gu': return 'નાસિક ઈસ્ટ ફાર્મર્સ પ્રોડ્યુસર કંપની';
      case 'ta': return 'நாசிக் ஈஸ்ட் விவசாயிகள் உற்பத்தியாளர் நிறுவனம்';
      case 'te': return 'నాసిక్ ఈస్ట్ రైతుల ఉత్పత్తిదారుల సంస్థ';
      case 'kn': return 'ನಾಸಿಕ್ ಈಸ್ಟ್ ರೈತರ ಉತ್ಪಾದಕರ ಕಂಪನಿ';
      default: return FPO_NAME;
    }
  }, [currentLocale]);

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

  // Collective Capacity Calculation (Standard 45.0 MT multi-axle truck)
  const totalCombinedWeightMT = BASELINE_COLLECTIVE_WEIGHT_MT + selectedTonnage;
  const actualCapacityPercent = Math.round((totalCombinedWeightMT / TRUCK_CAPACITY_MT) * 100);
  const isOverflow = actualCapacityPercent > 100;

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
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 text-3xl font-bold shadow-xs">
                🚛
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white mb-1">
                  {fpoNameDisplay}
                </h2>
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-purple-400/20 text-purple-200 border border-purple-400/30 px-2 py-0.5 rounded-md font-mono font-bold">
                    {FPO_CODE}
                  </span>
                  <span className="text-emerald-300 font-bold">
                    • {currentLocale === 'hi' ? `आपके खेत से ${toLocalizedDigits(4.2, currentLocale)} किमी`
                      : currentLocale === 'mr' ? `तुमच्या शेतापासून ${toLocalizedDigits(4.2, currentLocale)} किमी`
                      : currentLocale === 'pa' ? `ਤੁਹਾਡੇ ਖੇਤ ਤੋਂ ${toLocalizedDigits(4.2, currentLocale)} ਕਿ.ਮੀ.`
                      : currentLocale === 'gu' ? `તમારા ખેતરથી ${toLocalizedDigits(4.2, currentLocale)} કિમી`
                      : currentLocale === 'ta' ? `உங்கள் பண்ணையிலிருந்து 4.2 கி.மீ`
                      : currentLocale === 'te' ? `మీ పొలం నుండి 4.2 కి.மீ`
                      : currentLocale === 'kn' ? `ನಿಮ್ಮ ತೋಟದಿಂದ 4.2 ಕಿ.ಮೀ`
                      : HUB_DISTANCE}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {currentLocale === 'hi' ? 'एसएफएसी एवं एपीएमसी प्रमाणित मिल्क-रन'
                  : currentLocale === 'mr' ? 'एसएफएसी आणि एपीएमसी प्रमाणित मिल्क-रन'
                  : currentLocale === 'pa' ? 'ਐਸਐਫਏਸੀ ਅਤੇ ਏਪੀਐਮਸੀ ਪ੍ਰਮਾਣਿਤ ਮਿਲਕ-ਰਨ'
                  : currentLocale === 'gu' ? 'એસએફએસી અને એપીએમસી પ્રમાણિત મિલ્ક-રન'
                  : currentLocale === 'ta' ? 'எஸ்.எஃப்.ஏ.சி மற்றும் ஏ.பி.எம்.சி சான்றளிக்கப்பட்ட மில்க்-ரன்'
                  : currentLocale === 'te' ? 'ఎస్‌ఎఫ్‌ఏసీ & ఏపీఎంసీ ధృవీకరించిన రవాణా'
                  : currentLocale === 'kn' ? 'ಎಸ್‌ಎಫ್‌ಎಸಿ ಮತ್ತು ಎಪಿಎಂಸಿ ಪ್ರಮಾಣೀಕೃತ ಮಿಲ್ಕ್-ರನ್'
                  : 'SFAC & APMC Certified Milk-Run'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLeaveModalOpen(true)}
                className="text-xs font-bold rounded-xl border-purple-700/60 bg-purple-950/50 text-purple-200 hover:bg-rose-950 hover:text-rose-200 hover:border-rose-700 transition-colors cursor-pointer"
              >
                {currentLocale === 'hi' ? 'कलेक्टिव छोड़ें'
                  : currentLocale === 'mr' ? 'समुदाय सोडा'
                  : currentLocale === 'pa' ? 'ਸਮੂਹ ਛੱਡੋ'
                  : currentLocale === 'gu' ? 'સામૂહિકમાંથી બહાર નીકળો'
                  : currentLocale === 'ta' ? 'கூட்டிலிருந்து வெளியேறு'
                  : currentLocale === 'te' ? 'ఉమ్మడి సమూహం నుండి నిష్క్రమించండి'
                  : currentLocale === 'kn' ? 'ಸಾಮೂಹಿಕದಿಂದ ನಿರ್ಗಮಿಸಿ'
                  : 'Leave Collective'}
              </Button>
            </div>
          </div>

          {/* Aggregation Target & Live Truckload Progress Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Metric 1: Milk-Run Target */}
            <div className="rounded-3xl bg-white/5 border border-purple-500/20 p-5 flex flex-col justify-center backdrop-blur-xs">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Truck size={16} /> {currentLocale === 'hi' ? 'सक्रिय प्रेषण' : currentLocale === 'mr' ? 'सक्रिय वाहतूक' : currentLocale === 'pa' ? 'ਸਰਗਰਮ ਡਿਸਪੈਚ' : 'Active Dispatch'}
              </span>
              <p className="text-3xl font-black text-white">
                {currentLocale === 'hi' ? `${toLocalizedDigits(45, currentLocale)}-टन मालवाहक`
                  : currentLocale === 'mr' ? `${toLocalizedDigits(45, currentLocale)}-टन वाहक`
                  : currentLocale === 'pa' ? `${toLocalizedDigits(45, currentLocale)}-ਟਨ ਵਾਹਕ`
                  : '45-Ton Carrier'}
              </p>
              <p className="text-emerald-400 font-bold mt-2">
                {currentLocale === 'hi' ? `प्रस्थान: ${toLocalizedDigits(4, currentLocale)} घंटे ${toLocalizedDigits(30, currentLocale)} मिनट में`
                  : currentLocale === 'mr' ? `निघणार: ${toLocalizedDigits(4, currentLocale)} तास ${toLocalizedDigits(30, currentLocale)} मिनिटांत`
                  : currentLocale === 'pa' ? `ਰਵਾਨਾ: ${toLocalizedDigits(4, currentLocale)} ਘੰਟੇ ${toLocalizedDigits(30, currentLocale)} ਮਿੰਟ ਵਿੱਚ`
                  : 'Departs in 4h 30m'}
              </p>
            </div>

            {/* Metric 2: Participating Farmers */}
            <div className="rounded-3xl bg-white/5 border border-purple-500/20 p-5 flex flex-col justify-center backdrop-blur-xs">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Users size={16} /> {currentLocale === 'hi' ? 'नामांकन' : currentLocale === 'mr' ? 'नोंदणी' : currentLocale === 'pa' ? 'ਦਾਖਲਾ' : 'Enrollment'}
              </span>
              <p className="text-3xl font-black text-white">
                {currentLocale === 'hi' ? `${toLocalizedDigits(15, currentLocale)} किसान`
                  : currentLocale === 'mr' ? `${toLocalizedDigits(15, currentLocale)} शेतकरी`
                  : currentLocale === 'pa' ? `${toLocalizedDigits(15, currentLocale)} ਕਿਸਾਨ`
                  : '15 Farmers'}
              </p>
              <p className="text-purple-200 font-bold mt-2">
                {selectedLotIds.length > 0
                  ? (currentLocale === 'hi' ? `✓ आपके ${toLocalizedDigits(selectedLotIds.length, currentLocale)} लॉट शामिल हैं`
                    : currentLocale === 'mr' ? `✓ तुमचे ${toLocalizedDigits(selectedLotIds.length, currentLocale)} लॉट्स समाविष्ट`
                    : currentLocale === 'pa' ? `✓ ਤੁਹਾਡੇ ${toLocalizedDigits(selectedLotIds.length, currentLocale)} ਲਾਟ ਸ਼ਾਮਲ`
                    : `✓ Your ${selectedLotIds.length} lots included`)
                  : (currentLocale === 'hi' ? 'जुड़ने के लिए लॉट चुनें'
                    : currentLocale === 'mr' ? 'सामील होण्यासाठी लॉट निवडा'
                    : currentLocale === 'pa' ? 'ਸ਼ਾਮਲ ਹੋਣ ਲਈ ਲਾਟ ਚੁਣੋ'
                    : 'Select lots to join')}
              </p>
            </div>

            {/* Metric 3: Capacity Progress */}
            <div className="rounded-3xl bg-white/5 border border-purple-500/20 p-5 flex flex-col justify-center backdrop-blur-xs lg:col-span-1 md:col-span-2">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-purple-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Boxes size={16} /> {currentLocale === 'hi' ? 'क्षमता' : currentLocale === 'mr' ? 'क्षमता' : currentLocale === 'pa' ? 'ਸਮਰੱਥਾ' : 'Capacity'}
                </span>
                <span className="text-emerald-400 font-black font-mono text-lg">
                  {toLocalizedDigits(actualCapacityPercent, currentLocale)}% {currentLocale === 'hi' ? 'भरी हुई' : currentLocale === 'mr' ? 'पूर्ण' : currentLocale === 'pa' ? 'ਭਰਿਆ' : 'Full'}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-4 bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-purple-900/60 mb-2">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverflow
                      ? 'bg-gradient-to-r from-amber-400 to-rose-500'
                      : actualCapacityPercent >= 90
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : 'bg-gradient-to-r from-amber-500 to-purple-400'
                  }`}
                  style={{ width: `${Math.min(actualCapacityPercent, 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-purple-200 font-bold">
                <span>
                  {currentLocale === 'hi' ? `कुल: ${toLocalizedDigits(totalCombinedWeightMT.toFixed(1), currentLocale)} मी.टन / ${toLocalizedDigits(45.0, currentLocale)} मी.टन`
                    : currentLocale === 'mr' ? `एकूण: ${toLocalizedDigits(totalCombinedWeightMT.toFixed(1), currentLocale)} मे.टन / ${toLocalizedDigits(45.0, currentLocale)} मे.टन`
                    : currentLocale === 'pa' ? `ਕੁੱਲ: ${toLocalizedDigits(totalCombinedWeightMT.toFixed(1), currentLocale)} ਮੀ.ਟਨ / ${toLocalizedDigits(45.0, currentLocale)} ਮੀ.ਟਨ`
                    : `Total: ${totalCombinedWeightMT.toFixed(1)} MT / 45.0 MT`}
                </span>
                {isOverflow && (
                  <span className="text-rose-400">{currentLocale === 'hi' ? 'अतिरिक्त भार' : currentLocale === 'mr' ? 'अतिरिक्त भार' : 'OVERFLOW'}</span>
                )}
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
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>🌾 {currentLocale === 'hi' ? 'फसल लॉट चुनें' : currentLocale === 'mr' ? 'पीक लॉट्स निवडा' : currentLocale === 'pa' ? 'ਫ਼ਸਲ ਲਾਟ ਚੁਣੋ' : 'Select Harvest Lots'}</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                {toLocalizedDigits(selectedLotIds.length, currentLocale)} / {toLocalizedDigits(activeLots.length, currentLocale)} {currentLocale === 'hi' ? 'चयनित' : currentLocale === 'mr' ? 'निवडलेले' : currentLocale === 'pa' ? 'ਚੁਣੇ ਗਏ' : 'Selected'}
              </span>
            </h3>
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
                {currentLocale === 'hi' ? `सभी लॉट (${toLocalizedDigits(activeLots.length, currentLocale)})`
                  : currentLocale === 'mr' ? `सर्व लॉट्स (${toLocalizedDigits(activeLots.length, currentLocale)})`
                  : currentLocale === 'pa' ? `ਸਾਰੇ ਲਾਟ (${toLocalizedDigits(activeLots.length, currentLocale)})`
                  : `All Lots (${activeLots.length})`}
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
                {currentLocale === 'hi' ? 'सूखे अनाज' : currentLocale === 'mr' ? 'सुके धान्य' : currentLocale === 'pa' ? 'ਸੁੱਕਾ ਅਨਾਜ' : 'Dry Grains'}
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
                {currentLocale === 'hi' ? 'नाशवंत फसलें' : currentLocale === 'mr' ? 'नाशवंत पिके' : currentLocale === 'pa' ? 'ਨਾਸ਼ਵਾਨ' : 'Perishables'}
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectDryOnly}
                className="text-xs font-bold h-8 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {currentLocale === 'hi' ? '🌿 सभी अनाज चुनें' : currentLocale === 'mr' ? '🌿 सर्व धान्य निवडा' : currentLocale === 'pa' ? '🌿 ਸਾਰੇ ਅਨਾਜ ਚੁਣੋ' : '🌿 Select All Grains'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs font-bold h-8 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {currentLocale === 'hi' ? 'सभी चुनें' : currentLocale === 'mr' ? 'सर्व निवडा' : currentLocale === 'pa' ? 'ਸਾਰੇ ਚੁਣੋ' : 'Select All'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs font-bold h-8 rounded-xl text-slate-500 hover:text-rose-600 cursor-pointer"
              >
                {currentLocale === 'hi' ? 'हटाएं' : currentLocale === 'mr' ? 'साफ करा' : currentLocale === 'pa' ? 'ਸਾਫ਼ ਕਰੋ' : 'Clear'}
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
                          {toLocalizedDigits(lot.id, currentLocale)}
                        </span>
                        <span className="text-xs font-bold text-slate-500 font-mono">
                          {toLocalizedDigits(lot.harvestDate || '', currentLocale)}
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
                        {currentLocale === 'hi' ? 'मात्रा एवं ग्रेड' : currentLocale === 'mr' ? 'प्रमाण आणि दर्जा' : currentLocale === 'pa' ? 'ਮਾਤਰਾ ਅਤੇ ਗ੍ਰੇਡ' : 'Volume & Grade'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900 font-mono">
                          {toLocalizedDigits(lotTons, currentLocale)} {currentLocale === 'hi' ? 'मी.टन' : currentLocale === 'mr' ? 'मे.टन' : 'MT'}
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {lot.qualityGrade || 'Grade A'} ({toLocalizedDigits(lot.qualityScore || 95, currentLocale)}%)
                        </span>
                      </div>
                    </div>

                    {/* Logistics Profile Tag */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        {currentLocale === 'hi' ? 'लॉजिस्टिक्स प्रोफाइल' : currentLocale === 'mr' ? 'वाहतूक प्रोफाइल' : currentLocale === 'pa' ? 'ਲੌਜਿਸਟਿਕਸ ਪ੍ਰੋਫਾਈਲ' : 'Logistics Profile'}
                      </span>
                      {isDry ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <Leaf size={12} className="text-emerald-600" />
                          {currentLocale === 'hi' ? '🌿 थोक सूखा पूल के लिए उत्तम' : currentLocale === 'mr' ? '🌿 सुक्या धान्यासाठी उत्तम' : currentLocale === 'pa' ? '🌿 ਸੁੱਕੇ ਅਨਾਜ ਲਈ ਉੱਤਮ' : '🌿 Ideal for Bulk Dry Pool'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-lg border border-blue-200">
                          <Snowflake size={12} className="text-blue-600" />
                          {currentLocale === 'hi' ? '❄️ संवेदनशील नाशवंत' : currentLocale === 'mr' ? '❄️ संवेदनशील नाशवंत' : '❄️ Perishable Sensitive'}
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Right Column: Freight Breakdown & Net Savings */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                    
                    <div className="text-left lg:text-right space-y-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        {currentLocale === 'hi' ? 'मालभाड़ा दर' : currentLocale === 'mr' ? 'वाहतूक दर' : currentLocale === 'pa' ? 'ਮਾਲ-ਭਾੜਾ ਦਰ' : 'Freight Rate'}
                      </span>
                      <div className="flex items-center lg:justify-end gap-2 text-xs font-mono">
                        <span className="text-slate-400 line-through">₹{toLocalizedDigits(SOLO_FREIGHT_PER_KG.toFixed(2), currentLocale)}/{currentLocale === 'hi' ? 'किग्रा' : currentLocale === 'mr' ? 'किलो' : 'kg'}</span>
                        <strong className="text-emerald-700 font-bold">➔ ₹{toLocalizedDigits(POOLED_FREIGHT_PER_KG.toFixed(2), currentLocale)}/{currentLocale === 'hi' ? 'किग्रा' : currentLocale === 'mr' ? 'किलो' : 'kg'}</strong>
                      </div>
                      <p className="text-xs font-black text-emerald-600 font-mono">
                        {currentLocale === 'hi' ? `बचत ₹${toLocalizedDigits(Math.round(lotSavings).toLocaleString('en-IN'), currentLocale)} (-${toLocalizedDigits(FREIGHT_DISCOUNT_PCT, currentLocale)}%)`
                          : currentLocale === 'mr' ? `बचत ₹${toLocalizedDigits(Math.round(lotSavings).toLocaleString('en-IN'), currentLocale)} (-${toLocalizedDigits(FREIGHT_DISCOUNT_PCT, currentLocale)}%)`
                          : currentLocale === 'pa' ? `ਬਚਤ ₹${toLocalizedDigits(Math.round(lotSavings).toLocaleString('en-IN'), currentLocale)} (-${toLocalizedDigits(FREIGHT_DISCOUNT_PCT, currentLocale)}%)`
                          : `Save ₹${Math.round(lotSavings).toLocaleString('en-IN')} (-${FREIGHT_DISCOUNT_PCT}%)`}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 text-purple-900 border border-purple-300 text-xs font-black shadow-2xs font-mono">
                          <Users size={13} className="text-purple-700" />
                          {currentLocale === 'hi' ? '👥 एफपीओ पूल्ड' : currentLocale === 'mr' ? '👥 एकत्रित वाहतूक' : currentLocale === 'pa' ? '👥 ਐਫਪੀਓ ਪੂਲਡ' : '👥 FPO Pooled'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold font-mono">
                          <Truck size={13} className="text-slate-500" />
                          {currentLocale === 'hi' ? '🚛 एकल ढुलाई' : currentLocale === 'mr' ? '🚛 स्वतंत्र वाहतूक' : currentLocale === 'pa' ? '🚛 ਇਕੱਲਾ ਢੁਆਈ' : '🚛 Solo Haul'}
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
                {currentLocale === 'hi' ? 'कुल पूलिंग मात्रा' : currentLocale === 'mr' ? 'एकूण एकत्रित वजन' : currentLocale === 'pa' ? 'ਕੁੱਲ ਪੂਲਿੰਗ ਮਾਤਰਾ' : 'Total Pooling Volume'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white font-mono">
                  {toLocalizedDigits(selectedTonnage.toFixed(1), currentLocale)}
                </span>
                <span className="text-sm font-bold text-emerald-200">
                  {currentLocale === 'hi' ? 'मीट्रिक टन' : currentLocale === 'mr' ? 'मेट्रिक टन' : currentLocale === 'pa' ? 'ਮੀਟ੍ਰਿਕ ਟਨ' : 'Metric Tons'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 font-mono">
                {currentLocale === 'hi' ? `${toLocalizedDigits(selectedLotIds.length, currentLocale)} फसल लॉट नामांकित`
                  : currentLocale === 'mr' ? `${toLocalizedDigits(selectedLotIds.length, currentLocale)} पीक लॉट्स समाविष्ट`
                  : currentLocale === 'pa' ? `${toLocalizedDigits(selectedLotIds.length, currentLocale)} ਫ਼ਸਲ ਲਾਟ ਸ਼ਾਮਲ`
                  : `${selectedLotIds.length} Harvest Lots Enrolled`}
              </p>
            </div>

            {/* Metric 2: Net Freight Savings */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                {currentLocale === 'hi' ? 'अनुमानित मालभाड़ा बचत' : currentLocale === 'mr' ? 'अंदाजे वाहतूक बचत' : currentLocale === 'pa' ? 'ਅੰਦਾਜ਼ਨ ਮਾਲ-ਭਾੜਾ ਬਚਤ' : 'Estimated Freight Savings'}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-300 font-mono">
                  ₹{toLocalizedDigits(Math.round(totalFreightSavings).toLocaleString('en-IN'), currentLocale)}
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                  -{toLocalizedDigits(FREIGHT_DISCOUNT_PCT, currentLocale)}%
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                {currentLocale === 'hi' ? `एकल: ₹${toLocalizedDigits(Math.round(soloTotalFreight).toLocaleString('en-IN'), currentLocale)} ➔ पूल्ड: ₹${toLocalizedDigits(Math.round(pooledTotalFreight).toLocaleString('en-IN'), currentLocale)}`
                  : currentLocale === 'mr' ? `स्वतंत्र: ₹${toLocalizedDigits(Math.round(soloTotalFreight).toLocaleString('en-IN'), currentLocale)} ➔ एकत्रित: ₹${toLocalizedDigits(Math.round(pooledTotalFreight).toLocaleString('en-IN'), currentLocale)}`
                  : `Solo: ₹${Math.round(soloTotalFreight).toLocaleString('en-IN')} ➔ Pooled: ₹${Math.round(pooledTotalFreight).toLocaleString('en-IN')}`}
              </p>
            </div>

            {/* Metric 3: Dispatch & Escrow Guarantee */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                {currentLocale === 'hi' ? 'प्रेषण समय एवं भुगतान' : currentLocale === 'mr' ? 'वाहतूक वेळ आणि सेटलमेंट' : currentLocale === 'pa' ? 'ਡਿਸਪੈਚ ਸਮਾਂ ਅਤੇ ਭੁਗਤਾਨ' : 'Dispatch Window & Settlement'}
              </span>
              <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                <Clock size={16} className="text-emerald-400 shrink-0" />
                <span>
                  {currentLocale === 'hi' ? `प्रस्थान: ${toLocalizedDigits(4, currentLocale)} घंटे ${toLocalizedDigits(30, currentLocale)} मिनट में`
                    : currentLocale === 'mr' ? `निघणार: ${toLocalizedDigits(4, currentLocale)} तास ${toLocalizedDigits(30, currentLocale)} मिनिटांत`
                    : currentLocale === 'pa' ? `ਰਵਾਨਾ: ${toLocalizedDigits(4, currentLocale)} ਘੰਟੇ ${toLocalizedDigits(30, currentLocale)} ਮਿੰਟ ਵਿੱਚ`
                    : 'Departs in 4 hrs 30 mins'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                {currentLocale === 'hi' ? '🛡️ कोई अग्रिम शुल्क नहीं • मंडी एस्क्रो धर्मकांटा तौल पर कटौती'
                  : currentLocale === 'mr' ? '🛡️ कोणताही आगाऊ खर्च नाही • मंडी एस्क्रो वजनकाट्यावर कपात'
                  : currentLocale === 'pa' ? '🛡️ ਕੋਈ ਅਗਾਊਂ ਖਰਚਾ ਨਹੀਂ • ਮੰਡੀ ਐਸਕਰੋ ਤੋਲ ਸਮੇਂ ਕਟੌਤੀ'
                  : '🛡️ Zero upfront cost • Deducted at Mandi Escrow weighbridge settlement'}
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
                  <span>{currentLocale === 'hi' ? 'कलेक्टिव सिंक हो रहा है...' : currentLocale === 'mr' ? 'सिंक होत आहे...' : 'Syncing Collective...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>
                    {currentLocale === 'hi' ? 'कलेक्टिव पूल चयन अपडेट करें'
                      : currentLocale === 'mr' ? 'एकत्रित पूल निवड अद्ययावत करा'
                      : currentLocale === 'pa' ? 'ਸਮੂਹ ਪੂਲ ਚੋਣ ਅੱਪਡੇਟ ਕਰੋ'
                      : 'Update Collective Pool Selection'}
                  </span>
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
                {currentLocale === 'hi' ? 'एफपीओ कलेक्टिव पूल छोड़ें?'
                  : currentLocale === 'mr' ? 'एफपीओ एकत्रित पूल सोडावा?'
                  : currentLocale === 'pa' ? 'FPO ਸਮੂਹਿਕ ਪੂਲ ਛੱਡੋ?'
                  : currentLocale === 'gu' ? 'FPO સામૂહિક પૂલ છોડવો છે?'
                  : currentLocale === 'ta' ? 'FPO கூட்டுப் பூலில் இருந்து வெளியேறவா?'
                  : currentLocale === 'te' ? 'FPO ఉమ్మడి పూల్ నుండి నిష్క్రమించాలా?'
                  : currentLocale === 'kn' ? 'FPO ಸಾಮೂಹಿಕ ಪೂಲ್‌ನಿಂದ ನಿರ್ಗಮಿಸಬೇಕೆ?'
                  : 'Leave FPO Collective Pool?'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentLocale === 'hi'
                  ? <>सभी लॉट को <strong className="text-slate-900">{fpoNameDisplay}</strong> से अलग करने पर आपका साझा परिवहन मार्ग आरक्षण रद्द हो जाएगा। आपके मालभाड़े की दरें मानक एकल दर (<strong>₹{toLocalizedDigits(SOLO_FREIGHT_PER_KG.toFixed(2), currentLocale)}/किग्रा</strong> बनाम <strong>₹{toLocalizedDigits(POOLED_FREIGHT_PER_KG.toFixed(2), currentLocale)}/किग्रा</strong>) पर वापस आ जाएंगी।</>
                  : currentLocale === 'mr'
                  ? <>सर्व लॉट्स <strong className="text-slate-900">{fpoNameDisplay}</strong> मधून वगळल्यास तुमचे सामायिक वाहतूक आरक्षण रद्द होईल. तुमचे वाहतूक दर नियमित दरावर (<strong>₹{toLocalizedDigits(SOLO_FREIGHT_PER_KG.toFixed(2), currentLocale)}/किलो</strong> ऐवजी <strong>₹{toLocalizedDigits(POOLED_FREIGHT_PER_KG.toFixed(2), currentLocale)}/किलो</strong>) परत जातील.</>
                  : currentLocale === 'pa'
                  ? <>ਸਾਰੇ ਲਾਟਾਂ ਨੂੰ <strong className="text-slate-900">{fpoNameDisplay}</strong> ਤੋਂ ਵੱਖ ਕਰਨ ਨਾਲ ਤੁਹਾਡਾ ਸਾਂਝਾ ਟਰਾਂਸਪੋਰਟ ਰਿਜ਼ਰਵੇਸ਼ਨ ਰੱਦ ਹੋ ਜਾਵੇਗਾ। ਤੁਹਾਡਾ ਕਿਰਾਇਆ ਇਕੱਲੇ ਭਾੜੇ ਦੀ ਦਰ (<strong>₹{toLocalizedDigits(SOLO_FREIGHT_PER_KG.toFixed(2), currentLocale)}/ਕਿਲੋ</strong>) 'ਤੇ ਵਾਪਸ ਆ ਜਾਵੇਗਾ।</>
                  : <>Detaching all lots from <strong className="text-slate-900">{FPO_NAME}</strong> will cancel your shared delivery route reservation. Freight costs for your produce will revert to standard solo direct haul rates (<strong>₹1.85/kg</strong> instead of <strong>₹1.20/kg</strong>).</>}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <strong className="block font-bold">
                {currentLocale === 'hi' ? 'अनुमानित वित्तीय प्रभाव:'
                  : currentLocale === 'mr' ? 'अंदाजे आर्थिक परिणाम:'
                  : currentLocale === 'pa' ? 'ਅੰਦਾਜ਼ਨ ਵਿੱਤੀ ਪ੍ਰਭਾਵ:'
                  : 'Estimated Financial Impact:'}
              </strong>
              <p className="text-[11px] text-amber-800">
                {currentLocale === 'hi'
                  ? <>आप अपने सक्रिय फसल लॉट पर <strong className="text-amber-950">₹{toLocalizedDigits(Math.round(totalFreightSavings > 0 ? totalFreightSavings : 2850).toLocaleString('en-IN'), currentLocale)}</strong> तक की लॉजिस्टिक्स बचत खो देंगे।</>
                  : currentLocale === 'mr'
                  ? <>तुम्ही तुमच्या सक्रिय पीक लॉट्सवरील <strong className="text-amber-950">₹{toLocalizedDigits(Math.round(totalFreightSavings > 0 ? totalFreightSavings : 2850).toLocaleString('en-IN'), currentLocale)}</strong> पर्यंतची बचत गमावाल.</>
                  : currentLocale === 'pa'
                  ? <>ਤੁਸੀਂ ਆਪਣੇ ਕਿਰਿਆਸ਼ੀਲ ਲਾਟਾਂ 'ਤੇ <strong className="text-amber-950">₹{toLocalizedDigits(Math.round(totalFreightSavings > 0 ? totalFreightSavings : 2850).toLocaleString('en-IN'), currentLocale)}</strong> ਤੱਕ ਦੀ ਬਚਤ ਗੁਆ ਦੇਵੋਗੇ।</>
                  : <>You will forfeit up to <strong className="text-amber-950">₹{Math.round(totalFreightSavings > 0 ? totalFreightSavings : 2850).toLocaleString('en-IN')}</strong> in logistics savings on your active harvest lots.</>}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLeaveModalOpen(false)}
                className="flex-1 text-xs h-11 rounded-xl border-slate-300 font-bold cursor-pointer"
              >
                {currentLocale === 'hi' ? 'पूल में बनाए रखें'
                  : currentLocale === 'mr' ? 'पूलमध्ये ठेवा'
                  : currentLocale === 'pa' ? 'ਪੂਲ ਵਿੱਚ ਰੱਖੋ'
                  : currentLocale === 'gu' ? 'પૂલમાં જાળવી રાખો'
                  : currentLocale === 'ta' ? 'பூலில் வைத்திருங்கள்'
                  : currentLocale === 'te' ? 'పూల్‌లోనే ఉంచండి'
                  : currentLocale === 'kn' ? 'ಪೂಲ್‌ನಲ್ಲಿಯೇ ಇರಿಸಿ'
                  : 'Keep in Pool'}
              </Button>
              <Button
                type="button"
                onClick={handleConfirmLeaveCollective}
                className="flex-1 text-xs h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-sm cursor-pointer"
              >
                {currentLocale === 'hi' ? 'छोड़ने की पुष्टि करें'
                  : currentLocale === 'mr' ? 'सोडण्याची पुष्टी करा'
                  : currentLocale === 'pa' ? 'ਛੱਡਣ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ'
                  : currentLocale === 'gu' ? 'છોડવાની ખાતરી કરો'
                  : currentLocale === 'ta' ? 'வெளியேறுவதை உறுதிசெய்'
                  : currentLocale === 'te' ? 'నిష్క్రమణను నిర్ధారించండి'
                  : currentLocale === 'kn' ? 'ನಿರ್ಗಮನವನ್ನು ದೃಢೀಕರಿಸಿ'
                  : 'Confirm Leave'}
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default FPOCollectiveView;
