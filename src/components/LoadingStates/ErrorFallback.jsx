import PropTypes from 'prop-types';
import Button from '../UI/Button';
import './ErrorFallback.css';

/**
 * Reusable error fallback component for error boundaries
 * @param {Object} props - Component props
 * @param {Error} props.error - The error that occurred
 * @param {Function} props.resetError - Function to reset the error state
 * @param {string} props.message - Custom error message
 */
const ErrorFallback = ({ 
  error, 
  resetError, 
  message = "Something went wrong" 
}) => {
  return (
    <div 
      className="error-fallback"
      role="alert"
    >
      <h2 className="error-fallback__title">
        {message}
      </h2>
      <p className="error-fallback__message">
        We apologize for the inconvenience. Please try again or contact support if the problem persists.
      </p>
      
      <div className="error-fallback__actions">
        <Button 
          variant="primary" 
          onClick={resetError}
          trackingName="error_retry"
        >
          Try Again
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => window.location.reload()}
          trackingName="error_refresh"
        >
          Refresh Page
        </Button>
      </div>
      
      {import.meta.env.DEV && error && (
        <details className="error-fallback__details">
          <summary className="error-fallback__summary">
            Error Details (Development)
          </summary>
          <pre className="error-fallback__code">
            {error.toString()}
          </pre>
        </details>
      )}
    </div>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.instanceOf(Error),
  resetError: PropTypes.func.isRequired,
  message: PropTypes.string,
};

export default ErrorFallback;