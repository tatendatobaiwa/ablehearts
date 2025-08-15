import PropTypes from 'prop-types';
import './LoadingSkeleton.css';

const LoadingSkeleton = ({ 
  variant = 'text', 
  width = '100%', 
  height = '20px', 
  count = 1,
  className = '',
  animate = true 
}) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`skeleton ${variant} ${animate ? 'animate' : ''} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  ));

  return count === 1 ? skeletons[0] : <div className="skeleton-group">{skeletons}</div>;
};

LoadingSkeleton.propTypes = {
  variant: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  count: PropTypes.number,
  className: PropTypes.string,
  animate: PropTypes.bool
};

// Predefined skeleton components for common use cases
export const TextSkeleton = ({ lines = 3, ...props }) => (
  <LoadingSkeleton variant="text" count={lines} {...props} />
);

TextSkeleton.propTypes = {
  lines: PropTypes.number
};

export const ImageSkeleton = ({ width = '100%', height = '200px', ...props }) => (
  <LoadingSkeleton variant="image" width={width} height={height} {...props} />
);

ImageSkeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export const CardSkeleton = () => (
  <div className="skeleton-card">
    <ImageSkeleton height="150px" />
    <div className="skeleton-card-content">
      <LoadingSkeleton variant="title" width="80%" height="24px" />
      <TextSkeleton lines={2} />
      <LoadingSkeleton variant="button" width="120px" height="36px" />
    </div>
  </div>
);

export const EventCardSkeleton = () => (
  <div className="skeleton-event-card">
    <ImageSkeleton height="200px" />
    <div className="skeleton-event-overlay">
      <LoadingSkeleton variant="title" width="70%" height="20px" />
      <LoadingSkeleton variant="text" width="50%" height="16px" />
    </div>
  </div>
);

export default LoadingSkeleton;