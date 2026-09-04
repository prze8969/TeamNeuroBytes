'use client';

import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  RefreshCw, 
  Sparkles, 
  LayoutGrid, 
  Truck, 
  Receipt,
  Search,
  CheckCircle2,
  Lock,
  Fuel,
  ArrowRight,
  AlertTriangle,
  PackageCheck,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CropListingListItem } from '@/components/dashboard/CropListingListItem';
import { CropDetailModal } from '@/components/dashboard/CropDetailModal';
import { BidTable } from '@/components/dashboard/BidTable';
import { EscrowRails } from '@/components/dashboard/EscrowRails';
import { ShipmentTracker } from '@/components/dashboard/ShipmentTracker';
import { WeighbridgeSettlement } from '@/components/dashboard/WeighbridgeSettlement';
import { BuyerAnalyticsCards } from '@/components/dashboard/BuyerAnalyticsCards';
import { OrderHistoryTable } from '@/components/dashboard/OrderHistoryTable';
import { BiddingDrawer } from '@/components/dashboard/BiddingDrawer';
import { AIInspectionModal } from '@/components/dashboard/AIInspectionModal';
import { TaxInvoiceModal } from '@/components/dashboard/TaxInvoiceModal';
import { EmptyListingState } from '@/components/dashboard/EmptyListingState';
import { RazorpayModal } from '@/components/payment/RazorpayModal';
import { toast } from 'sonner';
import { useBuyerState, BuyerTabType } from '@/lib/useBuyerState';
import { CropLot } from '@/lib/types';

const MANDI_TICKER_ITEMS = [
  { mandi: 'Nashik APMC', crop: 'Sharbati Wheat', price: '₹2,450/qtl', trend: '+1.8%' },
  { mandi: 'Lasalgaon Hub', crop: 'Red Onion', price: '₹1,800/qtl', trend: '+2.4%' },
  { mandi: 'Pune Mandi', crop: 'Hybrid Tomato', price: '₹1,450/qtl', trend: '-0.9%' },
  { mandi: 'Karnal Yard', crop: '1121 Basmati', price: '₹6,800/qtl', trend: '+3.1%' },
  { mandi: 'Latur APMC', crop: 'Yellow Soybean', price: '₹4,400/qtl', trend: '+0.5%' },
  { mandi: 'Vashi Terminal', crop: 'Lok-1 Wheat', price: '₹2,580/qtl', trend: '+1.2%' }
];

