
'use client';
import {
  Auth, // Import Auth type for type hinting
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { Firestore, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from './non-blocking-updates';

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<void> {
  return createUserWithEmailAndPassword(authInstance, email, password).then(() => {});
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, firestore: Firestore, email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(authInstance, email, password).then((userCredential) => {
        // This is the special admin user.
        if (userCredential.user.email === 'bynarikompleks@gmail.com') {
            const adminRoleRef = doc(firestore, 'roles_admin', userCredential.user.uid);
            setDocumentNonBlocking(adminRoleRef, { 
                id: userCredential.user.uid,
                email: userCredential.user.email
            }, { merge: true });
        }
    });
}


/** Initiate Google sign-in (non-blocking). */
export function initiateGoogleSignIn(authInstance: Auth): Promise<void> {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(authInstance, provider).then(() => {});
}

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): Promise<void> {
  return signInAnonymously(authInstance).then(() => {});
}

/** Sends a password reset email. */
export function sendPasswordReset(authInstance: Auth, email: string): Promise<void> {
    return sendPasswordResetEmail(authInstance, email);
}
