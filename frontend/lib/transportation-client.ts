'use client';

/**
 * Transportation API client — talks to the real FastAPI backend
 * (/api/transporter/*). Every call fails soft so the dashboard can
 * gracefully fall back to the existing localStorage/demo behaviour
 * when the backend is unreachable. No business logic lives here.
 */

import { API_BASE_URL } from './api';

export interface CarrierProfileSummary {
  carrier_name: string;
  gstin: string;
  rating: number;
  total_trips_completed: number;
  available_escrow_balance_inr: number;
  active_vehicles_on_road: number;
}

export interface TripsResponse {
  status: string;
  carrier_profile: CarrierProfileSummary;
  active_trips: Record<string, unknown>[];
  open_tenders: Record<string, unknown>[];
}

export interface TransporterProfileResponse {
  status: 'SUCCESS' | 'NOT_FOUND';
  is_onboarded: boolean;
  user_name?: string | null;
  user_phone?: string | null;
  profile?: Record<string, unknown> | null;
}

export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
}

async function request<T>(url: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    });
    const data = res.ok ? await res.json().catch(() => null) : null;
    return {
      ok: res.ok,
      status: res.status,
      data,
      error: res.ok ? undefined : (data?.detail || `Request failed (${res.status})`),
    };
  } catch {
    return { ok: false, status: 0, data: null, error: 'Network error — backend unreachable' };
  }
}

/** GET /api/transporter/trips — load board tenders + active hauls + carrier summary. */
export function fetchTrips(): Promise<ApiResult<TripsResponse>> {
  return request<TripsResponse>(`${API_BASE_URL}/api/transporter/trips`);
}

/** GET /api/transporter/profile/me — DB-persisted fleet profile for the logged-in user. */
export function fetchTransporterProfile(params: { email?: string; userId?: string }): Promise<ApiResult<TransporterProfileResponse>> {
  const q = new URLSearchParams();
  if (params.email) q.set('email', params.email.trim().toLowerCase());
  if (params.userId) q.set('user_id', params.userId);
  return request<TransporterProfileResponse>(`${API_BASE_URL}/api/transporter/profile/me?${q.toString()}`);
}

/** POST /api/transporter/profile — persist the fleet profile (onboarding / settings). */
export function saveTransporterProfile(body: Record<string, unknown>): Promise<ApiResult<{ status: string; profile?: Record<string, unknown> }>> {
  return request(`${API_BASE_URL}/api/transporter/profile`, { method: 'POST', body: JSON.stringify(body) });
}

/** POST /api/transporter/accept-load — claim an open tender and assign driver + vehicle. */
export function acceptFreightLoad(body: {
  tender_id: string;
  driver_name: string;
  driver_phone: string;
  vehicle_number: string;
  vehicle_type: string;
}): Promise<ApiResult<{ status: string; message: string; trip?: Record<string, unknown> }>> {
  return request(`${API_BASE_URL}/api/transporter/accept-load`, { method: 'POST', body: JSON.stringify(body) });
}

/** POST /api/transporter/{vault_id}/claim-advance — 30% fuel advance from escrow. */
export function claimFuelAdvance(vaultId: number): Promise<ApiResult<{ status: string; utr_number: string; amount_inr: number; message: string }>> {
  return request(`${API_BASE_URL}/api/transporter/${vaultId}/claim-advance`, { method: 'POST' });
}

/** POST /api/transporter/{vault_id}/verify-otp — validate the farmgate loading OTP. */
export function verifyFarmgateOtp(vaultId: number, otp: string): Promise<ApiResult<{ status: string; message: string }>> {
  return request(`${API_BASE_URL}/api/transporter/${vaultId}/verify-otp`, { method: 'POST', body: JSON.stringify({ otp }) });
}

/** POST /api/transporter/{vault_id}/mark-arrival — arrive at the destination mandi. */
export function markMandiArrival(vaultId: number): Promise<ApiResult<{ status: string; message: string }>> {
  return request(`${API_BASE_URL}/api/transporter/${vaultId}/mark-arrival`, { method: 'POST' });
}

/** Google Maps turn-by-turn directions between two real coordinates (uses existing lat/lng data). */
export function mapsDirectionsUrl(from: { lat: number; lng: number }, to: { lat: number; lng: number }): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&travelmode=driving`;
}
