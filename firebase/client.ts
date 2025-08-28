import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9YTIlZ5OZpnuUeDEU_W2bJj9nesq37ew",
  authDomain: "prepai-1c37e.firebaseapp.com",
  projectId: "prepai-1c37e",
  storageBucket: "prepai-1c37e.firebasestorage.app",
  messagingSenderId: "696280323994",
  appId: "1:696280323994:web:7605249922e1ea6ffecc23",
  measurementId: "G-2PXKQZZ1WH",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
