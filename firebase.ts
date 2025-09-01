import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkz9Pen_EfzhW1NrxKPtKXNKZKjdLqM-I",
  authDomain: "socialmedialiketrack.firebaseapp.com",
  projectId: "socialmedialiketrack",
  storageBucket: "socialmedialiketrack.firebasestorage.app",
  messagingSenderId: "339042819255",
  appId: "1:339042819255:web:5054b4b5ec2891571c0132",
  measurementId: "G-YPPYRNBBRY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };