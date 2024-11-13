import { useState, useEffect } from 'react';
import { Sale } from '../types';
import { getAllSales, addSale, getSalesByDateRange } from '../lib/db/sales';

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    try {
      setLoading(true);
      const data = await getAllSales();
      setSales(data);
      setError(null);
    } catch (err) {
      setError('Failed to load sales');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSale(sale: Omit<Sale, 'id'>) {
    try {
      const id = await addSale(sale);
      setSales(prev => [{ ...sale, id }, ...prev]);
      return true;
    } catch (err) {
      setError('Failed to add sale');
      console.error(err);
      return false;
    }
  }

  async function loadSalesByDateRange(startDate: Date, endDate: Date) {
    try {
      setLoading(true);
      const data = await getSalesByDateRange(startDate, endDate);
      setSales(data);
      setError(null);
    } catch (err) {
      setError('Failed to load sales for date range');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    sales,
    loading,
    error,
    addSale: handleAddSale,
    loadSalesByDateRange,
    refresh: loadSales
  };
}