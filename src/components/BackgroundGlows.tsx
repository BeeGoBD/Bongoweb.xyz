export default function BackgroundGlows() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Top ambient highlight - rich sapphire / indigo luxury aura */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[950px] h-[520px] bg-gradient-to-b from-indigo-200/40 via-blue-100/30 to-transparent rounded-full blur-3xl opacity-80" 
      />
      {/* Subtle emerald financial-trust glow on bottom right */}
      <div 
        className="absolute -bottom-28 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-emerald-100/35 via-teal-50/25 to-transparent rounded-full blur-3xl opacity-75" 
      />
      {/* Subtle cobalt / champagne ambient fill on top left */}
      <div 
        className="absolute top-1/4 -left-36 w-[550px] h-[550px] bg-gradient-to-br from-blue-100/35 via-indigo-50/20 to-transparent rounded-full blur-3xl opacity-70" 
      />
      {/* Architectural subtle micro-grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:24px_24px]" 
      />
    </div>
  );
}
