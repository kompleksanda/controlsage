import { redirect } from 'next/navigation';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';

export default async function Home() {
  if (typeof window !== 'undefined') {
    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }
    const auth = getAuth();
    
    return new Promise<never>((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        unsubscribe();
        if (user) {
          redirect('/dashboard');
        } else {
          redirect('/login');
        }
      }, reject);
    });
  }

  redirect('/login');
}
