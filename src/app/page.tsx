"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CreditCard, Loader2, Sparkles, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createGiftAction } from "./actions/gift";
import { useLanguage } from "@/context/LanguageContext";
import { arAI, enAI } from "@/dictionaries/aiTemplates";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const occasionsList = [
  { id: "friend", icon: "💝", dictKey: "friend" },
  { id: "family", icon: "🏡", dictKey: "family" },
  { id: "eid", icon: "🌙", dictKey: "eid" },
  { id: "birthday", icon: "🎂", dictKey: "birthday" },
  { id: "national", icon: "🇸🇦", dictKey: "national" },
  { id: "graduation", icon: "🎓", dictKey: "graduation" },
  { id: "quran", icon: "📖", dictKey: "quran" },
  { id: "kids", icon: "🧸", dictKey: "kids" },
];

const categoriesList = [
  { id: "digital", icon: "✉️", dictKey: "digital" },
  { id: "vouchers", icon: "🎁", dictKey: "vouchers" },
  { id: "subscriptions", icon: "📺", dictKey: "subscriptions" },
];

export default function Home() {
  const router = useRouter();
  const { lang, t, toggleLanguage } = useLanguage();
  const isRtl = lang === "ar";

  const [step, setStep] = useState(1);
  const [selectedOccasion, setSelectedOccasion] = useState(occasionsList[0].id);
  const [selectedCategory, setSelectedCategory] = useState(categoriesList[1].id);
  
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");

  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success">("idle");
  const [generatedLink, setGeneratedLink] = useState("");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-fill message when occasion or language changes
  useEffect(() => {
    const templates = isRtl ? arAI : enAI;
    const occasionTemplates = templates[selectedOccasion as keyof typeof templates] || templates.friend;
    setMessage(occasionTemplates[0]);
  }, [selectedOccasion, lang]);

  const handleNext = () => {
    if (step === 2 && (!senderName || !recipientName)) {
      alert(lang === "ar" ? "الرجاء كتابة الأسماء أولاً" : "Please fill in the names first");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleGenerateAI = () => {
    // Clear any active typing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsGeneratingMessage(true);
    setMessage("");
    
    const templates = isRtl ? arAI : enAI;
    const occasionTemplates = templates[selectedOccasion as keyof typeof templates] || templates.friend;
    // Get a random template that is not the current one if possible
    let randomMessage = occasionTemplates[Math.floor(Math.random() * occasionTemplates.length)];
    
    let currentText = "";
    let index = 0;
    
    setTimeout(() => {
      setIsGeneratingMessage(false);
      intervalRef.current = setInterval(() => {
        if (index < randomMessage.length) {
          currentText += randomMessage[index];
          setMessage(currentText);
          index++;
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 25); // Faster typing speed
    }, 800);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleCheckout = async () => {
    setPaymentState("processing");
    
    setTimeout(async () => {
      const res = await createGiftAction({
        senderName,
        recipientName,
        message,
        amount: selectedCategory === "digital" ? 0 : 50,
      });

      if (res.success && res.giftId) {
        setGeneratedLink(res.giftId);
        setPaymentState("success");
      } else {
        alert(lang === "ar" ? "حدث خطأ أثناء حفظ الهدية" : "An error occurred while saving the gift");
        setPaymentState("idle");
      }
    }, 1800);
  };

  const slideVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="relative min-h-screen pb-24">
      {/* Header bar */}
      <header className="w-full py-6 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto relative z-20">
        <div className="flex items-center gap-2 select-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 flex items-center justify-center text-stone-950 shadow-md font-black text-xl">
            U
          </div>
          <span className="font-extrabold text-xl tracking-tight text-amber-100">Up2UGift</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage} 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-amber-500/20 shadow-sm hover:bg-white/10 transition-all text-xs font-bold text-amber-200 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            {lang === "ar" ? "English" : "العربية"}
          </button>
          <Link href="/admin/login" className="text-xs font-bold text-amber-400/70 hover:text-amber-300 transition">
            {t.login}
          </Link>
        </div>
      </header>

      {/* Main content container */}
      <main className="max-w-3xl mx-auto px-6 relative z-10 pt-4">
        {/* Intro Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/5 border border-amber-500/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-[11px] font-bold text-amber-300 tracking-wider uppercase">{t.hero_badge}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
            {t.hero_title_1} <br/>
            <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 bg-clip-text text-transparent">{t.hero_title_2}</span>
          </h1>
          <p className="text-sm text-amber-200/60 max-w-lg mx-auto mt-4 font-medium leading-relaxed">
            {t.hero_desc}
          </p>
        </motion.div>

        {/* Stepper Card */}
        <div className="w-full glass-panel p-6 md:p-10 relative overflow-hidden">
          
          {/* Subtle horizontal light ray */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>

          {/* Stepper Indicator */}
          <div className="w-full flex justify-between items-center mb-10 relative max-w-md mx-auto">
            <div className="absolute left-0 right-0 h-[2px] bg-white/5 top-1/2 -translate-y-1/2 -z-10 rounded-full"></div>
            <div 
              className={cn(
                "absolute h-[2.5px] bg-gradient-to-r from-amber-300 to-yellow-400 top-1/2 -translate-y-1/2 -z-10 rounded-full transition-all duration-500 ease-out",
                isRtl ? "right-0" : "left-0"
              )}
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
            
            {[1, 2, 3].map((num) => (
              <div 
                key={num} 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border",
                  step >= num 
                    ? "bg-gradient-to-r from-amber-300 to-yellow-400 text-stone-950 border-transparent shadow-md font-black" 
                    : "bg-stone-900/40 text-stone-400 border-white/5"
                )}
              >
                {step > num ? <Check className="w-4 h-4" /> : num}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                
                {/* Occasion Section */}
                <div>
                  <h3 className="text-lg font-bold text-amber-100 mb-4">{t.step_1_title}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {occasionsList.map((occ) => {
                      const isSelected = selectedOccasion === occ.id;
                      return (
                        <button
                          key={occ.id}
                          onClick={() => setSelectedOccasion(occ.id)}
                          className={cn(
                            "occasion-card p-4 rounded-2xl text-center cursor-pointer flex flex-col items-center justify-center relative",
                            isSelected 
                              ? "bg-white/10 shadow-[0_12px_24px_rgba(243,229,171,0.08)] border-amber-400/50" 
                              : "bg-white/5 border-white/5"
                          )}
                        >
                          <span className="text-3xl mb-2">{occ.icon}</span>
                          <span className={cn("text-xs font-bold transition-colors", isSelected ? "text-amber-300" : "text-stone-300")}>
                            {t.occasions[occ.dictKey as keyof typeof t.occasions]}
                          </span>
                          {isSelected && (
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Categories Section */}
                <div>
                  <h3 className="text-lg font-bold text-amber-100 mb-4">{t.step_2_title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categoriesList.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      const catDict = t.categories[cat.dictKey as keyof typeof t.categories];
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={cn(
                            "category-card p-5 rounded-2xl text-start cursor-pointer flex flex-col justify-between h-full relative",
                            isSelected 
                              ? "bg-white/10 shadow-[0_12px_24px_rgba(243,229,171,0.08)] border-amber-400/50" 
                              : "bg-white/5 border-white/5"
                          )}
                        >
                          <div className="flex justify-between items-start w-full mb-3">
                            <span className="text-3xl">{cat.icon}</span>
                            <span className={cn("text-[10px] px-2.5 py-0.5 rounded-full font-bold", isSelected ? "bg-amber-400/10 text-amber-300" : "bg-white/5 text-stone-400")}>
                              {catDict.tag}
                            </span>
                          </div>
                          
                          <div className="mt-2">
                            <h4 className="font-bold text-sm text-stone-100 mb-1">{catDict.title}</h4>
                            <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 mb-4 font-medium">{catDict.desc}</p>
                          </div>

                          <div className="flex justify-between items-center w-full pt-2 border-t border-white/5 mt-auto">
                            <span className="text-xs font-extrabold text-amber-200">{catDict.price}</span>
                            <div className={cn("w-5 h-5 rounded-full flex items-center justify-center border transition-all", isSelected ? "bg-amber-400 border-transparent text-stone-950" : "border-stone-600 text-transparent")}>
                              <Check className="w-3 h-3" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex justify-end pt-4">
                  <button 
                    onClick={handleNext} 
                    className="px-6 py-3 bg-gradient-to-r from-amber-300 to-yellow-400 text-stone-950 rounded-full font-black text-xs flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    {t.next} <ArrowIcon className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-amber-100">{t.personalize_title}</h3>
                  <p className="text-xs text-amber-200/50 font-medium">{t.personalize_desc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-stone-300">{t.recipient_name}</label>
                    <input 
                      type="text" 
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder={t.recipient_placeholder}
                      className="premium-input p-3.5 text-xs font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-stone-300">{t.sender_name}</label>
                    <input 
                      type="text" 
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder={t.sender_placeholder}
                      className="premium-input p-3.5 text-xs font-semibold"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2 md:col-span-2 relative">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-stone-300">{t.message_title}</label>
                      
                      {/* Smart AI Message Suggestions */}
                      <button 
                        type="button"
                        onClick={handleGenerateAI}
                        disabled={isGeneratingMessage}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-250 transition disabled:opacity-50 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {isGeneratingMessage ? (lang === "ar" ? "جاري التفكير..." : "Thinking...") : (lang === "ar" ? "اقتراح ذكي بالـ AI" : "AI Message Suggestion")}
                      </button>
                    </div>
                    
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t.message_placeholder}
                      rows={5}
                      className="premium-input p-4 w-full resize-none text-xs font-semibold leading-relaxed"
                    />
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <button 
                    onClick={() => setStep(1)} 
                    className="text-stone-400 hover:text-stone-200 font-bold text-xs flex items-center gap-1 transition-all"
                  >
                    {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />} {t.back}
                  </button>
                  <button 
                    onClick={handleNext} 
                    className="px-6 py-3 bg-gradient-to-r from-amber-300 to-yellow-400 text-stone-950 rounded-full font-black text-xs flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    {t.continue_payment} <ArrowIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center py-6 text-center">
                
                {paymentState === "idle" && (
                  <div className="w-full max-w-sm flex flex-col items-center">
                    <span className="text-5xl mb-3">💳</span>
                    <h3 className="text-xl font-bold text-amber-100 mb-1">{t.secure_payment}</h3>
                    <p className="text-xs text-amber-205/50 font-medium max-w-xs mb-8 leading-relaxed">{t.secure_payment_desc}</p>
                    
                    <button 
                      onClick={handleCheckout} 
                      className="w-full py-3.5 bg-white text-stone-950 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer mb-3 hover:bg-stone-50"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-stone-950"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/></svg>
                      {t.pay_apple}
                    </button>
                    
                    <button 
                      onClick={handleCheckout} 
                      className="w-full py-3.5 bg-gradient-to-r from-amber-300 to-yellow-400 text-stone-950 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" /> {t.pay_card}
                    </button>

                    <button 
                      onClick={() => setStep(2)} 
                      className="mt-6 text-xs text-stone-400 hover:text-stone-200 transition font-bold"
                    >
                      {t.back_edit}
                    </button>
                  </div>
                )}

                {paymentState === "processing" && (
                  <div className="flex flex-col items-center py-12">
                    <Loader2 className="w-10 h-10 text-amber-400 animate-spin mb-4" />
                    <h4 className="text-base font-bold text-amber-100 mb-1">{t.processing_payment}</h4>
                    <p className="text-xs text-amber-205/50 font-medium">{t.processing_desc}</p>
                  </div>
                )}

                {paymentState === "success" && (
                  <div className="w-full max-w-md flex flex-col items-center">
                    <span className="text-6xl mb-4 drop-shadow-md">🎉</span>
                    <h3 className="text-2xl font-black text-amber-150 mb-2">{t.success_title}</h3>
                    <p className="text-xs text-amber-205/55 font-medium leading-relaxed max-w-xs mb-8">{t.success_desc}</p>
                    
                    <div className="w-full bg-stone-900/60 border border-white/5 rounded-2xl p-2 flex items-center justify-between gap-4 mb-8">
                      <input 
                        type="text" 
                        readOnly 
                        value={`https://16-up2ugift-v3.vercel.app/gift/${generatedLink}`} 
                        className="bg-transparent border-none text-stone-300 w-full outline-none text-xs font-mono px-3 font-semibold text-left direction-ltr" 
                        dir="ltr"
                      />
                      <button 
                        onClick={() => navigator.clipboard.writeText(`https://16-up2ugift-v3.vercel.app/gift/${generatedLink}`)} 
                        className="px-4 py-2 bg-gradient-to-r from-amber-300 to-yellow-400 text-stone-950 font-black rounded-xl text-xs transition-all shadow-md active:scale-95"
                      >
                        {t.copy_link}
                      </button>
                    </div>

                    <Link href={`/gift/${generatedLink}`}>
                      <button className="px-6 py-2.5 bg-white/5 border border-white/5 text-amber-250 rounded-full font-bold text-xs hover:bg-white/10 transition-all flex items-center gap-1.5 shadow-sm">
                        {t.preview_gift} <ArrowIcon className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
