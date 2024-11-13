import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Plus, Minus, X, CreditCard, Scan } from 'lucide-react';
import { Medicine } from '../types';
import { playBeep } from '../utils/sound';
import { useInventoryTransactions } from '../hooks/useInventoryTransactions';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CartItem extends Medicine {
  quantity: number;
}

export default function POS() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const { processSale } = useInventoryTransactions();

  useEffect(() => {
    fetchMedicines();
  }, []);

  async function fetchMedicines() {
    try {
      const medicinesRef = collection(db, 'medicines');
      const querySnapshot = await getDocs(medicinesRef);
      const medicinesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Medicine));
      setMedicines(medicinesList);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  }

  const categories = Array.from(new Set(medicines.map(medicine => medicine.category)));

  const filteredMedicines = medicines.filter(medicine =>
    (selectedCategory === 'all' || medicine.category === selectedCategory) &&
    (medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const medicine = medicines.find(m => m.drugCode === barcodeInput);
    if (medicine) {
      handleMedicineClick(medicine);
      setBarcodeInput('');
    } else {
      const input = document.getElementById('barcode-input');
      if (input) {
        input.classList.add('border-red-500');
        setTimeout(() => input.classList.remove('border-red-500'), 1000);
      }
    }
  };

  const handleMedicineClick = (medicine: Medicine) => {
    playBeep();
    addToCart(medicine);
  };

  const addToCart = (medicine: Medicine) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === medicine.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...medicine, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    if (delta > 0) {
      playBeep();
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const calculateItemTotal = (item: CartItem) => {
    return item.price * item.quantity;
  };

  const total = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const handleCheckout = async () => {
    try {
      // Process each item in the cart
      for (const item of cart) {
        const success = await processSale({
          medicineId: item.id,
          quantity: item.quantity,
          unitPrice: item.price
        });

        if (!success) {
          throw new Error(`Failed to process sale for ${item.name}`);
        }
      }

      // Clear cart and close checkout
      setCart([]);
      setShowCheckout(false);

      // Refresh inventory
      fetchMedicines();
    } catch (error) {
      console.error('Checkout error:', error);
      // Show error message to user
    }
  };

  return (
    <div className="flex h-full">
      {/* Products Section */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search medicines..."
                  className="flex-1 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  onClick={() => setShowBarcodeScanner(!showBarcodeScanner)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title="Scan Barcode"
                >
                  <Scan className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {showBarcodeScanner && (
            <form onSubmit={handleBarcodeSubmit} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex gap-2">
                <input
                  id="barcode-input"
                  type="text"
                  placeholder="Scan or enter barcode..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Item
                </button>
              </div>
            </form>
          )}

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {filteredMedicines.map((medicine) => (
            <div
              key={medicine.id}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleMedicineClick(medicine)}
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                <img
                  src={medicine.image || `https://via.placeholder.com/400x400?text=${encodeURIComponent(medicine.name)}`}
                  alt={medicine.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x400?text=${encodeURIComponent(medicine.name)}`;
                  }}
                />
              </div>
              <h3 className="font-semibold text-gray-800">{medicine.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{medicine.manufacturer}</p>
              {medicine.drugCode && (
                <p className="text-xs text-gray-500 mt-1 font-mono">#{medicine.drugCode}</p>
              )}
              <div className="flex justify-between items-center mt-3">
                <span className="text-lg font-bold text-blue-600">
                  ${medicine.price.toFixed(2)}
                </span>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  medicine.stock < 100 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  Stock: {medicine.stock}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Cart</h2>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 mt-4">Cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={item.image || `https://via.placeholder.com/100x100?text=${encodeURIComponent(item.name)}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/100x100?text=${encodeURIComponent(item.name)}`;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="h-4 w-4 text-gray-600" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                      <span className="font-medium">
                        ${calculateItemTotal(item).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-between text-lg font-bold text-gray-800 mb-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => setShowCheckout(true)}
            disabled={cart.length === 0}
            className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard className="h-5 w-5" />
            Checkout
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Checkout</h3>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-t border-b border-gray-200 py-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between py-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${calculateItemTotal(item).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-lg font-bold pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
              >
                <CreditCard className="h-5 w-5" />
                Complete Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}