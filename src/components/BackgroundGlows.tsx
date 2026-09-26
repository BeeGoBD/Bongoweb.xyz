export default function BackgroundGlows() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* 1. Subtle light-gray abstract geometric grid / cityscape motif lines (#EDEDEF) */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-60 text-[#EDEDEF]" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="cityscape-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cityscape-grid)" />
      </svg>

      {/* 2. Abstract modern skyline / geometric accents (#EDEDEF) */}
      <svg 
        className="absolute top-12 right-0 w-[500px] h-[340px] opacity-40 text-[#EDEDEF]" 
        viewBox="0 0 500 340" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="360" y="40" width="80" height="280" rx="4" stroke="currentColor" strokeWidth="1.2" />
        <rect x="240" y="90" width="100" height="230" rx="4" stroke="currentColor" strokeWidth="1.2" />
        <rect x="140" y="150" width="80" height="170" rx="4" stroke="currentColor" strokeWidth="1.2" />
        <rect x="50" y="210" width="70" height="110" rx="4" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="390" cy="110" r="3" fill="currentColor" />
        <circle cx="280" cy="160" r="3" fill="currentColor" />
        <circle cx="180" cy="200" r="3" fill="currentColor" />
      </svg>

      {/* 3. Poster-style large vibrant warm curved / wave shapes in Primary Orange (#FF9D14 & #FEB74F) */}
      {/* Top right sunny warmth aura */}
      <div 
        className="absolute -top-40 right-[-100px] w-[620px] h-[620px] bg-gradient-to-bl from-[#FF9D14]/12 via-[#FEB74F]/8 to-transparent rounded-full blur-3xl opacity-75" 
      />

      {/* Bottom dynamic energetic yellow-orange wave curve from poster */}
      <div className="absolute -bottom-24 -left-20 w-[680px] h-[380px] bg-gradient-to-tr from-[#FF9D14]/15 via-[#FEB74F]/10 to-transparent rounded-full blur-3xl opacity-80" />

      {/* Floating sunny ray accent */}
      <div 
        className="absolute top-1/3 -left-32 w-[480px] h-[480px] bg-gradient-to-br from-[#FEB74F]/10 via-[#FF9D14]/5 to-transparent rounded-full blur-3xl opacity-60" 
      />
    </div>
  );
}
