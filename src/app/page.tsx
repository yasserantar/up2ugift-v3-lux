"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, Loader2, Apple, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createGiftAction } from "./actions/gift";
import { useLanguage } from "@/context/LanguageContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const occasionsList = [
  { id: "friend", emoji: "💝", dictKey: "friend" },
  { id: "family", emoji: "🏡", dictKey: "family" },
  { id: "eid", emoji: "🌙", dictKey: "eid" },
  { id: "birthday", emoji: "🎂", dictKey: "birthday" },
  { id: "national", emoji: "🇸🇦", dictKey: "national" },
  { id: "graduation", emoji: "🎓", dictKey: "graduation" },
  { id: "quran", emoji: "📖", dictKey: "quran" },
  { id: "kids", emoji: "🧸", dictKey: "kids" },
];

const categoriesList = [
  { id: "digital", emoji: "💌", dictKey: "digital" },
  { id: "vouchers", emoji: "🛍️", dictKey: "vouchers" },
  { id: "subscriptions", emoji: "🍿", dictKey: "subscriptions" },
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

  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success">("idle");
  const [generatedLink, setGeneratedLink] = useState("");

  const handleNext = () => {
    if (step === 2 && (!senderName || !recipientName)) {
      alert(t.recipient_placeholder); // Simple fallback alert
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleCheckout = async () => {
    setPaymentState("processing");
    
    // Simulate payment delay
    setTimeout(async () => {
      const res = await createGiftAction({
        senderName,
        recipientName,
        message,
        amount: selectedCategory === "digital" ? 0 : 50,
      });

      if (res.success) {
        setGeneratedLink(res.giftId);
        setPaymentState("success");
      } else {
        alert("Error occurred");
        setPaymentState("idle");
      }
    }, 1500);
  };

  // Softer bounce animations
  const slideVariants = {
    initial: { opacity: 0, x: isRtl ? 20 : -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isRtl ? -20 : 20 }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="relative min-h-screen">
      <div className="orb-1"></div>
      <div className="orb-2"></div>
      
      {/* Top Navbar */}
      <nav className="relative z-20 w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="text-3xl">🎁</div>
          <span className="font-bold text-xl tracking-wider text-gray-800">UP2UGIFT</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage} 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm hover:shadow-md transition-all text-sm font-bold text-gray-700"
          >
            <Globe className="w-4 h-4 text-pink-400" />
            {lang === "ar" ? "EN" : "عربي"}
          </button>
          <div className="text-sm font-semibold text-gray-500 hover:text-pink-500 transition cursor-pointer">
            <Link href="/admin/login">{t.login}</Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center pt-8 pb-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="text-center w-full mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-200 bg-pink-50 mb-6">
            <span className="text-sm">✨</span>
            <span className="text-sm font-bold tracking-wide text-pink-600">{t.hero_badge}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight text-gray-800 tracking-tight">
            {t.hero_title_1} <br />
            <span className="gradient-text">{t.hero_title_2}</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium mt-4">
            {t.hero_desc}
          </p>
        </motion.div>

        {/* Stepper Form */}
        <div className="w-full relative gift-card p-6 md:p-10 z-20">
          
          {/* Progress Bar */}
          <div className="w-full flex justify-between mb-10 relative px-4">
            <div className="absolute top-1/2 left-4 right-4 h-[4px] bg-gray-100 -z-10 -translate-y-1/2 rounded-full"></div>
            <div 
              className={cn(
                "absolute top-1/2 h-[4px] bg-pink-400 -z-10 -translate-y-1/2 rounded-full transition-all duration-500 ease-out",
                isRtl ? "right-4" : "left-4"
              )} 
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
            
            {[1, 2, 3].map((num) => (
              <div key={num} className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500",
                step >= num ? "bg-pink-500 text-white shadow-lg shadow-pink-200 scale-110" : "bg-white text-gray-400 border-2 border-gray-100"
              )}>
                {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-10">
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.step_1_title}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {occasionsList.map((occ) => {
                      const isSelected = selectedOccasion === occ.id;
                      return (
                        <button
                          key={occ.id}
                          onClick={() => setSelectedOccasion(occ.id)}
                          className={cn(
                            "group flex flex-col items-center justify-center text-center p-4 rounded-[1.5rem] transition-all duration-300 border-2",
                            isSelected 
                              ? "bg-pink-50 border-pink-400 shadow-[0_8px_20px_rgba(255,112,141,0.15)] scale-[1.02]" 
                              : "bg-white border-transparent shadow-sm hover:shadow-md hover:-translate-y-1"
                          )}
                        >
                          <div className="text-4xl mb-3 drop-shadow-sm transition-transform group-hover:scale-110">
                            {occ.emoji}
                          </div>
                          <span className={cn("text-sm font-bold", isSelected ? "text-pink-600" : "text-gray-600")}>
                            {t.occasions[occ.dictKey as keyof typeof t.occasions]}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.step_2_title}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {categoriesList.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      const catDict = t.categories[cat.dictKey as keyof typeof t.categories];
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={cn(
                            "relative text-start p-5 rounded-[1.5rem] transition-all duration-300 border-2 flex flex-col h-full",
                            isSelected 
                              ? "bg-pink-50 border-pink-400 shadow-[0_8px_20px_rgba(255,112,141,0.15)] scale-[1.02]" 
                              : "bg-white border-transparent shadow-sm hover:shadow-md hover:-translate-y-1"
                          )}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-3xl drop-shadow-sm">{cat.emoji}</span>
                            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center transition-all", isSelected ? "bg-pink-500 text-white scale-110" : "bg-gray-100 text-gray-300")}>
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          </div>
                          <div className={cn("font-bold text-lg mb-1", isSelected ? "text-pink-700" : "text-gray-800")}>{catDict.title}</div>
                          <div className="text-sm text-gray-500 mb-4 flex-grow leading-relaxed font-medium">{catDict.desc}</div>
                          <div className={cn("font-bold text-sm px-3 py-1 rounded-full w-fit", isSelected ? "bg-pink-100 text-pink-700" : "bg-gray-100 text-gray-600")}>{catDict.price}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-2 flex justify-end">
                  <button onClick={handleNext} className="bg-gray-900 text-white hover:bg-pink-500 px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-pink-500/30 hover:-translate-y-1">
                    {t.next} <ArrowIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">✍️</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{t.personalize_title}</h2>
                    <p className="text-gray-500 text-sm font-medium">{t.personalize_desc}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">{t.recipient_name}</label>
                    <input 
                      type="text" 
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder={t.recipient_placeholder}
                      className="joy-input p-4 w-full text-base font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">{t.sender_name}</label>
                    <input 
                      type="text" 
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder={t.sender_placeholder}
                      className="joy-input p-4 w-full text-base font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700">{t.message_title}</label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t.message_placeholder}
                      rows={4}
                      className="joy-input p-4 w-full resize-none text-base font-semibold leading-relaxed"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-center border-t border-gray-100 pt-6">
                  <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-800 font-bold flex items-center gap-2 transition-colors">
                    {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />} {t.back}
                  </button>
                  <button onClick={handleNext} className="bg-gray-900 text-white hover:bg-pink-500 px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-pink-500/30 hover:-translate-y-1">
                    {t.continue_payment} <ArrowIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center text-center py-8">
                
                {paymentState === "idle" && (
                  <>
                    <div className="text-5xl mb-4">💳</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.secure_payment}</h2>
                    <p className="text-gray-500 mb-8 max-w-sm font-medium leading-relaxed">{t.secure_payment_desc}</p>
                    
                    <div className="flex flex-col w-full max-w-sm gap-4">
                      <button onClick={handleCheckout} className="w-full py-4 bg-black text-white rounded-[1.5rem] font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg">
                        <Apple className="w-5 h-5" fill="currentColor" /> {t.pay_apple}
                      </button>
                      <button onClick={handleCheckout} className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-[1.5rem] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-pink-200">
                        <CreditCard className="w-5 h-5" />
                        {t.pay_card}
                      </button>
                    </div>
                    <button onClick={() => setStep(2)} className="mt-8 text-gray-400 hover:text-gray-800 transition-colors text-sm font-bold border-b border-transparent hover:border-gray-800 pb-1">{t.back_edit}</button>
                  </>
                )}

                {paymentState === "processing" && (
                  <div className="flex flex-col items-center py-12">
                    <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-6" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t.processing_payment}</h3>
                    <p className="text-gray-500 text-sm font-medium">{t.processing_desc}</p>
                  </div>
                )}

                {paymentState === "success" && (
                  <div className="flex flex-col items-center py-4 w-full">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, -10, 10, 0] }} transition={{ type: "spring", duration: 0.8 }} className="text-7xl mb-6 drop-shadow-xl">
                      🎉
                    </motion.div>
                    <h3 className="text-2xl md:text-3xl font-black text-gray-800 mb-4">{t.success_title}</h3>
                    <p className="text-gray-500 mb-8 max-w-md font-medium leading-relaxed">{t.success_desc}</p>
                    
                    <div className="w-full max-w-md bg-pink-50 border-2 border-pink-100 rounded-2xl p-2 pl-2 md:pl-4 flex items-center justify-between gap-4 mb-8">
                      <input type="text" readOnly value={`https://up2ugift.vercel.app/gift/${generatedLink}`} className="bg-transparent border-none text-gray-600 w-full outline-none text-sm font-mono text-left direction-ltr px-3 font-semibold" dir="ltr" />
                      <button onClick={() => navigator.clipboard.writeText(`https://up2ugift.vercel.app/gift/${generatedLink}`)} className="px-5 py-3 bg-pink-500 text-white rounded-xl text-sm font-bold hover:bg-pink-600 transition-all whitespace-nowrap shadow-md shadow-pink-200">
                        {t.copy_link}
                      </button>
                    </div>

                    <Link href={`/gift/${generatedLink}`}>
                      <button className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
                        {t.preview_gift} <ArrowIcon className="w-4 h-4" />
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
