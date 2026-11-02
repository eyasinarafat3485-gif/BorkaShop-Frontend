export type UserRole = "guest" | "user" | "admin";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: "abaya" | "burqa" | "hijab" | "khimar" | "modest-sets" | "niqab";
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  alternateImage?: string;
  tag?: string;
  inStock: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  sizes: string[];
  colors: { name: string; hex: string }[];
  description: string;
  fabric: string;
}

export interface CartItem {
  id: string; // unique item id (product id + size + color)
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryZone: "dhaka" | "outside_dhaka";
  deliveryFee: number;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  total: number;
  paymentMethod: "cod" | "bkash" | "nagad";
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  role: UserRole;
  createdAt: string;
}
