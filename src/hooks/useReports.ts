import { useState } from 'react';
import { Sale, Medicine } from '../types';
import { 
  getSalesReport, 
  getInventoryReport, 
  getLowStockReport, 
  getExpiringReport,
  getTopSellingMedicines 
} from '../lib/db/reports';

export function useReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadSalesReport(startDate: Date, endDate: Date): Promise<Sale[]> {
    try {
      setLoading(true);
      const data = await getSalesReport(startDate, endDate);
      setError(null);
      return data;
    } catch (err) {
      setError('Failed to load sales report');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function loadInventoryReport(): Promise<Medicine[]> {
    try {
      setLoading(true);
      const data = await getInventoryReport();
      setError(null);
      return data;
    } catch (err) {
      setError('Failed to load inventory report');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function loadLowStockReport(threshold: number = 100): Promise<Medicine[]> {
    try {
      setLoading(true);
      const data = await getLowStockReport(threshold);
      setError(null);
      return data;
    } catch (err) {
      setError('Failed to load low stock report');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function loadExpiringReport(date: Date): Promise<Medicine[]> {
    try {
      setLoading(true);
      const data = await getExpiringReport(date);
      setError(null);
      return data;
    } catch (err) {
      setError('Failed to load expiring items report');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function loadTopSellingMedicines(limit: number = 5): Promise<Medicine[]> {
    try {
      setLoading(true);
      const data = await getTopSellingMedicines(limit);
      setError(null);
      return data;
    } catch (err) {
      setError('Failed to load top selling medicines');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    loadSalesReport,
    loadInventoryReport,
    loadLowStockReport,
    loadExpiringReport,
    loadTopSellingMedicines
  };
}