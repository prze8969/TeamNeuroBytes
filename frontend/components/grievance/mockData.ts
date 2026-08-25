import { GrievanceStatus } from './GrievanceStatusBadge';
import { EscrowStatus } from './EscrowStatusCard';

export interface GrievanceTicket {
  id: string;
  lotId: string;
  farmer: string;
  buyer: string;
  transporter?: string;
  commodity: string;
  variety: string;
  issueDescription: string;
  amountInDispute: number;
  status: GrievanceStatus;
  escrowStatus: EscrowStatus;
  dateRaised: string;
  slaDeadline: string;
  resolvedAt?: string;
  resolutionOutcome?: 'REFUNDED' | 'RELEASED';
}

export const mockGrievances: GrievanceTicket[] = [
  {
    id: 'DIGT4012',
    lotId: 'LOT-982',
    farmer: 'Sanjay Shinde',
    buyer: 'AgroProcure Ltd',
    transporter: 'Pawar Logistics',
    commodity: 'Tomato',
    variety: 'Hybrid Vaishali',
    issueDescription: 'Weight shortage of 45kg claimed at buyer weighbridge during QC check. Farmer disputes this claim stating loading weight was verified.',
    amountInDispute: 832.50,
    status: 'UNDER_REVIEW',
    escrowStatus: 'FROZEN',
    dateRaised: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(), // 22 hours from now
  },
  {
    id: 'DIGT4015',
    lotId: 'LOT-773',
    farmer: 'Ramesh Patil',
    buyer: 'Modern Retail Corp',
    commodity: 'Wheat',
    variety: 'Sharbati Lok-1',
    issueDescription: 'Quality dispute. Buyer claims moisture content is 14% vs the AI graded 11%.',
    amountInDispute: 125000.00,
    status: 'OPEN',
    escrowStatus: 'FROZEN',
    dateRaised: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 26 hours ago
    slaDeadline: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours overdue
  },
  {
    id: 'DIGT3990',
    lotId: 'LOT-502',
    farmer: 'Anil Deshmukh',
    buyer: 'FreshFoods India',
    commodity: 'Onion',
    variety: 'Red Nashik',
    issueDescription: 'Transit damage reported by transporter, buyer refused delivery.',
    amountInDispute: 45000.00,
    status: 'RESOLVED',
    escrowStatus: 'RELEASED',
    dateRaised: '2026-08-20T10:00:00Z',
    slaDeadline: '2026-08-21T10:00:00Z',
    resolvedAt: '2026-08-21T09:30:00Z',
    resolutionOutcome: 'REFUNDED'
  }
];
