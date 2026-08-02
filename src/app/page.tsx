"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Gift, Heart, Star, Crown, GraduationCap, Map, Users, ArrowLeft, CheckCircle2, User, FileText, CreditCard, Loader2, ChevronRight, Apple } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createGiftAction } from "./actions/gift";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const occasions = [
  { id: "friend", title: "إلى صديق / صديقة", icon: Users },
  { id: "family", title: "أخت / أم / ابن", icon: Heart },
  { id: "eid", title: "عيد الفطر / الأضحى", icon: Star },
  { id: "birthday", title: "يوم الميلاد", icon: Gift },
  { id: "national", title: "اليوم الوطني", icon: Map },
  { id: "graduation", title: "تخرج / نجاح", icon: GraduationCap },
  { id: "quran", title: "حفظ القرآن", icon: Crown },
  { id: "kids", title: "للأطفال والصغار", icon: Sparkles },
];

const categories = [
  { id: "digital", title: "تجربة رقمية فقط", desc: "التجربة التفاعلية الكاملة للمستلم بدون ملحقات.", price: "مجاناً", tag: "الأساسية" },
  { id: "vouchers", title: "قسيمة شرائية", desc: "أرفق قسيمة شرائية (جرير، نون، اكسترا).", price: "من 50 ريال", tag: "الأكثر طلباً" },
  { id: "subscriptions", title: "اشتراكات رقمية", desc: "يوتيوب بريميوم، شاهد، نتفليكس.", price: "حسب الباقة", tag: "ممتعة" },
];

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  const [selectedOccasion, setSelectedOccasion] = useState(occasions[0].id);
  const [selectedCategory, setSelectedCategory] = useState(categories[1].id);
  
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");

  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success">("idle");
  const [generatedLink, setGeneratedLink] = useState("");

  const handleNext = () => {
    if (step === 2 && (!senderName || !recipientName)) {
      alert("يرجى إدخال اسم المرسل والمستلم");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleCheckout = async () => {
    setPaymentState("processing");
    
    // Simulate payment delay for Lemon Squeezy later
    setTimeout(async () => {
      const res = await createGiftAction({
        senderName,
        recipientName,
        message,
        amount: parseInt(selectedCategory) || 50,
      });

      if (res.success) {
        setGeneratedLink(res.giftId);
        setPaymentState("success");
      } else {
        alert("حدث خطأ أثناء المعالجة");
        setPaymentState("idle");
      }
    }, 1500);
  };

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="relative min-h-screen bg-[#060608] text-[#F4F4F5] overflow-x-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Top Navbar */}
      <nav className="relative z-20 w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-wider text-white">UP2UGIFT</span>
        </div>
        <div className="text-sm font-medium text-gray-400 hover:text-white transition cursor-pointer">
          <Link href="/admin/login" className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all">دخول الأعضاء</Link>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center pt-8 pb-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center w-full mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-semibold tracking-wide text-indigo-300">الجيل الاستثنائي من الهدايا</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white tracking-tight">
            اصنع الانبهار <br />
            <span className="gradient-text">في لحظة الإهداء</span>
          </h1>
        </motion.div>

        {/* Stepper Form */}
        <div className="w-full relative glass-panel p-6 md:p-10 z-20">
          
          {/* Progress Bar */}
          <div className="w-full flex justify-between mb-10 relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -z-10 -translate-y-1/2 rounded-full"></div>
            <div className="absolute top-1/2 right-0 h-[2px] bg-indigo-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
            
            {[1, 2, 3].map((num) => (
              <div key={num} className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500",
                step >= num ? "bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]" : "bg-[#1A1A20] text-gray-500 border border-white/5"
              )}>
                {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-8">
                
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">1. اختر المناسبة</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {occasions.map((occ) => {
                      const Icon = occ.icon;
                      const isSelected = selectedOccasion === occ.id;
                      return (
                        <button
                          key={occ.id}
                          onClick={() => setSelectedOccasion(occ.id)}
                          className={cn(
                            "group flex flex-col items-center justify-center text-center p-5 rounded-2xl transition-all duration-300 border",
                            isSelected 
                              ? "bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]" 
                              : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                          )}
                        >
                          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors", isSelected ? "bg-indigo-500 text-white" : "bg-white/10 text-gray-400 group-hover:text-white")}>
                            <Icon className="w-6 h-6" strokeWidth={1.5} />
                          </div>
                          <span className={cn("text-sm font-medium", isSelected ? "text-indigo-200" : "text-gray-400 group-hover:text-white")}>
                            {occ.title}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">2. الهدية المرفقة</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {categories.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={cn(
                            "relative text-right p-5 rounded-2xl transition-all duration-300 border flex flex-col h-full",
                            isSelected 
                              ? "bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]" 
                              : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                          )}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span className={cn("text-xs px-2 py-1 rounded-md", isSelected ? "bg-indigo-500/20 text-indigo-300" : "bg-white/10 text-gray-400")}>{cat.tag}</span>
                            <div className={cn("w-5 h-5 rounded-full flex items-center justify-center border", isSelected ? "bg-indigo-500 border-indigo-500 text-white" : "border-gray-600 text-transparent")}>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className={cn("font-bold text-lg mb-2", isSelected ? "text-white" : "text-gray-200")}>{cat.title}</div>
                          <div className="text-sm text-gray-500 mb-4 flex-grow leading-relaxed">{cat.desc}</div>
                          <div className={cn("font-semibold text-sm", isSelected ? "text-indigo-400" : "text-gray-500")}>{cat.price}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button onClick={handleNext} className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all">
                    التالي <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-white mb-2">تخصيص الهدية</h2>
                <p className="text-gray-400 text-sm mb-4">اكتب رسالتك القلبية لتظهر للمستلم بشكل مفاجئ في نهاية التجربة.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">اسم المستلم</label>
                    <input 
                      type="text" 
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="لمن هذه الهدية؟"
                      className="glass-input rounded-xl p-4 w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">اسم المرسل</label>
                    <input 
                      type="text" 
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="كيف يظهر اسمك؟"
                      className="glass-input rounded-xl p-4 w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300">رسالتك الشخصية</label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="كلمات صادقة تلامس القلب..."
                      rows={4}
                      className="glass-input rounded-xl p-4 w-full resize-none"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white px-6 py-3 font-medium flex items-center gap-2 transition-all">
                    <ChevronRight className="w-4 h-4" /> رجوع
                  </button>
                  <button onClick={handleNext} className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    متابعة الدفع <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center text-center py-8">
                
                {paymentState === "idle" && (
                  <>
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                      <CreditCard className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">الدفع الآمن</h2>
                    <p className="text-gray-400 mb-10 max-w-sm">سيتم خصم المبلغ وإصدار رابط الهدية التفاعلي فوراً بطريقة آمنة ومشفرة.</p>
                    
                    <div className="flex flex-col w-full max-w-sm gap-4">
                      <button onClick={handleCheckout} className="w-full py-4 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                        <Apple className="w-5 h-5" fill="currentColor" /> Pay
                      </button>
                      <button onClick={handleCheckout} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors">
                        <CreditCard className="w-5 h-5" />
                        البطاقة الائتمانية / مدى
                      </button>
                    </div>
                    <button onClick={() => setStep(2)} className="mt-8 text-gray-500 hover:text-white transition-colors text-sm font-medium">رجوع للتعديل</button>
                  </>
                )}

                {paymentState === "processing" && (
                  <div className="flex flex-col items-center py-12">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">جاري تأكيد الدفع...</h3>
                    <p className="text-gray-400 text-sm">نرجو عدم إغلاق الصفحة</p>
                  </div>
                )}

                {paymentState === "success" && (
                  <div className="flex flex-col items-center py-8 w-full">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">تم الدفع بنجاح!</h3>
                    <p className="text-gray-400 mb-8 max-w-md">أصبحت هديتك الرقمية المذهلة جاهزة الآن. قم بنسخ الرابط السري وأرسله فوراً.</p>
                    
                    <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-2xl p-2 pl-4 flex items-center justify-between gap-4 mb-10">
                      <input type="text" readOnly value={`https://up2ugift.vercel.app/gift/${generatedLink}`} className="bg-transparent border-none text-gray-300 w-full outline-none text-sm font-mono text-left direction-ltr" dir="ltr" />
                      <button onClick={() => navigator.clipboard.writeText(`https://up2ugift.vercel.app/gift/${generatedLink}`)} className="px-5 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-gray-200 transition-all whitespace-nowrap">
                        نسخ
                      </button>
                    </div>

                    <Link href={`/gift/${generatedLink}`}>
                      <button className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-full font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
                        معاينة الهدية <ArrowLeft className="w-4 h-4" />
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
