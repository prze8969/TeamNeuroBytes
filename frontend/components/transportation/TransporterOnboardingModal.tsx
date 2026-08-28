'use client';

import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  DollarSign, 
  Route, 
  Check, 
  ArrowRight, 
  SlidersHorizontal,
  Building2,
  Users,
  Gauge,
  HelpCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface TransporterFleetProfile {
  isOnboarded: boolean;
  carrier_name: string;
  gstin: string;
  contact_phone: string;
  total_trucks: number;
  vehicle_types: string[];
  total_drivers: number;
  base_rate: number;
  rate_unit: 'INR_PER_KG' | 'INR_PER_TON_KM';
  min_freight_charge: number;
  reefer_surcharge_enabled: boolean;
  reefer_surcharge_type: 'PERCENTAGE' | 'FIXED';
  reefer_surcharge_value: number;
  preferred_target_trips: number;
  target_frequency: 'PER_WEEK' | 'PER_MONTH';
  operating_corridors: string[];
  rating: number;
  total_trips_completed: number;
  available_escrow_balance_inr: number;
  active_vehicles_on_road: number;
}

export const DEFAULT_VEHICLE_TYPE_OPTIONS = [
  { id: 'pickup', label: 'Pickup (1-2 MT)', icon: '🛻', desc: 'Farmgate aggregation & light loads' },
  { id: 'medium', label: 'Medium Truck (3-7 MT)', icon: '🚛', desc: 'Regional Mandi corridor haulage' },
  { id: 'heavy', label: 'Heavy Multi-Axle (10-25 MT)', icon: '🚚', desc: 'Bulk inter-state freight' },
  { id: 'reefer', label: 'Reefer / Cold-Chain Truck', icon: '❄️', desc: 'Temperature controlled produce' },
];

export const POPULAR_CORRIDOR_OPTIONS = [
  'Nashik → Mumbai (Vashi APMC)',
  'Pune → Vashi APMC Terminal',
  'Lasalgaon Onion → Pune Gultekdi',
  'Narayangaon → Mumbai Corridor',
  'Nagpur Citrus → Mumbai / Delhi',
  'Kolhapur → Mumbai Highway (NH-48)',
  'All Maharashtra Agro Corridors',
  'Interstate (MH → Gujarat / Delhi)',
];

export const DEMO_TRANSPORTER_PROFILE: TransporterFleetProfile = {
  isOnboarded: true,
  carrier_name: 'Kisan Express Fleet Logistics',
  gstin: '27AABCK9981F1Z2',
  contact_phone: '+91 99887 76655',
  total_trucks: 6,
  vehicle_types: ['Medium Truck (3-7 MT)', 'Reefer / Cold-Chain Truck'],
  total_drivers: 5,
  base_rate: 1.50,
  rate_unit: 'INR_PER_KG',
  min_freight_charge: 2500,
  reefer_surcharge_enabled: true,
  reefer_surcharge_type: 'PERCENTAGE',
  reefer_surcharge_value: 20,
  preferred_target_trips: 18,
  target_frequency: 'PER_WEEK',
  operating_corridors: ['Nashik → Mumbai (Vashi APMC)', 'Pune → Vashi APMC Terminal', 'Lasalgaon Onion → Pune Gultekdi'],
  rating: 4.9,
  total_trips_completed: 142,
  available_escrow_balance_inr: 42800,
  active_vehicles_on_road: 0,
};

interface TransporterOnboardingModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSaveProfile: (profile: TransporterFleetProfile) => void;
  initialProfile?: Partial<TransporterFleetProfile>;
  isEditMode?: boolean;
  userEmail?: string;
  userId?: string | number;
}

