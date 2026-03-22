export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "CASHIER";
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
  sku: string;
  barcode?: string;
  image?: string;
  categoryId: string;
  category?: Category;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: "CASH" | "CARD" | "TRANSFER" | "PROMPTPAY";
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "REFUNDED";
  cashierId: string;
  cashier?: User;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
