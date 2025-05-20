// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC-SyqEdFVsRMF3ix4uQT6kFRbG3UftsSA",
  authDomain: "oss-calendar-7419d.firebaseapp.com",
  projectId: "oss-calendar-7419d",
  storageBucket: "oss-calendar-7419d.firebasestorage.app",
  messagingSenderId: "794052003172",
  appId: "1:794052003172:web:cb82e1935bdaf7c5282671",
  measurementId: "G-H0ZQ96F47W"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// 인증 기능만 사용 (LoginPage, RegisterPage에서 사용)
export const auth = getAuth(app);
export const db = getFirestore(app);