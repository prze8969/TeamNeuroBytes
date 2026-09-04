'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  Thermometer, 
  Droplets, 
  Activity, 
  PhoneCall, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Scale, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  ArrowRight,
  ExternalLink,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ShipmentTrackerProps {
  lotId?: string;
  cropName?: string;
  farmerName?: string;
  carrierName?: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  originName?: string;
  destinationName?: string;
  onArriveAtTerminal?: () => void;
}

// Coordinates along the NH-160 Nashik -> Vashi APMC Corridor
const ROUTE_WAYPOINTS: [number, number][] = [
  [19.9975, 73.7898], // 0. Nashik Farmgate Origin
  [19.9125, 73.7250], // 1. Vilholi Highway Hub
  [19.8240, 73.6120], // 2. Ghoti Toll Plaza
  [19.6980, 73.5600], // 3. Igatpuri Ghat Corridor (Intermediate Stop)
  [19.5200, 73.4100], // 4. Kasara Ghat Descent
  [19.3500, 73.2800], // 5. Shahapur Transit Terminal
  [19.2400, 73.1500], // 6. Kalyan-Bhiwandi Junction
  [19.1650, 73.0400], // 7. Thane Belapur Connector
  [19.0760, 72.9980]  // 8. Vashi APMC Terminal Destination
];

