// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2iEx8R6QAFiuS1FZLfCEEIEMaTUrODs4",
  authDomain: "expense-tracker-7ddb1.firebaseapp.com",
  projectId: "expense-tracker-7ddb1",
  storageBucket: "expense-tracker-7ddb1.firebasestorage.app",
  messagingSenderId: "46680366511",
  appId: "1:46680366511:web:a7e3377da5f2ba600ae35a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

//database

export const firestore = getFirestore(app);
