'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { useAppTheme } from '@/lib/ThemeContext';
import {
  Warehouse,
  FileText,
  CheckCircle2,
  AlertCircle,
  Search,
  Boxes,
  ShieldCheck,
  X,
  Plus,
  Truck,
  MapPin,
  PackageCheck,
  ChevronDown,
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';

/* =========================================================
   TYPES
========================================================= */

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

/* =========================================================
   DASHBOARD
========================================================= */

export default function WarehouseDashboardPage() {
  const { config } = useAppTheme();

  // Collapsible Accordion State for Metrics Area (Hidden by Default)
  const [isMetricsExpanded, setIsMetricsExpanded] = useState<boolean>(false);

  const [currentView, setCurrentView] = useState<
    'inventory' | 'inward' | 'outward' | 'telemetry' | 'ledger'
  >('inventory');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'ACTIVE_STORAGE' | 'RELEASE_AUTHORIZED' | 'DISPATCHED'
  >('ALL');

  /* =======================================================
     STORED PRODUCE DATA
  ======================================================= */

  const [lots, setLots] = useState<WarehouseStoredLot[]>([
    {
      id: 'WH-LOT-01',
      lotNumber: 'LOT-15',
      farmerName: 'Ramesh Patil',
      farmerPhone: '+91 98231 44210',
      fpoAffiliation: 'Nashik East Farmers Collective',
      commodity: 'Banana',
      variety: 'Grand Naine',
      weightTons: 5,
      weightKg: 5000,
      bayLocation: 'Cold Bay A-1',
      bayType: 'COLD_STORAGE',
      temperatureCelcius: 12.4,
      humidityPercent: 88,
      entryDate: '2026-08-21',
      daysStored: 4,
      qualityGrade: 'Grade A',
      qualityScore: 95.8,
      enwrNumber: 'eNWR-WDRA-2026-8891',
      storageRatePerKgPerMonth: 0.18,
      accruedStorageFeeInr: 120,
      tradeStatus: 'RELEASE_AUTHORIZED',
      buyerName: 'AgroProcure Private Ltd',
      transporterVehicle: 'MH-15-EG-4421',
      pickupOtp: '4821',
    },
    {
      id: 'WH-LOT-02',
      lotNumber: 'LOT-102',
      farmerName: 'Suresh Patil',
      farmerPhone: '+91 94220 89123',
      fpoAffiliation: 'Nashik East Farmers Collective',
      commodity: 'Wheat',
      variety: 'Sharbati',
      weightTons: 10,
      weightKg: 10000,
      bayLocation: 'Dry Grain Silo B-1',
      bayType: 'DRY_GRAIN',
      temperatureCelcius: 24,
      humidityPercent: 42,
      entryDate: '2026-08-18',
      daysStored: 7,
      qualityGrade: 'Grade A',
      qualityScore: 98.2,
      enwrNumber: 'eNWR-WDRA-2026-8892',
      storageRatePerKgPerMonth: 0.12,
      accruedStorageFeeInr: 280,
      tradeStatus: 'ACTIVE_STORAGE',
    },
    {
      id: 'WH-LOT-03',
      lotNumber: 'LOT-103',
      farmerName: 'Kailash Jadhav',
      farmerPhone: '+91 98901 23456',
      fpoAffiliation: 'Niphad Onion Producers Co-Op',
      commodity: 'Nashik Red Onion',
      variety: 'Garva',
      weightTons: 15,
      weightKg: 15000,
      bayLocation: 'Cold Bay A-2',
      bayType: 'COLD_STORAGE',
      temperatureCelcius: 14.5,
      humidityPercent: 65,
      entryDate: '2026-08-20',
      daysStored: 5,
      qualityGrade: 'Grade A',
      qualityScore: 94.5,
      enwrNumber: 'eNWR-WDRA-2026-8893',
      storageRatePerKgPerMonth: 0.16,
      accruedStorageFeeInr: 400,
      tradeStatus: 'RELEASE_AUTHORIZED',
      buyerName: 'FreshDirect APMC Traders',
      transporterVehicle: 'MH-12-RN-9082',
      pickupOtp: '6219',
    },
    {
      id: 'WH-LOT-04',
      lotNumber: 'LOT-104',
      farmerName: 'Anil Deshmukh',
      farmerPhone: '+91 97654 32109',
      fpoAffiliation: 'Sahyadri FPC',
      commodity: 'Tomato',
      variety: 'Vaishali',
      weightTons: 4.5,
      weightKg: 4500,
      bayLocation: 'Cold Bay A-1',
      bayType: 'COLD_STORAGE',
      temperatureCelcius: 12.4,
      humidityPercent: 88,
      entryDate: '2026-08-22',
      daysStored: 3,
      qualityGrade: 'Grade A',
      qualityScore: 96.8,
      enwrNumber: 'eNWR-WDRA-2026-8894',
      storageRatePerKgPerMonth: 0.2,
      accruedStorageFeeInr: 90,
      tradeStatus: 'ACTIVE_STORAGE',
    },
  ]);

  /* =======================================================
     STORAGE BAYS DATA
  ======================================================= */

  const [climateBays] = useState<ClimateBayData[]>([
    {
      id: 'BAY-A1',
      name: 'Cold Bay A-1',
      type: 'COLD_STORAGE',
      temp: 12.4,
      targetTemp: 12,
      humidity: 88,
      targetHumidity: 90,
      ethylenePpm: 0.08,
      capacityTons: 120,
      occupiedTons: 84.5,
      status: 'OPTIMAL',
    },
    {
      id: 'BAY-A2',
      name: 'Cold Bay A-2',
      type: 'COLD_STORAGE',
      temp: 14.5,
      targetTemp: 14,
      humidity: 65,
      targetHumidity: 65,
      ethylenePpm: 0.04,
      capacityTons: 150,
      occupiedTons: 135,
      status: 'OPTIMAL',
    },
    {
      id: 'BAY-B1',
      name: 'Dry Grain Silo B-1',
      type: 'DRY_GRAIN',
      temp: 24,
      targetTemp: 25,
      humidity: 42,
      targetHumidity: 45,
      ethylenePpm: 0.01,
      capacityTons: 250,
      occupiedTons: 160,
      status: 'OPTIMAL',
    },
    {
      id: 'BAY-C1',
      name: 'Controlled Storage C-1',
      type: 'CONTROLLED_ATMOSPHERE',
      temp: 18,
      targetTemp: 18,
      humidity: 48,
      targetHumidity: 50,
      ethylenePpm: 0.02,
      capacityTons: 100,
      occupiedTons: 42,
      status: 'OPTIMAL',
    },
  ]);

  /* =======================================================
     METRIC CALCULATIONS
  ======================================================= */

  const totalStorageCapacityTons = climateBays.reduce(
    (sum, bay) => sum + bay.capacityTons,
    0
  );

  const totalOccupiedCapacityTons = climateBays.reduce(
    (sum, bay) => sum + bay.occupiedTons,
    0
  );

  const totalOccupancyPercent = Math.round(
    (totalOccupiedCapacityTons / totalStorageCapacityTons) * 100
  );

  const activeStorageLots = lots.filter(
    (lot) => lot.tradeStatus === 'ACTIVE_STORAGE'
  ).length;

  const readyForPickupLots = lots.filter(
    (lot) => lot.tradeStatus === 'RELEASE_AUTHORIZED'
  ).length;

  const totalStorageRevenue = lots.reduce(
    (sum, lot) => sum + lot.accruedStorageFeeInr,
    0
  );

  /* =======================================================
     MODAL STATE
  ======================================================= */

  const [selectedLotForReceipt, setSelectedLotForReceipt] =
    useState<WarehouseStoredLot | null>(null);

  const [selectedLotForOutward, setSelectedLotForOutward] =
    useState<WarehouseStoredLot | null>(null);

  const [outwardOtpInput, setOutwardOtpInput] = useState('');
  const [outwardDriverName, setOutwardDriverName] = useState('Rahul Shinde');
  const [outwardVehicleInput, setOutwardVehicleInput] =
    useState('MH-15-EG-4421');

  /* =======================================================
     INWARD FORM STATE
  ======================================================= */

  const [inwardFarmerName, setInwardFarmerName] = useState('');
  const [inwardPhone, setInwardPhone] = useState('');
  const [inwardFpo, setInwardFpo] = useState('');
  const [inwardCommodity, setInwardCommodity] = useState('Banana');
  const [inwardVariety, setInwardVariety] = useState('Grand Naine');
  const [inwardWeightTons, setInwardWeightTons] = useState(5);
  const [inwardBay, setInwardBay] = useState('Cold Bay A-1');
  const [inwardRatePerKg] = useState(0.18);

  /* =======================================================
     LOCAL STORAGE SYNC
  ======================================================= */

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kisansetu_crop_lots');
      if (!saved) return;

      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) return;

      const firstLot = parsed[0];
      if (!firstLot) return;

      if (lots.some((l) => l.lotNumber === firstLot.id)) return;

      const injectedLot: WarehouseStoredLot = {
        id: `WH-${firstLot.id}`,
        lotNumber: firstLot.id,
        farmerName: firstLot.farmerName || 'Farmer',
        farmerPhone: firstLot.farmerPhone || '',
        fpoAffiliation: firstLot.fpoAffiliation || 'FPO Member',
        commodity: firstLot.cropName || 'Produce',
        variety: firstLot.variety || 'Standard Grade',
        weightTons:
          firstLot.quantityTons || (firstLot.quantityKg || 5000) / 1000,
        weightKg: firstLot.quantityKg || 5000,
        bayLocation: 'Cold Bay A-1',
        bayType: 'COLD_STORAGE',
        temperatureCelcius: 12.4,
        humidityPercent: 88,
        entryDate:
          firstLot.harvestDate || new Date().toISOString().split('T')[0],
        daysStored: 1,
        qualityGrade: firstLot.qualityGrade || 'Grade A',
        qualityScore: firstLot.qualityScore || 95,
        enwrNumber: `eNWR-WDRA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        storageRatePerKgPerMonth: 0.18,
        accruedStorageFeeInr: 0,
        tradeStatus:
          firstLot.status === 'BID_ACCEPTED' || firstLot.status === 'IN_TRANSIT'
            ? 'RELEASE_AUTHORIZED'
            : 'ACTIVE_STORAGE',
      };

      setLots((prev) => [injectedLot, ...prev]);
    } catch {
      // Ignore invalid local storage data
    }
  }, []);

  /* =======================================================
     RECEIVE PRODUCE
  ======================================================= */

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
      temperatureCelcius: isCold ? 12.4 : 24,
      humidityPercent: isCold ? 85 : 45,
      entryDate: new Date().toISOString().split('T')[0],
      daysStored: 0,
      qualityGrade: 'Grade A',
      qualityScore: 96,
      enwrNumber: newEnwr,
      storageRatePerKgPerMonth: Number(inwardRatePerKg),
      accruedStorageFeeInr: 0,
      tradeStatus: 'ACTIVE_STORAGE',
    };

    setLots((prev) => [createdLot, ...prev]);
    setCurrentView('inventory');

    toast.success('Produce received successfully', {
      description: `${createdLot.weightTons} MT of ${createdLot.commodity} stored in ${createdLot.bayLocation}.`,
    });

    setInwardFarmerName('');
    setInwardPhone('');
    setInwardFpo('');
  };

  /* =======================================================
     DISPATCH PRODUCE
  ======================================================= */

  const handleVerifyOutwardHandshake = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLotForOutward) return;

    const correctOtp = selectedLotForOutward.pickupOtp || '4821';

    if (outwardOtpInput !== correctOtp) {
      toast.error('Pickup code is incorrect', {
        description: 'Please check the 4-digit code provided for this pickup.',
      });
      return;
    }

    setLots((prev) =>
      prev.map((lot) => {
        if (lot.id === selectedLotForOutward.id) {
          return {
            ...lot,
            tradeStatus: 'DISPATCHED',
            transporterVehicle: outwardVehicleInput,
          };
        }
        return lot;
      })
    );

    toast.success('Produce dispatched successfully', {
      description: `Gate release completed for ${outwardVehicleInput}.`,
    });

    setSelectedLotForOutward(null);
    setOutwardOtpInput('');
  };

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredLots = lots.filter((lot) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      lot.lotNumber.toLowerCase().includes(query) ||
      lot.commodity.toLowerCase().includes(query) ||
      lot.farmerName.toLowerCase().includes(query) ||
      lot.bayLocation.toLowerCase().includes(query);

    if (statusFilter === 'ALL') {
      return matchesSearch;
    }

    return matchesSearch && lot.tradeStatus === statusFilter;
  });

  return (
    <ProtectedRoute allowedRoles={['WAREHOUSE', 'ADMIN']}>
      <div className="min-h-screen bg-[#F7F5EF] text-slate-900 flex flex-col font-sans">
        <Navbar activeRole="WAREHOUSE" />

        <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
          {/* ==================================================
              HEADER - DYNAMICALLY STYLED WITH THEME CONTEXT
          ================================================== */}
          <header className={`p-6 sm:p-7 rounded-3xl border border-white/10 text-white shadow-md transition-colors duration-300 ${config.heroBgGradient}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${config.heroCtaIconBg} border border-white/20 ${config.heroCtaIconColor} flex items-center justify-center shrink-0 shadow-inner`}>
                  <Warehouse size={28} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${config.heroTextGradient} bg-clip-text text-transparent`}>
                      Sahyadri Agri Storage
                    </h1>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide shadow-sm ${config.badgeBg}`}>
                      WDRA Registered
                    </span>
                  </div>

                  <p className="text-xs text-white/80 flex items-center gap-1.5 mt-1.5 font-medium">
                    <MapPin size={13} className={config.heroCtaIconColor} />
                    Niphad Central Yard, Nashik
                  </p>
                </div>
              </div>

              {/* HEADER ACTIONS & TOGGLE BUTTON */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  onClick={() => setCurrentView('inward')}
                  className={`${config.heroCtaButton} font-black rounded-2xl h-10 px-4 text-xs shadow-sm transition-all`}
                >
                  <Plus size={15} />
                  Receive Produce
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setCurrentView('outward')}
                  className="border-white/20 bg-black/20 text-white hover:bg-white/20 rounded-2xl h-10 px-4 text-xs font-black backdrop-blur-sm"
                >
                  <Truck size={15} className={config.heroCtaIconColor} />
                  Pickup
                  {readyForPickupLots > 0 && (
                    <span className={`ml-1.5 ${config.badgeBg} px-1.5 py-0.5 rounded-full text-[10px] font-black`}>
                      {readyForPickupLots}
                    </span>
                  )}
                </Button>

                {/* CHEVRON TOGGLE BUTTON */}
                <button
                  type="button"
                  onClick={() => setIsMetricsExpanded((prev) => !prev)}
                  aria-expanded={isMetricsExpanded}
                  aria-controls="collapsible-metrics-section"
                  aria-label={isMetricsExpanded ? 'Collapse metrics' : 'Expand metrics'}
                  className="w-10 h-10 rounded-2xl border border-white/20 bg-black/20 text-white hover:bg-white/20 transition-colors shadow-sm flex items-center justify-center shrink-0 backdrop-blur-sm"
                >
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ease-in-out ${
                      isMetricsExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </header>

          {/* ==================================================
              COLLAPSIBLE METRICS AREA (Progressive Disclosure)
          ================================================== */}
          <div
            id="collapsible-metrics-section"
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
              isMetricsExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
              <div className="space-y-4 pt-1">
                {/* FEATURED STATUS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* PICKUPS WAITING */}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-black text-amber-700">
                          Pickups Waiting
                        </p>
                        <p className="text-2xl font-black text-amber-800 mt-1">
                          {readyForPickupLots}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 text-amber-600 flex items-center justify-center">
                        <Truck size={21} />
                      </div>
                    </div>
                    <p className="text-[11px] text-amber-700 mt-1 font-medium">
                      Lots ready for transporter pickup
                    </p>
                  </div>

                  {/* STORAGE HEALTH */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-black text-emerald-700">
                          Storage Health
                        </p>
                        <p className="text-2xl font-black text-emerald-800 mt-1">
                          Optimal
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 size={21} />
                      </div>
                    </div>
                    <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                      All cold & dry bays normal
                    </p>
                  </div>

                  {/* WAREHOUSE CAPACITY */}
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-black text-blue-700">
                          Warehouse Occupancy
                        </p>
                        <p className="text-2xl font-black text-blue-800 mt-1">
                          {totalOccupancyPercent}%
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 text-blue-600 flex items-center justify-center">
                        <Warehouse size={21} />
                      </div>
                    </div>
                    <p className="text-[11px] text-blue-700 mt-1 font-medium">
                      {totalOccupiedCapacityTons} / {totalStorageCapacityTons} MT stored
                    </p>
                  </div>
                </div>

                {/* STANDARD SUMMARY CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* TOTAL LOTS */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-black text-slate-500">
                          Stored Lots
                        </p>
                        <p className="text-2xl font-black text-slate-900 mt-1">
                          {lots.length}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                        <Boxes size={19} />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Total lots on record
                    </p>
                  </div>

                  {/* ACTIVE STORAGE */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-black text-slate-500">
                          In Storage
                        </p>
                        <p className="text-2xl font-black text-slate-900 mt-1">
                          {activeStorageLots}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Warehouse size={19} />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Active warehouse lots
                    </p>
                  </div>

                  {/* READY FOR PICKUP */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-black text-slate-500">
                          Ready for Pickup
                        </p>
                        <p className="text-2xl font-black text-slate-900 mt-1">
                          {readyForPickupLots}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Truck size={19} />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Authorized releases
                    </p>
                  </div>

                  {/* REVENUE */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-black text-slate-500">
                          Accrued Storage Fee
                        </p>
                        <p className="text-xl font-black text-slate-900 mt-1">
                          ₹{totalStorageRevenue.toFixed(0)}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <DollarSign size={19} />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Accrued storage fees
                    </p>
                  </div>
                </div>

                {/* ALERT BANNER */}
                {readyForPickupLots > 0 && (
                  <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                        <AlertCircle size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900">
                          {readyForPickupLots} lot{readyForPickupLots !== 1 ? 's' : ''} ready for dispatch
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Transporters are scheduled to pick up these lots. Verify pickup code at release.
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setCurrentView('outward')}
                      className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black text-xs h-9 shrink-0"
                    >
                      View Pickups
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ==================================================
              MAIN CONTENT CONTAINER WITH INTEGRATED VIEW SELECTOR
          ================================================== */}
          <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
            {/* INTEGRATED VIEW SELECTOR DROPDOWN */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {currentView === 'inventory' && 'Stored Produce'}
                  {currentView === 'inward' && 'Receive Produce'}
                  {currentView === 'outward' && 'Dispatch & Pickups'}
                  {currentView === 'telemetry' && 'Storage Conditions'}
                  {currentView === 'ledger' && 'Storage Payments'}
                </h2>
              </div>

              <div className="relative inline-block w-full sm:w-56">
                <select
                  value={currentView}
                  onChange={(e) => setCurrentView(e.target.value as any)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-xs font-black rounded-2xl py-2.5 pl-3.5 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 cursor-pointer shadow-sm"
                >
                  <option value="inventory">Stored Produce ({lots.length})</option>
                  <option value="inward">+ Receive Produce</option>
                  <option value="outward">
                    Dispatch & Pickups ({readyForPickupLots})
                  </option>
                  <option value="telemetry">Storage Conditions</option>
                  <option value="ledger">Storage Payments</option>
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* ==================================================
                VIEW 1 - STORED PRODUCE INVENTORY
            ================================================== */}
            {currentView === 'inventory' && (
              <div className="space-y-5">
                {/* FILTERS */}
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search farmer, crop or lot..."
                      className="w-full h-10 pl-10 pr-3 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                    />
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {[
                      ['ALL', 'All'],
                      ['ACTIVE_STORAGE', 'In Storage'],
                      ['RELEASE_AUTHORIZED', 'Ready for Pickup'],
                      ['DISPATCHED', 'Dispatched'],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => setStatusFilter(value as any)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                          statusFilter === value
                            ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* LOT CARDS */}
                {filteredLots.length === 0 ? (
                  <div className="border border-dashed border-slate-300 rounded-3xl p-10 text-center bg-slate-50">
                    <Boxes size={38} className="mx-auto text-slate-400" />
                    <h3 className="font-black mt-3 text-slate-900">
                      No produce found
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Try another search or receive a new produce lot.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredLots.map((lot) => (
                      <div
                        key={lot.id}
                        className="border border-slate-200 rounded-2xl p-4 sm:p-5 hover:border-amber-300 transition-colors shadow-sm bg-white"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          {/* BASIC INFO */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-black text-sm text-slate-900">
                                {lot.lotNumber}
                              </span>

                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                  lot.tradeStatus === 'RELEASE_AUTHORIZED'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : lot.tradeStatus === 'DISPATCHED'
                                    ? 'bg-slate-100 text-slate-700 border border-slate-200'
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                }`}
                              >
                                {lot.tradeStatus === 'RELEASE_AUTHORIZED'
                                  ? 'READY FOR PICKUP'
                                  : lot.tradeStatus === 'DISPATCHED'
                                  ? 'DISPATCHED'
                                  : 'IN STORAGE'}
                              </span>
                            </div>

                            <h3 className="font-black text-base mt-1 text-slate-900">
                              {lot.commodity}
                            </h3>

                            <p className="text-xs text-slate-500">
                              {lot.variety} • {lot.weightTons} MT
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                              Farmer:
                              <strong className="text-slate-800 ml-1">
                                {lot.farmerName}
                              </strong>
                            </p>
                          </div>

                          {/* LOCATION */}
                          <div className="min-w-[160px]">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">
                              Storage Location
                            </p>
                            <p className="text-sm font-bold mt-1 text-slate-900">
                              {lot.bayLocation}
                            </p>
                            <p className="text-xs text-slate-500">
                              {lot.temperatureCelcius}°C • {lot.humidityPercent}% humidity
                            </p>
                          </div>

                          {/* DAYS */}
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">
                              Stored For
                            </p>
                            <p className="text-sm font-black mt-1 text-slate-900">
                              {lot.daysStored} days
                            </p>
                            <p className="text-xs text-slate-500">
                              ₹{lot.accruedStorageFeeInr.toFixed(2)} storage fee
                            </p>
                          </div>

                          {/* ACTIONS */}
                          <div className="flex flex-row lg:flex-col items-center lg:items-stretch gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedLotForReceipt(lot)}
                              className="rounded-xl text-xs font-bold border-slate-200"
                            >
                              <FileText size={13} />
                              Receipt
                            </Button>

                            {lot.tradeStatus === 'RELEASE_AUTHORIZED' && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedLotForOutward(lot);
                                  setOutwardVehicleInput(
                                    lot.transporterVehicle || ''
                                  );
                                }}
                                className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold"
                              >
                                <Truck size={13} />
                                Dispatch
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================================================
                VIEW 2 - RECEIVE PRODUCE INWARD
            ================================================== */}
            {currentView === 'inward' && (
              <div className="max-w-2xl mx-auto py-2">
                <form onSubmit={handleCreateInwardLot} className="space-y-5">
                  {/* FARMER */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                    <h3 className="text-xs font-black uppercase text-slate-600">
                      1. Farmer Details
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-500">
                          Farmer Name
                        </label>
                        <input
                          required
                          value={inwardFarmerName}
                          onChange={(e) => setInwardFarmerName(e.target.value)}
                          className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-600"
                          placeholder="Enter farmer name"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500">
                          Mobile Number
                        </label>
                        <input
                          required
                          value={inwardPhone}
                          onChange={(e) => setInwardPhone(e.target.value)}
                          className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-600"
                          placeholder="Enter mobile number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500">
                        FPO / Collective Name
                      </label>
                      <input
                        value={inwardFpo}
                        onChange={(e) => setInwardFpo(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-600"
                        placeholder="Enter FPO name"
                      />
                    </div>
                  </div>

                  {/* PRODUCE */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                    <h3 className="text-xs font-black uppercase text-slate-600">
                      2. Produce Details
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-500">
                          Crop
                        </label>
                        <select
                          value={inwardCommodity}
                          onChange={(e) => setInwardCommodity(e.target.value)}
                          className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-amber-600"
                        >
                          <option value="Banana">🍌 Banana</option>
                          <option value="Nashik Red Onion">🧅 Onion</option>
                          <option value="Tomato">🍅 Tomato</option>
                          <option value="Wheat">🌾 Wheat</option>
                          <option value="Rice">🌾 Rice</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500">
                          Variety
                        </label>
                        <input
                          required
                          value={inwardVariety}
                          onChange={(e) => setInwardVariety(e.target.value)}
                          className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-600"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-500">
                          Quantity (MT)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          required
                          value={inwardWeightTons}
                          onChange={(e) =>
                            setInwardWeightTons(Number(e.target.value))
                          }
                          className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-amber-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500">
                          Storage Area
                        </label>
                        <select
                          value={inwardBay}
                          onChange={(e) => setInwardBay(e.target.value)}
                          className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-amber-600"
                        >
                          <option>Cold Bay A-1</option>
                          <option>Cold Bay A-2</option>
                          <option>Dry Grain Silo B-1</option>
                          <option>Controlled Storage C-1</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* CONFIRM */}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-center">
                    <ShieldCheck className="text-amber-700 shrink-0" size={20} />
                    <p className="text-xs text-amber-900 font-medium">
                      A digital warehouse receipt will be issued immediately upon entry.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black h-11 rounded-2xl text-xs"
                  >
                    <PackageCheck size={16} />
                    Confirm & Receive Produce
                  </Button>
                </form>
              </div>
            )}

            {/* ==================================================
                VIEW 3 - DISPATCH & PICKUPS
            ================================================== */}
            {currentView === 'outward' && (
              <div className="space-y-4">
                {readyForPickupLots === 0 ? (
                  <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center">
                    <Truck size={40} className="mx-auto text-slate-400" />
                    <h3 className="font-black mt-3 text-slate-900">
                      No pickups waiting
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Sold produce will appear here when authorized for gate release.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {lots
                      .filter((lot) => lot.tradeStatus === 'RELEASE_AUTHORIZED')
                      .map((lot) => (
                        <div
                          key={lot.id}
                          className="bg-white border-2 border-amber-200 rounded-2xl p-5 space-y-3 shadow-sm"
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-black">
                                {lot.lotNumber}
                              </span>
                              <h3 className="font-black text-slate-900 mt-1">
                                {lot.commodity}
                              </h3>
                              <p className="text-xs text-slate-500">
                                {lot.weightTons} MT • {lot.farmerName}
                              </p>
                            </div>
                          </div>

                          <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Buyer</span>
                              <strong className="text-slate-900">{lot.buyerName}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Vehicle</span>
                              <strong className="font-mono text-slate-900">
                                {lot.transporterVehicle}
                              </strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Bay</span>
                              <strong className="text-slate-900">{lot.bayLocation}</strong>
                            </div>
                          </div>

                          <Button
                            onClick={() => {
                              setSelectedLotForOutward(lot);
                              setOutwardVehicleInput(lot.transporterVehicle || '');
                            }}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl text-xs h-10"
                          >
                            <Truck size={15} />
                            Verify Pickup & Dispatch
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================================================
                VIEW 4 - STORAGE CONDITIONS
            ================================================== */}
            {currentView === 'telemetry' && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {climateBays.map((bay) => {
                    const occupancy = Math.round(
                      (bay.occupiedTons / bay.capacityTons) * 100
                    );

                    return (
                      <div
                        key={bay.id}
                        className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm space-y-4"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-black">
                              {bay.id}
                            </span>
                            <h3 className="font-black text-slate-900 mt-1">
                              {bay.name}
                            </h3>
                          </div>

                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                            {bay.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <p className="text-[10px] text-slate-500 font-bold uppercase">
                              Temperature
                            </p>
                            <p className="text-lg font-black text-slate-900 mt-1">
                              {bay.temp}°C
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Target {bay.targetTemp}°C
                            </p>
                          </div>

                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <p className="text-[10px] text-slate-500 font-bold uppercase">
                              Humidity
                            </p>
                            <p className="text-lg font-black text-slate-900 mt-1">
                              {bay.humidity}%
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Target {bay.targetHumidity}%
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-500">Used</span>
                            <span className="text-slate-800 font-mono">
                              {bay.occupiedTons} / {bay.capacityTons} MT ({occupancy}%)
                            </span>
                          </div>

                          <div className="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: `${occupancy}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==================================================
                VIEW 5 - STORAGE PAYMENTS
            ================================================== */}
            {currentView === 'ledger' && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <p className="text-xs font-black uppercase text-slate-500">
                    Storage Revenue Overview
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        Total Collected
                      </p>
                      <p className="text-2xl font-black text-slate-900 mt-1">
                        ₹1,48,650
                      </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        Accrued (Active Storage)
                      </p>
                      <p className="text-2xl font-black text-amber-700 mt-1">
                        ₹{totalStorageRevenue.toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ==================================================
              RECEIPT MODAL
          ================================================== */}
          {selectedLotForReceipt && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-black text-slate-900">
                      Warehouse Receipt
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {selectedLotForReceipt.enwrNumber}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedLotForReceipt(null)}
                    className="text-slate-400 hover:text-slate-800"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-slate-400">Farmer</p>
                      <p className="font-bold text-slate-900">
                        {selectedLotForReceipt.farmerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Lot</p>
                      <p className="font-bold text-slate-900 font-mono">
                        {selectedLotForReceipt.lotNumber}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-slate-400">Produce</p>
                      <p className="font-bold text-slate-900">
                        {selectedLotForReceipt.commodity}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Quantity</p>
                      <p className="font-bold text-slate-900">
                        {selectedLotForReceipt.weightTons} MT
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-slate-400">Location</p>
                      <p className="font-bold text-slate-900">
                        {selectedLotForReceipt.bayLocation}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Quality</p>
                      <p className="font-bold text-emerald-700">
                        {selectedLotForReceipt.qualityGrade}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setSelectedLotForReceipt(null)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs h-10 font-bold"
                >
                  Close Receipt
                </Button>
              </div>
            </div>
          )}

          {/* ==================================================
              DISPATCH MODAL
          ================================================== */}
          {selectedLotForOutward && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-black text-slate-900">Confirm Pickup</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">
                      {selectedLotForOutward.lotNumber} • {selectedLotForOutward.commodity}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedLotForOutward(null)}
                    className="text-slate-400 hover:text-slate-800"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleVerifyOutwardHandshake} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500">
                      Vehicle Number
                    </label>
                    <input
                      required
                      value={outwardVehicleInput}
                      onChange={(e) => setOutwardVehicleInput(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-xs focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500">
                      Driver Name
                    </label>
                    <input
                      required
                      value={outwardDriverName}
                      onChange={(e) => setOutwardDriverName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <label className="text-xs font-black text-amber-900">
                      Pickup Code
                    </label>
                    <input
                      required
                      maxLength={4}
                      value={outwardOtpInput}
                      onChange={(e) => setOutwardOtpInput(e.target.value)}
                      placeholder="Enter 4-digit code"
                      className="w-full mt-2 px-4 py-2.5 rounded-xl border-2 border-amber-300 text-center text-lg font-mono font-black tracking-[0.4em]"
                    />
                    <p className="text-[10px] text-amber-800 mt-2">
                      Demo code:{' '}
                      <strong>{selectedLotForOutward.pickupOtp || '4821'}</strong>
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black h-11 rounded-xl text-xs"
                  >
                    <CheckCircle2 size={16} />
                    Confirm & Dispatch
                  </Button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
