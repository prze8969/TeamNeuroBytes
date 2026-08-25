'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { BuyerDashboardLayout } from '@/components/dashboard/BuyerDashboardLayout';

export default function BuyerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['BUYER', 'ADMIN']}>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar activeRole="BUYER" />
        <BuyerDashboardLayout />
      </div>
    </ProtectedRoute>
  );
}
