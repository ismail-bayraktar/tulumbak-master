import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">TULUMBAK</h3>
            <p className="text-neutral-400">
              İzmir'in en taze ve lezzetli baklavalarını kapınıza getiriyoruz.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Hızlı Erişim</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/collection" className="text-neutral-400 hover:text-white transition-colors">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Müşteri Hizmetleri</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/orders" className="text-neutral-400 hover:text-white transition-colors">
                  Siparişlerim
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-neutral-400 hover:text-white transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-400 hover:text-white transition-colors">
                  Kullanım Koşulları
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="text-neutral-400 hover:text-white transition-colors">
                  Teslimat Bilgileri
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">İletişim</h4>
            <ul className="space-y-2 text-neutral-400">
              <li>İzmir, Türkiye</li>
              <li>
                <a href="tel:+905551234567" className="hover:text-white transition-colors">
                  +90 555 123 45 67
                </a>
              </li>
              <li>
                <a href="mailto:info@tulumbak.com" className="hover:text-white transition-colors">
                  info@tulumbak.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
          <p>&copy; {currentYear} Tulumbak İzmir Baklava. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
