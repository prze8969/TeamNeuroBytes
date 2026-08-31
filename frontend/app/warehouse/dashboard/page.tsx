'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import {
  Warehouse,
  Thermometer,
  Droplets,
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
  Receipt,
  Clock3,
  ArrowRight,
  RefreshCw,
  IndianRupee,
  PackageCheck,
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
  bayType:
  | 'COLD_STORAGE'
  | 'DRY_GRAIN'
  | 'CONTROLLED_ATMOSPHERE';
  temperatureCelcius: number;
  humidityPercent: number;
  entryDate: string;
  daysStored: number;
  qualityGrade: string;
  qualityScore: number;
  enwrNumber: string;
  storageRatePerKgPerMonth: number;
  accruedStorageFeeInr: number;
  tradeStatus:
  | 'ACTIVE_STORAGE'
  | 'RELEASE_AUTHORIZED'
  | 'DISPATCHED';
  buyerName?: string;
  transporterVehicle?: string;
  pickupOtp?: string;
}

export interface ClimateBayData {
  id: string;
  name: string;
  type:
  | 'COLD_STORAGE'
  | 'DRY_GRAIN'
  | 'CONTROLLED_ATMOSPHERE';
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

  const [activeTab, setActiveTab] = useState<
    'inventory' | 'inward' | 'outward' | 'telemetry' | 'ledger'
  >('inventory');

  const [searchQuery, setSearchQuery] = useState('');

  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'ACTIVE_STORAGE' | 'RELEASE_AUTHORIZED' | 'DISPATCHED'
  >('ALL');


  /* =======================================================
     STORED PRODUCE
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
      storageRatePerKgPerMonth: 0.20,
      accruedStorageFeeInr: 90,
      tradeStatus: 'ACTIVE_STORAGE',
    },
  ]);


  /* =======================================================
     STORAGE BAYS
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
     MODAL STATE
  ======================================================= */

  const [selectedLotForReceipt, setSelectedLotForReceipt] =
    useState<WarehouseStoredLot | null>(null);

  const [selectedLotForOutward, setSelectedLotForOutward] =
    useState<WarehouseStoredLot | null>(null);

  const [outwardOtpInput, setOutwardOtpInput] = useState('');

  const [outwardDriverName, setOutwardDriverName] =
    useState('Rahul Shinde');

  const [outwardVehicleInput, setOutwardVehicleInput] =
    useState('MH-15-EG-4421');


  /* =======================================================
     INWARD FORM
  ======================================================= */

  const [inwardFarmerName, setInwardFarmerName] =
    useState('');

  const [inwardPhone, setInwardPhone] =
    useState('');

  const [inwardFpo, setInwardFpo] =
    useState('');

  const [inwardCommodity, setInwardCommodity] =
    useState('Banana');

  const [inwardVariety, setInwardVariety] =
    useState('Grand Naine');

  const [inwardWeightTons, setInwardWeightTons] =
    useState(5);

  const [inwardBay, setInwardBay] =
    useState('Cold Bay A-1');

  const [inwardRatePerKg, setInwardRatePerKg] =
    useState(0.18);


  /* =======================================================
     LOCAL STORAGE SYNC
  ======================================================= */

