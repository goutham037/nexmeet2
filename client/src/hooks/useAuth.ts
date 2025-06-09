import { useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              age: userData.age,
              gender: userData.gender,
              bio: userData.bio,
              interests: userData.interests || [],
              profilePhoto: userData.profilePhoto,
              isVerified: userData.isVerified || false,
              verificationStatus: userData.verificationStatus || 'none',
              premiumTier: userData.premiumTier || 'free',
              location: userData.location,
              preferences: userData.preferences,
              createdAt: userData.createdAt?.toDate() || new Date(),
              lastActive: new Date(),
            });
          } else {
            // Create basic user profile if it doesn't exist
            const newUser: Partial<User> = {
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              firstName: '',
              isVerified: false,
              verificationStatus: 'none',
              premiumTier: 'free',
              interests: [],
              createdAt: new Date(),
              lastActive: new Date(),
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser as User);
          }
        } catch (error: any) {
          console.error('Error fetching user data:', error);
          if (error.code === 'failed-precondition' || error.code === 'unavailable') {
            setError('firebase-setup-required');
          } else {
            setError('Failed to load user data');
          }
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.id);
      await setDoc(userRef, { ...updates, lastActive: new Date() }, { merge: true });
      setUser({ ...user, ...updates });
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  return {
    user,
    firebaseUser,
    loading,
    error,
    signIn,
    signUp,
    logout,
    updateUserProfile,
  };
}
