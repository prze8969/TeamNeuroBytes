'use client';

import React from 'react';
import { KrishiNitiNav } from '@/components/layout/KrishiNitiNav';
import { MinimalMetaMaskHero } from '@/components/home/MinimalMetaMaskHero';
import { Slide2HowItWorks } from '@/components/home/presentation/Slide2HowItWorks';
import { Slide3Trust } from '@/components/home/presentation/Slide3Trust';
import { Slide4Audience } from '@/components/home/presentation/Slide4Audience';
import { Slide5Intelligence } from '@/components/home/presentation/Slide5Intelligence';
import { Slide6CTA } from '@/components/home/presentation/Slide6CTA';

export default function Home() {
  return (
    <div className="h-[100dvh] w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-[#04130c] selection:bg-amber-400 selection:text-slate-950">
      
      {/* 1. Header Navigation stays absolute inside the hero or global context */}
      <KrishiNitiNav />

      {/* Slide 1: What is Krishi Niti? */}
      <MinimalMetaMaskHero />

      {/* Slide 2: How does it work? */}
      <Slide2HowItWorks />

      {/* Slide 3: Is it safe? */}
      <Slide3Trust />

      {/* Slide 4: Who is it for? */}
      <Slide4Audience />

      {/* Slide 5: Why is it better? */}
      <Slide5Intelligence />

      {/* Slide 6: How do I start? */}
      <Slide6CTA />

    </div>
  );
}
