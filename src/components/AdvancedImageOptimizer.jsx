import { memo, useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './AdvancedImageOptimizer.css';

/**
 * Advanced Image Optimizer with WebP/AVIF support, responsive images, and lazy loading
 */
const AdvancedImageOptimizer = memo(({
  src,
  alt,
  className = '',
  width,
  height,
  sizes = '100vw',
  loading = 'lazy',
  placeholder = '/src/assets/fixed/placeholder.webp',
  priority = false,
  onLoad,
  onError,
  ...props
}) => {
  const [imageState, setImageState] = useState({
    loaded: false,
    error: false,
    currentSrc: priority ? src : placeholder
  });
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Generate responsive image sources
  const generateSrcSet = useCallback((baseSrc) => {
    if (!baseSrc || baseSrc === placeholder) return '';
    
    const ext = baseSrc.split('.').pop();
    const baseName = baseSrc.replace(`.${ext}`, '');
    
    // Generate different sizes for responsive images
    const sizes = [400, 800, 1200, 1600];
    return sizes.map(size => `${baseName}-${size}w.webp ${size}w`).join(', ');
  }, [placeholder]);

  // Handle image load
  const handleLoad = useCallback((event) => {
    setImageState(prev => ({ ...prev, loaded: true }));
    if (onLoad) onLoad(event);
  }, [onLoad]);

  // Handle image error with fallback
  const handleError = useCallback((event) => {
    setImageState(prev => ({ 
      ...prev, 
      error: true, 
      currentSrc: placeholder 
    }));
    if (onError) onError(event);
  }, [onError, placeholder]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'lazy' && !priority && imgRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && imageState.currentSrc === placeholder) {
            setImageState(prev => ({ ...prev, currentSrc: src }));
            observerRef.current?.unobserve(imgRef.current);
          }
        },
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      );

      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, priority, src, placeholder, imageState.currentSrc]);

  // Preload critical images
  useEffect(() => {
    if (priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.type = 'image/webp';
      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [priority, src]);

  const srcSet = generateSrcSet(imageState.currentSrc);

  return (
    <picture>
      {/* AVIF format for modern browsers */}
      {imageState.currentSrc !== placeholder && (
        <source
          srcSet={srcSet.replace(/\.webp/g, '.avif')}
          sizes={sizes}
          type="image/avif"
        />
      )}
      
      {/* WebP format */}
      {imageState.currentSrc !== placeholder && (
        <source
          srcSet={srcSet}
          sizes={sizes}
          type="image/webp"
        />
      )}
      
      {/* Fallback image */}
      <img
        ref={imgRef}
        src={imageState.currentSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={`${className} advanced-image-optimizer ${imageState.loaded ? 'loaded' : 'loading'} ${imageState.error ? 'error' : ''}`}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </picture>
  );
});

AdvancedImageOptimizer.displayName = 'AdvancedImageOptimizer';

AdvancedImageOptimizer.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sizes: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  placeholder: PropTypes.string,
  priority: PropTypes.bool,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

export default AdvancedImageOptimizer;