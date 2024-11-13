import React, { useState } from 'react';
import { X, Download, TrendingUp, DollarSign, CreditCard } from 'lucide-react';
import { Sale } from '../../types';
import { sales } from '../../data/mockData';

interface FinancialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FinancialReportModal({ isOpen, onClose }: FinancialReportModalProps) {
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
  const averageOrderValue = totalRevenue / sales.length;
  const dailyRevenue = totalRevenue / 30; // Simplified calculation

  // Group sales by date for the chart
  const salesByDate = sales.reduce((acc: { [key: string]: number }, sale) => {
    acc[sale.date] = (acc[sale.date] || 0) + sale.totalAmount;
    return acc;
  }, {});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Financial Report</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-auto">
          <div className="flex items-center gap-4">
            <input
              type="date"
              className="px-3 py-2 border rounded-lg"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
            <span>to</span>
            <input
              type="date"
              className="px-3 py-2 border rounded-lg"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-700">
                    ${totalRevenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600">Average Order Value</p>
                  <p className="text-2xl font-bold text-blue-700">
                    ${averageOrderValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-600">Daily Revenue</p>
                  <p className="text-2xl font-bold text-purple-700">
                    ${dailyRevenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Revenue Breakdown</h4>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Revenue chart will be displayed here
            </div>
          </div>

          <div className="bg-white rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Order Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(salesByDate).map(([date, revenue]) => {
                  const dateOrders = sales.filter(s => s.date === date);
                  const avgOrderValue = revenue / dateOrders.length;
                  
                  return (
                    <tr key={date} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        ${revenue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dateOrders.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${avgOrderValue.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 border-t">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}