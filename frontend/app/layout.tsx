import type { Metadata } from "next";
import { 
  Mukta,
  Noto_Sans,
  Noto_Sans_Devanagari,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
  Noto_Sans_Gujarati,
  Noto_Sans_Kannada,
  Noto_Sans_Gurmukhi
} from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { LocaleProvider } from "@/lib/LocaleContext";
import { AuthProvider } from "@/lib/AuthContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import { Toaster } from "sonner";

const mukta = Mukta({
  variable: "--font-mukta",
  subsets: ["devanagari", "latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari", "latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const notoTamil = Noto_Sans_Tamil({
  variable: "--font-tamil",
  subsets: ["tamil", "latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const notoTelugu = Noto_Sans_Telugu({
  variable: "--font-telugu",
  subsets: ["telugu", "latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const notoGujarati = Noto_Sans_Gujarati({
  variable: "--font-gujarati",
  subsets: ["gujarati", "latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const notoKannada = Noto_Sans_Kannada({
  variable: "--font-kannada",
  subsets: ["kannada", "latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const notoGurmukhi = Noto_Sans_Gurmukhi({
  variable: "--font-gurmukhi",
  subsets: ["gurmukhi", "latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Krishi Niti • Smart Trading, समृद्ध किसान",
  description: "Smart India Hackathon SIH26132: Omnichannel agricultural trade & policy platform with DINOv2 crop grading, PostGIS freight pooling, and milestone escrow rails.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${mukta.variable} ${notoSans.variable} ${notoDevanagari.variable} ${notoTamil.variable} ${notoTelugu.variable} ${notoGujarati.variable} ${notoKannada.variable} ${notoGurmukhi.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Mukta:wght@500;600;700;800&family=Noto+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white font-sans">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        <ThemeProvider>
          <AuthProvider>
            <LocaleProvider>
              {children}
            </LocaleProvider>
          </AuthProvider>
          <Toaster 
            position="bottom-right" 
            richColors 
            closeButton
            duration={4000}
            toastOptions={{
              className: 'rounded-2xl border border-slate-200/90 shadow-2xl backdrop-blur-xl p-4 font-sans text-xs font-semibold',
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
