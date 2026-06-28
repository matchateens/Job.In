import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAsNlHRPA8gbN34MjvDTvg0bqkFdpUjaI4",
  authDomain: "jobin-a41e9.firebaseapp.com",
  projectId: "jobin-a41e9",
  storageBucket: "jobin-a41e9.firebasestorage.app",
  messagingSenderId: "247458316538",
  appId: "1:247458316538:web:352a64474c3dda55534943",
  measurementId: "G-R95PRF3X4Q"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;

