"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Gift, Heart, Star, Crown, GraduationCap, Map, Users, ArrowLeft, CheckCircle2, User, FileText, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const occasions = [
  { id: "friend", title: "إلى صديق / صديقة", icon: Users },
  { id: "family", title: "أخت / أم / ابن", icon: Heart },
  { id: "eid", title: "عيد الفطر / الأضحى", icon: Star },
  { id: "birthday", title: "يوم الميلاد", icon: Gift },
  { id: "national", title: "اليوم الوطني / التأسيس", icon: Map },
  { id: "graduation", title: "تخرج / انتهاء مرحلة", icon: GraduationCap },
  { id: "quran", title: "حفظ القرآن الكريم", icon: Crown },
  { id: "kids", title: "للأطفال والصغار", icon: Sparkles },
  { id: "custom", title: "على كيفك (تصميم مخصص)", icon: CheckCircle2 },
];

const categories = [
  { id: "digital", title: "الهدية الرقمية فقط", desc: "التجربة التفاعلية الكاملة كهدية مستقلة بدون ملحقات.", price: "مجاناً", tag: "الأساسية" },
  { id: "vouchers", title: "إرفاق قسيمة شرائية", desc: "جرير، نون، اكسترا ومراكز التسوق المعتمدة.", price: "من 50 ريال", tag: "الأكثر طلباً" },
  { id: "subscriptions", title: "اشتراكات رقمية", desc: "باقات رقمية كـ يوتيوب بريميوم، شاهد، ونتفليكس.", price: "حسب الباقة", tag: "ممتعة" },
  { id: "charity", title: "إهداء أجر وأثر", desc: "تبرع خيري رسمي عبر منصة إحسان مع شهادة موثقة.", price: "من 10 ريال", tag: "مستدامة" },
  { id: "courses", title: "اشتراك وتطوير", desc: "اشتراكات في منصات عالمية (كورسيرا، يوديمي، الخ).", price: "حسب الدورة", tag: "مفيدة" },
];

