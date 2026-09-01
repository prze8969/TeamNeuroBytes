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
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, role?: UserRole, token?: string, customProfile?: Partial<UserProfile>) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

export const defaultUserProfiles: Record<UserRole, UserProfile> = {
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

export function normalizeRole(r?: string): UserRole {
  if (!r) return 'FARMER';
  const u = r.trim().toUpperCase();
  if (u === 'FPO' || u === 'ORGANIZATION') return 'ORGANIZATION';
  if (u === 'TRANSPORTER' || u === 'TRANSPORTATION') return 'TRANSPORTATION';
  if (u === 'WAREHOUSE') return 'WAREHOUSE';
  if (u === 'ADMIN') return 'ADMIN';
  if (u === 'BUYER') return 'BUYER';
  if (u === 'FARMER') return 'FARMER';
  return 'FARMER';
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  role: 'FARMER',
  isAuthenticated: false,
  loading: true,
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
      const cookieRoleMatch = typeof document !== 'undefined' ? document.cookie.match(/user_role=([A-Z_]+)/) : null;
      const cookieTokenMatch = typeof document !== 'undefined' ? document.cookie.match(/token=([^;]+)/) : null;
      
      const storedRoleRaw = cookieRoleMatch ? cookieRoleMatch[1] : (typeof localStorage !== 'undefined' ? localStorage.getItem('kisansetu_role') : null);
      const storedToken = cookieTokenMatch ? cookieTokenMatch[1] : (typeof localStorage !== 'undefined' ? localStorage.getItem('kisansetu_token') : null);

      if (storedToken && storedToken.trim() !== '' && storedToken !== 'null' && storedToken !== 'undefined') {
        let profile: UserProfile | null = null;
        if (typeof localStorage !== 'undefined') {
          const storedUser = localStorage.getItem('kisansetu_user');
          if (storedUser) {
            try { profile = JSON.parse(storedUser); } catch {}
          }
        }
        const resolvedRole: UserRole = normalizeRole(storedRoleRaw || 'FARMER');
        setRole(resolvedRole);
        setSession(storedToken.trim());
        setUser(profile || defaultUserProfiles[resolvedRole]);
      } else {
        setSession(null);
        setUser(null);
      }
    } catch {
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (
    email: string, 
    targetRole?: UserRole | string, 
    token: string = 'authenticated-session-token',
    customProfile?: Partial<UserProfile>
  ) => {
    setLoading(true);
    const resolvedRole = normalizeRole(targetRole as string);
    const baseProfile = defaultUserProfiles[resolvedRole] || defaultUserProfiles.FARMER;
    const profile: UserProfile = {
      ...baseProfile,
      email: email || baseProfile.email,
      role: resolvedRole,
      ...customProfile,
    };
    
    setSession(token);
    setRole(resolvedRole);
    setUser(profile);

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('kisansetu_role', resolvedRole);
        localStorage.setItem('kisansetu_token', token);
        localStorage.setItem('kisansetu_user', JSON.stringify(profile));
      }
      if (typeof document !== 'undefined') {
        document.cookie = `user_role=${resolvedRole}; path=/; max-age=31536000; SameSite=Lax`;
        document.cookie = `token=${token}; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch {}

    setLoading(false);
  };

  const logout = () => {
    setSession(null);
    setUser(null);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('kisansetu_token');
        localStorage.removeItem('kisansetu_role');
        localStorage.removeItem('kisansetu_user');
      }
      if (typeof document !== 'undefined') {
        document.cookie = 'token=; path=/; max-age=0;';
        document.cookie = 'user_role=; path=/; max-age=0;';
      }
    } catch {}
    router.push('/login');
  };

  const switchRole = (newRole: UserRole) => {
    const resolved = normalizeRole(newRole);
    if (!defaultUserProfiles[resolved]) return;
    setRole(resolved);
    setUser(defaultUserProfiles[resolved]);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('kisansetu_role', resolved);
      }
      if (typeof document !== 'undefined') {
        document.cookie = `user_role=${resolved}; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch {}
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        role, 
        isAuthenticated: Boolean(session && user), 
        loading, 
        login, 
        logout, 
        switchRole 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
