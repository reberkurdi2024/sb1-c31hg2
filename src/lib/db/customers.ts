import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Customer } from '../../types';

const COLLECTION_NAME = 'customers';

export const customersCollection = collection(db, COLLECTION_NAME);

export async function addCustomer(customer: Omit<Customer, 'id'>): Promise<string> {
  const docRef = await addDoc(customersCollection, customer);
  return docRef.id;
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<void> {
  const customerRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(customerRef, data);
}

export async function deleteCustomer(id: string): Promise<void> {
  const customerRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(customerRef);
}

export async function getAllCustomers(): Promise<Customer[]> {
  const snapshot = await getDocs(customersCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Customer));
}