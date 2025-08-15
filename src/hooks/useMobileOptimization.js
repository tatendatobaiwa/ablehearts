import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce, throttle } from '../utils/performance';

/**
 * Mobile optimization hooks for enhanced mobile experience
 */

// Mobile detection and device info
export const useMobileDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    touchSupport: 'ontouchstart' in window,
    devicePixelRatio: window.devicePixelRatio || 1
  });

  const updateDeviceInfo = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    setDeviceInfo({
      isMobile: width <= 768,
      isTablet: width > 768 && width <= 1024,
      isDesktop: width > 1024,
      screenWidth: width,
      screenHeight: height,
      orientation: width > height ? 'landscape' : 'portrait',
      touchSupport: 'ontouchstart' in window,
      devicePixelRatio: window.devicePixelRatio || 1
    });
  }, []);

  const debouncedUpdate = useMemo(
    () => debounce(updateDeviceInfo, 150),
    [updateDeviceInfo]
  );

  useEffect(() => {
    updateDeviceInfo();
    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', debouncedUpdate);

    return () => {
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', debouncedUpdate);
    };
  }, [debouncedUpdate, updateDeviceInfo]);

  return deviceInfo;
};

// Touch gesture handling
export const useTouchGestures = (element, options = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventScroll = false
  } = options;

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = useCallback((e) => {
    if (preventScroll) {
      e.preventDefault();
    }
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      time: Date.now()
    });
  }, [preventScroll]);

  const handleTouchMove = useCallback((e) => {
    if (preventScroll) {
      e.preventDefault();
    }
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      time: Date.now()
    });
  }, [preventScroll]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > threshold;
    const isRightSwipe = distanceX < -threshold;
    const isUpSwipe = distanceY > threshold;
    const isDownSwipe = distanceY < -threshold;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
    if (isUpSwipe && onSwipeUp) {
      onSwipeUp();
    }
    if (isDownSwipe && onSwipeDown) {
      onSwipeDown();
    }
  }, [touchStart, touchEnd, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  useEffect(() => {
    const el = element?.current || element;
    if (!el) return;

    el.addEventListener('touchstart', handleTouchStart, { passive: !preventScroll });
    el.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll });
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [element, handleTouchStart, handleTouchMove, handleTouchEnd, preventScroll]);
};

// Mobile-optimized scroll handling
export const useMobileScroll = (options = {}) => {
  const {
    onScrollUp,
    onScrollDown,
    threshold = 10,
    throttleMs = 16
  } = options;

  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    if (Math.abs(currentScrollY - lastScrollY) < threshold) {
      return;
    }

    const direction = currentScrollY > lastScrollY ? 'down' : 'up';
    
    if (direction !== scrollDirection) {
      setScrollDirection(direction);
      
      if (direction === 'up' && onScrollUp) {
        onScrollUp(currentScrollY);
      } else if (direction === 'down' && onScrollDown) {
        onScrollDown(currentScrollY);
      }
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY, scrollDirection, threshold, onScrollUp, onScrollDown]);

  const throttledScroll = useMemo(
    () => throttle(handleScroll, throttleMs),
    [handleScroll, throttleMs]
  );

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [throttledScroll]);

  return { scrollDirection, lastScrollY };
};

// Mobile-specific performance optimization
export const useMobilePerformance = () => {
  const { isMobile, isTablet } = useMobileDetection();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Mobile-specific optimizations
  const optimizations = useMemo(() => ({
    shouldReduceAnimations: isMobile || reducedMotion,
    shouldLazyLoadImages: isMobile || isTablet,
    shouldPreloadCritical: !isMobile,
    maxImageQuality: isMobile ? 0.8 : 1.0,
    enableVirtualScrolling: isMobile,
    reducedParallax: isMobile || reducedMotion
  }), [isMobile, isTablet, reducedMotion]);

  return optimizations;
};

// Mobile viewport management
export const useViewportManagement = () => {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = viewportHeight - currentHeight;
      
      // Detect virtual keyboard on mobile
      if (heightDifference > 150) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
      }
      
      setViewportHeight(currentHeight);
    };

    const debouncedResize = debounce(handleResize, 100);
    window.addEventListener('resize', debouncedResize);

    return () => window.removeEventListener('resize', debouncedResize);
  }, [viewportHeight]);

  // Fix viewport height for mobile browsers
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  return { viewportHeight, isKeyboardOpen };
};

// Mobile accessibility enhancements
export const useMobileAccessibility = () => {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);

  const increaseFontSize = useCallback(() => {
    setFontSize(prev => Math.min(prev + 2, 24));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize(prev => Math.max(prev - 2, 12));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setHighContrast(prev => !prev);
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  return {
    fontSize,
    highContrast,
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast
  };
};

export default {
  useMobileDetection,
  useTouchGestures,
  useMobileScroll,
  useMobilePerformance,
  useViewportManagement,
  useMobileAccessibility
};