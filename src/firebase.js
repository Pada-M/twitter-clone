import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKZm3p50sQHQwku8pvB1iiKUI6S-rYUS4",
  authDomain: "twitter-clone-43150.firebaseapp.com",
  projectId: "twitter-clone-43150",
  storageBucket: "twitter-clone-43150.firebasestorage.app",
  messagingSenderId: "192627730833",
  appId: "1:192627730833:web:ba31230884b9aa9a509230",
  measurementId: "G-9JGYGP890W"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
