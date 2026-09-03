'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Coins, 
  Layers, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw,
  Wallet,
  Activity,
  AlertTriangle,
  Network
} from 'lucide-react';

interface ContractInfo {
  name: string;
  address: string;
  role: string;
  status: 'TESTED' | 'SIMULATED' | 'IMPLEMENTED';
  description: string;
  link: string;
}

const DEPLOYED_CONTRACTS: ContractInfo[] = [
  {
    name: 'TestToken (Mock Stablecoin)',
    address: '0x94eA3B596899cD23F21A9c2b073b4aD44EB26C0d',
    role: 'Transactional Medium',
    status: 'TESTED',
    description: 'ERC-20 token simulating instant DBT settlement. Transferred and approved on-chain during order locks.',
    link: 'https://amoy.polygonscan.com/address/0x94eA3B596899cD23F21A9c2b073b4aD44EB26C0d'
  },
  {
    name: 'Roles Registry',
    address: '0x06d95F59142eAA3c5f06757c43F6C4db54b73c16',
    role: 'Access Control Manager',
    status: 'TESTED',
    description: 'Manages multi-party permissions (Buyer, Logistics, Warehouse, Regulator). Verified on-chain.',
    link: 'https://amoy.polygonscan.com/address/0x06d95F59142eAA3c5f06757c43F6C4db54b73c16'
  },
  {
    name: 'GradeRegistry',
    address: '0x1cAb3f4D37eE0AdC19a64dE8023CeEefC404978C',
    role: 'Quality Ledger',
    status: 'TESTED',
    description: 'Anchors YOLOv8 & DINOv2 visual AI-graded crop reports using SHA-256 hashes to guarantee data integrity.',
    link: 'https://amoy.polygonscan.com/address/0x1cAb3f4D37eE0AdC19a64dE8023CeEefC404978C'
  },
  {
    name: 'EscrowManager',
    address: '0xB0cA0E341006238BcCCc46cd7Bebd25297794860',
    role: 'Zero-Trust Settlement Rails',
    status: 'TESTED',
    description: 'Automates freight advance and final DBT payouts based on weighbridge sensor readings. Fully verified.',
    link: 'https://amoy.polygonscan.com/address/0xB0cA0E341006238BcCCc46cd7Bebd25297794860'
  },
  {
    name: 'DisputeArbiter',
    address: '0xfa56743872bc0457C3667609677EE0877d340E5e',
    role: 'Regulatory Resolver',
    status: 'SIMULATED',
    description: 'Arbitration contract deployed, but governance/resolution dashboard operates via simulated views.',
    link: 'https://amoy.polygonscan.com/address/0xfa56743872bc0457C3667609677EE0877d340E5e'
  }
];

const LIFECYCLE_STEPS = [
  {
    step: '01',
    actor: 'Farmer & AI',
    action: 'AI Grading & Anchoring',
    status: 'IMPLEMENTED',
    desc: 'YOLOv8 & DINOv2 evaluate crop quality. The grading hash is anchored on GradeRegistry.sol to secure validation metrics.',
    contract: 'GradeRegistry',
    icon: '🌾',
    glow: 'from-emerald-500/20 to-teal-500/20'
  },
  {
    step: '02',
    actor: 'Buyer (Razorpay & MetaMask)',
    action: 'Dual Escrow Lock (Fiat & Web3)',
    status: 'IMPLEMENTED',
    desc: 'Buyer locks escrow using Razorpay Standard Checkout (UPI/Cards) with instant HMAC-SHA256 verification and on-chain hash anchoring, or approves TestToken directly via MetaMask.',
    contract: 'EscrowManager & Razorpay',
    icon: '🔒',
    glow: 'from-blue-500/20 to-indigo-500/20'
  },
  {
    step: '03',
    actor: 'Transporter',
    action: 'Logistics Pickup',
    status: 'IMPLEMENTED',
    desc: 'Transporter picks up the lot and triggers markPickedUp(). The contract immediately pays out a 30% fuel advance.',
    contract: 'EscrowManager',
    icon: '🚛',
    glow: 'from-amber-500/20 to-orange-500/20'
  },
  {
    step: '04',
    actor: 'APMC Warehouse',
    action: 'Weighbridge & Payout Release',
    status: 'IMPLEMENTED',
    desc: 'Physical weighbridge logs crop weight. Relayer calls confirmDelivery(), distributing payments to the farmer and transporter.',
    contract: 'EscrowManager',
    icon: '⚖️',
    glow: 'from-purple-500/20 to-pink-500/20'
  }
];

