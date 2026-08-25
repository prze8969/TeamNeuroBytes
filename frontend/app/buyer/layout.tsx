'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['BUYER', 'ADMIN']}>
      {children}
    </ProtectedRoute>
  );
}