export function BuyerDashboardLayout() {
  const {
    isMounted,
    activeTab,
    setActiveTab,
    lots,
    bids,
    orders,
    analytics,
    // Multi-Deal State
    activeVaults,
    selectedDealId,
    setSelectedDealId,
    selectedVault,
    updateDealMilestone,
    activeDealsCount,
    // Profile & Notifications
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
    fetchLiveMarketplaceData,
    isDemoMode,
    setIsDemoMode
  } = useBuyerState();

  const [selectedDetailLot, setSelectedDetailLot] = React.useState<CropLot | null>(null);
  const [buyerNotifications, setBuyerNotifications] = React.useState<any[]>([]);
  const [quickBuyLot, setQuickBuyLot] = React.useState<CropLot | null>(null);

  const handleQuickBuy = async (lot: CropLot) => {
    setQuickBuyLot(lot);
    const pricePerKg = lot.askingFloorPerKg ?? lot.basePricePerKg ?? 24.50;
    const quantityKg = lot.quantityKg ?? 5000;
    const baseCropValue = Math.round(pricePerKg * quantityKg);
    const estimatedFreight = Math.round(1.50 * quantityKg);
    const apmcCessFee = Math.round(baseCropValue * 0.015);
    const totalEscrowAmount = baseCropValue + estimatedFreight + apmcCessFee;
    const totalAmountPaise = totalEscrowAmount * 100;

    // Launch official Razorpay Checkout modal directly
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      let orderId = '';
      try {
        const orderRes = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalAmountPaise,
            currency: 'INR',
            receipt: `rcpt_buy_${lot.id}_${Date.now()}`
          })
        });
        if (orderRes.ok) {
          const orderData = await orderRes.json();
          orderId = orderData.order_id || '';
        }
      } catch (err) {
        console.warn('Could not pre-create Razorpay order:', err);
      }

      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TXfrD9oSFA3lMl',
        amount: totalAmountPaise,
        currency: 'INR',
        name: 'KrishiNiti / KisanSetu Escrow',
        description: `Instant Purchase - ${lot.cropName} (Lot #${lot.id})`,
        prefill: {
          name: 'AgroProcure Private Ltd',
          email: 'buyer@test.com',
          contact: '9876543210'
        },
        theme: {
          color: '#059669'
        },
        handler: function(response: any) {
          handleQuickBuySuccess({
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id || orderId || `order_${Date.now()}`,
            signature: response.razorpay_signature || `sig_${Date.now()}`
          });
        }
      };

      if (orderId) {
        options.order_id = orderId;
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function(resp: any) {
        console.warn('Payment failed or modal dismissed', resp?.error);
      });
      rzp.open();
    }
  };

  const handleQuickBuySuccess = async (result: { payment_id: string; order_id: string; signature: string }) => {
    if (!quickBuyLot) return;
    const pricePerKg = quickBuyLot.askingFloorPerKg ?? quickBuyLot.basePricePerKg ?? 24.50;
    const quantityKg = quickBuyLot.quantityKg ?? 5000;
    const baseCropValue = Math.round(pricePerKg * quantityKg);
    const estimatedFreight = Math.round(1.50 * quantityKg);
    const apmcCessFee = Math.round(baseCropValue * 0.015);
    const totalEscrowAmount = baseCropValue + estimatedFreight + apmcCessFee;

    await handleConfirmBidAndEscrow({
      lotId: quickBuyLot.id,
      bidPricePerKg: pricePerKg,
      paymentMethod: 'VIRTUAL_ESCROW',
      deliveryDays: 3,
      totalCropValue: baseCropValue,
      estimatedFreight,
      apmcCessFee,
      totalEscrowAmount,
      carrierId: 'KISAN_EXPRESS',
      carrierName: 'Kisan Express Logistics',
      freightRatePerKg: 1.50,
      razorpayPaymentId: result.payment_id,
      razorpayOrderId: result.order_id,
    });
    setQuickBuyLot(null);
    toast.success(`Payment Verified! Deal locked via Razorpay: ${result.payment_id}`, {
      description: 'Web3 smart contract escrow anchored in background.',
    });
  };

  React.useEffect(() => {
    const syncNotifs = () => {
      try {
        const saved = localStorage.getItem('kisansetu_buyer_notifications');
        if (saved) {
          setBuyerNotifications(JSON.parse(saved));
        } else {
          setBuyerNotifications([]);
        }
      } catch {}
    };
    syncNotifs();
    window.addEventListener('storage', syncNotifs);
    window.addEventListener('kisansetu_bids_updated', syncNotifs);
    return () => {
      window.removeEventListener('storage', syncNotifs);
      window.removeEventListener('kisansetu_bids_updated', syncNotifs);
    };
  }, []);

  const dismissNotification = (id: number) => {
    const filtered = buyerNotifications.filter(n => n.id !== id);
    setBuyerNotifications(filtered);
    try {
      localStorage.setItem('kisansetu_buyer_notifications', JSON.stringify(filtered));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* ========================================================================= */}
      {/* 1. STICKY TOP COMMAND HEADER */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        
        {/* Top Profile & Live Mandi Ticker Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Buyer Profile Pill */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs shadow-emerald-700/20">
              <Building2 size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-slate-900 tracking-tight">
                  {buyerProfile.business_name}
                </h1>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-mono">
                  <ShieldCheck size={11} className="text-emerald-700" />
                  VERIFIED BUYER
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                GSTIN: <strong className="text-slate-800">{buyerProfile.gstin}</strong> • Hub: <strong className="text-slate-800">{buyerProfile.preferred_apmc_mandi}</strong>
              </p>
            </div>
          </div>

          {/* Continuous Stock Market Live Mandi Price Ticker */}
          <div className="hidden md:flex items-center gap-2.5 bg-slate-900 text-slate-100 px-3.5 py-1.5 rounded-2xl border border-slate-800 shadow-inner flex-1 max-w-xl overflow-hidden relative group">
            
            {/* Live Indicator Dot */}
            <div className="flex items-center gap-1.5 shrink-0 z-10 pr-2 border-r border-slate-700 bg-slate-900">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 font-mono whitespace-nowrap">
                LIVE TICKER
              </span>
            </div>

            {/* Seamless Infinite Running Ticker Track */}
            <div 
              className="flex-1 overflow-hidden relative"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 12px, black calc(100% - 12px), transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 12px, black calc(100% - 12px), transparent)'
              }}
            >
              <div className="animate-ticker flex items-center gap-6 text-[11px] font-mono whitespace-nowrap select-none">
                {/* 1st Loop Copy */}
                {MANDI_TICKER_ITEMS.map((item, idx) => (
                  <div key={`ticker-1-${idx}`} className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[10px] font-sans font-medium">{item.crop}:</span>
                    <strong className="text-white font-bold">{item.price}</strong>
                    <span className={`text-[10px] font-black px-1 rounded ${
                      item.trend.startsWith('+') ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'
                    }`}>
                      {item.trend}
                    </span>
                    <span className="text-slate-600 pl-2">•</span>
                  </div>
                ))}

                {/* 2nd Loop Copy for Seamless Loop */}
                {MANDI_TICKER_ITEMS.map((item, idx) => (
                  <div key={`ticker-2-${idx}`} className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[10px] font-sans font-medium">{item.crop}:</span>
                    <strong className="text-white font-bold">{item.price}</strong>
                    <span className={`text-[10px] font-black px-1 rounded ${
                      item.trend.startsWith('+') ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'
                    }`}>
                      {item.trend}
                    </span>
                    <span className="text-slate-600 pl-2">•</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`h-8 px-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
                isDemoMode
                  ? 'bg-amber-400 text-slate-950 border-amber-500 ring-2 ring-amber-300 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Sparkles size={13} className={isDemoMode ? 'text-slate-950 animate-spin' : 'text-amber-500'} />
              <span>{isDemoMode ? '⚡ Demo Mode: ON' : '⚡ Demo Mode: OFF'}</span>
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchLiveMarketplaceData}
              className="h-8 text-xs font-bold gap-1.5 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <RefreshCw size={13} className="text-slate-500" />
              Sync Mandi Live
            </Button>
          </div>

        </div>



      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN VIEW CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Global Toast Alert */}
        {toastMsg && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-xs font-bold text-emerald-950 animate-in fade-in flex justify-between items-center shadow-xs">
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-700 shrink-0" />
              {toastMsg}
            </span>
            <button onClick={() => setToastMsg(null)} className="text-emerald-800 hover:text-emerald-950 font-extrabold text-sm ml-4 cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* Live Farmer Listing Withdrawal Alerts for Buyer */}
        {buyerNotifications.length > 0 && (
          <div className="space-y-2.5">
            {buyerNotifications.map((notif, idx) => (
              <div 
                key={`buyer-notif-${notif.id || idx}`}
                className="bg-rose-50/95 border border-rose-300/80 rounded-2xl p-4 flex items-start justify-between gap-3 text-xs text-rose-950 shadow-xs animate-in fade-in"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0 font-bold text-base">
                    ⚠️
                  </div>
                  <div className="space-y-1">
                    <strong className="font-black text-rose-900 text-sm block">
                      {notif.title || 'Bid Cancelled: Listing Withdrawn'}
                    </strong>
                    <p className="text-rose-800 leading-relaxed font-medium">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-rose-500 font-mono block pt-0.5">
                      {notif.timestamp}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => dismissNotification(notif.id)}
                  className="text-rose-600 hover:text-rose-950 font-black text-xs px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 transition-all cursor-pointer shrink-0"
                >
                  Dismiss ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MARKETPLACE & LIVE FEED */}
        {/* ========================================================================= */}
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Marketplace Grid Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>🌾</span> Verified Institutional Crop Lots
              </h2>
              <p className="text-xs text-slate-500">
                Real-time harvest lots inspected by YOLOv8 Computer Vision with PostGIS freight pooling
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
                <ShieldCheck size={13} /> 100% Escrow Guaranteed
              </span>
            </div>
          </div>

          {/* Crop Listing List Format */}
          {lots.length === 0 ? (
            <EmptyListingState onResetFilters={fetchLiveMarketplaceData} />
          ) : (
            <div className="space-y-3">
              {lots.map((lot, idx) => (
                <CropListingListItem
                  key={`marketplace-lot-${lot.id}-${idx}`}
                  lot={lot}
                  onOpenDetails={(targetLot) => setSelectedDetailLot(targetLot)}
                />
              ))}
            </div>
          )}

          {/* Active Bids Table */}
          <BidTable bids={bids} lots={lots} isFarmerView={false} />

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 3. MODAL & DRAWER CONTAINER MOUNTS */}
      {/* ========================================================================= */}

      {/* 1. YOLOv8 AI Inspection Modal */}
      {isInspectionOpen && inspectionLot && (
        <AIInspectionModal
          isOpen={isInspectionOpen}
          onClose={closeInspection}
          lot={inspectionLot}
          onInstantBid={(lot) => {
            closeInspection();
            openBidding(lot);
          }}
        />
      )}

      {/* 2. Crop Details Pop-up Modal */}
      {selectedDetailLot && (
        <CropDetailModal
          isOpen={!!selectedDetailLot}
          onClose={() => setSelectedDetailLot(null)}
          lot={selectedDetailLot}
          onInspect={(lot) => {
            setSelectedDetailLot(null);
            openInspection(lot);
          }}
          onPlaceBid={(lot) => {
            setSelectedDetailLot(null);
            openBidding(lot);
          }}
        />
      )}

      {/* 3. 3-Tier Bidding & Logistics Drawer */}
      {isBiddingOpen && biddingLot && (
        <BiddingDrawer
          isOpen={isBiddingOpen}
          onClose={closeBidding}
          lot={biddingLot}
          onConfirmBidAndEscrow={handleConfirmBidAndEscrow}
        />
      )}

      {/* 4. Certified Weighbridge Gross/Tare Settlement Modal */}
      {isWeighbridgeOpen && selectedVault && (
        <WeighbridgeSettlement
          isOpen={isWeighbridgeOpen}
          onClose={closeWeighbridge}
          vaultId={selectedVault.id}
          lotId={`LOT-${selectedVault.lot_id || 1}`}
          cropName={selectedVault.crop_name}
          variety={selectedVault.variety}
          farmerName={selectedVault.farmer_name}
          carrierName={selectedVault.carrier_name}
          vehicleNumber={selectedVault.vehicle_number}
          listedQuantityKg={5000}
          cropTotalAmount={selectedVault.crop_total_amount}
          balanceFreightAmount={selectedVault.balance_freight_amount}
          totalEscrowAmount={selectedVault.total_locked_amount}
          onSettlementComplete={handleSettlementComplete}
          onDisputeRaised={handleDisputeRaised}
        />
      )}

      {/* 5. Statutory Tax Invoice Modal */}
      {isInvoiceOpen && selectedInvoiceOrder && (
        <TaxInvoiceModal
          isOpen={isInvoiceOpen}
          onClose={closeInvoice}
          order={selectedInvoiceOrder}
        />
      )}

    </div>
  );
}
