import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Sale, Medicine } from '../../types';
import { salesCollection } from './sales';
import { medicinesCollection } from './medicines';

export async function getSalesReport(startDate: Date, endDate: Date): Promise<Sale[]> {
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

export async function getInventoryReport(): Promise<Medicine[]> {
  const snapshot = await getDocs(medicinesCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Medicine));
}

export async function getLowStockReport(threshold: number = 100): Promise<Medicine[]> {
  const q = query(medicinesCollection, where('stock', '<', threshold));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Medicine));
}

export async function getExpiringReport(date: Date): Promise<Medicine[]> {
  const q = query(medicinesCollection, where('expiryDate', '<=', date.toISOString()));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Medicine));
}

export async function getTopSellingMedicines(limit: number = 5): Promise<Medicine[]> {
  const salesSnapshot = await getDocs(salesCollection);
  const sales = salesSnapshot.docs.map(doc => doc.data() as Sale);
  
  // Calculate total sales per medicine
  const salesByMedicine = sales.reduce((acc, sale) => {
    acc[sale.medicineId] = (acc[sale.medicineId] || 0) + sale.quantity;
    return acc;
  }, {} as Record<string, number>);

  // Sort by quantity sold and get top medicines
  const topMedicineIds = Object.entries(salesByMedicine)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([id]) => id);

  // Get medicine details
  const medicinesSnapshot = await getDocs(medicinesCollection);
  const medicines = medicinesSnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Medicine))
    .filter(med => topMedicineIds.includes(med.id));

  // Sort by sales quantity
  return medicines.sort((a, b) => 
    (salesByMedicine[b.id] || 0) - (salesByMedicine[a.id] || 0)
  );
}