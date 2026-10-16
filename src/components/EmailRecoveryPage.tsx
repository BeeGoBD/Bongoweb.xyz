import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Mail, Phone, ShoppingBag, HelpCircle, AlertCircle, 
  CheckCircle2, Clock, ShieldAlert, FileText, ChevronDown, 
  Send, RefreshCw, X, Sparkles, AlertTriangle
} from 'lucide-react';
import { EmailRecoveryRequest } from '../types';
import { apiCreateEmailRecovery, apiGetEmailRecoveries } from '../utils/api';

interface EmailRecoveryPageProps {
  onBack: () => void;
}

export default function EmailRecoveryPage({ onBack }: EmailRecoveryPageProps) {
  // Existing submitted request for this browser
  const [activeRequest, setActiveRequest] = useState<EmailRecoveryRequest | null>(null);
  const [loadingActive, setLoadingActive] = useState(true);

  // Form states
  // Option 1: Gmail Issue
  const [gmailIssue, setGmailIssue] = useState<'forgot' | 'disabled' | 'no_access' | 'others' | ''>('');
  const [gmailDropdownOpen, setGmailDropdownOpen] = useState(false);
  const [customReason, setCustomReason] = useState('');
  const [isWritingOtherPage, setIsWritingOtherPage] = useState(false);

  // Option 2: Did you purchase anything before?
  const [purchasedBefore, setPurchasedBefore] = useState<boolean | null>(null);

  // Option 3: What was your mobile number? Do you remember it?
  const [rememberPhone, setRememberPhone] = useState<boolean | null>(null);
  const [isProvidingPhonePage, setIsProvidingPhonePage] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Check if user already submitted a request from this browser
  useEffect(() => {
    const checkActiveRequest = async () => {
      setLoadingActive(true);
      try {
        const stored = localStorage.getItem('bongoweb_email_recovery_request');
        if (stored) {
          const parsed: EmailRecoveryRequest = JSON.parse(stored);
          setActiveRequest(parsed);

          // Sync fresh status from API in case admin approved/changed or deleted it
          try {
            const all = await apiGetEmailRecoveries();
            const fresh = all.find((r) => r.id === parsed.id);
            if (fresh) {
              setActiveRequest(fresh);
              localStorage.setItem('bongoweb_email_recovery_request', JSON.stringify(fresh));
            } else if (all.length > 0) {
              // Admin deleted the request (e.g. client missed the call) - allow re-applying
              setActiveRequest(null);
              localStorage.removeItem('bongoweb_email_recovery_request');
            }
          } catch (_) {}
        }
      } catch (_) {}
      setLoadingActive(false);
    };

    checkActiveRequest();
  }, []);

  // Labels for Gmail issues
  const gmailIssueOptions: { id: 'forgot' | 'disabled' | 'no_access' | 'others'; titleBn: string; titleEn: string; desc: string; icon: string }[] = [
    {
      id: 'forgot',
      titleBn: 'আমি আমার জিমেইল ভুলে গেছি',
      titleEn: 'I forgot my Gmail',
      desc: 'আপনার পূর্বের জিমেইল অ্যাড্রেসটি মনে নেই',
      icon: '❓'
    },
    {
      id: 'disabled',
      titleBn: 'আমার জিমেইল নিষ্ক্রিয় / ডিজেবল করা হয়েছে',
      titleEn: 'My Gmail was disabled',
      desc: 'গুগল বা আপনার প্রতিষ্ঠান থেকে জিমেইলটি বন্ধ হয়ে গেছে',
      icon: '🚫'
    },
    {
      id: 'no_access',
      titleBn: 'আমার জিমেইলে আমার কোনো অ্যাক্সেস নেই',
      titleEn: "I don't have access to my Gmail",
      desc: 'পাসওয়ার্ড বা টু-ফ্যাক্টর ভেরিফিকেশন না থাকায় লগইন করা সম্ভব নয়',
      icon: '🔒'
    },
    {
      id: 'others',
      titleBn: 'অন্যান্য কারণ (Others)',
      titleEn: 'Others (Write custom reason)',
      desc: 'অন্য কোনো জটিলতা থাকলে ক্লিক করে বিস্তারিত লিখুন',
      icon: '✍️'
    }
  ];

  const handleSelectGmailIssue = (optionId: 'forgot' | 'disabled' | 'no_access' | 'others') => {
    setGmailIssue(optionId);
    setGmailDropdownOpen(false);
    if (optionId === 'others') {
      setIsWritingOtherPage(true);
    } else {
      setIsWritingOtherPage(false);
    }
  };

  const handleSelectRememberPhone = (val: boolean) => {
    setRememberPhone(val);
    // Open sub-page / input view to provide their phone number
    setIsProvidingPhonePage(true);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!gmailIssue) {
      setErrorMsg('অনুগ্রহ করে প্রথম অপশন থেকে জিমেইল সংক্রান্ত সমস্যাটি বেছে নিন।');
      return;
    }
    if (gmailIssue === 'others' && !customReason.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার সমস্যাটির বিবরণ লিখুন।');
      return;
    }
    if (purchasedBefore === null) {
      setErrorMsg('অনুগ্রহ করে দ্বিতীয় অপশন (পূর্বে ক্রয় করেছিলেন কিনা) নির্বাচন করুন।');
      return;
    }
    if (rememberPhone === null) {
      setErrorMsg('অনুগ্রহ করে তৃতীয় অপশন (মোবাইল নম্বর মনে আছে কিনা) নির্বাচন করুন।');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 9) {
      setErrorMsg('অনুগ্রহ করে আপনার সঠিক মোবাইল নম্বরটি প্রদান করুন (ন্যূনতম ১০ বা ১১ সংখ্যা)।');
      return;
    }

    setSubmitting(true);
    try {
      const selectedOption = gmailIssueOptions.find((o) => o.id === gmailIssue);
      const label = selectedOption ? `${selectedOption.titleEn} (${selectedOption.titleBn})` : gmailIssue;

      const created = await apiCreateEmailRecovery({
        gmailIssue,
        gmailIssueLabel: label,
        customReason: gmailIssue === 'others' ? customReason.trim() : undefined,
        purchasedBefore: Boolean(purchasedBefore),
        rememberPhone: Boolean(rememberPhone),
        phoneNumber: phoneNumber.trim()
      });

      setActiveRequest(created);
    } catch (_) {
      setErrorMsg('রিকোয়েস্ট পাঠাতে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingActive) {
    return (
      <div className="w-full min-h-[calc(100vh-120px)] flex items-center justify-center bg-[#09090b] text-[#f5f5f7]">
        <div className="flex items-center gap-2 text-[#3b5bff] font-medium text-sm">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  // ========================================================
  // VIEW 1: PERSISTENT BANNER & DETAILS VIEW (If already requested)
  // ========================================================
  if (activeRequest) {
    const isPending = activeRequest.status === 'pending';
    const isCompleted = activeRequest.status === 'completed';

    return (
      <div className="w-full min-h-[calc(100vh-120px)] flex flex-col items-center justify-start py-6 sm:py-10 px-4 bg-[#09090b] text-[#f5f5f7] font-sans animate-fadeIn select-none">
        <div className="max-w-xl w-full space-y-5">
          {/* Back button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#f5f5f7] border border-white/[0.08] text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← লগইন পৃষ্ঠায় ফিরে যান</span>
            </button>

            <span className="text-[11px] font-mono text-[#a1a1b0] font-medium bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
              আইডি: {activeRequest.id}
            </span>
          </div>

          {/* MAIN PERMANENT BANNER CONTAINER */}
          <div className="bg-[#0e0e12] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-dark-card space-y-6">
            
            {/* Status Header Badge */}
            <div className="text-center space-y-2">
              {isPending ? (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium animate-pulse">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>পর্যালোচনাধীন রয়েছে (Under Review)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>অনুমোদিত ও সম্পন্ন (Approved by Support)</span>
                </div>
              )}

              <h1 className="text-xl sm:text-2xl font-semibold text-[#f5f5f7] tracking-tight">
                {isPending 
                  ? 'আপনার ইমেইল রিকোয়েস্ট জমা হয়েছে' 
                  : 'রিকোয়েস্ট সিদ্ধান্ত সম্পন্ন হয়েছে'}
              </h1>
              <p className="text-xs text-[#a1a1b0]">
                রিকোয়েস্ট দাখিলের তারিখ ও সময়: {activeRequest.createdAt}
              </p>
            </div>

            {/* MANDATORY NOTICE PARAGRAPHS IN BANGLA & ENGLISH */}
            <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-4 shadow-xs">
              {/* Bangla Notice */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-medium text-[#3b5bff]">
                  <Phone className="w-4 h-4 text-[#3b5bff]" />
                  <span>গুরুত্বপূর্ণ নির্দেশনা (বাংলা):</span>
                </div>
                <p className="text-xs sm:text-sm text-[#f5f5f7] leading-relaxed font-normal bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
                  আমাদের ডেডিকেটেড সাপোর্ট টিম আগামী <strong className="text-[#3b5bff]">১ থেকে ৪৮ ঘণ্টার মধ্যে</strong> সরাসরি আপনার দেওয়া মোবাইল নম্বরে কল করবে এবং আপনার অ্যাকাউন্টটি যাচাই করে পুনরুদ্ধার সম্পন্ন করবে। অনুগ্রহ করে আমাদের কলটি রিসিভ করার জন্য প্রস্তুত থাকুন। <strong className="text-rose-400">আপনি যদি আমাদের সাপোর্ট টিমের কলটি মিস করেন বা কল না ধরেন, তবে আপনার এই রিকোয়েস্টটি সিস্টেম থেকে স্বয়ংক্রিয়ভাবে মুছে ফেলা (বাতিল) হবে</strong> এবং আপনাকে পরবর্তীতে পুনরায় নতুন করে আবেদন করতে হবে।
                </p>
              </div>

              {/* English Notice */}
              <div className="space-y-1.5 pt-1 border-t border-white/[0.06]">
                <div className="flex items-center gap-2 text-xs font-medium text-[#a1a1b0]">
                  <ShieldAlert className="w-4 h-4 text-[#a1a1b0]" />
                  <span>Official Notice (English):</span>
                </div>
                <p className="text-xs text-[#a1a1b0] leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
                  Our dedicated support team will contact you directly via your provided mobile phone number within <strong>1 to 48 hours</strong> to verify and assist you with your account. Please answer the call promptly. <strong>If you miss the call or fail to answer, this request will be automatically deleted from our system</strong> and you will need to submit a new request again.
                </p>
              </div>
            </div>

            {/* SUBMITTED DETAILS CARD */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium uppercase tracking-wider text-[#71717a]">
                আপনার দাখিলকৃত বিবরণ (Submitted Details)
              </h3>
              
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2.5 text-xs text-[#a1a1b0]">
                <div className="flex items-start justify-between py-1 border-b border-white/[0.06]">
                  <span className="font-normal text-[#71717a]">জিমেইল সংক্রান্ত সমস্যা:</span>
                  <span className="font-semibold text-[#f5f5f7] text-right max-w-[240px]">
                    {activeRequest.gmailIssueLabel || activeRequest.gmailIssue}
                  </span>
                </div>

                {activeRequest.customReason && (
                  <div className="py-1 border-b border-white/[0.06]">
                    <span className="font-normal text-[#71717a] block mb-0.5">অন্যান্য কারণের বিবরণ:</span>
                    <span className="text-[#f5f5f7] italic bg-white/[0.02] p-2 rounded-lg border border-white/[0.06] block">
                      "{activeRequest.customReason}"
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between py-1 border-b border-white/[0.06]">
                  <span className="font-normal text-[#71717a]">পূর্বে ক্রয় করেছিলেন কি?</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${
                    activeRequest.purchasedBefore 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-white/[0.04] text-[#a1a1b0] border border-white/[0.08]'
                  }`}>
                    {activeRequest.purchasedBefore ? 'হ্যাঁ (Yes)' : 'না (No)'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/[0.06]">
                  <span className="font-normal text-[#71717a]">মোবাইল নম্বর মনে আছে কি?</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${
                    activeRequest.rememberPhone 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-white/[0.04] text-[#a1a1b0] border border-white/[0.08]'
                  }`}>
                    {activeRequest.rememberPhone ? 'হ্যাঁ (Yes)' : 'না (No)'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="font-normal text-[#71717a]">কল করার জন্য মোবাইল নম্বর:</span>
                  <span className="font-mono font-semibold text-[#3b5bff] text-sm">
                    {activeRequest.phoneNumber}
                  </span>
                </div>

                {activeRequest.decisionNote && (
                  <div className="mt-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    <span className="font-semibold block mb-1">অ্যাডমিন সিদ্ধান্ত:</span>
                    <p className="text-xs">{activeRequest.decisionNote}</p>
                    {activeRequest.decisionAt && (
                      <span className="text-[10px] text-emerald-400 block mt-1">সময়: {activeRequest.decisionAt}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="w-full py-3 px-4 rounded-full bg-[#3b5bff] hover:bg-[#324ecc] text-white font-medium text-xs sm:text-sm shadow-md shadow-[#3b5bff]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>লগইন পেজে ফিরে যান</span>
              </button>

              {isCompleted && (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('bongoweb_email_recovery_request');
                    setActiveRequest(null);
                  }}
                  className="w-full sm:w-auto py-3 px-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#a1a1b0] hover:text-[#f5f5f7] border border-white/[0.08] font-medium text-xs transition-all whitespace-nowrap cursor-pointer"
                >
                  নতুন আবেদন করুন
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // SUB-PAGE: Writing custom reason for "Others" option
  // ========================================================
  if (isWritingOtherPage) {
    return (
      <div className="w-full min-h-[calc(100vh-120px)] flex flex-col items-center justify-start py-6 sm:py-10 px-4 bg-[#09090b] text-[#f5f5f7] font-sans animate-fadeIn select-none">
        <div className="max-w-md w-full space-y-4">
          <button
            type="button"
            onClick={() => setIsWritingOtherPage(false)}
            className="px-3.5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#f5f5f7] border border-white/[0.08] text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← অপশন তালিকায় ফিরে যান</span>
          </button>

          <div className="bg-[#0e0e12] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-dark-card space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] text-[#3b5bff] border border-white/[0.08] flex items-center justify-center mx-auto mb-2">
                <FileText className="w-6 h-6 stroke-[2]" />
              </div>
              <h2 className="text-lg font-semibold text-[#f5f5f7]">
                অন্যান্য কারণ বিস্তারিত লিখুন
              </h2>
              <p className="text-xs text-[#a1a1b0]">
                আপনার জিমেইল সংক্রান্ত সমস্যাটি সংক্ষেপে বুঝিয়ে লিখুন যাতে সাপোর্ট টিম সহায়তা করতে পারে।
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#a1a1b0]">
                আপনার কারণ / সমস্যার বিবরণ:
              </label>
              <textarea
                rows={4}
                required
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="যেমন: আমি জিমেইলের পাসওয়ার্ড ভুলে গেছি এবং রিকভারি নম্বরও সচল নেই..."
                className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs sm:text-sm text-[#f5f5f7] placeholder-[#71717a] focus:outline-none focus:border-[#3b5bff] transition-all resize-none shadow-2xs"
              />
            </div>

            <button
              type="button"
              disabled={!customReason.trim()}
              onClick={() => setIsWritingOtherPage(false)}
              className="w-full py-3 px-4 rounded-full bg-[#3b5bff] hover:bg-[#324ecc] disabled:opacity-50 text-white font-medium text-xs sm:text-sm shadow-md shadow-[#3b5bff]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>সংরক্ষণ করুন ও মূল ফর্মে ফিরুন</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // SUB-PAGE: Providing Previously Used Phone Number (Option 3 = Yes)
  // ========================================================
  if (isProvidingPhonePage && rememberPhone === true) {
    return (
      <div className="w-full min-h-[calc(100vh-120px)] flex flex-col items-center justify-start py-6 sm:py-10 px-4 bg-[#09090b] text-[#f5f5f7] font-sans animate-fadeIn select-none">
        <div className="max-w-md w-full space-y-4">
          <button
            type="button"
            onClick={() => setIsProvidingPhonePage(false)}
            className="px-3.5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#f5f5f7] border border-white/[0.08] text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← অপশন তালিকায় ফিরে যান</span>
          </button>

          <div className="bg-[#0e0e12] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-dark-card space-y-5">
            <div className="text-center space-y-1">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.05] text-[#3b5bff] flex items-center justify-center mx-auto mb-2 border border-white/[0.08] shadow-xs">
                <Phone className="w-7 h-7 stroke-[2]" />
              </div>
              <h2 className="text-xl font-semibold text-[#f5f5f7] tracking-tight">
                পূর্বের ব্যবহৃত মোবাইল নম্বর
              </h2>
              <p className="text-xs text-[#a1a1b0]">
                What was your mobile number? (Remember: Yes)
              </p>
            </div>

            <p className="text-xs text-[#a1a1b0] leading-relaxed bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.08]">
              যেহেতু আপনি জানিয়েছেন যে আপনার পূর্বের ব্যবহৃত মোবাইল নম্বরটি মনে আছে, অনুগ্রহ করে সেই মোবাইল নম্বরটি নিচে লিখুন। আমাদের সাপোর্ট টিম <strong className="text-[#3b5bff]">১ থেকে ৪৮ ঘণ্টার মধ্যে</strong> সরাসরি এই নম্বরে কল করে অ্যাকাউন্ট যাচাই করবে।
            </p>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#f5f5f7]">
                পূর্বে ব্যবহৃত মোবাইল নম্বরটি লিখুন:
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#3b5bff] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  autoFocus
                  required
                  placeholder="যেমন: 017XXXXXXXX বা 019XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-mono font-semibold text-[#f5f5f7] placeholder-[#71717a] focus:outline-none focus:border-[#3b5bff] transition-all shadow-2xs"
                />
              </div>
              <p className="text-[10px] text-[#71717a]">
                * সচল নম্বর দিন যাতে সাপোর্ট টিম সরাসরি আপনার সাথে ফোনে কথা বলতে পারে।
              </p>
            </div>

            {/* Note on 1-48 hours and missing calls */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>গুরুত্বপূর্ণ নির্দেশনা:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#a1a1b0]">
                আমাদের সাপোর্ট টিম ১ থেকে ৪৮ ঘণ্টার মধ্যে কল করবে। কল মিস করলে আপনার রিকোয়েস্টটি মুছে ফেলা হবে এবং পুনরায় নতুন করে আবেদন করতে হবে।
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {/* Primary Submit button directly from this page */}
              <button
                type="button"
                disabled={submitting}
                onClick={(e) => {
                  if (!phoneNumber.trim() || phoneNumber.trim().length < 9) {
                    setErrorMsg('অনুগ্রহ করে সঠিক মোবাইল নম্বরটি লিখুন (ন্যূনতম ১০ বা ১১ সংখ্যা)।');
                    return;
                  }
                  if (!gmailIssue) {
                    setErrorMsg('অনুগ্রহ করে অপশন ১ থেকে জিমেইল সমস্যাটি প্রথমে বেছে নিন।');
                    setIsProvidingPhonePage(false);
                    return;
                  }
                  if (purchasedBefore === null) {
                    setErrorMsg('অনুগ্রহ করে অপশন ২ (পূর্বে ক্রয় করেছিলেন কিনা) নির্বাচন করুন।');
                    setIsProvidingPhonePage(false);
                    return;
                  }
                  handleSubmit(e as any);
                }}
                className="w-full py-3 px-4 rounded-full bg-[#3b5bff] hover:bg-[#324ecc] disabled:opacity-50 text-white font-medium text-xs sm:text-sm shadow-md shadow-[#3b5bff]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>রিকোয়েস্ট দাখিল হচ্ছে...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>রিকোয়েস্ট সাবমিট করুন (Submit)</span>
                    <Send className="w-4 h-4" />
                  </span>
                )}
              </button>

              {/* Secondary button to return to main form with saved number */}
              <button
                type="button"
                onClick={() => setIsProvidingPhonePage(false)}
                className="w-full py-2.5 px-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#a1a1b0] hover:text-[#f5f5f7] border border-white/[0.08] text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>সংরক্ষণ করুন ও মূল ফর্মে ফিরুন</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // VIEW 2: NEW FORM SELECTION (3 Options with selection images/cards)
  // ========================================================
  return (
    <div className="w-full min-h-[calc(100vh-120px)] flex flex-col items-center justify-start py-6 sm:py-10 px-4 bg-[#09090b] text-[#f5f5f7] font-sans animate-fadeIn select-none">
      <div className="max-w-xl w-full space-y-5">
        
        {/* Back Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#f5f5f7] border border-white/[0.08] text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← লগইন পৃষ্ঠায় ফিরে যান</span>
          </button>

          <span className="text-xs font-medium text-[#3b5bff] bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08] flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>ইমেইল রিকভারি সহায়তা</span>
          </span>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-[#0e0e12] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-dark-card space-y-6">
          
          <div className="text-center space-y-1.5">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-[#3b5bff] flex items-center justify-center mx-auto mb-2 shadow-xs">
              <Mail className="w-7 h-7 stroke-[2]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#f5f5f7] tracking-tight">
              I Don't Have My Email (আমার ইমেইল নেই)
            </h1>
            <p className="text-xs text-[#a1a1b0] max-w-sm mx-auto leading-relaxed">
              সঠিক অপশনগুলো নির্বাচন করে রিকোয়েস্ট পাঠালে আমাদের সাপোর্ট টিম ১ থেকে ৪৮ ঘণ্টার মধ্যে আপনার দেওয়া নম্বরে কল করে একাউন্ট ফিরিয়ে দেবে।
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* OPTION 1: GMAIL ISSUE (List opens to choose)              */}
          {/* ======================================================== */}
          <div className="space-y-2.5">
            <label className="block text-xs font-medium text-[#f5f5f7] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#3b5bff] text-white flex items-center justify-center text-[10px] font-bold">১</span>
                <span>জিমেইল সংক্রান্ত সমস্যা (Gmail Issue)</span>
              </span>
              <span className="text-[11px] text-[#3b5bff] font-medium">বাছাই করুন</span>
            </label>

            {/* Click to open list */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setGmailDropdownOpen(!gmailDropdownOpen)}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer shadow-2xs ${
                  gmailIssue 
                    ? 'bg-white/[0.05] border-[#3b5bff]/50 text-[#f5f5f7] font-medium' 
                    : 'bg-white/[0.03] border-white/[0.08] text-[#a1a1b0] font-normal hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#3b5bff]" />
                  <span className="text-xs sm:text-sm">
                    {gmailIssue 
                      ? gmailIssueOptions.find(o => o.id === gmailIssue)?.titleBn 
                      : 'জিমেইল সংক্রান্ত তালিকা খুলুন (Select issue from list)'}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#a1a1b0] transition-transform ${gmailDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* The List of Options */}
              {gmailDropdownOpen && (
                <div className="mt-2 p-2 rounded-2xl bg-[#14141a] border border-white/[0.1] shadow-2xl space-y-1.5 animate-fadeIn">
                  {gmailIssueOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectGmailIssue(opt.id)}
                      className={`w-full p-3 rounded-xl text-left transition-all flex items-start gap-3 cursor-pointer ${
                        gmailIssue === opt.id 
                          ? 'bg-[#3b5bff]/15 border border-[#3b5bff]/40 text-[#f5f5f7]' 
                          : 'hover:bg-white/[0.04] text-[#a1a1b0] hover:text-[#f5f5f7]'
                      }`}
                    >
                      <span className="text-xl mt-0.5">{opt.icon}</span>
                      <div className="flex-1">
                        <div className="text-xs sm:text-sm font-semibold text-[#f5f5f7]">
                          {opt.titleBn}
                        </div>
                        <div className="text-[11px] text-[#3b5bff] font-medium">
                          {opt.titleEn}
                        </div>
                        <div className="text-[10px] text-[#71717a] mt-0.5">
                          {opt.desc}
                        </div>
                      </div>
                      {gmailIssue === opt.id && (
                        <CheckCircle2 className="w-4 h-4 text-[#3b5bff] shrink-0 mt-1" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* If Others is chosen, show quick summary / edit link */}
            {gmailIssue === 'others' && (
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-semibold text-[#f5f5f7]">অন্যান্য কারণ: </span>
                  <span className="text-[#a1a1b0] italic">
                    {customReason ? `"${customReason}"` : 'এখনো বিবরণ লেখা হয়নি'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWritingOtherPage(true)}
                  className="text-xs text-[#3b5bff] font-medium underline hover:text-[#324ecc] cursor-pointer shrink-0 ml-2"
                >
                  {customReason ? 'পরিবর্তন করুন' : 'বিবরণ লিখুন'}
                </button>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* OPTION 2: DID YOU PURCHASE ANYTHING BEFORE? (Yes / No)    */}
          {/* ======================================================== */}
          <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
            <label className="block text-xs font-medium text-[#f5f5f7] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#3b5bff] text-white flex items-center justify-center text-[10px] font-bold">২</span>
              <span>আপনি কি পূর্বে কোনো কিছু ক্রয় করেছেন? (Did you purchase anything before?)</span>
            </label>

            {/* Selection Cards (Images / Visual icons, no typing) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Option: YES */}
              <button
                type="button"
                onClick={() => setPurchasedBefore(true)}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group ${
                  purchasedBefore === true
                    ? 'bg-[#3b5bff]/15 border-[#3b5bff] ring-1 ring-[#3b5bff] shadow-xs'
                    : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                  purchasedBefore === true ? 'bg-[#3b5bff] text-white' : 'bg-white/[0.05] text-[#a1a1b0]'
                }`}>
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-[#f5f5f7]">
                    হ্যাঁ (Yes)
                  </div>
                  <div className="text-[10px] text-[#71717a] mt-0.5">
                    পূর্বে ওয়েবসাইট অর্ডার করেছি
                  </div>
                </div>
                {purchasedBefore === true && (
                  <CheckCircle2 className="w-4 h-4 text-[#3b5bff]" />
                )}
              </button>

              {/* Option: NO */}
              <button
                type="button"
                onClick={() => setPurchasedBefore(false)}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group ${
                  purchasedBefore === false
                    ? 'bg-[#3b5bff]/15 border-[#3b5bff] ring-1 ring-[#3b5bff] shadow-xs'
                    : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                  purchasedBefore === false ? 'bg-[#3b5bff] text-white' : 'bg-white/[0.05] text-[#a1a1b0]'
                }`}>
                  <X className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-[#f5f5f7]">
                    না (No)
                  </div>
                  <div className="text-[10px] text-[#71717a] mt-0.5">
                    নতুন ক্লায়েন্ট / কিছু কিনিনি
                  </div>
                </div>
                {purchasedBefore === false && (
                  <CheckCircle2 className="w-4 h-4 text-[#3b5bff]" />
                )}
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* OPTION 3: WHAT WAS YOUR MOBILE NUMBER? (Remember: Yes/No) */}
          {/* ======================================================== */}
          <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
            <label className="block text-xs font-medium text-[#f5f5f7] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#3b5bff] text-white flex items-center justify-center text-[10px] font-bold">৩</span>
              <span>আপনার মোবাইল নম্বর কি মনে আছে? (Do you remember your mobile number?)</span>
            </label>

            {/* Selection Cards (Yes / No) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Option: YES */}
              <button
                type="button"
                onClick={() => handleSelectRememberPhone(true)}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group ${
                  rememberPhone === true
                    ? 'bg-[#3b5bff]/15 border-[#3b5bff] ring-1 ring-[#3b5bff] shadow-xs'
                    : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                  rememberPhone === true ? 'bg-[#3b5bff] text-white' : 'bg-white/[0.05] text-[#a1a1b0]'
                }`}>
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-[#f5f5f7]">
                    হ্যাঁ (Yes)
                  </div>
                  <div className="text-[10px] text-[#71717a] mt-0.5">
                    পূর্বের নম্বর মনে আছে
                  </div>
                </div>
                {rememberPhone === true && (
                  <CheckCircle2 className="w-4 h-4 text-[#3b5bff]" />
                )}
              </button>

              {/* Option: NO */}
              <button
                type="button"
                onClick={() => handleSelectRememberPhone(false)}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group ${
                  rememberPhone === false
                    ? 'bg-[#3b5bff]/15 border-[#3b5bff] ring-1 ring-[#3b5bff] shadow-xs'
                    : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                  rememberPhone === false ? 'bg-[#3b5bff] text-white' : 'bg-white/[0.05] text-[#a1a1b0]'
                }`}>
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-[#f5f5f7]">
                    না (No)
                  </div>
                  <div className="text-[10px] text-[#71717a] mt-0.5">
                    সঠিক নম্বর মনে নেই
                  </div>
                </div>
                {rememberPhone === false && (
                  <CheckCircle2 className="w-4 h-4 text-[#3b5bff]" />
                )}
              </button>
            </div>

            {/* Option 3 Details (When Yes or No is selected) */}
            {rememberPhone === true && (
              <div className="mt-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-[#f5f5f7]">
                    পূর্বে ব্যবহৃত মোবাইল নম্বর:
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsProvidingPhonePage(true)}
                    className="text-xs text-[#3b5bff] hover:text-[#324ecc] font-medium underline cursor-pointer"
                  >
                    {phoneNumber ? 'নম্বর পরিবর্তন করুন' : 'নম্বর লিখুন (পৃষ্ঠা খুলুন)'}
                  </button>
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#3b5bff] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="যেমন: 017XXXXXXXX বা 019XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs sm:text-sm text-[#f5f5f7] placeholder-[#71717a] focus:outline-none focus:border-[#3b5bff] font-mono font-medium shadow-2xs"
                  />
                </div>
                <p className="text-[11px] text-[#a1a1b0]">
                  📞 এই নম্বরেই আমাদের সাপোর্ট টিম কল করে অ্যাকাউন্ট যাচাই করবে।
                </p>
              </div>
            )}

            {rememberPhone === false && (
              <div className="mt-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 animate-fadeIn">
                <label className="block text-xs font-medium text-amber-300">
                  সাপোর্ট টিম যে সচল নম্বরে কল করবে সেই নম্বর দিন:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="যেমন: 017XXXXXXXX বা 019XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-amber-500/30 text-xs sm:text-sm text-[#f5f5f7] placeholder-[#71717a] focus:outline-none focus:border-amber-400 font-mono font-medium shadow-2xs"
                  />
                </div>
                <p className="text-[11px] text-amber-300/80">
                  ⚠️ যেহেতু পূর্বের নম্বর মনে নেই, তাই এই সচল নম্বরে কল করে বিকল্প তথ্যাদি দিয়ে যাচাই করা হবে।
                </p>
              </div>
            )}
          </div>

          {/* POLICY CALLOUT: 1 to 48 hours response notice */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-amber-400">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>কল সংক্রান্ত অত্যন্ত জরুরি শর্তাবলী:</span>
            </div>
            <p className="leading-relaxed text-[#a1a1b0]">
              রিকোয়েস্ট দাখিলের পর আমাদের সাপোর্ট টিম <strong className="text-amber-300">১ থেকে ৪৮ ঘণ্টার মধ্যে</strong> সরাসরি আপনার মোবাইল নম্বরে কল করবে। অনুগ্রহ করে কলটি রিসিভ করুন। <strong className="text-rose-400">কল মিস করলে রিকোয়েস্টটি মুছে দেওয়া হবে</strong> এবং আপনাকে পুনরায় নতুন করে আবেদন করতে হবে।
            </p>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-5 rounded-full bg-[#3b5bff] hover:bg-[#324ecc] active:scale-[0.99] text-white font-medium text-sm sm:text-base shadow-md shadow-[#3b5bff]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>রিকোয়েস্ট দাখিল হচ্ছে...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>রিকোয়েস্ট দাখিল করুন (Submit Request)</span>
                  <Send className="w-4 h-4" />
                </span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
