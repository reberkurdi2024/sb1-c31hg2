import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Purchase } from '../../types';
import { sanitizeData, validateData } from '../utils';

const COLLECTION_NAME = 'purchases';

export const purchasesCollection = collection(db, COLLECTION_NAME);

const purchaseValidations = {
  medicineId: (v: string) => typeof v === 'string' && v.length > 0,
  supplierId: (v: string) => typeof v === 'string' && v.length > 0,
  quantity: (v: number) => typeof v === 'number' && v > 0,
  unitPrice: (v: number) => typeof v === 'number' && v > 0,
  totalAmount: (v: number) => typeof v === 'number' && v > 0,
  date: (v: string) => typeof v === 'string' && v.length > 0,
  status: (v: string) => ['pending', 'received', 'cancelled'].includes(v),
  invoiceNumber: (v: string) => typeof v === 'string' && v.length > 0
};

export async function addPurchase(purchase: Omit<Purchase, 'id'>): Promise<string> {
  const sanitizedData = sanitizeData(purchase, ['medicineId', 'supplierId', 'quantity', 'unitPrice', 'totalAmount', 'date', 'status', 'invoiceNumber']);
  
  if (!validateData(sanitizedData, purchaseValidations)) {
    throw new Error('Invalid purchase data');
  }

  const docRef = await addDoc(purchasesCollection, sanitizedData);
  return docRef.id;
}

export async function updatePurchase(id: string, data: Partial<Purchase>): Promise<void> {
  const purchaseRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(purchaseRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

export async function deletePurchase(id: string): Promise<void> {
  const purchaseRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(purchaseRef);
}

export async function getAllPurchases(): Promise<Purchase[]> {
  const q = query(purchasesCollection, orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Purchase));
}

export async function getPurchasesByStatus(status: Purchase['status']): Promise<Purchase[]> {
  const q = query(
    purchasesCollection,
    where('status', '==', status),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Purchase));
}

export async function getPurchasesByDateRange(startDate: Date, endDate: Date): Promise<Purchase[]> {
  const q = query(
    purchasesCollection,
    where('date', '>=', startDate.toISOString()),
    where('date', '<=', endDate.toISOString()),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Purchase));
}