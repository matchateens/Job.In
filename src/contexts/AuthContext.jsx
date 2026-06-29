import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { auth, googleProvider, googleWebClientId } from '../firebase';
import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    if (Capacitor.isNativePlatform()) {
      // Inisialisasi Google Sign-In Native di perangkat mobile
      await SocialLogin.initialize({
        google: {
          webClientId: googleWebClientId,
        },
      });

      const response = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['email', 'profile'],
        },
      });

      const idToken = response?.result?.idToken;
      if (!idToken) {
        throw new Error('Gagal mendapatkan ID Token dari login Google.');
      }

      const credential = GoogleAuthProvider.credential(idToken);
      return signInWithCredential(auth, credential);
    } else {
      // Gunakan Web SDK standar jika di peramban (browser)
      return signInWithPopup(auth, googleProvider);
    }
  };

  const loginWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const registerWithEmail = async (email, password, displayName) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });
    return credential;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
