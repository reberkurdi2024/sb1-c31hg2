import React, { useState } from 'react';
import { ShoppingCart, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { Sale } from '../types';
import { useSales } from '../hooks/useSales';
import { useInventory } from '../hooks/useInventory';
import AddSaleModal from './AddSaleModal';

export default function Sales() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { sales, loading, error, addSale } = useSales();
  const { medicines } = useInventory();

  const handleAddSale = async (sale: Omit<Sale, 'id'>) => {
    const success = await addSale(sale);
    if (success) {
      setIsModalOpen(false);
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-2">Error loading sales</div>
        <div className="text-gray-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Sales Overview</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <ShoppingCart className="h-5 w-5" />
          New Sale
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-2" />
          <p className="text-gray-600">Loading sales data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Today's Sales</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${sales.reduce((acc, sale) => acc + sale.totalAmount, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{sales.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Daily Sales</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${(sales.reduce((acc, sale) => acc + sale.totalAmount, 0) / 30).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Recent Sales</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sales.map((sale) => {
                  const medicine = medicines.find(m => m.id === sale.medicineId);
                  return (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{sale.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{medicine?.name}</div>
                        <div className="text-sm text-gray-500">{medicine?.manufacturer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{sale.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-green-600 font-medium">${sale.totalAmount.toFixed(2)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <AddSaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSale}
      />
    </div>
  );
}