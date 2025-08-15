// RENAME THIS FILE TO config.js AND ADD YOUR FIREBASE KEYS
// DO NOT COMMIT config.js TO VERSION CONTROL

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - Replace with your actual values
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE",
  measurementId: "YOUR_MEASUREMENT_ID_HERE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Analytics (with consent checking)
export const initializeFirebaseAnalytics = async () => {
  try {
    // Only initialize if a measurement ID is present
    if (!firebaseConfig.measurementId) return null;
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
    console.warn('Firebase Analytics not supported in this environment');
    return null;
  } catch (error) {
    console.error('Firebase Analytics initialization error:', error);
    return null;
  }
};

export default app;