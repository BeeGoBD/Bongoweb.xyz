export interface VideoFaqItem {
  id: string;
  code: string;
  category: 'delivery' | 'pricing' | 'control' | 'domain' | 'tech';
  categoryLabel: string;
  question: string;
  duration: string;
  videoPoster: string;
  videoSrc?: string;
  headline: string;
  summary: string;
  keyPoints: string[];
  viewsCount: string;
  speaker: string;
}

export const VIDEO_FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions', icon: 'Sparkles' },
  { id: 'delivery', label: 'Launch & Delivery', icon: 'Clock' },
  { id: 'pricing', label: 'Pricing & Upkeep', icon: 'CreditCard' },
  { id: 'control', label: 'Mobile Control', icon: 'Smartphone' },
  { id: 'domain', label: 'Domain & Lifetime', icon: 'Globe' },
  { id: 'tech', label: 'Security & Support', icon: 'ShieldCheck' },
];

export const VIDEO_FAQ_ITEMS: VideoFaqItem[] = [
  {
    id: 'vfaq-1',
    code: '#FAQ-01',
    category: 'delivery',
    categoryLabel: 'Launch & Delivery',
    question: 'ওয়েবসাইট ডেলিভারি হতে কতক্ষণ সময় লাগবে এবং আমাকে কী কী তথ্য দিতে হবে?',
    duration: '1:25 min',
    videoPoster: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    headline: 'মাত্র ২৪ ঘণ্টার মধ্যে লাইভ ওয়েবসাইট ডেলিভারি',
    summary: 'অর্ডার করার সময় শুধু আপনার ব্যবসা বা ব্র্যান্ডের নাম, লোগো (যদি থাকে) এবং মোবাইল নম্বর প্রদান করলেই চলবে। আমাদের ইঞ্জিনিয়ারিং টিম মাত্র ২৪ ঘণ্টার মধ্যে আপনার পুরো ওয়েবসাইট লাইভ ও প্রস্তুত করে দেবে।',
    keyPoints: [
      'কোনো টেকনিক্যাল ফাইল বা কোডিং জানার প্রয়োজন নেই',
      '২৪ ঘণ্টার মধ্যে সম্পূর্ণ লাইভ ডেমো এবং অ্যাডমিন ড্যাশবোর্ড বুঝিয়ে দেওয়া হবে',
      'আমাদের টিম সরাসরি ফোন এবং হোয়াটসঅ্যাপে কথা বলে কাজ শুরু করবে'
    ],
    viewsCount: '3.4k views',
    speaker: 'Technical Lead'
  },
  {
    id: 'vfaq-2',
    code: '#FAQ-02',
    category: 'pricing',
    categoryLabel: 'Pricing & Server',
    question: 'এককালীন সেটআপ ফির পর স্বল্প মাসিক ক্লাউড ফি কীসের জন্য?',
    duration: '1:40 min',
    videoPoster: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    headline: '১০০% স্বচ্ছ মূল্যতালিকা: আজীবন মালিকানা, কোনো লুকানো ফি নেই',
    summary: 'এককালীন সেটআপ ফি দিয়ে পুরো ওয়েবসাইটটি আপনার নামে তৈরি করে দেওয়া হয়। আর মাসিক স্বল্প ফি হলো হাই-স্পিড সার্ভার ক্লাউড স্পেস, ৯৯.৯% আপটাইম, স্বয়ংক্রিয় ব্যাকআপ এবং ফ্রি SSL সিকিউরিটির জন্য।',
    keyPoints: [
      'বছরের শেষে কোনো অপ্রত্যাশিত বিশাল রিনিউয়াল ফি নেই',
      'উচ্চগতির ক্লাউড সার্ভার এবং স্বয়ংক্রিয় সিকিউরিটি অন্তর্ভুক্ত',
      'বিকাশ, নগদ বা ব্যাংকের মাধ্যমে সহজেই বিল পরিশোধের সুবিধা'
    ],
    viewsCount: '4.8k views',
    speaker: 'Server Admin'
  },
  {
    id: 'vfaq-3',
    code: '#FAQ-03',
    category: 'control',
    categoryLabel: 'Mobile Control',
    question: 'আমি কি কম্পিউটার ছাড়া শুধু স্মার্টফোন দিয়েই পুরো ওয়েবসাইটটি পরিচালনা করতে পারব?',
    duration: '1:15 min',
    videoPoster: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1000&q=80',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    headline: 'মোবাইল থেকেই প্রোডাক্ট, অর্ডার ও মূল্য পরিবর্তনের সুবিধা',
    summary: 'প্রতিটি ওয়েবসাইটের সাথেই রয়েছে ১০০% মোবাইল-বান্ধব অ্যাডমিন কন্ট্রোল প্যানেল। সোশ্যাল মিডিয়ায় ছবি আপলোড করার মতোই সহজে আপনি আপনার ওয়েবসাইট পরিচালনা করতে পারবেন।',
    keyPoints: [
      'মোবাইল ক্যামেরা দিয়ে ছবি তুলে মাত্র ২ মিনিটে নতুন প্রোডাক্ট যুক্ত করুন',
      'নতুন অর্ডারের সাথে সাথেই তাৎক্ষণিক নোটিফিকেশন ও অ্যালার্ট',
      'কোনো প্রকার কোডিং বা টেকনিক্যাল অভিজ্ঞতার প্রয়োজন নেই'
    ],
    viewsCount: '5.1k views',
    speaker: 'Product Designer'
  },
  {
    id: 'vfaq-4',
    code: '#FAQ-04',
    category: 'domain',
    categoryLabel: 'Domain & Lifetime',
    question: 'আমার যদি নিজস্ব ডোমেন থাকে তবে কি সেটি যুক্ত করা যাবে?',
    duration: '1:30 min',
    videoPoster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    headline: 'সম্পূর্ণ স্বাধীনতা: কাস্টম ডোমেন অথবা ফ্রি সাবডোমেন',
    summary: 'আপনার যদি নিজস্ব কাস্টম ডোমেন থাকে, আমরা সম্পূর্ণ বিনামূল্যে তা আপনার ওয়েবসাইটের সাথে কানেক্ট করে দেব। আর ডোমেন না থাকলে আমরা সাথে সাথেই ফ্রি সাবডোমেন দিয়ে দেব।',
    keyPoints: [
      'আপনার যেকোনো কাস্টম ডোমেনের সাথে ফ্রি কানেকশন',
      'লাইফটাইম ফ্রি SSL সিকিউরিটি সার্টিফিকেট (সবুজ প্যাডলক)',
      'আমাদের ইঞ্জিনিয়াররা সম্পূর্ণ ডিএনএস কনফিগারেশন করে দেবে'
    ],
    viewsCount: '2.9k views',
    speaker: 'Network Engineer'
  },
  {
    id: 'vfaq-5',
    code: '#FAQ-05',
    category: 'tech',
    categoryLabel: 'Security & Support',
    question: 'ওয়েবসাইটে কোনো সমস্যা হলে বা সহায়তা প্রয়োজন হলে আমি কীভাবে সাপোর্ট পাব?',
    duration: '1:10 min',
    videoPoster: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=1000&q=80',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    headline: '২৪/৭ সার্বক্ষণিক সার্ভার মনিটরিং এবং সার্বক্ষণিক হোয়াটসঅ্যাপ সাপোর্ট',
    summary: 'প্রতিটি গ্রাহকের জন্যই রয়েছে আমাদের সাপোর্ট টিমের সরাসরি অ্যাক্সেস। যেকোনো প্রয়োজনে বা আপডেটের জন্য হোয়াটসঅ্যাপ বা ফোনে কথা বলে দ্রুত সমাধান পাবেন।',
    keyPoints: [
      'স্বয়ংক্রিয় ক্লাউড ব্যাকআপ — কোনো ডাটা হারানোর ভয় নেই',
      '৯৯.৯% আপটাইম সম্বলিত এন্টারপ্রাইজ ক্লাউড সার্ভার',
      '১-অন-১ ডেডিকেটেড কাস্টমার সাপোর্ট'
    ],
    viewsCount: '3.8k views',
    speaker: 'Head of Support'
  },
  {
    id: 'vfaq-6',
    code: '#FAQ-06',
    category: 'pricing',
    categoryLabel: 'Payment Gateway',
    question: 'ওয়েবসাইটে কাস্টমারদের পেমেন্ট কীভাবে আমার কাছে পৌঁছাবে?',
    duration: '1:35 min',
    videoPoster: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    headline: 'কাস্টমারদের দেওয়া টাকা সরাসরি আপনার পার্সোনাল বা মার্চেন্ট অ্যাকাউন্টে জমা হবে',
    summary: 'আপনার ওয়েবসাইটের মাধ্যমে কাস্টমাররা যে পেমেন্ট করবেন, তা কোনো থার্ড-পার্টির হাত ছাড়া সরাসরি আপনার বিকাশ, নগদ বা ব্যাংক অ্যাকাউন্টে জমা হবে। আমরা কোনো কমিশন কাটি না।',
    keyPoints: [
      'ক্যাশ অন ডেলিভারি (COD) এবং অনলাইন পেমেন্ট উভয় সুবিধাই অন্তর্ভুক্ত',
      '০% প্ল্যাটফর্ম কমিশন — পুরো লাভ আপনার নিজের',
      'অর্ডার হওয়ার সাথে সাথেই স্বয়ংক্রিয় ডিজিটাল ইনভয়েস তৈরি'
    ],
    viewsCount: '4.2k views',
    speaker: 'Payment Specialist'
  }
];
