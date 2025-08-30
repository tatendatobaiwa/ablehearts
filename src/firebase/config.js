// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Analytics (with consent checking)
export const initializeFirebaseAnalytics = async () => {
  try {
    // Check if measurement ID exists and is not empty
    if (!firebaseConfig.measurementId || firebaseConfig.measurementId.trim() === '') {
      console.info('[Analytics] Analytics disabled - no measurement ID provided');
      return null;
    }
    
    const supported = await isSupported();
    if (supported) {
      console.info('[Analytics] Analytics initialized successfully');
      return getAnalytics(app);
    }
    console.warn('[Analytics] Firebase Analytics not supported in this environment');
    return null;
  } catch (error) {
    console.error('[Analytics] Firebase Analytics initialization error:', error);
    return null;
  }
};

export default app;