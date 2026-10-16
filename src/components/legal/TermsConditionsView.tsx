import React, { useEffect } from 'react';
import { FileText, ArrowLeft, CheckCircle2, AlertCircle, Scale, ShieldCheck } from 'lucide-react';
import { updatePageSEO } from '../../utils/seo';

interface TermsConditionsViewProps {
  onBack: () => void;
  onNavigateToPrivacy?: () => void;
  onNavigateToRefund?: () => void;
}

export default function TermsConditionsView({
  onBack,
  onNavigateToPrivacy,
  onNavigateToRefund
}: TermsConditionsViewProps) {
  useEffect(() => {
    updatePageSEO({
      title: 'Terms and Conditions',
      description: 'Official Terms of Service and Conditions for BongoWeb website catalog, custom deployment, and cloud subscription services.',
      canonicalPath: '/terms'
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
            Effective Date: January 2025
          </span>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-[#EDE4F5] shadow-xs p-6 sm:p-10 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#F8F5FC] text-[#5B2C8A] border border-[#EDE4F5] flex items-center justify-center mb-4">
            <Scale className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F2E] tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm sm:text-base text-[#4A4A5A] mt-2 leading-relaxed">
            Please read these Terms and Conditions (&quot;Terms&quot;, &quot;Agreement&quot;) carefully before utilizing the web catalog, purchasing templates, or accessing managed deployment nodes operated by <strong>BongoWeb Digital Solutions Ltd.</strong> (&quot;BongoWeb&quot;, &quot;we&quot;, &quot;our&quot;).
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">

          {/* Section 1 */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">1</span>
              Acceptance of Terms
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed">
              By browsing BongoWeb, registering an account, or placing an order for a website template, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to all terms, you must not access or use our services.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">2</span>
              Scope of Services
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed mb-3">
              BongoWeb provides ready-to-launch business websites, digital storefronts, digital menus, blogs, and managed cloud deployments. Services include:
            </p>
            <ul className="text-xs sm:text-sm text-[#4A4A5A] space-y-2 list-disc list-inside leading-relaxed">
              <li>Template demonstration and previewzone exploration.</li>
              <li>Custom logo, business brand name, and color theme integration.</li>
              <li>Domain mapping (custom .com or subdomain allocation).</li>
              <li>Local payment gateway and Mobile Financial Services (bKash, Nagad, Rocket) workflow assistance.</li>
              <li>Ongoing technical assistance, server uptime upkeep, and automated daily backups.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">3</span>
              Fees, Payments &amp; Subscriptions
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed mb-3">
              All prices listed on BongoWeb are clear and transparent:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-2">
              <p><strong>Setup Fee:</strong> A one-time setup fee is charged upon order placement to cover initial code assembly, database setup, and DNS linkage.</p>
              <p><strong>Monthly Cloud Maintenance:</strong> Ongoing hosting, server resources, SSL encryption, and software updates are billed monthly.</p>
              <p><strong>Payment Methods:</strong> We accept official bKash, Nagad, Rocket, credit/debit cards, and bank transfers with instant digital receipts.</p>
              <p><strong>Late Payments:</strong> If monthly cloud maintenance is past due by more than 14 days, the website node may be temporarily parked until renewal.</p>
            </div>
          </div>

          {/* Section 4: Refund Policy Reference */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">4</span>
              Refund &amp; Cancellation Policy
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed mb-3">
              We stand behind our craftsmanship with a <strong>7-Day Money-Back Guarantee</strong> for uncompleted or non-matching deployments. For complete conditions, please review our official{' '}
              {onNavigateToRefund ? (
                <button
                  type="button"
                  onClick={onNavigateToRefund}
                  className="underline text-[#5B2C8A] font-bold cursor-pointer"
                >
                  Refund Policy
                </button>
              ) : (
                <a href="/refund" className="underline text-[#5B2C8A] font-bold">Refund Policy</a>
              )}
              .
            </p>
          </div>

          {/* Section 5: User Conduct & Intellectual Property */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">5</span>
              Prohibited Uses &amp; Content Guidelines
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed mb-3">
              You agree not to use our websites or services for:
            </p>
            <ul className="text-xs sm:text-sm text-[#4A4A5A] space-y-2 list-disc list-inside leading-relaxed">
              <li>Any fraudulent, misleading, or deceptive business practices.</li>
              <li>Unauthorized distribution of copyright-infringing materials, counterfeit goods, or illegal substances.</li>
              <li>Operating unlicensed gambling, pyramid schemes, or phishing websites.</li>
              <li>Introducing viruses, malicious code, or DDoS tools onto the hosting infrastructure.</li>
            </ul>
            <p className="text-xs text-rose-600 font-semibold mt-3">
              Violation of these guidelines results in immediate termination of hosting without refund and legal referral.
            </p>
          </div>

          {/* Section 6: Limitation of Liability */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">6</span>
              Limitation of Liability
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed">
              To the fullest extent permitted by applicable law, BongoWeb and its directors, employees, or contractors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill arising out of your use or inability to use the services. Our maximum aggregate liability shall not exceed the total fees paid by you to BongoWeb in the preceding three (3) months.
            </p>
          </div>

          {/* Section 7: Governing Law */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">7</span>
              Governing Law &amp; Jurisdiction
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed">
              These Terms shall be governed by and construed in accordance with the substantive laws of Bangladesh and applicable international digital commerce treaties. Any legal disputes shall be subject to the exclusive jurisdiction of the competent courts located in Dhaka, Bangladesh.
            </p>
          </div>

          {/* Section 8: Contact */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-2">Legal Notices &amp; Contact</h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed">
              For any questions regarding these Terms, contact our legal counsel at{' '}
              <a href="mailto:legal@bongoweb.xyz" className="text-[#5B2C8A] font-bold underline">legal@bongoweb.xyz</a> or by mail at Block B, Banani, Dhaka 1213, Bangladesh.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
