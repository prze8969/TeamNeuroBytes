export type UserRole = 'FARMER' | 'BUYER' | 'FPO' | 'ADMIN' | 'ORGANIZATION' | 'WAREHOUSE' | 'TRANSPORTATION';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  kycStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface CropLot {
  id: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  variety: string;
  quantityKg: number;
  grade: 'A' | 'B' | 'C' | 'UNGRADED';
  qualityScore: number; // e.g. 92.5 from YOLO model
  basePricePerKg: number;
  location: {
    lat: number;
    lng: number;
    district: string;
    state: string;
  };
  harvestDate: string;
  status: 'LISTED' | 'POOLED' | 'BIDDING' | 'SOLD';
}

export interface Bid {
  id: string;
  lotId: string;
  buyerId: string;
  buyerName: string;
  amountPerKg: number;
  totalAmount: number;
  escrowStatus: 'INITIATED' | 'LOCKED' | 'RELEASED';
  createdAt: string;
}

export interface GeoCluster {
  id: string;
  clusterName: string;
  centerLocation: { lat: number; lng: number };
  totalLotsCount: number;
  totalWeightKg: number;
  participatingFarmersCount: number;
  estimatedFreightSavingsPercent: number;
}

export interface MandiPrice {
  mandiName: string;
  state: string;
  district: string;
  commodity: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  date: string;
  forecastNextWeek?: number;
}
