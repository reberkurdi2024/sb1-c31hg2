import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Medicine } from '../types';

interface DeleteMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  medicine: Medicine | null;
}

export default function DeleteMedicineModal({ isOpen, onClose, onDelete, medicine }: DeleteMedicineModalProps) {
  if (!isOpen || !medicine) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
            Delete Medicine
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete {medicine.name}? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDelete(medicine.id);
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Medicine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}