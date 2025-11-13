import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useHeroAnimations } from '../hooks/useHeroAnimations';
import { heroSlides } from '../assets/assets';

/**
 * ModernHeroSection - Premium hero section component
 *
 * Features:
 * - Dynamic content with smooth animations
 * - Modern glassmorphism design
 * - Responsive layout
 * - Interactive CTAs
 * - Auto-play with manual controls
 * - Accessibility features
 * - Touch/swipe support
 */
const ModernHeroSection = ({ slides = null, autoPlay = true, autoPlayInterval = 5000 }) => {
  // Use provided slides or default to heroSlides from assets
  const heroSlidesData = slides && slides.length > 0 ? slides : heroSlides;

  // Use custom hook for animations and interactions
  const {
    currentSlide,
    isPlaying,
    isAnimating,
    handleNext,
    handlePrev,
    goToSlide,
    togglePlayPause,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    canGoNext,
    getSlideAriaLabel,
    getControlAriaLabel
  } = useHeroAnimations(heroSlidesData.length, {
    autoPlay,
    autoPlayInterval,
    pauseOnHover: true,
    enableKeyboard: true,
    enableTouch: true
  });

  const currentSlideData = heroSlidesData[currentSlide];

  return (
    <div
      className="relative w-full h-screen sm:h-[80vh] lg:h-[90vh] overflow-hidden bg-gradient-to-br from-red-50 to-pink-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero section with featured content"
    >
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(220, 20, 60, 0.8) 0%, rgba(255, 105, 180, 0.6) 100%), url(${currentSlideData.backgroundImage})`,
        }}
      />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Side - Text Content */}
            <div className={`text-white space-y-8 transform transition-all duration-700 ease-out ${
              isAnimating ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'
            }`}>

              {/* Subtitle */}
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-white/80 rounded-full"></div>
                <span className="text-lg font-light tracking-wide uppercase letter-spacing">
                  {currentSlideData.subtitle}
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="block mb-2">{currentSlideData.title}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-200">
                  Lezzet Dolu
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-white/90 max-w-lg leading-relaxed">
                {currentSlideData.description}
              </p>

              {/* Features */}
              {currentSlideData.features && (
                <div className="flex flex-wrap gap-4">
                  {currentSlideData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2"
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {currentSlideData.primaryCTA && (
                  <Link
                    to={currentSlideData.primaryCTA.link}
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 font-semibold rounded-full hover:bg-red-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                  >
                    {currentSlideData.primaryCTA.text}
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                )}

                {currentSlideData.secondaryCTA && (
                  <Link
                    to={currentSlideData.secondaryCTA.link}
                    className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-red-600 transition-all duration-300 transform hover:scale-105"
                  >
                    {currentSlideData.secondaryCTA.text}
                  </Link>
                )}
              </div>
            </div>

            {/* Right Side - Visual Element */}
            <div className={`hidden lg:block transform transition-all duration-700 delay-200 ease-out ${
              isAnimating ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'
            }`}>
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-yellow-400 rounded-2xl rotate-45 opacity-80 animate-bounce" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-pink-400 rounded-full opacity-60 animate-pulse" />

                {/* Central visual */}
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">🥧</div>
                    <h3 className="text-2xl font-bold mb-2">Taze Lezzet</h3>
                    <p className="text-white/80">Bugün özel indirimler!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {canGoNext && (
        <>
          {/* Previous/Next Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-20 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={getControlAriaLabel('prev')}
            disabled={isAnimating}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-20 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={getControlAriaLabel('next')}
            disabled={isAnimating}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-20">
            <div className="flex space-x-2" role="tablist" aria-label="Slide navigation">
              {heroSlidesData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-12 bg-white'
                      : 'w-2 bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={getSlideAriaLabel(index)}
                  aria-selected={index === currentSlide}
                  role="tab"
                  disabled={isAnimating}
                />
              ))}
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="ml-4 p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full transition-all duration-300 border border-white/30"
              aria-label={getControlAriaLabel('play')}
            >
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
};

ModernHeroSection.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    backgroundImage: PropTypes.string,
    primaryCTA: PropTypes.shape({
      text: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired
    }),
    secondaryCTA: PropTypes.shape({
      text: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired
    }),
    features: PropTypes.arrayOf(PropTypes.string)
  })),
  autoPlay: PropTypes.bool,
  autoPlayInterval: PropTypes.number
};

export default ModernHeroSection;