'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { 
  Warehouse, 
  Thermometer, 
  Droplets, 
  QrCode, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowUpRight, 
  Boxes, 
  ShieldCheck, 
  Search,
  Activity,
  Layers,
  X,
  Plus,
  Truck,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  KeyRound,
  FileCheck2,
  Wind,
  Percent,
  Receipt
} from 'lucide-react';
import { toast } from 'sonner';
import { resolveCropImageUrl } from '@/lib/assayData';

export interface WarehouseStoredLot {
  id: string;
  lotNumber: string;
  farmerName: string;
  farmerPhone: string;
  fpoAffiliation?: string;
  commodity: string;
  variety: string;
  weightTons: number;
  weightKg: number;
  bayLocation: string;
  bayType: 'COLD_STORAGE' | 'DRY_GRAIN' | 'CONTROLLED_ATMOSPHERE';
  temperatureCelcius: number;
  humidityPercent: number;
  entryDate: string;
  daysStored: number;
  qualityGrade: string;
  qualityScore: number;
  enwrNumber: string;
  storageRatePerKgPerMonth: number;
  accruedStorageFeeInr: number;
  tradeStatus: 'ACTIVE_STORAGE' | 'RELEASE_AUTHORIZED' | 'DISPATCHED';
  buyerName?: string;
  transporterVehicle?: string;
  pickupOtp?: string;
}

export interface ClimateBayData {
  id: string;
  name: string;
  type: 'COLD_STORAGE' | 'DRY_GRAIN' | 'CONTROLLED_ATMOSPHERE';
  temp: number;
  targetTemp: number;
  humidity: number;
  targetHumidity: number;
  ethylenePpm: number;
  capacityTons: number;
  occupiedTons: number;
  status: 'OPTIMAL' | 'VENTILATING' | 'ALERT';
}

