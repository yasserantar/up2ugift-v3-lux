"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, Heart, Crown, ArrowRight, Award, Moon, GraduationCap, MapPin, BookOpen, Star, Sparkles as MagicIcon, CheckCircle2, Lock, Unlock, Fingerprint } from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";

// --- Mock API for Vouchers --- //
const getRandomVoucher = () => {
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + 12);
  const formattedExpiry = expiryDate.toLocaleDateString('en-GB');

  const generateCode = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const generatePin = () => Math.floor(1000 + Math.random() * 9000).toString();

  const vouchers = [
    { title: "بطاقة هدايا جرير", subtitle: "بقيمة 500 ريال", code: generateCode('JAR'), pin: generatePin(), expiry: formattedExpiry, brand: "جرير", color: "bg-[#E30613]", border: "border-[#E30613]" },
    { title: "بطاقة هدايا جرير", subtitle: "بقيمة 200 ريال", code: generateCode('JAR'), pin: generatePin(), expiry: formattedExpiry, brand: "جرير", color: "bg-[#E30613]", border: "border-[#E30613]" },
    { title: "قسيمة إلكترونية اكسترا", subtitle: "بقيمة 1000 ريال", code: generateCode('EXT'), pin: generatePin(), expiry: formattedExpiry, brand: "اكسترا", color: "bg-[#00529B]", border: "border-[#00529B]" },
    { title: "بطاقة هدايا ساكو", subtitle: "بقيمة 300 ريال", code: generateCode('SAC'), pin: generatePin(), expiry: formattedExpiry, brand: "ساكو", color: "bg-[#E85C24]", border: "border-[#E85C24]" },
    { title: "قسيمة عطور عبدالصمد القرشي", subtitle: "بقيمة 750 ريال", code: generateCode('ASQ'), pin: generatePin(), expiry: formattedExpiry, brand: "عبدالصمد القرشي", color: "bg-[#1E1E1E]", border: "border-[#1E1E1E]" },
    { title: "بطاقة هدايا نون", subtitle: "بقيمة 500 ريال", code: generateCode('NOON'), pin: generatePin(), expiry: formattedExpiry, brand: "نون", color: "bg-[#FEE000]", text: "text-black", border: "border-[#FEE000]" },
  ];
  return vouchers[Math.floor(Math.random() * vouchers.length)];
};

const getGiftDetails = (category: string) => {
  switch (category) {
    case "digital":
      return { type: "digital", title: "لا توجد هدية عينية", subtitle: "التجربة الرقمية هي الهدية", code: "", pin: "", expiry: "", brand: "", color: "", border: "" };
    case "vouchers":
      const v = getRandomVoucher();
      return { type: "voucher", title: v.title, subtitle: v.subtitle, code: v.code, pin: v.pin, expiry: v.expiry, brand: v.brand, color: v.color, text: v.text || "text-white", border: v.border };
    case "subscriptions":
      return { type: "subscription", title: "باقة اشتراك رقمي", subtitle: "يوتيوب بريميوم لمدة سنة كاملة", code: "YTP-12M-" + Math.floor(1000 + Math.random() * 9000), pin: "", expiry: "يفعل فوراً", brand: "YouTube Premium", color: "bg-red-500", text: "text-white", border: "border-red-500" };
    case "charity":
      return { type: "charity", title: "شهادة تبرع", subtitle: "عن طريق منصة إحسان بقيمة 100 ريال", code: "EHS-" + Math.floor(100000 + Math.random() * 900000), pin: "", expiry: "مدى الحياة", brand: "إحسان", color: "bg-emerald-600", text: "text-white", border: "border-emerald-600" };
    case "courses":
      return { type: "course", title: "اشتراك كورس", subtitle: "دورة متقدمة في مجالك", code: "UDEMY-" + Math.floor(1000 + Math.random() * 9000), pin: "", expiry: "صلاحية 6 أشهر للتفعيل", brand: "Udemy", color: "bg-purple-600", text: "text-white", border: "border-purple-600" };
    default:
      const def = getRandomVoucher();
      return { type: "voucher", title: def.title, subtitle: def.subtitle, code: def.code, pin: def.pin, expiry: def.expiry, brand: def.brand, color: def.color, text: def.text || "text-white", border: def.border };
  }
};

