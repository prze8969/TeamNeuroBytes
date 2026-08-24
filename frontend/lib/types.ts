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
  quantityTons?: number;
  grade: 'A' | 'B' | 'C' | 'UNGRADED';
  qualityGrade?: 'Grade A' | 'Grade B' | 'Grade C';
  qualityScore: number; // e.g. 94.2 from YOLO model
  basePricePerKg: number;
  askingFloorPerKg?: number;
  mandiAvgPerKg?: number;
  defectArea?: number; // percentage e.g. 2.1
  defectPercentage?: number;
  ripenessIndex?: number;
  moisture?: number; // percentage e.g. 11.8
  imageUrl?: string;
  origin?: string;
  distanceKm?: number;
  logisticsType?: 'Direct' | 'Shared Freight';
  freightPerKg?: number;
  freightSavingsPercent?: number;
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
