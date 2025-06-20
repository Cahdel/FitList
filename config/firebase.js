// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCm2ksLygqFYC5xbPjp7gjCC4NVsxACx38",
  authDomain: "react-native-project-1-a2589.firebaseapp.com",
  projectId: "react-native-project-1-a2589",
  storageBucket: "react-native-project-1-a2589.firebasestorage.app",
  messagingSenderId: "108270222341",
  appId: "1:108270222341:web:41b722bdaea6582c5bb06c",
  measurementId: "G-KFPVNBLXWC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };