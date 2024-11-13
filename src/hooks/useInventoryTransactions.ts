import { useState } from 'react';
import { recordPurchaseTransaction, recordSaleTransaction } from '../lib/db/transactions';
import { validateStockAvailability } from '../lib/db/inventory';

export function useInventoryTransactions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function processPurchase(data: {
    medicineId: string;
    quantity: number;
    unitPrice: number;
    supplierId: string;
    invoiceNumber: string;
  }) {
    try {
      setLoading(true);
      setError(null);
      await recordPurchaseTransaction(data);
      return true;
    } catch (err) {
      setError('Failed to process purchase');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function processSale(data: {
    medicineId: string;
    quantity: number;
    unitPrice: number;
    customerId?: string;
  }) {
    try {
      setLoading(true);
      setError(null);

      // Check if enough stock is available
      const isAvailable = await validateStockAvailability(data.medicineId, data.quantity);
      if (!isAvailable) {
        setError('Insufficient stock');
        return false;
      }

      await recordSaleTransaction(data);
      return true;
    } catch (err) {
      setError('Failed to process sale');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    processPurchase,
    processSale
  };
}