// --- Shared Gift Reveal Component --- //
const GiftReveal = ({ gift, msg }: { gift: any, msg: string }) => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, type: "spring" }} className="z-10 flex flex-col items-center text-center w-full max-w-md">
      {msg && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="w-full bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 mb-8 shadow-2xl relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#BF953F] rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <p className="text-white text-xl leading-relaxed italic font-light font-serif">"{msg}"</p>
        </motion.div>
      )}

      {gift.type === "digital" ? (
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-[#BF953F]/10 rounded-full flex items-center justify-center mb-6 border border-[#BF953F]/30">
            <Sparkles className="w-12 h-12 text-[#BF953F]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">تمت قراءة الرسالة</h2>
          <p className="text-gray-400 text-lg">الكلمات الصادقة هي أغلى هدية.</p>
        </div>
      ) : (
        <>
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="w-20 h-20 bg-[#BF953F]/10 rounded-full flex items-center justify-center mb-6 border border-[#BF953F]/30 shadow-[0_0_50px_rgba(191,149,63,0.2)]">
            <Gift className="w-8 h-8 text-[#BF953F]" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">ومع هذه الكلمات..</h2>
          <p className="text-gray-400 mb-8 text-lg">لديك {gift.title} <span className="text-white font-medium">{gift.subtitle}</span></p>
          
          <div className={`w-full bg-[#FAFAFA] p-2 rounded-2xl shadow-2xl relative overflow-hidden text-gray-900 border-4 ${gift.border}`}>
            <div className={`absolute -right-6 -top-6 w-24 h-24 ${gift.color} rotate-45 flex items-end justify-center pb-2 shadow-lg z-10`}>
              <span className={`${gift.text || "text-white"} text-sm font-bold -rotate-45`}>{gift.brand}</span>
            </div>
            <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center bg-white relative">
              <div className="text-gray-500 text-sm mb-2 font-medium uppercase tracking-widest">رقم القسيمة / الكود</div>
              <div className="text-2xl md:text-3xl font-mono font-bold text-gray-900 tracking-wider bg-gray-100 py-3 px-4 rounded-lg inline-block border border-gray-200 mb-4">{gift.code}</div>
              
              {gift.pin && (
                <div className="flex justify-center gap-4 text-sm font-mono mt-2 mb-2">
                  <div className="bg-gray-100 px-3 py-1 rounded border border-gray-200 text-gray-700">
                    <span className="text-gray-400 mr-2">PIN:</span>{gift.pin}
                  </div>
                </div>
              )}
              {gift.expiry && (
                 <div className="text-xs text-gray-400 mt-2">
                   صالح حتى: <span className="font-semibold text-gray-500">{gift.expiry}</span>
                 </div>
              )}
            </div>
          </div>
        </>
      )}

      <Link href="/" className="mt-12 text-gray-500 hover:text-white transition-colors flex items-center gap-2">
        اصنع هديتك الخاصة <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
};

