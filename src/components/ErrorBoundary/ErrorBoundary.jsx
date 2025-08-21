import React from 'react';
import PropTypes from 'prop-types';
import { createLogger } from '../../utils/logger';
import './ErrorBoundary.css';

const logger = createLogger('ErrorBoundary');

/**
 * Error Boundary component to catch and handle React errors gracefully
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    logger.error('React Error Boundary caught an error:', {
      error: error.toString(),
      errorInfo,
      stack: error.stack
    });

    this.setState({
      error,
      errorInfo
    });

    // You could also log the error to an error reporting service here
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
                <div className="error-boundary">
          <h2 className="error-boundary-title">
            Something went wrong
          </h2>
          <p className="error-boundary-message">
            We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
          </p>
          <button
            onClick={this.handleRetry}
            className="error-boundary-button retry"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="error-boundary-button refresh"
          >
            Refresh Page
          </button>
          
          {import.meta.env.DEV && this.state.error && (
            <details className="error-details-container">
              <summary className="error-details-summary">
                Error Details (Development)
              </summary>
              <pre className="error-details-pre">
                {this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  onError: PropTypes.func,
};

export default ErrorBoundary;