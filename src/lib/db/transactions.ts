import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { updateMedicineStock } from './inventory';

const purchaseTransactionsCollection = collection(db, 'purchaseTransactions');
const salesTransactionsCollection = collection(db, 'salesTransactions');

export async function recordPurchaseTransaction(data: {
  medicineId: string;
  quantity: number;
  unitPrice: number;
  supplierId: string;
  invoiceNumber: string;
}) {
  const transaction = {
    ...data,
    totalAmount: data.quantity * data.unitPrice,
    type: 'purchase',
    timestamp: Timestamp.now(),
    status: 'completed'
  };

  // Add stock to inventory
  await updateMedicineStock(data.medicineId, data.quantity);
  
  // Record the transaction
  return addDoc(purchaseTransactionsCollection, transaction);
}

export async function recordSaleTransaction(data: {
  medicineId: string;
  quantity: number;
  unitPrice: number;
  customerId?: string;
}) {
  const transaction = {
    ...data,
    totalAmount: data.quantity * data.unitPrice,
    type: 'sale',
    timestamp: Timestamp.now(),
    status: 'completed'
  };

  // Remove stock from inventory
  await updateMedicineStock(data.medicineId, -data.quantity);
  
  // Record the transaction
  return addDoc(salesTransactionsCollection, transaction);
}