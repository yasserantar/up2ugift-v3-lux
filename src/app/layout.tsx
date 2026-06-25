import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "./globals.css";

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Up2uGift - منصة الهدايا الفاخرة",
  description: "الجيل الجديد من الهدايا الرقمية والتجارب التفاعلية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${alexandria.variable} font-sans antialiased bg-[#FAF9F6] text-[#1A1A1A]`}>
        {children}
      </body>
    </html>
  );
}
