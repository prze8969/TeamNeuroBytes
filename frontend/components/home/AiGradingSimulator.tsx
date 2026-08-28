'use client';

import React, { useState } from 'react';
import { Cpu, CheckCircle, ShieldCheck, Zap, RefreshCw, Award } from 'lucide-react';

interface CropSample {
  id: string;
  name: string;
  category: string;
  grade: 'GRADE_A' | 'GRADE_B' | 'GRADE_C';
  qualityScore: number;
  defectPercent: number;
  ripenessIndex: number;
  moisturePercent: number;
  basePricePerKg: number;
  premiumPerKg: number;
  image: string;
}

const CROP_SAMPLES: CropSample[] = [
  {
    id: 'wheat-01',
    name: 'Sharbati Wheat',
    category: 'Cereals',
    grade: 'GRADE_A',
    qualityScore: 95.4,
    defectPercent: 1.2,
    ripenessIndex: 96.0,
    moisturePercent: 11.4,
    basePricePerKg: 25.50,
    premiumPerKg: 2.50,
    image: '/valid_images/Grade_A_wheat_Grade_A_0001.jpg',
  },
  {
    id: 'onion-01',
    name: 'Red Nashik Onion',
    category: 'Vegetables',
    grade: 'GRADE_A',
    qualityScore: 92.8,
    defectPercent: 2.1,
    ripenessIndex: 91.5,
    moisturePercent: 14.0,
    basePricePerKg: 21.50,
    premiumPerKg: 1.80,
    image: '/valid_images/Grade_A_onion_Grade_A_0001.jpg',
  },
  {
    id: 'tomato-01',
    name: 'Hybrid Vaishali Tomato',
    category: 'Vegetables',
    grade: 'GRADE_B',
    qualityScore: 87.2,
    defectPercent: 4.5,
    ripenessIndex: 88.0,
    moisturePercent: 89.2,
    basePricePerKg: 19.00,
    premiumPerKg: 0.50,
    image: '/valid_images/Grade_A_tomato_Grade_A_0001.jpg',
  },
  {
    id: 'banana-01',
    name: 'Grand Naine Banana',
    category: 'Fruits',
    grade: 'GRADE_A',
    qualityScore: 96.1,
    defectPercent: 0.9,
    ripenessIndex: 94.0,
    moisturePercent: 72.0,
    basePricePerKg: 18.00,
    premiumPerKg: 3.00,
    image: '/valid_images/Grade_A_banana_Grade_A_0001.jpg',
  },
];

export function AiGradingSimulator() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const sample = CROP_SAMPLES[selectedIndex];

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 800);
  };

  return (
    <div className="bg-emerald-950/90 rounded-3xl border border-emerald-700/80 p-6 sm:p-8 space-y-6 text-left font-sans text-white shadow-2xl backdrop-blur-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-ping"></span>
            <span className="text-xs font-mono font-extrabold uppercase text-teal-300 tracking-wider">
              Ultralytics YOLOv8 Neural Vision
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
            Sub-Second AI Quality &amp; Defect Scanner
          </h3>
        </div>

        <button
          onClick={handleRescan}
          disabled={isScanning}
          className="flex items-center gap-2 shrink-0 bg-teal-400 text-slate-950 px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md"
        >
          <RefreshCw size={14} className={`text-slate-950 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning Mesh...' : 'Run Live AI Scan'}</span>
        </button>
      </div>

      {/* Crop Sample Selector Buttons */}
      <div className="flex flex-wrap gap-2">
        {CROP_SAMPLES.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedIndex(idx);
              handleRescan();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedIndex === idx
                ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                : 'bg-emerald-900/60 border border-emerald-700/60 text-emerald-100 hover:bg-emerald-900'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Main Inspector Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Left Column: Visual AI Bounding Box Scanning Canvas */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video border border-emerald-700 flex items-center justify-center shadow-inner group">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-slate-950/60 to-transparent z-10"></div>
          
          <div className="relative z-20 text-center p-6 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400 text-slate-950 text-xs font-mono font-black shadow-sm">
              <Zap size={14} className="text-slate-950 animate-bounce" />
              YOLOv8 Segmentation Mesh Active
            </div>
            
            <h4 className="text-white font-extrabold text-lg tracking-tight">
              {sample.name} ({sample.category})
            </h4>

            {/* Bounding Box Coordinates Simulation */}
            <div className="inline-block p-3 rounded-xl bg-slate-950/90 border border-teal-400/60 text-left font-mono text-[11px] text-teal-300 space-y-1">
              <div>Detected: <strong>Grain Kernel Clusters</strong></div>
              <div>Defect Surface Area: <strong className="text-amber-400">{sample.defectPercent}%</strong></div>
              <div>Confidence Score: <strong className="text-emerald-400">{(sample.qualityScore / 100).toFixed(4)}</strong></div>
            </div>
          </div>

          {/* AI Scanning Beam Effect */}
          {isScanning && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_#2dd4bf] animate-pulse z-30 top-1/2 -translate-y-1/2"></div>
          )}
        </div>

        {/* Right Column: AI Certificate Metrics */}
        <div className="space-y-4 flex flex-col justify-between">
          
          <div className="p-5 rounded-2xl bg-emerald-900/80 border border-emerald-700/80 text-white space-y-3 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={20} className="text-amber-400" />
                <span className="font-extrabold text-sm tracking-wide">AI Quality Certificate</span>
              </div>
              <span className="text-xs font-mono font-black px-3 py-1 rounded-full bg-amber-400 text-slate-950 shadow-sm">
                {sample.grade.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-800/80 text-center font-mono">
              <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-800">
                <span className="text-[10px] text-emerald-300 font-bold block uppercase">Quality</span>
                <strong className="text-base text-white font-black">{sample.qualityScore}%</strong>
              </div>
              <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-800">
                <span className="text-[10px] text-emerald-300 font-bold block uppercase">Defect</span>
                <strong className="text-base text-amber-300 font-black">{sample.defectPercent}%</strong>
              </div>
              <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-800">
                <span className="text-[10px] text-emerald-300 font-bold block uppercase">Moisture</span>
                <strong className="text-base text-teal-300 font-black">{sample.moisturePercent}%</strong>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700/80 space-y-2 text-xs">
            <div className="flex justify-between items-center text-emerald-200 font-medium">
              <span>Standard Mandi Base Rate:</span>
              <strong className="text-white font-mono font-bold">₹{sample.basePricePerKg.toFixed(2)}/kg</strong>
            </div>
            <div className="flex justify-between items-center text-emerald-300 font-bold">
              <span>Grade A Premium Realized:</span>
              <strong className="font-mono text-amber-300">+₹{sample.premiumPerKg.toFixed(2)}/kg</strong>
            </div>
            <div className="pt-2 border-t border-emerald-800/80 flex justify-between items-center text-white font-extrabold text-sm">
              <span>Guaranteed Farmgate Offer:</span>
              <strong className="font-mono text-amber-300">₹{(sample.basePricePerKg + sample.premiumPerKg).toFixed(2)}/kg</strong>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
