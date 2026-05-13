import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  note: string;
};

export type OrderStatus = "pending" | "cooking" | "serving" | "completed";
export type UserRole = "guest" | "staff" | "kitchen" | "admin";

export type Order = {
  id: string;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  timestamp: number;
  tableNumber: string;
  isConfirmed: boolean;
};

export type RevenueRecord = {
  id: string;
  orderIds: string[];
  tableNumber: string;
  totalAmount: number;
  timestamp: number;
};
export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  // Banner & Promotion fields
  bannerUrl?: string;
  promoTitle?: string;
  promoDescription?: string;
  discountPercent?: number;
};

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  orders: Order[];
  isOrdersOpen: boolean;
  adminMenu: MenuItem[];
  categories: string[];
  revenue: RevenueRecord[];

  // Credentials
  staffPassword: string;
  kitchenPassword: string;
  adminPassword: string;

  // Role & Table
  userRole: UserRole;
  selectedTable: string;
  tables: string[];
  setUserRole: (role: UserRole) => void;
  setSelectedTable: (table: string) => void;

  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNote: (id: string, note: string) => void;
  toggleCart: () => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;

  submitOrder: () => void;
  toggleOrders: () => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  confirmOrder: (orderId: string) => void;
  clearTableOrders: (tableNumber: string) => void;

  // Table Management
  addTable: (tableNumber: string) => void;
  addMultipleTables: (count: number) => void;
  removeTable: (tableNumber: string) => void;

  // Category Management
  addCategory: (name: string) => void;
  removeCategory: (name: string) => void;

  // Admin Menu CRUD
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, data: Partial<Omit<MenuItem, "id">>) => void;
  removeMenuItem: (id: string) => void;

  // Auth
  isAdmin: boolean;
  login: (password: string) => boolean;
  staffLogin: (password: string) => boolean;
  kitchenLogin: (password: string) => boolean;
  logout: () => void;
  updatePasswords: (passwords: { staff?: string, kitchen?: string, admin?: string }) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      orders: [],
      isOrdersOpen: false,
      isAdmin: false,
      userRole: "guest",
      selectedTable: "",
      tables: ["01", "02", "03", "04", "05"],
      categories: ["Món chính", "Món khai vị", "Đồ uống", "Tráng miệng"],
      revenue: [],
      staffPassword: "staff123",
      kitchenPassword: "kitchen123",
      adminPassword: "admin123",
      adminMenu: [
        {
          id: "1",
          name: "Phở Bò Tái Lăn",
          price: 65000,
          category: "Món chính",
          image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=400",
          description: "Phở bò truyền thống với thịt bò tái lăn thơm nức mũi."
        },
        {
          id: "2",
          name: "Bún Chả Hà Nội",
          price: 55000,
          category: "Món chính",
          image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",
          description: "Bún chả đặc sản Hà Nội với thịt nướng than hoa."
        },
        {
          id: "3",
          name: "Cà Phê Sữa Đá",
          price: 29000,
          category: "Đồ uống",
          image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=400",
          description: "Cà phê pha phin truyền thống kết hợp sữa đặc."
        }
      ],

      addItem: (item) => {
        set((state) => {
          // Tìm xem item (cùng productId và cùng note) đã có chưa
          const existingItemIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.note === item.note
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity;
            return { items: newItems };
          }

          // Tạo id unique cho cart item dựa trên thời gian
          return {
            items: [...state.items, { ...item, id: Date.now().toString() }],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },

      updateNote: (id, note) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, note } : item
          ),
        }));
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      toggleOrders: () => set((state) => ({ isOrdersOpen: !state.isOrdersOpen })),

      setUserRole: (role) => set({ userRole: role }),
      setSelectedTable: (table) => set({ selectedTable: table }),

      submitOrder: () => {
        const { items, getTotalPrice, selectedTable, userRole } = get();
        if (items.length === 0) return;
        if (!selectedTable) {
          alert("Vui lòng chọn số bàn trước khi đặt món!");
          return;
        }

        const newOrder: Order = {
          id: Date.now().toString(),
          items: [...items],
          totalPrice: getTotalPrice(),
          status: "pending",
          timestamp: Date.now(),
          tableNumber: selectedTable,
          isConfirmed: userRole === "staff",
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          items: [], // Clear cart
          isOpen: false, // Close cart
        }));
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map(order =>
            order.id === orderId ? { ...order, status } : order
          )
        }));
      },

      confirmOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.map(order =>
            order.id === orderId ? { ...order, isConfirmed: true } : order
          )
        }));
      },

      clearTableOrders: (tableNumber) => {
        const { orders, revenue } = get();
        // Handle orders with missing/undefined table numbers (represented as '??' in UI)
        const tableOrders = orders.filter(o => (o.tableNumber || "??") === tableNumber);
        
        if (tableOrders.length > 0) {
          const totalAmount = tableOrders.reduce((sum, o) => sum + o.totalPrice, 0);
          const newRecord: RevenueRecord = {
            id: `REV-${Date.now()}`,
            orderIds: tableOrders.map(o => o.id),
            tableNumber: tableNumber === "??" ? "Chưa xác định" : tableNumber,
            totalAmount,
            timestamp: Date.now()
          };

          set((state) => ({
            revenue: [newRecord, ...state.revenue],
            orders: state.orders.filter(o => (o.tableNumber || "??") !== tableNumber)
          }));
        }
      },

      addTable: (tableNumber) => {
        set((state) => ({
          tables: Array.from(new Set([...state.tables, tableNumber])).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        }));
      },

      addMultipleTables: (count) => {
        set((state) => {
          const lastTable = state.tables.length > 0 ? [...state.tables].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).pop() : "0";
          const startNum = parseInt(lastTable || "0") + 1;
          const newTables = Array.from({ length: count }, (_, i) => (startNum + i).toString().padStart(2, "0"));
          return {
            tables: Array.from(new Set([...state.tables, ...newTables])).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
          };
        });
      },

      removeTable: (tableNumber) => {
        set((state) => ({
          tables: state.tables.filter(t => t !== tableNumber)
        }));
      },

      addCategory: (name) => {
        set((state) => ({
          categories: Array.from(new Set([...state.categories, name]))
        }));
      },

      removeCategory: (name) => {
        set((state) => ({
          categories: state.categories.filter(c => c !== name)
        }));
      },

      addMenuItem: (item) => {
        set((state) => ({
          adminMenu: [...state.adminMenu, { ...item, id: Date.now().toString() }]
        }));
      },

      updateMenuItem: (id, data) => {
        set((state) => ({
          adminMenu: state.adminMenu.map((item) =>
            item.id === id ? { ...item, ...data } : item
          )
        }));
      },

      removeMenuItem: (id) => {
        set((state) => ({
          adminMenu: state.adminMenu.filter((item) => item.id !== id)
        }));
      },

      staffLogin: (password) => {
        if (password === get().staffPassword) {
          set({ userRole: "staff" });
          return true;
        }
        return false;
      },

      kitchenLogin: (password: string) => {
        if (password === get().kitchenPassword) {
          set({ userRole: "kitchen" });
          return true;
        }
        return false;
      },

      login: (password) => {
        if (password === get().adminPassword) {
          set({ isAdmin: true, userRole: "admin" });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAdmin: false, userRole: "guest" });
      },

      updatePasswords: (passwords) => {
        set((state) => ({
          staffPassword: passwords.staff ?? state.staffPassword,
          kitchenPassword: passwords.kitchen ?? state.kitchenPassword,
          adminPassword: passwords.admin ?? state.adminPassword
        }));
      }
    }),
    {
      name: "menu-viet-storage",
      partialize: (state) => ({
        orders: state.orders,
        adminMenu: state.adminMenu,
        tables: state.tables,
        categories: state.categories,
        selectedTable: state.selectedTable,
        userRole: state.userRole,
        revenue: state.revenue,
        staffPassword: state.staffPassword,
        kitchenPassword: state.kitchenPassword,
        adminPassword: state.adminPassword
      }), // Đồng bộ data
    }
  )
);
