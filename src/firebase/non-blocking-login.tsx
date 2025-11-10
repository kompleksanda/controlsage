
'use client';
import {
  Auth, // Import Auth type for type hinting
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { getFirestore, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from './non-blocking-updates';
import { getApp } from 'firebase/app';


/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance);
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<void> {
  return createUserWithEmailAndPassword(authInstance, email, password).then(() => {});
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(authInstance, email, password).then((userCredential) => {
        const user = userCredential.user;
        if (user && user.email === 'bynarikompleks@gmail.com') {
            const firestore = getFirestore(getApp());
            const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
            setDocumentNonBlocking(adminRoleRef, {
                id: user.uid,
                email: user.email,
            }, { merge: true });
        }
    });
}


/** Initiate Google sign-in (non-blocking). */
export function initiateGoogleSignIn(authInstance: Auth): Promise<void> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(authInstance, provider).then(() => {});
}

/** Sends a password reset email. */
export function sendPasswordReset(authInstance: Auth, email: string): Promise<void> {
    return sendPasswordResetEmail(authInstance, email);
}
