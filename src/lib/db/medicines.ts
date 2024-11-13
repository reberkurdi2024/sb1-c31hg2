import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Medicine } from '../../types';

const COLLECTION_NAME = 'medicines';

export const medicinesCollection = collection(db, COLLECTION_NAME);

export async function addMedicine(medicine: Omit<Medicine, 'id'>): Promise<string> {
  const docRef = await addDoc(medicinesCollection, medicine);
  return docRef.id;
}

export async function updateMedicine(id: string, data: Partial<Medicine>): Promise<void> {
  const medicineRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(medicineRef, data);
}

export async function deleteMedicine(id: string): Promise<void> {
  const medicineRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(medicineRef);
}

export async function getAllMedicines(): Promise<Medicine[]> {
  const snapshot = await getDocs(medicinesCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Medicine));
}

export async function getLowStockMedicines(threshold: number = 100): Promise<Medicine[]> {
  const q = query(medicinesCollection, where('stock', '<', threshold));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Medicine));
}

export async function getExpiringMedicines(date: Date): Promise<Medicine[]> {
  const q = query(medicinesCollection, where('expiryDate', '<=', date.toISOString()));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Medicine));
}