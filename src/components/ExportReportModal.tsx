import React, { useState } from 'react';
import { X, FileSpreadsheet, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Medicine, Sale } from '../types';
import { medicines, sales } from '../data/mockData';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateRange: string;
  reportType: string;
}

export default function ExportReportModal({ isOpen, onClose, dateRange, reportType }: ExportReportModalProps) {
  const [exportFormat, setExportFormat] = useState('xlsx');
  const [loading, setLoading] = useState(false);

  const prepareInventoryData = () => {
    return medicines.map((medicine: Medicine) => ({
      'Medicine Name': medicine.name,
      'Manufacturer': medicine.manufacturer,
      'Category': medicine.category,
      'Stock': medicine.stock,
      'Price': `$${medicine.price}`,
      'Expiry Date': medicine.expiryDate
    }));
  };

  const prepareSalesData = () => {
    return sales.map((sale: Sale) => {
      const medicine = medicines.find(m => m.id === sale.medicineId);
      return {
        'Date': sale.date,
        'Medicine': medicine?.name || 'Unknown',
        'Quantity': sale.quantity,
        'Total Amount': `$${sale.totalAmount}`,
        'Manufacturer': medicine?.manufacturer || 'Unknown'
      };
    });
  };

  const prepareFinancialData = () => {
    const salesByDate = sales.reduce((acc: { [key: string]: number }, sale) => {
      acc[sale.date] = (acc[sale.date] || 0) + sale.totalAmount;
      return acc;
    }, {});

    return Object.entries(salesByDate).map(([date, amount]) => ({
      'Date': date,
      'Revenue': `$${amount}`,
      'Transactions': sales.filter(s => s.date === date).length
    }));
  };

  const getReportData = () => {
    switch (reportType) {
      case 'inventory':
        return prepareInventoryData();
      case 'sales':
        return prepareSalesData();
      case 'financial':
        return prepareFinancialData();
      default:
        return [];
    }
  };

  const getFileName = () => {
    const date = new Date().toISOString().split('T')[0];
    return `${reportType}-report-${date}.${exportFormat}`;
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const data = getReportData();
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      
      // Generate file
      XLSX.writeFile(wb, getFileName());
      
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-800">Export Report</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <div className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              {dateRange === 'week' ? 'Last 7 Days' : 
               dateRange === 'month' ? 'Last 30 Days' : 'Last Year'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Export Format
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <option value="xlsx">Excel (.xlsx)</option>
              <option value="csv">CSV (.csv)</option>
            </select>
          </div>

          <div className="bg-blue-50 text-blue-600 p-4 rounded-lg text-sm">
            This will export {reportType} data for the selected date range in {exportFormat.toUpperCase()} format.
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            {loading ? 'Exporting...' : 'Export Report'}
          </button>
        </div>
      </div>
    </div>
  );
}