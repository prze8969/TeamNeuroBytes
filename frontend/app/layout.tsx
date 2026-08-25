import type { Metadata } from "next";
import { Public_Sans, Merriweather } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "KisanSetu • Smart Trading, समृद्ध किसान",
  description: "Smart India Hackathon SIH26132: Omnichannel agricultural trade platform with YOLOv8 crop grading, PostGIS freight pooling, and milestone escrow rails.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  }
};

import { Toaster } from "sonner";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${merriweather.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white">
        {children}
        <Toaster position="top-right" richColors closeButton expand={false} />
      </body>

      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">{children}</body>

    </html>
  );
}
