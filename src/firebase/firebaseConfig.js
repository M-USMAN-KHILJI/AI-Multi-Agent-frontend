import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth'

/**
 * Firebase Client Configuration
 * Keys are securely loaded from Vite environment variables (.env)
 * and are completely gitignored.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase (singleton pattern)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

// Auth instance & Google Provider
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Prompt to select account
googleProvider.setCustomParameters({
  prompt: 'select_account',
})

/**
 * Trigger Google Sign-In:
 * 1. Attempts `signInWithPopup`.
 * 2. If the browser blocks the popup (`auth/popup-blocked`), gracefully falls back to `signInWithRedirect`
 *    so authentication never fails.
 * @returns {Promise<{uid: string, name: string, email: string, photoURL: string, token: string} | null>}
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    const token = await user.getIdToken()

    return {
      uid: user.uid,
      name: user.displayName || user.email.split('@')[0],
      email: user.email,
      photoURL: user.photoURL,
      token,
    }
  } catch (error) {
    // If the browser blocked the popup, fallback seamlessly to full-page redirect
    if (error.code === 'auth/popup-blocked') {
      console.warn('Popup blocked by browser. Falling back to redirect...')
      await signInWithRedirect(auth, googleProvider)
      return null
    }
    console.error('Google Sign-In Error:', error)
    throw error
  }
}

/**
 * Check if the user is returning from a redirect flow
 */
export const checkGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth)
    if (result && result.user) {
      const user = result.user
      const token = await user.getIdToken()
      return {
        uid: user.uid,
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL,
        token,
      }
    }
    return null
  } catch (error) {
    console.error('Redirect result error:', error)
    throw error
  }
}

export default app
