/**
 * Simple Animated Number Component - Bulletproof Version
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './AnimatedNumber.css';

const AnimatedNumber = ({
  endValue,
  duration = 2.5,
  prefix = '',
  suffix = '',
  label = '',
  className = ''
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef();
  const intervalRef = useRef();

  // Simple intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          startCounting();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [hasStarted]);

  // Simple counting function
  const startCounting = () => {
    const steps = 60; // 60 steps for smooth animation
    const increment = endValue / steps;
    const stepDuration = (duration * 1000) / steps;
    let currentStep = 0;

    intervalRef.current = setInterval(() => {
      currentStep++;
      const newValue = Math.min(increment * currentStep, endValue);
      setCurrentValue(Math.floor(newValue));

      if (currentStep >= steps) {
        setCurrentValue(endValue);
        clearInterval(intervalRef.current);
      }
    }, stepDuration);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={elementRef}
      className={`animated-number-container ${className}`}
      role="img"
      aria-label={`${prefix}${endValue.toLocaleString()}${suffix} ${label}`}
    >
      <div className="animated-number-display">
        <span className="animated-number-prefix">{prefix}</span>
        <span className="animated-number-value">
          {currentValue.toLocaleString()}
        </span>
        <span className="animated-number-suffix">{suffix}</span>
      </div>
      {label && (
        <div className="animated-number-label">
          {label}
        </div>
      )}
    </div>
  );
};

AnimatedNumber.propTypes = {
  endValue: PropTypes.number.isRequired,
  duration: PropTypes.number,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
};

export default AnimatedNumber;