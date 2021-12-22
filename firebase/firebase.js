import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  Timestamp,
  onSnapshot,
  where,
  query,
  addDoc,
  orderBy,
  limit,
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
  addDoc,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  getDoc,
  orderBy,
  limit,
};
