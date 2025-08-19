import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import PageLoadingSkeleton from './PageLoadingSkeleton';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

/**
 * Wrapper component for lazy-loaded components
 * Provides loading state and error handling
 */
const LazyLoadWrapper = ({ 
  children, 
  fallback = <PageLoadingSkeleton />, 
  errorFallback = <div>Failed to load page</div> 
}) => {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

LazyLoadWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  errorFallback: PropTypes.node,
};

export default LazyLoadWrapper;