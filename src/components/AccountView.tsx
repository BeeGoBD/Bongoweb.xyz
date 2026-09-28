import React, { useState } from 'react';
import { 
  User, ShieldCheck, Key, Globe, Bell, FileText, 
  HelpCircle, CheckCircle2, Lock, ArrowRight, X, ExternalLink, 
  PhoneCall, MessageCircle, AlertCircle, Sparkles
} from 'lucide-react';

export default function AccountView() {
  const [activeModal, setActiveModal] = useState<'password' | 'privacy' | 'terms' | 'refund' | null>(null);
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passwordChangedSuccess, setPasswordChangedSuccess] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass !== confirmPass) return;
    setPasswordChangedSuccess(true);
    setTimeout(() => {
      setPasswordChangedSuccess(false);
      setActiveModal(null);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col font-sans pb-28 pt-4">
      {/* Profile Header Card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-6">
        <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(13,37,61,0.03)] flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-[#533AFD] text-[#FFFFFF] flex items-center justify-center font-black text-2xl shadow-[0_8px_20px_rgba(83,58,253,0.3)]">
                BW
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#00B261] border-2 border-[#FFFFFF] flex items-center justify-center text-[10px] text-[#FFFFFF]">
                ✓
              </span>
            </div>

            {/* Client Credentials */}
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-[#0D253D]">
                  Client Portal
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E2E4FF] text-[#533AFD] text-[11px] font-bold border border-[#533AFD]/20">
                  Verified Client
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#273951]">
                beegovoltx@gmail.com
              </p>
              <p className="text-[11px] text-[#64748D] mt-0.5 font-mono">
                Account ID: #BW-984210 • Stripe-Standard Tier
              </p>
            </div>
          </div>

          {/* Quick Action */}
          <div className="flex sm:flex-col items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F8FAFD] text-[#00B261] border border-[#E5EDF5]">
              <span className="w-2 h-2 rounded-full bg-[#00B261] animate-pulse"></span>
              24/7 Priority Active
            </span>
          </div>
        </div>
      </section>

      {/* Account Overview Cards */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] text-center">
            <span className="text-2xl font-black text-[#533AFD]">1</span>
            <p className="text-xs font-semibold text-[#0D253D] mt-1">Active Order</p>
            <span className="text-[10px] text-[#64748D]">In progress</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] text-center">
            <span className="text-2xl font-black text-[#0D253D]">4</span>
            <p className="text-xs font-semibold text-[#0D253D] mt-1">Saved Designs</p>
            <span className="text-[10px] text-[#64748D]">In shortlist</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] text-center">
            <span className="text-2xl font-black text-[#00B261]">100%</span>
            <p className="text-xs font-semibold text-[#0D253D] mt-1">Delivery Rate</p>
            <span className="text-[10px] text-[#64748D]">Guaranteed</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] text-center">
            <span className="text-2xl font-black text-[#FF6118]">24h</span>
            <p className="text-xs font-semibold text-[#0D253D] mt-1">Turnaround</p>
            <span className="text-[10px] text-[#64748D]">Fast launch</span>
          </div>
        </div>
      </section>

      {/* Settings & Controls */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-4">
        {/* Security & Password */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5EDF5] p-5 shadow-2xs">
          <h2 className="text-sm font-bold text-[#0D253D] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#533AFD]" />
            <span>Security & Authentication</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 border-b border-[#E5EDF5] last:border-b-0">
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#0D253D]">Password & Security Credentials</p>
              <p className="text-xs text-[#64748D]">Update your account password or generate a secure passkey</p>
            </div>
            <button
              onClick={() => setActiveModal('password')}
              className="px-4 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] hover:border-[#533AFD]/40 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5EDF5] p-5 shadow-2xs">
          <h2 className="text-sm font-bold text-[#0D253D] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#533AFD]" />
            <span>Preferences & Notifications</span>
          </h2>

          {/* Language Toggle */}
          <div className="flex items-center justify-between py-3 border-b border-[#E5EDF5]">
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#0D253D]">Display Language</p>
              <p className="text-xs text-[#64748D]">Choose preferred interface language</p>
            </div>
            <div className="flex items-center bg-[#F8FAFD] p-1 rounded-xl border border-[#E5EDF5]">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#533AFD] text-[#FFFFFF] shadow-xs'
                    : 'text-[#64748D] hover:text-[#0D253D]'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'bn'
                    ? 'bg-[#533AFD] text-[#FFFFFF] shadow-xs'
                    : 'text-[#64748D] hover:text-[#0D253D]'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>

          {/* WhatsApp / SMS Alerts */}
          <div className="flex items-center justify-between py-3 border-b border-[#E5EDF5]">
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#0D253D]">WhatsApp Order Status Updates</p>
              <p className="text-xs text-[#64748D]">Receive automated delivery progress alerts via WhatsApp</p>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              className="w-5 h-5 accent-[#533AFD] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#0D253D]">SMS Delivery Alerts</p>
              <p className="text-xs text-[#64748D]">Direct SMS when domain and super-admin credentials are live</p>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={() => setSmsAlerts(!smsAlerts)}
              className="w-5 h-5 accent-[#533AFD] cursor-pointer"
            />
          </div>
        </div>

        {/* Legal & Policies */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5EDF5] p-5 shadow-2xs">
          <h2 className="text-sm font-bold text-[#0D253D] uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#533AFD]" />
            <span>Terms, Policies & Guarantee</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setActiveModal('privacy')}
              className="p-3.5 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] border border-[#E5EDF5] hover:border-[#533AFD]/40 text-left transition-all cursor-pointer"
            >
              <p className="text-xs font-bold text-[#0D253D] flex items-center justify-between">
                <span>Privacy Policy</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#533AFD]" />
              </p>
              <p className="text-[11px] text-[#64748D] mt-1">Data privacy & SSL encryption</p>
            </button>

            <button
              onClick={() => setActiveModal('terms')}
              className="p-3.5 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] border border-[#E5EDF5] hover:border-[#533AFD]/40 text-left transition-all cursor-pointer"
            >
              <p className="text-xs font-bold text-[#0D253D] flex items-center justify-between">
                <span>Terms of Service</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#533AFD]" />
              </p>
              <p className="text-[11px] text-[#64748D] mt-1">24h delivery & domain terms</p>
            </button>

            <button
              onClick={() => setActiveModal('refund')}
              className="p-3.5 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] border border-[#E5EDF5] hover:border-[#533AFD]/40 text-left transition-all cursor-pointer"
            >
              <p className="text-xs font-bold text-[#0D253D] flex items-center justify-between">
                <span>Refund Policy</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#533AFD]" />
              </p>
              <p className="text-[11px] text-[#64748D] mt-1">100% money-back guarantee</p>
            </button>
          </div>
        </div>

        {/* VIP Engineer Desk Direct Contact */}
        <div className="p-5 rounded-2xl bg-[#E2E4FF]/50 border border-[#533AFD]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#533AFD] text-[#FFFFFF] flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-[#0D253D]">
                Dedicated Lead Engineer Contact
              </h4>
              <p className="text-xs text-[#64748D]">
                Direct line for enterprise requirements, custom plugins, or urgent modifications.
              </p>
            </div>
          </div>
          <a
            href="tel:+8801700000000"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] text-[#FFFFFF] text-xs font-bold transition-all text-center"
          >
            Call Support Desk
          </a>
        </div>
      </section>

      {/* Modal Dialogs */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D253D]/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FFFFFF] rounded-3xl max-w-lg w-full p-6 border border-[#E5EDF5] shadow-2xl animate-slideUpModal relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#64748D] hover:text-[#0D253D] hover:bg-[#F8FAFD]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Password Modal */}
            {activeModal === 'password' && (
              <div>
                <h3 className="text-lg font-black text-[#0D253D] mb-2 flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#533AFD]" />
                  <span>Change Password</span>
                </h3>
                <p className="text-xs text-[#64748D] mb-5">
                  Update your account password to protect access to your live websites and client dashboard.
                </p>

                {passwordChangedSuccess ? (
                  <div className="p-4 rounded-xl bg-[#00B261]/10 border border-[#00B261]/20 text-[#00B261] text-xs font-bold text-center">
                    ✓ Password updated successfully!
                  </div>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0D253D] mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-3 py-2 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] focus:outline-none focus:border-[#533AFD]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0D253D] mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="w-full px-3 py-2 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] focus:outline-none focus:border-[#533AFD]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0D253D] mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="Re-type new password"
                        className="w-full px-3 py-2 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] focus:outline-none focus:border-[#533AFD]"
                      />
                    </div>
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] active:bg-[#4032C8] text-[#FFFFFF] text-xs font-bold transition-all"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Privacy Policy */}
            {activeModal === 'privacy' && (
              <div>
                <h3 className="text-lg font-black text-[#0D253D] mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#533AFD]" />
                  <span>Privacy Policy</span>
                </h3>
                <div className="text-xs text-[#273951] space-y-3 leading-relaxed mt-4">
                  <p>
                    <strong>1. Information We Collect:</strong> BongoWeb collects necessary customer contact details (name, email, phone number, and domain choice) solely for configuring your custom website and customer support.
                  </p>
                  <p>
                    <strong>2. Data Encryption:</strong> All transactions and website credentials are encrypted via end-to-end 256-bit TLS/SSL encryption. We never store credit card or banking PIN credentials.
                  </p>
                  <p>
                    <strong>3. Ownership Rights:</strong> You own 100% of your domain, database content, customer orders, and branding. BongoWeb never sells or rents your private business data to third parties.
                  </p>
                </div>
              </div>
            )}

            {/* Terms of Service */}
            {activeModal === 'terms' && (
              <div>
                <h3 className="text-lg font-black text-[#0D253D] mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#533AFD]" />
                  <span>Terms of Service</span>
                </h3>
                <div className="text-xs text-[#273951] space-y-3 leading-relaxed mt-4">
                  <p>
                    <strong>1. 24-Hour Express Delivery:</strong> Delivery timeline initiates once your company logo, domain preference, and required product materials are submitted to our project manager.
                  </p>
                  <p>
                    <strong>2. Domain & Hosting Provision:</strong> Free custom .com domain and high-speed NVMe cloud hosting are provided for 1 full year with automatic renewal options at standard renewal rates.
                  </p>
                  <p>
                    <strong>3. Super-Admin Handover:</strong> Full administrative control and video tutorials are provided upon launch, enabling you to add products and manage sales independently.
                  </p>
                </div>
              </div>
            )}

            {/* Refund Policy */}
            {activeModal === 'refund' && (
              <div>
                <h3 className="text-lg font-black text-[#0D253D] mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#00B261]" />
                  <span>Refund & Money-Back Policy</span>
                </h3>
                <div className="text-xs text-[#273951] space-y-3 leading-relaxed mt-4">
                  <p>
                    <strong>1. 100% Satisfaction Guarantee:</strong> If our engineering team is unable to fulfill the agreed specifications of your chosen package within the promised timeline, you are entitled to a full 100% refund.
                  </p>
                  <p>
                    <strong>2. Transparent Revisions:</strong> Unlimited revisions on staging previews ensure that your website matches your exact expectations before public deployment.
                  </p>
                  <p>
                    <strong>3. Hassle-Free Processing:</strong> Approved refunds are credited directly back to your original payment method (bKash/Nagad/Bank) within 3 business days.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
