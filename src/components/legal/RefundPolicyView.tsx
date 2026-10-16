import React, { useEffect } from 'react';
import { RefreshCw, ArrowLeft, CheckCircle2, Clock, HelpCircle, ShieldCheck } from 'lucide-react';
import { updatePageSEO } from '../../utils/seo';

interface RefundPolicyViewProps {
  onBack: () => void;
  onNavigateToLiveChat?: () => void;
}

export default function RefundPolicyView({
  onBack,
  onNavigateToLiveChat
}: RefundPolicyViewProps) {
  useEffect(() => {
    updatePageSEO({
      title: 'Refund & Cancellation Policy',
      description: 'Official 7-Day Money-Back Guarantee and Cancellation Policy for BongoWeb website setups and hosting subscriptions.',
      canonicalPath: '/refund'
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#F8F5FC] text-[#1F1F2E] font-sans pb-28 pt-4 sm:pt-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8F5FC] text-[#5B2C8A] border border-[#EDE4F5] text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          <span className="text-xs text-[#6B7280] font-mono">
            Clear &amp; Transparent
          </span>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-[#EDE4F5] shadow-xs p-6 sm:p-10 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#F8F5FC] text-[#5B2C8A] border border-[#EDE4F5] flex items-center justify-center mb-4">
            <RefreshCw className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F2E] tracking-tight">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-sm sm:text-base text-[#4A4A5A] mt-2 leading-relaxed">
            At <strong>BongoWeb</strong>, we value complete customer trust. We want you to feel 100% confident when choosing your business website template.
          </p>

          <div className="mt-4 p-4 rounded-2xl bg-[#F8F5FC] border border-[#EDE4F5] text-xs text-[#5B2C8A] flex items-center gap-2 font-medium">
            <ShieldCheck className="w-5 h-5 shrink-0 text-[#10B981]" />
            <span>
              <strong>7-Day Money-Back Guarantee:</strong> If our deployed website does not mirror the live demo features you chose or if technical issues prevent deployment, you are entitled to a full refund of setup fees.
            </span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">

          {/* Section 1 */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">1</span>
              Eligibility for Refund
            </h2>
            <ul className="text-xs sm:text-sm text-[#4A4A5A] space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Pre-Deployment Cancellation:</strong> If you place an order and request cancellation before our engineers initiate customized domain configuration and code deployment, you receive an immediate 100% refund.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Demo Discrepancy:</strong> If the delivered website fails to provide the core functional capabilities demonstrated in the catalog preview and our technical team is unable to rectify it within 48 hours, you are entitled to a full refund.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Advance Monthly Cloud Fees:</strong> Advance unused monthly hosting fees are refundable on a pro-rata basis if you decide to decommission your website node.</span>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">2</span>
              Non-Refundable Items
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed mb-3">
              The following costs are non-refundable once registered with external global registries:
            </p>
            <ul className="text-xs sm:text-sm text-[#4A4A5A] space-y-2 list-disc list-inside leading-relaxed">
              <li><strong>Third-Party Top-Level Domain (TLD) Registration:</strong> Once a custom domain (e.g. <code>yourname.com</code>) is registered with ICANN/domain registrars in your name, the domain registrar fee is non-refundable by registry rules (you retain full domain ownership).</li>
              <li>Services requested beyond 7 days of verified live website handover.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">3</span>
              How to Request a Refund
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#4A4A5A] leading-relaxed">
              <p>To submit a refund request, simply contact us with your <strong>Order ID</strong> through any of the following channels:</p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p><strong>Option A — Email:</strong> Send your Order ID and cancellation reason to <a href="mailto:refunds@bongoweb.xyz" className="text-[#5B2C8A] font-bold underline">refunds@bongoweb.xyz</a>.</p>
                <p><strong>Option B — Support Ticket:</strong> Open a support ticket directly from the sidebar menu under &quot;Support Ticket&quot;.</p>
                <p><strong>Option C — Live Chat:</strong> Message our 24/7 technical team on{' '}
                  {onNavigateToLiveChat ? (
                    <button
                      type="button"
                      onClick={onNavigateToLiveChat}
                      className="text-[#5B2C8A] font-bold underline cursor-pointer"
                    >
                      Live Chat
                    </button>
                  ) : (
                    <a href="/live-chat" className="text-[#5B2C8A] font-bold underline">Live Chat</a>
                  )}
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">4</span>
              Refund Processing Timeline
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed">
              Approved refunds are processed within <strong>3 to 7 business days</strong>. Refunds will be transferred back to your original source of payment (bKash, Nagad, Rocket, or direct bank transfer) with zero deduction of hidden fees.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
