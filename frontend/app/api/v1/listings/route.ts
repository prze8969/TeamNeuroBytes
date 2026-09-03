import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Try proxying from backend marketplace if online
    const backendRes = await fetch('http://localhost:8000/api/marketplace/lots', {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    }).catch(() => null);

    if (backendRes && backendRes.ok) {
      const data = await backendRes.json();
      if (Array.isArray(data) && data.length > 0) {
        return NextResponse.json({
          success: true,
          count: data.length,
          source: 'backend_postgis_marketplace',
          listings: data,
        });
      }
    }

    // Default rich test listings representing active trade lots
    const activeListings = [
      {
        id: 'LOT-WHEAT-01',
        farmer_id: 101,
        farmer_name: 'Ramesh Patil',
        commodity: 'Sharbati Wheat',
        variety: 'Lok-1 Clean Grain',
        quantity_kg: 5000,
        base_price_per_kg: 24.50,
        mandi_avg_per_kg: 23.00,
        quality_grade: 'GRADE_A',
        quality_score: 94.2,
        district: 'Nashik',
        state: 'Maharashtra',
        destination_mandi: 'Vashi APMC, Navi Mumbai',
        status: 'POOLED',
        escrow_status: 'AVAILABLE'
      },
      {
        id: 'LOT-ONION-02',
        farmer_id: 102,
        farmer_name: 'Anil Deshmukh',
        commodity: 'Red Onion',
        variety: 'Nashik Garva',
        quantity_kg: 8000,
        base_price_per_kg: 21.00,
        mandi_avg_per_kg: 19.50,
        quality_grade: 'GRADE_A',
        quality_score: 92.0,
        district: 'Lasalgaon',
        state: 'Maharashtra',
        destination_mandi: 'Vashi APMC, Navi Mumbai',
        status: 'POOLED',
        escrow_status: 'AVAILABLE'
      },
      {
        id: 'LOT-TOMATO-03',
        farmer_id: 103,
        farmer_name: 'Sunil Jagtap',
        commodity: 'Hybrid Tomato',
        variety: 'Abhinav Firm Red',
        quantity_kg: 4000,
        base_price_per_kg: 18.50,
        mandi_avg_per_kg: 17.00,
        quality_grade: 'GRADE_A',
        quality_score: 96.1,
        district: 'Pimpalgaon',
        state: 'Maharashtra',
        destination_mandi: 'Kalyan APMC',
        status: 'POOLED',
        escrow_status: 'AVAILABLE'
      }
    ];

    return NextResponse.json({
      success: true,
      count: activeListings.length,
      source: 'kisansetu_active_listings',
      listings: activeListings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