const VERIFIED_TXS = [
  { action: 'Warehouse Funding', hash: '0xf01dc714c6c6bb9e6b366e19371b7cbb0e2d0f9b5822abdceb00357a171cee4e', step: 'Gas Setup' },
  { action: 'WAREHOUSE_ROLE Grant', hash: '0x86af6b03780f43aea52c08d8af83bb35cb82533eca0b126e41b48338bffb8b76', step: 'Auth Setup' },
  { action: 'ERC-20 token approval', hash: '0x40cb9645ee2399b7e75718414ae2ab7a9133d35ea2de90e7e1b6fa0a7bceec1e', step: 'Step 02' },
  { action: 'createOrder (Lock Escrow)', hash: '0xaf68ae7b853201bb8109a7feb546ed54c52538b4343bf24257be7dd5605646c0', step: 'Step 02' },
  { action: 'submitGrade (AI Grading)', hash: '0x0e5fb3e12102043bb0621835b2a53676c254b4543b2b4acafa22877327c23be0', step: 'Step 01' },
  { action: 'markPickedUp (Fuel Advance)', hash: '0x1a27a25685b6b6eac0a1da2266e247f90401fbf07d3a570c5c7062cb26ebe075', step: 'Step 03' },
  { action: 'confirmDelivery (Final Settlement)', hash: '0xde43d1648e77b22e1355bb308d8452f8f576e799ecd05c38d30c220031d2a4e7', step: 'Step 04' }
];

