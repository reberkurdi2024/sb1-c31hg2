import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Supplier } from '../../types';

const COLLECTION_NAME = 'suppliers';

export const suppliersCollection = collection(db, COLLECTION_NAME);

export async function addSupplier(supplier: Omit<Supplier, 'id'>): Promise<string> {
  const docRef = await addDoc(suppliersCollection, supplier);
  return docRef.id;
}

export async function updateSupplier(id: string, data: Partial<Supplier>): Promise<void> {
  const supplierRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(supplierRef, data);
}

export async function deleteSupplier(id: string): Promise<void> {
  const supplierRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(supplierRef);
}

export async function getAllSuppliers(): Promise<Supplier[]> {
  const snapshot = await getDocs(suppliersCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Supplier));
}