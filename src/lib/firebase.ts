import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDZWwMg4vm9CunbV_EpIMQBGwhENPH-xqk",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "pingpong-league-manager.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "pingpong-league-manager",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "pingpong-league-manager.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1038140603519",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1038140603519:web:fc15ae0d32fb10ab8b534a",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && useEmulator) {
  console.log('🔧 Using Firebase Emulators for development');
  try { 
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true }); 
    console.log('📱 Auth emulator connected'); 
  } catch (error) { 
    console.log('Auth emulator connection failed:', error); 
  }
  try { 
    connectFirestoreEmulator(db, 'localhost', 8080); 
    console.log('🗄️ Firestore emulator connected'); 
  } catch (error) { 
    console.log('Firestore emulator connection failed:', error); 
  }
  try { 
    connectStorageEmulator(storage, 'localhost', 9199); 
    console.log('📦 Storage emulator connected'); 
  } catch (error) { 
    console.log('Storage emulator connection failed:', error); 
  }
} else {
  console.log(`🔥 Using ${process.env.NODE_ENV} Firebase services`);
}

export default app;
