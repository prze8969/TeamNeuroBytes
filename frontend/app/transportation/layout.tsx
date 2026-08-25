'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function TransportationLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['TRANSPORTATION', 'ADMIN']}>
      {children}
    </ProtectedRoute>
  );
}
