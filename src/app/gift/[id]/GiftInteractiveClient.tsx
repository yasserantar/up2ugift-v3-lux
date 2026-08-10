"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Gift, Heart, Sparkles, Copy, Check, Share2, 
  Volume2, VolumeX, ShieldCheck, Crown, Flag, GraduationCap, BookOpen, 
  Smile, Users, Award, Star, CheckCircle2, ShoppingBag, ExternalLink,
  Tv, Zap, Trophy, Rocket, Anchor, Flame, Compass, RefreshCw
} from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";
import GiftBox from "@/components/GiftBox3D";
import ParticleField from "@/components/ParticleField";
import { useLanguage } from "@/context/LanguageContext";

interface GiftData {
  id: string;
  giftId: string;
  senderName: string;
  recipientName: string;
  message: string;
  amount: number;
  occasion?: string;
  gender?: string;
  ageGroup?: string;
  category?: string;
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, [text]);
  return <span className="leading-relaxed select-text">&ldquo;{displayed}&rdquo;</span>;
}

/* Soft Romantic Audio Chime using Web Audio API */
const playRomanticAudioSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playNote = (freq: number, delaySec: number, durationSec: number = 3.0, vol: number = 0.06) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine'; // Ultra-soft warm sine wave
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delaySec);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + delaySec);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delaySec + 0.2); // Gentle attack
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delaySec + durationSec); // Slow decay
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + delaySec);
      osc.stop(ctx.currentTime + delaySec + durationSec);
    };

    // Warm, soothing C Major 7th arpeggio
    const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25];
    notes.forEach((freq, idx) => {
      playNote(freq, idx * 0.14, 3.2, 0.06 - (idx * 0.006));
    });
  } catch {}
};

