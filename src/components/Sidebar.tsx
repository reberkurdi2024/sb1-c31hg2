import React from 'react';
import { LayoutDashboard, Pill, ShoppingCart, Settings, Users, Truck, Store, CreditCard, BarChart, UserCircle, Plus, ShoppingBag, LogOut } from 'lucide-react';
import { users } from '../data/mockData';
import AddMedicineModal from './AddMedicineModal';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const currentUser = users[0]; // Using the first user as the logged-in user for demo
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect or handle post-logout logic here
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'pos', icon: CreditCard, label: 'Point of Sale' },
    { id: 'inventory', icon: Pill, label: 'Inventory' },
    { id: 'sales', icon: ShoppingCart, label: 'Sales' },
    { id: 'purchases', icon: ShoppingBag, label: 'Purchases' },
    { id: 'customers', icon: Users, label: 'Customers' },
    { id: 'suppliers', icon: Truck, label: 'Suppliers' },
    { id: 'vendors', icon: Store, label: 'Vendors' },
    { id: 'reports', icon: BarChart, label: 'Reports' },
    { id: 'users', icon: UserCircle, label: 'Users' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="bg-white h-screen w-64 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Pill className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">PharmaCare</h1>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random`}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium text-gray-800">{currentUser.name}</h3>
              <p className="text-sm text-gray-500">{currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
            title="Add Medicine"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>

      <AddMedicineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={(medicine) => {
          // Handle adding medicine
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}