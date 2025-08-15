import React, { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Optimized Image component with lazy loading and error handling
 */
const OptimizedImage = memo(({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  placeholder = '/src/assets/fixed/placeholder.webp',
  onLoad,
  onError,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(loading === 'eager' ? src : placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = useCallback((event) => {
    setImageLoaded(true);
    if (onLoad) onLoad(event);
  }, [onLoad]);

  const handleError = useCallback((event) => {
    setImageError(true);
    setImageSrc(placeholder);
    if (onError) onError(event);
  }, [onError, placeholder]);

  const handleIntersection = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && imageSrc === placeholder) {
      setImageSrc(src);
    }
  }, [src, imageSrc, placeholder]);

  // Set up intersection observer for lazy loading
  React.useEffect(() => {
    if (loading === 'lazy' && imageSrc === placeholder) {
      const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.1,
        rootMargin: '50px'
      });

      const imgElement = document.querySelector(`img[data-src="${src}"]`);
      if (imgElement) {
        observer.observe(imgElement);
      }

      return () => observer.disconnect();
    }
  }, [loading, imageSrc, placeholder, handleIntersection, src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${imageLoaded ? 'loaded' : 'loading'} ${imageError ? 'error' : ''}`}
      width={width}
      height={height}
      loading={loading}
      data-src={src}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.oneOf(['lazy', 'eager']),
  placeholder: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

export default OptimizedImage;