import { useState, useEffect } from 'react';
import { Vendor } from '../types';
import { getAllVendors, addVendor, updateVendor, deleteVendor } from '../lib/db/vendors';

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVendors();
  }, []);

  async function loadVendors() {
    try {
      setLoading(true);
      const data = await getAllVendors();
      setVendors(data);
      setError(null);
    } catch (err) {
      setError('Failed to load vendors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddVendor(vendor: Omit<Vendor, 'id'>) {
    try {
      const id = await addVendor(vendor);
      setVendors(prev => [...prev, { ...vendor, id }]);
      return true;
    } catch (err) {
      setError('Failed to add vendor');
      console.error(err);
      return false;
    }
  }

  async function handleUpdateVendor(id: string, data: Partial<Vendor>) {
    try {
      await updateVendor(id, data);
      setVendors(prev =>
        prev.map(vendor =>
          vendor.id === id ? { ...vendor, ...data } : vendor
        )
      );
      return true;
    } catch (err) {
      setError('Failed to update vendor');
      console.error(err);
      return false;
    }
  }

  async function handleDeleteVendor(id: string) {
    try {
      await deleteVendor(id);
      setVendors(prev => prev.filter(vendor => vendor.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete vendor');
      console.error(err);
      return false;
    }
  }

  return {
    vendors,
    loading,
    error,
    addVendor: handleAddVendor,
    updateVendor: handleUpdateVendor,
    deleteVendor: handleDeleteVendor,
    refresh: loadVendors
  };
}