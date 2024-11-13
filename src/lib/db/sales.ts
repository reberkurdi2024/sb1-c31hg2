import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Sale } from '../../types';

const COLLECTION_NAME = 'sales';

export const salesCollection = collection(db, COLLECTION_NAME);

export async function addSale(sale: Omit<Sale, 'id'>): Promise<string> {
  const docRef = await addDoc(salesCollection, sale);
  return docRef.id;
}

export async function getAllSales(): Promise<Sale[]> {
  const snapshot = await getDocs(salesCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Sale));
}

export async function getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
  const q = query(
    salesCollection,
    where('date', '>=', startDate.toISOString()),
    where('date', '<=', endDate.toISOString()),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Sale));
}