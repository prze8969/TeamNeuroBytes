'use client';

import { useState, useEffect, useCallback } from 'react';
import { CropLot, Bid } from '@/lib/types';
import { EscrowVaultData } from '@/components/dashboard/EscrowRails';
import { InvoiceOrderData } from '@/components/dashboard/TaxInvoiceModal';
import { BuyerAnalyticsData } from '@/components/dashboard/BuyerAnalyticsCards';
import { MOCK_CROP_LOTS } from '@/components/dashboard/VerifiedLotsGrid';
import { toast } from 'sonner';

export type BuyerTabType = 'marketplace' | 'active_deals' | 'ledger';

export interface BuyerProfile {
  business_name: string;
  buyer_type: string;
  gstin: string;
  apmc_license_no: string;
  is_verified: boolean;
  preferred_apmc_mandi: string;
  delivery_address: string;
}

export const DEFAULT_ACTIVE_VAULTS: EscrowVaultData[] = [
  {
    id: 101,
    bid_id: 101,
    lot_id: 1,
    crop_name: 'Sharbati Wheat (Lok-1)',
    variety: 'Lok-1 Clean Grain',
    farmer_name: 'Ramesh Patil',
    farmer_district: 'Nashik Cluster, Maharashtra',
    total_locked_amount: 130338,
    crop_total_amount: 122500,
    total_freight_cost: 6000,
    advance_freight_amount: 1800,
    advance_freight_disbursed: 1800,
    balance_freight_amount: 4200,
    farmer_payout_amount: 122500,
    platform_fee_inr: 1838,
    current_milestone: 'IN_TRANSIT',
    status: 'IN_TRANSIT',
    farm_gate_otp: '4821',
    destination_delivery_otp: '7394',
    carrier_name: 'Kisan Express Logistics',
    vehicle_number: 'MH-15-EG-4421',
    dispute_reason: null
  },
  {
    id: 102,
    bid_id: 102,
    lot_id: 2,
    crop_name: 'Nashik Red Onion (Garva)',
    variety: 'Export Grade A',
    farmer_name: 'Suresh Deshmukh',
    farmer_district: 'Lasalgaon Mandi Hub',
    total_locked_amount: 108500,
    crop_total_amount: 100000,
    total_freight_cost: 7000,
    advance_freight_amount: 2100,
    advance_freight_disbursed: 0,
    balance_freight_amount: 4900,
    farmer_payout_amount: 100000,
    platform_fee_inr: 1500,
    current_milestone: 'LOCKED',
    status: 'FUNDS_LOCKED',
    farm_gate_otp: '6192',
    destination_delivery_otp: '8821',
    carrier_name: 'Sahyadri Cold-Chain',
    vehicle_number: 'MH-15-AK-9102',
    dispute_reason: null
  }
];

