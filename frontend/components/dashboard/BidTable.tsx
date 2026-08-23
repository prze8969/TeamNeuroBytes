'use client'

import { Bid } from '@/lib/types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface BidTableProps {
  bids: Bid[];
  onAcceptBid?: (bidId: string) => void;
  isFarmerView?: boolean;
}

export function BidTable({ bids, onAcceptBid, isFarmerView }: BidTableProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Active Bids & Escrow Status</h3>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          {bids.length} Live Bids
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Buyer</TableHead>
            <TableHead>Offer / Kg</TableHead>
            <TableHead>Total Valuation</TableHead>
            <TableHead>Escrow Status</TableHead>
            <TableHead>Date</TableHead>
            {isFarmerView && <TableHead className="text-right">Action</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bids.map((bid) => (
            <TableRow key={bid.id}>
              <TableCell className="font-medium text-gray-900">{bid.buyerName}</TableCell>
              <TableCell className="font-semibold text-emerald-700">₹{bid.amountPerKg}/kg</TableCell>
              <TableCell className="font-bold text-gray-900">₹{bid.totalAmount.toLocaleString('en-IN')}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  bid.escrowStatus === 'LOCKED' ? 'bg-emerald-100 text-emerald-800' :
                  bid.escrowStatus === 'RELEASED' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {bid.escrowStatus}
                </span>
              </TableCell>
              <TableCell className="text-gray-500">{bid.createdAt}</TableCell>
              {isFarmerView && (
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => onAcceptBid && onAcceptBid(bid.id)}
                  >
                    Accept Bid
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
          {bids.length === 0 && (
            <TableRow>
              <TableCell colSpan={isFarmerView ? 6 : 5} className="text-center py-6 text-gray-500">
                No active bids placed yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