export default function WarehouseDashboardPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'inward' | 'outward' | 'telemetry' | 'ledger'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE_STORAGE' | 'RELEASE_AUTHORIZED' | 'DISPATCHED'>('ALL');

  // Stored Produce Lots State
  const [lots, setLots] = useState<WarehouseStoredLot[]>([
    {
      id: 'WH-LOT-01',
      lotNumber: 'LOT-15',
      farmerName: 'Ramesh Patil',
      farmerPhone: '+91 98231 44210',
      fpoAffiliation: 'Nashik East Farmers Collective',
      commodity: 'Grand Naine / Robusta Banana',
      variety: 'Table & Processing Grade',
      weightTons: 5.0,
      weightKg: 5000,
      bayLocation: 'Cold Bay A-1 (Zone 1)',
      bayType: 'COLD_STORAGE',
      temperatureCelcius: 12.4,
      humidityPercent: 88,
      entryDate: '2026-08-21',
      daysStored: 4,
      qualityGrade: 'Grade A',
      qualityScore: 95.8,
      enwrNumber: 'eNWR-WDRA-2026-8891',
      storageRatePerKgPerMonth: 0.18,
      accruedStorageFeeInr: 120.0,
      tradeStatus: 'RELEASE_AUTHORIZED',
      buyerName: 'AgroProcure Private Ltd',
      transporterVehicle: 'MH-15-EG-4421 (Kisan Express)',
      pickupOtp: '4821'
    },
    {
      id: 'WH-LOT-02',
      lotNumber: 'LOT-102',
      farmerName: 'Suresh Patil',
      farmerPhone: '+91 94220 89123',
      fpoAffiliation: 'Nashik East Farmers Collective',
      commodity: 'Sharbati Wheat (Lok-1)',
      variety: 'Clean Export Grain',
      weightTons: 10.0,
      weightKg: 10000,
      bayLocation: 'Dry Grain Silo B-1',
      bayType: 'DRY_GRAIN',
      temperatureCelcius: 24.0,
      humidityPercent: 42,
      entryDate: '2026-08-18',
      daysStored: 7,
      qualityGrade: 'Grade A',
      qualityScore: 98.2,
      enwrNumber: 'eNWR-WDRA-2026-8892',
      storageRatePerKgPerMonth: 0.12,
      accruedStorageFeeInr: 280.0,
      tradeStatus: 'ACTIVE_STORAGE',
    },
    {
      id: 'WH-LOT-03',
      lotNumber: 'LOT-103',
      farmerName: 'Kailash Jadhav',
      farmerPhone: '+91 98901 23456',
      fpoAffiliation: 'Niphad Onion Producers Co-Op',
      commodity: 'Nashik Red Onion (Garva)',
      variety: 'Late Kharif High Dry Matter',
      weightTons: 15.0,
      weightKg: 15000,
      bayLocation: 'Cold Bay A-2 (Zone 2)',
      bayType: 'COLD_STORAGE',
      temperatureCelcius: 14.5,
      humidityPercent: 65,
      entryDate: '2026-08-20',
      daysStored: 5,
      qualityGrade: 'Grade A',
      qualityScore: 94.5,
      enwrNumber: 'eNWR-WDRA-2026-8893',
      storageRatePerKgPerMonth: 0.16,
      accruedStorageFeeInr: 400.0,
      tradeStatus: 'RELEASE_AUTHORIZED',
      buyerName: 'FreshDirect APMC Traders',
      transporterVehicle: 'MH-12-RN-9082 (Maharashtra Fleet)',
      pickupOtp: '6219'
    },
    {
      id: 'WH-LOT-04',
      lotNumber: 'LOT-104',
      farmerName: 'Anil Deshmukh',
      farmerPhone: '+91 97654 32109',
      fpoAffiliation: 'Sahyadri FPC',
      commodity: 'Hybrid Tomato (Vaishali)',
      variety: 'Table Grade Firm Flesh',
      weightTons: 4.5,
      weightKg: 4500,
      bayLocation: 'Cold Bay A-1 (Zone 1)',
      bayType: 'COLD_STORAGE',
      temperatureCelcius: 12.4,
      humidityPercent: 88,
      entryDate: '2026-08-22',
      daysStored: 3,
      qualityGrade: 'Grade A',
      qualityScore: 96.8,
      enwrNumber: 'eNWR-WDRA-2026-8894',
      storageRatePerKgPerMonth: 0.20,
      accruedStorageFeeInr: 90.0,
      tradeStatus: 'ACTIVE_STORAGE',
    }
  ]);

  // Climate Bays State
  const [climateBays, setClimateBays] = useState<ClimateBayData[]>([
    {
      id: 'BAY-A1',
      name: 'Cold Bay A-1 (Perishables: Tomatoes & Bananas)',
      type: 'COLD_STORAGE',
      temp: 12.4,
      targetTemp: 12.0,
      humidity: 88,
      targetHumidity: 90,
      ethylenePpm: 0.08,
      capacityTons: 120,
      occupiedTons: 84.5,
      status: 'OPTIMAL'
    },
    {
      id: 'BAY-A2',
      name: 'Cold Bay A-2 (Nashik Onions & Root Vegetables)',
      type: 'COLD_STORAGE',
      temp: 14.5,
      targetTemp: 14.0,
      humidity: 65,
      targetHumidity: 65,
      ethylenePpm: 0.04,
      capacityTons: 150,
      occupiedTons: 135.0,
      status: 'OPTIMAL'
    },
    {
      id: 'BAY-B1',
      name: 'Dry Grain Silo B-1 (Sharbati Wheat)',
      type: 'DRY_GRAIN',
      temp: 24.0,
      targetTemp: 25.0,
      humidity: 42,
      targetHumidity: 45,
      ethylenePpm: 0.01,
      capacityTons: 250,
      occupiedTons: 160.0,
      status: 'OPTIMAL'
    },
    {
      id: 'BAY-C1',
      name: 'Controlled Atmosphere Silo C-1 (Pulses & Oilseeds)',
      type: 'CONTROLLED_ATMOSPHERE',
      temp: 18.0,
      targetTemp: 18.0,
      humidity: 48,
      targetHumidity: 50,
      ethylenePpm: 0.02,
      capacityTons: 100,
      occupiedTons: 42.0,
      status: 'OPTIMAL'
    }
  ]);

  // Modals State
  const [selectedLotForENWR, setSelectedLotForENWR] = useState<WarehouseStoredLot | null>(null);
  const [selectedLotForOutward, setSelectedLotForOutward] = useState<WarehouseStoredLot | null>(null);
  const [outwardOtpInput, setOutwardOtpInput] = useState('');
  const [outwardDriverName, setOutwardDriverName] = useState('Rahul Shinde');
  const [outwardVehicleInput, setOutwardVehicleInput] = useState('MH-15-EG-4421');

  // Inward Intake Form State
  const [inwardFarmerName, setInwardFarmerName] = useState('Ramesh Patil');
  const [inwardPhone, setInwardPhone] = useState('+91 98231 44210');
  const [inwardFpo, setInwardFpo] = useState('Nashik East Farmers Collective');
  const [inwardCommodity, setInwardCommodity] = useState('Grand Naine / Robusta Banana');
  const [inwardVariety, setInwardVariety] = useState('Table & Export Grade');
  const [inwardWeightTons, setInwardWeightTons] = useState(5.0);
  const [inwardBay, setInwardBay] = useState('Cold Bay A-1 (Zone 1)');
  const [inwardRatePerKg, setInwardRatePerKg] = useState(0.18);

  // Sync with localStorage lots
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kisansetu_crop_lots');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If farmer created a new lot, make sure warehouse knows about it
          const firstLot = parsed[0];
          if (firstLot && !lots.some(l => l.lotNumber === firstLot.id)) {
            const injectedLot: WarehouseStoredLot = {
              id: `WH-${firstLot.id}`,
              lotNumber: firstLot.id,
              farmerName: firstLot.farmerName || 'Ramesh Patil',
              farmerPhone: '+91 98231 44210',
              fpoAffiliation: 'Nashik East Farmers Collective',
              commodity: firstLot.cropName || 'Produce',
              variety: firstLot.variety || 'Certified Grade',
              weightTons: firstLot.quantityTons || ((firstLot.quantityKg || 5000) / 1000),
              weightKg: firstLot.quantityKg || 5000,
              bayLocation: 'Cold Bay A-1 (Zone 1)',
              bayType: 'COLD_STORAGE',
              temperatureCelcius: 12.4,
              humidityPercent: 88,
              entryDate: firstLot.harvestDate || new Date().toISOString().split('T')[0],
              daysStored: 2,
              qualityGrade: firstLot.qualityGrade || 'Grade A',
              qualityScore: firstLot.qualityScore || 95.8,
              enwrNumber: `eNWR-WDRA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
              storageRatePerKgPerMonth: 0.18,
              accruedStorageFeeInr: 60.0,
              tradeStatus: firstLot.status === 'BID_ACCEPTED' || firstLot.status === 'IN_TRANSIT' ? 'RELEASE_AUTHORIZED' : 'ACTIVE_STORAGE',
              buyerName: 'AgroProcure Private Ltd',
              transporterVehicle: 'MH-15-EG-4421 (Kisan Express)',
              pickupOtp: '4821'
            };
            setLots(prev => [injectedLot, ...prev]);
          }
        }
      }
    } catch {}
  }, []);

  // Handle New Inward Intake Submission
  const handleCreateInwardLot = (e: React.FormEvent) => {
    e.preventDefault();
    const newLotNumber = `LOT-${Math.floor(100 + Math.random() * 900)}`;
    const newEnwr = `eNWR-WDRA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const isCold = inwardBay.toLowerCase().includes('cold');

    const createdLot: WarehouseStoredLot = {
      id: `WH-${newLotNumber}`,
      lotNumber: newLotNumber,
      farmerName: inwardFarmerName,
      farmerPhone: inwardPhone,
      fpoAffiliation: inwardFpo,
      commodity: inwardCommodity,
      variety: inwardVariety,
      weightTons: Number(inwardWeightTons),
      weightKg: Number(inwardWeightTons) * 1000,
      bayLocation: inwardBay,
      bayType: isCold ? 'COLD_STORAGE' : 'DRY_GRAIN',
      temperatureCelcius: isCold ? 12.4 : 24.0,
      humidityPercent: isCold ? 85 : 45,
      entryDate: new Date().toISOString().split('T')[0],
      daysStored: 0,
      qualityGrade: 'Grade A',
      qualityScore: 96.0,
      enwrNumber: newEnwr,
      storageRatePerKgPerMonth: Number(inwardRatePerKg),
      accruedStorageFeeInr: 0.0,
      tradeStatus: 'ACTIVE_STORAGE',
    };

    setLots([createdLot, ...lots]);
    setActiveTab('inventory');
    toast.success('📥 Farmer Crop Deposit Completed & e-NWR Minted!', {
      description: `${createdLot.commodity} (${createdLot.weightTons} MT) stored in ${createdLot.bayLocation}. Certificate ${createdLot.enwrNumber} generated with 70% bank loan pledge capability.`
    });
  };

  // Handle Transporter Outward Handshake OTP Verification
  const handleVerifyOutwardHandshake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLotForOutward) return;

    if (outwardOtpInput !== (selectedLotForOutward.pickupOtp || '4821')) {
      toast.error('❌ Invalid Transporter OTP', {
        description: 'The 4-digit pickup code does not match the buyer escrow authorization.'
      });
      return;
    }

    setLots(prev => prev.map(l => {
      if (l.id === selectedLotForOutward.id) {
        return {
          ...l,
          tradeStatus: 'DISPATCHED',
          transporterVehicle: outwardVehicleInput
        };
      }
      return l;
    }));

    toast.success('🚚 Transporter Dispatch Authorized!', {
      description: `Gate Pass generated for Truck ${outwardVehicleInput}. Storage fee (₹${selectedLotForOutward.accruedStorageFeeInr}) auto-settled from Buyer Escrow Vault.`
    });

    setSelectedLotForOutward(null);
    setOutwardOtpInput('');
  };

  // Computed Capacity Metrics
  const totalStorageCapacityTons = climateBays.reduce((sum, b) => sum + b.capacityTons, 0);
  const totalOccupiedCapacityTons = climateBays.reduce((sum, b) => sum + b.occupiedTons, 0);
  const totalOccupancyPercent = Math.round((totalOccupiedCapacityTons / totalStorageCapacityTons) * 100);

  const activeBillingLotsCount = lots.filter(l => l.tradeStatus === 'ACTIVE_STORAGE').length;
  const releaseReadyLotsCount = lots.filter(l => l.tradeStatus === 'RELEASE_AUTHORIZED').length;
  const totalAccruedStorageRevenue = lots.reduce((sum, l) => sum + l.accruedStorageFeeInr, 0);

  const filteredLots = lots.filter(l => {
    const matchesSearch = 
      l.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.enwrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.bayLocation.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && l.tradeStatus === statusFilter;
  });

  return (
    <ProtectedRoute allowedRoles={['WAREHOUSE', 'ADMIN']}>
      <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        <Navbar activeRole="WAREHOUSE" />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* ========================================================================= */}
        {/* 1. WAREHOUSE OPERATOR COMMAND BANNER */}
        {/* ========================================================================= */}
        <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-blue-700/20 shrink-0">
                🏭
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Sahyadri Agri-Logistics &amp; Cold Storage Terminal
                  </h1>
                  <span className="rounded-full bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-0.5 text-[10px] font-black font-mono uppercase">
                    WDRA Lic #WD-MH-4401
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                  <MapPin size={13} className="text-blue-600 shrink-0" />
                  <span>Niphad Central Aggregation Yard, Nashik, MH</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700 font-bold">Operator: Vikram Shinde (Terminal Manager)</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-black h-11 px-5 rounded-2xl shadow-md shadow-blue-700/20 ring-2 ring-blue-400/30 transition-all flex items-center gap-2 cursor-pointer"
              onClick={() => setActiveTab('inward')}
            >
              <Plus size={16} />
              <span>+ Inward Farmer Deposit</span>
            </Button>
            <Button
              variant="outline"
              className="border-slate-200 hover:bg-blue-50 text-blue-950 text-xs font-bold h-11 px-4 rounded-2xl shadow-xs cursor-pointer flex items-center gap-2"
              onClick={() => setActiveTab('outward')}
            >
              <Truck size={16} className="text-blue-700" />
              <span>🚚 Transporter Gate Release ({releaseReadyLotsCount})</span>
            </Button>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2. OPERATIONAL KPI METRIC TILES */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Storage Capacity
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-bold">
                <Warehouse size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 font-mono">
              {totalStorageCapacityTons} MT
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500">
                <span>Occupied ({totalOccupancyPercent}%)</span>
                <span className="text-blue-700">{totalOccupiedCapacityTons} MT Stored</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${totalOccupancyPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Cold Chain Telemetry
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-sm font-bold">
                <Thermometer size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-teal-700 font-mono">
              12.4°C / 88% RH
            </p>
            <p className="text-[11px] text-teal-800 font-bold flex items-center gap-1">
              <CheckCircle2 size={13} className="text-teal-600" />
              <span>4 IoT Sensors Active • Backup Power Normal</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Release Authorized Lots
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-sm font-bold">
                <Truck size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-700 font-mono">
              {releaseReadyLotsCount} Lots Ready
            </p>
            <p className="text-[11px] text-amber-800 font-bold">
              Farmer Sold • Awaiting Milk-Run Pickup
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Accrued Storage Revenue
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-bold">
                <DollarSign size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-900 font-mono">
              ₹{(totalAccruedStorageRevenue + 48200).toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-700 font-bold">
              Auto-settled from Buyer Escrow on Dispatch
            </p>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. SEGMENTED OPERATIONAL TAB NAVIGATION */}
        {/* ========================================================================= */}
        <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 inline-flex flex-wrap gap-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'inventory'
                ? 'bg-white text-blue-950 shadow-sm font-black rounded-xl'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-bold rounded-xl'
            }`}
          >
            <Boxes size={14} className={activeTab === 'inventory' ? 'text-blue-700' : 'text-slate-500'} />
            <span>📦 Stored Lots &amp; Inventory</span>
            <span className="text-[10px] bg-blue-100 text-blue-900 font-mono font-black px-1.5 py-0.2 rounded-full">
              {lots.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inward')}
            className={`px-4 py-2 text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'inward'
                ? 'bg-white text-blue-950 shadow-sm font-black rounded-xl'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-bold rounded-xl'
            }`}
          >
            <QrCode size={14} className={activeTab === 'inward' ? 'text-blue-700' : 'text-slate-500'} />
            <span>📥 Farmer Inward &amp; e-NWR Minting</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('outward')}
            className={`px-4 py-2 text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'outward'
                ? 'bg-white text-amber-950 shadow-sm font-black rounded-xl'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-bold rounded-xl'
            }`}
          >
            <Truck size={14} className={activeTab === 'outward' ? 'text-amber-700' : 'text-slate-500'} />
            <span>🚚 Transporter Outward Handshake</span>
            {releaseReadyLotsCount > 0 && (
              <span className="text-[10px] bg-amber-200 text-amber-950 font-mono font-black px-1.5 py-0.2 rounded-full animate-pulse">
                {releaseReadyLotsCount} Pending
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 py-2 text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'telemetry'
                ? 'bg-white text-teal-950 shadow-sm font-black rounded-xl'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-bold rounded-xl'
            }`}
          >
            <Thermometer size={14} className={activeTab === 'telemetry' ? 'text-teal-700' : 'text-slate-500'} />
            <span>❄️ IoT Sensor Telemetry &amp; Climate</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ledger'
                ? 'bg-white text-emerald-950 shadow-sm font-black rounded-xl'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-bold rounded-xl'
            }`}
          >
            <Receipt size={14} className={activeTab === 'ledger' ? 'text-emerald-700' : 'text-slate-500'} />
            <span>💳 Storage Invoicing &amp; Escrow Ledger</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ACTIVE STORED LOTS & INVENTORY */}
        {/* ========================================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              
              {/* Filter & Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setStatusFilter('ALL')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      statusFilter === 'ALL'
                        ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    All Stored Lots ({lots.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('ACTIVE_STORAGE')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      statusFilter === 'ACTIVE_STORAGE'
                        ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Active Storage ({activeBillingLotsCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('RELEASE_AUTHORIZED')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      statusFilter === 'RELEASE_AUTHORIZED'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Release Authorized ({releaseReadyLotsCount})
                  </button>
                </div>

                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by lot, farmer, e-NWR, bay..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/80 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200">
                      <TableHead>Lot &amp; e-NWR Certificate</TableHead>
                      <TableHead>Farmer &amp; Affiliation</TableHead>
                      <TableHead>Commodity &amp; Grade</TableHead>
                      <TableHead>Net Volume</TableHead>
                      <TableHead>Bay &amp; Climate</TableHead>
                      <TableHead>Storage Fee</TableHead>
                      <TableHead>Trade Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    {filteredLots.map((lot) => (
                      <TableRow key={lot.id} className="hover:bg-blue-50/30 transition-colors">
                        
                        {/* Lot & e-NWR */}
                        <TableCell>
                          <span className="font-mono font-black text-slate-900 block text-xs">{lot.lotNumber}</span>
                          <span className="font-mono text-[10px] text-blue-700 font-bold block">{lot.enwrNumber}</span>
                          <span className="text-[10px] text-slate-400 font-medium">Inward: {lot.entryDate}</span>
                        </TableCell>

                        {/* Farmer */}
                        <TableCell>
                          <strong className="text-slate-900 block font-bold">{lot.farmerName}</strong>
                          <span className="text-[10px] text-purple-700 font-medium block">{lot.fpoAffiliation || 'Independent Smallholder'}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{lot.farmerPhone}</span>
                        </TableCell>

                        {/* Commodity & Grade */}
                        <TableCell>
                          <strong className="text-slate-900 block font-black">{lot.commodity}</strong>
                          <span className="text-[10px] text-slate-500 block">{lot.variety}</span>
                          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 inline-block mt-0.5">
                            {lot.qualityGrade} ({lot.qualityScore}%)
                          </span>
                        </TableCell>

                        {/* Weight */}
                        <TableCell>
                          <span className="font-mono font-black text-slate-900 text-sm block">{lot.weightTons} MT</span>
                          <span className="text-[10px] text-slate-400 font-mono">({lot.weightKg.toLocaleString('en-IN')} kg)</span>
                        </TableCell>

                        {/* Bay & Climate */}
                        <TableCell>
                          <span className="font-bold text-slate-800 block text-xs">{lot.bayLocation}</span>
                          <span className="text-[11px] font-mono text-teal-700 font-bold block">
                            {lot.temperatureCelcius}°C • {lot.humidityPercent}% RH
                          </span>
                        </TableCell>

                        {/* Storage Fee */}
                        <TableCell>
                          <span className="font-mono font-black text-slate-900 block text-xs">₹{lot.accruedStorageFeeInr.toFixed(2)}</span>
                          <span className="text-[10px] text-slate-500 font-medium block">
                            {lot.daysStored} days @ ₹{lot.storageRatePerKgPerMonth}/kg/mo
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold">NABARD 33% Subsidized</span>
                        </TableCell>

                        {/* Trade Status */}
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase font-mono ${
                            lot.tradeStatus === 'RELEASE_AUTHORIZED'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                              : lot.tradeStatus === 'DISPATCHED'
                              ? 'bg-slate-100 text-slate-700 border border-slate-300'
                              : 'bg-blue-100 text-blue-900 border border-blue-300'
                          }`}>
                            {lot.tradeStatus === 'RELEASE_AUTHORIZED' ? '🚚 Release Authorized' : lot.tradeStatus === 'DISPATCHED' ? '✅ Dispatched' : '📦 In Storage'}
                          </span>
                          {lot.tradeStatus === 'RELEASE_AUTHORIZED' && (
                            <span className="text-[10px] text-amber-800 font-bold block mt-0.5">
                              Buyer: {lot.buyerName}
                            </span>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right space-x-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs font-bold rounded-xl border-slate-200 hover:bg-blue-50 text-blue-900 cursor-pointer"
                            onClick={() => setSelectedLotForENWR(lot)}
                          >
                            <FileText size={13} className="mr-1" />
                            e-NWR
                          </Button>

                          {lot.tradeStatus === 'RELEASE_AUTHORIZED' && (
                            <Button
                              size="sm"
                              className="h-8 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs"
                              onClick={() => {
                                setSelectedLotForOutward(lot);
                                setOutwardVehicleInput(lot.transporterVehicle || 'MH-15-EG-4421');
                              }}
                            >
                              Gate Outward 🚚
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: INWARD INTAKE TERMINAL (FARMER DEPOSIT) */}
        {/* ========================================================================= */}
        {activeTab === 'inward' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
              
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>📥 Farmer Crop Deposit &amp; WDRA e-NWR Minting Terminal</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Deposit smallholder harvested crops into certified temperature-controlled bays with immediate electronic warehouse receipt issuance
                </p>
              </div>

              <form onSubmit={handleCreateInwardLot} className="space-y-5 text-xs">
                
                {/* Farmer Details */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span>1. Depositor &amp; Farmer Information</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Farmer Name</label>
                      <input
                        type="text"
                        value={inwardFarmerName}
                        onChange={(e) => setInwardFarmerName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-900 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Farmer Mobile (Aadhaar Linked)</label>
                      <input
                        type="text"
                        value={inwardPhone}
                        onChange={(e) => setInwardPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">FPO Co-Operative Affiliation</label>
                    <input
                      type="text"
                      value={inwardFpo}
                      onChange={(e) => setInwardFpo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-800 bg-white"
                    />
                  </div>
                </div>

                {/* Crop & Quality Details */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span>2. Produce Harvest &amp; Quality Specifications</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Commodity</label>
                      <select
                        value={inwardCommodity}
                        onChange={(e) => setInwardCommodity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-900 bg-white"
                      >
                        <option value="Grand Naine / Robusta Banana">🍌 Grand Naine / Robusta Banana</option>
                        <option value="Nashik Red Onion (Garva)">🧅 Nashik Red Onion (Garva)</option>
                        <option value="Hybrid Tomato (Vaishali)">🍅 Hybrid Tomato (Vaishali)</option>
                        <option value="Sharbati Wheat (Lok-1)">🌾 Sharbati Wheat (Lok-1)</option>
                        <option value="Pusa 1121 Basmati Rice">🌾 Pusa 1121 Basmati Rice</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Certified Variety</label>
                      <input
                        type="text"
                        value={inwardVariety}
                        onChange={(e) => setInwardVariety(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-800 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Harvest Net Volume (Metric Tons)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={inwardWeightTons}
                        onChange={(e) => setInwardWeightTons(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-black text-slate-900 bg-white text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Storage Bay &amp; Climate Zone</label>
                      <select
                        value={inwardBay}
                        onChange={(e) => setInwardBay(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-900 bg-white"
                      >
                        <option value="Cold Bay A-1 (Zone 1)">Cold Bay A-1 (12.4°C • Perishables)</option>
                        <option value="Cold Bay A-2 (Zone 2)">Cold Bay A-2 (14.5°C • Onions/Roots)</option>
                        <option value="Dry Grain Silo B-1">Dry Grain Silo B-1 (24°C • Wheat/Grains)</option>
                        <option value="Controlled Atmosphere Silo C-1">Controlled Atmosphere Silo C-1 (18°C)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Storage Fee & NABARD Subsidy */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-950 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <ShieldCheck size={16} className="text-blue-700" />
                      NABARD Subsidized Smallholder Storage Rate
                    </span>
                    <span className="font-mono font-black text-sm text-blue-950">₹0.12 / kg / month</span>
                  </div>
                  <p className="text-[11px] text-blue-900 leading-relaxed">
                    Under PMKSY Cold Chain scheme, 33.3% of warehouse holding fees are covered by NABARD. Farmer pays only when the crop is sold and collected by the buyer.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black text-xs h-12 rounded-2xl shadow-md shadow-blue-700/20 cursor-pointer"
                >
                  Confirm Inward Deposit &amp; Mint Digital e-NWR 📄
                </Button>
              </form>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: TRANSPORTER OUTWARD HANDSHAKE (PICKUP / ESCROW RELEASE) */}
        {/* ========================================================================= */}
        {activeTab === 'outward' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>🚚 Transporter Dispatch &amp; Milk-Run Outward Handshake</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  When a farmer accepts a bid (solo or FPO pooled), transporter collects produce directly from the warehouse loading dock with digital OTP verification
                </p>
              </div>

              {lots.filter(l => l.tradeStatus === 'RELEASE_AUTHORIZED').length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
                  <Truck className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500 font-mono">No lots currently waiting for transporter pickup.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lots.filter(l => l.tradeStatus === 'RELEASE_AUTHORIZED').map((lot) => (
                    <div
                      key={`outward-${lot.id}`}
                      className="rounded-2xl border-2 border-amber-300 bg-amber-50/40 p-5 space-y-4 shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md">
                              {lot.lotNumber}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {lot.enwrNumber}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 mt-1">
                            {lot.commodity} ({lot.weightTons} MT)
                          </h4>
                          <p className="text-xs text-slate-600">
                            Farmer: <strong className="text-slate-800">{lot.farmerName}</strong>
                          </p>
                        </div>

                        <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded-full bg-amber-200 text-amber-950 border border-amber-300 uppercase">
                          Pickup Scheduled
                        </span>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Buyer:</span>
                          <strong className="text-slate-900">{lot.buyerName || 'AgroProcure Private Ltd'}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Assigned Carrier:</span>
                          <strong className="text-slate-900 font-mono">{lot.transporterVehicle || 'MH-15-EG-4421'}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Storage Bay Dock:</span>
                          <strong className="text-blue-900 font-bold">{lot.bayLocation}</strong>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-100">
                          <span className="text-slate-500 font-medium">Accrued Warehouse Charges:</span>
                          <strong className="text-emerald-800 font-mono font-black">₹{lot.accruedStorageFeeInr.toFixed(2)} (Escrow Deductible)</strong>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black text-xs h-10 rounded-xl cursor-pointer shadow-xs"
                        onClick={() => {
                          setSelectedLotForOutward(lot);
                          setOutwardVehicleInput(lot.transporterVehicle || 'MH-15-EG-4421');
                        }}
                      >
                        🚚 Verify Driver Handshake OTP &amp; Dispatch
                      </Button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: IOT SENSOR TELEMETRY & CLIMATE */}
        {/* ========================================================================= */}
        {activeTab === 'telemetry' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>❄️ IoT Sensor Climate Telemetry &amp; Ripening Gas Control</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live temperature, relative humidity, and ethylene gas concentration monitoring across all 4 terminal bays
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  IoT Grid: Online (4/4 Sensors)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {climateBays.map((bay) => (
                  <div 
                    key={bay.id}
                    className="rounded-2xl border border-slate-200 p-5 space-y-4 bg-slate-50/50 hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black text-blue-900 bg-blue-100 px-2 py-0.5 rounded-md">
                            {bay.id}
                          </span>
                          <span className="text-[10px] font-bold font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {bay.type.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 mt-1">
                          {bay.name}
                        </h4>
                      </div>

                      <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {bay.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-200 text-center">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Temperature</span>
                        <strong className="text-blue-700 font-mono text-base font-black">{bay.temp}°C</strong>
                        <span className="text-[9px] text-slate-400 block font-mono">Target: {bay.targetTemp}°C</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Humidity</span>
                        <strong className="text-teal-700 font-mono text-base font-black">{bay.humidity}%</strong>
                        <span className="text-[9px] text-slate-400 block font-mono">Target: {bay.targetHumidity}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Ethylene</span>
                        <strong className="text-purple-700 font-mono text-base font-black">{bay.ethylenePpm} ppm</strong>
                        <span className="text-[9px] text-emerald-700 font-bold block font-mono">Safe</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono font-bold">
                        <span className="text-slate-500">Bay Occupancy ({Math.round((bay.occupiedTons / bay.capacityTons) * 100)}%)</span>
                        <span className="text-blue-900">{bay.occupiedTons} / {bay.capacityTons} MT</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${(bay.occupiedTons / bay.capacityTons) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: FINANCIAL STORAGE REVENUE & ESCROW LEDGER */}
        {/* ========================================================================= */}
        {activeTab === 'ledger' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>💳 Terminal Storage Revenue &amp; Escrow Deductions Ledger</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated holding fee collection deducted directly from institutional buyer escrow vaults on produce dispatch
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Storage Revenue Collected</span>
                  <p className="text-3xl font-black text-emerald-900 font-mono">₹1,48,650</p>
                  <p className="text-[11px] text-emerald-700 font-bold">100% Cleared via ICICI Bank DBT</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Escrow Deductions</span>
                  <p className="text-3xl font-black text-blue-900 font-mono">₹{totalAccruedStorageRevenue.toFixed(2)}</p>
                  <p className="text-[11px] text-blue-700 font-bold">Locked in active trade deals</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NABARD Subsidy Reimbursed</span>
                  <p className="text-3xl font-black text-purple-900 font-mono">₹49,550</p>
                  <p className="text-[11px] text-purple-700 font-bold">PMKSY Central Government Grant</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 1: ELECTRONIC NEGOTIABLE WAREHOUSE RECEIPT (e-NWR) */}
        {/* ========================================================================= */}
        {selectedLotForENWR && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl animate-in zoom-in-95">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg">
                    📄
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">Electronic Negotiable Warehouse Receipt (e-NWR)</h3>
                    <p className="text-[10px] font-mono text-slate-500">WDRA Regd. • {selectedLotForENWR.enwrNumber}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedLotForENWR(null)} className="text-slate-400 hover:text-slate-700 font-black cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Depositor / Farmer</span>
                    <strong className="text-slate-900">{selectedLotForENWR.farmerName}</strong>
                    <p className="text-[10px] text-slate-500 font-mono">{selectedLotForENWR.farmerPhone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Terminal Operator</span>
                    <strong className="text-slate-900">Sahyadri Agri-Logistics Hub</strong>
                    <p className="text-[10px] text-slate-500">Niphad Yard, Nashik</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Commodity &amp; Certified Grade</span>
                    <strong className="text-slate-900">{selectedLotForENWR.commodity}</strong>
                    <p className="text-[10px] text-emerald-700 font-bold">{selectedLotForENWR.qualityGrade} ({selectedLotForENWR.qualityScore}%)</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Net Stored Weight</span>
                    <strong className="text-slate-900 font-mono text-sm">{selectedLotForENWR.weightTons} Metric Tons</strong>
                    <p className="text-[10px] text-slate-500 font-mono">{selectedLotForENWR.weightKg.toLocaleString('en-IN')} kg</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Storage Bay Allocation</span>
                    <strong className="text-blue-900">{selectedLotForENWR.bayLocation}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Deposit Telemetry</span>
                    <strong className="text-teal-900 font-mono">{selectedLotForENWR.temperatureCelcius}°C / {selectedLotForENWR.humidityPercent}% RH</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-600">
                  <span>Accrued Storage Holding Charges:</span>
                  <strong className="text-slate-900 font-mono text-xs">₹{selectedLotForENWR.accruedStorageFeeInr.toFixed(2)}</strong>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold h-11 rounded-xl cursor-pointer shadow-xs"
                  onClick={() => {
                    toast.success('Pledged for Instant Post-Harvest Credit', {
                      description: `Pledged ${selectedLotForENWR.enwrNumber} with SBI / NABARD for ₹${(selectedLotForENWR.weightTons * 22000 * 0.7).toLocaleString('en-IN')} credit at 4% p.a.`
                    });
                    setSelectedLotForENWR(null);
                  }}
                >
                  Pledge for 70% Bank Credit 🏦
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-xs font-bold h-11 rounded-xl border-slate-200"
                  onClick={() => setSelectedLotForENWR(null)}
                >
                  Close
                </Button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: TRANSPORTER OUTWARD HANDSHAKE OTP MODAL */}
        {/* ========================================================================= */}
        {selectedLotForOutward && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    🚚
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">Transporter Pickup Handshake</h3>
                    <p className="text-[10px] font-mono text-slate-500">Lot: {selectedLotForOutward.lotNumber}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedLotForOutward(null)} className="text-slate-400 hover:text-slate-700 font-black cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleVerifyOutwardHandshake} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Assigned Transporter Vehicle</label>
                  <input
                    type="text"
                    value={outwardVehicleInput}
                    onChange={(e) => setOutwardVehicleInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Driver Name / Carrier</label>
                  <input
                    type="text"
                    value={outwardDriverName}
                    onChange={(e) => setOutwardDriverName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-900 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Enter Transporter 4-Digit Pickup Handshake OTP
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 4821"
                    value={outwardOtpInput}
                    onChange={(e) => setOutwardOtpInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-400 font-mono font-black text-center text-lg tracking-widest text-slate-900 bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Demo OTP for this trade: <strong className="font-mono text-amber-800">{selectedLotForOutward.pickupOtp || '4821'}</strong>
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-700">
                  <div className="flex justify-between font-bold">
                    <span>Accrued Warehouse Holding Fee:</span>
                    <span className="font-mono text-slate-900">₹{selectedLotForOutward.accruedStorageFeeInr.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-emerald-700 font-bold">
                    Auto-settled directly from Buyer Escrow Vault to Terminal Account.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black text-xs h-11 rounded-xl cursor-pointer shadow-xs"
                  >
                    Confirm OTP &amp; Issue Gate Pass 📄
                  </Button>
                </div>
              </form>

            </div>
          </div>
        )}

      </main>
      </div>
    </ProtectedRoute>
  );
}
