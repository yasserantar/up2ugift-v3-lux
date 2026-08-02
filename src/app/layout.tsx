import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "Up2UGift | هدايا تصنع الفرح",
  description: "الجيل الجديد من الهدايا الرقمية الاستثنائية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="font-sans antialiased text-white selection:bg-indigo-500/30">
        <div className="orb-1"></div>
        <div className="orb-2"></div>
        {children}
      </body>
    </html>
  );
}
