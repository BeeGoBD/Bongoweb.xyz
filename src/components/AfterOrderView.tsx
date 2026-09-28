import React from 'react';
import { 
  PhoneCall, Sparkles, Rocket, MessageCircle, ShieldCheck, 
  CheckCircle2, Clock, Globe, CreditCard, Laptop, ArrowRight, 
  HelpCircle, Lock, Server, FileText
} from 'lucide-react';

interface AfterOrderViewProps {
  onGoToDashboard: () => void;
  onOpenLiveChat: () => void;
}

export default function AfterOrderView({ onGoToDashboard, onOpenLiveChat }: AfterOrderViewProps) {
  const workflowSteps = [
    {
      step: '01',
      titleEnglish: 'Direct Consultation & Order Confirmation Call',
      titleBangla: 'সরাসরি ফোন কল ও রিকোয়ারমেন্ট যাচাই',
      descriptionEnglish: 'Our senior engineer calls you or connects on WhatsApp within 15 minutes of receiving your order. We confirm your business requirements, template selection, and scope before any work begins.',
      icon: PhoneCall,
      highlight: 'Work starts only after speaking with you'
    },
    {
      step: '02',
      titleEnglish: 'Collecting Brand Logo, Domain & Content Assets',
      titleBangla: 'লোগো, ব্র্যান্ড কালার ও ডোমেইন সংগ্রহ',
      descriptionEnglish: 'We collect your business logo, preferred domain name (.com or .xyz), company slogan, product lists, and official contact information through our simple checklist.',
      icon: Sparkles,
      highlight: 'Zero hassle asset onboarding'
    },
    {
      step: '03',
      titleEnglish: 'High-Speed Customization & Cloud Architecture',
      titleBangla: 'টেমপ্লেট কাস্টমাইজেশন ও ক্লাউড কনফিগারেশন',
      descriptionEnglish: 'We configure the selected website on top-tier cloud architecture with 99.9% uptime, applying your brand colors, typography, banners, and sample product catalogs.',
      icon: Server,
      highlight: 'Ultra-fast NVMe cloud servers'
    },
    {
      step: '04',
      titleEnglish: 'Payment Gateway & Automated Courier API Setup',
      titleBangla: 'বিকাশ/নগদ পেমেন্ট গেটওয়ে ও কুরিয়ার ইন্টিগ্রেশন',
      descriptionEnglish: 'We integrate automated bKash, Nagad, cards, and bank checkout options along with Steadfast, Pathao, or RedX automated parcel tracking APIs directly to your merchant account.',
      icon: CreditCard,
      highlight: 'Instant automated settlements'
    },
    {
      step: '05',
      titleEnglish: 'Cross-Device QA & Google PageSpeed 95+ Tuning',
      titleBangla: 'মোবাইল অপ্টিমাইজেশন ও স্পিড টেস্টিং',
      descriptionEnglish: 'We test your website across Android smartphones, iPhones, iPads, and desktop computers to guarantee lightning-fast load times under 1.5 seconds and secure SSL encryption.',
      icon: Laptop,
      highlight: 'Mobile-first Google Speed optimized'
    },
    {
      step: '06',
      titleEnglish: 'Private Staging Preview & Unlimited Fine-Tuning',
      titleBangla: 'প্রাইভেট প্রিভিউ লিংক ও রিভিশন সম্পন্নকরণ',
      descriptionEnglish: 'You receive a private live staging link to inspect every page, product, and button. Any text, price, or layout adjustments are made immediately until you are 100% satisfied.',
      icon: CheckCircle2,
      highlight: 'Your complete approval before launch'
    },
    {
      step: '07',
      titleEnglish: 'Official Launch & Admin Video Tutorial Handover',
      titleBangla: 'ডোমেইন লাইভ ও অ্যাডমিন ভিডিও টিউটোরিয়াল',
      descriptionEnglish: 'We link your live custom domain, hand over super-admin credentials, and provide a personalized screen-recorded video guide showing you how to add products and manage orders in 2 minutes.',
      icon: Rocket,
      highlight: 'Complete ownership with video guide'
    },
    {
      step: '08',
      titleEnglish: 'Lifetime Technical Maintenance & WhatsApp Support',
      titleBangla: '২৪/৭ ফ্রি টেকনিক্যাল সাপোর্ট ও মেইনটেন্যান্স',
      descriptionEnglish: 'Our engineering desk remains at your disposal 24/7 on WhatsApp for server monitoring, daily automatic database backups, and technical help at any time.',
      icon: MessageCircle,
      highlight: 'Uninterrupted peace of mind'
    }
  ];

  return (
    <div className="w-full flex flex-col font-sans pb-28 pt-4">
      {/* Header Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full mb-8">
        <div className="bg-[#F8FAFD] border border-[#E5EDF5] rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_4px_24px_rgba(13,37,61,0.03)] text-center relative overflow-hidden">
          {/* Subtle Top Gradient Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#533AFD] via-[#7F7DFC] to-[#BDB4FF]" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E2E4FF] text-[#533AFD] mb-3 border border-[#533AFD]/20">
            <ShieldCheck className="w-4 h-4 text-[#533AFD]" />
            <span>স্বচ্ছ ও নিরাপদ কর্মপদ্ধতি • Transparent 8-Step Workflow</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0D253D] tracking-tight mb-3">
            What We Do After Your{' '}
            <span className="text-[#533AFD]">Website Order</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#273951] font-medium max-w-2xl mx-auto mb-2">
            অর্ডার করার মুহূর্ত থেকে আপনার ওয়েবসাইট লাইভ হওয়া পর্যন্ত আমাদের প্রতিটি পদক্ষেপ বিস্তারিত জানুন।
          </p>
          <p className="text-xs text-[#64748D] max-w-2xl mx-auto">
            Our step-by-step engineering roadmap ensures every website is delivered within 24 hours with custom domain, cloud hosting, and continuous live support.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onGoToDashboard}
              className="px-5 py-2.5 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] active:bg-[#4032C8] text-[#FFFFFF] text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>ওয়েবসাইট ক্যাটালগে ফিরুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenLiveChat}
              className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#E5EDF5] text-[#273951] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#533AFD]" />
              <span>সরাসরি চ্যাটে কথা বলুন</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8-Step Interactive Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 w-full space-y-4">
        {workflowSteps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="group bg-[#FFFFFF] hover:bg-[#F8FAFD] rounded-2xl sm:rounded-3xl border border-[#E5EDF5] hover:border-[#533AFD]/50 p-5 sm:p-6 transition-all duration-200 shadow-[0_2px_12px_rgba(13,37,61,0.03)] hover:shadow-[0_8px_24px_rgba(83,58,253,0.08)] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
            >
              {/* Step Number & Icon */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <span className="text-xl sm:text-2xl font-black text-[#533AFD] font-mono tracking-tight w-8">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-sm sm:text-base font-black text-[#0D253D]">
                    {item.titleEnglish}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E2E4FF] text-[#533AFD]">
                    {item.highlight}
                  </span>
                </div>

                <p className="text-xs font-semibold text-[#533AFD] mb-1.5">
                  {item.titleBangla}
                </p>

                <p className="text-xs text-[#273951] leading-relaxed font-normal">
                  {item.descriptionEnglish}
                </p>
              </div>

              {/* Verified Status Tag */}
              <div className="shrink-0 self-end sm:self-center">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00B261]">
                  <CheckCircle2 className="w-4 h-4 text-[#00B261]" />
                  <span>গ্যারান্টিযুক্ত</span>
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3 Core Assurances */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 w-full mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5]">
            <Clock className="w-6 h-6 text-[#533AFD] mb-2" />
            <h4 className="text-sm font-bold text-[#0D253D]">২৪ ঘণ্টার মধ্যে ডেলিভারি</h4>
            <p className="text-xs text-[#64748D] mt-1">
              Live within 24 hours of receiving your brand assets. No endless delays.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5]">
            <ShieldCheck className="w-6 h-6 text-[#00B261] mb-2" />
            <h4 className="text-sm font-bold text-[#0D253D]">১০০% মানিব্যাক গ্যারান্টি</h4>
            <p className="text-xs text-[#64748D] mt-1">
              Full refund if we fail to deliver according to agreed specifications.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5]">
            <MessageCircle className="w-6 h-6 text-[#FF6118] mb-2" />
            <h4 className="text-sm font-bold text-[#0D253D]">২৪/৭ অফিসিয়াল হোয়াটসঅ্যাপ</h4>
            <p className="text-xs text-[#64748D] mt-1">
              Direct engineering access via WhatsApp whenever you need assistance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
