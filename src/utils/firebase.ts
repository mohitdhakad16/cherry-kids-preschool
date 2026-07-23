// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// 1. Add the Firestore import line here:
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3b8MjoDqrgbMsATIkM__g-A0rrxY3kFA",
  authDomain: "cherrykidspreschooluran-466c4.firebaseapp.com",
  projectId: "cherrykidspreschooluran-466c4",
  storageBucket: "cherrykidspreschooluran-466c4.firebasestorage.app",
  messagingSenderId: "419949262787",
  appId: "1:419949262787:web:3f8f1ee3bfa02f139c6f76",
  measurementId: "G-C038G4XRP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
// 2. Initialize and export the database service instance here:
export const db = getFirestore(app);
export const storage = getStorage(app);