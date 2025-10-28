import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets.js';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App.jsx';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/slider/list`);
        if (response.data.success && response.data.sliders.length > 0) {
          // API'den gelen slider'ları formatla
          const formattedSlides = response.data.sliders.map(slider => ({
            title: slider.title,
            subtitle: slider.subtitle,
            description: slider.description,
            image: `${backendUrl}${slider.image}`,
            buttonText: slider.buttonText,
            buttonLink: slider.buttonLink || '/collection'
          }));
          setSlides(formattedSlides);
        } else {
          // Eğer API'de slider yoksa, varsayılan slider'ları kullan
          setSlides([
            {
              title: "Taze Baklava Dünyası",
              subtitle: "Geleneksel Lezzet, Modern Sunum",
              description: "Antep fıstığıyla hazırlanan özel lezzetler",
              image: assets.hero_img,
              buttonText: "Baklavaları Keşfet"
            },
            {
              title: "Özel Gün Paketleri",
              subtitle: "Sevdiklerinizi Mutlu Edin",
              description: "Düğün, bayram, yılbaşı özel paketler",
              image: "/assets/slider-1.png",
              buttonText: "Paketleri İncele"
            },
            {
              title: "Aynı Gün Teslimat",
              subtitle: "Taze Kapınızda",
              description: "Siparişiniz 2 saat içinde kapınızda",
              image: assets.hero_img,
              buttonText: "Hemen Sipariş Ver"
            }
          ]);
        }
      } catch (error) {
        console.error('Slider yüklenemedi:', error);
        // Hata durumunda varsayılan slider'lar
        setSlides([
          {
              title: "Taze Baklava Dünyası",
              subtitle: "Geleneksel Lezzet, Modern Sunum",
              description: "Antep fıstığıyla hazırlanan özel lezzetler",
              image: assets.hero_img,
              buttonText: "Baklavaları Keşfet"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] overflow-hidden mt-5">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex flex-col sm:flex-row h-full">
              {/* Left Side - Content */}
              <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 px-6">
                <div className="text-[#414141] text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <div className="w-8 md:w-11 h-[2px] bg-[#DC143C]"></div>
                    <p className="font-medium text-sm md:text-base">{slide.subtitle}</p>
                  </div>
                  <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed text-[#DC143C] font-bold">
                    {slide.title}
                  </h1>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <p className="font-semibold text-sm md:text-base">{slide.description}</p>
                    <div className="w-8 md:w-11 h-[2px] bg-[#DC143C]"></div>
                  </div>
                  <div className="py-6">
                    <Link to={slide.buttonLink}>
                      <button className="border border-[#DC143C] px-10 py-4 text-sm hover:bg-[#DC143C] hover:text-white transition-all duration-500 font-semibold">
                        {slide.buttonText}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Image */}
              <div className="w-full sm:w-1/2 h-full">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-[#DC143C] w-8' 
                : 'bg-white/60 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
