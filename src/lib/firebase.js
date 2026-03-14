// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
];

const missingVars = requiredEnvVars.filter(v => !import.meta.env[v]);

if (missingVars.length > 0) {
    console.error(`Missing required Firebase config: ${missingVars.join(', ')}`);
    if (import.meta.env.DEV) {
        throw new Error(`Missing required Firebase config: ${missingVars.join(', ')}`);
    }
}

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if required config exists
export const app = missingVars.length === 0 ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore() : null;