export function useBuyerState() {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState<BuyerTabType>('marketplace');

  // Core Marketplace & Transaction Collections
  const [lots, setLots] = useState<CropLot[]>(MOCK_CROP_LOTS);
  const [bids, setBids] = useState<Bid[]>([]);
  const [orders, setOrders] = useState<InvoiceOrderData[]>([]);

  // Multi-Deal Escrow Vaults State
  const [activeVaults, setActiveVaults] = useState<EscrowVaultData[]>(DEFAULT_ACTIVE_VAULTS);
  const [selectedDealId, setSelectedDealId] = useState<number | null>(101);

  const [analytics, setAnalytics] = useState<BuyerAnalyticsData>({
    total_spend_inr: 1842850,
    spend_change_pct: 14.2,
    total_volume_tons: 84.5,
    volume_change_pct: 8.5,
    logistics_savings_inr: 48200,
    logistics_savings_pct: 35.0,
    avg_quality_score: 92.4,
    grade_a_percentage: 88.0
  });

  // Modal / Drawer Selection States
  const [inspectionLot, setInspectionLot] = useState<CropLot | null>(null);
  const [isInspectionOpen, setIsInspectionOpen] = useState<boolean>(false);

  const [biddingLot, setBiddingLot] = useState<CropLot | null>(null);
  const [isBiddingOpen, setIsBiddingOpen] = useState<boolean>(false);

  const [isWeighbridgeOpen, setIsWeighbridgeOpen] = useState<boolean>(false);

  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<InvoiceOrderData | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);

  // Loading & Feedback
  const [loadingBidLotId, setLoadingBidLotId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Buyer Profile
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile>({
    business_name: 'AgroProcure Private Ltd',
    buyer_type: 'PROCESSOR',
    gstin: '27AABCA1234F1Z5',
    apmc_license_no: 'APMC-MH-NSK-2024-892',
    is_verified: true,
    preferred_apmc_mandi: 'Vashi APMC Mandi Scale #4',
    delivery_address: 'Plot 42, Turbhe Vashi APMC Terminal, Navi Mumbai 400703'
  });

  const triggerToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 5000);
  }, []);

  // Hydrate State on Mount (SSR Safe)
  useEffect(() => {
    setIsMounted(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab');
      if (urlTab === 'active_deals' || urlTab === 'ledger' || urlTab === 'marketplace') {
        setActiveTab(urlTab);
      } else {
        const savedTab = localStorage.getItem('kisansetu_buyer_tab') as BuyerTabType;
        if (savedTab === 'active_deals' || savedTab === 'ledger' || savedTab === 'marketplace') {
          setActiveTab(savedTab);
        }
      }

      const savedVaults = localStorage.getItem('kisansetu_active_vaults');
      if (savedVaults) {
        const parsed = JSON.parse(savedVaults);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setActiveVaults(parsed);
          setSelectedDealId(parsed[0]?.id || 101);
        }
      }

      const savedOrders = localStorage.getItem('kisansetu_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
      const savedBids = localStorage.getItem('kisansetu_bids');
      if (savedBids) {
        setBids(JSON.parse(savedBids));
      }
    } catch {}
  }, []);

  // Automatic LocalStorage Persistence
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('kisansetu_active_vaults', JSON.stringify(activeVaults));
    } catch {}
  }, [activeVaults, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('kisansetu_orders', JSON.stringify(orders));
    } catch {}
  }, [orders, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('kisansetu_bids', JSON.stringify(bids));
    } catch {}
  }, [bids, isMounted]);

  // Tab Switcher with Persistence
  const handleTabChange = useCallback((tab: BuyerTabType) => {
    setActiveTab(tab);
    try {
      localStorage.setItem('kisansetu_buyer_tab', tab);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    } catch {}
  }, []);

  // =========================================================================
  // MULTI-DEAL IMMUTABLE STATE MUTATION HELPERS
  // =========================================================================

  /** Add a brand new active escrow deal to the collection */
  const addActiveDeal = useCallback((newDeal: EscrowVaultData) => {
    setActiveVaults(prev => {
      // Prevent duplicates by ID
      const filtered = prev.filter(d => d.id !== newDeal.id);
      return [newDeal, ...filtered];
    });
    setSelectedDealId(newDeal.id);
  }, []);

  /** Update a specific deal's milestone or field without mutating other deals */
  const updateDealMilestone = useCallback((dealId: number, updates: Partial<EscrowVaultData>) => {
    setActiveVaults(prev => prev.map(deal => {
      if (deal.id === dealId) {
        return { ...deal, ...updates };
      }
      return deal;
    }));
  }, []);

  /** Move deal to settled orders ledger and remove from active tracking */
  const settleDeal = useCallback((dealId: number, invoiceNumber: string) => {
    const targetDeal = activeVaults.find(d => d.id === dealId) || activeVaults[0];
    if (!targetDeal) return;

    // 1. Build historical order record
    const newOrder: InvoiceOrderData = {
      order_id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      invoice_number: invoiceNumber,
      lot_id: `LOT-${targetDeal.lot_id || 1}`,
      commodity: targetDeal.crop_name || 'Agricultural Produce',
      variety: targetDeal.variety || 'Certified Grade A',
      quantity_tons: 5.0,
      quantity_kg: 5000,
      unit_price_kg: (targetDeal.crop_total_amount || 122500) / 5000,
      base_crop_value: targetDeal.crop_total_amount || 122500,
      freight_charges: targetDeal.total_freight_cost || 6000,
      apmc_cess: targetDeal.platform_fee_inr || 1838,
      total_settlement: targetDeal.total_locked_amount || 130338,
      farmer_name: targetDeal.farmer_name || 'Ramesh Patil',
      farmer_district: targetDeal.farmer_district || 'Nashik Cluster, Maharashtra',
      carrier_name: targetDeal.carrier_name || 'Kisan Express Logistics',
      vehicle_number: targetDeal.vehicle_number || 'MH-15-EG-4421',
      eway_bill_number: `EWB-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      escrow_status: 'SETTLED',
      quality_grade: 'Grade A Certified',
      handover_date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      dbt_utr: `UTR-ICICI-2026-${Date.now().toString().slice(-6)}`,
      weighbridge_slip: `WB-2026-VASHI-${Math.floor(100 + Math.random() * 900)}.pdf`
    };

    setOrders(prev => [newOrder, ...prev]);

    // 2. Remove settled deal from active vaults collection
    setActiveVaults(prev => {
      const remaining = prev.filter(d => d.id !== dealId);
      if (remaining.length > 0) {
        setSelectedDealId(remaining[0].id);
      } else {
        setSelectedDealId(null);
      }
      return remaining;
    });

    toast.success('⚖️ Settlement Completed & Tax Invoice Ready', {
      description: `Invoice ${invoiceNumber} archived to ledger. 100% payout disbursed to ${targetDeal.farmer_name}.`,
      duration: 5000,
    });
  }, [activeVaults]);

  /** Freeze specific deal under APMC dispute */
  const disputeDeal = useCallback((dealId: number, ticketId: string) => {
    updateDealMilestone(dealId, {
      current_milestone: 'DISPUTED',
      status: 'DISPUTED',
      dispute_reason: `APMC Dispute Ticket #${ticketId} Opened`
    });
    triggerToast(`🚨 Escrow Vault #${dealId} FROZEN! APMC Arbitration Ticket #${ticketId} opened.`);
  }, [updateDealMilestone, triggerToast]);

  // Derived focused deal
  const selectedVault: EscrowVaultData | null = 
    activeVaults.find(v => v.id === selectedDealId) || activeVaults[0] || null;

  // Active Deals Count (Excluding Settled)
  const activeDealsCount = activeVaults.filter(v => v.status !== 'SETTLED').length;

  // =========================================================================
  // API DATA SYNCHRONIZATION
  // =========================================================================
  const fetchLiveMarketplaceData = useCallback(async () => {
    try {
      const resLots = await fetch('http://localhost:8000/api/marketplace/lots');
      if (resLots.ok) {
        const data = await resLots.json();
        if (Array.isArray(data) && data.length > 0) {
          const mappedLots: CropLot[] = data.map((item: any) => ({
            id: `LOT-${item.id}`,
            farmerId: String(item.farmer_id),
            farmerName: item.farmer_name || 'Ramesh Patil',
            cropName: item.commodity || 'Wheat',
            variety: item.variety || 'Hybrid',
            quantityKg: item.quantity_kg || 5000,
            quantityTons: item.quantity_tons || ((item.quantity_kg || 5000) / 1000),
            grade: (item.grade === 'B' ? 'B' : item.grade === 'C' ? 'C' : 'A') as 'A' | 'B' | 'C',
            qualityGrade: (item.grade === 'B' ? 'Grade B' : item.grade === 'C' ? 'Grade C' : 'Grade A') as ('Grade A' | 'Grade B' | 'Grade C'),
            qualityScore: item.quality_score || 94.2,
            basePricePerKg: item.base_price_per_kg || 24.5,
            askingFloorPerKg: item.base_price_per_kg || 24.5,
            mandiAvgPerKg: item.market_reference_price || ((item.base_price_per_kg || 24.5) * 0.94),
            freightPerKg: 1.20,
            origin: item.farmer_district || 'Nashik Cluster, Maharashtra',
            distanceKm: item.distance_km || 38,
            harvestDate: item.harvest_date || '2026-08-23',
            status: (item.status === 'POOLED' ? 'POOLED' : item.status === 'BIDDING' ? 'BIDDING' : item.status === 'SOLD' ? 'SOLD' : 'LISTED') as 'LISTED' | 'POOLED' | 'BIDDING' | 'SOLD',
            location: {
              lat: item.latitude || 19.9975,
              lng: item.longitude || 73.7898,
              district: item.district || item.farmer_district || 'Nashik',
              state: item.state || 'Maharashtra'
            },
            defectPercentage: item.defect_percentage || 1.4,
            defectArea: item.defect_percentage || 1.4,
            ripenessIndex: item.ripeness_index || 95.0,
            imageUrl: item.image_url
          }));
          setLots(mappedLots);
        }
      }

      const resBids = await fetch('http://localhost:8000/api/escrow/bids');
      if (resBids.ok) {
        const data = await resBids.json();
        if (Array.isArray(data) && data.length > 0) {
          const mappedBids: Bid[] = data.map((b: any) => ({
            id: `BID-${b.id}`,
            lotId: `LOT-${b.lot_id}`,
            buyerId: String(b.buyer_id || '2'),
            buyerName: b.buyer_name || 'AgroProcure Ltd',
            amountPerKg: b.bid_price_per_kg || b.amount_per_kg || 24.50,
            cropName: b.crop_name || 'Sharbati Wheat',
            bidAmountPerKg: b.bid_price_per_kg,
            totalAmount: b.total_amount || b.total_escrow_amount,
            escrowStatus: b.escrow_status || (b.status === 'ACCEPTED' ? 'LOCKED' : 'INITIATED'),
            createdAt: b.created_at || '2026-08-24 14:30',
            logisticsCarrier: b.carrier_name || 'Kisan Express Logistics'
          }));
          setBids(mappedBids);
        }
      }
    } catch {}
  }, []);

  // =========================================================================
  // MODAL HANDLERS
  // =========================================================================
  const openInspection = (lot: CropLot) => {
    setInspectionLot(lot);
    setIsInspectionOpen(true);
  };

  const closeInspection = () => {
    setIsInspectionOpen(false);
    setInspectionLot(null);
  };

  const openBidding = (lot: CropLot) => {
    setBiddingLot(lot);
    setIsBiddingOpen(true);
  };

  const closeBidding = () => {
    setIsBiddingOpen(false);
    setBiddingLot(null);
  };

  const openWeighbridge = () => setIsWeighbridgeOpen(true);
  const closeWeighbridge = () => setIsWeighbridgeOpen(false);

  const openInvoice = (order: InvoiceOrderData) => {
    setSelectedInvoiceOrder(order);
    setIsInvoiceOpen(true);
  };

  const closeInvoice = () => {
    setIsInvoiceOpen(false);
    setSelectedInvoiceOrder(null);
  };

  // =========================================================================
  // SUBMISSION: PLACE BID & LOCK ESCROW (APPENDS NEW DEAL)
  // =========================================================================
  const handleConfirmBidAndEscrow = async (bidData: {
    lotId: string;
    bidPricePerKg: number;
    totalCropValue: number;
    carrierId?: string;
    carrierName?: string;
    carrierRatePerKg?: number;
    freightRatePerKg?: number;
    estimatedFreight: number;
    apmcCessFee: number;
    totalEscrowAmount: number;
    paymentMethod: string;
    deliveryDeadlineDays?: number;
    deliveryDays?: number;
  }) => {
    const numericLotId = parseInt(bidData.lotId.replace(/\D/g, ''), 10) || 1;
    setLoadingBidLotId(bidData.lotId);

    const carrierNames: Record<string, string> = {
      KISAN_EXPRESS: 'Kisan Express Logistics',
      SAHYADRI_COLD: 'Sahyadri Cold-Chain',
      MAHINDRA_LOGISTICS: 'Mahindra Agri Logistics (Solo)',
      MANDI_DIRECT: 'Mandi Direct Express'
    };
    const chosenCarrier = bidData.carrierName || carrierNames[bidData.carrierId || ''] || 'Kisan Express Logistics';
    const targetCrop = biddingLot?.cropName || 'Sharbati Wheat';
    const uniqueVaultId = Number(Date.now().toString().slice(-6));

    // 1. Construct distinct new active deal object
    const newActiveDeal: EscrowVaultData = {
      id: uniqueVaultId,
      bid_id: 100 + (uniqueVaultId % 900),
      lot_id: numericLotId,
      crop_name: targetCrop,
      variety: biddingLot?.variety || 'Grade A Standard',
      farmer_name: biddingLot?.farmerName || 'Ramesh Patil',
      farmer_district: biddingLot?.origin || 'Nashik Cluster, Maharashtra',
      total_locked_amount: bidData.totalEscrowAmount,
      crop_total_amount: bidData.totalCropValue,
      total_freight_cost: bidData.estimatedFreight,
      advance_freight_amount: Math.round(bidData.estimatedFreight * 0.30),
      advance_freight_disbursed: 0,
      balance_freight_amount: Math.round(bidData.estimatedFreight * 0.70),
      farmer_payout_amount: bidData.totalCropValue,
      platform_fee_inr: bidData.apmcCessFee,
      current_milestone: 'LOCKED',
      status: 'FUNDS_LOCKED',
      farm_gate_otp: `${Math.floor(1000 + Math.random() * 9000)}`,
      destination_delivery_otp: `${Math.floor(1000 + Math.random() * 9000)}`,
      carrier_name: chosenCarrier,
      vehicle_number: `MH-15-EG-${Math.floor(1000 + Math.random() * 9000)}`
    };

    // 2. Append to active multi-deal state
    addActiveDeal(newActiveDeal);

    // 3. Post to backend if available
    try {
      await fetch('http://localhost:8000/api/marketplace/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lot_id: numericLotId,
          buyer_id: 2,
          buyer_name: buyerProfile.business_name,
          amount_per_kg: bidData.bidPricePerKg,
          delivery_deadline_days: bidData.deliveryDeadlineDays,
          note: `Escrow Locked via ${bidData.paymentMethod} with ${chosenCarrier}`
        })
      });
    } catch {}

    setLoadingBidLotId(null);
    setIsBiddingOpen(false);
    setIsInspectionOpen(false);

    // 4. Seamless Transition: Auto-switch to Tab 2 and focus the newly locked deal
    handleTabChange('active_deals');
    toast.success(`🎉 Escrow Vault #${uniqueVaultId} Locked Successfully`, {
      description: `₹${bidData.totalEscrowAmount.toLocaleString('en-IN')} committed for ${targetCrop}. Switched to Active Fulfillment.`,
      duration: 5000,
    });
  };

  return {
    isMounted,
    activeTab,
    setActiveTab: handleTabChange,
    lots,
    bids,
    orders,
    analytics,
    // Multi-Deal State & Handlers
    activeVaults,
    selectedDealId,
    setSelectedDealId,
    selectedVault,
    addActiveDeal,
    updateDealMilestone,
    settleDeal,
    disputeDeal,
    activeDealsCount,
    // Profile & Toast
    buyerProfile,
    toastMsg,
    setToastMsg,
    triggerToast,
    loadingBidLotId,
    // Inspection
    inspectionLot,
    isInspectionOpen,
    openInspection,
    closeInspection,
    // Bidding
    biddingLot,
    isBiddingOpen,
    openBidding,
    closeBidding,
    handleConfirmBidAndEscrow,
    // Weighbridge
    isWeighbridgeOpen,
    openWeighbridge,
    closeWeighbridge,
    handleSettlementComplete: (invoiceNum: string) => {
      if (selectedVault) {
        settleDeal(selectedVault.id, invoiceNum);
      }
    },
    handleDisputeRaised: (ticketId: string) => {
      if (selectedVault) {
        disputeDeal(selectedVault.id, ticketId);
      }
    },
    // Invoice
    selectedInvoiceOrder,
    isInvoiceOpen,
    openInvoice,
    closeInvoice,
    // Refresh
    fetchLiveMarketplaceData
  };
}
