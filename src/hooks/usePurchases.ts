import { useState, useEffect } from 'react';
import { Purchase } from '../types';
import { getAllPurchases, addPurchase, updatePurchase, deletePurchase, getPurchasesByStatus } from '../lib/db/purchases';

export function usePurchases(status?: Purchase['status']) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPurchases();
  }, [status]);

  async function loadPurchases() {
    try {
      setLoading(true);
      const data = status ? 
        await getPurchasesByStatus(status) : 
        await getAllPurchases();
      setPurchases(data);
      setError(null);
    } catch (err) {
      setError('Failed to load purchases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddPurchase(purchase: Omit<Purchase, 'id'>) {
    try {
      const id = await addPurchase(purchase);
      setPurchases(prev => [{ ...purchase, id }, ...prev]);
      return true;
    } catch (err) {
      setError('Failed to add purchase');
      console.error(err);
      return false;
    }
  }

  async function handleUpdatePurchase(id: string, data: Partial<Purchase>) {
    try {
      await updatePurchase(id, data);
      setPurchases(prev =>
        prev.map(purchase =>
          purchase.id === id ? { ...purchase, ...data } : purchase
        )
      );
      return true;
    } catch (err) {
      setError('Failed to update purchase');
      console.error(err);
      return false;
    }
  }

  async function handleDeletePurchase(id: string) {
    try {
      await deletePurchase(id);
      setPurchases(prev => prev.filter(purchase => purchase.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete purchase');
      console.error(err);
      return false;
    }
  }

  return {
    purchases,
    loading,
    error,
    addPurchase: handleAddPurchase,
    updatePurchase: handleUpdatePurchase,
    deletePurchase: handleDeletePurchase,
    refresh: loadPurchases
  };
}