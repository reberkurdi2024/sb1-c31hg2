import React, { useState } from 'react';
import { Plus, Search, Mail, Phone, Package, Loader2 } from 'lucide-react';
import { Supplier } from '../types';
import { useSuppliers } from '../hooks/useSuppliers';
import AddSupplierModal from './AddSupplierModal';

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { suppliers, loading, error, addSupplier } = useSuppliers();

  const handleAddSupplier = async (supplier: Omit<Supplier, 'id' | 'lastDelivery'>) => {
    const success = await addSupplier({
      ...supplier,
      lastDelivery: new Date().toISOString().split('T')[0]
    });
    if (success) {
      setIsModalOpen(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-2">Error loading suppliers</div>
        <div className="text-gray-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Supplier Management</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Supplier
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search suppliers..."
          className="flex-1 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-2" />
          <p className="text-gray-600">Loading suppliers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{supplier.name}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{supplier.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{supplier.phone}</span>
                    </div>
                  </div>
                </div>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                  Supplier
                </span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-start gap-2">
                  <Package className="h-4 w-4 text-gray-600 mt-1" />
                  <div>
                    <span className="text-sm text-gray-600">Products Supplied</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {supplier.products.map((product, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  <span className="text-gray-600">Last Delivery: </span>
                  <span className="font-medium">{supplier.lastDelivery}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddSupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSupplier}
      />
    </div>
  );
}