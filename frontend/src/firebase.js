// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-9ff15.firebaseapp.com",
  projectId: "mern-auth-9ff15",
  storageBucket: "mern-auth-9ff15.appspot.com",
  messagingSenderId: "1093502984738",
  appId: "1:1093502984738:web:fad0b829eb5c45c482e07b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);