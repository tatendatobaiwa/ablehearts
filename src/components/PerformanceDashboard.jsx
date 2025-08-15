import { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  useWebVitals, 
  useResourceMonitoring, 
  useMemoryMonitoring,
  usePerformanceOptimization 
} from '../hooks/usePerformanceMonitoring';
import './PerformanceDashboard.css';

/**
 * Performance Dashboard Component
 * Real-time performance monitoring and optimization insights
 */
const PerformanceDashboard = memo(({ isVisible = false }) => {
  const { vitals, getVitalScore } = useWebVitals();
  const { resources, slowResources, getTotalResourceSize } = useResourceMonitoring();
  const { memoryInfo, memoryWarning } = useMemoryMonitoring();
  const { recommendations } = usePerformanceOptimization();
  const [activeTab, setActiveTab] = useState('vitals');

  if (!isVisible || import.meta.env.PROD) {
    return null; // Only show in development
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getScoreColor = (score) => {
    switch (score) {
      case 'good': return '#10b981';
      case 'needs-improvement': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="performance-dashboard">
      <div className="dashboard-header">
        <h3>Performance Dashboard</h3>
        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'vitals' ? 'active' : ''}`}
            onClick={() => setActiveTab('vitals')}
          >
            Web Vitals
          </button>
          <button 
            className={`tab ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
          <button 
            className={`tab ${activeTab === 'memory' ? 'active' : ''}`}
            onClick={() => setActiveTab('memory')}
          >
            Memory
          </button>
          <button 
            className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === 'vitals' && (
          <div className="vitals-panel">
            <h4>Core Web Vitals</h4>
            <div className="vitals-grid">
              {Object.entries(vitals).map(([vital, data]) => {
                if (!data) return null;
                const score = getVitalScore(vital, data.value);
                return (
                  <div key={vital} className="vital-card">
                    <div className="vital-header">
                      <span className="vital-name">{vital.toUpperCase()}</span>
                      <span 
                        className="vital-score"
                        style={{ color: getScoreColor(score) }}
                      >
                        {score}
                      </span>
                    </div>
                    <div className="vital-value">
                      {vital === 'cls' ? data.value.toFixed(3) : formatTime(data.value)}
                    </div>
                    <div className="vital-description">
                      {vital === 'lcp' && 'Largest Contentful Paint'}
                      {vital === 'fid' && 'First Input Delay'}
                      {vital === 'cls' && 'Cumulative Layout Shift'}
                      {vital === 'fcp' && 'First Contentful Paint'}
                      {vital === 'ttfb' && 'Time to First Byte'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="resources-panel">
            <h4>Resource Performance</h4>
            <div className="resource-summary">
              <div className="summary-card">
                <span className="summary-label">Total Resources</span>
                <span className="summary-value">{resources.length}</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Total Size</span>
                <span className="summary-value">{formatBytes(getTotalResourceSize())}</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Slow Resources</span>
                <span className="summary-value warning">{slowResources.length}</span>
              </div>
            </div>

            {slowResources.length > 0 && (
              <div className="slow-resources">
                <h5>Slow Loading Resources</h5>
                <div className="resource-list">
                  {slowResources.slice(0, 5).map((resource, index) => (
                    <div key={index} className="resource-item">
                      <div className="resource-name">
                        {resource.name.split('/').pop()}
                      </div>
                      <div className="resource-details">
                        <span className="resource-type">{resource.type}</span>
                        <span className="resource-duration">{formatTime(resource.duration)}</span>
                        <span className="resource-size">{formatBytes(resource.size)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'memory' && (
          <div className="memory-panel">
            <h4>Memory Usage</h4>
            {memoryInfo ? (
              <div className="memory-info">
                <div className={`memory-card ${memoryWarning ? 'warning' : ''}`}>
                  <div className="memory-header">
                    <span>JavaScript Heap</span>
                    {memoryWarning && <span className="warning-badge">High Usage</span>}
                  </div>
                  <div className="memory-details">
                    <div className="memory-stat">
                      <span>Used:</span>
                      <span>{formatBytes(memoryInfo.used)}</span>
                    </div>
                    <div className="memory-stat">
                      <span>Total:</span>
                      <span>{formatBytes(memoryInfo.total)}</span>
                    </div>
                    <div className="memory-stat">
                      <span>Limit:</span>
                      <span>{formatBytes(memoryInfo.limit)}</span>
                    </div>
                    <div className="memory-stat">
                      <span>Usage:</span>
                      <span>{memoryInfo.usagePercentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="memory-bar">
                    <div 
                      className="memory-fill"
                      style={{ 
                        width: `${memoryInfo.usagePercentage}%`,
                        backgroundColor: memoryWarning ? '#ef4444' : '#10b981'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="memory-unavailable">
                Memory information not available in this browser
              </div>
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="recommendations-panel">
            <h4>Performance Recommendations</h4>
            {recommendations.length > 0 ? (
              <div className="recommendations-list">
                {recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-card">
                    <div className="recommendation-header">
                      <span className="recommendation-metric">{rec.metric}</span>
                      <span className="recommendation-priority">
                        {rec.suggestions?.length || 0} suggestions
                      </span>
                    </div>
                    <div className="recommendation-issue">
                      {rec.issue}
                    </div>
                    {rec.suggestions && (
                      <ul className="recommendation-suggestions">
                        {rec.suggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-recommendations">
                No performance issues detected. Great job! 🎉
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

PerformanceDashboard.displayName = 'PerformanceDashboard';

PerformanceDashboard.propTypes = {
  isVisible: PropTypes.bool,
};

export default PerformanceDashboard;