  useEffect(() => {

    try {

      const saved =
        localStorage.getItem('kisansetu_crop_lots');

      if (!saved) return;

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed) || parsed.length === 0)
        return;

      const firstLot = parsed[0];

      if (!firstLot) return;

      if (
        lots.some(
          l => l.lotNumber === firstLot.id
        )
      ) {
        return;
      }

      const injectedLot: WarehouseStoredLot = {

        id: `WH-${firstLot.id}`,

        lotNumber: firstLot.id,

        farmerName:
          firstLot.farmerName || 'Farmer',

        farmerPhone:
          firstLot.farmerPhone || '',

        fpoAffiliation:
          firstLot.fpoAffiliation ||
          'FPO Member',

        commodity:
          firstLot.cropName || 'Produce',

        variety:
          firstLot.variety ||
          'Standard Grade',

        weightTons:
          firstLot.quantityTons ||
          ((firstLot.quantityKg || 5000) / 1000),

        weightKg:
          firstLot.quantityKg || 5000,

        bayLocation:
          'Cold Bay A-1',

        bayType:
          'COLD_STORAGE',

        temperatureCelcius:
          12.4,

        humidityPercent:
          88,

        entryDate:
          firstLot.harvestDate ||
          new Date()
            .toISOString()
            .split('T')[0],

        daysStored: 1,

        qualityGrade:
          firstLot.qualityGrade ||
          'Grade A',

        qualityScore:
          firstLot.qualityScore ||
          95,

        enwrNumber:
          `eNWR-WDRA-2026-${Math.floor(
            1000 + Math.random() * 9000
          )}`,

        storageRatePerKgPerMonth:
          0.18,

        accruedStorageFeeInr:
          0,

        tradeStatus:
          firstLot.status === 'BID_ACCEPTED' ||
            firstLot.status === 'IN_TRANSIT'
            ? 'RELEASE_AUTHORIZED'
            : 'ACTIVE_STORAGE',
      };

      setLots(prev => [
        injectedLot,
        ...prev,
      ]);

    } catch {
      // Ignore invalid local storage data
    }

  }, []);


  /* =======================================================
     RECEIVE PRODUCE
  ======================================================= */

  const handleCreateInwardLot = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const newLotNumber =
      `LOT-${Math.floor(
        100 + Math.random() * 900
      )}`;

    const newEnwr =
      `eNWR-WDRA-2026-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

    const isCold =
      inwardBay
        .toLowerCase()
        .includes('cold');

    const createdLot: WarehouseStoredLot = {

      id: `WH-${newLotNumber}`,

      lotNumber: newLotNumber,

      farmerName:
        inwardFarmerName,

      farmerPhone:
        inwardPhone,

      fpoAffiliation:
        inwardFpo,

      commodity:
        inwardCommodity,

      variety:
        inwardVariety,

      weightTons:
        Number(inwardWeightTons),

      weightKg:
        Number(inwardWeightTons) * 1000,

      bayLocation:
        inwardBay,

      bayType:
        isCold
          ? 'COLD_STORAGE'
          : 'DRY_GRAIN',

      temperatureCelcius:
        isCold ? 12.4 : 24,

      humidityPercent:
        isCold ? 85 : 45,

      entryDate:
        new Date()
          .toISOString()
          .split('T')[0],

      daysStored: 0,

      qualityGrade:
        'Grade A',

      qualityScore:
        96,

      enwrNumber:
        newEnwr,

      storageRatePerKgPerMonth:
        Number(inwardRatePerKg),

      accruedStorageFeeInr:
        0,

      tradeStatus:
        'ACTIVE_STORAGE',
    };

    setLots(prev => [
      createdLot,
      ...prev,
    ]);

    setActiveTab('inventory');

    toast.success(
      'Produce received successfully',
      {
        description:
          `${createdLot.weightTons} MT of ${createdLot.commodity} stored in ${createdLot.bayLocation}.`,
      }
    );

    setInwardFarmerName('');
    setInwardPhone('');
    setInwardFpo('');
  };


  /* =======================================================
     DISPATCH PRODUCE
  ======================================================= */

  const handleVerifyOutwardHandshake = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!selectedLotForOutward)
      return;

    const correctOtp =
      selectedLotForOutward.pickupOtp ||
      '4821';

    if (
      outwardOtpInput !== correctOtp
    ) {

      toast.error(
        'Pickup code is incorrect',
        {
          description:
            'Please check the 4-digit code provided for this pickup.',
        }
      );

      return;
    }

    setLots(prev =>
      prev.map(lot => {

        if (
          lot.id ===
          selectedLotForOutward.id
        ) {

          return {
            ...lot,

            tradeStatus:
              'DISPATCHED',

            transporterVehicle:
              outwardVehicleInput,
          };
        }

        return lot;
      })
    );

    toast.success(
      'Produce dispatched successfully',
      {
        description:
          `Gate release completed for ${outwardVehicleInput}.`,
      }
    );

    setSelectedLotForOutward(null);

    setOutwardOtpInput('');
  };


  /* =======================================================
     METRICS
  ======================================================= */

  const totalStorageCapacityTons =
    climateBays.reduce(
      (sum, bay) =>
        sum + bay.capacityTons,
      0
    );

  const totalOccupiedCapacityTons =
    climateBays.reduce(
      (sum, bay) =>
        sum + bay.occupiedTons,
      0
    );

  const totalOccupancyPercent =
    Math.round(
      (
        totalOccupiedCapacityTons /
        totalStorageCapacityTons
      ) * 100
    );

  const activeStorageLots =
    lots.filter(
      lot =>
        lot.tradeStatus ===
        'ACTIVE_STORAGE'
    ).length;

  const readyForPickupLots =
    lots.filter(
      lot =>
        lot.tradeStatus ===
        'RELEASE_AUTHORIZED'
    ).length;

  const dispatchedLots =
    lots.filter(
      lot =>
        lot.tradeStatus ===
        'DISPATCHED'
    ).length;

  const totalStorageRevenue =
    lots.reduce(
      (sum, lot) =>
        sum +
        lot.accruedStorageFeeInr,
      0
    );


  /* =======================================================
     FILTER
  ======================================================= */

  const filteredLots =
    lots.filter(lot => {

      const query =
        searchQuery
          .toLowerCase()
          .trim();

      const matchesSearch =
        lot.lotNumber
          .toLowerCase()
          .includes(query) ||

        lot.commodity
          .toLowerCase()
          .includes(query) ||

        lot.farmerName
          .toLowerCase()
          .includes(query) ||

        lot.bayLocation
          .toLowerCase()
          .includes(query);

      if (
        statusFilter === 'ALL'
      ) {
        return matchesSearch;
      }

      return (
        matchesSearch &&
        lot.tradeStatus ===
        statusFilter
      );
    });


  /* =======================================================
     TABS
  ======================================================= */

  const tabs = [

    {
      key: 'inventory',
      label: 'Stored Produce',
      icon: <Boxes size={16} />,
      count: lots.length,
    },

    {
      key: 'inward',
      label: 'Receive Produce',
      icon: <Plus size={16} />,
    },

    {
      key: 'outward',
      label: 'Dispatch',
      icon: <Truck size={16} />,
      count:
        readyForPickupLots,
    },

    {
      key: 'telemetry',
      label: 'Storage Conditions',
      icon: <Thermometer size={16} />,
    },

    {
      key: 'ledger',
      label: 'Payments',
      icon: <Receipt size={16} />,
    },

  ];


  return (

    <ProtectedRoute
      allowedRoles={[
        'WAREHOUSE',
        'ADMIN',
      ]}
    >

      <div className="min-h-screen bg-[#F7F5EF] text-slate-900 flex flex-col font-sans">

        <Navbar activeRole="WAREHOUSE" />


        <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">


          {/* ==================================================
              HEADER
          ================================================== */}

          <header className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-sm">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">

                  <Warehouse size={27} />

                </div>


                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <h1 className="text-xl sm:text-2xl font-black tracking-tight">

                      Sahyadri Agri Storage

                    </h1>

                    <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full text-[10px] font-black">

                      WDRA Registered

                    </span>

                  </div>


                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">

                    <MapPin
                      size={14}
                      className="text-blue-600"
                    />

                    Niphad Central Yard,
                    Nashik

                  </p>

                </div>

              </div>


              <div className="flex flex-wrap gap-2">

                <Button
                  onClick={() =>
                    setActiveTab('inward')
                  }
                  className="bg-blue-700 hover:bg-blue-800 text-white font-black rounded-xl h-11 px-5"
                >

                  <Plus size={17} />

                  Receive Produce

                </Button>


                <Button
                  variant="outline"
                  onClick={() =>
                    setActiveTab('outward')
                  }
                  className="border-slate-300 text-slate-800 hover:bg-slate-50 font-bold rounded-xl h-11 px-4"
                >

                  <Truck
                    size={16}
                    className="text-amber-600"
                  />

                  Pickup
                  {readyForPickupLots > 0 && (
                    <span className="ml-1 bg-amber-100 text-amber-800 px-1.5 rounded-full text-[10px]">
                      {readyForPickupLots}
                    </span>
                  )}

                </Button>

              </div>

            </div>


            <p className="text-sm text-slate-600 mt-4 max-w-2xl">

              Keep farmer produce safe, track storage
              space and release sold produce when the
              transporter arrives.

            </p>

          </header>


          {/* ==================================================
              NEEDS ATTENTION
          ================================================== */}

          <section className="grid grid-cols-1 md:grid-cols-3 gap-3">


            <button
              onClick={() =>
                setActiveTab('outward')
              }
              className="text-left bg-amber-50 border border-amber-200 rounded-2xl p-4 hover:bg-amber-100 transition"
            >

              <div className="flex justify-between">

                <div>

                  <div className="flex items-center gap-2 text-amber-700 text-xs font-black uppercase">

                    <Truck size={14} />

                    Pickup Today

                  </div>

                  <p className="text-2xl font-black mt-2 text-slate-900">

                    {readyForPickupLots}

                  </p>

                  <p className="text-xs text-amber-800 mt-1">

                    Lots ready to leave

                  </p>

                </div>

                <ArrowRight
                  size={18}
                  className="text-amber-600"
                />

              </div>

            </button>


            <button
              onClick={() =>
                setActiveTab('telemetry')
              }
              className="text-left bg-emerald-50 border border-emerald-200 rounded-2xl p-4 hover:bg-emerald-100 transition"
            >

              <div className="flex justify-between">

                <div>

                  <div className="flex items-center gap-2 text-emerald-700 text-xs font-black uppercase">

                    <CheckCircle2 size={14} />

                    Storage Health

                  </div>

                  <p className="text-2xl font-black mt-2">

                    Good

                  </p>

                  <p className="text-xs text-emerald-800 mt-1">

                    All storage areas normal

                  </p>

                </div>

                <CheckCircle2
                  size={19}
                  className="text-emerald-600"
                />

              </div>

            </button>


            <button
              onClick={() =>
                setActiveTab('inventory')
              }
              className="text-left bg-blue-50 border border-blue-200 rounded-2xl p-4 hover:bg-blue-100 transition"
            >

              <div className="flex justify-between">

                <div>

                  <div className="flex items-center gap-2 text-blue-700 text-xs font-black uppercase">

                    <Warehouse size={14} />

                    Space Used

                  </div>

                  <p className="text-2xl font-black mt-2">

                    {totalOccupancyPercent}%

                  </p>

                  <p className="text-xs text-blue-800 mt-1">

                    {totalOccupiedCapacityTons} MT
                    currently stored

                  </p>

                </div>

                <ArrowRight
                  size={18}
                  className="text-blue-600"
                />

              </div>

            </button>

          </section>


          {/* ==================================================
              SIMPLE SUMMARY
          ================================================== */}

          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">


            <div className="bg-white border border-slate-200 rounded-2xl p-4">

              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">

                <Boxes size={15} />

                STORED LOTS

              </div>

              <p className="text-2xl font-black mt-2">

                {lots.length}

              </p>

              <p className="text-xs text-slate-400 mt-1">

                {activeStorageLots} currently in storage

              </p>

            </div>


            <div className="bg-white border border-slate-200 rounded-2xl p-4">

              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold">

                <Warehouse size={15} />

                STORAGE SPACE

              </div>

              <p className="text-2xl font-black mt-2">

                {totalOccupancyPercent}%

              </p>

              <p className="text-xs text-slate-400 mt-1">

                {totalOccupiedCapacityTons} /
                {totalStorageCapacityTons} MT

              </p>

            </div>


            <div className="bg-white border border-slate-200 rounded-2xl p-4">

              <div className="flex items-center gap-2 text-amber-600 text-xs font-bold">

                <Truck size={15} />

                READY FOR PICKUP

              </div>

              <p className="text-2xl font-black mt-2">

                {readyForPickupLots}

              </p>

              <p className="text-xs text-slate-400 mt-1">

                Waiting for transporter

              </p>

            </div>


            <div className="bg-white border border-slate-200 rounded-2xl p-4">

              <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">

                <IndianRupee size={15} />

                STORAGE EARNINGS

              </div>

              <p className="text-2xl font-black mt-2">

                ₹
                {(
                  totalStorageRevenue +
                  48200
                ).toLocaleString('en-IN')}

              </p>

              <p className="text-xs text-slate-400 mt-1">

                Storage charges collected

              </p>

            </div>

          </section>


          {/* ==================================================
              NAVIGATION
          ================================================== */}

          <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 flex flex-wrap gap-1">

            {tabs.map((tab: any) => (

              <button
                key={tab.key}
                type="button"
                onClick={() =>
                  setActiveTab(tab.key)
                }
                className={`flex-1 min-w-[140px] px-4 py-3 text-xs transition-all flex items-center justify-center gap-2 rounded-xl font-black ${activeTab === tab.key
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'text-slate-600 hover:bg-white/60'
                  }`}
              >

                {tab.icon}

                <span>
                  {tab.label}
                </span>

                {tab.count !== undefined && (

                  <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-full text-[10px]">

                    {tab.count}

                  </span>

                )}

              </button>

            ))}

          </div>


          {/* ==================================================
              STORED PRODUCE
          ================================================== */}

          {activeTab === 'inventory' && (

            <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">


              <div>

                <h2 className="text-lg font-black">

                  Stored Produce

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  See what is stored, where it is stored
                  and what needs to leave.

                </p>

              </div>


              {/* FILTERS */}

              <div className="flex flex-col md:flex-row gap-3">

                <div className="flex-1 relative">

                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(
                        e.target.value
                      )
                    }
                    placeholder="Search farmer, crop or lot..."
                    className="w-full h-11 pl-9 pr-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />

                </div>


                <div className="flex gap-2 flex-wrap">

                  {[
                    ['ALL', 'All'],
                    [
                      'ACTIVE_STORAGE',
                      'In Storage',
                    ],
                    [
                      'RELEASE_AUTHORIZED',
                      'Ready for Pickup',
                    ],
                    [
                      'DISPATCHED',
                      'Dispatched',
                    ],
                  ].map(
                    ([value, label]) => (

                      <button
                        key={value}
                        onClick={() =>
                          setStatusFilter(
                            value as any
                          )
                        }
                        className={`px-3 py-2 rounded-xl text-xs font-bold border ${statusFilter === value
                          ? 'bg-blue-700 text-white border-blue-700'
                          : 'bg-white text-slate-600 border-slate-200'
                          }`}
                      >

                        {label}

                      </button>

                    )
                  )}

                </div>

              </div>


              {/* LOT CARDS */}

              {filteredLots.length === 0 ? (

                <div className="border border-dashed border-slate-300 rounded-2xl p-10 text-center">

                  <Boxes
                    size={38}
                    className="mx-auto text-slate-400"
                  />

                  <h3 className="font-black mt-3">

                    No produce found

                  </h3>

                  <p className="text-sm text-slate-500 mt-1">

                    Try another search or receive
                    a new produce lot.

                  </p>

                </div>

              ) : (

                <div className="space-y-3">

                  {filteredLots.map(
                    (lot) => (

                      <div
                        key={lot.id}
                        className="border border-slate-200 rounded-2xl p-4 hover:border-blue-300 transition"
                      >

                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">


                          {/* BASIC INFO */}

                          <div className="flex-1">

                            <div className="flex flex-wrap items-center gap-2">

                              <span className="font-mono font-black text-sm">

                                {lot.lotNumber}

                              </span>

                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black ${lot.tradeStatus ===
                                  'RELEASE_AUTHORIZED'
                                  ? 'bg-amber-100 text-amber-800'
                                  : lot.tradeStatus ===
                                    'DISPATCHED'
                                    ? 'bg-slate-100 text-slate-700'
                                    : 'bg-blue-100 text-blue-800'
                                  }`}
                              >

                                {lot.tradeStatus ===
                                  'RELEASE_AUTHORIZED'
                                  ? 'READY FOR PICKUP'
                                  : lot.tradeStatus ===
                                    'DISPATCHED'
                                    ? 'DISPATCHED'
                                    : 'IN STORAGE'}

                              </span>

                            </div>


                            <h3 className="font-black text-base mt-1">

                              {lot.commodity}

                            </h3>


                            <p className="text-xs text-slate-500">

                              {lot.variety} •
                              {lot.weightTons} MT

                            </p>


                            <p className="text-xs text-slate-500 mt-1">

                              Farmer:
                              <strong className="text-slate-800 ml-1">

                                {lot.farmerName}

                              </strong>

                            </p>

                          </div>


                          {/* LOCATION */}

                          <div className="min-w-[170px]">

                            <p className="text-[10px] font-bold text-slate-400 uppercase">

                              Storage

                            </p>

                            <p className="text-sm font-bold mt-1">

                              {lot.bayLocation}

                            </p>

                            <p className="text-xs text-slate-500">

                              {lot.temperatureCelcius}°C •
                              {lot.humidityPercent}% humidity

                            </p>

                          </div>


                          {/* DAYS */}

                          <div>

                            <p className="text-[10px] font-bold text-slate-400 uppercase">

                              Stored For

                            </p>

                            <p className="text-sm font-black mt-1">

                              {lot.daysStored} days

                            </p>

                            <p className="text-xs text-slate-500">

                              ₹
                              {lot.accruedStorageFeeInr.toFixed(
                                2
                              )}{' '}
                              storage fee

                            </p>

                          </div>


                          {/* ACTIONS */}

                          <div className="flex flex-col items-stretch gap-2">

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setSelectedLotForReceipt(
                                  lot
                                )
                              }
                              className="rounded-xl text-xs font-bold"
                            >

                              <FileText
                                size={13}
                              />

                              Receipt

                            </Button>


                            {lot.tradeStatus ===
                              'RELEASE_AUTHORIZED' && (

                                <Button
                                  size="sm"
                                  onClick={() => {

                                    setSelectedLotForOutward(
                                      lot
                                    );

                                    setOutwardVehicleInput(
                                      lot.transporterVehicle ||
                                      ''
                                    );

                                  }}
                                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold"
                                >

                                  <Truck
                                    size={13}
                                  />

                                  Dispatch

                                </Button>

                              )}

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>

          )}


          {/* ==================================================
              RECEIVE PRODUCE
          ================================================== */}

          {activeTab === 'inward' && (

            <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 max-w-3xl mx-auto">

              <div className="border-b border-slate-100 pb-5 mb-5">

                <h2 className="text-xl font-black">

                  Receive Farmer Produce

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  Record the farmer, crop, quantity and
                  storage location.

                </p>

              </div>


              <form
                onSubmit={
                  handleCreateInwardLot
                }
                className="space-y-5"
              >


                {/* FARMER */}

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">

                  <h3 className="text-xs font-black uppercase text-slate-600 mb-3">

                    1. Farmer Details

                  </h3>


                  <div className="grid sm:grid-cols-2 gap-3">

                    <div>

                      <label className="text-xs font-bold text-slate-500">

                        Farmer Name

                      </label>

                      <input
                        required
                        value={
                          inwardFarmerName
                        }
                        onChange={(e) =>
                          setInwardFarmerName(
                            e.target.value
                          )
                        }
                        className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200"
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
                        onChange={(e) =>
                          setInwardPhone(
                            e.target.value
                          )
                        }
                        className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200"
                        placeholder="Enter mobile number"
                      />

                    </div>

                  </div>


                  <div className="mt-3">

                    <label className="text-xs font-bold text-slate-500">

                      FPO Name

                    </label>

                    <input
                      value={inwardFpo}
                      onChange={(e) =>
                        setInwardFpo(
                          e.target.value
                        )
                      }
                      className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200"
                      placeholder="Enter FPO name"
                    />

                  </div>

                </div>


                {/* PRODUCE */}

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">

                  <h3 className="text-xs font-black uppercase text-slate-600 mb-3">

                    2. Produce Details

                  </h3>


                  <div className="grid sm:grid-cols-2 gap-3">

                    <div>

                      <label className="text-xs font-bold text-slate-500">

                        Crop

                      </label>

                      <select
                        value={
                          inwardCommodity
                        }
                        onChange={(e) =>
                          setInwardCommodity(
                            e.target.value
                          )
                        }
                        className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-white"
                      >

                        <option value="Banana">
                          🍌 Banana
                        </option>

                        <option value="Nashik Red Onion">
                          🧅 Onion
                        </option>

                        <option value="Tomato">
                          🍅 Tomato
                        </option>

                        <option value="Wheat">
                          🌾 Wheat
                        </option>

                        <option value="Rice">
                          🌾 Rice
                        </option>

                      </select>

                    </div>


                    <div>

                      <label className="text-xs font-bold text-slate-500">

                        Variety

                      </label>

                      <input
                        required
                        value={
                          inwardVariety
                        }
                        onChange={(e) =>
                          setInwardVariety(
                            e.target.value
                          )
                        }
                        className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200"
                      />

                    </div>

                  </div>


                  <div className="grid sm:grid-cols-2 gap-3 mt-3">

                    <div>

                      <label className="text-xs font-bold text-slate-500">

                        Quantity (MT)

                      </label>

                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        required
                        value={
                          inwardWeightTons
                        }
                        onChange={(e) =>
                          setInwardWeightTons(
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                      />

                    </div>


                    <div>

                      <label className="text-xs font-bold text-slate-500">

                        Storage Area

                      </label>

                      <select
                        value={inwardBay}
                        onChange={(e) =>
                          setInwardBay(
                            e.target.value
                          )
                        }
                        className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-white"
                      >

                        <option>
                          Cold Bay A-1
                        </option>

                        <option>
                          Cold Bay A-2
                        </option>

                        <option>
                          Dry Grain Silo B-1
                        </option>

                        <option>
                          Controlled Storage C-1
                        </option>

                      </select>

                    </div>

                  </div>

                </div>


                {/* CONFIRM */}

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">

                  <div className="flex gap-3">

                    <ShieldCheck
                      className="text-blue-700 shrink-0"
                      size={20}
                    />

                    <div>

                      <p className="text-sm font-black text-blue-950">

                        Digital warehouse receipt

                      </p>

                      <p className="text-xs text-blue-800 mt-1">

                        A digital receipt will be created
                        after the produce is received.

                      </p>

                    </div>

                  </div>

                </div>


                <Button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black h-12 rounded-xl"
                >

                  <PackageCheck size={17} />

                  Confirm & Receive Produce

                </Button>

              </form>

            </section>

          )}


          {/* ==================================================
              DISPATCH
          ================================================== */}

          {activeTab === 'outward' && (

            <section className="space-y-5">

              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7">

                <h2 className="text-xl font-black">

                  Produce Ready for Pickup

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  Verify the transporter before allowing
                  produce to leave the warehouse.

                </p>

              </div>


              {readyForPickupLots === 0 ? (

                <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center">

                  <Truck
                    size={40}
                    className="mx-auto text-slate-400"
                  />

                  <h3 className="font-black mt-3">

                    No pickups waiting

                  </h3>

                  <p className="text-sm text-slate-500 mt-1">

                    Sold produce will appear here when
                    the buyer authorizes pickup.

                  </p>

                </div>

              ) : (

                <div className="grid md:grid-cols-2 gap-4">

                  {lots
                    .filter(
                      lot =>
                        lot.tradeStatus ===
                        'RELEASE_AUTHORIZED'
                    )
                    .map(lot => (

                      <div
                        key={lot.id}
                        className="bg-white border-2 border-amber-200 rounded-2xl p-5"
                      >

                        <div className="flex justify-between gap-3">

                          <div>

                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-lg font-black">

                              {lot.lotNumber}

                            </span>

                            <h3 className="font-black mt-2">

                              {lot.commodity}

                            </h3>

                            <p className="text-sm text-slate-500">

                              {lot.weightTons} MT •
                              {lot.farmerName}

                            </p>

                          </div>

                          <Clock3
                            size={20}
                            className="text-amber-600"
                          />

                        </div>


                        <div className="bg-slate-50 rounded-xl p-3 mt-4 text-xs space-y-2">

                          <div className="flex justify-between">

                            <span className="text-slate-500">
                              Buyer
                            </span>

                            <strong>
                              {lot.buyerName}
                            </strong>

                          </div>


                          <div className="flex justify-between">

                            <span className="text-slate-500">
                              Vehicle
                            </span>

                            <strong className="font-mono">
                              {lot.transporterVehicle}
                            </strong>

                          </div>


                          <div className="flex justify-between">

                            <span className="text-slate-500">
                              Storage
                            </span>

                            <strong>
                              {lot.bayLocation}
                            </strong>

                          </div>

                        </div>


                        <Button
                          onClick={() => {

                            setSelectedLotForOutward(
                              lot
                            );

                            setOutwardVehicleInput(
                              lot.transporterVehicle ||
                              ''
                            );

                          }}
                          className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl"
                        >

                          <Truck size={15} />

                          Verify Pickup & Dispatch

                        </Button>

                      </div>

                    ))}

                </div>

              )}

            </section>

          )}


          {/* ==================================================
              STORAGE CONDITIONS
          ================================================== */}

          {activeTab === 'telemetry' && (

            <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">

                <div>

                  <h2 className="text-xl font-black">

                    Storage Conditions

                  </h2>

                  <p className="text-sm text-slate-500 mt-1">

                    Check temperature, humidity and
                    available space.

                  </p>

                </div>


                <span className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-black">

                  <span className="w-2 h-2 rounded-full bg-emerald-500" />

                  All Areas Normal

                </span>

              </div>


              <div className="grid md:grid-cols-2 gap-4">

                {climateBays.map(
                  bay => {

                    const occupancy =
                      Math.round(
                        (
                          bay.occupiedTons /
                          bay.capacityTons
                        ) * 100
                      );

                    return (

                      <div
                        key={bay.id}
                        className="border border-slate-200 rounded-2xl p-5"
                      >

                        <div className="flex justify-between gap-3">

                          <div>

                            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-1 rounded-lg font-black">

                              {bay.id}

                            </span>

                            <h3 className="font-black mt-2">

                              {bay.name}

                            </h3>

                          </div>


                          <CheckCircle2
                            size={19}
                            className="text-emerald-500"
                          />

                        </div>


                        <div className="grid grid-cols-2 gap-3 mt-4">

                          <div className="bg-blue-50 rounded-xl p-3">

                            <div className="flex items-center gap-1 text-xs text-blue-700 font-bold">

                              <Thermometer
                                size={13}
                              />

                              Temperature

                            </div>

                            <p className="text-xl font-black mt-1">

                              {bay.temp}°C

                            </p>

                            <p className="text-[10px] text-slate-500">

                              Target {bay.targetTemp}°C

                            </p>

                          </div>


                          <div className="bg-teal-50 rounded-xl p-3">

                            <div className="flex items-center gap-1 text-xs text-teal-700 font-bold">

                              <Droplets
                                size={13}
                              />

                              Humidity

                            </div>

                            <p className="text-xl font-black mt-1">

                              {bay.humidity}%

                            </p>

                            <p className="text-[10px] text-slate-500">

                              Target {bay.targetHumidity}%

                            </p>

                          </div>

                        </div>


                        <div className="mt-4">

                          <div className="flex justify-between text-xs font-bold">

                            <span className="text-slate-500">
                              Space used
                            </span>

                            <span>
                              {bay.occupiedTons} /
                              {bay.capacityTons} MT
                            </span>

                          </div>


                          <div className="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">

                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{
                                width:
                                  `${occupancy}%`,
                              }}
                            />

                          </div>

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            </section>

          )}


          {/* ==================================================
              PAYMENTS
          ================================================== */}

          {activeTab === 'ledger' && (

            <section className="space-y-5">

              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">

                    <IndianRupee size={21} />

                  </div>

                  <div>

                    <h2 className="text-xl font-black">

                      Storage Payments

                    </h2>

                    <p className="text-sm text-slate-500">

                      Track storage charges and payments.

                    </p>

                  </div>

                </div>


                <div className="grid sm:grid-cols-3 gap-3 mt-5">

                  <div className="bg-slate-50 rounded-2xl p-4">

                    <p className="text-xs font-bold text-slate-500">

                      TOTAL EARNED

                    </p>

                    <p className="text-2xl font-black mt-1">

                      ₹1,48,650

                    </p>

                    <p className="text-xs text-emerald-600 mt-1 font-bold">

                      Payments received

                    </p>

                  </div>


                  <div className="bg-slate-50 rounded-2xl p-4">

                    <p className="text-xs font-bold text-slate-500">

                      PENDING

                    </p>

                    <p className="text-2xl font-black mt-1">

                      ₹
                      {totalStorageRevenue.toFixed(
                        0
                      )}

                    </p>

                    <p className="text-xs text-blue-600 mt-1 font-bold">

                      Waiting for dispatch

                    </p>

                  </div>


                  <div className="bg-slate-50 rounded-2xl p-4">

                    <p className="text-xs font-bold text-slate-500">

                      DISPATCHED

                    </p>

                    <p className="text-2xl font-black mt-1">

                      {dispatchedLots}

                    </p>

                    <p className="text-xs text-slate-500 mt-1">

                      Lots completed

                    </p>

                  </div>

                </div>

              </div>

            </section>

          )}


          {/* ==================================================
              RECEIPT MODAL
          ================================================== */}

          {selectedLotForReceipt && (

            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">

              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">

                <div className="flex justify-between items-start border-b border-slate-100 pb-4">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">

                      <FileText size={20} />

                    </div>

                    <div>

                      <h3 className="font-black">

                        Warehouse Receipt

                      </h3>

                      <p className="text-[10px] text-slate-500 font-mono">

                        {selectedLotForReceipt.enwrNumber}

                      </p>

                    </div>

                  </div>


                  <button
                    onClick={() =>
                      setSelectedLotForReceipt(
                        null
                      )
                    }
                    className="text-slate-400 hover:text-slate-800"
                  >

                    <X size={18} />

                  </button>

                </div>


                <div className="bg-slate-50 rounded-2xl p-4 mt-5 space-y-4 text-sm">

                  <div className="grid grid-cols-2 gap-4">

                    <div>

                      <p className="text-xs text-slate-400">
                        Farmer
                      </p>

                      <p className="font-bold">
                        {
                          selectedLotForReceipt
                            .farmerName
                        }
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-400">
                        Lot
                      </p>

                      <p className="font-bold">
                        {
                          selectedLotForReceipt
                            .lotNumber
                        }
                      </p>

                    </div>

                  </div>


                  <div className="grid grid-cols-2 gap-4">

                    <div>

                      <p className="text-xs text-slate-400">
                        Produce
                      </p>

                      <p className="font-bold">
                        {
                          selectedLotForReceipt
                            .commodity
                        }
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-400">
                        Quantity
                      </p>

                      <p className="font-bold">
                        {
                          selectedLotForReceipt
                            .weightTons
                        }{' '}
                        MT
                      </p>

                    </div>

                  </div>


                  <div className="grid grid-cols-2 gap-4">

                    <div>

                      <p className="text-xs text-slate-400">
                        Storage Area
                      </p>

                      <p className="font-bold">
                        {
                          selectedLotForReceipt
                            .bayLocation
                        }
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-400">
                        Quality
                      </p>

                      <p className="font-bold text-emerald-700">
                        {
                          selectedLotForReceipt
                            .qualityGrade
                        }
                      </p>

                    </div>

                  </div>

                </div>


                <Button
                  onClick={() =>
                    setSelectedLotForReceipt(
                      null
                    )
                  }
                  className="w-full mt-5 bg-blue-700 hover:bg-blue-800 rounded-xl"
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

              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">

                <div className="flex justify-between items-start border-b border-slate-100 pb-4">

                  <div>

                    <h3 className="font-black">

                      Confirm Pickup

                    </h3>

                    <p className="text-xs text-slate-500 mt-1">

                      {selectedLotForOutward.lotNumber}
                      {' • '}
                      {selectedLotForOutward.commodity}

                    </p>

                  </div>


                  <button
                    onClick={() =>
                      setSelectedLotForOutward(
                        null
                      )
                    }
                    className="text-slate-400 hover:text-slate-800"
                  >

                    <X size={18} />

                  </button>

                </div>


                <form
                  onSubmit={
                    handleVerifyOutwardHandshake
                  }
                  className="space-y-4 mt-5"
                >


                  <div>

                    <label className="text-xs font-bold text-slate-500">

                      Vehicle Number

                    </label>

                    <input
                      required
                      value={
                        outwardVehicleInput
                      }
                      onChange={(e) =>
                        setOutwardVehicleInput(
                          e.target.value
                        )
                      }
                      className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                    />

                  </div>


                  <div>

                    <label className="text-xs font-bold text-slate-500">

                      Driver Name

                    </label>

                    <input
                      required
                      value={
                        outwardDriverName
                      }
                      onChange={(e) =>
                        setOutwardDriverName(
                          e.target.value
                        )
                      }
                      className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200"
                    />

                  </div>


                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">

                    <label className="text-xs font-black text-amber-900">

                      Pickup Code

                    </label>

                    <input
                      required
                      maxLength={4}
                      value={
                        outwardOtpInput
                      }
                      onChange={(e) =>
                        setOutwardOtpInput(
                          e.target.value
                        )
                      }
                      placeholder="Enter 4-digit code"
                      className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-amber-300 text-center text-xl font-mono font-black tracking-[0.4em]"
                    />

                    <p className="text-[10px] text-amber-800 mt-2">

                      Demo code:
                      {' '}
                      <strong>
                        {
                          selectedLotForOutward
                            .pickupOtp ||
                          '4821'
                        }
                      </strong>

                    </p>

                  </div>


                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black h-11 rounded-xl"
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

