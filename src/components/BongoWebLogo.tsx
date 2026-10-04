import React, { useState, useEffect } from 'react';
import { BrandLogoConfig } from '../types';
import { DEFAULT_LOGO_CONFIG, apiGetLogoConfig, subscribeToLogoConfig } from '../utils/api';

interface BongoWebLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
}

/**
 * Official BongoWeb Logo Component
 * - Dual Engine: Supports both Official Image Logo (SVG insignia / custom image upload)
 *   and Dynamic Typed Text Logo (controlled from Admin Settings)
 * - Universal Cloud Sync: Real-time synchronization across all devices and all visitors via Cloud Firestore
 * - Auto-perfect responsive scaling for mobile, tablet, and desktop screens
 */
export default function BongoWebLogo({
  className = '',
  size = 'md',
  showText = true,
  textColor
}: BongoWebLogoProps) {
  const [config, setConfig] = useState<BrandLogoConfig>(() => {
    try {
      const stored = localStorage.getItem('bongoweb_logo_config');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (_) {}
    return DEFAULT_LOGO_CONFIG;
  });

  useEffect(() => {
    // 1. Initial fetch from universal database on mount
    apiGetLogoConfig().then((latest) => {
      if (latest && latest.logoType) {
        setConfig(latest);
      }
    });

    // 2. Realtime listener to Cloud Firestore (updates all devices globally in real-time)
    const unsubscribeFirestore = subscribeToLogoConfig((updated) => {
      if (updated && updated.logoType) {
        setConfig(updated);
      }
    });

    // 3. Local events & storage listeners
    const handleUpdate = (e: any) => {
      if (e?.detail) {
        setConfig(e.detail);
      } else {
        try {
          const stored = localStorage.getItem('bongoweb_logo_config');
          if (stored) setConfig(JSON.parse(stored));
        } catch (_) {}
      }
    };

    window.addEventListener('bongoweb_logo_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      unsubscribeFirestore();
      window.removeEventListener('bongoweb_logo_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Auto-perfect dimensions for mobile, tablet, and desktop
  const dimensions = {
    sm: { 
      iconPx: 34, 
      text: 'text-lg sm:text-xl', 
      containerH: 'h-8 sm:h-9', 
      maxImgH: 34,
      chatTextSize: 'text-xl sm:text-2xl'
    },
    md: { 
      iconPx: 44, 
      text: 'text-xl sm:text-2xl md:text-[26px]', 
      containerH: 'h-10 sm:h-12 md:h-14', 
      maxImgH: 48,
      chatTextSize: 'text-2xl sm:text-3xl md:text-4xl'
    },
    lg: { 
      iconPx: 56, 
      text: 'text-2xl sm:text-3xl md:text-4xl', 
      containerH: 'h-13 sm:h-16', 
      maxImgH: 58,
      chatTextSize: 'text-3xl sm:text-4xl md:text-5xl'
    },
    xl: { 
      iconPx: 68, 
      text: 'text-3xl sm:text-4xl md:text-5xl', 
      containerH: 'h-16 sm:h-20', 
      maxImgH: 72,
      chatTextSize: 'text-4xl sm:text-5xl md:text-6xl'
    },
  }[size];

  // Effective icon / image height respecting admin slider if set, or auto-perfect default
  const effectiveMaxHeight = config.imageSizePx && config.logoType === 'image'
    ? Math.min(Math.max(config.imageSizePx, 28), 80)
    : dimensions.maxImgH;

  const effectiveIconPx = config.imageSizePx && config.logoType === 'image'
    ? Math.min(Math.max(config.imageSizePx, 28), 80)
    : dimensions.iconPx;

  // Determine text gradient class
  const getGradientClass = (theme?: string) => {
    switch (theme) {
      case 'violet':
        return 'bg-gradient-to-r from-[#A855F7] via-[#7C3AED] to-[#3B82F6]';
      case 'sunset':
        return 'bg-gradient-to-r from-[#FF6118] via-[#F97316] to-[#F59E0B]';
      case 'emerald':
        return 'bg-gradient-to-r from-[#00B261] via-[#059669] to-[#0D9488]';
      case 'monochrome':
        return 'bg-gradient-to-r from-[#0F172A] via-[#334155] to-[#475569]';
      case 'royal':
      default:
        return 'bg-gradient-to-r from-[#2B47EE] via-[#4F46E5] to-[#7C3AED]';
    }
  };

  // ==========================================
  // MODE 1: TYPED TEXT LOGO (When Logo Image is Turned OFF)
  // ==========================================
  if (config.logoType === 'text') {
    const textToShow = config.typedLogoText || 'BongoWeb';
    const gradientClass = getGradientClass(config.textGradientTheme);

    return (
      <div 
        className={`inline-flex items-center gap-2 select-none ${dimensions.containerH} ${className}`}
        title={`${textToShow} ${config.typedSubtitle || ''}`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span 
            className={`font-black tracking-[-0.03em] ${dimensions.chatTextSize} font-sans leading-none ${gradientClass} bg-clip-text text-transparent drop-shadow-xs`}
          >
            {textToShow}
          </span>

          {config.typedSubtitle && (
            <span className="px-2 py-0.5 rounded-lg bg-[#2B47EE]/10 text-[#2B47EE] text-xs sm:text-sm font-black tracking-wider uppercase border border-[#2B47EE]/20 font-mono shadow-2xs">
              {config.typedSubtitle}
            </span>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // MODE 2: IMAGE LOGO (When Logo Image is Turned ON)
  // ==========================================
  const brandName = config.typedLogoText || 'BongoWeb';
  const shouldShowText = showText && config.showBrandTextWithImage !== false;

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${dimensions.containerH} ${className}`}>
      {/* 1. Custom Uploaded Image from Gallery / File (Auto perfect responsive size, never squished!) */}
      {config.imageUrl ? (
        <img
          src={config.imageUrl}
          alt={brandName}
          style={{ 
            maxHeight: `${effectiveMaxHeight}px`,
            width: 'auto'
          }}
          className="shrink-0 object-contain rounded-xl drop-shadow-[0_4px_14px_rgba(43,71,238,0.25)] transition-transform duration-300 hover:scale-105 max-w-[170px] sm:max-w-[240px] md:max-w-[300px]"
        />
      ) : (
        /* 2. Official Flame / Ribbon Crest Emblem (SVG) */
        <svg
          width={effectiveIconPx}
          height={effectiveIconPx}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 drop-shadow-[0_4px_14px_rgba(43,71,238,0.3)] transition-transform duration-300 hover:scale-105"
        >
          <defs>
            {/* Main Flame Gradient: Violet/Purple Top to Royal Blue Base */}
            <linearGradient id="bwFlameGradient" x1="20" y1="10" x2="95" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="25%" stopColor="#8B5CF6" />
              <stop offset="55%" stopColor="#4F46E5" />
              <stop offset="80%" stopColor="#2B47EE" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>

            {/* Secondary Ribbon Accent Gradient */}
            <linearGradient id="bwRibbonGradient" x1="15" y1="30" x2="80" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="35%" stopColor="#7C3AED" />
              <stop offset="70%" stopColor="#3B52E8" />
              <stop offset="100%" stopColor="#253BD9" />
            </linearGradient>

            {/* Inner Highlight Gradient */}
            <linearGradient id="bwHighlightGradient" x1="50" y1="15" x2="90" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#A855F7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Outer Circular Flow / Base Wing */}
          <path
            d="M 58 112 C 34 112 16 93 16 68 C 16 52 24 38 36 29 C 38 27 42 30 40 33 C 33 42 28 53 28 66 C 28 85 41 99 59 99 C 75 99 88 88 91 73 C 92 68 97 67 98 71 C 99 74 97 81 95 86 C 88 101 74 112 58 112 Z"
            fill="url(#bwFlameGradient)"
          />

          {/* Outer Left Flame Curve ascending to top tip */}
          <path
            d="M 36 29 C 33 33 31 38 30 44 C 29 42 30 38 32 34 C 36 26 44 18 52 14 C 54 13 56 16 55 18 C 51 25 45 35 46 44 C 47 48 50 51 54 49 C 60 46 64 36 67 27 C 70 18 73 11 74 8 C 75 6 78 8 78 11 C 77 19 72 32 76 41 C 78 45 83 46 87 42 C 92 37 94 28 95 22 C 95 20 98 21 98 23 C 98 32 94 43 97 52 C 99 57 104 60 106 66 C 109 74 107 83 102 90 C 100 93 96 91 97 88 C 100 81 100 73 97 67 C 94 62 89 60 86 64 C 81 71 80 81 74 87 C 67 94 57 97 47 95 C 37 93 29 84 29 73 C 29 63 35 55 42 49 C 45 47 48 51 45 54 C 38 60 38 71 44 78 C 50 84 60 84 66 79 C 71 75 73 68 76 62 C 78 57 82 54 84 59 C 85 62 84 66 82 69 C 78 77 72 82 64 84 C 55 86 46 83 42 75 C 39 70 40 62 44 57 C 48 52 54 48 58 44 C 61 41 59 36 55 36 C 50 36 44 41 41 46 C 39 49 35 48 35 45 C 35 39 40 31 46 25 C 48 23 51 21 54 19 C 55 18 54 16 53 16 C 45 20 38 24 36 29 Z"
            fill="url(#bwRibbonGradient)"
          />

          {/* Central Core Ember Flame Shape */}
          <path
            d="M 52 14 C 47 23 44 33 46 44 C 47 50 51 53 56 50 C 62 46 66 36 69 27 C 72 18 74 11 75 8 C 76 6 77 7 77 9 C 76 18 71 31 75 40 C 78 45 83 46 87 42 C 92 37 94 28 95 22 C 95 20 97 21 97 23 C 97 32 93 42 96 51 C 98 57 103 60 105 66 C 101 62 97 60 93 62 C 87 66 84 74 80 81 C 74 90 63 94 53 93 C 43 91 35 83 35 72 C 35 63 40 55 47 50 C 49 48 52 51 50 54 C 45 60 44 69 49 76 C 54 82 63 83 69 78 C 74 74 76 67 79 61 C 81 57 85 55 86 59 C 87 62 86 66 84 69 C 80 77 74 81 66 82 C 58 84 51 81 47 75 C 44 70 45 63 49 58 C 53 53 58 48 61 43 C 64 39 61 35 57 35 C 53 35 48 39 45 44 C 43 47 39 46 39 43 C 40 37 45 29 50 23 C 52 21 54 18 53 16 C 53 15 52 14 52 14 Z"
            fill="url(#bwHighlightGradient)"
          />

          {/* Dynamic inner loop giving the 'B' curve resonance */}
          <path
            d="M 52 68 C 50 74 53 80 59 81 C 65 82 70 78 72 73 C 74 68 71 63 66 62 C 60 61 54 63 52 68 Z"
            fill="#FFFFFF"
            fillOpacity="0.95"
          />

          {/* Lower counter punch to mimic the stylized 'B' / 'W' optical flow */}
          <path
            d="M 44 82 C 40 76 43 70 48 67 C 49 66 50 68 49 69 C 46 72 44 76 46 80 C 47 83 50 84 53 84 C 55 84 56 86 54 87 C 50 88 46 86 44 82 Z"
            fill="#FFFFFF"
            fillOpacity="0.8"
          />
        </svg>
      )}

      {/* Typography: Brand Wordmark */}
      {shouldShowText && (
        <div className="flex flex-col justify-center select-none">
          <div className="flex items-baseline leading-none">
            <span
              className={`font-black tracking-[-0.03em] ${dimensions.text} font-sans`}
              style={{ color: textColor || '#2B47EE' }}
            >
              {brandName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

