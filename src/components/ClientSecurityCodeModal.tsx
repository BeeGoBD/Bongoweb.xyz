import React, { useState, useEffect } from 'react';
import { ShieldCheck, Copy, Check, X, Clock, AlertCircle, LogIn } from 'lucide-react';
import { UserAccount } from '../types';
import { getClientSecurityCode, getSecurityCodeRemainingSeconds, formatRemainingTime } from '../utils/securityCode';

interface ClientSecurityCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLogin?: () => void;
}

export default function ClientSecurityCodeModal({
  isOpen,
  onClose,
  onGoToLogin
}: ClientSecurityCodeModalProps) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [copied, setCopied] = useState(false);
  const [codeRemainingSec, setCodeRemainingSec] = useState<number>(getSecurityCodeRemainingSeconds());

  useEffect(() => {
    if (!isOpen) return;
    try {
      const stored = localStorage.getItem('bongoweb_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        setCurrentUser(null);
      }
    } catch (_) {
      setCurrentUser(null);
    }
  }, [isOpen]);

  // Security code timer countdown
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCodeRemainingSec(getSecurityCodeRemainingSeconds());
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentCode = currentUser
    ? getClientSecurityCode(currentUser.phone || currentUser.email)
    : '';

  const handleCopy = () => {
    if (!currentCode) return;
    try {
      navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 relative space-y-4 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {!currentUser ? (
          <div className="text-center space-y-4 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-2xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-[#0D253D]">
              সিকিউরিটি কোড যাচাইকরণ
            </h3>
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs font-bold text-amber-900 leading-relaxed">
              “কোড পেতে আগে Account-এ লগইন বা সাইন আপ করুন। তারপর আমরা আপনার সমস্যা সমাধান করব।”
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onGoToLogin) onGoToLogin();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#2B47EE] hover:bg-[#1E3A8A] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Account-এ যান</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-semibold cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] text-[#2B47EE] flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#2B47EE] uppercase tracking-wider block">
                  ভেরিফিকেশন সুরক্ষা কোড
                </span>
                <h3 className="text-base font-black text-[#0D253D]">
                  Your Security Code
                </h3>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFD] border-2 border-[#2B47EE]/30 text-center space-y-2">
              <span className="text-xs text-[#64748D] font-medium block">
                আপনার বর্তমান ৫-মিনিটের সক্রিয় সিকিউরিটি কোড:
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-[0.25em] text-[#2B47EE] select-all py-1">
                {currentCode}
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748D] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#00B261] animate-pulse" />
                <span>
                  মেয়াদ বাকি: <strong className="text-[#0D253D] font-mono">{formatRemainingTime(codeRemainingSec)}</strong>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                copied
                  ? 'bg-[#00B261] text-white'
                  : 'bg-[#2B47EE] hover:bg-[#1E3A8A] text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Security Code কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Security Code (কোড কপি করুন)</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-[#64748D] text-center leading-relaxed">
              * এই কোডটি প্রতি ৫ মিনিটে পরিবর্তিত হয়। চ্যাটে অ্যাডমিনকে এই কোডটি জানিয়ে দিন যাতে নিশ্চিত হওয়া যায় আপনি এই অ্যাকাউন্টের প্রকৃত মালিক।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
