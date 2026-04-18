// ── Firebase Configuration for Live Chat ──
// Replace these values with your actual Firebase project config
// from Firebase Console → Project Settings → General → Your apps → Web app
// Note: Firebase Storage has been replaced with Supabase Storage (free tier compatible)

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { getAuth, signInWithCustomToken } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const firebaseConfig = {
    apiKey: "__FIREBASE_API_KEY__",
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
export const auth = getAuth(app);

/**
 * Supabase login ပြီးတိုင်း ဒီ function ကို ခေါ်ပါ
 * Supabase access token ကို Netlify Function ဆီ ပို့ပြီး
 * Firebase Custom Token ပြန်ယူကာ Firebase Auth ကိုပါ sign in လုပ်ပေးပါတယ်
 *
 * @param {string} supabaseAccessToken - Supabase session.access_token
 * @returns {Promise<object>} Firebase user object
 */
export async function signInToFirebase(supabaseAccessToken) {
    try {
        // Already signed in check
        if (auth.currentUser) {
            console.log('✅ Firebase Auth already signed in:', auth.currentUser.uid);
            return auth.currentUser;
        }

        const response = await fetch('/.netlify/functions/firebase-auth-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseAccessToken}`
            }
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `HTTP ${response.status}`);
        }

        const { token } = await response.json();
        const userCredential = await signInWithCustomToken(auth, token);
        console.log('✅ Firebase Auth signed in:', userCredential.user.uid);
        return userCredential.user;
    } catch (error) {
        console.error('❌ Firebase Auth sign-in failed:', error);
        throw error;
    }
}
