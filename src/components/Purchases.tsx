import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Package, Calendar } from 'lucide-react';
import { Purchase, Medicine, Supplier } from '../types';
import AddPurchaseModal from './AddPurchaseModal';
import { collection, getDocs, query, where, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Purchases() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Fetch purchases
      const purchasesRef = collection(db, 'purchases');
      const purchasesSnapshot = await getDocs(purchasesRef);
      const purchasesList = purchasesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Purchase));
      setPurchases(purchasesList);

      // Fetch medicines
      const medicinesRef = collection(db, 'medicines');
      const medicinesSnapshot = await getDocs(medicinesRef);
      const medicinesList = medicinesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Medicine));
      setMedicines(medicinesList);

      // Fetch suppliers
      const suppliersRef = collection(db, 'suppliers');
      const suppliersSnapshot = await getDocs(suppliersRef);
      const suppliersList = suppliersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Supplier));
      setSuppliers(suppliersList);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleAddPurchase = async (purchase: Omit<Purchase, 'id'>) => {
    try {
      // Add purchase to Firestore
      const purchasesRef = collection(db, 'purchases');
      const docRef = await addDoc(purchasesRef, purchase);

      // Update medicine stock if purchase is received
      if (purchase.status === 'received') {
        const medicineRef = doc(db, 'medicines', purchase.medicineId);
        const medicine = medicines.find(m => m.id === purchase.medicineId);
        if (medicine) {
          await updateDoc(medicineRef, {
            stock: medicine.stock + purchase.quantity
          });
        }
      }

      // Refresh data
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding purchase:', error);
    }
  };

  const filteredPurchases = purchases.filter(purchase => {
    const medicine = medicines.find(m => m.id === purchase.medicineId);
    const supplier = suppliers.find(s => s.id === purchase.supplierId);
    return (
      medicine?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalSpent = filteredPurchases.reduce((acc, purchase) => acc + purchase.totalAmount, 0);
  const pendingOrders = filteredPurchases.filter(p => p.status === 'pending').length;
  const receivedOrders = filteredPurchases.filter(p => p.status === 'received').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Purchase Orders</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Purchase Order
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search purchases..."
          className="flex-1 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-800">
                ${totalSpent.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-800">{pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Received Orders</p>
              <p className="text-2xl font-bold text-gray-800">{receivedOrders}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Purchase Orders</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPurchases.map((purchase) => {
              const medicine = medicines.find(m => m.id === purchase.medicineId);
              const supplier = suppliers.find(s => s.id === purchase.supplierId);
              return (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {purchase.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{medicine?.name}</div>
                    <div className="text-sm text-gray-500">{medicine?.manufacturer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{supplier?.name}</div>
                    <div className="text-sm text-gray-500">{supplier?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${purchase.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      purchase.status === 'received' ? 'bg-green-100 text-green-800' :
                      purchase.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AddPurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddPurchase}
        medicines={medicines}
        suppliers={suppliers}
      />
    </div>
  );
}