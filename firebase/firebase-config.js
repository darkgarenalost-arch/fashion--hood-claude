import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCsN5GEgAPT58oPgny9YhYrcPYS9glGl4M",
  authDomain: "fashion-hood.firebaseapp.com",
  projectId: "fashion-hood",
  storageBucket: "fashion-hood.firebasestorage.app",
  messagingSenderId: "865023154240",
  appId: "1:865023154240:web:0822a34de176e47072e7a5",
  measurementId: "G-SQK00FKELK"
};

export const brandConfig = {
  brandName: "Fashion Hood",
  supportPhone: "918275872736",
  supportEmail: "fashionhood15@gmail.com",
  instagramUrl: "https://www.instagram.com/fashion_hood.official/",
  razorpayKeyId: "rzp_test_SkrMk3QzxEwhXD",
  currency: "INR",
  freeShippingAbove: 0,
  standardShipping: 0,
  codFee: 0,
  adminUids: [
    "PASTE_FIREBASE_ADMIN_UID_HERE"
  ]
};

const hasFirebaseConfig = !firebaseConfig.apiKey.includes("YOUR_") && !firebaseConfig.projectId.includes("YOUR_");

export const app = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const firebaseReady = Boolean(app);

