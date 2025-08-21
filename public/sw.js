// Service Worker for Able Hearts Foundation
// Provides offline functionality and caching strategies


const STATIC_CACHE = 'ablehearts-static-v1.0.0';
const DYNAMIC_CACHE = 'ablehearts-dynamic-v1.0.0';
const IMAGE_CACHE = 'ablehearts-images-v1.0.0';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/ableheartslogo.webp',
  '/robots.txt'
];

// Critical images to cache
const CRITICAL_IMAGES = [
  '/ableheartslogo.webp',
  '/src/assets/fixed/landingpageimage.webp',
  '/src/assets/fixed/placeholder.webp'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache critical images
      caches.open(IMAGE_CACHE).then((cache) => {
        console.log('Service Worker: Caching critical images');
        return cache.addAll(CRITICAL_IMAGES);
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests (except fonts and images)
  if (url.origin !== location.origin && 
      !url.hostname.includes('fonts.googleapis.com') &&
      !url.hostname.includes('fonts.gstatic.com')) {
    return;
  }

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Cache First for static assets
    if (isStaticAsset(url.pathname)) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // Strategy 2: Cache First for images
    if (isImage(url.pathname)) {
      return await cacheFirst(request, IMAGE_CACHE);
    }
    
    // Strategy 3: Network First for API calls
    if (isAPICall(url.pathname)) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
    
    // Strategy 4: Stale While Revalidate for pages
    return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.error('Service Worker: Fetch error:', error);
    
    // Return offline fallback
    if (isNavigationRequest(request)) {
      const cache = await caches.open(STATIC_CACHE);
      return cache.match('/index.html');
    }
    
    // Return placeholder for images
    if (isImage(url.pathname)) {
      const cache = await caches.open(IMAGE_CACHE);
      return cache.match('/src/assets/fixed/placeholder.webp');
    }
    
    throw error;
  }
}

// Cache First strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  const response = await fetch(request);
  
  if (response.status === 200) {
    cache.put(request, response.clone());
  }
  
  return response;
}

// Network First strategy
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    throw error;
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Network failed, return cached version if available
    return cached;
  });
  
  return cached || fetchPromise;
}

// Helper functions
function isStaticAsset(pathname) {
  return pathname.includes('.js') || 
         pathname.includes('.css') || 
         pathname.includes('.woff') || 
         pathname.includes('.woff2') ||
         pathname === '/' ||
         pathname === '/index.html' ||
         pathname === '/manifest.json';
}

function isImage(pathname) {
  return pathname.includes('.webp') || 
         pathname.includes('.jpg') || 
         pathname.includes('.jpeg') || 
         pathname.includes('.png') || 
         pathname.includes('.gif') || 
         pathname.includes('.svg') ||
         pathname.includes('.avif');
}

function isAPICall(pathname) {
  return pathname.includes('/api/') || 
         pathname.includes('firebase') ||
         pathname.includes('emailjs');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && 
          request.headers.get('accept').includes('text/html'));
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(processOfflineActions());
  }
});

async function processOfflineActions() {
  // Process any offline form submissions stored in IndexedDB
  console.log('Service Worker: Processing offline actions');
  
  // This would integrate with your form submission logic
  // to retry failed submissions when back online
}

// Push notifications (if needed in the future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/ableheartslogo.webp',
      badge: '/ableheartslogo.webp',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'Learn More',
          icon: '/ableheartslogo.webp'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/ableheartslogo.webp'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

console.log('Service Worker: Loaded successfully');