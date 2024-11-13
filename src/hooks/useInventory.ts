import { useState, useEffect } from 'react';
import { Medicine } from '../types';
import { getAllMedicines, addMedicine, updateMedicine, deleteMedicine } from '../lib/db/medicines';

export function useInventory() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMedicines();
  }, []);

  async function loadMedicines() {
    try {
      setLoading(true);
      const data = await getAllMedicines();
      setMedicines(data);
      setError(null);
    } catch (err) {
      setError('Failed to load medicines');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMedicine(medicine: Omit<Medicine, 'id'>) {
    try {
      const id = await addMedicine(medicine);
      setMedicines(prev => [...prev, { ...medicine, id }]);
      return true;
    } catch (err) {
      setError('Failed to add medicine');
      console.error(err);
      return false;
    }
  }

  async function handleUpdateMedicine(id: string, data: Partial<Medicine>) {
    try {
      await updateMedicine(id, data);
      setMedicines(prev =>
        prev.map(medicine =>
          medicine.id === id ? { ...medicine, ...data } : medicine
        )
      );
      return true;
    } catch (err) {
      setError('Failed to update medicine');
      console.error(err);
      return false;
    }
  }

  async function handleDeleteMedicine(id: string) {
    try {
      await deleteMedicine(id);
      setMedicines(prev => prev.filter(medicine => medicine.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete medicine');
      console.error(err);
      return false;
    }
  }

  return {
    medicines,
    loading,
    error,
    addMedicine: handleAddMedicine,
    updateMedicine: handleUpdateMedicine,
    deleteMedicine: handleDeleteMedicine,
    refresh: loadMedicines
  };
}