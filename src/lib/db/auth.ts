import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '../firebase';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export async function loginWithEmail(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Failed to login');
  }
}

export async function registerWithEmail(email: string, password: string, displayName: string) {
  try {
    // Create the user in Firebase Auth
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    await updateProfile(result.user, { displayName });

    // Create a user document in Firestore with a custom ID
    const userDocRef = doc(db, 'users', result.user.uid);
    await setDoc(userDocRef, {
      uid: result.user.uid,
      email: result.user.email,
      name: displayName,
      role: 'user',
      status: 'active',
      permissions: ['view_inventory', 'view_sales'],
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`
    });

    return result.user;
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email is already registered. Please use a different email or try logging in.');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak. Please use a stronger password.');
    }
    throw new Error(error.message || 'Failed to create account');
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error(error.message || 'Failed to logout');
  }
}

export async function updateUserProfile(user: User, data: { displayName?: string; photoURL?: string }) {
  try {
    await updateProfile(user, data);
  } catch (error: any) {
    console.error('Profile update error:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
}