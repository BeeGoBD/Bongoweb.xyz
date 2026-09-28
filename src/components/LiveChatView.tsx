import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, MessageCircle, PhoneCall, CheckCircle2, Clock, 
  Sparkles, Headphones, ShieldCheck, ArrowRight, User
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'agent' | 'user';
  text: string;
  time: string;
}

export default function LiveChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'agent',
      text: 'আসসালামু আলাইকুম! BongoWeb.xyz-এ স্বাগতম। আপনার ব্যবসার জন্য কোন ধরনের ওয়েবসাইট প্রয়োজন বা কী সাহায্য করতে পারি? আমাদের জানান।',
      time: 'Just now'
    },
    {
      id: '2',
      sender: 'agent',
      text: 'Hello! Our dedicated engineering team is live online. Feel free to ask about pricing, domains, payment integration, or 24-hour delivery.',
      time: 'Just now'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    '🛒 ই-কমার্স ওয়েবসাইটের প্যাকেজ রেট কত?',
    '⏱️ কত ঘণ্টার মধ্যে ডেলিভারি পাওয়া যাবে?',
    '💳 বিকাশ ও নগদ পেমেন্ট কি অটো সেটআপ থাকবে?',
    '🌐 .com ডোমেইন এবং হোস্টিং কি সম্পূর্ণ ফ্রি?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    // Simulate Agent typing and replying
    setIsTyping(true);
    setTimeout(() => {
      let reply = 'ধন্যবাদ আপনার বার্তার জন্য! আমাদের একজন সিনিয়র ওয়েব স্পেশালিস্ট এখনই আপনার সাথে যুক্ত হচ্ছেন। আপনি সরাসরি আমাদের হোয়াটসঅ্যাপেও নক দিতে পারেন (+8801700000000)।';

      const lower = text.toLowerCase();
      if (lower.includes('খরচ') || lower.includes('প্যাকেজ') || lower.includes('রেট') || lower.includes('price')) {
        reply = 'আমাদের প্রিমিয়াম ওয়েবসাইট প্যাকেজ ৯৯৯ টাকা থেকে শুরু! এতে সম্পূর্ণ লাইভ ডোমেইন (.com), সুপারফাস্ট ক্লাউড হোস্টিং, এবং বিকাশ/নগদ অটো পেমেন্ট অন্তর্ভুক্ত থাকে।';
      } else if (lower.includes('ডেলিভারি') || lower.includes('সময়') || lower.includes('hour') || lower.includes('delivery')) {
        reply = 'আমাদের প্রতিটি ওয়েবসাইট মাত্র ২৪ ঘণ্টার মধ্যে সম্পূর্ণ ডেলিভারি দেওয়া হয়! কাজ শুরু করার পূর্বে আমরা সরাসরি আপনার সাথে কথা বলে সব রিকোয়ারমেন্ট ক্লিয়ার করে নিই।';
      } else if (lower.includes('বিকাশ') || lower.includes('নগদ') || lower.includes('payment') || lower.includes('পেমেন্ট')) {
        reply = 'হ্যাঁ! প্রতিটি ই-কমার্স ও বিজনেসে অটোমেটিক বিকাশ, নগদ, রকেট এবং কার্ড পেমেন্ট সরাসরি আপনার অ্যাকাউন্টে সেট করে দেওয়া হয়। সাথে কুরিয়ার অটো ট্র্যাকিংও থাকছে!';
      } else if (lower.includes('ডোমেইন') || lower.includes('হোস্টিং') || lower.includes('domain')) {
        reply = 'প্রতিটি অর্ডারের সাথে পাচ্ছেন ১ বছরের ফ্রি কাস্টম .com ডোমেইন এবং ৯৯.৯% আপটাইম বিশিষ্ট হাই-স্পিড ক্লাউড হোস্টিং ও ফ্রি SSL সিকিউরিটি সার্টিফিকেট!';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1100);
  };

  return (
    <div className="w-full flex flex-col font-sans pb-28 pt-4">
      {/* Top Header Card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-5">
        <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(13,37,61,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center font-black shadow-xs">
                <Headphones className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#00B261] border-2 border-[#FFFFFF] shadow-2xs" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-[#0D253D]">
                  BongoWeb লাইভ চ্যাট সাপোর্ট
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#00B261]/10 text-[#00B261] text-[10px] font-bold border border-[#00B261]/20">
                  অনলাইন আছেন
                </span>
              </div>
              <p className="text-xs text-[#64748D] mt-0.5">
                সরাসরি আমাদের কারিগরি দলের সাথে কথা বলুন • সাধারণত ১-২ মিনিটে উত্তর দেওয়া হয়
              </p>
            </div>
          </div>

          {/* Direct WhatsApp Call Out */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#00B261] hover:bg-[#009e56] text-[#FFFFFF] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp চ্যাট</span>
            </a>
            <a
              href="tel:+8801700000000"
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] active:bg-[#4032C8] text-[#FFFFFF] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4" />
              <span>কল করুন</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Chat Box Container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl shadow-[0_8px_30px_rgba(13,37,61,0.04)] overflow-hidden flex flex-col h-[520px] sm:h-[560px]">
          {/* Quick FAQ Prompt Chips */}
          <div className="p-3 bg-[#F8FAFD] border-b border-[#E5EDF5] overflow-x-auto scrollbar-none flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#64748D] shrink-0">
              কুইক প্রশ্ন:
            </span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#E2E4FF] text-[#273951] hover:text-[#533AFD] border border-[#E5EDF5] hover:border-[#533AFD]/30 text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer shadow-2xs shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Stream Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#FFFFFF]">
            {messages.map((msg) => {
              const isAgent = msg.sender === 'agent';
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isAgent ? 'justify-start' : 'justify-end'}`}
                >
                  {isAgent && (
                    <div className="w-8 h-8 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center shrink-0 text-xs font-black shadow-2xs">
                      BW
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] sm:max-w-[70%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isAgent
                        ? 'bg-[#F8FAFD] text-[#0D253D] border border-[#E5EDF5] rounded-bl-xs'
                        : 'bg-[#533AFD] text-[#FFFFFF] rounded-br-xs shadow-xs font-medium'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`block text-[10px] mt-1.5 ${
                        isAgent ? 'text-[#7D8BA4]' : 'text-[#E2E4FF]'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>

                  {!isAgent && (
                    <div className="w-8 h-8 rounded-xl bg-[#273951] text-[#FFFFFF] flex items-center justify-center shrink-0 text-xs shadow-2xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-[#7D8BA4] italic pl-11">
                <span className="w-2 h-2 rounded-full bg-[#533AFD] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#533AFD] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#533AFD] animate-bounce [animation-delay:0.4s]" />
                <span>BongoWeb ইঞ্জিনিয়ার লিখছেন...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-4 bg-[#F8FAFD] border-t border-[#E5EDF5] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="আপনার প্রশ্ন বা মতামত এখানে লিখুন..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5EDF5] text-xs sm:text-sm text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:border-[#533AFD] focus:ring-1 focus:ring-[#533AFD] transition-all"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] active:bg-[#4032C8] disabled:opacity-50 disabled:pointer-events-none text-[#FFFFFF] text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>পাঠান</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