export function ShipmentTracker({
  lotId = 'LOT-WHEAT-01',
  cropName = 'Sharbati Wheat (Lok-1)',
  farmerName = 'Ramesh Patil',
  carrierName = 'Kisan Express Logistics',
  vehicleNumber = 'MH-15-EG-4421',
  driverName = 'Suresh Rathod',
  driverPhone = '+91 98231 49821',
  originName = 'Nashik Farm Gate Cluster',
  destinationName = 'Vashi APMC Mandi Yard (Navi Mumbai)',
  onArriveAtTerminal
}: ShipmentTrackerProps) {
  // Movement Simulation State
  const [progressIndex, setProgressIndex] = useState<number>(5); // Default ~65% completed along corridor
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [temperature, setTemperature] = useState<number>(14.2);
  const [humidity, setHumidity] = useState<number>(68);
  const [isArrived, setIsArrived] = useState<boolean>(false);

  // Leaflet Map References
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const truckMarkerRef = useRef<any>(null);
  const polylineTraversedRef = useRef<any>(null);
  const polylineRemainingRef = useRef<any>(null);

  const totalWaypoints = ROUTE_WAYPOINTS.length;
  const currentCoord = ROUTE_WAYPOINTS[Math.min(progressIndex, totalWaypoints - 1)];
  const progressPercent = Math.round((progressIndex / (totalWaypoints - 1)) * 100);

  // Dynamic ETA & Distance calculations
  const totalDistanceKm = 168;
  const remainingDistanceKm = Math.max(0, Math.round(totalDistanceKm * (1 - progressIndex / (totalWaypoints - 1))));
  const speedKmh = isArrived ? 0 : 54 + (progressIndex % 3) * 4;
  const remainingMins = Math.round((remainingDistanceKm / (speedKmh || 50)) * 60);
  const etaHours = Math.floor(remainingMins / 60);
  const etaMins = remainingMins % 60;
  const etaString = isArrived ? 'Arrived at APMC Terminal' : `${etaHours > 0 ? `${etaHours} hr ` : ''}${etaMins} mins`;

  // Telemetry real-time jitter simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTemperature(prev => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1));
      setHumidity(prev => Math.min(80, Math.max(55, Math.round(prev + (Math.random() * 2 - 1)))));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Animation Stepper Loop
  useEffect(() => {
    if (!isPlaying || isArrived) return;

    const interval = setInterval(() => {
      setProgressIndex(prev => {
        if (prev < totalWaypoints - 1) {
          return prev + 1;
        } else {
          setIsArrived(true);
          setIsPlaying(false);
          return prev;
        }
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying, isArrived, totalWaypoints]);

  // Initialize Leaflet Map (SSR Safe)
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // 1. Create Map Instance
      const map = L.map(mapContainerRef.current, {
        center: [19.55, 73.45],
        zoom: 9,
        zoomControl: true,
        scrollWheelZoom: false
      });
      mapInstanceRef.current = map;

      // 2. Add Clean Vector OpenStreetMap Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors & CartoDB',
        maxZoom: 18
      }).addTo(map);

      // 3. Custom Marker Icons
      const originIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div style="background:#059669; color:white; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid white; box-shadow:0 4px 12px rgba(0,0,0,0.3); font-weight:bold; font-size:16px;">
            🌾
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const destinationIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div style="background:#2563eb; color:white; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid white; box-shadow:0 4px 12px rgba(0,0,0,0.3); font-weight:bold; font-size:16px;">
            🏛️
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const pooledStopIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div style="background:#7c3aed; color:white; width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 2px 8px rgba(0,0,0,0.2); font-size:12px;">
            ⚡
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const truckIcon = L.divIcon({
        className: 'custom-leaflet-truck',
        html: `
          <div style="position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
            <div style="position:absolute; width:44px; height:44px; border-radius:50%; background:rgba(16, 185, 129, 0.35); animation:ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="background:#047857; color:white; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid white; box-shadow:0 6px 16px rgba(0,0,0,0.4); font-size:18px; z-index:2;">
              🚚
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      // 4. Place Origin & Destination Markers
      L.marker(ROUTE_WAYPOINTS[0], { icon: originIcon })
        .addTo(map)
        .bindPopup(`<strong>🌱 Farm Gate Origin</strong><br/>${farmerName} • Nashik Cluster`);

      L.marker(ROUTE_WAYPOINTS[totalWaypoints - 1], { icon: destinationIcon })
        .addTo(map)
        .bindPopup(`<strong>🏛️ Destination APMC Terminal</strong><br/>Vashi APMC Mandi Yard, Navi Mumbai`);

      // 5. Place Pooled Waypoints
      L.marker(ROUTE_WAYPOINTS[3], { icon: pooledStopIcon })
        .addTo(map)
        .bindPopup(`<strong>⚡ Shared Freight Pooling Hub</strong><br/>Igatpuri Cluster (+2.8 Tons Pooled)`);

      // 6. Polylines for Route
      const traversed = ROUTE_WAYPOINTS.slice(0, progressIndex + 1);
      const remaining = ROUTE_WAYPOINTS.slice(progressIndex);

      polylineTraversedRef.current = L.polyline(traversed, {
        color: '#059669',
        weight: 5,
        opacity: 0.9,
        lineCap: 'round'
      }).addTo(map);

      polylineRemainingRef.current = L.polyline(remaining, {
        color: '#9333ea',
        weight: 4,
        dashArray: '6, 8',
        opacity: 0.7
      }).addTo(map);

      // 7. Moving Truck Marker
      truckMarkerRef.current = L.marker(currentCoord, { icon: truckIcon })
        .addTo(map)
        .bindPopup(`<strong>🚚 ${carrierName}</strong><br/>Vehicle: ${vehicleNumber}<br/>Speed: ${speedKmh} km/h`);
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Truck Position and Polylines when step advances
  useEffect(() => {
    if (!mapInstanceRef.current || !truckMarkerRef.current) return;

    truckMarkerRef.current.setLatLng(currentCoord);
    truckMarkerRef.current.setPopupContent(`<strong>🚚 ${carrierName}</strong><br/>Vehicle: ${vehicleNumber}<br/>Speed: ${speedKmh} km/h`);

    if (polylineTraversedRef.current && polylineRemainingRef.current) {
      const traversed = ROUTE_WAYPOINTS.slice(0, progressIndex + 1);
      const remaining = ROUTE_WAYPOINTS.slice(progressIndex);
      polylineTraversedRef.current.setLatLngs(traversed);
      polylineRemainingRef.current.setLatLngs(remaining);
    }
  }, [progressIndex, currentCoord, carrierName, vehicleNumber, speedKmh]);

  const handleFastForward = () => {
    setProgressIndex(totalWaypoints - 1);
    setIsArrived(true);
    setIsPlaying(false);
  };

  const handleResetRoute = () => {
    setProgressIndex(0);
    setIsArrived(false);
    setIsPlaying(true);
  };

  const handleConfirmArrival = () => {
    if (onArriveAtTerminal) {
      onArriveAtTerminal();
    }
  };

  return (
    <div className="rounded-3xl border border-emerald-100 bg-white shadow-sm overflow-hidden text-slate-900 space-y-0">
      
      {/* ========================================================================= */}
      {/* 1. TOP LOGISTICS HEADER CARD */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-emerald-50/50 space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left: Carrier & Fleet Badges */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm shadow-emerald-600/30">
                <Truck size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {carrierName}
                  </h3>
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                    {vehicleNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  E-Way Bill: <strong className="text-slate-700 font-mono">EWB-2026-98412</strong> • Assigned Lot: <strong className="text-emerald-700 font-mono">{lotId}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Driver Contact & Trust Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-2.5 px-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                👨‍✈️
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block leading-tight">
                  {driverName}
                </span>
                <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                  <PhoneCall size={10} className="text-emerald-600" /> {driverPhone}
                </span>
              </div>
            </div>

            <div className="p-2.5 px-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5 font-mono">
              <ShieldCheck size={15} className="text-emerald-600" />
              <span>4.9 ★ (142 Trips)</span>
            </div>
          </div>

        </div>

        {/* Real-Time Trip Metrics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs text-xs font-mono">
          
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold block font-sans">Trip Status</span>
            <strong className="text-emerald-700 font-bold flex items-center gap-1.5 pt-0.5">
              <span className={`w-2 h-2 rounded-full ${isArrived ? 'bg-emerald-600' : 'bg-emerald-500 animate-ping'}`} />
              {isArrived ? 'Arrived at Mandi' : 'In Transit on NH-160'}
            </strong>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold block font-sans">Estimated Arrival</span>
            <strong className="text-slate-900 font-bold flex items-center gap-1 pt-0.5">
              <Clock size={13} className="text-slate-400" />
              {etaString}
            </strong>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold block font-sans">Remaining Distance</span>
            <strong className="text-slate-900 font-bold flex items-center gap-1 pt-0.5">
              <Navigation size={13} className="text-purple-600" />
              {remainingDistanceKm} km ({progressPercent}% done)
            </strong>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold block font-sans">Cruising Speed</span>
            <strong className="text-slate-900 font-bold pt-0.5 block">
              {speedKmh} km/h (GPS Active)
            </strong>
          </div>

        </div>

        {/* Progress Bar along Corridor */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
            <span>Origin: <strong>{originName}</strong></span>
            <span className="text-purple-700 font-bold font-mono">⚡ Shared Freight Corridor (Nashik - Thane - Vashi)</span>
            <span>Destination: <strong>{destinationName}</strong></span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE GEOSPATIAL MAP (LEAFLET CONTAINER) */}
      {/* ========================================================================= */}
      <div className="relative h-72 sm:h-auto sm:aspect-[21/9] w-full bg-slate-100 overflow-hidden">
        
        {/* Map Div */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Map Legend */}
        <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/90 shadow-md text-xs space-y-1.5 font-sans">
          <div className="font-black text-slate-900 text-[11px] flex items-center gap-1.5 border-b border-slate-100 pb-1">
            <Layers size={13} className="text-emerald-700" />
            <span>Live Route Telemetry</span>
          </div>
          <div className="space-y-1 text-[10px] font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
              <span>Traversed Route (Completed)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
              <span>Remaining Corridor Path</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs">⚡</span>
              <span>Igatpuri Pooled Waypoint</span>
            </div>
          </div>
        </div>

        {/* Floating Simulation Controls */}
        <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-200/90 shadow-md flex items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-8 px-2.5 rounded-xl font-bold text-xs border-slate-300"
          >
            {isPlaying ? <Pause size={12} className="mr-1 text-amber-600" /> : <Play size={12} className="mr-1 text-emerald-600" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleFastForward}
            className="h-8 px-2.5 rounded-xl font-bold text-xs border-slate-300"
          >
            <FastForward size={12} className="mr-1 text-purple-600" />
            <span>Arrive</span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleResetRoute}
            className="h-8 px-2 rounded-xl text-xs border-slate-300"
          >
            <RotateCcw size={12} />
          </Button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. REEFER TELEMETRY & HANDOVER ACTION BAR */}
      {/* ========================================================================= */}
      <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* IoT Cold-Chain Sensors */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
            <Thermometer size={15} className="text-blue-600" />
            <div>
              <span className="text-slate-400 text-[9px] block uppercase font-bold font-sans">Cold-Chain Temp</span>
              <strong className="text-slate-900 font-bold">{temperature}°C (Optimal)</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
            <Droplets size={15} className="text-blue-500" />
            <div>
              <span className="text-slate-400 text-[9px] block uppercase font-bold font-sans">Air Humidity</span>
              <strong className="text-slate-900 font-bold">{humidity}% RH</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
            <Activity size={15} className="text-emerald-600" />
            <div>
              <span className="text-slate-400 text-[9px] block uppercase font-bold font-sans">Vibration / Shock</span>
              <strong className="text-slate-900 font-bold">0.12 G (Smooth)</strong>
            </div>
          </div>
        </div>

        {/* Primary Handover Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            type="button"
            onClick={handleConfirmArrival}
            className="h-11 px-5 rounded-xl font-black text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 flex items-center gap-2"
          >
            <Scale size={15} className="text-emerald-200" />
            <span>Confirm Mandi Arrival & Proceed to Weighbridge Pass</span>
            <ArrowRight size={14} />
          </Button>
        </div>

      </div>

    </div>
  );
}
