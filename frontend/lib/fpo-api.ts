import { API_BASE_URL } from './api';

export interface FPODashboardSummary {
  fpo_name: string;
  fpo_code: string;
  total_member_lots: number;
  pending_approval_lots: number;
  approved_pooled_lots: number;
  total_volume_tons: number;
  total_clusters: number;
  enrolled_farmers: number;
  warehouse_occupancy_pct: number;
  total_warehouse_capacity_mt: number;
  total_warehouse_occupied_mt: number;
  total_settled_dbt_payouts_inr: number;
  fpo_commission_inr: number;
  estimated_freight_savings_pct: number;
}

export interface FPOWarehouseBay {
  id: string;
  name: string;
  type: 'COLD_STORAGE' | 'DRY_GRAIN' | 'CONTROLLED_ATMOSPHERE';
  capacityTons: number;
  occupiedTons: number;
  tempCelcius: number;
  humidityPercent: number;
  assignedCrop: string;
  status: 'OPTIMAL' | 'NEAR_CAPACITY' | 'VENTILATING';
  enwrIssued: boolean;
  wdraCertified: boolean;
}

export interface FPOTender {
  id: string;
  title: string;
  commodity: string;
  total_quantity_tons: number;
  reserve_price_per_kg: number;
  delivery_mandi: string;
  deadline_date: string;
  status: string;
  participating_farmers_count?: number;
  escrow_locked_bids?: number;
}

export interface FPOLedgerTransaction {
  id: string;
  date: string;
  lot_id: number;
  farmer_name: string;
  commodity: string;
  quantity_kg: number;
  amount_inr: number;
  dbt_status: string;
  utr_number: string;
  fpo_commission_inr: number;
}

export async function fetchFPOSummary(): Promise<FPODashboardSummary> {
  const res = await fetch(`${API_BASE_URL}/api/fpo/dashboard/summary`);
  if (!res.ok) {
    throw new Error('Failed to fetch FPO summary metrics');
  }
  return res.json();
}

export async function fetchFPOLots(
  searchQuery?: string,
  statusFilter?: string,
  gradeFilter?: string
) {
  const params = new URLSearchParams();
  if (searchQuery) params.append('q', searchQuery);
  if (statusFilter && statusFilter !== 'ALL') params.append('status_filter', statusFilter);
  if (gradeFilter && gradeFilter !== 'ALL') params.append('grade_filter', gradeFilter);

  const url = `${API_BASE_URL}/api/fpo/lots?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch FPO member lots');
  }
  return res.json();
}

export async function createFPOLot(data: {
  farmer_name: string;
  farmer_phone?: string;
  commodity: string;
  variety?: string;
  quantity_kg: number;
  base_price_per_kg: number;
  quality_grade?: string;
  quality_score?: number;
  district?: string;
  state?: string;
  destination_mandi?: string;
  image_url?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/api/fpo/lots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to create FPO crop lot');
  }
  return res.json();
}

export async function updateFPOLotStatus(lotId: number, status: string) {
  const res = await fetch(`${API_BASE_URL}/api/fpo/lots/${lotId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to update lot status');
  }
  return res.json();
}

export async function updateFPOLot(
  lotId: number,
  data: {
    commodity?: string;
    variety?: string;
    quantity_kg?: number;
    base_price_per_kg?: number;
    quality_grade?: string;
    quality_score?: number;
    destination_mandi?: string;
  }
) {
  const res = await fetch(`${API_BASE_URL}/api/fpo/lots/${lotId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to edit FPO lot');
  }
  return res.json();
}

export async function deleteFPOLot(lotId: number) {
  const res = await fetch(`${API_BASE_URL}/api/fpo/lots/${lotId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to delete FPO lot');
  }
  return res.json();
}

export async function fetchFPOWarehouses(): Promise<FPOWarehouseBay[]> {
  const res = await fetch(`${API_BASE_URL}/api/fpo/warehouses`);
  if (!res.ok) {
    throw new Error('Failed to fetch FPO warehouse telemetry');
  }
  return res.json();
}

export async function inwardWarehouseBay(data: {
  bay_id: string;
  lot_id: number;
  quantity_tons: number;
  crop_assigned: string;
  notes?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/api/fpo/warehouses/inward`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to process warehouse inward');
  }
  return res.json();
}

export async function fetchFPOTenders(): Promise<FPOTender[]> {
  const res = await fetch(`${API_BASE_URL}/api/fpo/tenders`);
  if (!res.ok) {
    throw new Error('Failed to fetch FPO tenders');
  }
  return res.json();
}

export async function createFPOTender(data: {
  title: string;
  commodity: string;
  total_quantity_tons: number;
  reserve_price_per_kg: number;
  delivery_mandi: string;
  deadline_date: string;
}) {
  const res = await fetch(`${API_BASE_URL}/api/fpo/tenders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to create bulk tender');
  }
  return res.json();
}

export async function fetchFPOLedger(): Promise<FPOLedgerTransaction[]> {
  const res = await fetch(`${API_BASE_URL}/api/fpo/ledger`);
  if (!res.ok) {
    throw new Error('Failed to fetch FPO financial ledger');
  }
  return res.json();
}

export async function triggerFPODemoUpdate(lotId?: number, customNote?: string) {
  const res = await fetch(`${API_BASE_URL}/api/fpo/demo/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lot_id: lotId, custom_note: customNote }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to execute demo database update');
  }
  return res.json();
}

export async function resetFPODemo(lotId?: number) {
  const res = await fetch(`${API_BASE_URL}/api/fpo/demo/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lot_id: lotId }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to reset demo database lot');
  }
  return res.json();
}

