import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Medicine } from '../types';
import { useInventory } from '../hooks/useInventory';
import AddMedicineModal from './AddMedicineModal';
import EditMedicineModal from './EditMedicineModal';
import DeleteMedicineModal from './DeleteMedicineModal';

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const {
    medicines,
    loading,
    error,
    addMedicine,
    updateMedicine,
    deleteMedicine
  } = useInventory();

  const categories = Array.from(new Set(medicines.map(medicine => medicine.category)));

  const filteredMedicines = medicines.filter(medicine =>
    (selectedCategory === 'all' || medicine.category === selectedCategory) &&
    (medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddMedicine = async (medicine: Omit<Medicine, 'id'>) => {
    const success = await addMedicine(medicine);
    if (success) {
      setIsAddModalOpen(false);
    }
  };

  const handleUpdateMedicine = async (id: string, updatedData: Partial<Medicine>) => {
    const success = await updateMedicine(id, updatedData);
    if (success) {
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteMedicine = async (id: string) => {
    const success = await deleteMedicine(id);
    if (success) {
      setIsDeleteModalOpen(false);
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-2">Error loading inventory</div>
        <div className="text-gray-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Medicine
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search medicines..."
            className="flex-1 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Medicine List</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-2" />
              <p className="text-gray-600">Loading inventory...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMedicines.map((medicine) => {
                  const isLowStock = medicine.stock < 100;
                  const isExpiringSoon = new Date(medicine.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

                  return (
                    <tr key={medicine.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={medicine.image || `https://via.placeholder.com/40x40?text=${encodeURIComponent(medicine.name)}`}
                              alt={medicine.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://via.placeholder.com/40x40?text=${encodeURIComponent(medicine.name)}`;
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{medicine.name}</div>
                            <div className="text-sm text-gray-500">{medicine.manufacturer}</div>
                          </div>
                        </div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedMedicine(medicine);
                              setIsEditModalOpen(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMedicine(medicine);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddMedicineModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMedicine}
      />

      <EditMedicineModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateMedicine}
        medicine={selectedMedicine}
      />

      <DeleteMedicineModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteMedicine}
        medicine={selectedMedicine}
      />
    </div>
  );
}