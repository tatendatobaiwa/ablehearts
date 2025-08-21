/**
 * Route preloading utility for better performance
 * Preloads route components on hover/focus for instant navigation
 */

// Store preloaded components to avoid duplicate requests
const preloadedRoutes = new Set();

/**
 * Preload a route component
 * @param {Function} importFunction - The dynamic import function
 * @param {string} routeName - Name of the route for tracking
 */
export const preloadRoute = async (importFunction, routeName) => {
  if (preloadedRoutes.has(routeName)) {
    return; // Already preloaded
  }

  try {
    await importFunction();
    preloadedRoutes.add(routeName);
    console.log(`Route preloaded: ${routeName}`);
  } catch (error) {
    console.warn(`Failed to preload route ${routeName}:`, error);
  }
};

/**
 * Route definitions for preloading
 */
export const ROUTE_IMPORTS = {
  home: () => import('../pages/Home/Home.jsx'),
  programs: () => import('../pages/ProgramsAndInitiatives/ProgramsAndInitiatives.jsx'),
  getInvolved: () => import('../pages/GetInvolved/GetInvolved.jsx'),
  shop: () => import('../pages/Shop/Shop.jsx'),
  aboutUs: () => import('../pages/AboutUs/AboutUs.jsx'),
  termsOfUse: () => import('../pages/TermsOfUse/TermsOfUse.jsx'),
  gallery: () => import('../pages/Gallery/Gallery.jsx'),
  ubApp: () => import('../pages/UBApp/UBApp.jsx'),
  biustApp: () => import('../pages/BIUSTApp/BIUSTApp.jsx'),
  privacyPolicy: () => import('../pages/PrivacyPolicy/PrivacyPolicy.jsx'),
};

/**
 * Map route paths to route names used in ROUTE_IMPORTS
 */
export const PATH_TO_ROUTE_NAME = {
  '/': 'home',
  '/programs-and-initiatives': 'programs',
  '/get-involved': 'getInvolved',
  '/shop': 'shop',
  '/about-us': 'aboutUs',
  '/terms-of-use': 'termsOfUse',
  '/gallery': 'gallery',
  '/ablehearts-ub': 'ubApp',
  '/ablehearts-biust': 'biustApp',
  '/privacy-policy': 'privacyPolicy',
};

/**
 * Resolve a route name from a given path
 * @param {string} path
 * @returns {string | undefined}
 */
export const getRouteNameByPath = (path) => PATH_TO_ROUTE_NAME[path];

/**
 * Preload route by path
 * @param {string} path
 */
export const preloadPath = (path) => {
  const routeName = getRouteNameByPath(path);
  if (routeName && ROUTE_IMPORTS[routeName]) {
    preloadRoute(ROUTE_IMPORTS[routeName], routeName);
  }
};

/**
 * Create preload handlers for a route path
 * @param {string} path
 * @returns {Object} Event handlers or empty object
 */
export const createPreloadHandlersForPath = (path) => {
  const routeName = getRouteNameByPath(path);
  if (!routeName) return {};
  return createPreloadHandlers(routeName);
};

/**
 * Preload critical routes on app initialization
 */
export const preloadCriticalRoutes = () => {
  // Preload most commonly visited pages
  const criticalRoutes = ['home', 'aboutUs', 'programs'];
  
  criticalRoutes.forEach(route => {
    if (ROUTE_IMPORTS[route]) {
      // Use requestIdleCallback for non-blocking preloading
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          preloadRoute(ROUTE_IMPORTS[route], route);
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          preloadRoute(ROUTE_IMPORTS[route], route);
        }, 100);
      }
    }
  });
};

/**
 * Create preload handlers for navigation elements
 * @param {string} routeName - Name of the route to preload
 * @returns {Object} Event handlers for onMouseEnter, onMouseLeave, and onFocus
 */
export const createPreloadHandlers = (routeName) => {
  let preloadTimeout;

  const handlePreload = () => {
    // Check for slow network conditions
    if (navigator.connection && (navigator.connection.saveData || /2g|slow-2g/.test(navigator.connection.effectiveType))) {
      return; // Don't preload on slow networks
    }

    if (ROUTE_IMPORTS[routeName]) {
      preloadRoute(ROUTE_IMPORTS[routeName], routeName);
    }
  };

  const startPreload = () => {
    preloadTimeout = setTimeout(handlePreload, 200); // 200ms delay
  };

  const cancelPreload = () => {
    clearTimeout(preloadTimeout);
  };

  return {
    onMouseEnter: startPreload,
    onMouseLeave: cancelPreload,
    onFocus: handlePreload, // Preload immediately on focus
  };
};

/**
 * Hook for preloading routes in components
 */
export const useRoutePreloader = () => {
  return {
    preloadRoute: (routeName) => {
      if (ROUTE_IMPORTS[routeName]) {
        preloadRoute(ROUTE_IMPORTS[routeName], routeName);
      }
    },
    createPreloadHandlers,
    preloadCriticalRoutes,
  };
};