export default function GiftInteractiveClient({ giftData }: { giftData: GiftData }) {
  const { lang, t } = useLanguage();
  const isRtl = lang === "ar";

  const [step, setStep] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Interactive Game State per Template
  const [interactiveProgress, setInteractiveProgress] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState<number[]>([]);
  const [storySlide, setStorySlide] = useState(1);

  const occasion = giftData.occasion || "friend";
  const category = giftData.category || (giftData.amount > 0 ? "vouchers" : "digital");
  const isDigitalOnly = category === "digital" || giftData.amount === 0;

  const isNationalDay = occasion === "national";
  const isQuran = occasion === "quran";
  const isGraduation = occasion === "graduation";
  const isBirthday = occasion === "birthday";
  const isKids = occasion === "kids";
  const isFamily = occasion === "family";

  const triggerConfetti = () => {
    const customColors = isNationalDay 
      ? ['#10b981', '#f5c563', '#34d399', '#ffffff', '#059669']
      : ['#f5c563', '#f43f5e', '#7c3aed', '#06b6d4', '#fffefc'];

    confetti({ 
      particleCount: 280, 
      spread: 130, 
      origin: { y: 0.55 },
      colors: customColors,
      zIndex: 9999 
    });
  };

  const handleChargeEnergy = () => {
    if (!isMuted) playRomanticAudioSound();
    setInteractiveProgress((prev) => {
      const next = prev + 34;
      if (next >= 100) {
        triggerConfetti();
        setTimeout(() => setStep(2), 800);
        return 100;
      }
      return next;
    });
  };

  const handleBadgeClick = (id: number) => {
    if (!isMuted) playRomanticAudioSound();
    if (!unlockedBadges.includes(id)) {
      const nextBadges = [...unlockedBadges, id];
      setUnlockedBadges(nextBadges);
      const pct = Math.min(100, Math.round((nextBadges.length / 4) * 100));
      setInteractiveProgress(pct);
      if (pct >= 100) {
        triggerConfetti();
        setTimeout(() => setStep(2), 900);
      }
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen text-[#fffefc] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      <ParticleField />
      
      {/* Mute/Unmute Ambient Toggle */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-6 left-6 z-30 p-3 rounded-full bg-white/5 border border-white/10 hover:border-[#f5c563]/40 text-[#f5c563] transition cursor-pointer"
        aria-label="Toggle Sound"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      <AnimatePresence mode="wait">
        
        {/* STAGE 0: Envelope Welcome Card */}
        {step === 0 && (
          <motion.div 
            key="0" 
            initial={{ opacity: 0, y: 25, scale: 0.96 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            className={`z-10 text-center glass-panel p-8 sm:p-12 max-w-md w-full relative overflow-hidden shadow-[0_0_70px_rgba(18,10,48,0.7)] ${
              isNationalDay ? "border-emerald-500/40" : "border-[#f5c563]/35"
            }`}
          >
            {/* Top Shimmer Border */}
            <div className={`absolute top-0 left-0 w-full h-[3.5px] bg-gradient-to-r ${
              isNationalDay 
                ? "from-emerald-500 via-[#f5c563] to-emerald-500" 
                : "from-[#7c3aed] via-[#f43f5e] to-[#f5c563]"
            }`}></div>
            
            {/* Hero Icon */}
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner select-none animate-halo border ${
              isNationalDay 
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" 
                : "bg-[#f5c563]/15 border-[#f5c563]/30 text-[#f5c563]"
            }`}>
              {isNationalDay ? (
                <Flag className="w-10 h-10" strokeWidth={1.5} />
              ) : isQuran ? (
                <BookOpen className="w-10 h-10" strokeWidth={1.5} />
              ) : isGraduation ? (
                <GraduationCap className="w-10 h-10" strokeWidth={1.5} />
              ) : isKids ? (
                <Zap className="w-10 h-10" strokeWidth={1.5} />
              ) : isFamily ? (
                <Heart className="w-10 h-10 text-[#f43f5e]" strokeWidth={1.5} />
              ) : (
                <Gift className="w-10 h-10" strokeWidth={1.5} />
              )}
            </div>
            
            {/* Badge */}
            <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase mb-4 border ${
              isNationalDay 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" 
                : "bg-[#f5c563]/10 border-[#f5c563]/30 text-[#f5c563]"
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isNationalDay ? "إهداء اليوم الوطني المجيد" : isQuran ? "إهداء حفظ القرآن المبارك" : isGraduation ? "وسام التخرج والنجاح" : isKids ? "منطقة الأبطال الخارقين" : "مُفَاجَأَة خَاصَّة"}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 text-white tracking-tight leading-tight">
              {t.receiver.welcome}{" "}
              <span className={isNationalDay ? "saudi-national-gradient font-black" : "luxury-gradient-text font-black"}>
                {giftData.recipientName}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 mb-8 leading-relaxed font-normal">
              {t.receiver.subtitle} <span className="text-[#f5c563] font-bold">{giftData.senderName}</span>
            </p>
            
            <button 
              onClick={() => {
                if (!isMuted) playRomanticAudioSound();
                setStep(1);
              }} 
              className={`px-8 py-4 text-stone-950 font-bold text-sm shadow-xl transition-all w-full cursor-pointer active:scale-98 rounded-full flex items-center justify-center gap-2 ${
                isNationalDay 
                  ? "bg-gradient-to-r from-emerald-400 via-[#f5c563] to-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]" 
                  : "bg-gradient-to-r from-[#f5c563] via-[#eab308] to-[#f5c563] hover:shadow-[0_0_30px_rgba(245,197,99,0.4)]"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.receiver.open_now}</span>
            </button>
          </motion.div>
        )}

        {/* STAGE 1: Interactive Occasion Challenge / 3D Unboxing */}
        {step === 1 && (
          <motion.div 
            key="1" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 1.05 }} 
            className="z-10 text-center flex flex-col items-center glass-panel p-8 sm:p-10 max-w-md w-full relative overflow-hidden shadow-[0_0_60px_rgba(18,10,48,0.7)] border-[#f5c563]/30"
          >
            <div className="absolute top-0 left-0 w-full h-[3.5px] bg-gradient-to-r from-[#7c3aed] via-[#f43f5e] to-[#f5c563]"></div>

            {/* TEMPLATE A: Kids / Super Hero Energy Charge (Y.html style) */}
            {isKids && (
              <div className="w-full flex flex-col items-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-300 shadow-md">
                  <Zap className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-extrabold text-white">اشحن طاقة البطل الخارق!</h2>
                <p className="text-xs text-stone-300 font-normal">اضغط على زر النيترو لشحن طاقة الذكاء والوصول لهدية الوالدين!</p>
                
                <div className="w-full h-5 bg-black/60 rounded-full border border-white/10 overflow-hidden relative p-0.5">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 rounded-full"
                    animate={{ width: `${interactiveProgress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-[#f5c563]">{interactiveProgress}% مكتمل</span>

                <button 
                  onClick={handleChargeEnergy}
                  className="px-8 py-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-stone-950 rounded-full font-black text-sm shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-stone-950" />
                  <span>اضغط لشحن الطاقة!</span>
                </button>
              </div>
            )}

            {/* TEMPLATE B: Friendship / Brother Traits Badges (Maged & Abu Khaled style) */}
            {(occasion === "friend" || isGraduation) && (
              <div className="w-full flex flex-col items-center space-y-4">
                <h2 className="text-lg font-bold text-white mb-1">اكتشف بصمات الأخوة والمواقف</h2>
                <p className="text-xs text-stone-300 font-normal mb-2">اضغط على الأوسمة الأربعة أدناه لفتح وثيقة التقدير الخالصة:</p>

                <div className="grid grid-cols-2 gap-3 w-full">
                  {[
                    { id: 1, title: "الجدعنة والوفاء", icon: ShieldCheck },
                    { id: 2, title: "الطموح والتميز", icon: Rocket },
                    { id: 3, title: "السند والعضيد", icon: Anchor },
                    { id: 4, title: "عشرة العمر", icon: Heart },
                  ].map((item) => {
                    const IconComp = item.icon;
                    const isDone = unlockedBadges.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleBadgeClick(item.id)}
                        className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                          isDone 
                            ? "bg-[#f5c563]/25 border-[#f5c563] text-[#f5c563] shadow-[0_0_15px_rgba(245,197,99,0.3)] scale-[1.03]" 
                            : "bg-white/5 border-white/10 text-stone-300 hover:border-white/20"
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                        <span>{item.title}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="w-full h-3 bg-black/60 rounded-full border border-white/10 overflow-hidden mt-3">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#f5c563] to-emerald-400"
                    animate={{ width: `${interactiveProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* TEMPLATE C: Default 3D Unboxing Box */}
            {!isKids && occasion !== "friend" && !isGraduation && (
              <div className="w-full flex flex-col items-center">
                <h2 className="text-xl font-bold mb-2 text-white">{t.receiver.locked_title}</h2>
                <p className="text-xs text-stone-300 mb-6 font-normal leading-relaxed">{t.receiver.locked_desc}</p>
                
                <div className="w-full h-64 flex items-center justify-center">
                  <GiftBox onOpen={() => {
                    if (!isMuted) playRomanticAudioSound();
                    triggerConfetti();
                    setTimeout(() => setStep(2), 900);
                  }} />
                </div>
              </div>
            )}

          </motion.div>
        )}

        {/* STAGE 2: Greeting Card (NO VOUCHER BOX FOR DIGITAL ONLY) */}
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
              className={`w-full glass-panel p-8 mb-5 relative overflow-hidden shadow-[0_0_60px_rgba(18,10,48,0.8)] ${
                isNationalDay ? "border-emerald-500/40" : "border-[#f5c563]/35"
              }`}
            >
              <div className={`absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r ${
                isNationalDay 
                  ? "from-emerald-500 via-[#f5c563] to-emerald-500" 
                  : "from-[#f5c563] via-[#f43f5e] to-[#7c3aed]"
              }`}></div>
              
              <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center mx-auto mb-4 ${
                isNationalDay ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : "bg-[#f5c563]/15 border-[#f5c563]/30 text-[#f5c563]"
              }`}>
                {isNationalDay ? <Flag className="w-5 h-5" /> : <Heart className="w-5 h-5 text-[#f43f5e]" />}
              </div>

              <div className="text-stone-100 text-base sm:text-lg leading-relaxed font-semibold italic min-h-[85px] flex items-center justify-center">
                <TypewriterText text={giftData.message} />
              </div>
              
              <div className="mt-6 flex justify-end w-full pt-4 border-t border-white/5">
                <span className="text-xs font-bold text-[#f5c563]">— {giftData.senderName}</span>
              </div>
            </motion.div>

            {/* Branded VIP Gift Voucher Box (STRICTLY DISPLAYED ONLY IF NOT DIGITAL ONLY AND AMOUNT > 0) */}
            {!isDigitalOnly && giftData.amount > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4, duration: 0.5 }} 
                className="w-full glass-panel p-6 relative overflow-hidden text-start mb-5 border-[#f5c563]/40 bg-gradient-to-br from-[#f5c563]/10 via-[#080417]/90 to-[#7c3aed]/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#f5c563] mb-1">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>بطاقة الهدية المرفقة (VIP Card)</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#f5c563]">
                      {giftData.amount} <span className="text-xs text-stone-300 font-normal">ريال سعودي</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#f5c563] shadow-lg">
                    {category === "subscriptions" ? <Tv className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6" />}
                  </div>
                </div>
                
                <div className="bg-stone-950/90 border border-[#f5c563]/30 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-inner">
                  <div>
                    <span className="text-[10px] font-medium text-stone-400 block mb-0.5">{t.receiver.voucher_num}</span>
                    <span className="font-mono text-sm sm:text-base tracking-widest text-[#f5c563] font-bold">
                      GIFT-{giftData.giftId}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`GIFT-${giftData.giftId}`);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="px-4 py-2 bg-[#f5c563]/15 hover:bg-[#f5c563]/25 text-[#f5c563] rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-[#f5c563]/35"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCode ? "تم النسخ!" : "نسخ الكود"}</span>
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
              <div className="glass-panel p-6 bg-gradient-to-br from-[#f5c563]/10 via-stone-900/60 to-[#7c3aed]/10 border-[#f5c563]/30 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#f5c563]/15 border border-[#f5c563]/30 flex items-center justify-center text-[#f5c563] mb-3 shadow-inner">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">{t.receiver.viral_title}</h3>
                <p className="text-xs text-stone-300 mb-6 font-normal leading-relaxed max-w-[280px]">
                  {t.receiver.viral_desc}
                </p>
                <Link href="/" className="w-full py-3.5 bg-gradient-to-r from-[#f5c563] via-[#eab308] to-[#f5c563] text-stone-950 hover:brightness-110 hover:shadow-[0_0_20px_rgba(245,197,99,0.4)] rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-98">
                  <span>{t.receiver.viral_btn}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
            
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
