import React, { useState } from 'react';
import { Plus, Search, Mail, Phone, Loader2 } from 'lucide-react';
import { Customer } from '../types';
import { useCustomers } from '../hooks/useCustomers';
import AddCustomerModal from './AddCustomerModal';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { customers, loading, error, addCustomer } = useCustomers();

  const handleAddCustomer = async (customer: Omit<Customer, 'id' | 'lastPurchase' | 'totalPurchases'>) => {
    const success = await addCustomer({
      ...customer,
      lastPurchase: '',
      totalPurchases: 0
    });
    if (success) {
      setIsModalOpen(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-2">Error loading customers</div>
        <div className="text-gray-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Customer
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search customers..."
          className="flex-1 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-2" />
          <p className="text-gray-600">Loading customers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{customer.name}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{customer.phone}</span>
                    </div>
                  </div>
                </div>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                  Active
                </span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Purchase</span>
                  <span className="font-medium">{customer.lastPurchase || 'No purchases yet'}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Total Purchases</span>
                  <span className="font-medium">${customer.totalPurchases.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCustomer}
      />
    </div>
  );
}