/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ArrowRight, Check, CreditCard, Loader2, Sparkles, Globe, 
  Gift, Heart, Star, Flag, GraduationCap, BookOpen, Smile, Users, 
  ShoppingBag, Tv, Copy, Share2, CheckCircle2, ShieldCheck, User, MessageSquare,
  UserCheck, Award, Layers, Compass
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createGiftAction } from "./actions/gift";
import { useLanguage } from "@/context/LanguageContext";
import { arAI, enAI } from "@/dictionaries/aiTemplates";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ParticleField from "@/components/ParticleField";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const occasionsList = [
  { id: "friend", icon: Users, dictKey: "friend" },
  { id: "family", icon: Heart, dictKey: "family" },
  { id: "eid", icon: Star, dictKey: "eid" },
  { id: "birthday", icon: Gift, dictKey: "birthday" },
  { id: "national", icon: Flag, dictKey: "national", badge: "مميز 🇸🇦" },
  { id: "graduation", icon: GraduationCap, dictKey: "graduation" },
  { id: "quran", icon: BookOpen, dictKey: "quran" },
  { id: "kids", icon: Smile, dictKey: "kids" },
];

const categoriesList = [
  { id: "digital", icon: Sparkles, dictKey: "digital" },
  { id: "vouchers", icon: ShoppingBag, dictKey: "vouchers" },
  { id: "subscriptions", icon: Tv, dictKey: "subscriptions" },
];

const genderList = [
  { id: "male", title: "ذكر (شاب / رجل)", icon: User },
  { id: "female", title: "أنثى (فتاة / سيدة)", icon: UserCheck },
];

const ageGroupList = [
  { id: "kids", title: "طفل / طفلة (5 - 12 سنة)" },
  { id: "teen", title: "يافع / يافعة (13 - 18 سنة)" },
  { id: "youth", title: "شاب / شابة (19 - 35 سنة)" },
  { id: "senior", title: "كبار الشخصيات (36+ سنة)" },
];

