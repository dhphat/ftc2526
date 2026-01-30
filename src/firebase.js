import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAQzxZOV1d1VpC2YDSfo-jjhNrIFDm4UMo",
    authDomain: "live-ftc.firebaseapp.com",
    projectId: "live-ftc",
    storageBucket: "live-ftc.firebasestorage.app",
    messagingSenderId: "258953156273",
    appId: "1:258953156273:web:d9546a732b28e986f1b490"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
