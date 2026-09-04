'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

import { Navbar } from '@/components/layout/Navbar';

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['BUYER', 'ADMIN']}>
      <Navbar activeRole="BUYER" />
      {children}
    </ProtectedRoute>
  );
}
