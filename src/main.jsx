import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import './index.css';
import App from './App.jsx';
import { AccessibilityProvider } from './context/AccessibilityContext.jsx';
import { initializeAnalytics, trackPerformance, trackUserEngagement } from './utils/analytics.js';
import { loadCriticalResources, registerServiceWorker } from './utils/performance.js';
import { preloadCriticalRoutes } from './utils/routePreloader.js';
import { runDevelopmentChecks } from './utils/buildOptimizations.js';

// Initialize analytics (will check consent automatically)
initializeAnalytics();

// Load critical resources for performance
loadCriticalResources();

// Register service worker for caching
registerServiceWorker();

// Register our enhanced service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Preload critical routes for faster navigation
preloadCriticalRoutes();

// Start performance and engagement tracking
trackPerformance();
const cleanupEngagement = trackUserEngagement();

// Run development optimization checks
runDevelopmentChecks();

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
