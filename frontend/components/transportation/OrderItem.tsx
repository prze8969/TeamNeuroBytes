'use client';

import React from 'react';
import { 
  Truck, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation, 
  AlertCircle,
  Building2,
  User,
  ShieldCheck
} from 'lucide-react';
import { TransportationOrder, OrderStatus, DeliveryStatus, PriorityLevel } from '@/lib/transportation-types';

interface OrderItemProps {
  order: TransportationOrder;
  isSelected: boolean;
  onSelect: (order: TransportationOrder) => void;
}

export function OrderItem({ order, isSelected, onSelect }: OrderItemProps) {
  // Format Status Badge (Icon + Color + Label)
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
            In Transit
          </span>
        );
      case 'ARRIVED_AT_MANDI':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 size={11} className="text-emerald-700 shrink-0" />
            Arrived at Mandi
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
            <Truck size={11} className="text-blue-700 shrink-0" />
            Assigned
          </span>
        );
      case 'DELIVERED':
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
            <ShieldCheck size={11} className="text-slate-600 shrink-0" />
            Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
            Cancelled
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <Clock size={11} className="text-amber-700 shrink-0" />
            Pending Dispatch
          </span>
        );
    }
  };

  // Format Delivery Alert (On Time vs Delayed vs At Risk)
  const getDeliveryStatusBadge = (deliveryStatus: DeliveryStatus, delayMins: number) => {
    if (deliveryStatus === 'DELAYED' || delayMins > 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
          <AlertTriangle size={11} className="text-rose-600" />
          Delayed ({delayMins > 0 ? `${delayMins}m` : 'Alert'})
        </span>
      );
    }
    if (deliveryStatus === 'AT_RISK') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
          <AlertCircle size={11} className="text-amber-600" />
          At Risk
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
        On Time
      </span>
    );
  };

  // Priority indicator
  const getPriorityBadge = (priority: PriorityLevel) => {
    if (priority === 'HIGH') {
      return (
        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-300">
          High Priority
        </span>
      );
    }
    return null;
  };

  // Calculate clean display ETA
  const formatEta = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '14:30';
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(order)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(order);
        }
      }}
      className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs space-y-2.5 relative group outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 ${
        isSelected
          ? 'bg-emerald-50/70 border-emerald-600 shadow-md shadow-emerald-600/10 ring-1 ring-emerald-600'
          : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80 shadow-2xs'
      }`}
    >
      {/* Selected Indicator Bar on Left */}
      {isSelected && (
        <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-emerald-600 rounded-r-full" />
      )}

      {/* TOP ROW: Order ID, Status, Priority */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono font-black text-slate-900 text-xs truncate">
            {order.id}
          </span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            ({order.ewayBillNumber})
          </span>
          {getPriorityBadge(order.priority)}
        </div>
        <div className="shrink-0">
          {getStatusBadge(order.status)}
        </div>
      </div>

      {/* MIDDLE ROW: Destination & Route Summary */}
      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
          <span className="truncate flex items-center gap-1 text-slate-900 font-black">
            <Truck size={12} className="text-emerald-600 shrink-0" />
            {order.shipment.cropName} ({order.shipment.weightTons} MT)
          </span>
          <span className="font-mono text-emerald-800 shrink-0">
            ₹{order.totalFreightInr.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-mono truncate">
          <MapPin size={11} className="text-emerald-600 shrink-0" />
          <span className="truncate">{order.origin.name}</span>
          <span className="text-slate-400 font-bold shrink-0">➔</span>
          <Building2 size={11} className="text-blue-600 shrink-0" />
          <span className="truncate">{order.destination.name}</span>
        </div>
      </div>

      {/* BOTTOM ROW: ETA, Delay State & Driver/Vehicle Summary */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 pt-0.5">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-bold text-slate-800">
            <Clock size={12} className="text-slate-500 shrink-0" />
            ETA {formatEta(order.estimatedArrivalTime)}
          </span>
          {order.distanceRemainingKm > 0 && (
            <span className="text-slate-500 text-[10px]">
              • {order.distanceRemainingKm} km left
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {getDeliveryStatusBadge(order.deliveryStatus, order.delayMinutes)}
          <span className="text-[10px] text-slate-500 font-sans truncate max-w-[90px] sm:max-w-[120px]">
            {order.driver.name}
          </span>
        </div>
      </div>
    </div>
  );
}
