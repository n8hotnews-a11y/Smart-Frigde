// IMPORTANT: To connect to your Firebase project, replace the placeholder
// configuration below with the actual configuration from your Firebase Console.
//
// 1. Go to the Firebase Console: https://console.firebase.google.com/
// 2. Select your project.
// 3. Go to Project Settings (gear icon) > General tab.
// 4. In the "Your apps" section, find your web app and copy the config object.
// 5. In the Firebase Console, go to Authentication > Sign-in method and enable Email/Password.

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Example Firebase Configuration (REPLACE WITH YOUR OWN):
const firebaseConfig = {
  apiKey: "AIza....", // <-- PASTE YOURS HERE
  authDomain: "your-project-id.firebaseapp.com", // <-- PASTE YOURS HERE
  projectId: "your-project-id", // <-- PASTE YOURS HERE
  storageBucket: "your-project-id.appspot.com", // <-- PASTE YOURS HERE
  messagingSenderId: "...", // <-- PASTE YOURS HERE
  appId: "1:..." // <-- PASTE YOURS HERE
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