export function TransporterOnboardingModal({
  isOpen,
  onClose,
  onSaveProfile,
  initialProfile,
  isEditMode = false,
  userEmail,
  userId
}: TransporterOnboardingModalProps) {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [carrierName, setCarrierName] = useState(initialProfile?.carrier_name || 'My Fleet Logistics');
  const [gstin, setGstin] = useState(initialProfile?.gstin || '27AABCK9981F1Z2');
  const [contactPhone, setContactPhone] = useState(initialProfile?.contact_phone || '+91 99887 76655');
  const [totalTrucks, setTotalTrucks] = useState<number>(initialProfile?.total_trucks || 4);
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>(
    initialProfile?.vehicle_types || ['Medium Truck (3-7 MT)', 'Reefer / Cold-Chain Truck']
  );
  const [totalDrivers, setTotalDrivers] = useState<number>(initialProfile?.total_drivers || 3);

  const [baseRate, setBaseRate] = useState<number>(initialProfile?.base_rate || 1.60);
  const [rateUnit, setRateUnit] = useState<'INR_PER_KG' | 'INR_PER_TON_KM'>(initialProfile?.rate_unit || 'INR_PER_KG');
  const [minFreightCharge, setMinFreightCharge] = useState<number>(initialProfile?.min_freight_charge || 2000);
  const [reeferSurchargeEnabled, setReeferSurchargeEnabled] = useState(initialProfile?.reefer_surcharge_enabled ?? true);
  const [reeferSurchargeType, setReeferSurchargeType] = useState<'PERCENTAGE' | 'FIXED'>(
    initialProfile?.reefer_surcharge_type || 'PERCENTAGE'
  );
  const [reeferSurchargeValue, setReeferSurchargeValue] = useState<number>(initialProfile?.reefer_surcharge_value || 20);

  const [preferredTargetTrips, setPreferredTargetTrips] = useState<number>(initialProfile?.preferred_target_trips || 12);
  const [targetFrequency, setTargetFrequency] = useState<'PER_WEEK' | 'PER_MONTH'>(
    initialProfile?.target_frequency || 'PER_WEEK'
  );
  const [selectedCorridors, setSelectedCorridors] = useState<string[]>(
    initialProfile?.operating_corridors || ['Nashik → Mumbai (Vashi APMC)', 'Pune → Vashi APMC Terminal']
  );
  const [customCorridorInput, setCustomCorridorInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if initialProfile changes
  useEffect(() => {
    if (initialProfile) {
      if (initialProfile.carrier_name) setCarrierName(initialProfile.carrier_name);
      if (initialProfile.gstin) setGstin(initialProfile.gstin);
      if (initialProfile.contact_phone) setContactPhone(initialProfile.contact_phone);
      if (initialProfile.total_trucks) setTotalTrucks(initialProfile.total_trucks);
      if (initialProfile.vehicle_types) setSelectedVehicleTypes(initialProfile.vehicle_types);
      if (initialProfile.total_drivers) setTotalDrivers(initialProfile.total_drivers);
      if (initialProfile.base_rate !== undefined) setBaseRate(initialProfile.base_rate);
      if (initialProfile.rate_unit) setRateUnit(initialProfile.rate_unit);
      if (initialProfile.min_freight_charge !== undefined) setMinFreightCharge(initialProfile.min_freight_charge);
      if (initialProfile.preferred_target_trips) setPreferredTargetTrips(initialProfile.preferred_target_trips);
      if (initialProfile.target_frequency) setTargetFrequency(initialProfile.target_frequency);
      if (initialProfile.operating_corridors) setSelectedCorridors(initialProfile.operating_corridors);
    }
  }, [initialProfile]);

  const toggleVehicleType = (typeLabel: string) => {
    if (selectedVehicleTypes.includes(typeLabel)) {
      if (selectedVehicleTypes.length > 1) {
        setSelectedVehicleTypes(selectedVehicleTypes.filter(t => t !== typeLabel));
      }
    } else {
      setSelectedVehicleTypes([...selectedVehicleTypes, typeLabel]);
    }
  };

  const toggleCorridor = (corridor: string) => {
    if (selectedCorridors.includes(corridor)) {
      setSelectedCorridors(selectedCorridors.filter(c => c !== corridor));
    } else {
      setSelectedCorridors([...selectedCorridors, corridor]);
    }
  };

  const handleAddCustomCorridor = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const clean = customCorridorInput.trim();
    if (clean && !selectedCorridors.includes(clean)) {
      setSelectedCorridors([...selectedCorridors, clean]);
      setCustomCorridorInput('');
    }
  };

  const handleQuickFillDemo = () => {
    setCarrierName(initialProfile?.carrier_name || 'My Fleet Logistics');
    setGstin(DEMO_TRANSPORTER_PROFILE.gstin);
    setContactPhone(initialProfile?.contact_phone || DEMO_TRANSPORTER_PROFILE.contact_phone);
    setTotalTrucks(DEMO_TRANSPORTER_PROFILE.total_trucks);
    setSelectedVehicleTypes(DEMO_TRANSPORTER_PROFILE.vehicle_types);
    setTotalDrivers(DEMO_TRANSPORTER_PROFILE.total_drivers);
    setBaseRate(DEMO_TRANSPORTER_PROFILE.base_rate);
    setRateUnit(DEMO_TRANSPORTER_PROFILE.rate_unit);
    setMinFreightCharge(DEMO_TRANSPORTER_PROFILE.min_freight_charge);
    setReeferSurchargeEnabled(DEMO_TRANSPORTER_PROFILE.reefer_surcharge_enabled);
    setReeferSurchargeType(DEMO_TRANSPORTER_PROFILE.reefer_surcharge_type);
    setReeferSurchargeValue(DEMO_TRANSPORTER_PROFILE.reefer_surcharge_value);
    setPreferredTargetTrips(DEMO_TRANSPORTER_PROFILE.preferred_target_trips);
    setTargetFrequency(DEMO_TRANSPORTER_PROFILE.target_frequency);
    setSelectedCorridors(DEMO_TRANSPORTER_PROFILE.operating_corridors);
  };

  const handleSaveAndLaunch = async () => {
    setIsSaving(true);
    const profile: TransporterFleetProfile = {
      isOnboarded: true,
      carrier_name: carrierName.trim() || 'Kisan Express Logistics',
      gstin: gstin.trim() || '27AABCK9981F1Z2',
      contact_phone: contactPhone.trim() || '+91 99887 76655',
      total_trucks: Math.max(1, Number(totalTrucks) || 1),
      vehicle_types: selectedVehicleTypes.length > 0 ? selectedVehicleTypes : ['Medium Truck (3-7 MT)'],
      total_drivers: Math.max(1, Number(totalDrivers) || 1),
      base_rate: Number(baseRate) || 1.50,
      rate_unit: rateUnit,
      min_freight_charge: Number(minFreightCharge) || 2000,
      reefer_surcharge_enabled: reeferSurchargeEnabled,
      reefer_surcharge_type: reeferSurchargeType,
      reefer_surcharge_value: Number(reeferSurchargeValue) || 20,
      preferred_target_trips: Number(preferredTargetTrips) || 12,
      target_frequency: targetFrequency,
      operating_corridors: selectedCorridors.length > 0 ? selectedCorridors : ['Nashik → Mumbai (Vashi APMC)'],
      rating: initialProfile?.rating || 4.9,
      total_trips_completed: initialProfile?.total_trips_completed || 0,
      available_escrow_balance_inr: initialProfile?.available_escrow_balance_inr || 0,
      active_vehicles_on_road: initialProfile?.active_vehicles_on_road || 0,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      await fetch(`${apiUrl}/api/transporter/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: userEmail,
          user_id: userId,
          carrier_name: profile.carrier_name,
          gstin: profile.gstin,
          contact_phone: profile.contact_phone,
          total_trucks: profile.total_trucks,
          vehicle_types: profile.vehicle_types,
          total_drivers: profile.total_drivers,
          base_rate: profile.base_rate,
          rate_unit: profile.rate_unit,
          min_freight_charge: profile.min_freight_charge,
          reefer_surcharge_enabled: profile.reefer_surcharge_enabled,
          reefer_surcharge_type: profile.reefer_surcharge_type,
          reefer_surcharge_value: profile.reefer_surcharge_value,
          preferred_target_trips: profile.preferred_target_trips,
          target_frequency: profile.target_frequency,
          operating_corridors: profile.operating_corridors,
          rating: profile.rating,
          total_trips_completed: profile.total_trips_completed
        })
      });
    } catch (err) {
      console.warn('API database profile save fallback:', err);
    } finally {
      setIsSaving(false);
      onSaveProfile(profile);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-6 sm:p-7 relative shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-white flex items-center justify-center text-2xl shadow-inner">
                🚚
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {isEditMode ? 'Fleet Profile & Rate Configuration' : 'Transporter Onboarding & Fleet Setup'}
                  </h2>
                </div>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  Configure fleet capacity, pricing rates, and target corridors to unlock live freight load matching.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleQuickFillDemo}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 text-emerald-200 border border-emerald-600/60 transition-colors cursor-pointer"
              >
                <Sparkles size={12} className="text-amber-300" />
                Demo Quick-Fill
              </button>

              {isEditMode && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-emerald-900/80 hover:bg-emerald-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* 3 Step Tabs Navigation */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-emerald-800/60 text-xs">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className={`py-2 px-3 rounded-xl font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeStep === 1 
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                  : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900'
              }`}
            >
              <span>1. Fleet Capacity</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className={`py-2 px-3 rounded-xl font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeStep === 2 
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                  : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900'
              }`}
            >
              <span>2. Rates &amp; Pricing</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className={`py-2 px-3 rounded-xl font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeStep === 3 
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                  : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900'
              }`}
            >
              <span>3. Corridors &amp; Targets</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* ========================================================================= */}
          {/* STEP 1: FLEET CAPACITY DETAILS */}
          {/* ========================================================================= */}
          {activeStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Building2 size={14} className="text-emerald-700" />
                    Transporter / Carrier Business Name
                  </label>
                  <Input
                    type="text"
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                    placeholder="e.g. Kisan Express Fleet Logistics"
                    className="h-11 text-xs rounded-xl bg-slate-50 border-slate-300 focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-700" />
                    GSTIN / Transporter Registration No.
                  </label>
                  <Input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="e.g. 27AABCK9981F1Z2"
                    className="h-11 text-xs font-mono rounded-xl bg-slate-50 border-slate-300 uppercase focus:bg-white focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Truck size={14} className="text-emerald-700" />
                    Total Commercial Trucks Managed
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="500"
                    value={totalTrucks}
                    onChange={(e) => setTotalTrucks(parseInt(e.target.value, 10) || 1)}
                    className="h-11 text-xs rounded-xl bg-slate-50 border-slate-300 font-mono focus:bg-white focus:border-emerald-600"
                  />
                  <p className="text-[11px] text-slate-400">Total active commercial haulers in your operating fleet.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Users size={14} className="text-emerald-700" />
                    Total Active Commercial Drivers
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="500"
                    value={totalDrivers}
                    onChange={(e) => setTotalDrivers(parseInt(e.target.value, 10) || 1)}
                    className="h-11 text-xs rounded-xl bg-slate-50 border-slate-300 font-mono focus:bg-white focus:border-emerald-600"
                  />
                  <p className="text-[11px] text-slate-400">Verified commercial drivers with valid heavy transport licenses.</p>
                </div>
              </div>

              {/* Vehicle Types Multi-Select Chips */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  Select Fleet Vehicle Categories (Multi-Select):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DEFAULT_VEHICLE_TYPE_OPTIONS.map((item) => {
                    const isSelected = selectedVehicleTypes.includes(item.label);
                    return (
                      <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleVehicleType(item.label)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-start justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{item.icon}</span>
                            <strong className="text-xs font-black">{item.label}</strong>
                          </div>
                          <p className="text-[11px] text-slate-500 pl-7">{item.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 mt-0.5 ${
                          isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: PRICING & SERVICE RATE CONFIGURATION */}
          {/* ========================================================================= */}
          {activeStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Base Rate & Unit Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-black text-slate-800 block">Base Freight Rate</span>
                    <p className="text-[11px] text-slate-500">Your default benchmark rate for agricultural produce transport.</p>
                  </div>

                  {/* Unit Toggle */}
                  <div className="inline-flex rounded-xl bg-slate-200 p-1 border border-slate-300 text-xs font-bold shrink-0">
                    <button
                      type="button"
                      onClick={() => setRateUnit('INR_PER_KG')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        rateUnit === 'INR_PER_KG' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      ₹/kg
                    </button>
                    <button
                      type="button"
                      onClick={() => setRateUnit('INR_PER_TON_KM')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        rateUnit === 'INR_PER_TON_KM' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      ₹/tonne-km
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Standard Base Rate ({rateUnit === 'INR_PER_KG' ? '₹ per kg' : '₹ per tonne-km'})
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-400">₹</span>
                      <Input
                        type="number"
                        step="0.05"
                        min="0.1"
                        value={baseRate}
                        onChange={(e) => setBaseRate(parseFloat(e.target.value) || 1.0)}
                        className="pl-7 h-11 text-xs rounded-xl bg-white border-slate-300 font-mono font-bold focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Minimum Order / Minimum Freight Charge (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-400">₹</span>
                      <Input
                        type="number"
                        step="100"
                        min="500"
                        value={minFreightCharge}
                        onChange={(e) => setMinFreightCharge(parseInt(e.target.value, 10) || 500)}
                        className="pl-7 h-11 text-xs rounded-xl bg-white border-slate-300 font-mono font-bold focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cold-Chain / Reefer Surcharge Configuration */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">❄️</span>
                    <div>
                      <span className="text-xs font-black text-emerald-950 block">Reefer &amp; Cold-Chain Surcharge</span>
                      <p className="text-[11px] text-slate-500">Premium diesel genset &amp; temperature monitoring surcharge for cold loads.</p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={reeferSurchargeEnabled} 
                      onChange={(e) => setReeferSurchargeEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {reeferSurchargeEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Surcharge Calculation Type</label>
                      <select
                        value={reeferSurchargeType}
                        onChange={(e) => setReeferSurchargeType(e.target.value as any)}
                        className="w-full h-11 text-xs px-3 rounded-xl bg-white border border-slate-300 font-bold focus:border-emerald-600 focus:outline-none"
                      >
                        <option value="PERCENTAGE">Percentage Markup (% on Base Rate)</option>
                        <option value="FIXED">Fixed Additional Amount (₹)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        {reeferSurchargeType === 'PERCENTAGE' ? 'Markup Percentage (%)' : 'Fixed Surcharge (₹)'}
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={reeferSurchargeValue}
                        onChange={(e) => setReeferSurchargeValue(parseFloat(e.target.value) || 0)}
                        className="h-11 text-xs rounded-xl bg-white border-slate-300 font-mono font-bold focus:border-emerald-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Escrow Guarantee Highlight */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2.5">
                <span className="text-xl">⚡</span>
                <p>
                  <strong>KisanSetu Escrow Guarantee:</strong> 30% fuel advance is disbursed automatically to your Fastag / Fuel account the moment farm-gate OTP is verified at loading!
                </p>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: OPERATIONAL CAPACITY & TARGET CORRIDORS */}
          {/* ========================================================================= */}
          {activeStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Target Trips & Frequency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Gauge size={14} className="text-emerald-700" />
                    Preferred Target Haul Volume (Trips)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    value={preferredTargetTrips}
                    onChange={(e) => setPreferredTargetTrips(parseInt(e.target.value, 10) || 1)}
                    className="h-11 text-xs rounded-xl bg-slate-50 border-slate-300 font-mono focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Workload Target Frequency</label>
                  <select
                    value={targetFrequency}
                    onChange={(e) => setTargetFrequency(e.target.value as any)}
                    className="w-full h-11 text-xs px-3 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="PER_WEEK">Trips Per Week</option>
                    <option value="PER_MONTH">Trips Per Month</option>
                  </select>
                </div>
              </div>

              {/* Operating Corridors Multi-Select */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  Preferred Operating Freight Corridors (Select all that apply):
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_CORRIDOR_OPTIONS.map((corridor) => {
                    const isSelected = selectedCorridors.includes(corridor);
                    return (
                      <button
                        key={corridor}
                        type="button"
                        onClick={() => toggleCorridor(corridor)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                          isSelected
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span>{corridor}</span>
                        {isSelected && <Check size={13} />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Corridor Input */}
                <div className="pt-2">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Add custom route (e.g. Sangamner → Navi Mumbai)..."
                      value={customCorridorInput}
                      onChange={(e) => setCustomCorridorInput(e.target.value)}
                      onKeyDown={handleAddCustomCorridor}
                      className="h-10 text-xs rounded-xl bg-slate-50 border-slate-300"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddCustomCorridor}
                      className="h-10 px-4 text-xs font-bold rounded-xl border-slate-300 shrink-0"
                    >
                      + Add Route
                    </Button>
                  </div>
                </div>
              </div>

              {/* Selected Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>⚡ Onboarding Profile Summary:</span>
                  <span>{selectedCorridors.length} Active Corridors</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-300 text-[11px] pt-1">
                  <div>Trucks: <strong>{totalTrucks} Units</strong></div>
                  <div>Base Rate: <strong>₹{baseRate}/{rateUnit === 'INR_PER_KG' ? 'kg' : 't-km'}</strong></div>
                  <div>Min Charge: <strong>₹{minFreightCharge}</strong></div>
                  <div>Drivers: <strong>{totalDrivers} Active</strong></div>
                  <div>Capacity Target: <strong>{preferredTargetTrips} / {targetFrequency === 'PER_WEEK' ? 'Wk' : 'Mo'}</strong></div>
                  <div>Reefer Surcharge: <strong>{reeferSurchargeEnabled ? `${reeferSurchargeValue}%` : 'None'}</strong></div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {activeStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveStep((prev) => (prev - 1) as any)}
                className="h-11 px-5 rounded-xl text-xs font-bold text-slate-700 border-slate-300 cursor-pointer"
              >
                ← Back
              </Button>
            )}

            {isEditMode && onClose && (
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="h-11 px-4 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {activeStep < 3 ? (
              <Button
                type="button"
                onClick={() => setActiveStep((prev) => (prev + 1) as any)}
                className="w-full sm:w-auto h-11 px-7 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Continue to Step {activeStep + 1}</span>
                <ArrowRight size={14} />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSaveAndLaunch}
                className="w-full sm:w-auto h-11 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center justify-center gap-2"
              >
                <Check size={16} />
                <span>Save Fleet Profile &amp; Launch Dashboard</span>
              </Button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
