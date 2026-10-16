import React, { useEffect } from 'react';
import { Cookie, ArrowLeft, Check, SlidersHorizontal, ShieldAlert, Info } from 'lucide-react';
import { updatePageSEO } from '../../utils/seo';

interface CookiePolicyViewProps {
  onBack: () => void;
  onNavigateToPrivacy?: () => void;
}

export default function CookiePolicyView({
  onBack,
  onNavigateToPrivacy
}: CookiePolicyViewProps) {
  useEffect(() => {
    updatePageSEO({
      title: 'Cookie Policy & Local Storage Usage',
      description: 'Learn how BongoWeb uses strictly necessary cookies and transparent local storage to deliver fast, secure website setups.',
      canonicalPath: '/cookies'
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const openPreferences = () => {
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

          <button
            type="button"
            onClick={openPreferences}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5B2C8A] hover:bg-[#4A1F6E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Manage Preferences</span>
          </button>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-[#EDE4F5] shadow-xs p-6 sm:p-10 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#F8F5FC] text-[#5B2C8A] border border-[#EDE4F5] flex items-center justify-center mb-4">
            <Cookie className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F2E] tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-sm sm:text-base text-[#4A4A5A] mt-2 leading-relaxed">
            This Cookie Policy explains how <strong>BongoWeb</strong> uses cookies, browser local storage, and similar technologies when you visit our website catalog and client dashboards.
          </p>

          <div className="mt-4 p-4 rounded-2xl bg-[#F8F5FC] border border-[#EDE4F5] text-xs text-[#5B2C8A] flex items-center gap-2 font-medium">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              <strong>Zero Cross-Site Ad Tracking:</strong> We never employ invasive advertising trackers or cross-site tracking beacons that monitor your activity outside BongoWeb.
            </span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">

          {/* Section 1 */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">1</span>
              What Are Cookies &amp; Local Storage?
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed">
              Cookies and HTML5 Local Storage are compact text entries preserved in your web browser. They enable web applications to remember your session (such as keeping you logged in, maintaining your cart or template choice across pages, and remembering your chosen display language).
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">2</span>
              Categories of Cookies We Use
            </h2>
            
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    A. Strictly Necessary Cookies (Always Active)
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Required
                  </span>
                </div>
                <p className="text-[#4A4A5A] leading-relaxed text-xs">
                  These cookies and local storage tokens are essential for you to navigate the site and utilize secure features such as the ordering checkout flow, user authentication, and CSRF protection. Without these, our website cannot function properly.
                </p>
                <div className="mt-2 text-[11px] font-mono text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                  Examples: <code>bongoweb_user</code>, <code>bongoweb_cookie_consent</code>, <code>bongoweb_order_state_*</code>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-bold text-slate-900">
                    B. Functional &amp; Preference Cookies (Customizable)
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-[#5B2C8A] bg-purple-100 px-2 py-0.5 rounded-full">
                    Optional
                  </span>
                </div>
                <p className="text-[#4A4A5A] leading-relaxed text-xs">
                  These allow the platform to remember choices you make (such as whether you prefer English or Bengali, your selected category filter, and your return path after browsing live demos).
                </p>
                <div className="mt-2 text-[11px] font-mono text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                  Examples: <code>bongoweb_chosen_category</code>, <code>bongoweb_lang</code>, <code>bongoweb_return_path</code>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-bold text-slate-900">
                    C. Diagnostics &amp; Anonymous Performance (Opt-In Only)
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                    Opt-in
                  </span>
                </div>
                <p className="text-[#4A4A5A] leading-relaxed text-xs">
                  These collect aggregated, non-personally identifiable diagnostic information to detect client-side JavaScript crashes or broken links, helping us improve platform speed and usability.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#F8F5FC] text-[#5B2C8A] text-xs font-bold flex items-center justify-center">3</span>
              How Can You Control Your Cookies?
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed mb-4">
              You can exercise your choices anytime:
            </p>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#F8F5FC] text-[#5B2C8A] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  1
                </div>
                <p className="text-[#4A4A5A]">
                  <strong>Via Our Preference Center:</strong> Click{' '}
                  <button
                    type="button"
                    onClick={openPreferences}
                    className="text-[#5B2C8A] font-bold underline cursor-pointer"
                  >
                    Manage Cookie Preferences
                  </button>{' '}
                  to turn optional cookies on or off with immediate effect.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#F8F5FC] text-[#5B2C8A] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  2
                </div>
                <p className="text-[#4A4A5A]">
                  <strong>Via Your Web Browser:</strong> You can configure Chrome, Safari, Edge, or Firefox to block or delete cookies in your browser&apos;s privacy settings. Note that disabling strictly necessary cookies may prevent checkout and login from functioning.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl border border-[#EDE4F5] p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-[#1F1F2E] mb-2">Questions Regarding Cookies?</h2>
            <p className="text-xs sm:text-sm text-[#4A4A5A] leading-relaxed">
              If you have any questions about how cookies are deployed, reach our Data Protection team at{' '}
              <a href="mailto:privacy@bongoweb.xyz" className="text-[#5B2C8A] font-bold underline">privacy@bongoweb.xyz</a>.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
