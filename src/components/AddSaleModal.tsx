import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Medicine, Sale } from '../types';
import { medicines } from '../data/mockData';

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (sale: Omit<Sale, 'id'>) => void;
}

export default function AddSaleModal({ isOpen, onClose, onAdd }: AddSaleModalProps) {
  const [formData, setFormData] = useState({
    medicineId: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0]
  });

  const selectedMedicine = medicines.find(m => m.id === formData.medicineId);
  const totalAmount = selectedMedicine ? selectedMedicine.price * Number(formData.quantity) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      medicineId: formData.medicineId,
      quantity: Number(formData.quantity),
      totalAmount,
      date: formData.date
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Add New Sale</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                  {medicine.name} - ${medicine.price} (Stock: {medicine.stock})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              required
              min="1"
              max={selectedMedicine?.stock || 1}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
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

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold">${totalAmount.toFixed(2)}</span>
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
              Add Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}