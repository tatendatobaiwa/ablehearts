import PropTypes from 'prop-types';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = 'Loading...', 
  showText = true,
  className = '' 
}) => {
  return (
    <div className={`loading-spinner-container ${size} ${className}`} role="status" aria-label={text}>
      <div className={`loading-spinner ${color}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {showText && <span className="loading-text">{text}</span>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.string,
  showText: PropTypes.bool,
  className: PropTypes.string
};

export default LoadingSpinner;