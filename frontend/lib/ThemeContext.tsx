'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ColorTheme = 
  // Human & Organic Non-AI Themes
  | 'sunlit-farm'
  | 'terracotta-soil'
  | 'nabard-banking'
  | 'assam-tea'
  | 'punjab-mustard'
  | 'paper-white'
  // Modern Tech & Classic Themes
  | 'eco-clean' 
  | 'golden-harvest' 
  | 'bharat-digital'
  | 'cyber-dark';

export interface ThemeConfig {
  id: ColorTheme;
  name: string;
  shortName: string;
  category: 'natural' | 'institutional' | 'tech';
  tagline: string;
  icon: string;
  swatches: string[];
  isLightMode?: boolean;
  navBg: string;
  navBorder: string;
  navText: string;
  heroBgGradient: string;
  heroTextGradient: string;
  heroCtaButton: string;
  heroCtaIconBg: string;
  heroCtaIconColor: string;
  heroGlow1: string;
  heroGlow2: string;
  badgeBg: string;
  primaryAccent: string;
}

export const THEME_CONFIGS: Record<ColorTheme, ThemeConfig> = {
  // -------------------------------------------------------------
  // 1. NON-AI: NATURAL & HUMAN THEMES
  // -------------------------------------------------------------
  'sunlit-farm': {
    id: 'sunlit-farm',
    name: '☀️ Sunlit Morning Farm (Bright Day Light)',
    shortName: 'Sunlit Farm',
    category: 'natural',
    tagline: 'Fresh daytime farm look with open blue sky, lush green crop fields, and warm sunshine.',
    icon: '☀️',
    swatches: ['#047857', '#f59e0b', '#38bdf8', '#ffffff'],
    isLightMode: false,
    navBg: 'bg-[#047857]/95',
    navBorder: 'border-emerald-700/80',
    navText: 'text-emerald-50',
    heroBgGradient: 'bg-gradient-to-b from-[#065F46] via-[#047857] to-[#022c22]',
    heroTextGradient: 'bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-200',
    heroCtaButton: 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-400/35',
    heroCtaIconBg: 'bg-slate-950',
    heroCtaIconColor: 'text-amber-400',
    heroGlow1: 'bg-emerald-400/20',
    heroGlow2: 'bg-amber-300/15',
    badgeBg: 'bg-amber-400 text-slate-950',
    primaryAccent: '#047857',
  },

  'terracotta-soil': {
    id: 'terracotta-soil',
    name: '🏺 Terracotta & Desi Black Soil',
    shortName: 'Terracotta Earth',
    category: 'natural',
    tagline: 'Warm Indian clay pottery, fertile farm soil, and rustic village warmth.',
    icon: '🏺',
    swatches: ['#7C2D12', '#C2410C', '#D97706', '#FEF3C7'],
    isLightMode: false,
    navBg: 'bg-[#431407]/95',
    navBorder: 'border-orange-900/60',
    navText: 'text-orange-100',
    heroBgGradient: 'bg-gradient-to-b from-[#7C2D12] via-[#431407] to-[#270D05]',
    heroTextGradient: 'bg-gradient-to-r from-amber-300 via-orange-200 to-yellow-300',
    heroCtaButton: 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 shadow-orange-500/35',
    heroCtaIconBg: 'bg-slate-950',
    heroCtaIconColor: 'text-amber-400',
    heroGlow1: 'bg-orange-500/20',
    heroGlow2: 'bg-amber-400/15',
    badgeBg: 'bg-amber-400 text-slate-950',
    primaryAccent: '#C2410C',
  },

  'nabard-banking': {
    id: 'nabard-banking',
    name: '🏛️ NABARD & SBI Agri Banking (High Trust)',
    shortName: 'Agri Banking',
    category: 'institutional',
    tagline: 'Official institutional banking blue. Feels solid, secure, and 100% government-guaranteed.',
    icon: '🏛️',
    swatches: ['#1E3A8A', '#2563EB', '#F59E0B', '#FFFFFF'],
    isLightMode: false,
    navBg: 'bg-[#0F2042]/95',
    navBorder: 'border-blue-900/70',
    navText: 'text-blue-100',
    heroBgGradient: 'bg-gradient-to-b from-[#1E3A8A] via-[#0F2042] to-[#081226]',
    heroTextGradient: 'bg-gradient-to-r from-amber-300 via-blue-200 to-teal-200',
    heroCtaButton: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 shadow-amber-400/35',
    heroCtaIconBg: 'bg-slate-950',
    heroCtaIconColor: 'text-amber-400',
    heroGlow1: 'bg-blue-500/20',
    heroGlow2: 'bg-amber-400/15',
    badgeBg: 'bg-amber-400 text-slate-950',
    primaryAccent: '#2563EB',
  },

  'assam-tea': {
    id: 'assam-tea',
    name: '🍃 Assam Tea Estate & Botanical Sage',
    shortName: 'Tea Estate',
    category: 'natural',
    tagline: 'Calm organic tea plantation green with warm cedar wood undertones. Peaceful and organic.',
    icon: '🍃',
    swatches: ['#1E382B', '#345C47', '#78350F', '#F0FDF4'],
    isLightMode: false,
    navBg: 'bg-[#14261D]/95',
    navBorder: 'border-emerald-900/60',
    navText: 'text-emerald-100',
    heroBgGradient: 'bg-gradient-to-b from-[#2D4A3E] via-[#1E382B] to-[#0E1B14]',
    heroTextGradient: 'bg-gradient-to-r from-emerald-200 via-teal-100 to-amber-200',
    heroCtaButton: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/35',
    heroCtaIconBg: 'bg-slate-950',
    heroCtaIconColor: 'text-emerald-300',
    heroGlow1: 'bg-emerald-500/15',
    heroGlow2: 'bg-teal-400/10',
    badgeBg: 'bg-emerald-400 text-slate-950',
    primaryAccent: '#345C47',
  },

  'punjab-mustard': {
    id: 'punjab-mustard',
    name: '🌾 Punjab Golden Sarson (Baisakhi Warmth)',
    shortName: 'Sarson Gold',
    category: 'natural',
    tagline: 'Vibrant golden mustard flowers & ripe wheat harvest. Joyful, festive Indian kisan vibe.',
    icon: '🌾',
    swatches: ['#78350F', '#D97706', '#EAB308', '#FEF08A'],
    isLightMode: false,
    navBg: 'bg-[#2A1805]/95',
    navBorder: 'border-amber-900/50',
    navText: 'text-amber-100',
    heroBgGradient: 'bg-gradient-to-b from-[#451A03] via-[#2A1805] to-[#170C02]',
    heroTextGradient: 'bg-gradient-to-r from-yellow-300 via-amber-200 to-orange-300',
    heroCtaButton: 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-slate-950 shadow-yellow-400/35',
    heroCtaIconBg: 'bg-slate-950',
    heroCtaIconColor: 'text-yellow-400',
    heroGlow1: 'bg-yellow-500/25',
    heroGlow2: 'bg-amber-400/15',
    badgeBg: 'bg-yellow-400 text-slate-950',
    primaryAccent: '#EAB308',
  },

  'paper-white': {
    id: 'paper-white',
    name: '📄 Minimal Paper Clean (Zero Eye Strain)',
    shortName: 'Paper Clean',
    category: 'institutional',
    tagline: 'Simple, ultra-readable charcoal on soft paper. Feels like reading an official agricultural passbook.',
    icon: '📄',
    swatches: ['#18181B', '#3F3F46', '#059669', '#F4F4F5'],
    isLightMode: false,
    navBg: 'bg-[#18181B]/95',
    navBorder: 'border-zinc-800/80',
    navText: 'text-zinc-200',
    heroBgGradient: 'bg-gradient-to-b from-[#27272A] via-[#18181B] to-[#09090B]',
    heroTextGradient: 'bg-gradient-to-r from-zinc-100 via-emerald-300 to-zinc-200',
    heroCtaButton: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-emerald-500/30',
    heroCtaIconBg: 'bg-slate-950',
    heroCtaIconColor: 'text-emerald-400',
    heroGlow1: 'bg-emerald-500/10',
    heroGlow2: 'bg-zinc-400/10',
    badgeBg: 'bg-emerald-500 text-slate-950',
    primaryAccent: '#059669',
  },

  // -------------------------------------------------------------
  // 2. CLASSIC & NATIONAL THEMES
  // -------------------------------------------------------------
  'eco-clean': {
    id: 'eco-clean',
    name: '🌿 Clean Eco Mint (Classic)',
    shortName: 'Eco Mint',
    category: 'natural',
    tagline: 'Deep forest green with fresh spring mint and amber accents.',
    icon: '🌿',
    swatches: ['#064e3b', '#10b981', '#34d399', '#fef08a'],
    navBg: 'bg-emerald-950/95',
    navBorder: 'border-emerald-800/70',
    navText: 'text-emerald-100',
    heroBgGradient: 'bg-gradient-to-b from-[#064e3b] via-[#022c22] to-[#011a14]',
    heroTextGradient: 'bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200',
    heroCtaButton: 'bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-400/35',
    heroCtaIconBg: 'bg-slate-950',
    heroCtaIconColor: 'text-amber-400',
    heroGlow1: 'bg-emerald-500/15',
    heroGlow2: 'bg-amber-400/10',
    badgeBg: 'bg-amber-400 text-slate-950',
    primaryAccent: '#10b981',
  },

  'golden-harvest': {
    id: 'golden-harvest',
    name: '🌾 Golden Harvest & Earth',
    shortName: 'Golden Harvest',
    category: 'natural',
    tagline: 'Warm golden amber, wheat gold, and earthy deep olive.',
    icon: '🌾',
    swatches: ['#1b2e1e', '#f59e0b', '#d97706', '#fde68a'],
    navBg: 'bg-[#182619]/95',
    navBorder: 'border-amber-900/40',
    navText: 'text-amber-100',
    heroBgGradient: 'bg-gradient-to-b from-[#1C2A1E] via-[#142016] to-[#0A120B]',
    heroTextGradient: 'bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400',
    heroCtaButton: 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/35',
    heroCtaIconBg: 'bg-slate-950',
    heroCtaIconColor: 'text-amber-400',
    heroGlow1: 'bg-amber-500/20',
    heroGlow2: 'bg-yellow-400/15',
    badgeBg: 'bg-amber-400 text-slate-950',
    primaryAccent: '#f59e0b',
  },

  'bharat-digital': {
    id: 'bharat-digital',
    name: '🇮🇳 National Bharat Digital (DPI Style)',
    shortName: 'Bharat Digital',
    category: 'institutional',
    tagline: 'Chakra Navy with Indian Saffron and Agri Green (National DPI / ONDC / DigiLocker style).',
    icon: '🇮🇳',
    swatches: ['#0a2540', '#ea580c', '#2563eb', '#16a34a'],
    navBg: 'bg-[#0A2540]/95',
    navBorder: 'border-blue-900/60',
    navText: 'text-blue-100',
    heroBgGradient: 'bg-gradient-to-b from-[#0A2540] via-[#06182C] to-[#020B15]',
    heroTextGradient: 'bg-gradient-to-r from-orange-400 via-amber-200 to-emerald-400',
    heroCtaButton: 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white shadow-orange-500/35',
    heroCtaIconBg: 'bg-slate-950',
    heroCtaIconColor: 'text-orange-400',
    heroGlow1: 'bg-orange-500/20',
    heroGlow2: 'bg-emerald-500/15',
    badgeBg: 'bg-orange-500 text-white',
    primaryAccent: '#ea580c',
  },

  'cyber-dark': {
    id: 'cyber-dark',
    name: '🌌 Cyber Agritech Dark',
    shortName: 'Cyber Dark',
    category: 'tech',
    tagline: 'Deep midnight space navy with electric neon mint and cyan glows.',
    icon: '🌌',
    swatches: ['#0b132b', '#06b6d4', '#10b981', '#38bdf8'],
    navBg: 'bg-[#0B132B]/95',
    navBorder: 'border-cyan-900/60',
    navText: 'text-cyan-100',
    heroBgGradient: 'bg-gradient-to-b from-[#0B132B] via-[#0D1B3A] to-[#060B18]',
    heroTextGradient: 'bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300',
    heroCtaButton: 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 shadow-cyan-400/35',
    heroCtaIconBg: 'bg-slate-950',
    heroCtaIconColor: 'text-cyan-300',
    heroGlow1: 'bg-cyan-500/20',
    heroGlow2: 'bg-emerald-500/15',
    badgeBg: 'bg-cyan-400 text-slate-950',
    primaryAccent: '#06b6d4',
  },
};

interface ThemeContextType {
  theme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;
  config: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'sunlit-farm',
  setTheme: () => {},
  config: THEME_CONFIGS['sunlit-farm'],
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ColorTheme>('sunlit-farm');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('krishiniti_color_theme') as ColorTheme;
      if (saved && THEME_CONFIGS[saved]) {
        setThemeState(saved);
      }
    } catch {}
  }, []);

  const setTheme = (newTheme: ColorTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('krishiniti_color_theme', newTheme);
    } catch {}
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, config: THEME_CONFIGS[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
