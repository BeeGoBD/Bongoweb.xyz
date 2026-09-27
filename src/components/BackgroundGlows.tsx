export default function BackgroundGlows() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* 1. Subtle, expensive architectural dotted pattern on cream white */}
      <div 
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(rgba(128, 0, 32, 0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* 2. Warm ambient light blooms: Soft Maroon & Warm Champagne Cream */}
      {/* Soft maroon ambient bloom top right */}
      <div 
        className="absolute -top-40 right-[-80px] w-[540px] h-[540px] bg-gradient-to-bl from-[#800020]/[0.05] via-[#800020]/[0.015] to-transparent rounded-full blur-[100px]" 
      />

      {/* Warm cream/amber ambient glow top left */}
      <div 
        className="absolute top-1/4 left-[-100px] w-[580px] h-[580px] bg-gradient-to-tr from-[#D4AF37]/[0.04] via-[#F5EBE1]/[0.02] to-transparent rounded-full blur-[120px]" 
      />

      {/* Maroon warmth bottom center */}
      <div 
        className="absolute -bottom-32 right-1/4 w-[620px] h-[450px] bg-gradient-to-t from-[#800020]/[0.04] via-transparent to-transparent rounded-full blur-[110px]" 
      />
    </div>
  );
}
