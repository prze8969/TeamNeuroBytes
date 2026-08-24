'use client';

import { Navbar } from '@/components/layout/Navbar';
import { BuyerDashboardLayout } from '@/components/dashboard/BuyerDashboardLayout';

export default function BuyerDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />
      <BuyerDashboardLayout />
    </div>
  );
}
