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
          <span className="clay-pill-green inline-flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
            In Transit
          </span>
        );
      case 'ARRIVED_AT_MANDI':
        return (
          <span className="clay-pill-green inline-flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1">
            <CheckCircle2 size={11} className="text-emerald-700 shrink-0" />
            Arrived at Mandi
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1 rounded-full bg-blue-50 text-blue-900 shadow-[inset_1px_1px_3px_rgba(0,0,255,0.1)] border-none">
            <Truck size={11} className="text-blue-700 shrink-0" />
            Assigned
          </span>
        );
      case 'DELIVERED':
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1 rounded-full bg-slate-50 text-slate-800 shadow-[inset_1px_1px_3px_rgba(163,163,140,0.1)] border-none">
            <ShieldCheck size={11} className="text-slate-600 shrink-0" />
            Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="clay-pill-red inline-flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1">
            Cancelled
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="clay-pill-amber inline-flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1">
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
        <span className="clay-pill-red inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5">
          <AlertTriangle size={11} className="text-rose-600 animate-bounce" />
          Delayed ({delayMins > 0 ? `${delayMins}m` : 'Alert'})
        </span>
      );
    }
    if (deliveryStatus === 'AT_RISK') {
      return (
        <span className="clay-pill-amber inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5">
          <AlertCircle size={11} className="text-amber-600 animate-pulse" />
          At Risk
        </span>
      );
    }
    return (
      <span className="clay-pill-green inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5">
        On Time
      </span>
    );
  };

  // Priority indicator
  const getPriorityBadge = (priority: PriorityLevel) => {
    if (priority === 'HIGH') {
      return (
        <span className="clay-pill-green text-[9px] font-black uppercase tracking-wider px-2 py-0.5">
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
      className={`p-4 rounded-2xl transition-all cursor-pointer text-xs space-y-3 relative group outline-none ${
        isSelected
          ? 'clay-pressed bg-[#FAFAF7]'
          : 'clay-card hover:translate-y-[-1px]'
      }`}
    >
      {/* Selected Indicator Bar on Left */}
      {isSelected && (
        <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-emerald-600 rounded-r-full" />
      )}

      {/* TOP ROW: Order ID, Status, Priority */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono font-black text-slate-950 text-xs truncate">
            {order.id}
          </span>
          {getPriorityBadge(order.priority)}
        </div>
        <div className="shrink-0">
          {getStatusBadge(order.status)}
        </div>
      </div>

      {/* MIDDLE ROW: Destination & Route Summary */}
      <div className="p-3 rounded-xl clay-card-flat space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
          <span className="truncate flex items-center gap-1.5 text-slate-950 font-black">
            <Truck size={13} className="text-emerald-700 shrink-0" />
            {order.shipment.cropName} • {order.shipment.weightTons} MT
          </span>
          <span className="font-mono text-emerald-850 shrink-0 font-extrabold text-xs">
            ₹{order.totalFreightInr.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-mono truncate">
          <MapPin size={11} className="text-emerald-700 shrink-0" />
          <span className="truncate">{order.origin.name}</span>
          <span className="text-slate-400 font-bold shrink-0">➔</span>
          <Building2 size={11} className="text-blue-600 shrink-0" />
          <span className="truncate">{order.destination.name}</span>
        </div>
      </div>

      {/* BOTTOM ROW: ETA, Delay State & Driver Summary */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 pt-0.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <Clock size={12} className="text-emerald-700 shrink-0" />
          <span>ETA {formatEta(order.estimatedArrivalTime)}</span>
          {order.distanceRemainingKm > 0 && (
            <span className="text-slate-500 text-[10px] font-normal">
              ({order.distanceRemainingKm} km left)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {getDeliveryStatusBadge(order.deliveryStatus, order.delayMinutes)}
        </div>
      </div>
    </div>
  );
}
