"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Heart, ArrowRight, Lock, Unlock, Fingerprint, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function GiftInteractiveClient({ giftData }: { giftData: any }) {
  const [step, setStep] = useState(0);
  const [taps, setTaps] = useState(0);

  const triggerConfetti = () => {
    confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 }, zIndex: 9999 });
  };

  const handleTap = () => {
    setTaps(taps + 1);
    if (taps + 1 >= 3) {
      triggerConfetti();
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] text-[#F4F4F5] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="orb-1"></div>
      <div className="orb-2"></div>
      
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 1.1 }} className="z-10 text-center glass-panel p-10 max-w-md w-full">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-indigo-500/20">
              <Lock className="w-10 h-10 text-indigo-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">مرحباً {giftData.recipientName}</h1>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed">وصلتك هدية مميزة ورسالة مشفرة من <span className="text-indigo-300 font-bold">{giftData.senderName}</span></p>
            <button onClick={() => setStep(1)} className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all w-full">
              فك التشفير الآن
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-10 text-center flex flex-col items-center glass-panel p-10 max-w-md w-full">
            <Unlock className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4 text-white">الرسالة محمية برمز الأصدقاء</h2>
            <p className="text-gray-400 mb-10">اضغط على البصمة 3 مرات لكسر الختم</p>
            
            <button 
              onClick={handleTap} 
              className={cn(
                "w-32 h-32 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 outline-none",
                taps === 0 ? 'border-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20' : 
                taps === 1 ? 'border-purple-500 bg-purple-500/20 scale-110' : 
                'border-emerald-500 bg-emerald-500/30 scale-125'
              )}
            >
              <Fingerprint className={cn("w-14 h-14 transition-colors", taps > 0 ? 'text-white' : 'text-indigo-400')} />
            </button>
            
            <div className="mt-10 flex gap-3">
              {[0,1,2].map(i => <div key={i} className={cn("w-2.5 h-2.5 rounded-full transition-colors", i < taps ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10')} />)}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="2" initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, type: "spring" }} className="z-10 flex flex-col items-center text-center w-full max-w-md">
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full glass-panel p-8 mb-8 relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <p className="text-white text-xl md:text-2xl leading-relaxed italic font-light pt-2">"{giftData.message}"</p>
            </motion.div>

            {giftData.amount > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="w-full glass-panel p-6 relative overflow-hidden text-left mb-8 border border-white/10">
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-gray-400 text-sm font-medium tracking-widest uppercase mb-1">قيمة الهدية</h3>
                    <div className="text-3xl font-bold text-white">{giftData.amount} <span className="text-lg text-gray-400 font-normal">ريال</span></div>
                  </div>
                  <Gift className="w-8 h-8 text-indigo-400" />
                </div>
                
                <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">رقم القسيمة السرية</div>
                  <div className="font-mono text-xl tracking-[0.2em] text-white">X89F - {giftData.giftId} - 2A</div>
                </div>
              </motion.div>
            )}

            {/* Viral Loop CTA */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-8 w-full">
              <div className="p-[1px] rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <div className="bg-[#060608] p-6 rounded-2xl flex flex-col items-center">
                  <Sparkles className="w-6 h-6 text-pink-400 mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">هل أعجبتك التجربة؟</h3>
                  <p className="text-sm text-gray-400 mb-6 max-w-[250px]">ادخل البهجة على قلب شخص آخر واصنع تجربة إهداء مماثلة في ثوانٍ معدودة.</p>
                  <Link href="/" className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2">
                    اصنع هدية الآن <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
