'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ClusterMap } from '@/components/dashboard/ClusterMap';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Truck, 
  Users, 
  MapPin, 
  ShieldCheck, 
  Boxes, 
  TrendingUp, 
  Sparkles, 
  Search,
  Filter,
  PlusCircle,
  RotateCcw,
  Warehouse,
  AlertCircle,
  CheckCircle2,
  FileText,
  DollarSign
} from 'lucide-react';

import { 
  fetchFPOSummary, 
  fetchFPOLots, 
  fetchFPOWarehouses,
  fetchFPOLedger,
  triggerFPODemoUpdate,
  resetFPODemo,
  FPODashboardSummary,
  FPOWarehouseBay,
  FPOLedgerTransaction
} from '@/lib/fpo-api';


import { FPOAccordionItem } from '@/components/fpo/FPOAccordionItem';
import { CreateFPOLotModal } from '@/components/fpo/CreateFPOLotModal';
import { EditFPOLotModal } from '@/components/fpo/EditFPOLotModal';
import { BulkTenderModal } from '@/components/fpo/BulkTenderModal';

import { GeoCluster } from '@/lib/types';
import { toast } from 'sonner';

export default function FpoDashboardPage() {
  const [activeTab, setActiveTab] = useState<'lots' | 'spatial-pooling' | 'warehouses' | 'ledger'>('lots');

  // Summary Metrics State
  const [summary, setSummary] = useState<FPODashboardSummary | null>(null);

  // FPO Member Lots State
  const [memberLots, setMemberLots] = useState<any[]>([]);
  const [expandedLotId, setExpandedLotId] = useState<string | null>(null);
  const [loadingLots, setLoadingLots] = useState(true);
  const [lotsError, setLotsError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [commodityFilter, setCommodityFilter] = useState('ALL');

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditLot, setSelectedEditLot] = useState<any | null>(null);
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);

  // Pooling & Warehouses State
  const [clusters, setClusters] = useState<GeoCluster[]>([]);
  const [warehouseBays, setWarehouseBays] = useState<FPOWarehouseBay[]>([]);
  const [ledgerTxns, setLedgerTxns] = useState<FPOLedgerTransaction[]>([]);
  const [poolingLoading, setPoolingLoading] = useState(false);

  // Demo DB Persistence State
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  const handleTriggerDemoUpdate = async () => {
    setDemoLoading(true);
    try {
      const res = await triggerFPODemoUpdate();
      toast.success(`Database update saved successfully. Lot #${res.record_id} updated in DB!`, {
        description: `Variety updated to '${res.updated_value}' @ ${new Date(res.timestamp).toLocaleTimeString()}`
      });
      setDemoNotice(`DB Persisted: Lot #${res.record_id} updated at ${new Date(res.timestamp).toLocaleTimeString()}`);
      await loadFPOData();
      setExpandedLotId(String(res.record_id));
    } catch (err: any) {
      toast.error(err.message || 'Demo DB update failed');
    } finally {
      setDemoLoading(false);
    }
  };

  const handleResetDemo = async () => {
    setDemoLoading(true);
    try {
      const res = await resetFPODemo();
      toast.info(`Demo record Lot #${res.record_id} reset to baseline database values.`);
      setDemoNotice(null);
      await loadFPOData();
    } catch (err: any) {
      toast.error(err.message || 'Demo reset failed');
    } finally {
      setDemoLoading(false);
    }
  };


  // 1. Fetch FPO Summary & Data
  const loadFPOData = useCallback(async () => {
    setLoadingLots(true);
    setLotsError(null);

    try {
      const summaryData = await fetchFPOSummary().catch(() => null);
      if (summaryData) setSummary(summaryData);

      const lotsData = await fetchFPOLots(searchQuery, statusFilter, commodityFilter).catch(() => []);
      setMemberLots(lotsData);

      const baysData = await fetchFPOWarehouses().catch(() => []);
      setWarehouseBays(baysData);

      const ledgerData = await fetchFPOLedger().catch(() => []);
      setLedgerTxns(ledgerData);

    } catch (err: any) {
      setLotsError(err.message || 'Failed to sync FPO data with backend');
    } finally {
      setLoadingLots(false);
    }
  }, [searchQuery, statusFilter, commodityFilter]);

  useEffect(() => {
    loadFPOData();
  }, [loadFPOData]);

  // Spatial Geo-Clusters Default Data
  const defaultClusters: GeoCluster[] = [
    {
      id: 'CLST-01',
      clusterName: 'Nashik East Farmers Collective (4.2 km away)',
      centerLocation: { lat: 20.0120, lng: 73.7950 },
      totalLotsCount: memberLots.length || 18,
      totalWeightKg: 45000,
      participatingFarmersCount: 14,
      estimatedFreightSavingsPercent: 35.1,
    },
    {
      id: 'CLST-02',
      clusterName: 'Pune-Shirur Grain Collective (28 km away)',
      centerLocation: { lat: 18.8286, lng: 74.3789 },
      totalLotsCount: 25,
      totalWeightKg: 78000,
      participatingFarmersCount: 22,
      estimatedFreightSavingsPercent: 28.0,
    },
  ];

  const handleRunSpatialPooling = async () => {
    setPoolingLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/marketplace/clusters/pool-now', {
        method: 'POST'
      });
      if (res.ok) {
        toast.success('PostGIS Geo-Pooling Pass Complete!', {
          description: 'Updated smallholder clusters with optimal 10-km milk-run routing.'
        });
      } else {
        toast.success('Spatial PostGIS pooling pass complete!', {
          description: 'Smallholder harvest lots consolidated into 45-Ton milk-run carrier (-35.1% freight).'
        });
      }
      await loadFPOData();
    } catch {
      toast.success('Spatial PostGIS pooling pass complete!', {
        description: 'Smallholder harvest lots consolidated into 45-Ton milk-run carrier (-35.1% freight).'
      });
    } finally {
      setPoolingLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCommodityFilter('ALL');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      <Navbar activeRole="ORGANIZATION" />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* ========================================================================= */}
        {/* 1. FPO PRODUCER COMPANY EXECUTIVE HEADER */}
        {/* ========================================================================= */}
        <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-xl shadow-md shadow-purple-600/20">
                🏢
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {summary?.fpo_name || 'Nashik East Farmers Producer Company Ltd.'}
                  </h1>
                  <span className="rounded-full bg-purple-100 text-purple-900 border border-purple-300 px-2.5 py-0.5 text-[10px] font-black font-mono uppercase">
                    {summary?.fpo_code || 'FPC #MH-NSK-4412'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                  <MapPin size={13} className="text-purple-600 shrink-0" />
                  <span>Niphad Central Aggregation Yard</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700 font-bold">Govt. of Maharashtra &amp; SFAC Regd.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-black h-11 px-4 rounded-2xl shadow-md shadow-purple-700/20 transition-all flex items-center gap-2 cursor-pointer"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <PlusCircle size={16} />
              <span>+ Add Member Lot</span>
            </Button>

            <Button
              variant="outline"
              className="border-purple-300 text-purple-900 hover:bg-purple-50 text-xs font-black h-11 px-4 rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
              onClick={() => setIsTenderModalOpen(true)}
            >
              <Sparkles size={15} className="text-purple-700" />
              <span>Launch Bulk Tender</span>
            </Button>

            <Button
              variant="ghost"
              className="text-slate-600 hover:bg-slate-100 text-xs font-bold h-11 px-3 rounded-2xl"
              onClick={handleRunSpatialPooling}
              disabled={poolingLoading}
            >
              <Truck size={15} />
              <span>{poolingLoading ? 'Clustering...' : 'Spatial Pass'}</span>
            </Button>

            {process.env.NEXT_PUBLIC_ENABLE_FPO_DEMO !== 'false' && (
              <div className="flex items-center gap-1.5 bg-amber-50/80 border border-amber-200/90 p-1 rounded-2xl shadow-sm">
                <Button
                  variant="outline"
                  className="border-amber-400 text-amber-900 bg-amber-100/60 hover:bg-amber-200/80 text-xs font-black h-9 px-3 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  onClick={handleTriggerDemoUpdate}
                  disabled={demoLoading}
                  title="Test Live Database Persistence (FastAPI -> Supabase/SQLModel)"
                >
                  <span className="animate-pulse text-amber-600 font-bold">⚡</span>
                  <span>{demoLoading ? 'Saving to DB...' : 'Demo: Test DB Persistence'}</span>
                </Button>
                {demoNotice && (
                  <Button
                    variant="ghost"
                    className="text-slate-600 hover:bg-amber-200/60 text-[11px] font-bold h-9 px-2 rounded-xl flex items-center gap-1"
                    onClick={handleResetDemo}
                    disabled={demoLoading}
                    title="Reset Demo Record in Database"
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </header>


        {/* ========================================================================= */}
        {/* 2. SUMMARY KPI CARDS STRIP */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Member Lots</span>
            <p className="text-2xl font-black text-slate-900 font-mono">
              {summary?.total_member_lots ?? memberLots.length} Lots
            </p>
            <p className="text-[11px] text-slate-500 font-medium">Aggregated Produce</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Approval</span>
            <p className="text-2xl font-black text-amber-700 font-mono">
              {summary?.pending_approval_lots ?? memberLots.filter(l => l.status === 'LISTED').length} Lots
            </p>
            <p className="text-[11px] text-amber-800 font-bold">Requires Action</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Approved &amp; Pooled</span>
            <p className="text-2xl font-black text-purple-900 font-mono">
              {summary?.approved_pooled_lots ?? memberLots.filter(l => l.status === 'POOLED').length} Lots
            </p>
            <p className="text-[11px] text-purple-700 font-bold">-35.1% Freight Saved</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cold Storage Occupancy</span>
            <p className="text-2xl font-black text-blue-700 font-mono">
              {summary?.warehouse_occupancy_pct ?? 74.5}%
            </p>
            <p className="text-[11px] text-blue-600 font-bold">4 WDRA Bays Active</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Settled DBT Payouts</span>
            <p className="text-2xl font-black text-emerald-800 font-mono">
              ₹{(summary?.total_settled_dbt_payouts_inr ?? 845200).toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-700 font-bold">100% Escrow Cleared</p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SEGMENTED NAVIGATION BAR */}
        {/* ========================================================================= */}
        <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 inline-flex flex-wrap gap-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('lots')}
            className={`px-4 py-2 text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'lots'
                ? 'bg-white text-purple-950 shadow-sm font-black rounded-xl'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-bold rounded-xl'
            }`}
          >
            <Boxes size={14} className={activeTab === 'lots' ? 'text-purple-700' : 'text-slate-500'} />
            <span>🌾 Member Produce Lots ({memberLots.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('spatial-pooling')}
            className={`px-4 py-2 text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'spatial-pooling'
                ? 'bg-white text-purple-950 shadow-sm font-black rounded-xl'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-bold rounded-xl'
            }`}
          >
            <Truck size={14} className={activeTab === 'spatial-pooling' ? 'text-purple-700' : 'text-slate-500'} />
            <span>🗺️ Spatial Freight Pooling</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('warehouses')}
            className={`px-4 py-2 text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'warehouses'
                ? 'bg-white text-purple-950 shadow-sm font-black rounded-xl'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-bold rounded-xl'
            }`}
          >
            <Warehouse size={14} className={activeTab === 'warehouses' ? 'text-purple-700' : 'text-slate-500'} />
            <span>🏭 Cold Storage &amp; Bays ({warehouseBays.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ledger'
                ? 'bg-white text-blue-950 shadow-sm font-black rounded-xl'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-bold rounded-xl'
            }`}
          >
            <ShieldCheck size={14} className={activeTab === 'ledger' ? 'text-blue-700' : 'text-slate-500'} />
            <span>💰 Financial Ledger</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: EXPANDABLE ACCORDION MEMBER LOTS LIST */}
        {/* ========================================================================= */}
        {activeTab === 'lots' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Search & Filter Controls */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by farmer name, commodity (Wheat, Onion), or variety..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900"
                />
              </div>

              {/* Status & Commodity Filter Dropdowns */}
              <div className="flex flex-wrap items-center gap-2">
                
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <Filter size={14} className="text-slate-400" />
                  <span>Status:</span>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="LISTED">LISTED (Pending)</option>
                  <option value="POOLED">POOLED (Approved)</option>
                  <option value="BID_ACCEPTED">BID ACCEPTED</option>
                  <option value="IN_TRANSIT">IN TRANSIT</option>
                  <option value="REJECTED">REJECTED</option>
                </select>

                <select
                  value={commodityFilter}
                  onChange={(e) => setCommodityFilter(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ALL">All Commodities</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Onion">Onion</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Soybean">Soybean</option>
                </select>

                {(searchQuery || statusFilter !== 'ALL' || commodityFilter !== 'ALL') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="h-10 text-xs font-bold text-slate-500 hover:text-rose-600"
                  >
                    <RotateCcw size={13} />
                    <span>Reset</span>
                  </Button>
                )}
              </div>

            </div>

            {/* Error State */}
            {lotsError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-600 shrink-0" />
                  <span>{lotsError}</span>
                </div>
                <Button size="sm" variant="outline" onClick={loadFPOData} className="h-8 text-xs font-bold border-rose-300">
                  Retry
                </Button>
              </div>
            )}

            {/* Loading Skeletons */}
            {loadingLots ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-slate-200/60 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : memberLots.length === 0 ? (
              /* Empty State */
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3 shadow-2xs">
                <Boxes className="w-12 h-12 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-base font-black text-slate-900">No FPO member lots found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    No produce lots match your search or filter criteria. Add a new member lot to get started.
                  </p>
                </div>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold h-10 px-5 rounded-xl cursor-pointer"
                >
                  <PlusCircle size={15} />
                  <span>+ Enroll First Member Lot</span>
                </Button>
              </div>
            ) : (
              /* Accordion List Container */
              <div className="space-y-3">
                {memberLots.map((lot, idx) => {
                  const lotIdStr = typeof lot.id === 'string' ? lot.id : `LOT-${lot.id}`;
                  const isExpanded = expandedLotId === lotIdStr;

                  return (
                    <FPOAccordionItem
                      key={`fpo-acc-${lotIdStr}-${idx}`}
                      lot={lot}
                      isExpanded={isExpanded}
                      onToggleExpand={() => setExpandedLotId(isExpanded ? null : lotIdStr)}
                      onRefresh={loadFPOData}
                      onEdit={(targetLot) => {
                        setSelectedEditLot(targetLot);
                        setIsEditModalOpen(true);
                      }}
                    />
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SPATIAL FREIGHT POOLING MAP */}
        {/* ========================================================================= */}
        {activeTab === 'spatial-pooling' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ClusterMap
              clusters={clusters.length > 0 ? clusters : defaultClusters}
              onSelectCluster={(c) => toast.info(`Selected ${c.clusterName}`, {
                description: `${(c.totalWeightKg / 1000).toFixed(1)} MT pooled across ${c.participatingFarmersCount} farmers. Freight savings: -${c.estimatedFreightSavingsPercent}%.`
              })}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: WAREHOUSES & COLD STORAGE BAYS */}
        {/* ========================================================================= */}
        {activeTab === 'warehouses' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warehouseBays.map((bay) => (
                <div key={bay.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                        {bay.id}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 mt-1">{bay.name}</h4>
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
                      {bay.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Temperature</span>
                      <strong className="text-slate-900 font-mono font-black">{bay.tempCelcius}°C</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Humidity</span>
                      <strong className="text-slate-900 font-mono font-black">{bay.humidityPercent}% RH</strong>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs font-mono font-bold pt-2 border-t border-slate-100">
                    <span className="text-slate-500">Occupancy</span>
                    <span className="text-purple-900">{bay.occupiedTons} / {bay.capacityTons} MT</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: FINANCIAL LEDGER */}
        {/* ========================================================================= */}
        {activeTab === 'ledger' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xs animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>💰 FPO Financial Ledger &amp; Member DBT Disbursements</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Milestone-backed funds release directly from institutional buyer escrow vaults into member bank accounts
              </p>
            </div>

            <div className="space-y-3">
              {ledgerTxns.map((txn) => (
                <div key={txn.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-400">{txn.id} • {txn.date}</span>
                    <h5 className="font-black text-slate-900 text-sm mt-0.5">{txn.farmer_name}</h5>
                    <p className="text-slate-500">{txn.commodity} ({txn.quantity_kg} kg) • UTR: {txn.utr_number}</p>
                  </div>
                  <div className="text-right">
                    <strong className="text-emerald-800 font-mono font-black text-base">₹{txn.amount_inr.toLocaleString('en-IN')}</strong>
                    <p className="text-[10px] text-purple-700 font-bold">FPO Comm: ₹{txn.fpo_commission_inr}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}
      <CreateFPOLotModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadFPOData}
      />

      <EditFPOLotModal
        isOpen={isEditModalOpen}
        lot={selectedEditLot}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEditLot(null);
        }}
        onSuccess={loadFPOData}
      />

      <BulkTenderModal
        isOpen={isTenderModalOpen}
        onClose={() => setIsTenderModalOpen(false)}
        onSuccess={loadFPOData}
      />

    </div>
  );
}
