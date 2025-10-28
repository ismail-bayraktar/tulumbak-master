import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets.js';

const ModernAbout = () => {
  return (
    <div className="modern-about">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-red-600 to-red-700 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${assets.about_img})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Tulumbak İzmir Baklava
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                1987'den beri İzmir'in en lezzetli baklavalarını yapıyoruz
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/collection"
                  className="inline-flex items-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
                >
                  Ürünlerimizi Keşfedin
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg hover:bg-white/20 transform hover:scale-105 transition-all duration-300 border border-white/30"
                >
                  Bizimle İletişime Geçin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Hikayemiz
              </h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  1987 yılında İzmir'de küçük bir dükkan başlayan yolculuğumuz, bugün Türkiye'nin en sevilen baklava markalarından biri olmamızı sağladı. Kurucumuz Ahmet Yılmaz'ın annesinden öğrendiği geleneksel tariflerle başlayan bu lezzet serüveni, artık üç nesildir devam ediyor.
                </p>
                <p>
                  Bizim için baklava sadece bir tatlı değil, aynı zamanda bir sanat, bir gelenek ve bir sevgi göstergesidir. Her bir baklava dilimi, ailenin bir parçası olan ustalarımızın elinden çıkan özenli bir çalışmadır.
                </p>
                <p>
                  İzmir'in kalbinde, günün her saati taze baklava üretiyoruz. Müşterilerimize sadece lezzet değil, aynı zamanda güven ve kalite vaat ediyoruz.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">36+</div>
                  <div className="text-sm text-gray-600">Yıllık Deneyim</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">500K+</div>
                  <div className="text-sm text-gray-600">Mutlu Müşteri</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">50+</div>
                  <div className="text-sm text-gray-600">Çeşit</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src={assets.about_img}
                alt="Tulumbak Baklava Dükkanı"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-red-600 text-white p-6 rounded-xl shadow-xl">
                <h3 className="text-2xl font-bold mb-2">Geleneksel Lezzet</h3>
                <p className="text-red-100">1987'den beri aynı kalite</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Değerlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Her yaptığımız işin arkasında duran temel prensipler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Doğallık ve Tazelik</h3>
              <p className="text-gray-600">
                Her gün taze üretim: ince hamur, dengeli şerbet, bol fıstık. İzmir'in taze baklavasını en hızlı şekilde sofranıza ulaştırıyoruz.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Müşteri Memnuniyeti</h3>
              <p className="text-gray-600">
                Her müşterimiz bizim için ailemizin bir parçasıdır. Memnuniyetiniz, bizim için en önemli ölçüttür.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Gelenek ve İnovasyon</h3>
              <p className="text-gray-600">
                Geleneksel tariflerimizi modern teknolojiyle birleştirerek her zaman en kaliteli ürünleri sunuyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Production Process */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Üretim Sürecimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ham maddeden sofranıza kadar olan özenli yolculuğumuz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-red-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Malzeme Seçimi</h3>
              <p className="text-gray-600">En kaliteli un, tereyağı ve Antep fıstığı</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-red-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hamur Hazırlığı</h3>
              <p className="text-gray-600">Ustalarımız tarafından elle açılan ince hamurlar</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-red-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pişirme</h3>
              <p className="text-gray-600">Mükemmel sıcaklıkta pişirilen altın rengi baklavalar</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-red-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Şerbet</h3>
              <p className="text-gray-600">Geleneksel tarifle hazırlanan dengeli şerbet</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ekibimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Lezzetin arkasındaki insanlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ahmet Yılmaz</h3>
              <p className="text-gray-600 mb-2">Kurucu & Baş Usta</p>
              <p className="text-sm text-gray-500">36 yıllık deneyim</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ayşe Yılmaz</h3>
              <p className="text-gray-600 mb-2">İkinci Nesil Yönetici</p>
              <p className="text-sm text-gray-500">Kalite kontrol uzmanı</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mehmet Kaya</h3>
              <p className="text-gray-600 mb-2">Baş Usta</p>
              <p className="text-sm text-gray-500">20 yıllık deneyim</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Lezzeti Hissin!
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            İzmir'in en taze baklavalarını hemen sipariş edin ve farkı yaşayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/collection"
              className="inline-flex items-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
            >
              Şimdi Sipariş Ver
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg hover:bg-white/20 transform hover:scale-105 transition-all duration-300 border border-white/30"
            >
              Bizimle İletişime Geçin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernAbout;