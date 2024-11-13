import React, { useState } from 'react';
import { DollarSign, Package, AlertTriangle, TrendingUp, Bell, X } from 'lucide-react';
import { medicines, sales } from '../data/mockData';
import SalesReportModal from './reports/SalesReportModal';
import InventoryReportModal from './reports/InventoryReportModal';
import FinancialReportModal from './reports/FinancialReportModal';

export default function Dashboard() {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(true);

  const stats = {
    totalSales: sales.reduce((acc, sale) => acc + sale.totalAmount, 0),
    lowStock: medicines.filter(med => med.stock < 100).length,
    expiringItems: medicines.filter(med => new Date(med.expiryDate) < new Date('2024-12-31')).length,
    revenue: sales.reduce((acc, sale) => acc + sale.totalAmount, 0)
  };

  const statCards = [
    { title: 'Total Sales', value: `$${stats.totalSales.toFixed(2)}`, icon: DollarSign, color: 'bg-green-500', report: 'sales' },
    { title: 'Low Stock Items', value: stats.lowStock, icon: Package, color: 'bg-yellow-500', report: 'inventory' },
    { title: 'Expiring Soon', value: stats.expiringItems, icon: AlertTriangle, color: 'bg-red-500', report: 'inventory' },
    { title: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: TrendingUp, color: 'bg-blue-500', report: 'financial' }
  ];

  // Get medicines expiring in the next 5 days
  const expiringMedicines = medicines.filter(medicine => {
    const expiryDate = new Date(medicine.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 5 && daysUntilExpiry > 0;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Bell className="h-6 w-6" />
            {expiringMedicines.length > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {expiringMedicines.length}
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && expiringMedicines.length > 0 && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-10">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Expiring Medicines</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {expiringMedicines.map((medicine) => {
                  const expiryDate = new Date(medicine.expiryDate);
                  const today = new Date();
                  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <div key={medicine.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{medicine.name}</h4>
                          <p className="text-sm text-gray-600">
                            Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Stock: {medicine.stock} units
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <button
            key={index}
            onClick={() => setActiveReport(stat.report)}
            className="bg-white rounded-xl shadow-sm p-6 transition-transform hover:scale-105 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Sales</h3>
          <div className="space-y-4">
            {sales.map((sale) => {
              const medicine = medicines.find(m => m.id === sale.medicineId);
              return (
                <div key={sale.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium text-gray-800">{medicine?.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {sale.quantity}</p>
                  </div>
                  <p className="font-semibold text-green-600">${sale.totalAmount.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Alert</h3>
          <div className="space-y-4">
            {medicines.filter(med => med.stock < 100).map((medicine) => (
              <div key={medicine.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium text-gray-800">{medicine.name}</p>
                  <p className="text-sm text-gray-600">Current Stock: {medicine.stock}</p>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                  Low Stock
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SalesReportModal
        isOpen={activeReport === 'sales'}
        onClose={() => setActiveReport(null)}
      />

      <InventoryReportModal
        isOpen={activeReport === 'inventory'}
        onClose={() => setActiveReport(null)}
      />

      <FinancialReportModal
        isOpen={activeReport === 'financial'}
        onClose={() => setActiveReport(null)}
      />
    </div>
  );
}