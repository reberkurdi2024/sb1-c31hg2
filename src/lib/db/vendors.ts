import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Vendor } from '../../types';

const COLLECTION_NAME = 'vendors';

export const vendorsCollection = collection(db, COLLECTION_NAME);

export async function addVendor(vendor: Omit<Vendor, 'id'>): Promise<string> {
  const docRef = await addDoc(vendorsCollection, vendor);
  return docRef.id;
}

export async function updateVendor(id: string, data: Partial<Vendor>): Promise<void> {
  const vendorRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(vendorRef, data);
}

export async function deleteVendor(id: string): Promise<void> {
  const vendorRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(vendorRef);
}

export async function getAllVendors(): Promise<Vendor[]> {
  const snapshot = await getDocs(vendorsCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Vendor));
}