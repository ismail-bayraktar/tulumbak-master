'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  template: 'split-left' | 'split-right' | 'centered' | 'overlay' | 'full-width';
  title: string;
  subtitle: string;
  description: string;
  image: string;
  backgroundImage?: string;
  buttonText: string;
  buttonLink: string;
  buttonStyle?: 'primary' | 'secondary' | 'outline';
  overlayOpacity?: number;
  textColor?: 'light' | 'dark' | 'auto';
  altText?: string;
}

const defaultSlides: Slide[] = [
  {
    id: 'default-1',
    template: 'split-left',
    title: 'Taze Baklava Dünyası',
    subtitle: 'Geleneksel Lezzet, Modern Sunum',
    description: 'Antep fıstığıyla hazırlanan özel lezzetler',
    image: '/hero-placeholder.jpg',
    buttonText: 'Baklavaları Keşfet',
    buttonLink: '/urunler',
    buttonStyle: 'primary',
  },
  {
    id: 'default-2',
    template: 'split-right',
    title: 'Özel Gün Paketleri',
    subtitle: 'Sevdiklerinizi Mutlu Edin',
    description: 'Düğün, bayram, yılbaşı özel paketler',
    image: '/hero-placeholder-2.jpg',
    buttonText: 'Paketleri İncele',
    buttonLink: '/urunler',
    buttonStyle: 'primary',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides] = useState<Slide[]>(defaultSlides);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const getButtonClass = (style?: string) => {
    switch (style) {
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 font-semibold rounded-lg transition-all duration-300';
      case 'outline':
        return 'border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 font-semibold rounded-lg transition-all duration-300';
      default:
        return 'bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 font-semibold rounded-lg transition-all duration-300';
    }
  };

  const getTextColorClass = (color?: string) => {
    switch (color) {
      case 'light':
        return 'text-white';
      case 'dark':
        return 'text-gray-900';
      default:
        return 'text-white';
    }
  };

  const renderSlide = (slide: Slide) => {
    const textColorClass = getTextColorClass(slide.textColor);
    const buttonClass = getButtonClass(slide.buttonStyle);

    if (slide.template === 'split-left') {
      return (
        <div className="flex flex-col sm:flex-row h-full">
          <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 px-6 bg-gradient-to-br from-orange-50 to-white">
            <div className={`${textColorClass} text-center sm:text-left`}>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <div className="w-8 md:w-11 h-[2px] bg-orange-500"></div>
                <p className="font-medium text-sm md:text-base text-gray-700">{slide.subtitle}</p>
              </div>
              <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed text-orange-500 font-bold">
                {slide.title}
              </h1>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <p className="font-semibold text-sm md:text-base text-gray-700">{slide.description}</p>
                <div className="w-8 md:w-11 h-[2px] bg-orange-500"></div>
              </div>
              <div className="py-6">
                <Link href={slide.buttonLink}>
                  <button className={buttonClass}>{slide.buttonText}</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/2 h-full relative">
            <Image
              src={slide.image}
              alt={slide.altText || slide.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      );
    }

    if (slide.template === 'split-right') {
      return (
        <div className="flex flex-col sm:flex-row h-full">
          <div className="w-full sm:w-1/2 h-full order-2 sm:order-1 relative">
            <Image
              src={slide.image}
              alt={slide.altText || slide.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 px-6 order-1 sm:order-2 bg-gradient-to-br from-orange-50 to-white">
            <div className={`${textColorClass} text-center sm:text-left`}>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <div className="w-8 md:w-11 h-[2px] bg-orange-500"></div>
                <p className="font-medium text-sm md:text-base text-gray-700">{slide.subtitle}</p>
              </div>
              <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed text-orange-500 font-bold">
                {slide.title}
              </h1>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <p className="font-semibold text-sm md:text-base text-gray-700">{slide.description}</p>
                <div className="w-8 md:w-11 h-[2px] bg-orange-500"></div>
              </div>
              <div className="py-6">
                <Link href={slide.buttonLink}>
                  <button className={buttonClass}>{slide.buttonText}</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="relative w-full h-[500px] sm:h-[600px] overflow-hidden bg-gray-100">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-[500px] sm:h-[600px] overflow-hidden bg-gray-100">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz slider eklenmedi</h3>
            <p className="text-gray-600">Yakında burada görüntülenecek</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] overflow-hidden">
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {renderSlide(slide)}
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-orange-500 w-8'
                : 'bg-white/60 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
