'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { FarmerDashboardLayout } from '@/components/farmer/FarmerDashboardLayout';

export default function FarmerDashboard() {
  return (
    <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
      <FarmerDashboardLayout />
    </ProtectedRoute>
  );
}
