import React, { useState } from 'react';
import { X, Download, Search, AlertTriangle } from 'lucide-react';
import { Medicine } from '../../types';
import { medicines } from '../../data/mockData';

interface InventoryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InventoryReportModal({ isOpen, onClose }: InventoryReportModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = Array.from(new Set(medicines.map(m => m.category)));
  
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || medicine.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = filteredMedicines.filter(m => m.stock < 100).length;
  const expiringCount = filteredMedicines.filter(m => 
    new Date(m.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  ).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Inventory Report</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 flex-1 overflow-auto">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search inventory..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="px-4 py-2 border rounded-lg"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Total Items</p>
              <p className="text-2xl font-bold text-blue-700">{filteredMedicines.length}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-yellow-700">{lowStockCount}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-red-700">{expiringCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMedicines.map((medicine) => {
                  const isLowStock = medicine.stock < 100;
                  const isExpiringSoon = new Date(medicine.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
                  
                  return (
                    <tr key={medicine.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{medicine.name}</div>
                        <div className="text-sm text-gray-500">{medicine.manufacturer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {medicine.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          isLowStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {medicine.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${medicine.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {medicine.expiryDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(isLowStock || isExpiringSoon) && (
                          <div className="flex items-center gap-1 text-yellow-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm">
                              {isLowStock ? 'Low Stock' : 'Expiring Soon'}
                            </span>
                          </div>
                        )}
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