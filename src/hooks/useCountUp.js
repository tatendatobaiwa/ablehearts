/**
 * Custom hook for animated counting up numbers
 * Provides smooth animation from 0 to target value
 */

import { useState, useEffect, useRef } from 'react';

/**
 * Hook for animating numbers with easing
 * @param {number} end - Target number to count to
 * @param {number} duration - Animation duration in milliseconds
 * @param {number} start - Starting number (default: 0)
 * @param {boolean} trigger - Whether to start animation
 * @param {function} easingFunction - Easing function for animation
 * @returns {number} Current animated value
 */
export const useCountUp = (
  end, 
  duration = 2000, 
  start = 0, 
  trigger = true,
  easingFunction = (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const frameRef = useRef();
  const startTimeRef = useRef();

  useEffect(() => {
    if (!trigger || isAnimating) return;

    setIsAnimating(true);
    startTimeRef.current = null;

    const animate = (currentTime) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Apply easing function
      const easedProgress = easingFunction(progress);
      
      // Calculate current value
      const currentValue = start + (end - start) * easedProgress;
      setCount(currentValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
        setIsAnimating(false);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, start, trigger, easingFunction, isAnimating]);

  return Math.floor(count);
};

/**
 * Hook for intersection observer to trigger animations when in view
 * @param {Object} options - Intersection observer options
 * @returns {Array} [ref, isIntersecting] - Ref to attach and intersection state
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasTriggered) {
        setIsIntersecting(true);
        setHasTriggered(true); // Only trigger once
      }
    }, {
      threshold: 0.3, // Trigger when 30% visible
      rootMargin: '0px 0px -50px 0px', // Trigger slightly before fully visible
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasTriggered, options]);

  return [ref, isIntersecting];
};

/**
 * Combined hook for count up animation triggered by intersection
 * @param {number} end - Target number
 * @param {number} duration - Animation duration
 * @param {Object} observerOptions - Intersection observer options
 * @returns {Array} [ref, count] - Ref to attach and current count
 */
export const useCountUpOnView = (end, duration = 2000, observerOptions = {}) => {
  const [ref, isIntersecting] = useIntersectionObserver(observerOptions);
  const count = useCountUp(end, duration, 0, isIntersecting);
  
  return [ref, count];
};

export default useCountUp;