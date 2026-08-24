export type OrderStatus = 
  | 'PENDING' 
  | 'ASSIGNED' 
  | 'IN_TRANSIT' 
  | 'ARRIVED_AT_MANDI' 
  | 'DELIVERED' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type DeliveryStatus = 'ON_TIME' | 'DELAYED' | 'AT_RISK' | 'COMPLETED';

export type TransportMode = 'Truck' | 'Reefer Truck' | 'Container Van' | 'Multi-Axle' | 'Train' | 'Air';

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface LocationPoint {
  name: string;
  lat: number;
  lng: number;
  facility?: string;
  address?: string;
}

export interface DriverInfo {
  id?: string;
  name: string;
  phone: string;
  rating?: number;
  photoUrl?: string;
}

export interface VehicleInfo {
  registrationNumber: string;
  type: TransportMode;
  capacityTons: number;
  temperatureC?: number;
  humidityRh?: number;
}

export interface ShipmentInfo {
  packagesCount: number;
  weightTons: number;
  weightKg: number;
  cropName: string;
  variety: string;
  specialHandling?: string[];
  notes?: string;
}

export interface TrackingData {
  isLive: boolean;
  lastUpdatedText: string;
  currentLat: number;
  currentLng: number;
  speedKmh: number;
  headingDegrees?: number;
  freshnessStatus: 'LIVE' | 'RECENT' | 'STALE' | 'UNAVAILABLE';
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'COMPLETED' | 'CURRENT' | 'UPCOMING' | 'EXCEPTION';
}

