import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../firebase.config.js";

/**
 * Creates a new user account with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<UserCredential>}
 */
export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Signs in an existing user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<UserCredential>}
 */
export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Signs out the current user.
 * @returns {Promise<void>}
 */
export const signOutUser = () => {
  return signOut(auth);
};

/**
 * Subscribes to authentication state changes.
 * @param {(user: User | null) => void} callback - The function to call when the auth state changes.
 * @returns {import("firebase/auth").Unsubscribe} The unsubscribe function.
 */
export const onAuthChange = (callback) => {
  return onFirebaseAuthStateChanged(auth, callback);
};
