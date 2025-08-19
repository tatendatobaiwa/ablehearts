import React from 'react';
import './LoadingSkeleton.css';

/**
 * Page-specific loading skeleton for better UX
 */
const PageLoadingSkeleton = () => {
  return (
    <div className="page-loading-skeleton" role="status" aria-label="Loading page content">
      {/* Header skeleton */}
      <div className="skeleton-header">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-subtitle"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="skeleton-content">
        <div className="skeleton-paragraph">
          <div className="skeleton-line skeleton-text"></div>
          <div className="skeleton-line skeleton-text"></div>
          <div className="skeleton-line skeleton-text short"></div>
        </div>
        
        <div className="skeleton-image"></div>
        
        <div className="skeleton-paragraph">
          <div className="skeleton-line skeleton-text"></div>
          <div className="skeleton-line skeleton-text"></div>
        </div>
      </div>
      
      <span className="sr-only">Loading page content, please wait...</span>
    </div>
  );
};

export default PageLoadingSkeleton;