export default function Home() {
  const router = useRouter();
  const [selectedOccasion, setSelectedOccasion] = useState(occasions[0].id);
  const [selectedCategory, setSelectedCategory] = useState(categories[1].id);
  
  // Customization State
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");

  // Payment State
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success">("idle");
  const [generatedLink, setGeneratedLink] = useState("");

  const handleCheckout = () => {
    if (!senderName || !recipientName) {
      alert("يرجى إدخال اسم المرسل والمستلم");
      return;
    }
    
    setPaymentState("processing");
    
    // Simulate real API payment delay
    setTimeout(() => {
      setPaymentState("success");
      
      const params = new URLSearchParams({
        template: selectedOccasion,
        category: selectedCategory,
        sender: senderName,
        recipient: recipientName,
        msg: message
      });
      
      setGeneratedLink(`/gift/preview?${params.toString()}`);
    }, 2500);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E0E0E0] overflow-x-hidden">
      
      {/* Luxury Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#B38728] opacity-[0.03] blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FCF6BA] opacity-[0.02] blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>
      </div>

      {/* Top Navbar */}
      <nav className="relative z-20 w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Gift className="w-6 h-6 text-[#BF953F]" />
          <span className="font-bold text-xl tracking-wider text-white">UP2U<span className="text-[#BF953F]">GIFT</span></span>
        </div>
        <div className="text-sm font-medium text-gray-400 hover:text-white transition cursor-pointer">
          دخول الأعضاء
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center pt-10 pb-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center w-full mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#BF953F]/30 bg-[#BF953F]/10 mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#BF953F]" />
            <span className="text-xs font-semibold tracking-widest text-[#FCF6BA] uppercase">الجيل الاستثنائي من الهدايا</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.2] text-white">
            اصنع الانبهار <br />
            <span className="luxury-gradient-text">في لحظة الإهداء</span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
            صمم تجربة هديتك الرقمية خطوة بخطوة. ادفع بأمان، وشارك رابط التجربة التفاعلية المذهلة مع من تحب.
          </p>
        </motion.div>

        <div className="w-full flex flex-col gap-12 max-w-5xl">
          
          {/* Step 1: Occasions */}
          <motion.div className="w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#BF953F]/50 text-[#BF953F] font-bold text-lg shadow-[0_0_15px_rgba(191,149,63,0.2)]">1</div>
              <h2 className="text-2xl font-bold text-white">اختر القالب الرقمي والمناسبة</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {occasions.map((occ) => {
                const Icon = occ.icon;
                const isSelected = selectedOccasion === occ.id;
                return (
                  <button
                    key={occ.id}
                    onClick={() => setSelectedOccasion(occ.id)}
                    className={`group relative flex flex-col items-center justify-center text-center p-6 rounded-2xl transition-all duration-500 glass-card-dark ${
                      isSelected ? "border-[#BF953F]/50 shadow-[0_0_30px_rgba(191,149,63,0.15)] scale-[1.02]" : "border-white/5 hover:border-white/20 hover:scale-[1.02]"
                    }`}
                  >
                    {isSelected && <div className="absolute inset-0 bg-gradient-to-br from-[#BF953F]/10 to-transparent rounded-2xl" />}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 ${
                      isSelected ? "scale-110 bg-[#BF953F]/20 text-[#FCF6BA]" : "bg-white/5 text-gray-400 group-hover:text-white"
                    }`}>
                      <Icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <span className={`text-sm font-semibold transition-colors duration-300 ${isSelected ? "text-[#FCF6BA]" : "text-gray-400 group-hover:text-white"}`}>
                      {occ.title}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Step 2: Categories */}
          <motion.div className="w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#BF953F]/50 text-[#BF953F] font-bold text-lg shadow-[0_0_15px_rgba(191,149,63,0.2)]">2</div>
              <h2 className="text-2xl font-bold text-white">اختر الهدية العينية المرفقة</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`relative w-full p-6 rounded-2xl flex flex-col text-right transition-all duration-400 glass-card-dark ${
                      isSelected ? "border-[#BF953F]/50 shadow-[0_0_30px_rgba(191,149,63,0.1)]" : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex justify-between items-start w-full mb-4">
                      <div className={`text-xs px-2 py-1 rounded border ${isSelected ? "border-[#BF953F]/50 text-[#BF953F] bg-[#BF953F]/10" : "border-gray-700 text-gray-500"}`}>{cat.tag}</div>
                      <div className={`flex items-center justify-center w-5 h-5 rounded-full transition-colors ${isSelected ? "bg-[#BF953F] text-[#050505]" : "border border-gray-600 text-transparent"}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className={`font-bold text-lg mb-2 transition-colors ${isSelected ? "text-white" : "text-gray-300"}`}>{cat.title}</div>
                    <div className="text-sm text-gray-500 leading-relaxed mb-4 flex-grow">{cat.desc}</div>
                    <div className={`text-sm font-semibold mt-auto ${isSelected ? "text-[#BF953F]" : "text-gray-600"}`}>{cat.price}</div>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Step 3: Customization */}
          <motion.div className="w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#BF953F]/50 text-[#BF953F] font-bold text-lg shadow-[0_0_15px_rgba(191,149,63,0.2)]">3</div>
              <h2 className="text-2xl font-bold text-white">تخصيص التجربة</h2>
            </div>
            
            <div className="glass-card-dark p-8 rounded-3xl border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 text-sm font-medium flex items-center gap-2"><User className="w-4 h-4"/> اسم المستلم</label>
                <input 
                  type="text" 
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="مثال: أحمد، سارة..."
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#BF953F]/50 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 text-sm font-medium flex items-center gap-2"><User className="w-4 h-4"/> اسم المرسل</label>
                <input 
                  type="text" 
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="كيف تحب أن يظهر اسمك؟"
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#BF953F]/50 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-gray-400 text-sm font-medium flex items-center gap-2"><FileText className="w-4 h-4"/> الرسالة الشخصية</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب رسالتك القلبية التي ستظهر في نهاية التجربة التفاعلية..."
                  rows={3}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#BF953F]/50 focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Step 4: Checkout */}
          <motion.div className="w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#BF953F]/50 text-[#BF953F] font-bold text-lg shadow-[0_0_15px_rgba(191,149,63,0.2)]">4</div>
              <h2 className="text-2xl font-bold text-white">الدفع واعتماد الطلب</h2>
            </div>
            
            <div className="glass-card-dark p-8 rounded-3xl border border-white/5 text-center">
              {paymentState === "idle" && (
                <div className="flex flex-col items-center">
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">عند الضغط على الدفع، سيتم الخصم بشكل فوري وإصدار القسيمة الحقيقية وتوليد الرابط التفاعلي لترسله فوراً.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <button onClick={handleCheckout} className="px-8 py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors w-full sm:w-auto">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/2560px-Apple_Pay_logo.svg.png" className="h-5" alt="Apple Pay" />
                    </button>
                    <button onClick={handleCheckout} className="px-8 py-4 bg-gradient-to-r from-[#B38728] to-[#AA771C] text-[#050505] font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity w-full sm:w-auto">
                      <CreditCard className="w-5 h-5" />
                      البطاقة الائتمانية / مدى
                    </button>
                  </div>
                </div>
              )}

              {paymentState === "processing" && (
                <div className="flex flex-col items-center py-8">
                  <Loader2 className="w-12 h-12 text-[#BF953F] animate-spin mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">جاري معالجة الدفع...</h3>
                  <p className="text-gray-400">يرجى الانتظار بينما نقوم بإصدار القسيمة الحقيقية</p>
                </div>
              )}

              {paymentState === "success" && (
                <div className="flex flex-col items-center py-4">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">تم الدفع بنجاح!</h3>
                  <p className="text-gray-400 mb-8 max-w-md">تم إصدار هديتك التفاعلية. قم بنسخ الرابط التالي وإرساله للمستلم ليستمتع بالرحلة.</p>
                  
                  <div className="w-full max-w-lg bg-black/50 border border-white/10 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center gap-4">
                    <input type="text" readOnly value={`https://up2ugift-v2.vercel.app${generatedLink}`} className="bg-transparent border-none text-gray-300 w-full outline-none text-sm font-mono text-left direction-ltr" dir="ltr" />
                    <button onClick={() => navigator.clipboard.writeText(`https://up2ugift-v2.vercel.app${generatedLink}`)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                      نسخ الرابط
                    </button>
                  </div>

                  <Link href={generatedLink}>
                    <button className="px-10 py-4 bg-gradient-to-r from-[#B38728] via-[#BF953F] to-[#AA771C] text-[#050505] font-bold text-lg rounded-full shadow-[0_15px_40px_rgba(191,149,63,0.25)] hover:scale-105 transition-all duration-300 flex items-center gap-3">
                      استعراض وتجربة الهدية <ArrowLeft className="w-5 h-5" />
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
