import React, { useState, useRef, useEffect } from 'react';
import { Send, Headphones, CheckCircle2, User, Sparkles, CheckCheck } from 'lucide-react';
import { SupportChatThread, SupportChatMessage, UserAccount } from '../types';

export default function LiveChatView() {
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<SupportChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'admin',
      text: 'স্বাগতম BongoWeb লাইভ চ্যাট সাপোর্টে! আপনার পছন্দের ওয়েবসাইট, ডোমেইন বা পেমেন্ট সম্পর্কিত যেকোনো সহায়তার জন্য মেসেজ লিখুন।',
      timestamp: 'এখনই'
    }
  ]);

  // Load registered user and their sync thread on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('bongoweb_user');
      let phone = '01700000000';
      let name = 'ক্লায়েন্ট';

      if (storedUser) {
        const parsed: UserAccount = JSON.parse(storedUser);
        phone = parsed.phone;
        name = parsed.name;
        setUserPhone(phone);
        setUserName(name);
      } else {
        setUserPhone(phone);
        setUserName(name);
      }

      // Check existing thread in bongoweb_support_chats
      const storedChats = localStorage.getItem('bongoweb_support_chats');
      if (storedChats) {
        const threads: SupportChatThread[] = JSON.parse(storedChats);
        const myThread = threads.find((t) => t.userPhone === phone);
        if (myThread && myThread.messages.length > 0) {
          setMessages(myThread.messages);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Poll for admin replies every 1.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const phone = userPhone || '01700000000';
        const storedChats = localStorage.getItem('bongoweb_support_chats');
        if (storedChats) {
          const threads: SupportChatThread[] = JSON.parse(storedChats);
          const myThread = threads.find((t) => t.userPhone === phone);
          if (myThread && myThread.messages.length > 0) {
            setMessages((prev) => {
              if (prev.length !== myThread.messages.length) {
                return myThread.messages;
              }
              return prev;
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [userPhone]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputVal.trim();
    if (!text) return;

    const phone = userPhone || '01700000000';
    const name = userName || 'ক্লায়েন্ট';

    const clientMsg: SupportChatMessage = {
      id: `client-${Date.now()}`,
      sender: 'client',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, clientMsg];
    setMessages(newMessages);
    setInputVal('');

    // Save and sync with bongoweb_support_chats for Admin Panel
    try {
      const storedChats = localStorage.getItem('bongoweb_support_chats');
      let threads: SupportChatThread[] = storedChats ? JSON.parse(storedChats) : [];
      const threadIndex = threads.findIndex((t) => t.userPhone === phone);

      if (threadIndex >= 0) {
        threads[threadIndex].lastMessage = text;
        threads[threadIndex].lastUpdated = 'এখনই';
        threads[threadIndex].unreadAdminCount += 1;
        threads[threadIndex].messages = newMessages;
      } else {
        threads.unshift({
          userPhone: phone,
          userName: name,
          lastMessage: text,
          lastUpdated: 'এখনই',
          unreadAdminCount: 1,
          unreadClientCount: 0,
          messages: newMessages
        });
      }

      localStorage.setItem('bongoweb_support_chats', JSON.stringify(threads));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full flex flex-col font-sans pb-28 pt-2">
      {/* 1. Header: Clean "লাইভ চ্যাট" */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 w-full mb-4">
        <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center font-black shadow-2xs relative">
              <Headphones className="w-5 h-5 stroke-[2.2]" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00B261] border-2 border-[#FFFFFF]" />
            </div>

            <div>
              <h1 className="text-base sm:text-lg font-black text-[#0D253D] leading-tight">
                লাইভ সাপোর্ট চ্যাট (Live Support)
              </h1>
              <p className="text-[11px] text-[#00B261] font-bold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00B261] animate-pulse" />
                সাপোর্ট টিম সরাসরি সক্রিয় আছেন
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-[#64748D] hidden xs:block">
            <span className="font-mono text-[#0D253D] font-bold">গড় উত্তর সময়: ১ মিনিট</span>
            <span className="block text-[10px] text-[#00B261]">২৪/৭ ইনস্ট্যান্ট রিপ্লাই</span>
          </div>
        </div>
      </section>

      {/* 2. Messages Window */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 w-full flex-1">
        <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl shadow-xs p-4 sm:p-6 min-h-[440px] max-h-[560px] flex flex-col justify-between">
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            <div className="text-center my-2">
              <span className="text-[10px] font-mono text-[#64748D] bg-[#F8FAFD] border border-[#E5EDF5] px-3 py-1 rounded-full inline-block">
                অ্যাডমিন ও টেকনিক্যাল টিম অনলাইন
              </span>
            </div>

            {messages.map((msg) => {
              const isClient = msg.sender === 'client';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isClient ? 'items-end' : 'items-start'} animate-fadeIn`}
                >
                  <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                    {!isClient && (
                      <div className="w-7 h-7 rounded-lg bg-[#533AFD] text-white flex items-center justify-center font-black text-[10px] shrink-0 mb-1">
                        BW
                      </div>
                    )}

                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isClient
                          ? 'bg-[#533AFD] text-[#FFFFFF] rounded-br-xs shadow-xs'
                          : 'bg-[#F8FAFD] text-[#0D253D] border border-[#E5EDF5] rounded-bl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  </div>

                  <span className="text-[9px] text-[#64748D] mt-1 px-1 font-mono flex items-center gap-1">
                    <span>{msg.timestamp}</span>
                    {isClient && <CheckCheck className="w-3 h-3 text-[#533AFD]" />}
                  </span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-[#64748D] animate-pulse">
                <div className="w-6 h-6 rounded-lg bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center text-[10px] font-bold">
                  BW
                </div>
                <span>ইঞ্জিনিয়ার উত্তর লিখছেন...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 3. Input Form */}
          <div className="mt-4 pt-3 border-t border-[#E5EDF5]">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="আপনার মেসেজ লিখুন..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs sm:text-sm text-[#0D253D] placeholder-[#64748D] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD] focus:ring-1 focus:ring-[#533AFD] transition-all"
              />

              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] disabled:opacity-40 disabled:hover:bg-[#533AFD] text-[#FFFFFF] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">পাঠান</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
