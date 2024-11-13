import { useState, useEffect } from 'react';
import { Supplier } from '../types';
import { getAllSuppliers, addSupplier, updateSupplier, deleteSupplier } from '../lib/db/suppliers';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {
    try {
      setLoading(true);
      const data = await getAllSuppliers();
      setSuppliers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load suppliers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSupplier(supplier: Omit<Supplier, 'id'>) {
    try {
      const id = await addSupplier(supplier);
      setSuppliers(prev => [...prev, { ...supplier, id }]);
      return true;
    } catch (err) {
      setError('Failed to add supplier');
      console.error(err);
      return false;
    }
  }

  async function handleUpdateSupplier(id: string, data: Partial<Supplier>) {
    try {
      await updateSupplier(id, data);
      setSuppliers(prev =>
        prev.map(supplier =>
          supplier.id === id ? { ...supplier, ...data } : supplier
        )
      );
      return true;
    } catch (err) {
      setError('Failed to update supplier');
      console.error(err);
      return false;
    }
  }

  async function handleDeleteSupplier(id: string) {
    try {
      await deleteSupplier(id);
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete supplier');
      console.error(err);
      return false;
    }
  }

  return {
    suppliers,
    loading,
    error,
    addSupplier: handleAddSupplier,
    updateSupplier: handleUpdateSupplier,
    deleteSupplier: handleDeleteSupplier,
    refresh: loadSuppliers
  };
}