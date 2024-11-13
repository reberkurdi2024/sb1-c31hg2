import React, { useState } from 'react';
import { Plus, Search, Mail, Phone, Tag, Loader2 } from 'lucide-react';
import { Vendor } from '../types';
import { useVendors } from '../hooks/useVendors';
import AddVendorModal from './AddVendorModal';

export default function Vendors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { vendors, loading, error, addVendor } = useVendors();

  const handleAddVendor = async (vendor: Omit<Vendor, 'id'>) => {
    const success = await addVendor(vendor);
    if (success) {
      setIsModalOpen(false);
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-2">Error loading vendors</div>
        <div className="text-gray-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Vendor Management</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Vendor
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search vendors..."
          className="flex-1 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-2" />
          <p className="text-gray-600">Loading vendors...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{vendor.name}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{vendor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{vendor.phone}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  vendor.status === 'active'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-gray-600">
                  <Tag className="h-4 w-4" />
                  <span className="text-sm">Category: {vendor.category}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{vendor.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddVendorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddVendor}
      />
    </div>
  );
}