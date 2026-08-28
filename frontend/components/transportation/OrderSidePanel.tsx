'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Truck, 
  AlertTriangle,
  CheckCircle2,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  TransportationOrder, 
  OrderFilterState, 
  OrderSortOption, 
  DEFAULT_FILTER_STATE 
} from '@/lib/transportation-types';
import { OrderItem } from './OrderItem';
import { OrderFilterPopover } from './OrderFilterPopover';

interface OrderSidePanelProps {
  orders: TransportationOrder[];
  selectedOrderId: string | null;
  onSelectOrder: (order: TransportationOrder) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onBrowseTenders?: () => void;
}

export function OrderSidePanel({
  orders,
  selectedOrderId,
  onSelectOrder,
  isCollapsed,
  onToggleCollapse,
  onBrowseTenders
}: OrderSidePanelProps) {
  // Filter & Sort state
  const [filters, setFilters] = useState<OrderFilterState>(DEFAULT_FILTER_STATE);
  const [sortOption, setSortOption] = useState<OrderSortOption>('eta_earliest');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Compute Active Filter Count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status !== 'ALL') count++;
    if (filters.deliveryStatus !== 'ALL') count++;
    if (filters.transportMode !== 'ALL') count++;
    if (filters.priority !== 'ALL') count++;
    if (filters.timeRange !== 'ALL') count++;
    if (filters.searchQuery.trim().length > 0) count++;
    return count;
  }, [filters]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTER_STATE);
  };

  // Filter Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Search Query Filter
      if (filters.searchQuery.trim().length > 0) {
        const q = filters.searchQuery.toLowerCase();
        const matches = 
          order.id.toLowerCase().includes(q) ||
          order.ewayBillNumber.toLowerCase().includes(q) ||
          order.customerName.toLowerCase().includes(q) ||
          order.farmerName.toLowerCase().includes(q) ||
          order.driver.name.toLowerCase().includes(q) ||
          order.vehicle.registrationNumber.toLowerCase().includes(q) ||
          order.origin.name.toLowerCase().includes(q) ||
          order.destination.name.toLowerCase().includes(q) ||
          order.shipment.cropName.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // 2. Status Filter
      if (filters.status !== 'ALL' && order.status !== filters.status) {
        return false;
      }

      // 3. Delivery Status Filter
      if (filters.deliveryStatus !== 'ALL' && order.deliveryStatus !== filters.deliveryStatus) {
        return false;
      }

      // 4. Vehicle Mode Filter
      if (filters.transportMode !== 'ALL' && order.vehicle.type !== filters.transportMode) {
        return false;
      }

      // 5. Priority Filter
      if (filters.priority !== 'ALL' && order.priority !== filters.priority) {
        return false;
      }

      return true;
    });
  }, [orders, filters]);

  // Sort Orders
  const sortedOrders = useMemo(() => {
    const list = [...filteredOrders];

    list.sort((a, b) => {
      switch (sortOption) {
        case 'eta_earliest':
          return new Date(a.estimatedArrivalTime).getTime() - new Date(b.estimatedArrivalTime).getTime();
        case 'eta_latest':
          return new Date(b.estimatedArrivalTime).getTime() - new Date(a.estimatedArrivalTime).getTime();
        case 'pickup_time':
          return new Date(a.pickupTime).getTime() - new Date(b.pickupTime).getTime();
        case 'created_newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'created_oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priority': {
          const pRank = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          return pRank[b.priority] - pRank[a.priority];
        }
        case 'distance_remaining':
          return a.distanceRemainingKm - b.distanceRemainingKm;
        case 'customer_name':
          return a.customerName.localeCompare(b.customerName);
        case 'destination':
          return a.destination.name.localeCompare(b.destination.name);
        case 'status': {
          const sRank = { IN_TRANSIT: 5, ARRIVED_AT_MANDI: 4, ASSIGNED: 3, PENDING: 2, DELIVERED: 1, COMPLETED: 0, CANCELLED: 0 };
          return sRank[b.status] - sRank[a.status];
        }
        default:
          return 0;
      }
    });

    return list;
  }, [filteredOrders, sortOption]);

  // Quick stats
  const activeCount = orders.filter(o => o.status === 'IN_TRANSIT' || o.status === 'ASSIGNED').length;
  const delayedCount = orders.filter(o => o.deliveryStatus === 'DELAYED' || o.delayMinutes > 0).length;

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-slate-200 flex flex-col items-center py-4 space-y-4 shrink-0 transition-all">
        <button
          onClick={onToggleCollapse}
          title="Expand Order Side Panel"
          className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-950 flex items-center justify-center hover:bg-emerald-200 cursor-pointer shadow-xs border border-emerald-300"
        >
          <ChevronRight size={18} />
        </button>
        <div className="writing-mode-vertical text-xs font-black text-slate-700 tracking-wider font-mono flex items-center gap-2 pt-4">
          <Truck size={14} className="text-emerald-700 rotate-90" />
          <span>ORDERS ({orders.length})</span>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-full sm:w-[380px] lg:w-[420px] bg-slate-50/50 border-r border-slate-200 flex flex-col h-full shrink-0 relative font-sans transition-all">
      
      {/* ========================================================================= */}
      {/* 1. STICKY PANEL HEADER */}
      {/* ========================================================================= */}
      <div className="p-3.5 bg-white border-b border-slate-200 sticky top-0 z-20 space-y-3 shadow-2xs">
        
        {/* Title & Counters & Collapse Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-slate-900 tracking-tight">
                Transportation Orders
              </h2>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
                {sortedOrders.length} / {orders.length}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono pt-0.5">
              <span className="text-emerald-700 font-bold">{activeCount} Active Hauls</span>
              {delayedCount > 0 && (
                <span className="text-rose-600 font-bold">• {delayedCount} Delayed</span>
              )}
            </div>
          </div>

          <button
            onClick={onToggleCollapse}
            title="Collapse Panel"
            className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Quick Search Input */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search order ID, driver, vehicle, origin..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="pl-8 pr-8 h-9 text-xs rounded-xl border-slate-200 bg-slate-50/80 focus:bg-white focus:ring-emerald-500"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filter Toggle & Sort Dropdown */}
        <div className="flex items-center gap-2 pt-0.5">
          {/* Filter Toggle Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`h-8 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
              activeFilterCount > 0 
                ? 'bg-emerald-100 text-emerald-950 border-emerald-300' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal size={13} />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[9px] font-mono flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* Sort Selector */}
          <div className="flex-1 relative flex items-center">
            <ArrowUpDown size={12} className="absolute left-2.5 text-slate-400 pointer-events-none" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as OrderSortOption)}
              className="w-full h-8 pl-7 pr-2 rounded-xl border border-slate-200 bg-white font-sans text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 cursor-pointer text-ellipsis overflow-hidden"
            >
              <option value="eta_earliest">Sort: ETA (Earliest First)</option>
              <option value="eta_latest">Sort: ETA (Latest First)</option>
              <option value="pickup_time">Sort: Pickup Time</option>
              <option value="created_newest">Sort: Created (Newest First)</option>
              <option value="created_oldest">Sort: Created (Oldest First)</option>
              <option value="priority">Sort: High Priority First</option>
              <option value="status">Sort: Status Severity</option>
              <option value="distance_remaining">Sort: Distance Remaining</option>
              <option value="customer_name">Sort: Customer Name</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips Strip */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono">
            {filters.status !== 'ALL' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 flex items-center gap-1">
                Status: {filters.status}
                <X 
                  size={10} 
                  className="cursor-pointer hover:text-emerald-950" 
                  onClick={() => setFilters(prev => ({ ...prev, status: 'ALL' }))}
                />
              </span>
            )}

            {filters.deliveryStatus !== 'ALL' && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-200 flex items-center gap-1">
                Alert: {filters.deliveryStatus}
                <X 
                  size={10} 
                  className="cursor-pointer hover:text-rose-950" 
                  onClick={() => setFilters(prev => ({ ...prev, deliveryStatus: 'ALL' }))}
                />
              </span>
            )}

            {filters.transportMode !== 'ALL' && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1">
                Mode: {filters.transportMode}
                <X 
                  size={10} 
                  className="cursor-pointer hover:text-blue-950" 
                  onClick={() => setFilters(prev => ({ ...prev, transportMode: 'ALL' }))}
                />
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-emerald-700 hover:underline font-bold text-[10px] ml-auto cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

      </div>

      {/* Filter Popover Section */}
      <OrderFilterPopover
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* ========================================================================= */}
      {/* 2. ORDER LIST SCROLLABLE AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {orders.length === 0 ? (
          /* Empty Orders Initial State */
          <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 space-y-3 my-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto font-bold border border-emerald-200 text-lg">
              🚚
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-xs">
                No active hauls assigned
              </h3>
              <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                Accept open freight tenders from the Load Board to start tracking trips.
              </p>
            </div>
            {onBrowseTenders && (
              <Button
                size="sm"
                onClick={onBrowseTenders}
                className="h-8 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer"
              >
                Browse Load Board →
              </Button>
            )}
          </div>
        ) : sortedOrders.length === 0 ? (
          /* Empty Filter State */
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3 my-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto font-bold border border-emerald-200">
              <Filter size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-xs">
                No orders match the selected filters
              </h3>
              <p className="text-[11px] text-slate-500 pt-1">
                Try adjusting your search criteria or resetting filters to view orders.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleResetFilters}
              className="h-8 rounded-xl font-bold text-xs text-emerald-800 border-emerald-200 hover:bg-emerald-50"
            >
              <RotateCcw size={12} className="mr-1.5" />
              Reset Filters
            </Button>
          </div>
        ) : (
          /* Render Sorted Order Items */
          sortedOrders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              isSelected={order.id === selectedOrderId}
              onSelect={onSelectOrder}
            />
          ))
        )}
      </div>

    </aside>
  );
}
