import { UserRole } from './types';

export const USER_ROLES: { label: string; value: UserRole }[] = [
  { label: 'Farmer', value: 'FARMER' },
  { label: 'Buyer / Miller / Exporter', value: 'BUYER' },
  { label: 'FPO / Aggregator', value: 'FPO' },
  { label: 'Warehouse & Cold Storage', value: 'WAREHOUSE' },
  { label: 'Transportation & Logistics', value: 'TRANSPORTATION' },
  { label: 'Administrator', value: 'ADMIN' },
];

export const CROP_GRADES = {
  A: { label: 'Grade A (Export / Premium)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  B: { label: 'Grade B (Standard Mandi)', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  C: { label: 'Grade C (Processing Grade)', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  UNGRADED: { label: 'Ungraded', color: 'bg-gray-100 text-gray-800 border-gray-300' },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  MARKETPLACE: {
    LOTS: '/marketplace/lots',
    BIDS: '/marketplace/bids',
  },
  AI: {
    GRADER: '/ai/grade-crop',
  },
  APMC: {
    PRICES: '/apmc/prices',
  },
};
