import React, { useState, useEffect, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { Medicine } from '../types';

interface EditMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, medicine: Partial<Medicine>) => void;
  medicine: Medicine | null;
}

export default function EditMedicineModal({ isOpen, onClose, onUpdate, medicine }: EditMedicineModalProps) {
  const [formData, setFormData] = useState<Partial<Medicine>>({
    name: '',
    manufacturer: '',
    price: 0,
    stock: 0,
    expiryDate: '',
    category: '',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (medicine) {
      setFormData(medicine);
      setImagePreview(medicine.image || null);
    }
  }, [medicine]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData({ ...formData, image: previewUrl });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (medicine) {
      onUpdate(medicine.id, formData);
    }
    onClose();
  };

  if (!isOpen || !medicine) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Edit Medicine</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medicine Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manufacturer
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select category</option>
              <option value="Pain Relief">Pain Relief</option>
              <option value="Antibiotics">Antibiotics</option>
              <option value="Digestive Health">Digestive Health</option>
              <option value="First Aid">First Aid</option>
              <option value="Vitamins">Vitamins</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medicine Image
            </label>
            <div className="mt-2 space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.image || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setImagePreview(null);
                  }}
                  placeholder="Enter image URL or upload a file"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </button>
              </div>

              {(imagePreview || formData.image) && (
                <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                  <img
                    src={imagePreview || formData.image}
                    alt="Medicine preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                </div>
              )}
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
              Update Medicine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}