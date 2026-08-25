'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 
  | 'FARMER' 
  | 'BUYER' 
  | 'ORGANIZATION' 
  | 'TRANSPORTATION' 
  | 'WAREHOUSE' 
  | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  location?: string;
  isKycVerified: boolean;
  avatarUrl?: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  session: string | null;
  role: UserRole;
  loading: boolean;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const defaultUserProfiles: Record<UserRole, UserProfile> = {
  FARMER: {
    id: 'USR-FARMER-01',
    name: 'Ramesh Patil',
    email: 'farmer@kisansetu.in',
    phone: '+91-9876543210',
    role: 'FARMER',
    location: 'Nashik, Maharashtra',
    isKycVerified: true,
  },
  BUYER: {
    id: 'USR-BUYER-01',
    name: 'Sahyadri AgroProcure Ltd',
    email: 'buyer@kisansetu.in',
    phone: '+91-9823456789',
    role: 'BUYER',
    location: 'Vashi APMC, Navi Mumbai',
    isKycVerified: true,
  },
  ORGANIZATION: {
    id: 'USR-FPO-01',
    name: 'Nashik East FPO Co.',
    email: 'fpo@kisansetu.in',
    phone: '+91-9811223344',
    role: 'ORGANIZATION',
    location: 'Lasalgaon Cluster, Maharashtra',
    isKycVerified: true,
  },
  TRANSPORTATION: {
    id: 'USR-TRANS-01',
    name: 'KisanSetu FastLogistics',
    email: 'transporter@kisansetu.in',
    phone: '+91-9988776655',
    role: 'TRANSPORTATION',
    location: 'Maharashtra Highway Corridor',
    isKycVerified: true,
  },
  WAREHOUSE: {
    id: 'USR-WH-01',
    name: 'Niphad e-NWR Cold Hub',
    email: 'warehouse@kisansetu.in',
    phone: '+91-9766554433',
    role: 'WAREHOUSE',
    location: 'Niphad Agri-Logistics Park',
    isKycVerified: true,
  },
  ADMIN: {
    id: 'USR-ADMIN-01',
    name: 'Ministry Trade Desk Admin',
    email: 'admin@kisansetu.in',
    phone: '+91-9899001122',
    role: 'ADMIN',
    location: 'New Delhi HQ',
    isKycVerified: true,
  },
};

const AuthContext = createContext<AuthContextValue>({
  user: defaultUserProfiles.FARMER,
  session: 'mock-jwt-token',
  role: 'FARMER',
  loading: false,
  login: () => {},
  logout: () => {},
  switchRole: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>('FARMER');
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    try {
      // Check cookies and localStorage
      const cookieRoleMatch = document.cookie.match(/user_role=([A-Z_]+)/);
      const cookieTokenMatch = document.cookie.match(/token=([^;]+)/);
      
      const storedRole = (cookieRoleMatch ? cookieRoleMatch[1] : localStorage.getItem('kisansetu_role')) as UserRole;
      const storedToken = cookieTokenMatch ? cookieTokenMatch[1] : localStorage.getItem('kisansetu_token');

      const resolvedRole: UserRole = storedRole && defaultUserProfiles[storedRole] ? storedRole : 'FARMER';
      const resolvedToken = storedToken || 'mock-jwt-token';

      setRole(resolvedRole);
      setSession(resolvedToken);
      setUser(defaultUserProfiles[resolvedRole]);
      
      // Sync cookie
      document.cookie = `user_role=${resolvedRole}; path=/; max-age=31536000; SameSite=Lax`;
      document.cookie = `token=${resolvedToken}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string, targetRole: UserRole = 'FARMER') => {
    setLoading(true);
    const resolvedRole = targetRole || 'FARMER';
    const profile = defaultUserProfiles[resolvedRole];
    
    setSession('mock-jwt-token');
    setRole(resolvedRole);
    setUser(profile);

    try {
      localStorage.setItem('kisansetu_role', resolvedRole);
      localStorage.setItem('kisansetu_token', 'mock-jwt-token');
      document.cookie = `user_role=${resolvedRole}; path=/; max-age=31536000; SameSite=Lax`;
      document.cookie = `token=mock-jwt-token; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}

    setLoading(false);
  };

  const logout = () => {
    setSession(null);
    setUser(null);
    try {
      localStorage.removeItem('kisansetu_token');
      document.cookie = 'token=; path=/; max-age=0;';
    } catch {}
    router.push('/login');
  };

  const switchRole = (newRole: UserRole) => {
    if (!defaultUserProfiles[newRole]) return;
    setRole(newRole);
    setUser(defaultUserProfiles[newRole]);
    try {
      localStorage.setItem('kisansetu_role', newRole);
      document.cookie = `user_role=${newRole}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
