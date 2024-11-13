import { Medicine, Sale, Customer, Supplier, Vendor, User, Purchase } from '../types';

export const medicines: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol',
    manufacturer: 'PharmaCorp',
    price: 9.99,
    stock: 150,
    expiryDate: '2025-12-31',
    category: 'Pain Relief'
  },
  {
    id: '2',
    name: 'Amoxicillin',
    manufacturer: 'MediLabs',
    price: 24.99,
    stock: 80,
    expiryDate: '2025-06-30',
    category: 'Antibiotics'
  },
  {
    id: '3',
    name: 'Omeprazole',
    manufacturer: 'HealthCare Inc',
    price: 19.99,
    stock: 100,
    expiryDate: '2025-09-30',
    category: 'Digestive Health'
  }
];

export const purchases: Purchase[] = [
  {
    id: '1',
    medicineId: '1',
    supplierId: '1',
    quantity: 200,
    unitPrice: 7.50,
    totalAmount: 1500,
    date: '2024-03-10',
    status: 'received',
    invoiceNumber: 'INV-2024-001'
  },
  {
    id: '2',
    medicineId: '2',
    supplierId: '2',
    quantity: 150,
    unitPrice: 18.75,
    totalAmount: 2812.50,
    date: '2024-03-12',
    status: 'pending',
    invoiceNumber: 'INV-2024-002'
  }
];

export const sales: Sale[] = [
  {
    id: '1',
    medicineId: '1',
    quantity: 5,
    totalAmount: 49.95,
    date: '2024-03-15'
  },
  {
    id: '2',
    medicineId: '2',
    quantity: 2,
    totalAmount: 49.98,
    date: '2024-03-15'
  }
];

export const customers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, USA',
    lastPurchase: '2024-03-15',
    totalPurchases: 1250.50
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave, Somewhere, USA',
    lastPurchase: '2024-03-14',
    totalPurchases: 850.75
  }
];

export const suppliers: Supplier[] = [
  {
    id: '1',
    name: 'PharmaCorp Supplies',
    email: 'orders@pharmacorp.com',
    phone: '(555) 111-2233',
    address: '789 Industry Blvd, Business City, USA',
    products: ['Pain Relief', 'Antibiotics'],
    lastDelivery: '2024-03-10'
  },
  {
    id: '2',
    name: 'MediLabs Distribution',
    email: 'supply@medilabs.com',
    phone: '(555) 444-5566',
    address: '321 Commerce St, Trade City, USA',
    products: ['Antibiotics', 'Digestive Health'],
    lastDelivery: '2024-03-12'
  }
];

export const vendors: Vendor[] = [
  {
    id: '1',
    name: 'Medical Equipment Co',
    email: 'sales@medequip.com',
    phone: '(555) 777-8899',
    address: '159 Tech Road, Innovation City, USA',
    category: 'Equipment',
    status: 'active'
  },
  {
    id: '2',
    name: 'Healthcare Packaging',
    email: 'orders@hcpackaging.com',
    phone: '(555) 000-1122',
    address: '753 Package Lane, Box Town, USA',
    category: 'Packaging',
    status: 'active'
  }
];

export const users: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@pharmacare.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-03-15 09:30:00',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    permissions: ['manage_inventory', 'manage_users', 'manage_sales', 'view_reports']
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@pharmacare.com',
    role: 'pharmacist',
    status: 'active',
    lastLogin: '2024-03-15 08:45:00',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    permissions: ['manage_inventory', 'view_sales', 'view_reports']
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@pharmacare.com',
    role: 'cashier',
    status: 'active',
    lastLogin: '2024-03-15 08:00:00',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    permissions: ['process_sales', 'view_inventory']
  }
];