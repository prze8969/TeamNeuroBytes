'use client';

import React from 'react';
import { Filter, X, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderFilterState, OrderStatus, DeliveryStatus, TransportMode, PriorityLevel } from '@/lib/transportation-types';

interface OrderFilterPopoverProps {
  filters: OrderFilterState;
  onFilterChange: (updated: OrderFilterState) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderFilterPopover({
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
  isOpen,
  onClose
}: OrderFilterPopoverProps) {
  if (!isOpen) return null;

  const STATUS_OPTIONS: { label: string; value: OrderStatus | 'ALL' }[] = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'In Transit', value: 'IN_TRANSIT' },
    { label: 'Assigned', value: 'ASSIGNED' },
    { label: 'Arrived at Mandi', value: 'ARRIVED_AT_MANDI' },
    { label: 'Pending Dispatch', value: 'PENDING' },
    { label: 'Delivered', value: 'DELIVERED' }
  ];

  const DELIVERY_OPTIONS: { label: string; value: DeliveryStatus | 'ALL' }[] = [
    { label: 'All Delivery States', value: 'ALL' },
    { label: 'On Time', value: 'ON_TIME' },
    { label: 'Delayed', value: 'DELAYED' },
    { label: 'At Risk', value: 'AT_RISK' }
  ];

  const MODE_OPTIONS: { label: string; value: TransportMode | 'ALL' }[] = [
    { label: 'All Vehicles', value: 'ALL' },
    { label: 'Reefer Truck', value: 'Reefer Truck' },
    { label: 'Truck', value: 'Truck' },
    { label: 'Container Van', value: 'Container Van' },
    { label: 'Multi-Axle', value: 'Multi-Axle' }
  ];

  const PRIORITY_OPTIONS: { label: string; value: PriorityLevel | 'ALL' }[] = [
    { label: 'All Priorities', value: 'ALL' },
    { label: 'High Priority', value: 'HIGH' },
    { label: 'Medium Priority', value: 'MEDIUM' },
    { label: 'Low Priority', value: 'LOW' }
  ];

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4 text-xs animate-in fade-in zoom-in-95 z-30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-emerald-700" />
          <h3 className="font-black text-slate-900 text-xs">
            Filter Transportation Orders
          </h3>
          {activeFilterCount > 0 && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
              {activeFilterCount} Active
            </span>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      {/* Filter Sections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* 1. Order Status */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700 text-[11px] block">Order Status:</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value as any })}
            className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 px-2.5 font-sans font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* 2. Delivery Alert */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700 text-[11px] block">Delivery Performance:</label>
          <select
            value={filters.deliveryStatus}
            onChange={(e) => onFilterChange({ ...filters, deliveryStatus: e.target.value as any })}
            className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 px-2.5 font-sans font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          >
            {DELIVERY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* 3. Transport Vehicle Mode */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700 text-[11px] block">Vehicle Mode:</label>
          <select
            value={filters.transportMode}
            onChange={(e) => onFilterChange({ ...filters, transportMode: e.target.value as any })}
            className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 px-2.5 font-sans font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          >
            {MODE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* 4. Priority Level */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700 text-[11px] block">Priority Level:</label>
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ ...filters, priority: e.target.value as any })}
            className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 px-2.5 font-sans font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          >
            {PRIORITY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          disabled={activeFilterCount === 0}
          className="h-8 rounded-xl font-bold text-xs text-slate-600 border-slate-200 hover:bg-slate-100 disabled:opacity-40"
        >
          <RotateCcw size={12} className="mr-1.5" />
          Reset All
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={onClose}
          className="h-8 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
        >
          <Check size={13} className="mr-1" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
