export default function BackgroundGlows() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* 1. Subtle, expensive architectural dotted pattern on pure deep black */}
      <div 
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* 2. Very quiet, low-opacity pure monochrome white ambient depth (High-end Vercel / Apple Pro dark mode style) */}
      <div 
        className="absolute -top-40 right-[-80px] w-[500px] h-[500px] bg-gradient-to-bl from-white/[0.03] to-transparent rounded-full blur-3xl" 
      />

      <div 
        className="absolute top-1/3 left-[-100px] w-[550px] h-[550px] bg-gradient-to-tr from-white/[0.02] to-transparent rounded-full blur-3xl" 
      />

      <div 
        className="absolute -bottom-32 right-1/4 w-[600px] h-[400px] bg-gradient-to-t from-white/[0.025] to-transparent rounded-full blur-3xl" 
      />
    </div>
  );
}
