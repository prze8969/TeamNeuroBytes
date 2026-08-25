import React from 'react';

export type GrievanceStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'OVERDUE';

const statusConfig: Record<GrievanceStatus, { label: string; classes: string }> = {
  OPEN: {
    label: 'Open',
    classes: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    classes: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  RESOLVED: {
    label: 'Resolved',
    classes: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  OVERDUE: {
    label: 'Overdue',
    classes: 'bg-rose-100 text-rose-800 border-rose-200'
  }
};

export function GrievanceStatusBadge({ status }: { status: GrievanceStatus }) {
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-black shadow-sm ${config.classes}`}>
      {config.label}
    </span>
  );
}
