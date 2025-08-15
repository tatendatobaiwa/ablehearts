import PropTypes from 'prop-types';
import Button from '../UI/Button';

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
      style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '0.5rem',
        margin: '1rem'
      }}
      role="alert"
    >
      <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>
        {message}
      </h2>
      <p style={{ color: '#7f1d1d', marginBottom: '1.5rem' }}>
        We apologize for the inconvenience. Please try again or contact support if the problem persists.
      </p>
      
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
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
        <details style={{ marginTop: '1rem', textAlign: 'left' }}>
          <summary style={{ cursor: 'pointer', color: '#7f1d1d' }}>
            Error Details (Development)
          </summary>
          <pre style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '1rem', 
            borderRadius: '0.25rem',
            overflow: 'auto',
            fontSize: '0.875rem',
            color: '#374151',
            marginTop: '0.5rem'
          }}>
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