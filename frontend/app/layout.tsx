import type { Metadata } from "next";
import { 
  Public_Sans, 
  Merriweather,
  Noto_Sans_Devanagari,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
  Noto_Sans_Gujarati,
  Noto_Sans_Kannada,
  Noto_Sans_Gurmukhi
} from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/lib/LocaleContext";
import { AuthProvider } from "@/lib/AuthContext";
import { Toaster } from "sonner";

const publicSans = Public_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
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
  title: "KisanSetu • Smart Trading, समृद्ध किसान",
  description: "Smart India Hackathon SIH26132: Omnichannel agricultural trade platform with YOLOv8 crop grading, PostGIS freight pooling, and milestone escrow rails.",
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
      className={`${publicSans.variable} ${merriweather.variable} ${notoDevanagari.variable} ${notoTamil.variable} ${notoTelugu.variable} ${notoGujarati.variable} ${notoKannada.variable} ${notoGurmukhi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white font-sans">
        <AuthProvider>
          <LocaleProvider>
            {children}
          </LocaleProvider>
        </AuthProvider>
        <Toaster position="top-right" richColors closeButton expand={false} />
      </body>
    </html>
  );
}
