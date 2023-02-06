import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDs6fDfBacnPtNuSpQMm0bbwFKZ7YeGgyE",
  authDomain: "oh-ju-79642.firebaseapp.com",
  projectId: "oh-ju-79642",
  storageBucket: "oh-ju-79642.appspot.com",
  messagingSenderId: "54704831310",
  appId: "1:54704831310:web:585a4ee7a356c8417b3c1f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const dbService = getFirestore(app);
