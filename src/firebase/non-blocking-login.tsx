
'use client';
import {
  Auth, // Import Auth type for type hinting
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { setCookie } from 'cookies-next';

async function handleAuthSuccess(idToken: string) {
    const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${idToken}` }
    });
    if (!response.ok) {
        throw new Error('Failed to create session');
    }
    const { sessionCookie } = await response.json();
    setCookie('session', sessionCookie, {
        maxAge: 60 * 60 * 24 * 5, // 5 days
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<void> {
  return createUserWithEmailAndPassword(authInstance, email, password).then(async (userCredential) => {
    const idToken = await userCredential.user.getIdToken();
    await handleAuthSuccess(idToken);
  });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(authInstance, email, password).then(async (userCredential) => {
        const idToken = await userCredential.user.getIdToken();
        await handleAuthSuccess(idToken);
    });
}


/** Initiate Google sign-in (non-blocking). */
export function initiateGoogleSignIn(authInstance: Auth): Promise<void> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(authInstance, provider).then(async (userCredential) => {
        const idToken = await userCredential.user.getIdToken();
        await handleAuthSuccess(idToken);
    });
}

/** Sends a password reset email. */
export function sendPasswordReset(authInstance: Auth, email: string): Promise<void> {
    return sendPasswordResetEmail(authInstance, email);
}
