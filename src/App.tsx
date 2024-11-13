import React from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Customers from './components/Customers';
import Suppliers from './components/Suppliers';
import Vendors from './components/Vendors';
import Reports from './components/Reports';
import POS from './components/POS';
import Users from './components/Users';
import Purchases from './components/Purchases';
import SettingsModal from './components/SettingsModal';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const handleTabChange = (tab: string) => {
    if (tab === 'settings') {
      setIsSettingsOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'pos':
        return <POS />;
      case 'inventory':
        return <Inventory />;
      case 'sales':
        return <Sales />;
      case 'purchases':
        return <Purchases />;
      case 'customers':
        return <Customers />;
      case 'suppliers':
        return <Suppliers />;
      case 'vendors':
        return <Vendors />;
      case 'reports':
        return <Reports />;
      case 'users':
        return <Users />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="flex h-screen bg-gray-100">
          <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
          <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
          />
        </div>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;