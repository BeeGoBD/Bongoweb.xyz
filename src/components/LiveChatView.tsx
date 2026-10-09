import React, { useEffect, useState } from 'react';
import { MessageSquare, Sparkles, CheckCircle2, Phone, ArrowRight } from 'lucide-react';
import { openAlapaiChat } from '../utils/alapai';
import { useLanguage } from '../utils/LanguageContext';

export default function LiveChatView() {
  const { t } = useLanguage();
  const [chatOpened, setChatOpened] = useState(false);

  // Automatically open the Alap AI chat window when entering the live chat view
  useEffect(() => {
    const timer = setTimeout(() => {
      openAlapaiChat();
      setChatOpened(true);
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  const handleTriggerChat = () => {
    openAlapaiChat();
    setChatOpened(true);
  };

  const quickTopics = [
    { label: t('প্যাকেজ ও মূল্য', 'Packages & Pricing') },
    { label: t('২৪ ঘণ্টা ডেলিভারি', '24h Delivery') },
    { label: t('বিকাশ ও নগদ পেমেন্ট', 'Payment Methods') },
    { label: t('ডোমেন ও ক্লাউড হোস্টিং', 'Domain & Hosting') },
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-14 pb-28 animate-fadeIn font-sans">
      {/* Clean Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{t('লাইভ সাপোর্ট সক্রিয়', 'Live Support Online')}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('লাইভ চ্যাট সাপোর্ট', 'Live Chat Support')}
        </h1>

        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          {t(
            'যেকোনো ওয়েবসাইট ডেমো, অর্ডার প্রক্রিয়া কিংবা টেকনিক্যাল সহযোগিতার জন্য আমাদের সাথে সরাসরি চ্যাট করুন।',
            'Connect with us instantly for website demos, order assistance, and technical guidance.'
          )}
        </p>
      </div>

      {/* Primary Clean Action Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <MessageSquare className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-slate-900">
            {t('Alap AI চ্যাট উইন্ডো', 'Alap AI Live Chat')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            {t(
              'স্ক্রিনের নিচের ডানপাশে চ্যাট উইন্ডো চালু রয়েছে। নতুন মেসেজ পাঠিয়ে দ্রুত সমাধান পান।',
              'The chat window is active on the bottom-right. Send a message to receive immediate answers.'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={handleTriggerChat}
          className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{t('চ্যাট উইন্ডো খুলুন', 'Open Chat Window')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {chatOpened && (
          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/60">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{t('চ্যাট উইন্ডো প্রস্তুত আছে', 'Chat window is active')}</span>
          </div>
        )}

        {/* Quick Topics */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
            {t('দ্রুত আলোচনার বিষয়সমূহ', 'Quick Topics')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickTopics.map((topic, i) => (
              <button
                key={i}
                type="button"
                onClick={handleTriggerChat}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-medium border border-slate-200/80 hover:border-blue-200 transition-all cursor-pointer"
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clean Hotline Footer */}
      <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <Phone className="w-3.5 h-3.5 text-slate-400" />
        <span>{t('জরুরি ফোন হটলাইন:', 'Direct hotline:')}</span>
        <a
          href="tel:+8801819847250"
          className="font-bold text-slate-700 hover:text-blue-600 transition-colors"
        >
          +880 1819-847250
        </a>
      </div>
    </div>
  );
}
