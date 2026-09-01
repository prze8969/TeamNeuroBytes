'use client';

import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import type { TransportationOrder } from '@/lib/transportation-types';

/**
 * Visual status lifecycle for a transport order.
 * Mirrors the REAL backend milestone flow:
 *   ASSIGNED (LOCKED) → Advance (FREIGHT_ADVANCE_PAID) → Loaded (OTP) →
 *   IN_TRANSIT → ARRIVED_AT_MANDI → Settled (DELIVERED / COMPLETED)
 */

const STEPS = ['Assigned', 'Advance', 'Loaded', 'In Transit', 'Arrived', 'Settled'] as const;

function getPipelineState(order: TransportationOrder): { current: number; allDone: boolean } {
  switch (order.status) {
    case 'PENDING':
      return { current: 0, allDone: false }; // awaiting assignment
    case 'ASSIGNED':
      return { current: order.advanceClaimed ? 2 : 1, allDone: false };
    case 'IN_TRANSIT':
      return { current: 3, allDone: false };
    case 'ARRIVED_AT_MANDI':
      return { current: 4, allDone: false };
    case 'DELIVERED':
      return { current: 5, allDone: false };
    case 'COMPLETED':
      return { current: STEPS.length, allDone: true };
    default:
      return { current: 0, allDone: false };
  }
}

export function StatusPipeline({ order, compact = false }: { order: TransportationOrder; compact?: boolean }) {
  if (order.status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-red-600">
        <AlertTriangle size={12} /> Order Cancelled
      </div>
    );
  }

  const { current, allDone } = getPipelineState(order);

  return (
    <div className="flex items-center w-full" role="list" aria-label="Delivery progress">
      {STEPS.map((label, i) => {
        const isCompleted = allDone || i < current;
        const isCurrent = !allDone && i === current;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center shrink-0" role="listitem">
              <div
                className={`flex items-center justify-center rounded-full border-2 transition-colors ${
                  compact ? 'w-5 h-5' : 'w-6 h-6'
                } ${
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : isCurrent
                    ? 'border-emerald-500 text-emerald-600 bg-white'
                    : 'border-slate-200 bg-white text-slate-300'
                }`}
              >
                {isCompleted ? (
                  <Check size={compact ? 10 : 12} strokeWidth={3} />
                ) : isCurrent ? (
                  <span className={`rounded-full bg-emerald-500 animate-pulse ${compact ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} />
                ) : (
                  <span className={`rounded-full bg-slate-200 ${compact ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} />
                )}
              </div>
              <span
                className={`mt-1 font-semibold tracking-wide ${compact ? 'text-[8px]' : 'text-[9px]'} uppercase whitespace-nowrap ${
                  isCompleted ? 'text-emerald-700' : isCurrent ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 mx-1 -mt-3.5">
                <div className={`h-0.5 rounded-full ${i < current || allDone ? 'bg-emerald-400' : 'bg-slate-200'}`} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
