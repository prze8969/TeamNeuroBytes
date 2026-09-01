'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function ScrollReveal({
  children,
  className = '',
  delayMs = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getDirectionClasses = () => {
    if (direction === 'up') return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12';
    if (direction === 'down') return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12';
    if (direction === 'left') return isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12';
    if (direction === 'right') return isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12';
    return isVisible ? 'opacity-100' : 'opacity-0';
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${getDirectionClasses()} ${className}`}
    >
      {children}
    </div>
  );
}
