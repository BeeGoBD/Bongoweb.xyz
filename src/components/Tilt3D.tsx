import React, { useState, useRef, useCallback } from 'react';

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // degrees
  scale?: number;
  perspective?: number;
  glare?: boolean;
  glareOpacity?: number;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  tabIndex?: number;
  role?: string;
  'aria-label'?: string;
}

export default function Tilt3D({
  children,
  className = '',
  maxTilt = 10,
  scale = 1.02,
  perspective = 1000,
  glare = true,
  glareOpacity = 0.25,
  onClick,
  onKeyDown,
  tabIndex,
  role,
  'aria-label': ariaLabel
}: Tilt3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
  });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setStyle({
      transform: `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'transform 0.08s ease-out'
    });

    if (glare) {
      setGlarePos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: glareOpacity
      });
    }
  }, [maxTilt, scale, perspective, glare, glareOpacity]);

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
    });
    if (glare) {
      setGlarePos(prev => ({ ...prev, opacity: 0 }));
    }
  }, [perspective, glare]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      role={role}
      aria-label={ariaLabel}
      style={{
        ...style,
        transformStyle: 'preserve-3d'
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300 z-30"
          style={{ opacity: glarePos.opacity }}
        >
          <div
            className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)`
            }}
          />
        </div>
      )}
    </div>
  );
}
