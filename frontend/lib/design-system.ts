/**
 * Krishi Niti Design System Tokens
 * SIH 2026 • Problem Statement 26132 • TeamNeuroBytes
 * 
 * Established Brand Palette:
 * - Primary Background: Dark Green / Emerald Dark (#022C22 / #064E3B / emerald-950)
 * - Teal / Mint Accent: #2DD4BF / #99F6E4 / #E2F1E7
 * - Yellow / Gold Accent: #F59E0B / #FCD34D / #FEF3C7
 */

export const colors = {
  canvas: {
    bg: 'bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950',
    card: 'bg-emerald-900/80 border-emerald-700/80',
    cardHover: 'hover:bg-emerald-900/95 hover:border-amber-400/80',
    header: 'bg-emerald-950/95 border-emerald-800/80',
  },
  accent: {
    mint: '#E2F1E7',
    mintBg: 'bg-emerald-900/60 text-[#E2F1E7]',
    gold: '#FCD34D',
    goldBg: 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950',
    teal: '#2DD4BF',
  },
  roles: {
    FARMER: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-400/40' },
    BUYER: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-400/40' },
    ORGANIZATION: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-400/40' },
    TRANSPORTATION: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-400/40' },
    WAREHOUSE: { bg: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-400/40' },
    ADMIN: { bg: 'bg-slate-500/20', text: 'text-slate-300', border: 'border-slate-400/40' },
  }
};
