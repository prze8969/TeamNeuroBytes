'use client';

import React, { useState } from 'react';
import { Sprout, Image as ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  cropName?: string;
}

const CROP_FALLBACK_IMAGES: Record<string, string> = {
  wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  soybean: 'https://images.unsplash.com/photo-1599579086118-ff3599903b41?auto=format&fit=crop&w=600&q=80'
};

export function ImageWithFallback({
  src,
  alt = 'Crop produce',
  className = '',
  fallbackSrc,
  cropName = '',
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const cropKey = cropName.toLowerCase();
  let defaultFallback = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80';
  for (const [key, url] of Object.entries(CROP_FALLBACK_IMAGES)) {
    if (cropKey.includes(key)) {
      defaultFallback = url;
      break;
    }
  }

  const effectiveSrc = hasError ? (fallbackSrc || defaultFallback) : src;

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center text-slate-400">
          <Sprout size={20} className="animate-bounce text-emerald-600/40" />
        </div>
      )}
      <img
        src={effectiveSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
          } else {
            setIsLoading(false);
          }
        }}
        {...props}
      />
    </div>
  );
}
