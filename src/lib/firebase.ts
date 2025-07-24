import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhWBZzdix9WuxEQHfH9Zhdqg46p7RMLSQ",
  authDomain: "albums-b1e10.firebaseapp.com",
  projectId: "albums-b1e10",
  storageBucket: "albums-b1e10.firebasestorage.app",
  messagingSenderId: "165685425478",
  appId: "1:165685425478:web:3a182aa6e567aac80fe147",
  measurementId: "G-XTHDJM04LF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
    app, db, auth
}