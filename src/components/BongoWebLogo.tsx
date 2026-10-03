import React from 'react';

interface BongoWebLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
}

/**
 * Official BongoWeb Logo Component
 * Pixel-accurate reproduction of the official brand insignia:
 * - Left: Dynamic Flame & Ribbon Crest with Electric Violet-to-Royal Blue gradient (#A855F7 -> #7C3AED -> #3B52E8 -> #253BD9)
 * - Right: Modern bold rounded geometric "BongoWeb" wordmark in solid Royal Blue (#2B47EE)
 */
export default function BongoWebLogo({
  className = '',
  size = 'md',
  showText = true,
  textColor
}: BongoWebLogoProps) {
  // Dimensions mapping
  const dimensions = {
    sm: { icon: 28, text: 'text-lg', height: 'h-7' },
    md: { icon: 36, text: 'text-2xl', height: 'h-9 sm:h-10' },
    lg: { icon: 46, text: 'text-3xl', height: 'h-11 sm:h-12' },
    xl: { icon: 56, text: 'text-4xl', height: 'h-14 sm:h-16' },
  }[size];

  const iconSize = dimensions.icon;

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${dimensions.height} ${className}`}>
      {/* Dynamic Flame / Ribbon Crest Emblem */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_4px_12px_rgba(43,71,238,0.25)] transition-transform duration-300 hover:scale-105"
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

      {/* Typography: "BongoWeb" matching official logo styling */}
      {showText && (
        <div className="flex flex-col justify-center select-none">
          <div className="flex items-baseline leading-none">
            <span
              className={`font-black tracking-[-0.03em] ${dimensions.text} font-sans`}
              style={{ color: textColor || '#2B47EE' }}
            >
              BongoWeb
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
