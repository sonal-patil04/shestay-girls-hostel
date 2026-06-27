/* ============================================================
   SHESTAY — FIREBASE CONFIGURATION
   
   HOW TO SET THIS UP (5 minutes):
   1. Go to https://console.firebase.google.com
   2. Click "Add project" → name it "shestay-hostel"
   3. Disable Google Analytics → Create project
   4. Click "Web" icon (</>)  → Register app as "shestay-web"
   5. Copy the firebaseConfig values shown and paste below
   6. Go to Firestore Database → Create database → Start in test mode
   7. Go to Authentication → Get started → Enable Email/Password
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, setDoc, getDoc }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ---- PASTE YOUR FIREBASE CONFIG HERE ---- */
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

/* ---- INIT ---- */
const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

/* ---- ADMIN CREDENTIALS (change these!) ---- */
const ADMIN_EMAIL    = "warden@shestay.in";
const ADMIN_PASSWORD = "Shestay@2026";

export { db, auth, collection, addDoc, getDocs, query, orderBy,
         serverTimestamp, doc, setDoc, getDoc,
         createUserWithEmailAndPassword, signInWithEmailAndPassword,
         signOut, onAuthStateChanged, ADMIN_EMAIL, ADMIN_PASSWORD };
