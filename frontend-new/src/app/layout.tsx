import type { Metadata } from 'next';
import './globals.css';

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
      <body>
        {children}
      </body>
    </html>
  );
}
