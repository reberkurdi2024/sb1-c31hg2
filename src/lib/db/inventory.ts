import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { Medicine } from '../../types';

export async function updateMedicineStock(medicineId: string, quantity: number): Promise<void> {
  const medicineRef = doc(db, 'medicines', medicineId);
  await updateDoc(medicineRef, {
    stock: increment(quantity)
  });
}

export async function validateStockAvailability(medicineId: string, requestedQuantity: number): Promise<boolean> {
  const medicineRef = doc(db, 'medicines', medicineId);
  const medicineDoc = await medicineRef.get();
  const currentStock = medicineDoc.data()?.stock || 0;
  return currentStock >= requestedQuantity;
}