export default function BlockchainPage() {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Background Glow effects */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* Header Container */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-900 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="text-slate-950" size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">KisanSetu</h1>
            <p className="text-[10px] text-emerald-400 font-mono tracking-wider font-bold">TRUST PROTOCOL</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-mono font-bold text-slate-400">POLYGON AMOY ACTIVE</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-tight leading-tight">
            Decentralized Trust Architecture
          </h2>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed">
            This dashboard monitors the smart contracts, access registries, and live transaction pipelines deployed on Polygon Amoy. See what operations are actively secured on-chain vs. simulated sandbox items.
          </p>
        </section>

        {/* SECTION 1: Dynamic Data Flow & Architecture Diagram */}
        <section className="space-y-8">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
            <Network className="text-emerald-400" size={20} />
            <h3 className="text-lg font-black tracking-tight text-white">Hybrid Dual-Signing Architecture</h3>
          </div>

          {/* Dynamic SVG Visual Map */}
          <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-900 flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl relative z-10">
              
              {/* Box 1: Client Signing (MetaMask & Razorpay) */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-3 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-10 group-hover:opacity-20 transition" />
                <div className="text-2xl">🦊 💳</div>
                <h4 className="text-sm font-extrabold text-white">1. Dual Client Rail (MetaMask + Razorpay)</h4>
                <p className="text-xs text-slate-400 leading-normal">
                  User authorizes payments via MetaMask Web3 wallet or Razorpay Standard Checkout with cryptographic on-chain hash anchoring.
                </p>
                <div className="inline-flex text-[9px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-900/60 text-blue-400 font-bold uppercase">
                  Razorpay & Web3 Active
                </div>
              </div>

              {/* Box 2: Smart Contracts */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-3 relative group md:scale-105">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-20 group-hover:opacity-30 transition" />
                <div className="text-2xl">⛓️</div>
                <h4 className="text-sm font-extrabold text-white">2. Deployed Contracts</h4>
                <p className="text-xs text-slate-400 leading-normal">
                  Solidity state-machine gates role-allocation, escrow locks, and DBT releases.
                </p>
                <div className="inline-flex text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-900/60 text-emerald-400 font-bold uppercase">
                  Fully Deployed (Amoy)
                </div>
              </div>

              {/* Box 3: Relayer Actions */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-3 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-10 group-hover:opacity-20 transition" />
                <div className="text-2xl">🤖</div>
                <h4 className="text-sm font-extrabold text-white">3. Backend Admin Relayer</h4>
                <p className="text-xs text-slate-400 leading-normal">
                  FastAPI web3.py signs sensor weighbridge data and visual AI grades.
                </p>
                <div className="inline-flex text-[9px] font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-900/60 text-purple-400 font-bold uppercase">
                  Admin Key Signed
                </div>
              </div>

            </div>

            {/* Custom connecting lines description */}
            <div className="w-full max-w-2xl text-center space-y-2">
              <p className="text-xs text-slate-500">
                Data transitions are synced automatically to our PostgreSQL db by a background Web3 event poller that targets contract events every 2 seconds.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: E2E Lifecycle Flow Details */}
        <section className="space-y-8">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
            <Layers className="text-emerald-400" size={20} />
            <h3 className="text-lg font-black tracking-tight text-white">Milestone Verification Lifecycle</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Interactive Step selectors */}
            <div className="lg:col-span-5 space-y-3">
              {LIFECYCLE_STEPS.map((item, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={`step-selector-${idx}`}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full p-5 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                      isActive 
                        ? 'bg-slate-900/80 border-emerald-500/50 shadow-md shadow-emerald-500/5' 
                        : 'bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-slate-900/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-xl font-bold border border-slate-800 shadow-inner">
                          {item.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider">STEP {item.step}</span>
                            <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{item.actor}</span>
                          </div>
                          <h4 className="text-sm font-extrabold text-white mt-0.5">{item.action}</h4>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded text-[9px] font-mono font-black border bg-emerald-950/40 border-emerald-800 text-emerald-400">
                        {item.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Interactive step description and execution card */}
            <div className="lg:col-span-7 bg-slate-900/40 border border-slate-900 rounded-3xl p-6 md:p-8 relative overflow-hidden backdrop-blur-xl">
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${LIFECYCLE_STEPS[activeStep].glow} blur-[60px] pointer-events-none`} />
              
              <div className="relative space-y-6">
                <div className="flex justify-between items-start">
                  <div className="text-6xl font-black text-slate-800 font-mono select-none">
                    {LIFECYCLE_STEPS[activeStep].step}
                  </div>
                  <span className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950/80 text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
                    <Cpu size={12} className="text-emerald-400" />
                    Target: {LIFECYCLE_STEPS[activeStep].contract}.sol
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-black text-white">{LIFECYCLE_STEPS[activeStep].action}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {LIFECYCLE_STEPS[activeStep].desc}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Active Operator:</span>
                    <span className="text-slate-200 font-bold">{LIFECYCLE_STEPS[activeStep].actor}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Friction Reduction Strategy:</span>
                    <span className="text-emerald-400 font-bold">
                      {activeStep === 0 || activeStep === 3 ? 'Backend Admin Relayer signing (Gasless UX)' : 'MetaMask Client Signed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: Deployed Smart Contracts Details */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
            <Coins className="text-emerald-400" size={20} />
            <h3 className="text-lg font-black tracking-tight text-white">Smart Contract Registry & Status</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEPLOYED_CONTRACTS.map((contract, idx) => (
              <div 
                key={`contract-card-${idx}`}
                className="bg-slate-950/60 border border-slate-900 rounded-3xl p-5 hover:border-slate-800 hover:bg-slate-900/20 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-widest uppercase">
                      {contract.role}
                    </span>
                    <a 
                      href={contract.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-white transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <h4 className="text-base font-extrabold text-white">{contract.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{contract.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 truncate select-all pr-4">
                    {contract.address}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider border ${
                    contract.status === 'TESTED'
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60'
                      : 'bg-amber-950/40 text-amber-400 border-amber-900/60'
                  }`}>
                    {contract.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: Live Transaction Receipts & Verification Log */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
            <Activity className="text-emerald-400" size={20} />
            <h3 className="text-lg font-black tracking-tight text-white">Live On-Chain E2E Verification logs</h3>
          </div>

          <div className="bg-slate-950/60 border border-slate-900 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-900/40 font-mono text-slate-400 uppercase tracking-wider">
                    <th className="p-4 font-bold">Action</th>
                    <th className="p-4 font-bold">Corridor Step</th>
                    <th className="p-4 font-bold">Polygonscan Explorer Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60">
                  {VERIFIED_TXS.map((tx, idx) => (
                    <tr key={`tx-log-${idx}`} className="hover:bg-slate-900/25 transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {tx.action}
                      </td>
                      <td className="p-4 font-mono text-slate-300">{tx.step}</td>
                      <td className="p-4 font-mono">
                        <a 
                          href={`https://amoy.polygonscan.com/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline inline-flex items-center gap-1.5 font-bold"
                        >
                          {tx.hash.slice(0, 16)}...{tx.hash.slice(-12)}
                          <ExternalLink size={12} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© 2026 KisanSetu Protocol. Deployed on Polygon Testnet under SIH verification metrics.</p>
      </footer>

    </div>
  );
}
