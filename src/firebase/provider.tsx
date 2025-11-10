'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'
import { useDoc } from './firestore/use-doc';
import { setDocumentNonBlocking } from './non-blocking-updates';

// Define the shape of the user profile document in Firestore
interface UserProfile {
    role: 'Admin' | 'Control Owner' | 'Auditor' | 'Viewer';
}

// Internal state for user authentication
interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Internal state for user role
interface UserRoleState {
    baseRole: UserProfile['role'] | null;
    activeRole: UserProfile['role'] | null;
    isRoleLoading: boolean;
    roleError: Error | null;
    setActiveRole: (role: UserProfile['role']) => void;
}


// Combined state for the Firebase context
export interface FirebaseContextState extends UserRoleState {
  areServicesAvailable: boolean; // True if core services (app, firestore, auth instance) are provided
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null; // The Auth service instance
  // User authentication state
  user: User | null;
  isUserLoading: boolean; // True during initial auth check
  userError: Error | null; // Error from auth listener
  isAdmin: boolean;
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser extends UserRoleState {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  isAdmin: boolean;
}

// Return type for useUser() - specific to user auth state
export interface UserHookResult { 
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true, // Start loading until first auth event
    userError: null,
  });

  const [activeRole, setActiveRole] = useState<UserProfile['role'] | null>(null);

  // Effect to subscribe to Firebase auth state changes
  useEffect(() => {
    if (!auth) { 
      setUserAuthState({ user: null, isUserLoading: false, userError: new Error("Auth service not provided.") });
      return;
    }

    setUserAuthState({ user: null, isUserLoading: true, userError: null }); 

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => { 
        setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null });
        if (!firebaseUser) {
            // Clear role state on logout
            setActiveRole(null);
        }
      },
      (error) => { 
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
      }
    );
    return () => unsubscribe(); 
  }, [auth]);

  // HOLISTIC FIX: Centralize user profile and admin role creation here.
  // This effect runs whenever the user is authenticated.
  useEffect(() => {
    if (userAuthState.user && firestore) {
      const user = userAuthState.user;
      const isSpecialAdmin = user.email === 'bynarikompleks@gmail.com';

      // Create/update the main user profile
      const userRef = doc(firestore, 'users', user.uid);
      setDocumentNonBlocking(userRef, {
        id: user.uid,
        email: user.email,
        role: isSpecialAdmin ? 'Admin' : 'Viewer' // Assign role based on email
      }, { merge: true });

      // If the user is the special admin, ensure their role document exists.
      if (isSpecialAdmin) {
        const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
        // This write operation is critical for the security rules to pass.
        setDocumentNonBlocking(adminRoleRef, {
            id: user.uid,
            email: user.email,
        }, { merge: true });
      }
    }
  }, [userAuthState.user, firestore]);

  // Fetch the user's profile to get their base role
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !userAuthState.user) return null;
    return doc(firestore, 'users', userAuthState.user.uid);
  }, [firestore, userAuthState.user]);
  
  const { data: userProfile, isLoading: isRoleLoading, error: roleError } = useDoc<UserProfile>(userDocRef);

  const baseRole = userProfile?.role ?? null;

  // Set the active role once the base role is loaded
  useEffect(() => {
    if (baseRole && !activeRole) {
        setActiveRole(baseRole);
    }
  }, [baseRole, activeRole]);
  
  // Memoize the context value
  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    const isAdmin = activeRole === 'Admin';
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      user: userAuthState.user,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
      baseRole,
      activeRole,
      isRoleLoading: isRoleLoading || userAuthState.isUserLoading,
      roleError,
      setActiveRole,
      isAdmin,
    };
  }, [firebaseApp, firestore, auth, userAuthState, baseRole, activeRole, isRoleLoading, roleError]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook to access core Firebase services and user authentication state.
 * Throws error if core services are not available or used outside provider.
 */
export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
    baseRole: context.baseRole,
    activeRole: context.activeRole,
    isRoleLoading: context.isRoleLoading,
    roleError: context.roleError,
    setActiveRole: context.setActiveRole,
    isAdmin: context.isAdmin,
  };
};

/** Hook to access Firebase Auth instance. */
export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * @returns {UserHookResult} Object with user, isUserLoading, userError.
 */
export const useUser = (): UserHookResult => {
  const { user, isUserLoading, userError } = useFirebase(); 
  return { user, isUserLoading, userError };
};
