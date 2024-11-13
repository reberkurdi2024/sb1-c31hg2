import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDEu6z640PTXTFOTz9DY_sb1_RxRIK1guE",
  authDomain: "pharmacy-a47be.firebaseapp.com",
  projectId: "pharmacy-a47be",
  storageBucket: "pharmacy-a47be.firebasestorage.app",
  messagingSenderId: "412341918042",
  appId: "1:412341918042:web:17390ca3514b002b987b63",
  measurementId: "G-BZWW38G41D"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);