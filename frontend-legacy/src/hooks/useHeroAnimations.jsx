import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useHeroAnimations - Custom hook for hero section animations and interactions
 *
 * Features:
 * - Smooth slide transitions
 * - Auto-play with pause on hover
 * - Keyboard navigation
 * - Touch/swipe support
 * - Performance optimizations
 * - Accessibility features
 */
export const useHeroAnimations = (totalSlides, options = {}) => {
  const {
    autoPlay = true,
    autoPlayInterval = 5000,
    transitionDuration = 500,
    pauseOnHover = true,
    enableKeyboard = true,
    enableTouch = true,
  } = options;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Cleanup refs
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying || totalSlides <= 1 || isHovering) return;

    intervalRef.current = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentSlide, isPlaying, isHovering, autoPlayInterval, totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case ' ':
          event.preventDefault();
          togglePlayPause();
          break;
        case 'Home':
          event.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          event.preventDefault();
          goToSlide(totalSlides - 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboard, currentSlide, isAnimating]);

  // Touch handlers
  const handleTouchStart = useCallback((e) => {
    if (!enableTouch) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, [enableTouch]);

  const handleTouchMove = useCallback((e) => {
    if (!enableTouch) return;
    setTouchEnd(e.targetTouches[0].clientX);
  }, [enableTouch]);

  const handleTouchEnd = useCallback(() => {
    if (!enableTouch || !touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  }, [enableTouch, touchStart, touchEnd]);

  // Animation helpers
  const animateToSlide = useCallback((targetIndex) => {
    if (isAnimating || targetIndex === currentSlide) return;

    setIsAnimating(true);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCurrentSlide(targetIndex);
      setIsAnimating(false);
    }, 50); // Small delay for smooth transition
  }, [isAnimating, currentSlide]);

  // Navigation functions
  const handleNext = useCallback(() => {
    const nextIndex = (currentSlide + 1) % totalSlides;
    animateToSlide(nextIndex);
  }, [currentSlide, totalSlides, animateToSlide]);

  const handlePrev = useCallback(() => {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    animateToSlide(prevIndex);
  }, [currentSlide, totalSlides, animateToSlide]);

  const goToSlide = useCallback((index) => {
    if (index < 0 || index >= totalSlides) return;
    animateToSlide(index);
  }, [totalSlides, animateToSlide]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Hover handlers
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsHovering(true);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      setIsHovering(false);
    }
  }, [pauseOnHover]);

  // Focus handlers for accessibility
  const handleFocus = useCallback(() => {
    if (pauseOnHover) {
      setIsHovering(true);
    }
  }, [pauseOnHover]);

  const handleBlur = useCallback(() => {
    if (pauseOnHover) {
      setIsHovering(false);
    }
  }, [pauseOnHover]);

  // Visibility change handler (pause when tab is not visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPlaying(false);
      } else if (autoPlay && !isHovering) {
        setIsPlaying(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [autoPlay, isHovering]);

  return {
    // Current state
    currentSlide,
    isPlaying,
    isAnimating,
    isHovering,

    // Navigation functions
    handleNext,
    handlePrev,
    goToSlide,
    togglePlayPause,

    // Event handlers
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,

    // Utilities
    canGoNext: totalSlides > 1,
    canGoPrev: totalSlides > 1,
    progressPercentage: totalSlides > 0 ? ((currentSlide + 1) / totalSlides) * 100 : 0,

    // Accessibility helpers
    getSlideAriaLabel: (index) => `Slide ${index + 1} of ${totalSlides}${index === currentSlide ? ' (current)' : ''}`,
    getControlAriaLabel: (type) => {
      switch (type) {
        case 'next':
          return 'Next slide';
        case 'prev':
          return 'Previous slide';
        case 'play':
          return isPlaying ? 'Pause slideshow' : 'Play slideshow';
        case 'goto':
          return `Go to slide`;
        default:
          return '';
      }
    }
  };
};

/**
 * useHeroKeyboard - Separate hook for keyboard-only navigation
 */
export const useHeroKeyboard = (onNext, onPrev, onTogglePlay, goToSlide, totalSlides) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent keyboard navigation when user is typing in form inputs
      const target = event.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          onPrev?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onNext?.();
          break;
        case ' ':
          event.preventDefault();
          onTogglePlay?.();
          break;
        case 'Home':
          event.preventDefault();
          goToSlide?.(0);
          break;
        case 'End':
          event.preventDefault();
          goToSlide?.(totalSlides - 1);
          break;
        default:
          // Number keys for direct slide navigation
          if (event.key >= '1' && event.key <= '9') {
            const slideIndex = parseInt(event.key) - 1;
            if (slideIndex < totalSlides) {
              event.preventDefault();
              goToSlide?.(slideIndex);
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onTogglePlay, goToSlide, totalSlides]);
};

/**
 * useHeroProgress - Hook for managing slide progress indicators
 */
export const useHeroProgress = (currentSlide, totalSlides, autoPlayInterval) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (totalSlides <= 1) return;

    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / autoPlayInterval) * 100; // Update every 100ms
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentSlide, totalSlides, autoPlayInterval]);

  return progress;
};

export default useHeroAnimations;