import { ArrowLeft, PhoneCall, Sparkles, Rocket, MessageCircle, ShieldCheck } from 'lucide-react';

interface OrderProcessPageProps {
  onBack: () => void;
}

export default function OrderProcessPage({ onBack }: OrderProcessPageProps) {
  const steps = [
    {
      number: '01',
      icon: PhoneCall,
      color: 'from-indigo-600 to-blue-600',
      tagColor: 'text-indigo-700 bg-indigo-50 border-indigo-200/60',
      title: 'Direct phone call or WhatsApp connection to discuss and confirm your plan (Work begins only after speaking with you)'
    },
    {
      number: '02',
      icon: Sparkles,
      color: 'from-purple-600 to-indigo-600',
      tagColor: 'text-purple-700 bg-purple-50 border-purple-200/60',
      title: 'Collecting your brand logo, website tagline, site title, and custom domain details'
    },
    {
      number: '03',
      icon: Rocket,
      color: 'from-blue-600 to-cyan-600',
      tagColor: 'text-blue-700 bg-blue-50 border-blue-200/60',
      title: 'Domain connection and rapid setup with live website delivery within 24 hours'
    },
    {
      number: '04',
      icon: MessageCircle,
      color: 'from-emerald-600 to-teal-600',
      tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/60',
      title: 'Lifetime uninterrupted technical support via official WhatsApp for any assistance'
    }
  ];

  return (
    <div 
      id="order-process-page"
      className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 flex flex-col font-sans transition-colors duration-300"
    >
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            id="order-process-back-btn"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs sm:text-sm font-semibold transition-all border border-slate-200/80 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>← Return to Catalog</span>
          </button>

          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>24-Hour Express Guarantee</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col items-center animate-fadeIn">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200/80 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Transparent Workflow</span>
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            What We Do After Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700">
              Website Order
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
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
                className="p-5 sm:p-6 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:border-indigo-300 hover:shadow-[0_8px_24px_rgba(79,70,229,0.08)] transition-all flex items-center gap-4 sm:gap-5 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-base sm:text-lg font-bold text-slate-400 font-mono">
                    {step.number}
                  </span>
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
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
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:via-indigo-900 hover:to-slate-800 text-white font-semibold text-xs sm:text-sm shadow-[0_4px_16px_rgba(15,23,42,0.18)] hover:shadow-[0_8px_24px_rgba(79,70,229,0.24)] ring-1 ring-white/10 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-300" />
            <span>Return to Catalog</span>
          </button>
        </div>
      </main>
    </div>
  );
}
