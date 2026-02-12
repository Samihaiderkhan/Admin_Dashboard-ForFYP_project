// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASQvbFspCA6JDl1wwjQrOFMIMZw9h6PCY",
  authDomain: "fypproject-9294d.firebaseapp.com",
  projectId: "fypproject-9294d",
  storageBucket: "fypproject-9294d.firebasestorage.app",
  messagingSenderId: "493626225592",
  appId: "1:493626225592:web:3aa801076e9289317a954d",
  measurementId: "G-8KBQ0XC6P5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);