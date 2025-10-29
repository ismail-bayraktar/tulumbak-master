import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets.js';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App.jsx';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track slider view
  const trackSliderView = async (sliderId) => {
    try {
      await axios.post(`${backendUrl}/api/slider/track/view/${sliderId}`);
    } catch (error) {
      console.log('View tracking failed:', error);
    }
  };

  // Track slider click
  const trackSliderClick = async (sliderId, event) => {
    try {
      await axios.post(`${backendUrl}/api/slider/track/click/${sliderId}`);
    } catch (error) {
      console.log('Click tracking failed:', error);
    }
  };

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/slider/list`);
        if (response.data.success && response.data.sliders.length > 0) {
          // API'den gelen slider'ları formatla
          const formattedSlides = response.data.sliders.map(slider => ({
            id: slider._id,
            template: slider.template || 'split-left',
            title: slider.title,
            subtitle: slider.subtitle,
            description: slider.description,
            image: slider.mobileImage ? `${backendUrl}${slider.mobileImage}` : `${backendUrl}${slider.image}`,
            backgroundImage: slider.backgroundImage ? `${backendUrl}${slider.backgroundImage}` : null,
            buttonText: slider.buttonText,
            buttonLink: slider.buttonLink || '/collection',
            buttonStyle: slider.buttonStyle || 'primary',
            overlayOpacity: slider.overlayOpacity || 0,
            textColor: slider.textColor || 'auto',
            altText: slider.altText || slider.title
          }));
          setSlides(formattedSlides);
        } else {
          // Eğer API'de slider yoksa, varsayılan slider'ları kullan
          setSlides([
            {
              id: 'default-1',
              template: 'split-left',
              title: "Taze Baklava Dünyası",
              subtitle: "Geleneksel Lezzet, Modern Sunum",
              description: "Antep fıstığıyla hazırlanan özel lezzetler",
              image: assets.hero_img,
              buttonText: "Baklavaları Keşfet",
              buttonLink: "/collection"
            },
            {
              id: 'default-2',
              template: 'split-right',
              title: "Özel Gün Paketleri",
              subtitle: "Sevdiklerinizi Mutlu Edin",
              description: "Düğün, bayram, yılbaşı özel paketler",
              image: "/assets/slider-1.png",
              buttonText: "Paketleri İncele",
              buttonLink: "/collection?category=Özel Paket"
            },
            {
              id: 'default-3',
              template: 'centered',
              title: "Aynı Gün Teslimat",
              subtitle: "Taze Kapınızda",
              description: "Siparişiniz 2 saat içinde kapınızda",
              image: assets.hero_img,
              buttonText: "Hemen Sipariş Ver",
              buttonLink: "/collection"
            }
          ]);
        }
      } catch (error) {
        console.error('Slider yüklenemedi:', error);
        // Hata durumunda varsayılan slider'lar
        setSlides([
          {
            id: 'default-error',
            template: 'split-left',
            title: "Taze Baklava Dünyası",
            subtitle: "Geleneksel Lezzet, Modern Sunum",
            description: "Antep fıstığıyla hazırlanan özel lezzetler",
            image: assets.hero_img,
            buttonText: "Baklavaları Keşfet",
            buttonLink: "/collection"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    // Track view for current slide
    if (slides[currentSlide]?.id && slides[currentSlide].id.startsWith('slider-')) {
      trackSliderView(slides[currentSlide].id);
    }

    return () => clearInterval(timer);
  }, [currentSlide, slides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleButtonClick = (slider, event) => {
    if (slider.id && slider.id.startsWith('slider-')) {
      trackSliderClick(slider.id, event);
    }
  };

  // Button style classes
  const getButtonClass = (style) => {
    switch (style) {
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 font-semibold rounded-lg transition-all duration-300';
      case 'outline':
        return 'border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 font-semibold rounded-lg transition-all duration-300';
      default:
        return 'bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-semibold rounded-lg transition-all duration-300';
    }
  };

  // Text color classes
  const getTextColorClass = (color) => {
    switch (color) {
      case 'light':
        return 'text-white';
      case 'dark':
        return 'text-gray-900';
      default:
        return 'text-white';
    }
  };

  // Template rendering
  const renderSlide = (slide) => {
    const textColorClass = getTextColorClass(slide.textColor);
    const buttonClass = getButtonClass(slide.buttonStyle);

    switch (slide.template) {
      case 'split-right':
        return (
          <div className="flex flex-col sm:flex-row h-full">
            <div className="w-full sm:w-1/2 h-full order-2 sm:order-1">
              <img
                src={slide.image}
                alt={slide.altText}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 px-6 order-1 sm:order-2">
              <div className={`${textColorClass} text-center sm:text-left`}>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <div className="w-8 md:w-11 h-[2px] bg-red-600"></div>
                  <p className="font-medium text-sm md:text-base">{slide.subtitle}</p>
                </div>
                <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed text-red-600 font-bold">
                  {slide.title}
                </h1>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <p className="font-semibold text-sm md:text-base">{slide.description}</p>
                  <div className="w-8 md:w-11 h-[2px] bg-red-600"></div>
                </div>
                <div className="py-6">
                  <Link
                    to={slide.buttonLink}
                    onClick={(e) => handleButtonClick(slide, e)}
                  >
                    <button className={buttonClass}>
                      {slide.buttonText}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );

      case 'centered':
        return (
          <div className="relative h-full">
            {slide.backgroundImage && (
              <div className="absolute inset-0">
                <img
                  src={slide.backgroundImage}
                  alt={slide.altText}
                  className="w-full h-full object-cover"
                />
                {slide.overlayOpacity > 0 && (
                  <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: slide.overlayOpacity / 100 }}
                  ></div>
                )}
              </div>
            )}
            <div className="relative h-full flex items-center justify-center px-6">
              <div className={`${textColorClass} text-center max-w-4xl`}>
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-8 md:w-11 h-[2px] bg-red-600"></div>
                  <p className="font-medium text-sm md:text-base">{slide.subtitle}</p>
                  <div className="w-8 md:w-11 h-[2px] bg-red-600"></div>
                </div>
                <h1 className="text-3xl sm:py-3 lg:text-6xl leading-relaxed text-red-600 font-bold">
                  {slide.title}
                </h1>
                <p className="font-semibold text-lg md:text-xl py-4">{slide.description}</p>
                <div className="py-6">
                  <Link
                    to={slide.buttonLink}
                    onClick={(e) => handleButtonClick(slide, e)}
                  >
                    <button className={buttonClass}>
                      {slide.buttonText}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );

      case 'overlay':
        return (
          <div className="relative h-full">
            <img
              src={slide.image}
              alt={slide.altText}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"
              style={{
                backgroundColor: `rgba(0,0,0,${slide.overlayOpacity / 100})`
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-start px-6 sm:px-12">
              <div className={`${textColorClass} max-w-2xl`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 md:w-11 h-[2px] bg-red-600"></div>
                  <p className="font-medium text-sm md:text-base">{slide.subtitle}</p>
                </div>
                <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed font-bold">
                  {slide.title}
                </h1>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm md:text-base">{slide.description}</p>
                  <div className="w-8 md:w-11 h-[2px] bg-red-600"></div>
                </div>
                <div className="py-6">
                  <Link
                    to={slide.buttonLink}
                    onClick={(e) => handleButtonClick(slide, e)}
                  >
                    <button className={buttonClass}>
                      {slide.buttonText}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );

      case 'full-width':
        return (
          <div className="relative h-full">
            <img
              src={slide.image}
              alt={slide.altText}
              className="w-full h-full object-cover"
            />
            {slide.overlayOpacity > 0 && (
              <div
                className="absolute inset-0 bg-black"
                style={{ opacity: slide.overlayOpacity / 100 }}
              ></div>
            )}
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <div className={`${textColorClass} text-center max-w-4xl`}>
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-8 md:w-11 h-[2px] bg-red-600"></div>
                  <p className="font-medium text-sm md:text-base">{slide.subtitle}</p>
                  <div className="w-8 md:w-11 h-[2px] bg-red-600"></div>
                </div>
                <h1 className="text-3xl sm:py-3 lg:text-6xl leading-relaxed font-bold">
                  {slide.title}
                </h1>
                <p className="font-semibold text-lg md:text-xl py-4">{slide.description}</p>
                <div className="py-6">
                  <Link
                    to={slide.buttonLink}
                    onClick={(e) => handleButtonClick(slide, e)}
                  >
                    <button className={buttonClass}>
                      {slide.buttonText}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );

      case 'split-left':
      default:
        return (
          <div className="flex flex-col sm:flex-row h-full">
            <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 px-6">
              <div className={`${textColorClass} text-center sm:text-left`}>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <div className="w-8 md:w-11 h-[2px] bg-red-600"></div>
                  <p className="font-medium text-sm md:text-base">{slide.subtitle}</p>
                </div>
                <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed text-red-600 font-bold">
                  {slide.title}
                </h1>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <p className="font-semibold text-sm md:text-base">{slide.description}</p>
                  <div className="w-8 md:w-11 h-[2px] bg-red-600"></div>
                </div>
                <div className="py-6">
                  <Link
                    to={slide.buttonLink}
                    onClick={(e) => handleButtonClick(slide, e)}
                  >
                    <button className={buttonClass}>
                      {slide.buttonText}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2 h-full">
              <img
                src={slide.image}
                alt={slide.altText}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="relative w-full h-[500px] sm:h-[600px] overflow-hidden mt-5 bg-gray-100">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-[500px] sm:h-[600px] overflow-hidden mt-5 bg-gray-100">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📸</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz slider eklenmedi</h3>
            <p className="text-gray-600">Yakında burada görüntülenecek</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] overflow-hidden mt-5">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {renderSlide(slide)}
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
                ? 'bg-red-600 w-8'
                : 'bg-white/60 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
