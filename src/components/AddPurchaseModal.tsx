import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Purchase } from '../types';
import { medicines, suppliers } from '../data/mockData';

interface AddPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (purchase: Omit<Purchase, 'id'>) => void;
}

export default function AddPurchaseModal({ isOpen, onClose, onAdd }: AddPurchaseModalProps) {
  const [formData, setFormData] = useState({
    medicineId: '',
    supplierId: '',
    quantity: '',
    unitPrice: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending' as const,
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = Number(formData.quantity) * Number(formData.unitPrice);
    onAdd({
      ...formData,
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.unitPrice),
      totalAmount
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">New Purchase Order</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              value={formData.invoiceNumber}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medicine
            </label>
            <select
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.medicineId}
              onChange={(e) => setFormData({ ...formData, medicineId: e.target.value })}
            >
              <option value="">Select medicine</option>
              {medicines.map((medicine) => (
                <option key={medicine.id} value={medicine.id}>
                  {medicine.name} - {medicine.manufacturer}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier
            </label>
            <select
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
            >
              <option value="">Select supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                required
                min="1"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Price ($)
              </label>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Purchase['status'] })}
            >
              <option value="pending">Pending</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold">
                ${(Number(formData.quantity) * Number(formData.unitPrice)).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}