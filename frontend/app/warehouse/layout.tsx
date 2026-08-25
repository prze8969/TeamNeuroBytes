'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function WarehouseLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['WAREHOUSE', 'ADMIN']}>
      {children}
    </ProtectedRoute>
  );
}