// --- Interactive Template 1: Friend/Family (The Vault) --- //
const FriendTemplate = ({ gift, sender, recipient, msg, triggerConfetti }: any) => {
  const [step, setStep] = useState(0);
  const [taps, setTaps] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#BF953F]/10 via-[#050505] to-[#050505]" />
      
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.2 }} className="z-10 text-center">
            <Lock className="w-20 h-20 text-[#BF953F] mx-auto mb-8 opacity-50" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 luxury-gradient-text">مرحباً {recipient}</h1>
            <p className="text-xl text-gray-400 mb-10">هناك رسالة مشفرة وصلت إليك من {sender}</p>
            <button onClick={() => setStep(1)} className="px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full font-bold backdrop-blur-md transition-all">فك التشفير الآن</button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-10 text-center flex flex-col items-center">
            <Unlock className="w-20 h-20 text-[#BF953F] mx-auto mb-8" />
            <h2 className="text-3xl font-bold mb-6 text-white">الرسالة محمية برمز الأصدقاء</h2>
            <p className="text-gray-400 mb-8">اضغط على القفل 3 مرات لكسر الختم</p>
            <button 
              onClick={() => {
                setTaps(taps + 1);
                if (taps + 1 >= 3) {
                  triggerConfetti();
                  setStep(2);
                }
              }} 
              className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all ${taps === 0 ? 'border-[#BF953F] bg-[#BF953F]/10' : taps === 1 ? 'border-yellow-500 bg-yellow-500/20 scale-110' : 'border-green-500 bg-green-500/30 scale-125'}`}
            >
              <Fingerprint className={`w-16 h-16 ${taps > 0 ? 'text-white' : 'text-[#BF953F]'}`} />
            </button>
            <div className="mt-8 flex gap-2">
              {[0,1,2].map(i => <div key={i} className={`w-3 h-3 rounded-full ${i < taps ? 'bg-[#BF953F]' : 'bg-white/20'}`} />)}
            </div>
          </motion.div>
        )}

        {step === 2 && <GiftReveal gift={gift} msg={msg} />}
      </AnimatePresence>
    </div>
  );
};

// --- Interactive Template 2: Kids (The Treasure Chest) --- //
const KidsTemplate = ({ gift, sender, recipient, msg, triggerConfetti }: any) => {
  const [step, setStep] = useState(0);
  const [scratched, setScratched] = useState(false);

  return (
    <div className="min-h-screen bg-blue-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="0" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ scale: 0 }} className="z-10 text-center">
            <Crown className="w-24 h-24 text-yellow-400 mx-auto mb-6 animate-bounce" />
            <h1 className="text-5xl font-black mb-4 text-yellow-400 drop-shadow-md">أهلاً بالبطل {recipient}!</h1>
            <p className="text-2xl mb-8 font-bold text-blue-200">صديقك {sender} أرسل لك كنزاً سرياً 🏴‍☠️</p>
            <button onClick={() => setStep(1)} className="px-12 py-4 bg-red-600 hover:bg-red-500 rounded-full font-black text-2xl border-4 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] transition-transform hover:scale-110">ابحث عن الكنز</button>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-10 max-w-md bg-white/10 p-8 rounded-3xl border-4 border-yellow-400 backdrop-blur-md text-center">
            <h2 className="text-3xl font-black mb-6 text-yellow-400">صندوق الكنز مغلق!</h2>
            <p className="text-lg leading-relaxed mb-8">استخدم المفتاح السحري لفتح الصندوق الآن!</p>
            <div className="relative w-full h-40 bg-blue-900 rounded-2xl flex items-center justify-center border-4 border-dashed border-blue-700 cursor-pointer hover:bg-blue-800 transition-colors"
                 onMouseEnter={() => setScratched(true)}
                 onClick={() => { if(scratched) { triggerConfetti(); setStep(2); } }}>
              {!scratched ? (
                <span className="text-blue-300 font-bold text-xl">مرر إصبعك هنا (أو الماوس)</span>
              ) : (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                  <div className="text-4xl mb-2">🗝️</div>
                  <button className="px-6 py-2 bg-yellow-400 text-blue-900 font-black rounded-full">افتح الصندوق!</button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
        {step === 2 && <GiftReveal gift={gift} msg={msg} />}
      </AnimatePresence>
    </div>
  );
};

// --- Interactive Template 3: Quran / Graduation / Success (The Journey) --- //
const JourneyTemplate = ({ gift, sender, recipient, msg, triggerConfetti }: any) => {
  const [step, setStep] = useState(0);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-100 via-slate-50 to-slate-50" />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="0" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ y: -100, opacity: 0 }} className="z-10 text-center">
            <Award className="w-24 h-24 text-amber-500 mx-auto mb-6" />
            <h1 className="text-5xl font-black mb-4 text-slate-800 tracking-tight">إنجاز عظيم يا {recipient}</h1>
            <p className="text-xl text-slate-600 mb-10">من القلب، يهنئك {sender} على هذا التفوق</p>
            <button onClick={() => setStep(1)} className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 shadow-xl">ابدأ الاحتفال</button>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="1" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="z-10 max-w-lg bg-white p-10 rounded-3xl shadow-2xl text-center border-t-8 border-amber-500 w-full">
            <h2 className="text-2xl font-bold mb-8 text-slate-800">رحلة النجاح تكتمل بك</h2>
            <div className="flex flex-col gap-4 relative">
              <div className="absolute left-6 top-4 bottom-4 w-1 bg-amber-200 rounded-full z-0"></div>
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-4 z-10 bg-white p-2">
                <div className="w-12 h-12 rounded-full bg-amber-100 border-4 border-white flex items-center justify-center text-amber-600 font-bold">1</div>
                <div className="text-left font-bold text-slate-700">البدايات الصعبة والطموح</div>
              </motion.div>
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center gap-4 z-10 bg-white p-2">
                <div className="w-12 h-12 rounded-full bg-amber-300 border-4 border-white flex items-center justify-center text-amber-700 font-bold">2</div>
                <div className="text-left font-bold text-slate-700">الاستمرار رغم التحديات</div>
              </motion.div>
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.4 }} className="flex items-center gap-4 z-10 bg-white p-2">
                <div className="w-12 h-12 rounded-full bg-amber-500 border-4 border-white flex items-center justify-center text-white font-bold">3</div>
                <div className="text-left font-bold text-slate-800">اليوم.. يوم التتويج!</div>
              </motion.div>
            </div>
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} onClick={() => { triggerConfetti(); setStep(2); }} className="mt-8 px-10 py-4 bg-amber-500 text-white rounded-xl font-bold w-full hover:bg-amber-600">اكتشف هديتك</motion.button>
          </motion.div>
        )}
        {step === 2 && <GiftReveal gift={gift} msg={msg} />}
      </AnimatePresence>
    </div>
  );
};

// --- Interactive Template 4: Custom / AI (The Scan) --- //
const CustomTemplate = ({ gift, sender, recipient, msg, triggerConfetti }: any) => {
  const [step, setStep] = useState(0);
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-violet-600 opacity-20 blur-[100px]"></div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="0" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }} className="z-10 text-center">
            <MagicIcon className="w-20 h-20 text-violet-400 mx-auto mb-6" />
            <h1 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">تحليل البيانات جاري...</h1>
            <p className="text-xl mb-10 text-gray-400">رسالة مشفرة مخصصة إلى المستهدف: {recipient}</p>
            <button onClick={() => setStep(1)} className="px-12 py-4 bg-violet-600/20 border border-violet-500 text-violet-300 rounded-full font-bold hover:bg-violet-600 hover:text-white transition-all">بدء المطابقة البيومترية</button>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-10 text-center w-full max-w-sm">
            <h2 className="text-2xl font-mono mb-8 text-violet-300">SCANNING IDENTITY...</h2>
            <div className="relative w-48 h-48 mx-auto border-2 border-violet-500/30 rounded-3xl overflow-hidden mb-8 bg-black">
              <motion.div animate={{ y: ["0%", "100%", "0%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-full h-1 bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,1)] absolute" />
              <div className="w-full h-full flex items-center justify-center opacity-30">
                <User className="w-24 h-24 text-violet-500" />
              </div>
            </div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="text-green-400 font-mono mb-6">MATCH FOUND: {recipient}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="text-gray-400 font-mono text-sm mb-8">SENDER DETECTED: {sender}</motion.p>
            
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} onClick={() => { triggerConfetti(); setStep(2); }} className="px-10 py-4 bg-violet-600 text-white rounded-full font-bold w-full font-mono">DECRYPT MESSAGE</motion.button>
          </motion.div>
        )}
        {step === 2 && <GiftReveal gift={gift} msg={msg} />}
      </AnimatePresence>
    </div>
  );
};


// --- Main Controller --- //
function PreviewContent() {
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  if (!isClient) return <div className="min-h-screen bg-[#050505] text-[#BF953F] flex justify-center items-center font-bold text-xl">جاري التحميل...</div>;

  const template = searchParams.get("template") || "friend";
  const category = searchParams.get("category") || "vouchers";
  
  // Customization Params
  const sender = searchParams.get("sender") || "صديقك";
  const recipient = searchParams.get("recipient") || "أنت";
  const msg = searchParams.get("msg") || "أتمنى لك السعادة دائماً.";
  
  const gift = getGiftDetails(category);

  const triggerConfetti = () => {
    if (gift.type !== "digital") {
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 }, zIndex: 9999 });
    }
  };

  const props = { gift, sender, recipient, msg, triggerConfetti };

  switch (template) {
    case "kids": return <KidsTemplate {...props} />;
    case "quran":
    case "graduation": 
    case "national": return <JourneyTemplate {...props} />;
    case "custom": return <CustomTemplate {...props} />;
    case "friend":
    case "family":
    case "eid":
    case "birthday":
    default: return <FriendTemplate {...props} />;
  }
}

export default function PreviewPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#BF953F] text-xl font-bold">جاري تجهيز التجربة...</div>}>
      <PreviewContent />
    </React.Suspense>
  );
}
