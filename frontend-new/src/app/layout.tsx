import type { Metadata } from "next";
import { Inter, Poppins, Prata, Nunito_Sans } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const prata = Prata({
  variable: "--font-prata",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tulumbak İzmir Baklava | Geleneksel Lezzet",
  description: "İzmir'in en taze ve lezzetli baklavalarını online sipariş edin. Geleneksel tariflerle hazırlanan taze baklava çeşitleri.",
  keywords: "baklava, tulumbak, İzmir baklava, online baklava, tatlı sipariş",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${inter.variable} ${poppins.variable} ${prata.variable} ${nunitoSans.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <Toaster position="top-right" />
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
