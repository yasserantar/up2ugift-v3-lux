"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function GiftInteractiveClient({ giftData }: { giftData: any }) {
  const { lang, t } = useLanguage();
  const isRtl = lang === "ar";
  const [step, setStep] = useState(0);
  const [taps, setTaps] = useState(0);

  const triggerConfetti = () => {
    confetti({ 
      particleCount: 220, 
      spread: 100, 
      origin: { y: 0.55 },
      colors: ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#fefcfb'],
      zIndex: 9999 
    });
  };

  const handleTap = () => {
    setTaps(taps + 1);
    if (taps + 1 >= 3) {
      triggerConfetti();
      setStep(2);
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen text-[#fefcfb] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div 
            key="0" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            className="z-10 text-center glass-panel p-10 max-w-md w-full relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner select-none">
              ✉️
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black mb-2 text-white">
              {t.receiver.welcome} {giftData.recipientName}
            </h1>
            <p className="text-sm text-stone-400 mb-8 leading-relaxed font-semibold">
              {t.receiver.subtitle} <span className="text-amber-400 font-bold">{giftData.senderName}</span>
            </p>
            
            <button 
              onClick={() => setStep(1)} 
              className="px-8 py-4 bg-gradient-to-r from-amber-300 to-yellow-400 text-stone-950 hover:brightness-110 rounded-full font-black text-sm shadow-md transition-all w-full cursor-pointer active:scale-98"
            >
              {t.receiver.open_now}
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div 
            key="1" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 1.05 }} 
            className="z-10 text-center flex flex-col items-center glass-panel p-10 max-w-md w-full relative"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner select-none">
              🎁
            </div>
            
            <h2 className="text-xl font-bold mb-2 text-white">{t.receiver.locked_title}</h2>
            <p className="text-xs text-stone-400 mb-8 font-semibold leading-relaxed">{t.receiver.locked_desc}</p>
            
            <button 
              onClick={handleTap} 
              className={cn(
                "w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 outline-none shadow-xl border cursor-pointer select-none",
                taps === 0 ? 'bg-white/5 border-white/5 hover:border-amber-400/50' : 
                taps === 1 ? 'bg-amber-400/10 border-amber-400/30 scale-105' : 
                'bg-amber-400/20 border-amber-400/50 scale-110'
              )}
            >
              <span className="text-5xl animate-bounce">💝</span>
            </button>
            
            <div className="mt-8 flex gap-2">
              {[0, 1, 2].map(i => (
                <div 
                  key={i} 
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300", 
                    i < taps ? 'bg-amber-450 w-4 shadow-sm shadow-amber-300' : 'bg-stone-700'
                  )} 
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="2" 
            initial={{ opacity: 0, scale: 0.96, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
            className="z-10 flex flex-col items-center text-center w-full max-w-md relative"
          >
            
            {/* The Message Box */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2, duration: 0.5 }} 
              className="w-full glass-panel p-8 mb-5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300"></div>
              
              <p className="text-stone-100 text-lg md:text-xl leading-relaxed font-bold italic pt-2">
                "{giftData.message}"
              </p>
              
              <div className="mt-6 flex justify-end w-full">
                <span className="text-xs font-bold text-stone-400">— {giftData.senderName}</span>
              </div>
            </motion.div>

            {/* Voucher Box */}
            {giftData.amount > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4, duration: 0.5 }} 
                className="w-full glass-panel p-6 relative overflow-hidden text-start mb-5"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-stone-400">{t.receiver.gift_value}</span>
                    <div className="text-3xl font-black text-amber-350 mt-1">
                      {giftData.amount} <span className="text-sm text-stone-400 font-bold">SAR</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl select-none">
                    🛍️
                  </div>
                </div>
                
                <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 text-center">
                  <span className="text-[10px] font-bold text-stone-400 block mb-1">{t.receiver.voucher_num}</span>
                  <span className="font-mono text-base md:text-lg tracking-wider text-amber-200 font-black">
                    X89F - {giftData.giftId}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Viral Loop Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6, duration: 0.5 }} 
              className="w-full"
            >
              <div className="glass-panel p-6 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border-amber-500/10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl mb-3 shadow-inner select-none">
                  🎉
                </div>
                <h3 className="text-lg font-bold text-amber-100 mb-1">{t.receiver.viral_title}</h3>
                <p className="text-xs text-stone-400 mb-6 font-semibold leading-relaxed max-w-[280px]">
                  {t.receiver.viral_desc}
                </p>
                <Link href="/" className="w-full py-3 bg-gradient-to-r from-amber-300 to-yellow-400 text-stone-950 hover:brightness-110 rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-98">
                  {t.receiver.viral_btn} <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
