'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function FPOLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['ORGANIZATION', 'FPO', 'ADMIN']}>
      {children}
    </ProtectedRoute>
  );
}
