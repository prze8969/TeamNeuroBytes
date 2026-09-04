'use client';

import React from 'react';
import { BuyerAnalyticsCards } from '@/components/dashboard/BuyerAnalyticsCards';
import { OrderHistoryTable } from '@/components/dashboard/OrderHistoryTable';
import { useBuyerState } from '@/lib/useBuyerState';

export function BuyerLedgerLayout() {
  const { analytics, orders } = useBuyerState();

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Procurement Analytics KPI Cards */}
        <BuyerAnalyticsCards data={analytics} />

        {/* Historical Order Ledger Table */}
        <OrderHistoryTable orders={orders} />
      </div>
    </div>
  );
}
