import React, { useState } from 'react';
import { X, Calendar, Download, Search } from 'lucide-react';
import { Sale, Medicine } from '../../types';
import { sales, medicines } from '../../data/mockData';

interface SalesReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SalesReportModal({ isOpen, onClose }: SalesReportModalProps) {
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = sales.filter(sale => {
    const medicine = medicines.find(m => m.id === sale.medicineId);
    return medicine?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalRevenue = filteredSales.reduce((acc, sale) => acc + sale.totalAmount, 0);
  const totalItems = filteredSales.reduce((acc, sale) => acc + sale.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Sales Report</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 flex-1 overflow-auto">
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                className="px-3 py-2 border rounded-lg"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <span>to</span>
              <input
                type="date"
                className="px-3 py-2 border rounded-lg"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sales..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-700">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Total Items Sold</p>
              <p className="text-2xl font-bold text-green-700">{totalItems}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600">Average Sale Value</p>
              <p className="text-2xl font-bold text-purple-700">
                ${(totalRevenue / filteredSales.length || 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSales.map((sale) => {
                  const medicine = medicines.find(m => m.id === sale.medicineId);
                  return (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{medicine?.name}</div>
                        <div className="text-sm text-gray-500">{medicine?.manufacturer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        ${sale.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 border-t">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}