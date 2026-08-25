'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
      {children}
    </ProtectedRoute>
  );
}
