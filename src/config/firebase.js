import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDQWjCu63SijLcFmGGWWRcvOw6TdMecC2o",
  authDomain: "calorie-tracker-4eb29.firebaseapp.com",
  projectId: "calorie-tracker-4eb29",
  storageBucket: "calorie-tracker-4eb29.firebasestorage.app",
  messagingSenderId: "369901838873",
  appId: "1:369901838873:web:3861990d3624ec29cb4088",
  measurementId: "G-23D5P814H4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, analytics }; 