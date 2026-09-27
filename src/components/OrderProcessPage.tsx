import { ArrowLeft, PhoneCall, Sparkles, Rocket, MessageCircle, ShieldCheck } from 'lucide-react';

interface OrderProcessPageProps {
  onBack: () => void;
}

export default function OrderProcessPage({ onBack }: OrderProcessPageProps) {
  const steps = [
    {
      number: '01',
      icon: PhoneCall,
      title: 'Direct phone call or WhatsApp connection to discuss and confirm your plan (Work begins only after speaking with you)'
    },
    {
      number: '02',
      icon: Sparkles,
      title: 'Collecting your brand logo, website tagline, site title, and custom domain details'
    },
    {
      number: '03',
      icon: Rocket,
      title: 'Domain connection and rapid setup with live website delivery within 24 hours'
    },
    {
      number: '04',
      icon: MessageCircle,
      title: 'Lifetime uninterrupted technical support via official WhatsApp for any assistance'
    }
  ];

  return (
    <div 
      id="order-process-page"
      className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col font-sans transition-colors duration-300"
    >
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            id="order-process-back-btn"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#141414] hover:bg-white hover:text-black text-white text-xs sm:text-sm font-semibold transition-all border border-white/15 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Return to Catalog</span>
          </button>

          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/20 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span>24-Hour Express Guarantee</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col items-center animate-fadeIn">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#141414] text-white border border-white/20 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Transparent Workflow</span>
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            What We Do After Your{' '}
            <span className="text-white underline decoration-white/40 underline-offset-8">
              Website Order
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            Our step-by-step commitment from the moment you place an order to live launch.
          </p>
        </div>

        {/* 4 Points Cards Grid */}
        <div className="w-full space-y-4 mb-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-[#141414] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-white/30 transition-all flex items-center gap-4 sm:gap-5 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-base sm:text-lg font-bold text-neutral-500 font-mono">
                    {step.number}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-white/10 text-white border border-white/20 flex items-center justify-center shrink-0 shadow-xs">
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {step.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Return Action */}
        <div className="flex justify-center w-full">
          <button
            onClick={onBack}
            id="order-process-return-bottom-btn"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowLeft className="w-4 h-4 text-black" />
            <span>Return to Catalog</span>
          </button>
        </div>
      </main>
    </div>
  );
}
