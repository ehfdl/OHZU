import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// import { FIREBASE_CONFIG } from "./config";

// const firebaseConfig = {
//   apiKey: "AIzaSyDs6fDfBacnPtNuSpQMm0bbwFKZ7YeGgyE",
//   authDomain: "oh-ju-79642.firebaseapp.com",
//   projectId: "oh-ju-79642",
//   storageBucket: "oh-ju-79642.appspot.com",
//   messagingSenderId: "54704831310",
//   appId: "1:54704831310:web:585a4ee7a356c8417b3c1f",
// };

// const firebaseConfig = FIREBASE_CONFIG;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const dbService = getFirestore(app);
export const authService = getAuth(app);
export const storageService = getStorage(app);