export default function Home() {
  const router = useRouter();
  const { lang, t, toggleLanguage } = useLanguage();
  const isRtl = lang === "ar";

  const [step, setStep] = useState(1);
  const [selectedOccasion, setSelectedOccasion] = useState(occasionsList[4].id); // Default to National Day
  const [selectedGender, setSelectedGender] = useState(genderList[0].id);
  const [selectedAge, setSelectedAge] = useState(ageGroupList[2].id);
  const [selectedCategory, setSelectedCategory] = useState(categoriesList[1].id);
  
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");

  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success">("idle");
  const [generatedLink, setGeneratedLink] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-fill tailored message when occasion, gender, or age changes
  useEffect(() => {
    if (!message) {
      const templates = isRtl ? arAI : enAI;
      const occasionTemplates = templates[selectedOccasion as keyof typeof templates] || templates.friend;
      setMessage(occasionTemplates[0]);
    }
  }, [selectedOccasion, selectedGender, selectedAge, lang, isRtl]);

  const handleNext = () => {
    if (step === 2 && (!senderName || !recipientName)) {
      alert(lang === "ar" ? "يرجى كتابة اسم المرسل والمستلم أولاً" : "Please fill in sender and recipient names first");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleGenerateAI = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setIsGeneratingMessage(true);
    setMessage("");
    
    const templates = isRtl ? arAI : enAI;
    const occasionTemplates = templates[selectedOccasion as keyof typeof templates] || templates.friend;
    const randomMessage = occasionTemplates[Math.floor(Math.random() * occasionTemplates.length)];
    
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
      }, 20);
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleCheckout = async () => {
    setStep(3);
    setPaymentState("processing");
    
    const fallbackId = Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
      const res = await createGiftAction({
        senderName: senderName || "مُهدِي سعيد",
        recipientName: recipientName || "صديق عزيز",
        message: message || "أتمنى لك يوماً استثنائياً مليئاً بالبهجة والسرور والنجاح الدائم!",
        amount: selectedCategory === "digital" ? 0 : 50,
        occasion: selectedOccasion,
        gender: selectedGender,
        ageGroup: selectedAge
      });

      const giftIdToUse = (res && res.success && res.giftId) ? res.giftId : fallbackId;
      setGeneratedLink(giftIdToUse);
      const fullUrl = `${window.location.origin}/gift/${giftIdToUse}?occ=${selectedOccasion}&gender=${selectedGender}&age=${selectedAge}`;
      setShareUrl(fullUrl);
      setPaymentState("success");
    } catch {
      setGeneratedLink(fallbackId);
      setShareUrl(`${window.location.origin}/gift/${fallbackId}?occ=${selectedOccasion}&gender=${selectedGender}&age=${selectedAge}`);
      setPaymentState("success");
    }
  };

  const slideVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const BackArrowIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden text-[#fcfbf8]">
      {/* Premium Particles Background */}
      <ParticleField />

      {/* Navigation Header */}
      <header className="w-full py-6 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto relative z-20">
        <div className="flex items-center gap-3 select-none">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#ecc573] via-[#fc7164] to-[#5526e0] flex items-center justify-center text-stone-950 shadow-[0_0_20px_rgba(236,197,115,0.3)] font-black text-2xl">
            U
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-tight text-white leading-none">Up2U<span className="text-[#ecc573]">Gift</span></span>
            <span className="text-[10px] text-stone-400 font-medium tracking-widest uppercase mt-1">Luxury Digital Gifting</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage} 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-[#ecc573]/20 hover:border-[#ecc573]/40 transition-all text-xs font-bold text-[#ecc573] cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === "ar" ? "English" : "العربية"}
          </button>
          <Link href="/admin/login" className="text-xs font-semibold text-stone-400 hover:text-[#ecc573] transition">
            {t.login}
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 pt-4">
        
        {/* Luxury Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecc573]/10 border border-[#ecc573]/25 mb-4 backdrop-blur-md shadow-[0_0_20px_rgba(236,197,115,0.1)]">
            <Sparkles className="w-4 h-4 text-[#ecc573]" />
            <span className="text-xs font-semibold text-[#ecc573] tracking-widest uppercase">{t.hero_badge}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.15] tracking-tight mb-4">
            {t.hero_title_1} <br/>
            <span className="luxury-gradient-text">{t.hero_title_2}</span>
          </h1>
          
          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto font-normal leading-relaxed">
            {t.hero_desc}
          </p>
        </motion.div>

        {/* Stepper Card */}
        <div className="w-full glass-panel p-6 sm:p-10 relative overflow-hidden shadow-[0_0_60px_rgba(31,10,82,0.5)]">
          
          {/* Subtle Top Gradient Bar */}
          <div className="absolute top-0 left-0 w-full h-[3.5px] bg-gradient-to-r from-[#5526e0] via-[#fc7164] to-[#ecc573]"></div>

          {/* Stepper Progress Header */}
          <div className="w-full flex justify-between items-center mb-10 relative max-w-md mx-auto">
            <div className="absolute left-0 right-0 h-[2px] bg-white/10 top-1/2 -translate-y-1/2 -z-10 rounded-full"></div>
            <div 
              className={cn(
                "absolute h-[2.5px] bg-gradient-to-r from-[#ecc573] via-[#fc7164] to-[#5526e0] top-1/2 -translate-y-1/2 -z-10 rounded-full transition-all duration-500 ease-out",
                isRtl ? "right-0" : "left-0"
              )}
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
            
            {[1, 2, 3].map((num) => (
              <div 
                key={num} 
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-xs transition-all duration-300 border",
                  step >= num 
                    ? "bg-gradient-to-r from-[#ecc573] to-[#dfb256] text-stone-950 border-transparent shadow-[0_0_15px_rgba(236,197,115,0.4)] font-extrabold" 
                    : "bg-stone-900/60 text-stone-400 border-white/10 font-medium"
                )}
              >
                {step > num ? <Check className="w-4 h-4 stroke-[3]" /> : num}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            
            {/* STEP 1: Occasions & Smart Customizer */}
            {step === 1 && (
              <motion.div key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                
                {/* Occasion Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Compass className="w-4 h-4 text-[#ecc573]" />
                    <h2 className="text-lg font-bold text-white">{t.step_1_title}</h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {occasionsList.map((occ) => {
                       const IconComponent = occ.icon;
                       const isSelected = selectedOccasion === occ.id;
                       return (
                         <button
                           key={occ.id}
                           onClick={() => setSelectedOccasion(occ.id)}
                           className={cn(
                             "occasion-card p-4 rounded-2xl text-center cursor-pointer flex flex-col items-center justify-center relative transition-all duration-300",
                             isSelected 
                               ? "bg-white/10 border-[#ecc573] shadow-[0_0_20px_rgba(236,197,115,0.2)] scale-[1.02]" 
                               : "border-white/5 hover:border-white/20"
                           )}
                         >
                           <div className={cn(
                             "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors",
                             isSelected ? "bg-[#ecc573]/20 text-[#ecc573]" : "bg-white/5 text-stone-400"
                           )}>
                             <IconComponent className="w-6 h-6" strokeWidth={1.5} />
                           </div>
                           <span className={cn("text-xs transition-colors", isSelected ? "text-white font-bold" : "text-stone-300 font-normal")}>
                             {t.occasions[occ.dictKey as keyof typeof t.occasions]}
                           </span>
                           {isSelected && (
                             <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#fc7164] shadow-[0_0_8px_#fc7164]"></span>
                           )}
                         </button>
                       );
                    })}
                  </div>
                </div>

                {/* Smart Demographic Customizer (Gender & Age Group) */}
                <div className="p-5 rounded-2xl bg-white/5 border border-[#ecc573]/20 space-y-4">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#ecc573]" />
                    <h3 className="text-sm font-bold text-white">تخصيص الفئة المستهدفة للهدية (الذكاء التفاعلي)</h3>
                  </div>

                  {/* Gender Selection */}
                  <div>
                    <label className="text-xs text-stone-300 font-medium block mb-2">الجنس:</label>
                    <div className="grid grid-cols-2 gap-3">
                      {genderList.map((g) => {
                        const IconComponent = g.icon;
                        const isSelected = selectedGender === g.id;
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => setSelectedGender(g.id)}
                            className={cn(
                              "p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer",
                              isSelected 
                                ? "bg-[#ecc573]/20 border-[#ecc573] text-[#ecc573] shadow-md" 
                                : "bg-black/30 border-white/10 text-stone-300 hover:border-white/20"
                            )}
                          >
                            <IconComponent className="w-4 h-4" />
                            <span>{g.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Age Selection */}
                  <div>
                    <label className="text-xs text-stone-300 font-medium block mb-2">الفئة العمرية:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {ageGroupList.map((a) => {
                        const isSelected = selectedAge === a.id;
                        return (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => setSelectedAge(a.id)}
                            className={cn(
                              "p-3 rounded-xl border text-[11px] font-semibold text-center transition-all cursor-pointer",
                              isSelected 
                                ? "bg-[#ecc573]/20 border-[#ecc573] text-[#ecc573] shadow-md" 
                                : "bg-black/30 border-white/10 text-stone-300 hover:border-white/20"
                            )}
                          >
                            <span>{a.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Gift className="w-4 h-4 text-[#ecc573]" />
                    <h2 className="text-lg font-bold text-white">{t.step_2_title}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categoriesList.map((cat) => {
                       const IconComponent = cat.icon;
                       const isSelected = selectedCategory === cat.id;
                       const catDict = t.categories[cat.dictKey as keyof typeof t.categories];
                       return (
                         <button
                           key={cat.id}
                           onClick={() => setSelectedCategory(cat.id)}
                           className={cn(
                             "category-card p-5 rounded-2xl text-start cursor-pointer flex flex-col justify-between relative transition-all duration-300 h-full",
                             isSelected 
                               ? "bg-white/10 border-[#ecc573] shadow-[0_0_20px_rgba(236,197,115,0.2)]" 
                               : "border-white/5 hover:border-white/20"
                           )}
                         >
                           <div className="flex justify-between items-start w-full mb-3">
                             <div className={cn(
                               "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                               isSelected ? "bg-[#ecc573]/20 text-[#ecc573]" : "bg-white/5 text-stone-400"
                             )}>
                               <IconComponent className="w-5 h-5" strokeWidth={1.5} />
                             </div>
                             <span className={cn("text-[11px] px-2.5 py-0.5 rounded-full font-semibold", isSelected ? "bg-[#ecc573]/15 text-[#ecc573] border border-[#ecc573]/30" : "bg-white/5 text-stone-400")}>
                               {catDict.tag}
                             </span>
                           </div>
                           
                           <div className="mt-2 mb-4">
                             <h3 className="font-bold text-base text-white mb-1">{catDict.title}</h3>
                             <p className="text-xs text-stone-300 leading-relaxed font-normal">{catDict.desc}</p>
                           </div>

                           <div className="flex justify-between items-center w-full pt-3 border-t border-white/5 mt-auto">
                             <span className="text-xs font-bold text-[#ecc573]">{catDict.price}</span>
                             <div className={cn("w-5 h-5 rounded-full flex items-center justify-center border transition-all", isSelected ? "bg-[#ecc573] border-transparent text-stone-950" : "border-stone-600 text-transparent")}>
                               <Check className="w-3.5 h-3.5 stroke-[3]" />
                             </div>
                           </div>
                         </button>
                       );
                    })}
                  </div>
                </div>

                {/* Step 1 Controls */}
                <div className="flex justify-end pt-4">
                  <button 
                    onClick={handleNext} 
                    className="px-8 py-3.5 bg-gradient-to-r from-[#ecc573] via-[#dfb256] to-[#ecc573] text-stone-950 rounded-full font-bold text-xs flex items-center gap-2 hover:brightness-110 active:scale-95 hover:shadow-[0_0_25px_rgba(236,197,115,0.4)] transition-all cursor-pointer shadow-lg"
                  >
                    <span>{t.next}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
            )}

            {/* STEP 2: Personalization */}
            {step === 2 && (
              <motion.div key="step2" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{t.personalize_title}</h2>
                  <p className="text-xs text-stone-300 font-normal">{t.personalize_desc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#ecc573]" /> {t.recipient_name}
                    </label>
                    <input 
                      type="text" 
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder={t.recipient_placeholder}
                      className="premium-input p-4 text-xs font-normal"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#ecc573]" /> {t.sender_name}
                    </label>
                    <input 
                      type="text" 
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder={t.sender_placeholder}
                      className="premium-input p-4 text-xs font-normal"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#ecc573]" /> {t.message_title}
                      </label>
                      
                      <button 
                        type="button"
                        onClick={handleGenerateAI}
                        disabled={isGeneratingMessage}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ecc573] hover:text-[#dfb256] transition disabled:opacity-50 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#fc7164]" />
                        <span>{isGeneratingMessage ? (lang === "ar" ? "جاري التفكير..." : "Generating...") : (lang === "ar" ? "اقتراح ذكي بالـ AI" : "AI Smart Suggestion")}</span>
                      </button>
                    </div>
                    
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t.message_placeholder}
                      rows={4}
                      className="premium-input p-4 w-full resize-none text-xs font-normal leading-relaxed"
                    />
                  </div>
                </div>

                {/* Step 2 Controls */}
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <button 
                    onClick={() => setStep(1)} 
                    className="text-stone-400 hover:text-stone-200 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <BackArrowIcon className="w-4 h-4" /> <span>{t.back}</span>
                  </button>

                  <button 
                    onClick={handleCheckout} 
                    className="px-8 py-3.5 bg-gradient-to-r from-[#ecc573] via-[#dfb256] to-[#ecc573] text-stone-950 rounded-full font-bold text-xs flex items-center gap-2 hover:brightness-110 active:scale-95 hover:shadow-[0_0_25px_rgba(236,197,115,0.4)] transition-all cursor-pointer shadow-lg"
                  >
                    <span>{lang === "ar" ? "تأكيد وإنشاء الهدية" : "Confirm & Create Gift"}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Instant Generation & Full Preview */}
            {step === 3 && (
              <motion.div key="step3" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center py-6 text-center">
                
                {paymentState === "processing" && (
                  <div className="flex flex-col items-center py-12">
                    <Loader2 className="w-12 h-12 text-[#ecc573] animate-spin mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">{t.processing_payment}</h3>
                    <p className="text-xs text-stone-300 font-normal">{t.processing_desc}</p>
                  </div>
                )}

                {paymentState === "success" && (
                  <div className="w-full max-w-lg flex flex-col items-center">
                    
                    <div className="w-20 h-20 rounded-full bg-[#ecc573]/15 border border-[#ecc573]/30 flex items-center justify-center mb-6 text-[#ecc573] shadow-[0_0_30px_rgba(236,197,115,0.2)]">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{t.success_title}</h2>
                    <p className="text-xs sm:text-sm text-stone-300 font-normal leading-relaxed max-w-md mb-8">
                      {t.success_desc}
                    </p>
                    
                    {/* Shareable Link Box */}
                    <div className="w-full bg-stone-950/70 border border-[#ecc573]/30 rounded-2xl p-3 flex items-center justify-between gap-3 mb-8 shadow-inner">
                      <input 
                        type="text" 
                        readOnly 
                        value={shareUrl} 
                        className="bg-transparent border-none text-stone-200 w-full outline-none text-xs font-mono px-3 font-medium text-left direction-ltr" 
                        dir="ltr"
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(shareUrl);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }} 
                        className="px-5 py-2.5 bg-[#ecc573]/15 hover:bg-[#ecc573]/25 text-[#ecc573] border border-[#ecc573]/40 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copied ? (lang === "ar" ? "تم النسخ!" : "Copied!") : t.copy_link}</span>
                      </button>
                    </div>

                    {/* Main CTA Actions */}
                    <div className="flex flex-col gap-4 w-full">
                      <Link href={`/gift/${generatedLink}?occ=${selectedOccasion}&gender=${selectedGender}&age=${selectedAge}`} className="w-full">
                        <button className="w-full py-4 bg-gradient-to-r from-[#ecc573] via-[#dfb256] to-[#ecc573] text-stone-950 rounded-2xl font-bold text-sm hover:brightness-110 hover:shadow-[0_0_30px_rgba(236,197,115,0.4)] transition-all flex items-center justify-center gap-2 shadow-xl active:scale-98 cursor-pointer">
                          <Sparkles className="w-4 h-4" />
                          <span>{isRtl ? "استعراض وتجربة الهدية كاملاً" : "Preview & Experience Full Gift"}</span>
                        </button>
                      </Link>

                      <a 
                        href={`https://wa.me/?text=${encodeURIComponent((isRtl ? "وصلتك هدية خاصة! افتح الرابط لتجربتها: " : "You received a special gift! Open to experience: ") + shareUrl)}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full"
                      >
                        <button className="w-full py-3.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98">
                          <Share2 className="w-4 h-4" />
                          <span>{isRtl ? "مشاركة عبر الواتساب" : "Share via WhatsApp"}</span>
                        </button>
                      </a>

                      <button 
                        onClick={() => {
                          setStep(1);
                          setPaymentState("idle");
                        }} 
                        className="mt-2 text-xs text-stone-400 hover:text-white transition font-medium cursor-pointer"
                      >
                        {isRtl ? "اصنع هدية جديدة" : "Create Another Gift"}
                      </button>
                    </div>

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
