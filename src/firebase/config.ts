import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAJRtmr7t-x8YPXkfqaaSaPwTayGG3bbuQ",
  authDomain: "zupchat-bd3de.firebaseapp.com",
  projectId: "zupchat-bd3de",
  storageBucket: "zupchat-bd3de.firebasestorage.app",
  messagingSenderId: "362889592732",
  appId: "1:362889592732:web:cdb8e18c3cada9d4a35259"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);