export interface Medicine {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  stock: number;
  expiryDate: string;
  category: string;
  image?: string;
  drugCode?: string;
}