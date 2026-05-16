import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js";

export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};

export const brandConfig = {
  brandName: "Fashion Hood",
  supportPhone: "919999999999",
  supportEmail: "support@fashionhood.in",
  instagramUrl: "https://www.instagram.com/",
  razorpayKeyId: "rzp_test_YOUR_KEY_ID",
  currency: "INR",
  freeShippingAbove: 1499,
  standardShipping: 79,
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

