// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCJNe4mbM5WUZeK73YY5qS7mUi7PklKsTo',
  authDomain: 'palette-creator-f5cfb.firebaseapp.com',
  projectId: 'palette-creator-f5cfb',
  storageBucket: 'palette-creator-f5cfb.appspot.com',
  messagingSenderId: '722337253321',
  appId: '1:722337253321:web:942a445d7c0b57a5658a18',
  measurementId: 'G-BNL4PBCK3H'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore()
const analytics = getAnalytics(app)
