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
      particleCount: 250, 
      spread: 120, 
      origin: { y: 0.5 },
      colors: ['#FF708D', '#FFD166', '#48BB78', '#4299E1', '#9F7AEA'],
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
    <div className="min-h-screen bg-[#FFFBF7] text-gray-800 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="orb-1"></div>
      <div className="orb-2"></div>
      
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 1.05 }} className="z-10 text-center gift-card p-10 max-w-md w-full">
            <div className="text-6xl mb-6 drop-shadow-md">💌</div>
            <h1 className="text-3xl md:text-4xl font-black mb-4 text-gray-800">{t.receiver.welcome} {giftData.recipientName}</h1>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed font-medium">
              {t.receiver.subtitle} <span className="text-pink-500 font-bold">{giftData.senderName}</span>
            </p>
            <button onClick={() => setStep(1)} className="px-8 py-4 bg-pink-500 text-white hover:bg-pink-600 rounded-full font-bold shadow-lg shadow-pink-200 transition-all w-full">
              {t.receiver.open_now}
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-10 text-center flex flex-col items-center gift-card p-10 max-w-md w-full">
            <div className="text-6xl mb-4 drop-shadow-md">🎀</div>
            <h2 className="text-2xl font-black mb-4 text-gray-800">{t.receiver.locked_title}</h2>
            <p className="text-gray-500 mb-8 font-medium">{t.receiver.locked_desc}</p>
            
            <button 
              onClick={handleTap} 
              className={cn(
                "w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 outline-none shadow-xl",
                taps === 0 ? 'bg-white border-4 border-pink-200 hover:border-pink-400' : 
                taps === 1 ? 'bg-pink-50 border-4 border-pink-400 scale-110' : 
                'bg-pink-100 border-4 border-pink-500 scale-125'
              )}
            >
              <span className="text-6xl drop-shadow-sm transition-transform hover:scale-110">🎁</span>
            </button>
            
            <div className="mt-10 flex gap-3">
              {[0,1,2].map(i => <div key={i} className={cn("w-3 h-3 rounded-full transition-colors", i < taps ? 'bg-pink-500 shadow-md shadow-pink-200' : 'bg-gray-200')} />)}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="2" initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6, type: "spring" }} className="z-10 flex flex-col items-center text-center w-full max-w-md">
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full gift-card p-8 mb-6 relative border-t-8 border-t-pink-400">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl drop-shadow-sm bg-white rounded-full p-1">
                💖
              </div>
              <p className="text-gray-700 text-xl md:text-2xl leading-relaxed italic font-bold pt-4">"{giftData.message}"</p>
            </motion.div>

            {giftData.amount > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full gift-card p-6 relative overflow-hidden text-start mb-6 border-l-8 border-l-yellow-400">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-1">{t.receiver.gift_value}</h3>
                    <div className="text-3xl font-black text-gray-800">{giftData.amount} <span className="text-lg text-gray-500 font-bold">SAR</span></div>
                  </div>
                  <div className="text-4xl">🛍️</div>
                </div>
                
                <div className="bg-gray-50 border-2 border-gray-100 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500 mb-2 font-bold">{t.receiver.voucher_num}</div>
                  <div className="font-mono text-xl md:text-2xl tracking-[0.1em] text-gray-800 font-black">X89F - {giftData.giftId}</div>
                </div>
              </motion.div>
            )}

            {/* Viral Loop CTA */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="w-full">
              <div className="gift-card bg-gradient-to-br from-pink-50 to-orange-50 border-2 border-pink-100 p-6 flex flex-col items-center">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-xl font-black text-gray-800 mb-2">{t.receiver.viral_title}</h3>
                <p className="text-sm text-gray-600 mb-6 font-medium leading-relaxed max-w-[250px]">{t.receiver.viral_desc}</p>
                <Link href="/" className="w-full py-3 bg-white text-pink-600 border-2 border-pink-200 hover:bg-pink-50 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2">
                  {t.receiver.viral_btn} <ArrowIcon className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
