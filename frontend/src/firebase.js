// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDY9MxtFIYuXJvcPQgzZaPUOiwabpVIZ7s",
  authDomain: "smart-bank-360.firebaseapp.com",
  projectId: "smart-bank-360",
  storageBucket: "smart-bank-360.firebasestorage.app",
  messagingSenderId: "367742280561",
  appId: "1:367742280561:web:58549820352a0d329d0cd0",
  measurementId: "G-46XGY5PJRD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app); 

//Exports
export { app, auth, db };