export interface TransportationOrder {
  id: string;
  lotId: string;
  vaultId?: number;
  ewayBillNumber: string;
  customerName: string;
  farmerName: string;
  farmerPhone: string;
  status: OrderStatus;
  deliveryStatus: DeliveryStatus;
  priority: PriorityLevel;
  transportMode: TransportMode;
  origin: LocationPoint;
  destination: LocationPoint;
  pickupTime: string;
  estimatedArrivalTime: string;
  actualArrivalTime?: string;
  pickupAppointmentTime?: string;
  deliveryAppointmentTime?: string;
  totalDistanceKm: number;
  completedDistanceKm: number;
  distanceRemainingKm: number;
  delayMinutes: number;
  totalFreightInr: number;
  advanceFreightInr: number;
  advanceClaimed: boolean;
  advanceUtr?: string | null;
  balanceFreightInr: number;
  farmGateOtp?: string;
  driver: DriverInfo;
  vehicle: VehicleInfo;
  shipment: ShipmentInfo;
  tracking: TrackingData;
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilterState {
  searchQuery: string;
  status: OrderStatus | 'ALL';
  deliveryStatus: DeliveryStatus | 'ALL';
  transportMode: TransportMode | 'ALL';
  priority: PriorityLevel | 'ALL';
  timeRange: 'ALL' | 'TODAY' | 'TOMORROW' | 'THIS_WEEK';
}

export type OrderSortOption = 
  | 'eta_earliest'
  | 'eta_latest'
  | 'pickup_time'
  | 'created_newest'
  | 'created_oldest'
  | 'priority'
  | 'status'
  | 'distance_remaining'
  | 'customer_name'
  | 'destination';

export const DEFAULT_FILTER_STATE: OrderFilterState = {
  searchQuery: '',
  status: 'ALL',
  deliveryStatus: 'ALL',
  transportMode: 'ALL',
  priority: 'ALL',
  timeRange: 'ALL'
};

// Initial Mock Dataset with rich, systemized transportation orders
export const INITIAL_TRANSPORTATION_ORDERS: TransportationOrder[] = [
  {
    id: 'ORD-2026-881',
    lotId: 'LOT-1',
    vaultId: 1,
    ewayBillNumber: 'EWB-2026-98412',
    customerName: 'Reliance Retail Wholesale Ltd',
    farmerName: 'Ramesh Patil',
    farmerPhone: '+91 98231 49821',
    status: 'IN_TRANSIT',
    deliveryStatus: 'ON_TIME',
    priority: 'HIGH',
    transportMode: 'Reefer Truck',
    origin: {
      name: 'Nashik Cluster Farmgate, Maharashtra',
      lat: 19.9975,
      lng: 73.7898,
      facility: 'Farmgate Hub #3'
    },
    destination: {
      name: 'Vashi APMC Mandi Scale #4, Navi Mumbai',
      lat: 19.0760,
      lng: 72.9980,
      facility: 'Mandi Terminal Scale #4'
    },
    pickupTime: '2026-08-24T08:30:00Z',
    estimatedArrivalTime: '2026-08-24T14:45:00Z',
    pickupAppointmentTime: '2026-08-24T08:00:00Z',
    deliveryAppointmentTime: '2026-08-24T15:00:00Z',
    totalDistanceKm: 168,
    completedDistanceKm: 110,
    distanceRemainingKm: 58,
    delayMinutes: 0,
    totalFreightInr: 6000,
    advanceFreightInr: 1800,
    advanceClaimed: true,
    advanceUtr: 'UTR-ICICI-ADV-894210',
    balanceFreightInr: 4200,
    farmGateOtp: '4821',
    driver: {
      id: 'DRV-101',
      name: 'Suresh Rathod',
      phone: '+91 98231 49821',
      rating: 4.9
    },
    vehicle: {
      registrationNumber: 'MH-15-EG-4421',
      type: 'Reefer Truck',
      capacityTons: 10,
      temperatureC: 14.2,
      humidityRh: 68
    },
    shipment: {
      packagesCount: 100,
      weightTons: 5.0,
      weightKg: 5000,
      cropName: 'Sharbati Wheat',
      variety: 'Lok-1 Clean Grain',
      specialHandling: ['Temperature Controlled', 'Zero Moisture Contact'],
      notes: 'High-grade milling wheat for premium retail distribution'
    },
    tracking: {
      isLive: true,
      lastUpdatedText: 'Updated just now',
      currentLat: 19.4285,
      currentLng: 73.2941,
      speedKmh: 58,
      headingDegrees: 210,
      freshnessStatus: 'LIVE'
    },
    timeline: [
      {
        id: 'evt-1',
        title: 'Order Created',
        description: 'Confirmed crop deal via KisanSetu Procurement',
        timestamp: '08:00 AM',
        status: 'COMPLETED'
      },
      {
        id: 'evt-2',
        title: 'Carrier Assigned',
        description: 'Assigned to Suresh Rathod (MH-15-EG-4421)',
        timestamp: '08:15 AM',
        status: 'COMPLETED'
      },
      {
        id: 'evt-3',
        title: 'Farmgate Loading Completed',
        description: 'Farmgate OTP 4821 verified by driver',
        timestamp: '08:45 AM',
        status: 'COMPLETED'
      },
      {
        id: 'evt-4',
        title: '30% Fuel Advance Disbursed',
        description: '₹1,800 credited via UTR-ICICI-ADV-894210',
        timestamp: '09:00 AM',
        status: 'COMPLETED'
      },
      {
        id: 'evt-5',
        title: 'In Transit on NH-160',
        description: 'Reefer active at 14.2°C, 58 km/h',
        timestamp: '11:30 AM',
        status: 'CURRENT'
      },
      {
        id: 'evt-6',
        title: 'Arrival at Mandi Yard',
        description: 'Vashi APMC Mandi Scale #4 Handover',
        timestamp: 'Est 02:45 PM',
        status: 'UPCOMING'
      }
    ],
    createdAt: '2026-08-24T08:00:00Z',
    updatedAt: '2026-08-24T11:30:00Z'
  },
  {
    id: 'ORD-2026-882',
    lotId: 'LOT-2',
    vaultId: 2,
    ewayBillNumber: 'EWB-2026-98413',
    customerName: 'BigBasket Agri Procurement',
    farmerName: 'Sanjay Deshmukh',
    farmerPhone: '+91 98765 12345',
    status: 'ASSIGNED',
    deliveryStatus: 'AT_RISK',
    priority: 'HIGH',
    transportMode: 'Truck',
    origin: {
      name: 'Lasalgaon APMC Cluster, Nashik',
      lat: 20.1472,
      lng: 74.2274,
      facility: 'Lasalgaon Yard #1'
    },
    destination: {
      name: 'Pune Gultekdi Mandi, Pune',
      lat: 18.4975,
      lng: 73.8640,
      facility: 'Gultekdi Terminal B'
    },
    pickupTime: '2026-08-24T12:00:00Z',
    estimatedArrivalTime: '2026-08-24T17:30:00Z',
    pickupAppointmentTime: '2026-08-24T11:30:00Z',
    deliveryAppointmentTime: '2026-08-24T16:30:00Z',
    totalDistanceKm: 215,
    completedDistanceKm: 0,
    distanceRemainingKm: 215,
    delayMinutes: 60,
    totalFreightInr: 9600,
    advanceFreightInr: 2880,
    advanceClaimed: false,
    balanceFreightInr: 6720,
    farmGateOtp: '9120',
    driver: {
      id: 'DRV-102',
      name: 'Vikram Shinde',
      phone: '+91 98765 12345',
      rating: 4.7
    },
    vehicle: {
      registrationNumber: 'MH-12-PQ-9912',
      type: 'Truck',
      capacityTons: 12
    },
    shipment: {
      packagesCount: 160,
      weightTons: 8.0,
      weightKg: 8000,
      cropName: 'Nashik Red Onion',
      variety: 'Garva Premium',
      specialHandling: ['Ventilated Tarpaulin'],
      notes: 'Perishable onion shipment. Immediate loading required.'
    },
    tracking: {
      isLive: true,
      lastUpdatedText: 'Updated 2 mins ago',
      currentLat: 20.1472,
      currentLng: 74.2274,
      speedKmh: 0,
      freshnessStatus: 'RECENT'
    },
    timeline: [
      {
        id: 'evt-201',
        title: 'Order Tendered',
        description: 'Tender accepted by carrier Kisan Express',
        timestamp: '10:00 AM',
        status: 'COMPLETED'
      },
      {
        id: 'evt-202',
        title: 'Vehicle Dispatched to Origin',
        description: 'Driver Vikram assigned (MH-12-PQ-9912)',
        timestamp: '10:30 AM',
        status: 'CURRENT'
      },
      {
        id: 'evt-203',
        title: 'Farmgate OTP Verification',
        description: 'Pending farmer OTP 9120 verification',
        timestamp: 'Est 12:00 PM',
        status: 'UPCOMING'
      }
    ],
    createdAt: '2026-08-24T09:45:00Z',
    updatedAt: '2026-08-24T10:30:00Z'
  },
  {
    id: 'ORD-2026-883',
    lotId: 'LOT-3',
    vaultId: 3,
    ewayBillNumber: 'EWB-2026-98414',
    customerName: 'DMart Fresh Supplies',
    farmerName: 'Kailash Jadhav',
    farmerPhone: '+91 94220 88712',
    status: 'IN_TRANSIT',
    deliveryStatus: 'DELAYED',
    priority: 'HIGH',
    transportMode: 'Reefer Truck',
    origin: {
      name: 'Narayangaon Hub, Pune',
      lat: 19.1170,
      lng: 73.9780,
      facility: 'Narayangaon Packhouse'
    },
    destination: {
      name: 'Vashi APMC Mandi, Navi Mumbai',
      lat: 19.0760,
      lng: 72.9980,
      facility: 'Cold Hub Bay #2'
    },
    pickupTime: '2026-08-24T06:00:00Z',
    estimatedArrivalTime: '2026-08-24T19:15:00Z',
    pickupAppointmentTime: '2026-08-24T06:00:00Z',
    deliveryAppointmentTime: '2026-08-24T14:00:00Z',
    totalDistanceKm: 145,
    completedDistanceKm: 70,
    distanceRemainingKm: 75,
    delayMinutes: 315,
    totalFreightInr: 6400,
    advanceFreightInr: 1920,
    advanceClaimed: true,
    advanceUtr: 'UTR-ICICI-ADV-771120',
    balanceFreightInr: 4480,
    farmGateOtp: '3341',
    driver: {
      id: 'DRV-103',
      name: 'Ganesh More',
      phone: '+91 94220 88712',
      rating: 4.8
    },
    vehicle: {
      registrationNumber: 'MH-14-GH-1102',
      type: 'Reefer Truck',
      capacityTons: 6,
      temperatureC: 13.8,
      humidityRh: 72
    },
    shipment: {
      packagesCount: 200,
      weightTons: 4.0,
      weightKg: 4000,
      cropName: 'Hybrid Tomato',
      variety: 'Abhinav Class-1',
      specialHandling: ['Reefer 14°C', 'Shock Proof Crates'],
      notes: 'Severe traffic congestion on Ghat section causing delay'
    },
    tracking: {
      isLive: true,
      lastUpdatedText: 'Updated 1 min ago',
      currentLat: 19.2500,
      currentLng: 73.4000,
      speedKmh: 24,
      freshnessStatus: 'LIVE'
    },
    timeline: [
      {
        id: 'evt-301',
        title: 'Order Created',
        description: 'Tomato supply contract for DMart Fresh',
        timestamp: '05:30 AM',
        status: 'COMPLETED'
      },
      {
        id: 'evt-302',
        title: 'Loaded & Departed',
        description: 'Departed Narayangaon Hub at 13.8°C',
        timestamp: '06:15 AM',
        status: 'COMPLETED'
      },
      {
        id: 'evt-303',
        title: 'Traffic Exception Reported',
        description: 'Landslide on Malshej corridor delayed vehicle by 5 hours',
        timestamp: '09:45 AM',
        status: 'EXCEPTION'
      }
    ],
    createdAt: '2026-08-24T05:30:00Z',
    updatedAt: '2026-08-24T09:45:00Z'
  },
  {
    id: 'ORD-2026-884',
    lotId: 'LOT-4',
    vaultId: 4,
    ewayBillNumber: 'EWB-2026-98415',
    customerName: 'Star Bazaar Hypermarket',
    farmerName: 'Anil Thorat',
    farmerPhone: '+91 97640 11920',
    status: 'ARRIVED_AT_MANDI',
    deliveryStatus: 'ON_TIME',
    priority: 'MEDIUM',
    transportMode: 'Container Van',
    origin: {
      name: 'Pimpalgaon APMC Cluster, Nashik',
      lat: 20.1695,
      lng: 73.9870,
      facility: 'Pimpalgaon Yard'
    },
    destination: {
      name: 'Vashi APMC Mandi Scale #2, Navi Mumbai',
      lat: 19.0760,
      lng: 72.9980,
      facility: 'Mandi Scale #2'
    },
    pickupTime: '2026-08-24T05:00:00Z',
    estimatedArrivalTime: '2026-08-24T11:15:00Z',
    actualArrivalTime: '2026-08-24T11:10:00Z',
    totalDistanceKm: 180,
    completedDistanceKm: 180,
    distanceRemainingKm: 0,
    delayMinutes: 0,
    totalFreightInr: 11200,
    advanceFreightInr: 3360,
    advanceClaimed: true,
    advanceUtr: 'UTR-ICICI-ADV-664411',
    balanceFreightInr: 7840,
    farmGateOtp: '5512',
    driver: {
      id: 'DRV-104',
      name: 'Deepak Salunkhe',
      phone: '+91 97640 11920',
      rating: 4.95
    },
    vehicle: {
      registrationNumber: 'MH-15-DX-7788',
      type: 'Container Van',
      capacityTons: 14
    },
    shipment: {
      packagesCount: 220,
      weightTons: 11.0,
      weightKg: 11000,
      cropName: 'Thompson Seedless Grapes',
      variety: 'Export Quality Grade-A',
      specialHandling: ['Cushioned Crates', 'Fast-Track Handover'],
      notes: 'Arrived at APMC Mandi Yard. Awaiting weighbridge slip.'
    },
    tracking: {
      isLive: false,
      lastUpdatedText: 'Updated 10 mins ago',
      currentLat: 19.0760,
      currentLng: 72.9980,
      speedKmh: 0,
      freshnessStatus: 'RECENT'
    },
    timeline: [
      {
        id: 'evt-401',
        title: 'Farmgate Pickup',
        description: 'Loaded 11.0 MT Grapes at Pimpalgaon',
        timestamp: '05:00 AM',
        status: 'COMPLETED'
      },
      {
        id: 'evt-402',
        title: 'Highway Transit Completed',
        description: '180 km covered without delay',
        timestamp: '11:00 AM',
        status: 'COMPLETED'
      },
      {
        id: 'evt-403',
        title: 'Arrived at Vashi APMC',
        description: 'Parked at Scale #2 for weighbridge inspection',
        timestamp: '11:10 AM',
        status: 'COMPLETED'
      }
    ],
    createdAt: '2026-08-24T04:30:00Z',
    updatedAt: '2026-08-24T11:10:00Z'
  },
  {
    id: 'ORD-2026-885',
    lotId: 'LOT-5',
    vaultId: 5,
    ewayBillNumber: 'EWB-2026-98416',
    customerName: 'Sahyadri Farmers Producer Co.',
    farmerName: 'Mahesh Pawar',
    farmerPhone: '+91 99881 22334',
    status: 'PENDING',
    deliveryStatus: 'ON_TIME',
    priority: 'LOW',
    transportMode: 'Truck',
    origin: {
      name: 'Sangamner Hub, Ahmednagar',
      lat: 19.5770,
      lng: 74.2070
    },
    destination: {
      name: 'Pune Gultekdi Mandi, Pune',
      lat: 18.4975,
      lng: 73.8640
    },
    pickupTime: '2026-08-25T07:00:00Z',
    estimatedArrivalTime: '2026-08-25T12:30:00Z',
    totalDistanceKm: 150,
    completedDistanceKm: 0,
    distanceRemainingKm: 150,
    delayMinutes: 0,
    totalFreightInr: 7200,
    advanceFreightInr: 2160,
    advanceClaimed: false,
    balanceFreightInr: 5040,
    driver: {
      name: 'Unassigned',
      phone: 'N/A'
    },
    vehicle: {
      registrationNumber: 'Pending Allocation',
      type: 'Truck',
      capacityTons: 8
    },
    shipment: {
      packagesCount: 120,
      weightTons: 6.0,
      weightKg: 6000,
      cropName: 'Pomegranate (Bhagwa)',
      variety: 'Export Grade',
      notes: 'Scheduled for tomorrow morning pickup'
    },
    tracking: {
      isLive: false,
      lastUpdatedText: 'Awaiting truck dispatch',
      currentLat: 19.5770,
      currentLng: 74.2070,
      speedKmh: 0,
      freshnessStatus: 'UNAVAILABLE'
    },
    timeline: [
      {
        id: 'evt-501',
        title: 'Tender Published',
        description: 'Awaiting truck allocation by fleet dispatcher',
        timestamp: '11:00 AM',
        status: 'CURRENT'
      }
    ],
    createdAt: '2026-08-24T11:00:00Z',
    updatedAt: '2026-08-24T11:00:00Z'
  }
];

// Helper: Convert ActiveTrip / OpenTender into TransportationOrder
export function adaptTripToOrder(trip: any): TransportationOrder {
  const isAssigned = trip.status === 'ASSIGNED';
  const isInTransit = trip.status === 'IN_TRANSIT' || trip.current_milestone === 'IN_TRANSIT';
  const isArrived = trip.status === 'ARRIVED_AT_MANDI';

  const status: OrderStatus = isArrived ? 'ARRIVED_AT_MANDI' : isInTransit ? 'IN_TRANSIT' : isAssigned ? 'ASSIGNED' : 'PENDING';
  const deliveryStatus: DeliveryStatus = trip.temperature_c > 20 ? 'AT_RISK' : 'ON_TIME';

  return {
    id: `ORD-TRIP-${trip.id || 1}`,
    lotId: trip.lot_id || 'LOT-1',
    vaultId: trip.vault_id || 1,
    ewayBillNumber: trip.eway_bill_number || 'EWB-2026-98412',
    customerName: 'KisanSetu Mandi Logistics',
    farmerName: trip.farmer_name || 'Ramesh Patil',
    farmerPhone: trip.farmer_phone || '+91 98231 49821',
    status,
    deliveryStatus,
    priority: 'HIGH',
    transportMode: 'Reefer Truck',
    origin: {
      name: trip.origin || 'Nashik Cluster Farmgate, Maharashtra',
      lat: trip.current_lat || 19.9975,
      lng: trip.current_lng || 73.7898
    },
    destination: {
      name: trip.destination || 'Vashi APMC Mandi Scale #4 (Navi Mumbai)',
      lat: 19.0760,
      lng: 72.9980
    },
    pickupTime: trip.created_at || new Date().toISOString(),
    estimatedArrivalTime: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    totalDistanceKm: 168,
    completedDistanceKm: isInTransit ? 110 : isArrived ? 168 : 0,
    distanceRemainingKm: isInTransit ? 58 : isArrived ? 0 : 168,
    delayMinutes: 0,
    totalFreightInr: trip.total_freight_inr || 6000,
    advanceFreightInr: trip.advance_freight_inr || 1800,
    advanceClaimed: trip.advance_claimed || false,
    advanceUtr: trip.advance_utr || null,
    balanceFreightInr: trip.balance_freight_inr || 4200,
    farmGateOtp: trip.farm_gate_otp || '4821',
    driver: {
      id: `DRV-${trip.id}`,
      name: trip.driver_name || 'Suresh Rathod',
      phone: trip.driver_phone || '+91 98231 49821',
      rating: 4.9
    },
    vehicle: {
      registrationNumber: trip.vehicle_number || 'MH-15-EG-4421',
      type: 'Reefer Truck',
      capacityTons: trip.quantity_tons || 5,
      temperatureC: trip.temperature_c || 14.2,
      humidityRh: trip.humidity_rh || 68
    },
    shipment: {
      packagesCount: Math.round((trip.quantity_kg || 5000) / 50),
      weightTons: trip.quantity_tons || 5,
      weightKg: trip.quantity_kg || 5000,
      cropName: trip.crop_name || 'Sharbati Wheat',
      variety: trip.variety || 'Lok-1 Clean Grain',
      notes: 'Active haul tracked live on highway'
    },
    tracking: {
      isLive: true,
      lastUpdatedText: 'Updated just now',
      currentLat: trip.current_lat || 19.4285,
      currentLng: trip.current_lng || 73.2941,
      speedKmh: isInTransit ? 58 : 0,
      freshnessStatus: 'LIVE'
    },
    timeline: [
      {
        id: 'evt-1',
        title: 'Deal Confirmed & Assigned',
        description: `Assigned to ${trip.driver_name || 'Driver'} (${trip.vehicle_number || 'Vehicle'})`,
        timestamp: '08:15 AM',
        status: 'COMPLETED'
      },
      {
        id: 'evt-2',
        title: 'Farmgate Loading',
        description: `Farmgate OTP ${trip.farm_gate_otp || '4821'} verified`,
        timestamp: '08:45 AM',
        status: isInTransit || isArrived ? 'COMPLETED' : 'CURRENT'
      },
      {
        id: 'evt-3',
        title: 'Highway Telemetry Active',
        description: 'Broadcasting live GPS & cold-chain sensor metrics',
        timestamp: 'In Progress',
        status: isInTransit ? 'CURRENT' : isArrived ? 'COMPLETED' : 'UPCOMING'
      }
    ],
    createdAt: trip.created_at || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
