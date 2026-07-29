import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LogOut, Gift, CreditCard, LayoutDashboard, Users } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const totalGifts = await prisma.gift.count();
  const paidGifts = await prisma.gift.count({ where: { status: "PAID" } });
  
  // Calculate total revenue from paid gifts
  const revenueResult = await prisma.gift.aggregate({
    _sum: { amount: true },
    where: { status: "PAID" }
  });
  const totalRevenue = revenueResult._sum.amount || 0;

  const recentGifts = await prisma.gift.findMany({
    take: 10,
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white" dir="rtl">
      {/* Sidebar / Header */}
      <nav className="bg-[#111] border-b border-[#BF953F]/30 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-[#BF953F]" />
            <span className="font-bold text-xl tracking-wider text-white">UP2U<span className="text-[#BF953F]">GIFT</span> ADMIN</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">مرحباً، {session.user?.name}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 mt-8">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <LayoutDashboard className="text-[#BF953F]" />
          نظرة عامة
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Gift className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">إجمالي الهدايا</p>
              <h3 className="text-2xl font-bold">{totalGifts}</h3>
            </div>
          </div>
          
          <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <CreditCard className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">الهدايا المدفوعة</p>
              <h3 className="text-2xl font-bold">{paidGifts}</h3>
            </div>
          </div>

          <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#BF953F]/10 flex items-center justify-center border border-[#BF953F]/20">
              <span className="text-[#BF953F] font-bold text-xl">SAR</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">إجمالي الإيرادات</p>
              <h3 className="text-2xl font-bold text-[#FCF6BA]">{totalRevenue}</h3>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-bold">أحدث الهدايا</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" dir="rtl">
              <thead className="bg-[#1A1A1A] text-gray-400 text-sm">
                <tr>
                  <th className="p-4 font-medium">رقم الهدية</th>
                  <th className="p-4 font-medium">المرسل</th>
                  <th className="p-4 font-medium">المستلم</th>
                  <th className="p-4 font-medium">القيمة</th>
                  <th className="p-4 font-medium">الحالة</th>
                  <th className="p-4 font-medium">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentGifts.map((gift) => (
                  <tr key={gift.id} className="hover:bg-[#151515] transition-colors">
                    <td className="p-4 text-sm font-mono text-gray-300">{gift.giftId}</td>
                    <td className="p-4 text-sm">{gift.senderName}</td>
                    <td className="p-4 text-sm">{gift.recipientName}</td>
                    <td className="p-4 text-sm font-bold text-[#BF953F]">{gift.amount} ر.س</td>
                    <td className="p-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        gift.status === 'PAID' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                        gift.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        'bg-gray-800 text-gray-300'
                      }`}>
                        {gift.status === 'PAID' ? 'مدفوع' : gift.status === 'PENDING' ? 'بانتظار الدفع' : gift.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(gift.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                  </tr>
                ))}
                {recentGifts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      لا يوجد هدايا حتى الآن.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
