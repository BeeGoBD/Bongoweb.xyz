import React, { useRef, useState, useCallback } from 'react';

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  glare?: boolean;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  role?: string;
  tabIndex?: number;
  'aria-label'?: string;
}

export default function TiltCard3D({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.02,
  glare = true,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  'aria-label': ariaLabel
}: TiltCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`);
    
    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlarePosition({ x: glareX, y: glareY, opacity: 0.15 });
    }
  }, [maxTilt, scale, glare]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transformStyle: 'preserve-3d',
        transition: isHovered ? 'transform 100ms ease-out' : 'transform 450ms cubic-bezier(0.23, 1, 0.32, 1)'
      }}
      className={`relative will-change-transform ${className}`}
    >
      {/* 3D Depth Content */}
      <div className="w-full h-full [transform-style:preserve-3d]">
        {children}
      </div>

      {/* Dynamic 3D Specular Glare Sheen */}
      {glare && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-inherit transition-opacity duration-300 z-30"
          style={{
            borderRadius: 'inherit',
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 65%)`,
            opacity: glarePosition.opacity
          }}
        />
      )}
    </div>
  );
}
