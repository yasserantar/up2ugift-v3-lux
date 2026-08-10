import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, DM_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Up2UGift | تجربة الإهداء الرقمي الفاخرة",
  description: "الجيل الاستثنائي من الهدايا الرقمية والتفاعلية التي تصنع البهجة في لحظات من تحب",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${ibmArabic.variable} ${dmSans.variable} font-sans antialiased selection:bg-[#ecc573]/30 selection:text-white`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
