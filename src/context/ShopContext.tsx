"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, CartItem, Order, UserRole } from "@/types";
import toast from "react-hot-toast";

import { PRODUCTS } from "@/data/products";

export interface ShippingSettings {
  insideDhaka: number;
  outsideDhaka: number;
  freeShippingThreshold: number;
  helplinePhone: string;
  helplineEmail: string;
  enableCod: boolean;
  enableBkash: boolean;
  enableNagad: boolean;
  enableRocket: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  createdAt?: string | Date;
}

export interface StoreNotification {
  _id: string;
  id?: string;
  title: string;
  message: string;
  type: "order" | "stock" | "system" | "customer" | "payment";
  isRead: boolean;
  orderId?: string;
  price?: number;
  productImage?: string;
  createdAt: string | Date;
}

interface ShopContextType {
  role: UserRole;
  setRole: (role: UserRole, silent?: boolean) => void;
  cart: CartItem[];
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  quickOrderProduct: Product | null;
  openQuickOrder: (product: Product) => void;
  closeQuickOrder: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isTrackOrderOpen: boolean;
  setIsTrackOrderOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  orders: Order[];
  placeOrder: (orderData: Omit<Order, "id" | "createdAt" | "status">) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  deleteOrder: (orderId: string) => void;
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  customers: Customer[];
  deleteCustomer: (id: string) => Promise<void>;
  updateCustomer: (id: string, updated: Partial<Customer>) => Promise<void>;
  refreshDashboardData: () => Promise<void>;
  shippingSettings: ShippingSettings;
  updateShippingSettings: (settings: Partial<ShippingSettings>) => void;
  notifications: StoreNotification[];
  unreadNotificationsCount: number;
  notificationCounts: { all: number; unread: number };
  markNotificationAsRead: (id: string) => Promise<void>;
  markNotificationAsUnread: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  fetchNotifications: (type?: string, page?: number) => Promise<void>;
  syncCheckoutInfo: (info: any) => void;
  resetForNewUser: (user: { email: string; name?: string; role?: string; id?: string }) => Promise<void>;
  currentUser: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    deliveryArea?: "dhaka" | "outside_dhaka";
    role?: string;
  } | null;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const DEFAULT_ORDERS: Order[] = [
  {
    id: "BS-8921",
    customerName: "Ayesha Siddiqua",
    phone: "01712345678",
    address: "House 14, Road 5, Dhanmondi, Dhaka",
    deliveryZone: "dhaka",
    deliveryFee: 70,
    items: [
      {
        productId: "prod-1876",
        productName: "Classic Everyday Black Burqa",
        productImage: "https://borkashop.borbila.net/wp-content/uploads/2026/08/classic-everyday-black-burqa.png",
        size: "54",
        color: "Jet Black",
        quantity: 1,
        price: 3034,
      },
    ],
    subtotal: 3034,
    total: 3104,
    paymentMethod: "cod",
    status: "Processing",
    role: "user",
    createdAt: "Today, 10:30 AM",
  },
  {
    id: "BS-8920",
    customerName: "Nusrat Jahan",
    phone: "01898765432",
    address: "Flat 4B, Green Road, Farmgate, Dhaka",
    deliveryZone: "dhaka",
    deliveryFee: 70,
    items: [
      {
        productId: "prod-1918",
        productName: "Elegant Modest Two Piece Set",
        productImage: "https://borkashop.borbila.net/wp-content/uploads/2026/08/classic-lightweight-long-niqab.png",
        size: "52",
        color: "Mocha",
        quantity: 1,
        price: 4924,
      },
      {
        productId: "prod-1924",
        productName: "Classic Lightweight Long Niqab",
        productImage: "https://borkashop.borbila.net/wp-content/uploads/2026/08/classic-lightweight-long-niqab.png",
        size: "Standard",
        color: "Jet Black",
        quantity: 2,
        price: 1250,
      },
    ],
    subtotal: 7424,
    total: 7494,
    paymentMethod: "bkash",
    status: "Pending",
    role: "guest",
    createdAt: "Today, 09:15 AM",
  },
  {
    id: "BS-8919",
    customerName: "Farhana Akter",
    phone: "01933445566",
    address: "Chittagong GEC Circle, Nasirabad, Chattogram",
    deliveryZone: "outside_dhaka",
    deliveryFee: 130,
    items: [
      {
        productId: "prod-1876",
        productName: "Classic Everyday Black Burqa",
        productImage: "https://borkashop.borbila.net/wp-content/uploads/2026/08/classic-everyday-black-burqa.png",
        size: "56",
        color: "Black",
        quantity: 1,
        price: 3034,
      },
    ],
    subtotal: 3034,
    total: 3164,
    paymentMethod: "cod",
    status: "Shipped",
    role: "user",
    createdAt: "Yesterday, 04:45 PM",
  },
  {
    id: "BS-8918",
    customerName: "Sadia Rahman",
    phone: "01677889900",
    address: "Block C, Bashundhara R/A, Dhaka",
    deliveryZone: "dhaka",
    deliveryFee: 70,
    items: [
      {
        productId: "prod-1924",
        productName: "Classic Lightweight Long Niqab",
        productImage: "https://borkashop.borbila.net/wp-content/uploads/2026/08/classic-lightweight-long-niqab.png",
        size: "Extra Long",
        color: "Dark Coffee",
        quantity: 1,
        price: 1250,
      },
    ],
    subtotal: 1250,
    total: 1320,
    paymentMethod: "nagad",
    status: "Delivered",
    role: "guest",
    createdAt: "2 days ago",
  },
  {
    id: "BS-8915",
    customerName: "Tahsina Karim",
    phone: "01555667788",
    address: "Sylhet Sadar, Zindabazar, Sylhet",
    deliveryZone: "outside_dhaka",
    deliveryFee: 130,
    items: [
      {
        productId: "prod-1918",
        productName: "Elegant Modest Two Piece Set",
        productImage: "https://borkashop.borbila.net/wp-content/uploads/2026/08/classic-lightweight-long-niqab.png",
        size: "54",
        color: "Black",
        quantity: 1,
        price: 4924,
      },
    ],
    subtotal: 4924,
    total: 5054,
    paymentMethod: "cod",
    status: "Cancelled",
    role: "user",
    createdAt: "3 days ago",
  },
];

