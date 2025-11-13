import type { Metadata } from 'next';
import { Inter, Nunito_Sans, Poppins, Prata } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito-sans',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const prata = Prata({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-prata',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tulumbak İzmir Baklava - Geleneksel Lezzetler',
  description: 'İzmir\'in en kaliteli baklavası ve tatlıları kapınızda! Taze ve kuru baklava çeşitleri, özel ambalaj seçenekleriyle.',
  keywords: ['baklava', 'İzmir baklavası', 'tatlı', 'tulumbak', 'online baklava'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${nunitoSans.variable} ${poppins.variable} ${prata.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
