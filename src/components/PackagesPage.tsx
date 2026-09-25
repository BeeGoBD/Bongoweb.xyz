import { useState } from 'react';
import { ArrowLeft, Check, Zap, Sparkles, ShieldCheck, HelpCircle, ArrowRight, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import { PRICING_PACKAGES } from '../data/mockData';

interface PackagesPageProps {
  onBack: () => void;
  onSelectPackage: (packageName: string) => void;
}

export default function PackagesPage({
  onBack,
  onSelectPackage
}: PackagesPageProps) {
  const [specModalOpen, setSpecModalOpen] = useState(false);
  const [selectedSpecPkg, setSelectedSpecPkg] = useState<string>('Business Pro');
  const currentSpecPkg = PRICING_PACKAGES.find(p => p.name === selectedSpecPkg) || PRICING_PACKAGES[0];
  return (
    <div 
      id="packages-page"
      className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 flex flex-col font-sans"
    >
      {/* 1. Page Header */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              id="back-to-dashboard-btn"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs sm:text-sm font-semibold transition-all border border-slate-200/80 cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
              <span>← Return to Catalog</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
              <span className="text-xs font-bold text-slate-900">
                Transparent Plans & Pricing
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-[11px] text-slate-500 font-medium">
                Turnkey setup from ৳999 BDT · Predictable monthly cloud upkeep
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200/80 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero Hidden Fees</span>
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main Page Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-slate-700 bg-white border border-indigo-200/80 shadow-[0_1px_4px_rgba(79,70,229,0.06)] mb-3">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Clear Investment Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Predictable pricing for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700">
              ambitious entrepreneurs
            </span>.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            One flat setup fee for your complete custom website, followed by predictable monthly cloud upkeep. Lifetime ownership included.
          </p>
        </div>

        {/* Packages Grid: 3-Column Luxury Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-stretch">
          {PRICING_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl transition-all duration-300 ${
                pkg.popular
                  ? 'bg-gradient-to-b from-indigo-50/40 via-white to-indigo-50/20 border-2 border-indigo-500 shadow-[0_16px_40px_rgba(99,102,241,0.14)] ring-1 ring-indigo-500/20 hover:-translate-y-1'
                  : 'bg-gradient-to-b from-white to-slate-50/40 border border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.03)] hover:border-indigo-300 hover:shadow-[0_12px_32px_rgba(79,70,229,0.08)] hover:-translate-y-0.5'
              }`}
            >
              {/* Top Left Most Popular Badge - rounded shape, not touching border */}
              {pkg.popular && (
                <div className="absolute top-3.5 left-4 sm:top-4 sm:left-5 px-3 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-xs flex items-center gap-1.5 ring-1 ring-white/20 z-20">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Most Popular</span>
                </div>
              )}

              {/* Top Right Corner View Details Button with tiny gap from border and rounded shape like the package */}
              <button
                type="button"
                onClick={() => {
                  setSelectedSpecPkg(pkg.name);
                  setSpecModalOpen(true);
                }}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 z-20"
                title={`View all specifications for ${pkg.name}`}
              >
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
              </button>

              <div>
                <div className="mb-6 mt-8 sm:mt-9">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{pkg.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">{pkg.subtitle}</p>
                </div>

                <div className={`p-4 rounded-2xl mb-6 relative overflow-hidden ${
                  pkg.popular 
                    ? 'bg-gradient-to-b from-indigo-50/50 via-white to-indigo-50/20 border-2 border-indigo-400/80 shadow-sm' 
                    : 'bg-slate-50/90 border border-slate-200/70'
                }`}>
                  {pkg.popular && (
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg tracking-wider uppercase">
                      Cloud SLA
                    </div>
                  )}
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-600">One-Time Setup:</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">৳{pkg.oneTimeFee}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-700 pt-2 border-t border-slate-200/60 font-medium">
                    <span className="text-slate-600">Monthly Server Hosting:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-indigo-700 font-mono text-sm">৳{pkg.monthlyRenew}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded border border-emerald-200 font-mono">
                        Active SLA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                    Included Deliverables:
                  </span>
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectPackage(pkg.name)}
                className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 ${
                  pkg.popular
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:via-teal-500 hover:to-indigo-500 text-white shadow-[0_4px_16px_rgba(5,150,105,0.25)] hover:-translate-y-0.5'
                    : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:via-indigo-900 hover:to-slate-800 text-white shadow-xs hover:-translate-y-0.5'
                }`}
              >
                <span>Select this Package</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* FAQs Reassurance Strip */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Have Questions or Need a Custom Scope?</h4>
              <p className="text-slate-500 mt-0.5 text-xs">
                Speak directly with our senior development team over WhatsApp. We reply in under 5 minutes.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/8801700000000"
            target="_blank"
            rel="noreferrer"
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Ask via WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </main>

      {/* Full Specifications Modal */}
      {specModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 relative overflow-hidden text-slate-800">
            {/* Jewel Top Bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Full Specification Breakdown
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                  {selectedSpecPkg} Deliverables
                </h3>
              </div>
              <button
                onClick={() => setSpecModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-600">One-Time Setup:</span>
                  <span className="text-2xl font-bold font-mono text-slate-900">৳{currentSpecPkg.oneTimeFee}</span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-slate-600 pt-2 border-t border-indigo-100/60">
                  <span>Monthly Server Hosting:</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">৳{currentSpecPkg.monthlyRenew} / month</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Technical Specifications & Included Architecture
                </h4>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Complete Responsive Design</strong>
                      <span>Tailored for all viewports (Mobile, Tablet, Desktop) with 100% Google PageSpeed optimization.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Automated Payment Gateways</strong>
                      <span>Fully connected with bKash, Nagad, Rocket, Upay, Visa, and Mastercard checkouts.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Custom Domain & SSL</strong>
                      <span>Free connection of your official branded domain name with free 256-bit SSL security certificate.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Cloud Server SLA & Daily Backups</strong>
                      <span>99.9% uptime guaranteed with automated daily snapshot cloud backups and technical upkeep.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Instant 1-Click WhatsApp Ordering</strong>
                      <span>Captures customer orders directly to your WhatsApp with pre-filled items and customer phone.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setSpecModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSpecModalOpen(false);
                  onSelectPackage(selectedSpecPkg);
                }}
                className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Select this Package</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
