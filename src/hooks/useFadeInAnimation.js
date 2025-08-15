import { useEffect } from 'react';

/**
 * Custom hook to handle fade-in animations for page elements
 * @param {string} containerSelector - CSS selector for the container to observe elements within
 * @param {Object} options - IntersectionObserver options
 */
export const useFadeInAnimation = (containerSelector = '', options = {}) => {
  useEffect(() => {
    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      ...options
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      defaultOptions
    );

    // Select elements to animate
    const selector = containerSelector 
      ? `${containerSelector} .pre-animate, ${containerSelector} .pre-animate-left, ${containerSelector} .pre-animate-right, ${containerSelector} .pre-animate-scale`
      : '.pre-animate, .pre-animate-left, .pre-animate-right, .pre-animate-scale';
    
    const elementsToAnimate = document.querySelectorAll(selector);
    
    if (elementsToAnimate.length === 0) return;

    elementsToAnimate.forEach((element) => observer.observe(element));

    return () => {
      elementsToAnimate.forEach((element) => {
        if (element) {
          observer.unobserve(element);
        }
      });
      observer.disconnect();
    };
  }, [containerSelector, options]);
};

/**
 * Hook specifically for page-level fade-in animation
 */
export const usePageFadeIn = () => {
  useEffect(() => {
    // Add page fade-in class to the main content
    const pageWrapper = document.querySelector('.page-wrapper');
    if (pageWrapper) {
      pageWrapper.classList.add('page-fade-in');
    }

    // Cleanup function
    return () => {
      if (pageWrapper) {
        pageWrapper.classList.remove('page-fade-in');
      }
    };
  }, []);
};