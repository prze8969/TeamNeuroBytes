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

export const DEFAULT_ESCROW_VAULT: EscrowVaultData = {
  id: 1,
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
  advance_freight_disbursed: 0,
  balance_freight_amount: 4200,
  farmer_payout_amount: 122500,
  platform_fee_inr: 1838,
  current_milestone: 'LOCKED',
  status: 'FUNDS_LOCKED',
  farm_gate_otp: '4821',
  destination_delivery_otp: '7394',
  carrier_name: 'Kisan Express Logistics',
  vehicle_number: 'MH-15-EG-4421',
  tax_invoice_number: undefined,
  dispute_reason: null
};

export function useBuyerState() {
  // Navigation State with Lazy Initializer
  const [activeTab, setActiveTab] = useState<BuyerTabType>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kisansetu_buyer_tab');
        if (saved === 'active_deals' || saved === 'ledger' || saved === 'marketplace') {
          return saved;
        }
      } catch {}
    }
    return 'marketplace';
  });

  // Core Data with Lazy Initializers
  const [lots, setLots] = useState<CropLot[]>(MOCK_CROP_LOTS);
  const [bids, setBids] = useState<Bid[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kisansetu_bids');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });
  const [orders, setOrders] = useState<InvoiceOrderData[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kisansetu_orders');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });
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

  // Active Deal / Escrow Vault State with Lazy Initializer
  const [activeVault, setActiveVault] = useState<EscrowVaultData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kisansetu_active_vault');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_ESCROW_VAULT;
  });

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

  // Setters
  const updateActiveVault = useCallback((newVaultOrUpdater: EscrowVaultData | ((prev: EscrowVaultData) => EscrowVaultData)) => {
    setActiveVault(newVaultOrUpdater);
  }, []);

  const updateOrders = useCallback((newOrdersOrUpdater: InvoiceOrderData[] | ((prev: InvoiceOrderData[]) => InvoiceOrderData[])) => {
    setOrders(newOrdersOrUpdater);
  }, []);

  const handleTabChange = useCallback((tab: BuyerTabType) => {
    setActiveTab(tab);
    try {
      localStorage.setItem('kisansetu_buyer_tab', tab);
    } catch {}
  }, []);

  // Automatic LocalStorage Persistence via pure useEffects
  useEffect(() => {
    try {
      localStorage.setItem('kisansetu_active_vault', JSON.stringify(activeVault));
    } catch {}
  }, [activeVault]);

  useEffect(() => {
    try {
      localStorage.setItem('kisansetu_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('kisansetu_bids', JSON.stringify(bids));
    } catch {}
  }, [bids]);

  // Listen to cross-window storage updates
  useEffect(() => {
    try {
      const savedVault = localStorage.getItem('kisansetu_active_vault');
      if (savedVault) {
        setActiveVault(JSON.parse(savedVault));
      }
      const savedOrders = localStorage.getItem('kisansetu_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
      const savedBids = localStorage.getItem('kisansetu_bids');
      if (savedBids) {
        setBids(JSON.parse(savedBids));
      }
      const savedTab = localStorage.getItem('kisansetu_buyer_tab') as BuyerTabType;
      if (savedTab) {
        setActiveTab(savedTab);
      }
    } catch {}

    const handleStorageEvent = (e: StorageEvent) => {
      try {
        if (e.key === 'kisansetu_active_vault' && e.newValue) {
          setActiveVault(JSON.parse(e.newValue));
        }
        if (e.key === 'kisansetu_orders' && e.newValue) {
          setOrders(JSON.parse(e.newValue));
        }
        if (e.key === 'kisansetu_bids' && e.newValue) {
          setBids(JSON.parse(e.newValue));
        }
      } catch {}
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  // Fetch Live Data from Backend API
  const fetchLiveMarketplaceData = useCallback(async () => {
    try {
      // 1. Fetch Lots
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
            imageUrl: item.image_url
          }));
          setLots(mappedLots);
        }
      }

      // 2. Fetch Bids
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
            escrowStatus: (b.status === 'RELEASED' ? 'RELEASED' : 'LOCKED') as 'INITIATED' | 'LOCKED' | 'RELEASED',
            createdAt: new Date(b.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setBids(mappedBids);
          try { localStorage.setItem('kisansetu_bids', JSON.stringify(mappedBids)); } catch {}
        }
      }

      // 3. Fetch Analytics
      const resAnalytics = await fetch('http://localhost:8000/api/buyer/analytics');
      if (resAnalytics.ok) {
        const analyticsData = await resAnalytics.json();
        setAnalytics(analyticsData);
      }

      // 4. Fetch Orders
      const resOrders = await fetch('http://localhost:8000/api/buyer/orders');
      if (resOrders.ok) {
        const orderData = await resOrders.json();
        if (Array.isArray(orderData) && orderData.length > 0) {
          setOrders(orderData);
          try { localStorage.setItem('kisansetu_orders', JSON.stringify(orderData)); } catch {}
        }
      }
    } catch {
      // Offline fallback: retains persisted local state
    }
  }, []);

  useEffect(() => {
    fetchLiveMarketplaceData();
  }, [fetchLiveMarketplaceData]);

  // Inspection Actions
  const openInspection = (lot: CropLot) => {
    setInspectionLot(lot);
    setIsInspectionOpen(true);
  };

  const closeInspection = () => {
    setIsInspectionOpen(false);
  };

  // Bidding Actions
  const openBidding = (lot: CropLot) => {
    setBiddingLot(lot);
    setIsBiddingOpen(true);
  };

  const closeBidding = () => {
    setIsBiddingOpen(false);
  };

  // Weighbridge Actions
  const openWeighbridge = () => {
    setIsWeighbridgeOpen(true);
  };

  const closeWeighbridge = () => {
    setIsWeighbridgeOpen(false);
  };

  // Tax Invoice Actions
  const openInvoice = (order: InvoiceOrderData) => {
    setSelectedInvoiceOrder(order);
    setIsInvoiceOpen(true);
  };

  const closeInvoice = () => {
    setIsInvoiceOpen(false);
  };

  // Confirm Bid & Escrow Lock Handler (Auto-switches tab to Active Fulfillment!)
  const handleConfirmBidAndEscrow = async (bidData: {
    lotId: string;
    bidPricePerKg: number;
    paymentMethod: string;
    deliveryDays: number;
    totalCropValue: number;
    estimatedFreight: number;
    apmcCessFee: number;
    totalEscrowAmount: number;
    carrierId?: string;
    carrierName?: string;
    freightRatePerKg?: number;
  }) => {
    const numericLotId = parseInt(bidData.lotId.replace(/\D/g, ''), 10) || 1;
    const targetCrop = biddingLot?.cropName || 'Crop Lot';
    const chosenCarrier = bidData.carrierName || 'Kisan Express Logistics';
    setLoadingBidLotId(bidData.lotId);

    try {
      const res = await fetch('http://localhost:8000/api/escrow/bids/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lot_id: numericLotId,
          buyer_id: 2,
          buyer_name: `${buyerProfile.business_name} (Your Bid)`,
          bid_price_per_kg: bidData.bidPricePerKg,
          payment_method: bidData.paymentMethod,
          delivery_deadline_days: bidData.deliveryDays,
          carrier_name: chosenCarrier,
          note: `Escrow-backed institutional procurement via ${chosenCarrier} (Total: ₹${bidData.totalEscrowAmount.toLocaleString('en-IN')})`
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.vault) {
          updateActiveVault(data.vault);
        }
      }
    } catch {
      // Optimistic local state fallback
      const mockVault: EscrowVaultData = {
        id: Date.now() % 1000,
        bid_id: 101,
        lot_id: numericLotId,
        crop_name: targetCrop,
        variety: biddingLot?.variety || 'Lok-1 Clean Grain',
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
        farm_gate_otp: '4821',
        destination_delivery_otp: '7394',
        carrier_name: chosenCarrier,
        vehicle_number: 'MH-15-EG-4421'
      };
      updateActiveVault(mockVault);
    } finally {
      setLoadingBidLotId(null);
      setIsBiddingOpen(false);
      setIsInspectionOpen(false);

      // Seamless Transition: Auto-switch to Tab 2 (Active Procurement & Fulfillment)
      handleTabChange('active_deals');
      triggerToast(`🎉 100% Escrow Vault Locked (₹${bidData.totalEscrowAmount.toLocaleString('en-IN')}) for ${targetCrop}! Switched to Active Fulfillment.`);
      toast.success(`🎉 Escrow Vault #KS-${numericLotId} Locked Successfully`, {
        description: `₹${bidData.totalEscrowAmount.toLocaleString('en-IN')} committed via ${bidData.paymentMethod} (${chosenCarrier}). Switched to Active Fulfillment.`,
        duration: 5000,
      });
      await fetchLiveMarketplaceData();
    }
  };

  // Settlement Completion Handler
  const handleSettlementComplete = (invoiceNumber: string) => {
    updateActiveVault(prev => ({
      ...prev,
      current_milestone: 'SETTLED',
      status: 'SETTLED',
      tax_invoice_number: invoiceNumber
    }));

    // Append to historical orders ledger
    const newOrder: InvoiceOrderData = {
      order_id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      invoice_number: invoiceNumber,
      lot_id: `LOT-${activeVault.lot_id || 1}`,
      commodity: activeVault.crop_name || 'Sharbati Wheat',
      variety: activeVault.variety || 'Lok-1 (Clean Grain)',
      quantity_tons: 5.0,
      quantity_kg: 5000,
      unit_price_kg: 24.50,
      base_crop_value: activeVault.crop_total_amount || 122500,
      freight_charges: activeVault.total_freight_cost || 6000,
      apmc_cess: activeVault.platform_fee_inr || 1838,
      total_settlement: activeVault.total_locked_amount || 130338,
      farmer_name: activeVault.farmer_name || 'Ramesh Patil',
      farmer_district: activeVault.farmer_district || 'Nashik Cluster, Maharashtra',
      carrier_name: activeVault.carrier_name || 'Kisan Express Logistics',
      vehicle_number: activeVault.vehicle_number || 'MH-15-EG-4421',
      eway_bill_number: `EWB-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      escrow_status: 'SETTLED',
      quality_grade: 'Grade A (94.2%)',
      handover_date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      dbt_utr: `UTR-ICICI-2026-${Date.now().toString().slice(-6)}`,
      weighbridge_slip: 'WB-2026-VASHI-942.pdf'
    };

    updateOrders(prev => [newOrder, ...prev]);

    toast.success('⚖️ Settlement Completed & Tax Invoice Ready', {
      description: `Invoice ${invoiceNumber} generated. DBT payout disbursed to ${activeVault.farmer_name}.`,
      duration: 5000,
    });
  };

  // Dispute Handler
  const handleDisputeRaised = (ticketId: string) => {
    updateActiveVault(prev => ({
      ...prev,
      current_milestone: 'DISPUTED',
      status: 'DISPUTED',
      dispute_reason: 'Quality & Weight Shortage Discrepancy'
    }));
    triggerToast(`🚨 Escrow Vault FROZEN! APMC Arbitration Ticket #${ticketId} opened.`);
  };

  // Computed Active Deals Count
  const activeDealsCount = (activeVault && activeVault.status !== 'SETTLED') ? 1 : 0;

  return {
    activeTab,
    setActiveTab,
    lots,
    bids,
    orders,
    analytics,
    activeVault,
    setActiveVault,
    activeDealsCount,
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
    handleSettlementComplete,
    handleDisputeRaised,
    // Invoice
    selectedInvoiceOrder,
    isInvoiceOpen,
    openInvoice,
    closeInvoice,
    // Refresh
    fetchLiveMarketplaceData
  };
}
