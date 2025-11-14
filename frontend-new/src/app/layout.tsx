import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

/**
 * Font Loading Disabled
 *
 * Next.js 16.0.3 Turbopack has a known bug with Google Fonts loader.
 * Using system fonts instead for reliability and performance.
 *
 * Font stack: Inter (system), -apple-system, BlinkMacSystemFont, Segoe UI, etc.
 */

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
        className="font-sans antialiased"
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
