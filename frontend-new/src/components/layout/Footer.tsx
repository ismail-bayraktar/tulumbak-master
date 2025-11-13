import Link from 'next/link';
import { Facebook, Instagram, Twitter, Phone, MapPin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🥮</span>
              <h3 className="text-xl font-bold text-white prata-regular">
                Tulumbak
              </h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Çameli yaylasından sofralarınıza sunulan kaliteli, sağlıklı ve lezzetli ürünlerin adresi.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Kurumsal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm hover:text-white transition-colors"
                >
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link
                  href="/hakkimizda"
                  className="text-sm hover:text-white transition-colors"
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link
                  href="/urunler"
                  className="text-sm hover:text-white transition-colors"
                >
                  Ürünlerimiz
                </Link>
              </li>
              <li>
                <Link
                  href="/iletisim"
                  className="text-sm hover:text-white transition-colors"
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Müşteri Hizmetleri
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/siparis-takip"
                  className="text-sm hover:text-white transition-colors"
                >
                  Sipariş Takip
                </Link>
              </li>
              <li>
                <Link
                  href="/iade-kosullari"
                  className="text-sm hover:text-white transition-colors"
                >
                  İade Koşulları
                </Link>
              </li>
              <li>
                <Link
                  href="/gizlilik-politikasi"
                  className="text-sm hover:text-white transition-colors"
                >
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link
                  href="/sss"
                  className="text-sm hover:text-white transition-colors"
                >
                  Sıkça Sorulan Sorular
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              İletişim
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <a
                    href="tel:+905415048662"
                    className="text-sm hover:text-white transition-colors"
                  >
                    +90 541 504 86 62
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <a
                    href="mailto:info@tulumbak.com"
                    className="text-sm hover:text-white transition-colors"
                  >
                    info@tulumbak.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p>Arıkaya Mahallesi</p>
                  <p>No: 57, Çameli</p>
                  <p>Denizli/Türkiye</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © {currentYear} Tulumbak. Tüm hakları saklıdır.
            </p>
            <p className="text-sm text-gray-500">
              Design & Developed by{' '}
              <a
                href="https://www.voyira.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-white transition-colors"
              >
                voyira
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
