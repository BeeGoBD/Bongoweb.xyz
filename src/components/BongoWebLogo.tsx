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

  // Auto-perfect dimensions for mobile, tablet, and desktop (Generously sized for high clarity)
  const dimensions = {
    sm: { 
      iconPx: 48, 
      text: 'text-xl sm:text-2xl', 
      containerH: 'h-11 sm:h-12', 
      maxImgH: 56,
      chatTextSize: 'text-2xl sm:text-3xl'
    },
    md: { 
      iconPx: 72, 
      text: 'text-2xl sm:text-3xl md:text-[30px]', 
      containerH: 'h-16 sm:h-20 md:h-[84px]', 
      maxImgH: 86,
      chatTextSize: 'text-3xl sm:text-4xl md:text-5xl'
    },
    lg: { 
      iconPx: 88, 
      text: 'text-3xl sm:text-4xl md:text-5xl', 
      containerH: 'h-20 sm:h-24 md:h-28', 
      maxImgH: 98,
      chatTextSize: 'text-4xl sm:text-5xl md:text-6xl'
    },
    xl: { 
      iconPx: 104, 
      text: 'text-4xl sm:text-5xl md:text-6xl', 
      containerH: 'h-24 sm:h-28 md:h-32', 
      maxImgH: 116,
      chatTextSize: 'text-5xl sm:text-6xl md:text-7xl'
    },
  }[size];

  // Effective icon / image height respecting admin slider if set, or auto-perfect default
  const configuredH = config.imageSizePx && config.imageSizePx >= 40 ? config.imageSizePx : 0;
  const effectiveMaxHeight = configuredH || dimensions.maxImgH;
  const effectiveIconPx = configuredH || dimensions.iconPx;
  const effectiveImageUrl = config.imageUrl || '/uploaded-brand-logo.png';

  // Determine text gradient class using official brand colors from logo
  const getGradientClass = (theme?: string) => {
    switch (theme) {
      case 'sunset':
        return 'bg-gradient-to-r from-[#DC2626] via-[#EA580C] to-[#F59E0B]';
      case 'emerald':
        return 'bg-gradient-to-r from-[#00B261] via-[#059669] to-[#0D9488]';
      case 'monochrome':
        return 'bg-gradient-to-r from-[#0F172A] via-[#334155] to-[#475569]';
      case 'violet':
        return 'bg-gradient-to-r from-[#BE123C] via-[#E11D48] to-[#D97706]';
      case 'royal':
      default:
        return 'bg-gradient-to-r from-[#DC2626] via-[#E11D48] to-[#D97706]';
    }
  };

  // ==========================================
  // MODE 1: TYPED TEXT LOGO (Only if explicitly set to text AND no image URL)
  // ==========================================
  if (config.logoType === 'text' && !config.imageUrl) {
    const textToShow = config.typedLogoText || 'BongoWeb';
    const gradientClass = getGradientClass(config.textGradientTheme);

    return (
      <div 
        className={`inline-flex items-center gap-2 select-none ${dimensions.containerH} ${className}`}
        title={`${textToShow} ${config.typedSubtitle || ''}`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span 
            className={`font-black tracking-[-0.03em] ${dimensions.chatTextSize} font-sans leading-none ${gradientClass} bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(220,38,38,0.2)]`}
          >
            {textToShow}
          </span>

          {config.typedSubtitle && (
            <span className="px-2 py-0.5 rounded-lg bg-[#DC2626]/10 text-[#DC2626] text-xs sm:text-sm font-black tracking-wider uppercase border border-[#DC2626]/20 font-mono shadow-2xs">
              {config.typedSubtitle}
            </span>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // MODE 2: OFFICIAL BRAND LOGO IMAGE (Always stays online, perfect size)
  // ==========================================
  const brandName = config.typedLogoText || 'BongoWeb';

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${dimensions.containerH} ${className}`}>
      {/* 1. Official Image Logo (Universal Cloud Sync across all devices, perfectly sized) */}
      {effectiveImageUrl ? (
        <img
          src={effectiveImageUrl}
          alt={brandName}
          style={{ 
            maxHeight: `${Math.max(effectiveMaxHeight, 68)}px`,
            width: 'auto'
          }}
          className="shrink-0 object-contain rounded-lg drop-shadow-[0_2px_12px_rgba(220,38,38,0.18)] transition-all duration-300 hover:scale-105 h-12 sm:h-16 md:h-[72px] max-h-[64px] sm:max-h-[72px] md:max-h-[78px] w-auto max-w-[260px] sm:max-w-[360px] md:max-w-[460px]"
        />
      ) : (
        /* 2. Official Vector Logo */
        <svg
          viewBox="0 0 490 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 drop-shadow-[0_4px_14px_rgba(220,38,38,0.25)] transition-transform duration-300 hover:scale-105 h-14 sm:h-18 md:h-[76px] w-auto max-w-[280px] sm:max-w-[400px] md:max-w-[500px]"
        >
          <defs>
            <linearGradient id="bwCircleGradient" x1="10" y1="10" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="35%" stopColor="#E11D48" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            <linearGradient id="bwTextGradient" x1="130" y1="20" x2="470" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="25%" stopColor="#E11D48" />
              <stop offset="60%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Circular Emblem with 'B' Monogram */}
          <g id="emblem" transform="translate(5, 5)">
            <circle cx="50" cy="50" r="50" fill="url(#bwCircleGradient)" />
            <path
              d="M 10 24 L 52 24 C 67 24 77 33 77 44 C 77 51 72 57 64 59 C 61 60 56 61 50 61 L 28 61 L 43 38 L 22 38 L 10 24 Z"
              fill="#FFFFFF"
            />
            <path
              d="M 18 78 L 32 54 L 54 54 C 68 54 78 63 78 74 C 78 86 67 96 50 96 L 24 96 L 36 78 L 52 78 C 58 78 63 74 63 69 C 63 64 58 60 51 60 L 30 60 L 18 78 Z"
              fill="#FFFFFF"
            />
            <path
              d="M 38 38 L 52 38 C 59 38 64 41 64 45 C 64 49 59 52 52 52 L 29 52 L 38 38 Z"
              fill="url(#bwCircleGradient)"
            />
          </g>

          {/* Typographic Wordmark: BongoWeb */}
          <g id="wordmark" transform="translate(130, 0)">
            <text
              x="0"
              y="76"
              fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, system-ui, sans-serif"
              fontWeight="900"
              fontSize="58"
              letterSpacing="-1.5px"
              fill={textColor || "url(#bwTextGradient)"}
            >BongoWeb</text>
            <polygon
              points="76,26 88,26 82,35"
              fill={textColor || "url(#bwTextGradient)"}
            />
            <path
              d="M 74 81 C 74 87 90 87 90 81"
              stroke={textColor || "url(#bwTextGradient)"}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </svg>
      )}
    </div>
  );
}

