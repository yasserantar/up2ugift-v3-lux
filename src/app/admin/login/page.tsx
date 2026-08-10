"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gift, Lock, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { signIn } = await import("next-auth/react");
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("بيانات الدخول غير صحيحة");
        setLoading(false);
      } else {
        router.push("/admin");
      }
    } catch {
      setError("حدث خطأ أثناء تسجيل الدخول");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center p-4" dir="rtl">
      <div className="w-full max-w-md bg-[#111] border border-[#BF953F]/30 p-8 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#BF953F]/10 rounded-full flex items-center justify-center mb-4 border border-[#BF953F]/30">
            <Lock className="w-8 h-8 text-[#BF953F]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">لوحة تحكم الإدارة</h1>
          <p className="text-gray-400 mt-2 text-sm">UP2UGIFT PLATFORM</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BF953F] transition-colors text-left"
              dir="ltr"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BF953F] transition-colors text-left"
              dir="ltr"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] text-black font-bold py-3 rounded-lg mt-6 hover:opacity-90 transition-opacity flex justify-center items-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
