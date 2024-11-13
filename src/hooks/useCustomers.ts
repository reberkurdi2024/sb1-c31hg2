import { useState, useEffect } from 'react';
import { Customer } from '../types';
import { getAllCustomers, addCustomer, updateCustomer, deleteCustomer } from '../lib/db/customers';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      setLoading(true);
      const data = await getAllCustomers();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCustomer(customer: Omit<Customer, 'id'>) {
    try {
      const id = await addCustomer(customer);
      setCustomers(prev => [...prev, { ...customer, id }]);
      return true;
    } catch (err) {
      setError('Failed to add customer');
      console.error(err);
      return false;
    }
  }

  async function handleUpdateCustomer(id: string, data: Partial<Customer>) {
    try {
      await updateCustomer(id, data);
      setCustomers(prev =>
        prev.map(customer =>
          customer.id === id ? { ...customer, ...data } : customer
        )
      );
      return true;
    } catch (err) {
      setError('Failed to update customer');
      console.error(err);
      return false;
    }
  }

  async function handleDeleteCustomer(id: string) {
    try {
      await deleteCustomer(id);
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete customer');
      console.error(err);
      return false;
    }
  }

  return {
    customers,
    loading,
    error,
    addCustomer: handleAddCustomer,
    updateCustomer: handleUpdateCustomer,
    deleteCustomer: handleDeleteCustomer,
    refresh: loadCustomers
  };
}