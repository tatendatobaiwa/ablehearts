import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import './index.css';
import App from './App.jsx';
import { AccessibilityProvider } from './context/AccessibilityContext.jsx';
import { initializeAnalytics, trackPerformance, trackUserEngagement } from './utils/analytics.js';
import { loadCriticalResources, registerServiceWorker } from './utils/performance.js';

// Initialize analytics (will check consent automatically)
initializeAnalytics();

// Load critical resources for performance
loadCriticalResources();

// Register service worker for caching
registerServiceWorker();

// Start performance and engagement tracking
trackPerformance();
const cleanupEngagement = trackUserEngagement();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (cleanupEngagement) {
    cleanupEngagement();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> 
      <AccessibilityProvider>
        <App />
      </AccessibilityProvider>
    </BrowserRouter>
  </StrictMode>
);
