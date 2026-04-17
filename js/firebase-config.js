// ── Firebase Configuration for Live Chat ──
// Replace these values with your actual Firebase project config
// from Firebase Console → Project Settings → General → Your apps → Web app
// Note: Firebase Storage has been replaced with Supabase Storage (free tier compatible)

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyAbE-EAUCsBRASj2iTm9pGiN2Vb2ROSZOw",
    authDomain: "ado-chat-app.firebaseapp.com",
    databaseURL: "https://ado-chat-app-default-rtdb.firebaseio.com",
    projectId: "ado-chat-app",
    storageBucket: "ado-chat-app.firebasestorage.app",
    messagingSenderId: "554741177320",
    appId: "1:554741177320:web:0b387a1e8df94eeeca225d",
    measurementId: "G-N9KL5G3YPT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
