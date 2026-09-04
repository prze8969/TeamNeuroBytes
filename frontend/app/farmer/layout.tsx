'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
      <Navbar activeRole="FARMER" />
      {children}
    </ProtectedRoute>
  );
}