const DEFAULT_NOTIFICATIONS: StoreNotification[] = [
  {
    _id: "notif-1",
    id: "notif-1",
    title: "New Order Placed",
    message: "Order #BS-8921 by Tanzila Rahman for ৳4,350 has been recorded. Fulfillment pending.",
    type: "order",
    isRead: false,
    orderId: "BS-8921",
    price: 4350,
    productImage: "https://borkashop.borbila.net/wp-content/uploads/2026/08/classic-everyday-black-burqa.png",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    _id: "notif-2",
    id: "notif-2",
    title: "SMS Gateway Alert",
    message: "Cash on Delivery confirmation SMS sent to Nusrat Jahan (01712-998877) for Order #BS-8922.",
    type: "order",
    isRead: false,
    orderId: "BS-8922",
    price: 3450,
    productImage: "https://borkashop.borbila.net/wp-content/uploads/2026/08/dubai-cherry-georgette-abaya.png",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    _id: "notif-3",
    id: "notif-3",
    title: "Low Inventory Warning",
    message: "'Luxury Dubai Stone Work Abaya' (Size 54) reached low stock threshold (2 units remaining).",
    type: "stock",
    isRead: false,
    price: 5200,
    productImage: "https://borkashop.borbila.net/wp-content/uploads/2026/08/premium-crinkle-chiffon-hijab.png",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "notif-4",
    id: "notif-4",
    title: "Customer Registration",
    message: "Sumaiya Akter created a new customer account via Google Authentication.",
    type: "customer",
    isRead: true,
    price: 0,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "notif-5",
    id: "notif-5",
    title: "Order Dispatched",
    message: "Order #BS-8924 for Farhana Islam handed over to SteadFast Courier.",
    type: "order",
    isRead: true,
    orderId: "BS-8924",
    price: 3200,
    productImage: "https://borkashop.borbila.net/wp-content/uploads/2026/08/classic-everyday-black-burqa.png",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "notif-6",
    id: "notif-6",
    title: "MongoDB Atlas Connected",
    message: "Primary cluster synced successfully with database 'borkashop'. Automated index verification complete.",
    type: "system",
    isRead: true,
    price: 0,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function ShopProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("guest");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>(DEFAULT_ORDERS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [notifications, setNotifications] = useState<StoreNotification[]>(DEFAULT_NOTIFICATIONS);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(3);
  const [notificationCounts, setNotificationCounts] = useState<{ all: number; unread: number }>({
    all: DEFAULT_NOTIFICATIONS.length,
    unread: 3,
  });
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    insideDhaka: 70,
    outsideDhaka: 130,
    freeShippingThreshold: 4000,
    helplinePhone: "01810 559 258",
    helplineEmail: "support@burkashop.com",
    enableCod: true,
    enableBkash: true,
    enableNagad: true,
    enableRocket: true,
  });

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    deliveryArea?: "dhaka" | "outside_dhaka";
    role?: string;
  } | null>(null);
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://borkashop-backend.onrender.com/api";

  // Helper to obtain unique user key across admin, user, and guest roles
  // Logged-in users are identified strictly by their email.
  // Guest users are identified strictly by their unique device ID.
  const getUserIdentity = () => {
    if (typeof window === "undefined") {
      return { userKey: "guest_init", email: "", role: "guest" as UserRole, isGuest: true };
    }

    try {
      const savedUserStr = localStorage.getItem("borkashop_user");
      if (savedUserStr) {
        const u = JSON.parse(savedUserStr);
        if (u && (u.email || u.id)) {
          const cleanEmail = (u.email || u.id).toLowerCase().trim();
          return {
            userKey: `user:${cleanEmail}`,
            email: u.email ? cleanEmail : "",
            phone: u.phone || "",
            customerName: u.name || "",
            role: (u.role || role || "user") as UserRole,
            userId: u.id || "",
            isGuest: false,
          };
        }
      }

      // Guest: check or generate unique device ID
      let deviceId = localStorage.getItem("borkashop_guest_device_id");
      if (!deviceId) {
        deviceId = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem("borkashop_guest_device_id", deviceId);
      }

      return {
        userKey: `guest:${deviceId}`,
        email: "",
        phone: "",
        customerName: "",
        role: "guest" as UserRole,
        isGuest: true,
      };
    } catch {
      return { userKey: "guest_fallback", email: "", role: "guest" as UserRole, isGuest: true };
    }
  };

  // Real-time synchronization to MongoDB Atlas 'my-collection'
  const syncToMyCollection = async (payload: {
    cart?: CartItem[];
    wishlist?: string[];
    checkoutInfo?: any;
    order?: Order;
  }) => {
    try {
      const userIdent = getUserIdentity();
      await fetch(`${API_BASE}/my-collection/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userIdent,
          ...payload,
        }),
      });
    } catch {
      // Background non-blocking sync
    }
  };

  // Explicit initialization for a BRAND NEW user (ensures zero guest data leakage)
  const resetForNewUser = async (user: { email: string; name?: string; role?: string; id?: string }) => {
    setIsDataLoaded(false);

    // Instantly reset React memory states to empty
    setCart([]);
    setWishlist([]);
    setOrders([]);

    const cleanEmail = user.email.toLowerCase().trim();
    const newUserKey = `user:${cleanEmail}`;
    const userRole = (user.role || "user") as UserRole;

    const initialUserData = {
      id: user.id || "",
      name: user.name || "",
      email: cleanEmail,
      phone: "",
      address: "",
      deliveryArea: "outside_dhaka" as const,
      role: userRole,
    };
    setCurrentUser(initialUserData);

    try {
      localStorage.setItem("borkashop_user", JSON.stringify({ ...user, ...initialUserData }));
      localStorage.setItem("borkashop_role", userRole);
      // Clean isolated storage keys for this new user
      localStorage.setItem(`borkashop_cart_${newUserKey}`, JSON.stringify([]));
      localStorage.setItem(`borkashop_wishlist_${newUserKey}`, JSON.stringify([]));
      // Remove any guest checkout details so new user starts completely fresh
      localStorage.removeItem("borkashop_guest_phone");
      localStorage.removeItem("borkashop_guest_name");
      localStorage.removeItem("borkashop_guest_email");
    } catch {}

    setRoleState(userRole);

    // Initialize clean document in MongoDB Atlas 'my-collection'
    try {
      await fetch(`${API_BASE}/my-collection/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userKey: newUserKey,
          email: cleanEmail,
          customerName: user.name || "",
          role: userRole,
          userId: user.id || "",
          cart: [],
          wishlist: [],
          orders: [],
          isNewUser: true,
        }),
      });
    } catch (err) {
      console.warn("Failed to initialize new user in my-collection:", err);
    } finally {
      setIsDataLoaded(true);
    }
  };

  // Load and isolate data strictly for the active user or guest device
  const loadActiveUserData = async () => {
    setIsDataLoaded(false);

    const ident = getUserIdentity();
    const cartStorageKey = `borkashop_cart_${ident.userKey}`;
    const wishlistStorageKey = `borkashop_wishlist_${ident.userKey}`;

    // 1. Instantly read local cache for this specific user/device
    let cachedCart: CartItem[] = [];
    let cachedWishlist: string[] = [];
    try {
      const c = localStorage.getItem(cartStorageKey);
      if (c) cachedCart = JSON.parse(c);
      const w = localStorage.getItem(wishlistStorageKey);
      if (w) cachedWishlist = JSON.parse(w);
    } catch {}

    setCart(cachedCart);
    setWishlist(cachedWishlist);

    // 2. Fetch from MongoDB Atlas 'my-collection' for this specific identity
    try {
      const params = new URLSearchParams();
      params.set("userKey", ident.userKey);
      if (ident.email) params.set("email", ident.email);

      const res = await fetch(`${API_BASE}/my-collection?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json && json.data) {
          const remoteCart: CartItem[] = json.data.cart || [];
          const remoteWishlist: string[] = json.data.wishlist || [];
          setCart(remoteCart);
          setWishlist(remoteWishlist);

          try {
            localStorage.setItem(cartStorageKey, JSON.stringify(remoteCart));
            localStorage.setItem(wishlistStorageKey, JSON.stringify(remoteWishlist));
          } catch {}

          if (ident.role === "admin") {
            refreshDashboardData();
          } else {
            setOrders(json.data.orders || []);
          }

          // If logged-in user: resolve their saved profile info from account & database
          if (!ident.isGuest) {
            try {
              const savedUserStr = localStorage.getItem("borkashop_user");
              const u = savedUserStr ? JSON.parse(savedUserStr) : {};
              const doc = json.data;
              const lastOrder = Array.isArray(doc.orders) && doc.orders.length > 0 ? doc.orders[0] : null;
              const resolvedUser = {
                id: u.id || doc.userId || "",
                name: u.name || doc.customerName || "",
                email: u.email || doc.email || ident.email || "",
                phone: u.phone || doc.phone || doc.checkoutInfo?.phone || lastOrder?.phone || "",
                address: u.address || doc.checkoutInfo?.address || lastOrder?.address || "",
                deliveryArea: (u.deliveryArea || doc.checkoutInfo?.deliveryArea || lastOrder?.deliveryZone || "outside_dhaka") as "dhaka" | "outside_dhaka",
                role: u.role || doc.role || ident.role,
              };
              setCurrentUser(resolvedUser);
              localStorage.setItem("borkashop_user", JSON.stringify({ ...u, ...resolvedUser }));
            } catch {}
          } else {
            setCurrentUser(null);
          }
        } else {
          // If no doc in my-collection yet, start empty (no products from previous users)
          setCart([]);
          setWishlist([]);
          if (ident.role !== "admin") {
            setOrders([]);
          }
          if (ident.isGuest) {
            setCurrentUser(null);
          } else {
            try {
              const savedUserStr = localStorage.getItem("borkashop_user");
              if (savedUserStr) {
                const u = JSON.parse(savedUserStr);
                setCurrentUser({
                  id: u.id || "",
                  name: u.name || "",
                  email: u.email || "",
                  phone: u.phone || "",
                  address: u.address || "",
                  deliveryArea: u.deliveryArea || "outside_dhaka",
                  role: u.role || ident.role,
                });
              }
            } catch {}
          }
          try {
            localStorage.setItem(cartStorageKey, JSON.stringify([]));
            localStorage.setItem(wishlistStorageKey, JSON.stringify([]));
          } catch {}
        }
      }
    } catch (err) {
      console.warn("Failed to sync my-collection from cloud:", err);
    } finally {
      setIsDataLoaded(true);
    }
  };

  // Sync role from localStorage on mount
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem("borkashop_role") as UserRole;
      if (savedRole && ["guest", "user", "admin"].includes(savedRole)) {
        setRoleState(savedRole);
      }
    } catch {}
  }, []);

  // Reload data whenever active role / user identity changes
  useEffect(() => {
    loadActiveUserData();
  }, [role]);

  // Save cart & real-time sync to 'my-collection' for this specific user/device
  useEffect(() => {
    if (!isDataLoaded) return;
    const ident = getUserIdentity();
    try {
      localStorage.setItem(`borkashop_cart_${ident.userKey}`, JSON.stringify(cart));
    } catch {}
    syncToMyCollection({ cart });
  }, [cart, isDataLoaded]);

  // Save wishlist & real-time sync to 'my-collection' for this specific user/device
  useEffect(() => {
    if (!isDataLoaded) return;
    const ident = getUserIdentity();
    try {
      localStorage.setItem(`borkashop_wishlist_${ident.userKey}`, JSON.stringify(wishlist));
    } catch {}
    syncToMyCollection({ wishlist });
  }, [wishlist, isDataLoaded]);

  const syncCheckoutInfo = (info: any) => {
    try {
      const ident = getUserIdentity();
      if (!ident.isGuest) {
        // Authenticated user: update their profile in context & localStorage
        setCurrentUser((prev) => ({
          ...prev,
          name: info.fullName || prev?.name,
          phone: info.phone || prev?.phone,
          address: info.address || prev?.address,
          deliveryArea: info.deliveryArea || prev?.deliveryArea,
        }));
        try {
          const raw = localStorage.getItem("borkashop_user");
          if (raw) {
            const u = JSON.parse(raw);
            localStorage.setItem(
              "borkashop_user",
              JSON.stringify({
                ...u,
                name: info.fullName || u.name,
                phone: info.phone || u.phone,
                address: info.address || u.address,
                deliveryArea: info.deliveryArea || u.deliveryArea,
              })
            );
          }
        } catch {}
      } else {
        // Guest user: strictly do not store in persistent guest cache
        try {
          localStorage.removeItem("borkashop_guest_phone");
          localStorage.removeItem("borkashop_guest_name");
        } catch {}
      }
      syncToMyCollection({ checkoutInfo: info });
    } catch {
      // ignore
    }
  };

  const toggleWishlist = (productId: string) => {
    const exists = wishlist.includes(productId);
    const updated = exists
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    setWishlist(updated);

    try {
      localStorage.setItem("borkashop_wishlist", JSON.stringify(updated));
    } catch {
      // ignore
    }

    syncToMyCollection({ wishlist: updated });

    if (exists) {
      toast("Removed from Wishlist", { icon: "🤍" });
    } else {
      toast.success("Added to Wishlist!", { icon: "❤️" });
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const setRole = (newRole: UserRole, silent: boolean = false) => {
    setRoleState(newRole);
    try {
      localStorage.setItem("borkashop_role", newRole);
      if (newRole === "guest") {
        localStorage.removeItem("borkashop_user");
        localStorage.removeItem("borkashop_guest_phone");
        localStorage.removeItem("borkashop_guest_name");
        setCurrentUser(null);
      }
    } catch {
      // ignore
    }

    // Instantly isolate and reload user/guest device data
    loadActiveUserData();

    if (!silent) {
      const roleLabels: Record<UserRole, string> = {
        guest: "Guest Mode (No login required to order)",
        user: "Customer Mode (Authenticated account)",
        admin: "Admin Mode (Store Management)",
      };
      toast.success(`Switched to ${roleLabels[newRole]}`, {
        icon: newRole === "guest" ? "👤" : newRole === "user" ? "✨" : "👑",
        style: {
          borderRadius: "10px",
          background: "#4F213B",
          color: "#fff",
          fontSize: "14px",
        },
      });
    }
  };

  const addToCart = (
    product: Product,
    size?: string,
    color?: string,
    quantity: number = 1
  ) => {
    const selectedSize = size || product.sizes[0] || "Standard";
    const selectedColor = color || product.colors[0]?.name || "Default";
    const itemId = `${product.id}-${selectedSize}-${selectedColor}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          size: selectedSize,
          color: selectedColor,
          quantity,
        },
      ];
    });

    toast.success(`Added ${product.name} to cart!`, {
      style: {
        borderRadius: "8px",
        background: "#4F213B",
        color: "#fff",
      },
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    toast("Item removed from cart", { icon: "🗑️" });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const openQuickOrder = (product: Product) => {
    addToCart(product, product.sizes[0] || "Standard", product.colors[0]?.name || "Default", 1);
    if (typeof window !== "undefined") {
      window.location.href = "/checkout";
    }
  };

  const closeQuickOrder = () => {
    setQuickOrderProduct(null);
  };

  const placeOrder = (orderData: Omit<Order, "id" | "createdAt" | "status">): Order => {
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const orderId = `BS-${orderNumber}`;
    const orderCreatedAt = new Date().toISOString();

    const userIdent = getUserIdentity();
    const effectiveRole = orderData.role || (role === "user" ? "user" : "guest");

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      status: "Pending",
      createdAt: orderCreatedAt,
      role: effectiveRole,
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev.filter((o) => o.id !== newOrder.id)];
      try {
        localStorage.setItem("borkashop_orders", JSON.stringify(updated));
        localStorage.setItem("borkashop_admin_orders", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (orderData.phone) {
      try {
        localStorage.setItem("borkashop_guest_phone", orderData.phone);
      } catch {}
    }
    if (orderData.customerName) {
      try {
        localStorage.setItem("borkashop_guest_name", orderData.customerName);
      } catch {}
    }

    // Sync to MongoDB Atlas 'orders' collection in background & refresh dashboard
    fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newOrder,
        createdAt: orderCreatedAt,
        userKey: userIdent.userKey,
        email: userIdent.email || "",
      }),
    })
      .then(async (res) => {
        if (res.ok) {
          // Immediately refresh admin dashboard live data and notifications
          await refreshDashboardData();
        }
      })
      .catch((err) => console.warn("Failed to sync new order to backend:", err));

    // Also sync order and reset cart in 'my-collection'
    syncToMyCollection({ order: newOrder, cart: [] });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) => {
      const updated = prev.map((ord) =>
        ord.id === orderId ? { ...ord, status } : ord
      );
      try {
        localStorage.setItem("borkashop_orders", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Sync status to MongoDB Atlas
    fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch((err) => console.warn("Failed to sync order status to backend:", err));

    toast.success(`Order ${orderId} updated to ${status}!`, { icon: "📦" });
  };

  const deleteOrder = async (orderId: string) => {
    setOrders((prev) => {
      const updated = prev.filter((ord) => ord.id !== orderId);
      try {
        localStorage.setItem("borkashop_orders", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      await fetch(`${API_BASE}/orders/${orderId}`, {
        method: "DELETE",
      });
      toast.success(`Order ${orderId} removed from database!`, { icon: "🗑️" });
      refreshDashboardData();
    } catch (err) {
      console.warn("Failed to delete order from backend:", err);
    }
  };

  const addProduct = async (newProduct: Product) => {
    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      try {
        localStorage.setItem("borkashop_custom_products", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) {
        toast.success(`Product "${newProduct.name}" saved to database!`, { icon: "✨" });
        refreshDashboardData();
      }
    } catch (err) {
      console.warn("Failed to save product to MongoDB:", err);
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, ...updatedFields } : p
      );
      try {
        localStorage.setItem("borkashop_custom_products", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (res.ok) {
        toast.success("Product updated in database!", { icon: "✅" });
        refreshDashboardData();
      }
    } catch (err) {
      console.warn("Failed to update product in MongoDB:", err);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem("borkashop_custom_products", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Product deleted from database!", { icon: "🗑️" });
        refreshDashboardData();
      }
    } catch (err) {
      console.warn("Failed to delete product from MongoDB:", err);
    }
  };

  const deleteCustomer = async (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    try {
      const res = await fetch(`${API_BASE}/admin/customers/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Customer removed successfully from database!", { icon: "🗑️" });
        refreshDashboardData();
      }
    } catch (err) {
      console.warn("Failed to delete customer from backend:", err);
    }
  };

  const updateCustomer = async (id: string, updated: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    try {
      await fetch(`${API_BASE}/admin/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      toast.success("Customer details updated in database!", { icon: "✅" });
      refreshDashboardData();
    } catch (err) {
      console.warn("Failed to update customer in backend:", err);
    }
  };

  const updateShippingSettings = async (newSettings: Partial<ShippingSettings>) => {
    const updated = { ...shippingSettings, ...newSettings };
    setShippingSettings(updated);
    try {
      localStorage.setItem("borkashop_shipping_settings", JSON.stringify(updated));
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setShippingSettings(data.settings);
          try {
            localStorage.setItem("borkashop_shipping_settings", JSON.stringify(data.settings));
          } catch {}
        }
      }
    } catch (err) {
      console.warn("Failed to save settings to backend storesettings collection:", err);
    }
    toast.success("Store & shipping settings saved to database!", { icon: "⚙️" });
  };

  // Helpers for read notification IDs persistence
  const getSavedReadIds = (): Set<string> => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("borkashop_read_notifications");
        if (saved) return new Set(JSON.parse(saved));
      }
    } catch {}
    return new Set<string>();
  };

  const saveReadIds = (readSet: Set<string>) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "borkashop_read_notifications",
          JSON.stringify(Array.from(readSet))
        );
      }
    } catch {}
  };

  // Notifications logic matching StyleHub /dashboard/notifications
  const fetchNotifications = async (type = "all", page = 1) => {
    try {
      const qType = type && type !== "all" ? `&type=${type}` : "";
      const res = await fetch(`${API_BASE}/notifications?page=${page}&limit=20${qType}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.notifications)) {
          const readIds = getSavedReadIds();
          const synced = data.notifications.map((n: StoreNotification) => {
            const isRead =
              n.isRead === true ||
              readIds.has(n._id) ||
              (n.id && readIds.has(n.id)) ||
              (n.orderId && readIds.has(n.orderId));
            return {
              ...n,
              isRead: Boolean(isRead),
            };
          });

          const currentUnread = synced.filter((n: StoreNotification) => !n.isRead).length;

          setNotifications(synced);
          setUnreadNotificationsCount(currentUnread);
          setNotificationCounts({
            all: data.counts?.all ?? synced.length,
            unread: currentUnread,
          });
        }
      }
    } catch (err) {
      console.warn("Failed to fetch notifications from backend:", err);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    if (!id) return;

    // 1. Instantly update state in React
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id || n.id === id || n.orderId === id ? { ...n, isRead: true } : n
      )
    );
    setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
    setNotificationCounts((prev) => ({
      ...prev,
      unread: Math.max(0, (prev.unread || 1) - 1),
    }));

    // 2. Persist in localStorage so it never reverts
    const readIds = getSavedReadIds();
    readIds.add(id);
    saveReadIds(readIds);

    toast.success("Notification marked as read ✔️", {
      id: `read-${id}`,
      duration: 2000,
    });

    // 3. Persist in Backend API
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: "PUT",
      });
    } catch (err) {
      console.warn("Failed to mark notification as read in backend:", err);
    }
  };

  const markNotificationAsUnread = async (id: string) => {
    if (!id) return;

    // 1. Instantly update state in React
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id || n.id === id || n.orderId === id ? { ...n, isRead: false } : n
      )
    );
    setUnreadNotificationsCount((prev) => prev + 1);
    setNotificationCounts((prev) => ({
      ...prev,
      unread: (prev.unread || 0) + 1,
    }));

    // 2. Remove from localStorage
    const readIds = getSavedReadIds();
    readIds.delete(id);
    saveReadIds(readIds);

    toast.success("Notification marked as unread ✉️", {
      id: `unread-${id}`,
      duration: 2000,
    });

    // 3. Persist in Backend API
    try {
      await fetch(`${API_BASE}/notifications/${id}/unread`, {
        method: "PUT",
      });
    } catch (err) {
      console.warn("Failed to mark notification as unread in backend:", err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    // 1. Instantly update all items in React state
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadNotificationsCount(0);
    setNotificationCounts((prev) => ({ ...prev, unread: 0 }));

    // 2. Persist all IDs in localStorage
    const readIds = getSavedReadIds();
    notifications.forEach((n) => {
      if (n._id) readIds.add(n._id);
      if (n.id) readIds.add(n.id);
      if (n.orderId) readIds.add(n.orderId);
    });
    saveReadIds(readIds);

    toast.success("All notifications marked as read! ✔️", {
      id: "mark-all-read",
      duration: 2500,
    });

    // 3. Persist in Backend API
    try {
      await fetch(`${API_BASE}/notifications/mark-all-read`, {
        method: "PUT",
      });
    } catch (err) {
      console.warn("Failed to mark all notifications read in backend:", err);
    }
  };

  const deleteNotification = async (id: string) => {
    const target = notifications.find(
      (n) => n._id === id || n.id === id || n.orderId === id
    );
    const wasUnread = target && !target.isRead;

    setNotifications((prev) =>
      prev.filter((n) => n._id !== id && n.id !== id && n.orderId !== id)
    );
    if (wasUnread) {
      setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
      setNotificationCounts((prev) => ({
        all: Math.max(0, prev.all - 1),
        unread: Math.max(0, prev.unread - 1),
      }));
    } else {
      setNotificationCounts((prev) => ({
        ...prev,
        all: Math.max(0, prev.all - 1),
      }));
    }

    try {
      await fetch(`${API_BASE}/notifications/${id}`, {
        method: "DELETE",
      });
      toast.success("Notification removed", { icon: "🗑️" });
    } catch (err) {
      console.warn("Failed to delete notification:", err);
    }
  };

  // Live real data synchronization from MongoDB Atlas
  const refreshDashboardData = async () => {
    try {
      const [prodRes, ordRes, custRes, setRes] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/orders`),
        fetch(`${API_BASE}/admin/customers`),
        fetch(`${API_BASE}/settings`),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.success && Array.isArray(prodData.products)) {
          setProducts(prodData.products);
          try {
            localStorage.setItem("borkashop_custom_products", JSON.stringify(prodData.products));
          } catch {}
        }
      }

      if (ordRes.ok) {
        const ordData = await ordRes.json();
        if (ordData.success && Array.isArray(ordData.orders)) {
          setOrders(ordData.orders);
          try {
            localStorage.setItem("borkashop_admin_orders", JSON.stringify(ordData.orders));
          } catch {}
        }
      }

      if (custRes.ok) {
        const custData = await custRes.json();
        if (custData.success && Array.isArray(custData.customers)) {
          setCustomers(custData.customers);
        }
      }

      if (setRes.ok) {
        const setData = await setRes.json();
        if (setData.success && setData.settings) {
          setShippingSettings(setData.settings);
          try {
            localStorage.setItem("borkashop_shipping_settings", JSON.stringify(setData.settings));
          } catch {}
        }
      }

      // Also refresh notifications
      await fetchNotifications();
    } catch (err) {
      console.warn("MongoDB Atlas live sync notice:", err);
    }
  };

  useEffect(() => {
    // 1. Initial hydration from localStorage
    try {
      const savedOrders = localStorage.getItem("borkashop_admin_orders") || localStorage.getItem("borkashop_orders");
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) setOrders(parsed);
      }
      const savedProducts = localStorage.getItem("borkashop_custom_products");
      if (savedProducts) {
        const parsedP = JSON.parse(savedProducts);
        if (Array.isArray(parsedP) && parsedP.length > 0) setProducts(parsedP);
      }
      const savedSettings = localStorage.getItem("borkashop_shipping_settings");
      if (savedSettings) {
        setShippingSettings(JSON.parse(savedSettings));
      }
    } catch {}

    // 2. Fetch live data from MongoDB Atlas
    refreshDashboardData();
  }, [API_BASE, role]);

  return (
    <ShopContext.Provider
      value={{
        role,
        setRole,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        quickOrderProduct,
        openQuickOrder,
        closeQuickOrder,
        isSearchOpen,
        setIsSearchOpen,
        isTrackOrderOpen,
        setIsTrackOrderOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        customers,
        deleteCustomer,
        updateCustomer,
        refreshDashboardData,
        shippingSettings,
        updateShippingSettings,
        notifications,
        unreadNotificationsCount,
        notificationCounts,
        markNotificationAsRead,
        markNotificationAsUnread,
        markAllNotificationsAsRead,
        deleteNotification,
        fetchNotifications,
        syncCheckoutInfo,
        resetForNewUser,
        currentUser,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
