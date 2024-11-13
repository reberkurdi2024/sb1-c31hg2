interface Translation {
  [key: string]: {
    [key: string]: string;
  };
}

export const translations: Translation = {
  en: {
    // Navigation & Titles
    dashboard: 'Dashboard',
    dashboardOverview: 'Dashboard Overview',
    pos: 'Point of Sale',
    inventory: 'Inventory',
    inventoryManagement: 'Inventory Management',
    sales: 'Sales',
    salesOverview: 'Sales Overview',
    customers: 'Customers',
    customerManagement: 'Customer Management',
    suppliers: 'Suppliers',
    supplierManagement: 'Supplier Management',
    vendors: 'Vendors',
    vendorManagement: 'Vendor Management',
    settings: 'Settings',
    systemSettings: 'System Settings',

    // Common Actions
    search: 'Search',
    searchMedicines: 'Search medicines...',
    searchCustomers: 'Search customers...',
    searchSuppliers: 'Search suppliers...',
    searchVendors: 'Search vendors...',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save Changes',
    cancel: 'Cancel',
    close: 'Close',

    // Form Labels
    companyName: 'Company Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    currency: 'Currency',
    language: 'Language',
    category: 'Category',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    price: 'Price',
    stock: 'Stock',
    quantity: 'Quantity',
    date: 'Date',
    expiryDate: 'Expiry Date',
    manufacturer: 'Manufacturer',
    lowStockThreshold: 'Low Stock Threshold',

    // Medicine Related
    addMedicine: 'Add Medicine',
    medicineName: 'Medicine Name',
    medicineDetails: 'Medicine Details',
    lowStock: 'Low Stock',
    expiringItems: 'Expiring Soon',
    currentStock: 'Current Stock',

    // Sales Related
    newSale: 'New Sale',
    addSale: 'Add Sale',
    totalSales: 'Total Sales',
    todaySales: "Today's Sales",
    totalOrders: 'Total Orders',
    averageDailySales: 'Average Daily Sales',
    recentSales: 'Recent Sales',
    checkout: 'Checkout',
    completePayment: 'Complete Payment',
    cart: 'Cart',
    cartEmpty: 'Cart is empty',
    totalAmount: 'Total Amount',

    // Customer Related
    addCustomer: 'Add Customer',
    newCustomer: 'Add New Customer',
    fullName: 'Full Name',
    lastPurchase: 'Last Purchase',
    totalPurchases: 'Total Purchases',
    noPurchases: 'No purchases yet',

    // Supplier Related
    addSupplier: 'Add Supplier',
    newSupplier: 'Add New Supplier',
    productsSupplied: 'Products Supplied',
    lastDelivery: 'Last Delivery',
    enterProductCategory: 'Enter product category',

    // Vendor Related
    addVendor: 'Add Vendor',
    newVendor: 'Add New Vendor',

    // Settings
    enableNotifications: 'Enable Email Notifications',
    enableAutoBackup: 'Enable Automatic Backup'
  },
  ar: {
    // Navigation & Titles
    dashboard: 'لوحة التحكم',
    dashboardOverview: 'نظرة عامة على لوحة التحكم',
    pos: 'نقطة البيع',
    inventory: 'المخزون',
    inventoryManagement: 'إدارة المخزون',
    sales: 'المبيعات',
    salesOverview: 'نظرة عامة على المبيعات',
    customers: 'العملاء',
    customerManagement: 'إدارة العملاء',
    suppliers: 'الموردين',
    supplierManagement: 'إدارة الموردين',
    vendors: 'البائعين',
    vendorManagement: 'إدارة البائعين',
    settings: 'الإعدادات',
    systemSettings: 'إعدادات النظام',

    // Common Actions
    search: 'بحث',
    searchMedicines: 'البحث عن الأدوية...',
    searchCustomers: 'البحث عن العملاء...',
    searchSuppliers: 'البحث عن الموردين...',
    searchVendors: 'البحث عن البائعين...',
    add: 'إضافة',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ التغييرات',
    cancel: 'إلغاء',
    close: 'إغلاق',

    // Form Labels
    companyName: 'اسم الشركة',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    address: 'العنوان',
    currency: 'العملة',
    language: 'اللغة',
    category: 'الفئة',
    status: 'الحالة',
    active: 'نشط',
    inactive: 'غير نشط',
    price: 'السعر',
    stock: 'المخزون',
    quantity: 'الكمية',
    date: 'التاريخ',
    expiryDate: 'تاريخ الانتهاء',
    manufacturer: 'الشركة المصنعة',
    lowStockThreshold: 'حد المخزون المنخفض',

    // Medicine Related
    addMedicine: 'إضافة دواء',
    medicineName: 'اسم الدواء',
    medicineDetails: 'تفاصيل الدواء',
    lowStock: 'مخزون منخفض',
    expiringItems: 'ينتهي قريباً',
    currentStock: 'المخزون الحالي',

    // Sales Related
    newSale: 'بيع جديد',
    addSale: 'إضافة بيع',
    totalSales: 'إجمالي المبيعات',
    todaySales: 'مبيعات اليوم',
    totalOrders: 'إجمالي الطلبات',
    averageDailySales: 'متوسط المبيعات اليومية',
    recentSales: 'المبيعات الأخيرة',
    checkout: 'الدفع',
    completePayment: 'إتمام الدفع',
    cart: 'سلة التسوق',
    cartEmpty: 'سلة التسوق فارغة',
    totalAmount: 'المبلغ الإجمالي',

    // Customer Related
    addCustomer: 'إضافة عميل',
    newCustomer: 'إضافة عميل جديد',
    fullName: 'الاسم الكامل',
    lastPurchase: 'آخر شراء',
    totalPurchases: 'إجمالي المشتريات',
    noPurchases: 'لا توجد مشتريات بعد',

    // Supplier Related
    addSupplier: 'إضافة مورد',
    newSupplier: 'إضافة مورد جديد',
    productsSupplied: 'المنتجات الموردة',
    lastDelivery: 'آخر توريد',
    enterProductCategory: 'أدخل فئة المنتج',

    // Vendor Related
    addVendor: 'إضافة بائع',
    newVendor: 'إضافة بائع جديد',

    // Settings
    enableNotifications: 'تفعيل إشعارات البريد الإلكتروني',
    enableAutoBackup: 'تفعيل النسخ الاحتياطي التلقائي'
  }
};