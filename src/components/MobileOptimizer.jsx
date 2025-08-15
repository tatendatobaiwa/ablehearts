import { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  useMobileDetection, 
  useViewportManagement, 
  useMobilePerformance 
} from '../hooks/useMobileOptimization';
import '../styles/mobileOptimizations.css';

/**
 * MobileOptimizer Component
 * Applies mobile-specific optimizations and enhancements
 */
const MobileOptimizer = memo(({ children }) => {
  const deviceInfo = useMobileDetection();
  const { viewportHeight, isKeyboardOpen } = useViewportManagement();
  const optimizations = useMobilePerformance();

  // Apply mobile-specific optimizations
  useEffect(() => {
    const { isMobile, isTablet, orientation, touchSupport } = deviceInfo;
    
    // Add device-specific classes to body
    document.body.classList.toggle('is-mobile', isMobile);
    document.body.classList.toggle('is-tablet', isTablet);
    document.body.classList.toggle('is-desktop', !isMobile && !isTablet);
    document.body.classList.toggle('has-touch', touchSupport);
    document.body.classList.toggle('landscape', orientation === 'landscape');
    document.body.classList.toggle('portrait', orientation === 'portrait');
    document.body.classList.toggle('keyboard-open', isKeyboardOpen);

    // Apply performance optimizations
    if (optimizations.shouldReduceAnimations) {
      document.body.classList.add('mobile-reduce-motion');
    }

    if (optimizations.reducedParallax) {
      document.body.classList.add('mobile-blur-reduced');
    }

    // Cleanup function
    return () => {
      document.body.classList.remove(
        'is-mobile', 'is-tablet', 'is-desktop', 'has-touch',
        'landscape', 'portrait', 'keyboard-open',
        'mobile-reduce-motion', 'mobile-blur-reduced'
      );
    };
  }, [deviceInfo, optimizations, isKeyboardOpen]);

  // Handle viewport height changes for mobile browsers
  useEffect(() => {
    const vh = viewportHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, [viewportHeight]);

  // Apply mobile-specific meta tags
  useEffect(() => {
    if (deviceInfo.isMobile) {
      // Prevent zoom on input focus (iOS)
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
      }

      // Add mobile-specific meta tags
      const mobileWebApp = document.createElement('meta');
      mobileWebApp.name = 'mobile-web-app-capable';
      mobileWebApp.content = 'yes';
      document.head.appendChild(mobileWebApp);

      const appleWebApp = document.createElement('meta');
      appleWebApp.name = 'apple-mobile-web-app-capable';
      appleWebApp.content = 'yes';
      document.head.appendChild(appleWebApp);

      const appleStatusBar = document.createElement('meta');
      appleStatusBar.name = 'apple-mobile-web-app-status-bar-style';
      appleStatusBar.content = 'default';
      document.head.appendChild(appleStatusBar);

      // Cleanup function
      return () => {
        document.head.removeChild(mobileWebApp);
        document.head.removeChild(appleWebApp);
        document.head.removeChild(appleStatusBar);
      };
    }
  }, [deviceInfo.isMobile]);

  return children;
});

MobileOptimizer.displayName = 'MobileOptimizer';

MobileOptimizer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MobileOptimizer;