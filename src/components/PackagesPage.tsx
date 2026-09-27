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
      className="min-h-screen w-full bg-[#0A0A0A] text-[#F5F5F5] flex flex-col font-sans"
    >
      {/* 1. Page Header */}
      <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              id="back-to-dashboard-btn"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] text-white text-xs sm:text-sm font-semibold transition-all border border-white/15 cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-400" />
              <span>← Return to Catalog</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/10">
              <span className="text-xs font-bold text-white">
                Transparent Plans & Pricing
              </span>
              <span className="text-neutral-600">·</span>
              <span className="text-[11px] text-neutral-400 font-medium">
                Turnkey setup from ৳999 BDT · Predictable monthly cloud upkeep
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 text-white bg-white/10 px-3 py-1 rounded-full font-bold border border-white/20 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>Zero Hidden Fees</span>
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main Page Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#141414] border border-white/15 shadow-xs mb-3">
            <Zap className="w-3.5 h-3.5 text-white" />
            <span>Clear Investment Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Predictable pricing for{' '}
            <span className="text-white underline decoration-white/40 underline-offset-8">
              ambitious entrepreneurs
            </span>.
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-2">
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
                  ? 'bg-[#181818] border-2 border-white shadow-[0_16px_40px_rgba(255,255,255,0.06)] hover:-translate-y-1'
                  : 'bg-[#141414] border border-white/10 shadow-xs hover:border-white/30 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              {/* Top Left Most Popular Badge */}
              {pkg.popular && (
                <div className="absolute top-3.5 left-4 sm:top-4 sm:left-5 px-3 py-1 rounded-xl bg-white text-black text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-xs flex items-center gap-1.5 z-20">
                  <Sparkles className="w-3 h-3 text-black" />
                  <span>Most Popular</span>
                </div>
              )}

              {/* Top Right Corner View Details Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedSpecPkg(pkg.name);
                  setSpecModalOpen(true);
                }}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white hover:text-black border border-white/20 shadow-2xs hover:shadow-xs transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 z-20"
                title={`View all specifications for ${pkg.name}`}
              >
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div>
                <div className="mb-6 mt-8 sm:mt-9">
                  <h3 className="text-xl font-extrabold text-white tracking-tight">{pkg.name}</h3>
                  <p className="text-xs text-neutral-400 font-medium mt-1">{pkg.subtitle}</p>
                </div>

                <div className={`p-4 rounded-2xl mb-6 relative overflow-hidden ${
                  pkg.popular 
                    ? 'bg-white/5 border border-white/20' 
                    : 'bg-[#0A0A0A] border border-white/10'
                }`}>
                  {pkg.popular && (
                    <div className="absolute top-0 right-0 bg-white text-black text-[9px] font-bold px-2 py-0.5 rounded-bl-lg tracking-wider uppercase">
                      Cloud SLA
                    </div>
                  )}
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs font-semibold text-neutral-400">One-Time Setup:</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">৳{pkg.oneTimeFee}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-white pt-2 border-t border-white/10 font-medium">
                    <span className="text-neutral-400">Monthly Server Hosting:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white font-mono text-sm">৳{pkg.monthlyRenew}</span>
                      <span className="text-[10px] font-bold text-black bg-white px-1.5 py-0.2 rounded font-mono">
                        Active SLA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <span className="text-[11px] font-bold text-[#00FF88] block uppercase tracking-wider">
                    Included Deliverables:
                  </span>
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#00FF88]">
                      <div className="w-4 h-4 rounded-full bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="font-medium text-white">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectPackage(pkg.name)}
                className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold btn-rgb text-black transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <span>Select this Package</span>
                <ArrowRight className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              </button>
            </div>
          ))}
        </div>

        {/* FAQs Reassurance Strip */}
        <div className="p-6 bg-[#141414] rounded-2xl border border-white/10 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white border border-white/20 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Have Questions or Need a Custom Scope?</h4>
              <p className="text-neutral-400 mt-0.5 text-xs">
                Speak directly with our senior development team over WhatsApp. We reply in under 5 minutes.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/8801700000000"
            target="_blank"
            rel="noreferrer"
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Ask via WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </a>
        </div>
      </main>

      {/* Full Specifications Modal */}
      {specModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl bg-[#141414] rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 relative overflow-hidden text-white">
            {/* Jewel Top Bar: Crisp white accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold text-black bg-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Full Specification Breakdown
                </span>
                <h3 className="text-xl font-extrabold text-white tracking-tight mt-1">
                  {selectedSpecPkg} Deliverables
                </h3>
              </div>
              <button
                onClick={() => setSpecModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-[#0A0A0A] hover:bg-white hover:text-black flex items-center justify-center text-neutral-400 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/10">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-semibold text-neutral-400">One-Time Setup:</span>
                  <span className="text-2xl font-bold font-mono text-white">৳{currentSpecPkg.oneTimeFee}</span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-neutral-400 pt-2 border-t border-white/10">
                  <span>Monthly Server Hosting:</span>
                  <span className="font-bold text-white font-mono text-sm">৳{currentSpecPkg.monthlyRenew} / month</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Technical Specifications & Included Architecture
                </h4>
                <div className="space-y-2 text-xs text-neutral-400">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#0A0A0A] border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Complete Responsive Design</strong>
                      <span>Tailored for all viewports (Mobile, Tablet, Desktop) with 100% Google PageSpeed optimization.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#0A0A0A] border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Automated Payment Gateways</strong>
                      <span>Fully connected with bKash, Nagad, Rocket, Upay, Visa, and Mastercard checkouts.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#0A0A0A] border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Custom Domain & SSL</strong>
                      <span>Free connection of your official branded domain name with free 256-bit SSL security certificate.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#0A0A0A] border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Cloud Server SLA & Daily Backups</strong>
                      <span>99.9% uptime guaranteed with automated daily snapshot cloud backups and technical upkeep.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#0A0A0A] border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Instant 1-Click WhatsApp Ordering</strong>
                      <span>Captures customer orders directly to your WhatsApp with pre-filled items and customer phone.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={() => setSpecModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-white/20 text-xs font-semibold text-neutral-400 hover:text-white hover:bg-[#0A0A0A] cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSpecModalOpen(false);
                  onSelectPackage(selectedSpecPkg);
                }}
                className="flex-1 px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Select this Package</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
