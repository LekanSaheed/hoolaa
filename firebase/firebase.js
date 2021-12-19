import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  Timestamp,
  onSnapshot,
  where,
  query,
} from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBhp8fz3grZ-AqRvJl_JcnSyNSGXY6ai9I",
  authDomain: "hoolaa-1.firebaseapp.com",
  projectId: "hoolaa-1",
  storageBucket: "hoolaa-1.appspot.com",
  messagingSenderId: "884564999196",
  appId: "1:884564999196:web:1c03675845f6bb735773d9",
  measurementId: "G-KSLVL3EBQS",
};
// if (!Firebase.apps.length) {
//   Firebase.initializeApp(FirebaseCredentials);
// }
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {
  db,
  query,
  collection,
  onSnapshot,
  getDocs,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setDoc,
  doc,
  where,
  signOut,
  sendEmailVerification,
  Timestamp,
};
