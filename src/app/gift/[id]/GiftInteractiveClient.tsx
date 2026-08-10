"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Gift, Heart, Sparkles, Copy, Check, Share2, Music, Volume2, VolumeX, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";
import GiftBox from "@/components/GiftBox3D";
import ParticleField from "@/components/ParticleField";
import { useLanguage } from "@/context/LanguageContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GiftData {
  id: string;
  giftId: string;
  senderName: string;
  recipientName: string;
  message: string;
  amount: number;
  template?: string;
  category?: string;
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = React.useState('');
  React.useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [text]);
  return <span className="leading-relaxed">&ldquo;{displayed}&rdquo;</span>;
}

const playMagicSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playChime = (freq: number, time: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
      gain.gain.setValueAtTime(0, ctx.currentTime + time);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + 2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + 2);
    };

    [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00].forEach((freq, i) => {
      playChime(freq, i * 0.08, 0.25 - (i * 0.02));
    });
  } catch {}
};

export default function GiftInteractiveClient({ giftData }: { giftData: GiftData }) {
  const { lang, t } = useLanguage();
  const isRtl = lang === "ar";
  const [step, setStep] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const triggerConfetti = () => {
    confetti({ 
      particleCount: 250, 
      spread: 120, 
      origin: { y: 0.55 },
      colors: ['#ecc573', '#dfb256', '#fc7164', '#5526e0', '#fcfbf8'],
      zIndex: 9999 
    });
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen text-[#fcfbf8] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      <ParticleField />
      
      {/* Sound Toggle */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-6 left-6 z-30 p-3 rounded-full bg-white/5 border border-white/10 hover:border-[#ecc573]/30 text-[#ecc573] transition cursor-pointer"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      <AnimatePresence mode="wait">
        
        {/* STAGE 0: Envelope Welcome */}
        {step === 0 && (
          <motion.div 
            key="0" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            className="z-10 text-center glass-panel p-8 sm:p-12 max-w-md w-full relative overflow-hidden shadow-[0_0_60px_rgba(31,10,82,0.5)] border-[#ecc573]/25"
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#ecc573] to-transparent"></div>
            
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#ecc573]/20 to-[#5526e0]/20 border border-[#ecc573]/30 flex items-center justify-center text-[#ecc573] mx-auto mb-6 shadow-inner select-none animate-halo">
              <Gift className="w-10 h-10" strokeWidth={1.5} />
            </div>
            
            <span className="text-xs font-semibold text-[#ecc573] tracking-widest uppercase block mb-2">مُفَاجَأَة خَاصَّة 🎁</span>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white tracking-tight">
              {t.receiver.welcome} <span className="luxury-gradient-text">{giftData.recipientName}</span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 mb-8 leading-relaxed font-normal">
              {t.receiver.subtitle} <span className="text-[#ecc573] font-bold">{giftData.senderName}</span>
            </p>
            
            <button 
              onClick={() => {
                if (!isMuted) playMagicSound();
                setStep(1);
              }} 
              className="px-8 py-4 bg-gradient-to-r from-[#ecc573] via-[#dfb256] to-[#ecc573] text-stone-950 hover:brightness-110 hover:shadow-[0_0_30px_rgba(236,197,115,0.4)] rounded-full font-extrabold text-sm shadow-xl transition-all w-full cursor-pointer active:scale-98"
            >
              {t.receiver.open_now}
            </button>
          </motion.div>
        )}

        {/* STAGE 1: 3D Gift Box Unboxing */}
        {step === 1 && (
          <motion.div 
            key="1" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 1.05 }} 
            className="z-10 text-center flex flex-col items-center glass-panel p-8 sm:p-10 max-w-md w-full relative overflow-hidden shadow-[0_0_60px_rgba(31,10,82,0.5)] border-[#ecc573]/25"
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#5526e0] via-[#fc7164] to-[#ecc573]"></div>
            
            <h2 className="text-xl font-bold mb-2 text-white">{t.receiver.locked_title}</h2>
            <p className="text-xs text-stone-300 mb-6 font-normal leading-relaxed">{t.receiver.locked_desc}</p>
            
            <div className="w-full h-64 flex items-center justify-center">
              <GiftBox onOpen={() => {
                if (!isMuted) playMagicSound();
                triggerConfetti();
                setTimeout(() => setStep(2), 1000);
              }} />
            </div>
          </motion.div>
        )}

        {/* STAGE 2: Greeting Card & Reward */}
        {step === 2 && (
          <motion.div 
            key="2" 
            initial={{ opacity: 0, scale: 0.96, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
            className="z-10 flex flex-col items-center text-center w-full max-w-md relative"
          >
            
            {/* The Heartfelt Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2, duration: 0.5 }} 
              className="w-full glass-panel p-8 mb-5 relative overflow-hidden shadow-[0_0_50px_rgba(31,10,82,0.6)] border-[#ecc573]/30"
            >
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#ecc573] via-[#fc7164] to-[#5526e0]"></div>
              
              <div className="w-10 h-10 rounded-full bg-[#ecc573]/10 border border-[#ecc573]/20 flex items-center justify-center text-[#ecc573] mx-auto mb-4">
                <Heart className="w-5 h-5 fill-[#ecc573]/20" />
              </div>

              <div className="text-stone-100 text-base sm:text-lg leading-relaxed font-semibold italic min-h-[80px] flex items-center justify-center">
                <TypewriterText text={giftData.message} />
              </div>
              
              <div className="mt-6 flex justify-end w-full pt-4 border-t border-white/5">
                <span className="text-xs font-bold text-[#ecc573]">— {giftData.senderName}</span>
              </div>
            </motion.div>

            {/* Reward Code / Voucher Box */}
            {giftData.amount > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4, duration: 0.5 }} 
                className="w-full glass-panel p-6 relative overflow-hidden text-start mb-5 border-[#ecc573]/30"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-stone-400 block">{t.receiver.gift_value}</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#ecc573] mt-1">
                      {giftData.amount} <span className="text-xs text-stone-300 font-normal">ريال سعودي</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#ecc573]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="bg-stone-950/80 border border-[#ecc573]/30 rounded-xl p-3.5 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-medium text-stone-400 block mb-0.5">{t.receiver.voucher_num}</span>
                    <span className="font-mono text-sm sm:text-base tracking-widest text-[#ecc573] font-bold">
                      GIFT-{giftData.giftId}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`GIFT-${giftData.giftId}`);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="px-3.5 py-2 bg-[#ecc573]/15 hover:bg-[#ecc573]/25 text-[#ecc573] rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedCode ? "تم النسخ" : "نسخ"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Viral Creator Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6, duration: 0.5 }} 
              className="w-full"
            >
              <div className="glass-panel p-6 bg-gradient-to-br from-[#ecc573]/10 via-stone-900/40 to-[#5526e0]/10 border-[#ecc573]/20 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#ecc573]/15 border border-[#ecc573]/30 flex items-center justify-center text-[#ecc573] mb-3 shadow-inner">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">{t.receiver.viral_title}</h3>
                <p className="text-xs text-stone-300 mb-6 font-normal leading-relaxed max-w-[280px]">
                  {t.receiver.viral_desc}
                </p>
                <Link href="/" className="w-full py-3.5 bg-gradient-to-r from-[#ecc573] via-[#dfb256] to-[#ecc573] text-stone-950 hover:brightness-110 hover:shadow-[0_0_20px_rgba(236,197,115,0.4)] rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-98">
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
