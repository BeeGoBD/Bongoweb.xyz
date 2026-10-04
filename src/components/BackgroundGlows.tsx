export default function BackgroundGlows() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* 1. Subtle, expensive architectural dotted pattern tinted in brand royal */}
      <div 
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(rgba(43, 71, 238, 0.08) 1.2px, transparent 1.2px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* 2. Brand Ambient Blooms: Violet, Indigo & Royal Electric Blue */}
      {/* Royal electric blue bloom top right */}
      <div 
        className="absolute -top-36 right-[-80px] w-[560px] h-[560px] bg-gradient-to-bl from-[#2B47EE]/[0.07] via-[#4F46E5]/[0.03] to-transparent rounded-full blur-[110px]" 
      />

      {/* Radiant violet bloom top left */}
      <div 
        className="absolute top-1/4 left-[-120px] w-[600px] h-[600px] bg-gradient-to-tr from-[#7C3AED]/[0.05] via-[#A855F7]/[0.02] to-transparent rounded-full blur-[130px]" 
      />

      {/* Soft royal deep radiance bottom center */}
      <div 
        className="absolute -bottom-36 right-1/4 w-[640px] h-[480px] bg-gradient-to-t from-[#2B47EE]/[0.05] via-[#3B52E8]/[0.02] to-transparent rounded-full blur-[120px]" 
      />
    </div>
  );
}
