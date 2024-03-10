import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBvpY26DB5oI9rnFtp6asSlAA_C0qgRNNI",
  authDomain: "dreamboxc-24ca8.firebaseapp.com",
  projectId: "dreamboxc-24ca8",
  storageBucket: "dreamboxc-24ca8.appspot.com",
  messagingSenderId: "440363268283",
  appId: "1:440363268283:web:2f1d6c96ad9a601925519e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db: any = getFirestore(app);