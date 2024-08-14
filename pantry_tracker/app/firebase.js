// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD4aclzCiw5tQ2lUzhcRppPUADxtS_JGMg",
    authDomain: "pantry-tracker-23a07.firebaseapp.com",
    projectId: "pantry-tracker-23a07",
    storageBucket: "pantry-tracker-23a07.appspot.com",
    messagingSenderId: "162657264228",
    appId: "1:162657264228:web:28d40c19bf1f2938ba7571",
    measurementId: "G-KPCCM11916",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, firestore, firebaseConfig, analytics };
