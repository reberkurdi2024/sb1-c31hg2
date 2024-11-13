import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase';

export interface UserData {
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  permissions: string[];
  lastLogin?: string;
}

export async function addUser(userData: UserData & { password: string }) {
  try {
    // Create auth user
    const { user } = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    // Remove password before storing in Firestore
    const { password, ...userDataWithoutPassword } = userData;

    // Add user to Firestore
    const docRef = await addDoc(collection(db, 'users'), {
      ...userDataWithoutPassword,
      uid: user.uid,
      createdAt: new Date().toISOString()
    });

    return docRef.id;
  } catch (error: any) {
    console.error('Error adding user:', error);
    throw new Error(error.message || 'Failed to create user');
  }
}

export async function getAllUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
}

export async function getUsersByRole(role: string) {
  try {
    const q = query(collection(db, 'users'), where('role', '==', role));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting users by role:', error);
    throw error;
  }
}

export async function updateUser(id: string, userData: Partial<UserData>) {
  try {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(id: string) {
  try {
    await deleteDoc(doc(db, 'users', id));
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}