import React, { useEffect } from 'react';
import { Shield, ArrowLeft, Mail, Phone, Lock, FileCheck, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';
import { updatePageSEO } from '../../utils/seo';

interface PrivacyPolicyViewProps {
  onBack: () => void;
  onNavigateToTerms?: () => void;
  onNavigateToCookies?: () => void;
}

export default function PrivacyPolicyView({
  onBack,
  onNavigateToTerms,
  onNavigateToCookies
}: PrivacyPolicyViewProps) {
  useEffect(() => {
    updatePageSEO({
      title: 'Privacy Policy & DPDP Act Compliance',
      description: 'Official Privacy Policy of BongoWeb complying with India Digital Personal Data Protection Act, 2023 (DPDP Act) and global privacy standards. Transparent data processing and grievance officer details.',
      canonicalPath: '/privacy'
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const openCookiePreferences = () => {
    window.dispatchEvent(new CustomEvent('bongoweb_open_cookie_preferences'));
  };

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
            Last Updated: January 2025
          </span>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-[#EDE4F5] shadow-xs p-6 sm:p-10 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#F8F5FC] text-[#5B2C8A] border border-[#EDE4F5] flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F2E] tracking-tight">
            Privacy Policy &amp; Data Protection Notice
          </h1>
          <p className="text-sm sm:text-base text-[#4A4A5A] mt-2 leading-relaxed">
            BongoWeb (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is dedicated to safeguarding your personal data with absolute transparency. This Privacy Policy outlines our data handling practices in compliance with India&apos;s <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, GDPR, and international data privacy benchmarks.
          </p>

          <div className="mt-4 p-4 rounded-2xl bg-[#F8F5FC] border border-[#EDE4F5] text-xs text-[#5B2C8A] flex items-center gap-2 font-medium">
            <FileCheck className="w-4 h-4 shrink-0 text-[#10B981]" />
            <span>
              <strong>Data Minimization Commitment:</strong> We strictly collect only necessary information required to construct, host, and deliver your website. We never sell, rent, or trade your data.
            </span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">

          {/* Section 1 */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">1</span>
              Identity of Data Fiduciary
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed mb-3">
              Under Section 2(i) of the DPDP Act, the <strong>Data Fiduciary</strong> determining the purpose and means of processing personal data is:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-1.5 font-sans">
              <p><strong>Entity Name:</strong> BongoWeb Digital Solutions Ltd.</p>
              <p><strong>Operational Address:</strong> Block B, Banani, Dhaka 1213, Bangladesh</p>
              <p><strong>Official Inquiries:</strong> <a href="mailto:support@bongoweb.xyz" className="text-[#5B2C8A] underline">support@bongoweb.xyz</a></p>
              <p><strong>Hotline:</strong> <a href="tel:+8801819847250" className="text-[#5B2C8A] underline">+880 1819-847250</a></p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">2</span>
              What Personal Data We Collect &amp; Why
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed mb-3">
              We uphold strict <em>purpose limitation</em>. We only collect the minimal personal information essential for configuring your chosen website and customer support:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Data Point</th>
                    <th className="p-3">Primary Purpose</th>
                    <th className="p-3">Legal Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Full Name</td>
                    <td className="p-3">Order invoice creation, website ownership registration</td>
                    <td className="p-3">Contract Performance</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Phone Number</td>
                    <td className="p-3">SMS/WhatsApp delivery updates, technical handover calls, support verification</td>
                    <td className="p-3">Consent &amp; Contract</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Email Address</td>
                    <td className="p-3">Admin credential dispatch, billing invoices, account recovery</td>
                    <td className="p-3">Consent &amp; Contract</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Business / Domain Name</td>
                    <td className="p-3">DNS configuration, website brand customization</td>
                    <td className="p-3">Service Delivery</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Transaction ID (MFS/Bank)</td>
                    <td className="p-3">Payment reconciliation and anti-fraud verification</td>
                    <td className="p-3">Legitimate Interest</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">3</span>
              Notice &amp; Consent Mechanism (Section 6, DPDP Act)
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed mb-3">
              Whenever you place an order or contact customer care, you are presented with an itemized notice specifying what data is requested and for what exact purpose.
            </p>
            <ul className="text-xs sm:text-sm text-[#4A4A5A] space-y-2 list-disc list-inside leading-relaxed">
              <li><strong>Free and Informed Consent:</strong> You give explicit consent through affirmative action (e.g., ticking the consent checkbox before submission).</li>
              <li><strong>Right to Withdraw Consent:</strong> Under Section 6(4), you may withdraw your consent at any time as easily as it was given. To withdraw consent, email <a href="mailto:privacy@bongoweb.xyz" className="text-[#5B2C8A] underline">privacy@bongoweb.xyz</a> or use your account settings.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">4</span>
              Rights of the Data Principal (Your Rights)
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed mb-3">
              Under Chapter III of the DPDP Act and GDPR, you have the following irrevocable rights:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">1. Right to Access Information</p>
                <p className="text-slate-600">Obtain a summary of personal data being processed and the identities of any data processors involved.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">2. Right to Correction &amp; Erasure</p>
                <p className="text-slate-600">Correct inaccurate data, complete incomplete details, or request full erasure of your personal data when no longer needed.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">3. Right of Grievance Redressal</p>
                <p className="text-slate-600">Have your concerns addressed promptly by our designated Grievance Officer within 30 days.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">4. Right to Nominate</p>
                <p className="text-slate-600">Nominate an individual to exercise your privacy rights in case of death or incapacity.</p>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">5</span>
              Protection of Children&apos;s Personal Data
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed">
              In accordance with Section 9 of the DPDP Act, BongoWeb does not offer commercial services directly to children (individuals under 18 years of age) and does not knowingly process children&apos;s personal data. We do not engage in behavioral tracking or targeted advertising directed at minors.
            </p>
          </div>

          {/* Section 6: Grievance Officer */}
          <div className="bg-white rounded-2xl border-2 border-[#5B2C8A]/20 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-2 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#5B2C8A]" />
              Designated Grievance Redressal Officer
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed mb-4">
              If you have any questions, concerns, or wish to exercise your rights under the DPDP Act, please contact our appointed Grievance Officer:
            </p>

            <div className="p-4 rounded-xl bg-[#F8F5FC] border border-[#EDE4F5] text-xs text-[#1F1F2E] space-y-2">
              <p><strong>Officer Name:</strong> Data Protection &amp; Grievance Officer</p>
              <p><strong>Department:</strong> Legal &amp; Compliance Wing, BongoWeb Digital Solutions Ltd.</p>
              <p><strong>Email:</strong> <a href="mailto:privacy@bongoweb.xyz" className="text-[#5B2C8A] font-bold underline">privacy@bongoweb.xyz</a></p>
              <p><strong>Escalation Email:</strong> <a href="mailto:legal@bongoweb.xyz" className="text-[#5B2C8A] font-bold underline">legal@bongoweb.xyz</a></p>
              <p><strong>Mailing Address:</strong> Plot 14, Road 11, Banani, Dhaka 1213, Bangladesh</p>
              <p><strong>Response Turnaround:</strong> Within 30 days of receiving your complaint, as prescribed by law.</p>
            </div>
          </div>

          {/* Section 7: Cookie settings link */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#1F1F2E]">Need to modify your cookie preferences?</h3>
              <p className="text-xs text-[#6B7280] mt-0.5">You can update functional and analytical cookie preferences at any time.</p>
            </div>
            <button
              type="button"
              onClick={openCookiePreferences}
              className="px-4 py-2.5 rounded-xl bg-[#5B2C8A] hover:bg-[#4A1F6E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
            >
              Update Cookie Preferences
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
