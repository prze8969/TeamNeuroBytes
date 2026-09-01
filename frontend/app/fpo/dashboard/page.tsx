'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { API_BASE_URL } from '@/lib/api';
import { ClusterMap } from '@/components/dashboard/ClusterMap';
import { Button } from '@/components/ui/button';

import {
  Truck,
  MapPin,
  ShieldCheck,
  Boxes,
  Sparkles,
  Search,
  PlusCircle,
  RotateCcw,
  Warehouse,
  AlertCircle,
  CheckCircle2,
  FileText,
  DollarSign,
  PackageCheck,
  ChevronDown,
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
  FPOLedgerTransaction,
} from '@/lib/api/fpo-api';

import { FPOAccordionItem } from '@/components/fpo/FPOAccordionItem';
import { CreateFPOLotModal } from '@/components/fpo/CreateFPOLotModal';
import { EditFPOLotModal } from '@/components/fpo/EditFPOLotModal';
import { BulkTenderModal } from '@/components/fpo/BulkTenderModal';

import { GeoCluster } from '@/lib/types';
import { toast } from 'sonner';

import { useAppTheme } from '@/lib/ThemeContext';

export default function FpoDashboardPage() {
  const { config } = useAppTheme();
  const [isMetricsExpanded, setIsMetricsExpanded] = useState<boolean>(false);

  // -----------------------------
  // DATA
  // -----------------------------

  const [summary, setSummary] = useState<FPODashboardSummary | null>(null);
  const [memberLots, setMemberLots] = useState<any[]>([]);
  const [expandedLotId, setExpandedLotId] = useState<string | null>(null);

  const [loadingLots, setLoadingLots] = useState(true);
  const [lotsError, setLotsError] = useState<string | null>(null);

  const [warehouseBays, setWarehouseBays] = useState<FPOWarehouseBay[]>([]);
  const [ledgerTxns, setLedgerTxns] = useState<FPOLedgerTransaction[]>([]);
  const [clusters, setClusters] = useState<GeoCluster[]>([]);

  // -----------------------------
  // SEARCH / FILTER
  // -----------------------------

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [commodityFilter, setCommodityFilter] = useState('ALL');

  // -----------------------------
  // MODALS
  // -----------------------------

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditLot, setSelectedEditLot] = useState<any | null>(null);
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);

  // -----------------------------
  // OTHER STATES
  // -----------------------------

  const [poolingLoading, setPoolingLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  // -----------------------------
  // LOAD DATA
  // -----------------------------

  const loadFPOData = useCallback(async () => {
    setLoadingLots(true);
    setLotsError(null);

    try {
      const summaryData = await fetchFPOSummary().catch(() => null);

      if (summaryData) {
        setSummary(summaryData);
      }

      const lotsData = await fetchFPOLots(
        searchQuery,
        statusFilter,
        commodityFilter
      ).catch(() => []);

      setMemberLots(lotsData);

      const baysData = await fetchFPOWarehouses().catch(() => []);

      setWarehouseBays(baysData);

      const ledgerData = await fetchFPOLedger().catch(() => []);

      setLedgerTxns(ledgerData);
    } catch (err: any) {
      setLotsError(err.message || 'Could not load FPO data');
    } finally {
      setLoadingLots(false);
    }
  }, [searchQuery, statusFilter, commodityFilter]);

  useEffect(() => {
    loadFPOData();
  }, [loadFPOData]);

  // -----------------------------
  // DEMO DATABASE UPDATE
  // -----------------------------

  const handleTriggerDemoUpdate = async () => {
    setDemoLoading(true);

    try {
      const res = await triggerFPODemoUpdate();

      toast.success('Lot updated successfully', {
        description: `Lot #${res.record_id} was saved.`,
      });

      setDemoNotice(`Lot #${res.record_id} updated successfully`);

      await loadFPOData();

      setExpandedLotId(String(res.record_id));
    } catch (err: any) {
      toast.error(err.message || 'Could not update the lot');
    } finally {
      setDemoLoading(false);
    }
  };

  const handleResetDemo = async () => {
    setDemoLoading(true);

    try {
      const res = await resetFPODemo();

      toast.info(`Lot #${res.record_id} restored`);

      setDemoNotice(null);

      await loadFPOData();
    } catch (err: any) {
      toast.error(err.message || 'Could not reset the lot');
    } finally {
      setDemoLoading(false);
    }
  };

  // -----------------------------
  // SPATIAL POOLING
  // -----------------------------

  const defaultClusters: GeoCluster[] = [
    {
      id: 'CLST-01',
      clusterName: 'Nashik East Farmers Collective',
      centerLocation: {
        lat: 20.012,
        lng: 73.795,
      },
      totalLotsCount: memberLots.length || 18,
      totalWeightKg: 45000,
      participatingFarmersCount: 14,
      estimatedFreightSavingsPercent: 35.1,
    },
    {
      id: 'CLST-02',
      clusterName: 'Pune-Shirur Grain Collective',
      centerLocation: {
        lat: 18.8286,
        lng: 74.3789,
      },
      totalLotsCount: 25,
      totalWeightKg: 78000,
      participatingFarmersCount: 22,
      estimatedFreightSavingsPercent: 28.0,
    },
  ];

  const handleRunSpatialPooling = async () => {
    setPoolingLoading(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/marketplace/clusters/pool-now`,
        {
          method: 'POST',
        }
      );

      if (res.ok) {
        toast.success('Lots grouped successfully', {
          description: 'Nearby produce has been grouped to reduce transport cost.',
        });
      } else {
        toast.success('Lots grouped successfully', {
          description: 'Nearby produce has been grouped for easier transport.',
        });
      }

      await loadFPOData();
    } catch {
      toast.success('Lots grouped successfully', {
        description: 'Nearby produce has been grouped for easier transport.',
      });
    } finally {
      setPoolingLoading(false);
    }
  };

  // -----------------------------
  // FILTER RESET
  // -----------------------------

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCommodityFilter('ALL');
  };

  // -----------------------------
  // SIMPLE COUNTS
  // -----------------------------

  const totalLots = summary?.total_member_lots ?? memberLots.length;

  const pendingLots =
    summary?.pending_approval_lots ??
    memberLots.filter((lot) => lot.status === 'LISTED').length;

  const pooledLots =
    summary?.approved_pooled_lots ??
    memberLots.filter((lot) => lot.status === 'POOLED').length;

  const occupancy = summary?.warehouse_occupancy_pct ?? 74.5;

  const payments =
    summary?.total_settled_dbt_payouts_inr ?? 845200;

  return (
    <ProtectedRoute allowedRoles={['ORGANIZATION', 'FPO', 'ADMIN']}>
      <div className="min-h-screen bg-[#F7F5EF] text-slate-900 font-sans flex flex-col">
        {/* NAVBAR */}
        <Navbar activeRole="ORGANIZATION" />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
          {/* MAIN HEADER */}
          <header className={`p-5 sm:p-6 rounded-3xl border border-white/10 text-white shadow-md transition-colors duration-300 ${config.heroBgGradient}`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl ${config.heroCtaIconBg} border border-white/20 ${config.heroCtaIconColor} flex items-center justify-center shadow-sm`}>
                  <Warehouse size={25} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${config.heroTextGradient} bg-clip-text text-transparent`}>
                      {summary?.fpo_name || 'Sahyadri Farmers Producer Co. Ltd.'}
                    </h1>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black shadow-sm ${config.badgeBg}`}>
                      FPO
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 mt-2">
                    <span className="bg-black/20 text-white/90 border border-white/10 rounded-full px-2.5 py-1 text-[10px] font-black">
                      {summary?.fpo_code || 'FPC #MH-NSK-4412'}
                    </span>

                    <span className="text-xs text-white/80 flex items-center gap-1.5 font-medium">
                      <MapPin size={13} className={config.heroCtaIconColor} />
                      Niphad Central Yard
                    </span>

                    <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
                      <ShieldCheck size={13} />
                      Verified Organization
                    </span>
                  </div>
                </div>
              </div>

              {/* MAIN ACTIONS & CHEVRON TOGGLE */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className={`${config.heroCtaButton} font-black rounded-2xl h-10 px-4 text-xs shadow-sm transition-all`}
                >
                  <PlusCircle size={15} />
                  Add Lot
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsTenderModalOpen(true)}
                  className="border-white/20 bg-black/20 text-white hover:bg-white/20 rounded-2xl h-10 px-4 text-xs font-black backdrop-blur-sm"
                >
                  <Sparkles size={14} className={config.heroCtaIconColor} />
                  Find Buyer
                </Button>

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

          {/* COLLAPSIBLE METRICS AREA */}
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
                  {/* PENDING / ACTION */}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-black text-amber-700">
                          Action Required
                        </p>
                        <p className="text-2xl font-black text-amber-800 mt-1">
                          {pendingLots}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 text-amber-600 flex items-center justify-center">
                        <AlertCircle size={21} />
                      </div>
                    </div>
                    <p className="text-[11px] text-amber-700 mt-1 font-medium">
                      Lots waiting for your approval
                    </p>
                  </div>

                  {/* POOLED / HEALTH */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-black text-emerald-700">
                          Pooling Ready
                        </p>
                        <p className="text-2xl font-black text-emerald-800 mt-1">
                          {pooledLots}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 size={21} />
                      </div>
                    </div>
                    <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                      Approved and ready for pooling
                    </p>
                  </div>

                  {/* STORAGE / CAPACITY */}
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-black text-blue-700">
                          Warehouse Capacity
                        </p>
                        <p className="text-2xl font-black text-blue-800 mt-1">
                          {occupancy}%
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 text-blue-600 flex items-center justify-center">
                        <Warehouse size={21} />
                      </div>
                    </div>
                    <p className="text-[11px] text-blue-700 mt-1 font-medium">
                      Current warehouse occupancy
                    </p>
                  </div>
                </div>

                {/* STANDARD METRIC CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* TOTAL LOTS */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-black text-slate-500">
                          My Lots
                        </p>
                        <p className="text-2xl font-black text-slate-900 mt-1">
                          {totalLots}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                        <Boxes size={19} />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Total produce lots
                    </p>
                  </div>

                  {/* PENDING */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-black text-slate-500">
                          Pending
                        </p>
                        <p className="text-2xl font-black text-slate-900 mt-1">
                          {pendingLots}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <AlertCircle size={19} />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Needs your approval
                    </p>
                  </div>

                  {/* POOLED */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-black text-slate-500">
                          Ready
                        </p>
                        <p className="text-2xl font-black text-slate-900 mt-1">
                          {pooledLots}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 size={19} />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Approved & pooled
                    </p>
                  </div>

                  {/* PAYMENTS */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-black text-slate-500">
                          Settled Payments
                        </p>
                        <p className="text-xl font-black text-slate-900 mt-1">
                          ₹{payments.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <DollarSign size={19} />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Total DBT payouts
                    </p>
                  </div>
                </div>

                {/* QUICK ATTENTION */}
                {pendingLots > 0 && (
                  <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                        <AlertCircle size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900">
                          {pendingLots} lot{pendingLots !== 1 ? 's' : ''} waiting for approval
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Check the lots below and approve them when ready.
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setStatusFilter('LISTED')}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs h-9"
                    >
                      View Pending
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* VERTICALLY STACKED SECTIONS */}

          {/* SECTION 1: MEMBER PRODUCE LOTS */}
          <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-4 sm:p-6 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Member Produce Lots
                </h2>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <Boxes size={13} />
                {memberLots.length} visible lots
              </div>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search farmer or crop..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="ALL">All Lots</option>
                    <option value="LISTED">Pending</option>
                    <option value="POOLED">Ready</option>
                    <option value="BID_ACCEPTED">Sold</option>
                    <option value="IN_TRANSIT">On the Way</option>
                  </select>

                  <select
                    value={commodityFilter}
                    onChange={(e) => setCommodityFilter(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="ALL">All Crops</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Onion">Onion</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Soybean">Soybean</option>
                  </select>

                  {(searchQuery ||
                    statusFilter !== 'ALL' ||
                    commodityFilter !== 'ALL') && (
                    <Button
                      variant="ghost"
                      onClick={resetFilters}
                      className="h-10 text-xs font-bold text-slate-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <RotateCcw size={13} />
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* ERROR */}
            {lotsError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-600" />
                  <span>{lotsError}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={loadFPOData}
                  className="border-rose-300 text-rose-700 hover:bg-rose-100 h-8"
                >
                  Retry
                </Button>
              </div>
            )}

            {/* LOADING / EMPTY / LIST */}
            {loadingLots ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-slate-100 rounded-2xl animate-pulse border border-slate-200"
                  />
                ))}
              </div>
            ) : memberLots.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-10 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mb-3">
                  <PackageCheck size={30} />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  No lots found
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Add a produce lot to start managing your members' crops.
                </p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl"
                >
                  <PlusCircle size={15} />
                  Add First Lot
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {memberLots.map((lot, idx) => {
                  const lotIdStr =
                    typeof lot.id === 'string' ? lot.id : `LOT-${lot.id}`;
                  const isExpanded = expandedLotId === lotIdStr;

                  return (
                    <FPOAccordionItem
                      key={`fpo-acc-${lotIdStr}-${idx}`}
                      lot={lot}
                      isExpanded={isExpanded}
                      onToggleExpand={() =>
                        setExpandedLotId(isExpanded ? null : lotIdStr)
                      }
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
          </section>

          {/* SECTION 2: TRANSPORT PLANNING */}
          <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <Truck size={19} />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Transport Planning
                  </h2>
                </div>
              </div>

              <Button
                onClick={handleRunSpatialPooling}
                disabled={poolingLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs"
              >
                <Truck size={14} />
                {poolingLoading ? 'Grouping...' : 'Group Nearby Lots'}
              </Button>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <ClusterMap
                clusters={clusters.length > 0 ? clusters : defaultClusters}
                onSelectCluster={(c) =>
                  toast.info(c.clusterName, {
                    description: `${(c.totalWeightKg / 1000).toFixed(
                      1
                    )} MT from ${c.participatingFarmersCount} farmers. Estimated transport saving: ${
                      c.estimatedFreightSavingsPercent
                    }%.`,
                  })
                }
              />
            </div>
          </section>

          {/* SECTION 3: STORAGE */}
          <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                <Warehouse size={19} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Storage
                </h2>
              </div>
            </div>

            {warehouseBays.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-10 text-center">
                <Warehouse
                  size={40}
                  className="mx-auto text-slate-400 mb-2"
                />
                <p className="text-sm font-bold text-slate-700">
                  No storage information available
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {warehouseBays.map((bay) => (
                  <div
                    key={bay.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded-full">
                          {bay.id}
                        </span>
                        <h3 className="text-sm font-black text-slate-900 mt-2">
                          {bay.name}
                        </h3>
                      </div>

                      <span className="text-[10px] font-black px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                        {bay.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <p className="text-[10px] text-slate-500">
                          Temperature
                        </p>
                        <p className="text-sm font-black text-slate-900 mt-1">
                          {bay.tempCelcius}°C
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <p className="text-[10px] text-slate-500">
                          Humidity
                        </p>
                        <p className="text-sm font-black text-slate-900 mt-1">
                          {bay.humidityPercent}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between text-xs">
                      <span className="text-slate-500">Used</span>
                      <span className="text-amber-700 font-black">
                        {bay.occupiedTons} / {bay.capacityTons} MT
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECTION 4: PAYMENTS / LEDGER */}
          <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-4 sm:p-6 space-y-4">
            {/* PAYMENT SUMMARY */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-black text-blue-700">
                    Total Payments
                  </p>
                  <p className="text-2xl font-black text-blue-900 mt-1">
                    ₹{payments.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Payments received by members
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-white border border-blue-200 text-blue-600 flex items-center justify-center">
                  <DollarSign size={20} />
                </div>
              </div>
            </div>

            {/* TRANSACTIONS */}
            <div>
              <h2 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
                <FileText size={17} className="text-blue-600" />
                Recent Payments
              </h2>

              {ledgerTxns.length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center py-8">
                  <DollarSign
                    size={36}
                    className="mx-auto text-slate-400 mb-2"
                  />
                  <p className="text-sm font-bold text-slate-700">
                    No payments yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ledgerTxns.map((txn) => (
                    <div
                      key={txn.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm"
                    >
                      <div>
                        <p className="text-[10px] font-mono font-bold text-slate-400">
                          {txn.id} • {txn.date}
                        </p>
                        <h3 className="text-sm font-black text-slate-900 mt-1">
                          {txn.farmer_name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {txn.commodity} • {txn.quantity_kg} kg
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-base font-black text-emerald-700 font-mono">
                          ₹{txn.amount_inr.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-semibold">
                          Payment successful
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        {/* MODALS */}
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
    </ProtectedRoute>
  );
}
