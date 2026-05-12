"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import { useCartStore, UserRole } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ClipboardList, Bell, Settings, LayoutDashboard, Soup, LayoutGrid, List as ListIcon, UserCheck, ChevronDown, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function HomeContent() {
  const searchParams = useSearchParams();
  const tableParam = searchParams.get("table");

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isTableSelectorOpen, setIsTableSelectorOpen] = useState(false);

  const {
    getTotalItems, toggleCart, toggleOrders, orders, isAdmin, logout,
    userRole, setUserRole, selectedTable, setSelectedTable, tables
  } = useCartStore();

  useEffect(() => {
    // Kiểm tra role bí mật từ URL (ví dụ: ?role=staff)
    const roleParam = searchParams.get("role");
    if (roleParam === "staff") {
      setUserRole("staff");
    }

    // Lấy table từ query param (hỗ trợ cả table và tables)
    const t = searchParams.get("table") || searchParams.get("tables");

    if (t) {
      // Chuẩn hóa số bàn (ví dụ: "8" -> "08")
      const formattedTable = t.length === 1 ? t.padStart(2, "0") : t;
      setSelectedTable(formattedTable);

      // Chỉ tự động chuyển về guest nếu đang không ở các role đặc quyền
      if (userRole !== "admin" && userRole !== "staff") {
        setUserRole("guest");
      }
    }

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0) setActiveTab(data[0].id);
      });
  }, [tableParam, setSelectedTable, setUserRole, userRole]);

  // Cuộn đến danh mục
  const scrollToCategory = (categoryId: string) => {
    setActiveTab(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const headerOffset = 140; // Chiều cao của header + tabs
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab ? product.categoryId === activeTab : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header Section */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100 rotate-3">
              <Soup className="text-white w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none">HOMI</h1>
              <span className="text-[10px] md:text-xs font-bold text-primary tracking-[0.2em] uppercase">Media</span>
            </div>
          </div>

          {/* Table Badge / Selector */}
          <div className="relative flex flex-col items-end">
            {userRole === "staff" ? (
              <button
                onClick={() => setIsTableSelectorOpen(!isTableSelectorOpen)}
                className="bg-blue-50 border-2 border-blue-100 px-4 py-2 rounded-xl flex items-center justify-center shadow-sm gap-2 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider leading-none">Phục vụ bàn</span>
                  <span className="font-black text-xl text-blue-700 leading-none">{selectedTable || "??"}</span>
                </div>
                <ChevronDown size={16} className={`text-blue-600 transition-transform ${isTableSelectorOpen ? "rotate-180" : ""}`} />
              </button>
            ) : (
              <div className="bg-orange-50 border-2 border-orange-100 px-4 md:px-6 py-2 rounded-xl flex items-center justify-center shadow-sm gap-2">
                <span className="text-[10px] md:text-xs text-orange-600 font-bold uppercase tracking-wider hidden md:inline-block">Bàn số</span>
                <span className="text-[10px] md:text-xs text-orange-600 font-bold uppercase tracking-wider md:hidden mb-0.5">Bàn</span>
                <span className="font-black text-xl md:text-2xl text-primary leading-none">{selectedTable || "??"}</span>
              </div>
            )}

            <AnimatePresence>
              {isTableSelectorOpen && userRole === "staff" && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full mt-2 right-0 w-48 bg-white border border-gray-100 shadow-2xl rounded-2xl p-2 z-50 overflow-hidden"
                >
                  <p className="text-[10px] font-bold text-gray-400 uppercase p-2 border-b border-gray-50 mb-1">Chọn bàn phục vụ</p>
                  <div className="grid grid-cols-3 gap-1 max-h-[300px] overflow-y-auto p-1">
                    {tables.map(t => (
                      <button
                        key={t}
                        onClick={() => {
                          setSelectedTable(t);
                          setIsTableSelectorOpen(false);
                        }}
                        className={`py-2 rounded-lg font-bold text-sm transition-colors cursor-pointer ${selectedTable === t ? "bg-primary text-white" : "hover:bg-gray-100 text-gray-600"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Navigation Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleOrders}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-primary/10 hover:text-primary transition-all font-bold text-sm border border-transparent hover:border-primary/20 cursor-pointer"
            >
              <ClipboardList size={18} />
              <span>Đơn đã gọi</span>
              {orders.filter(o => o.tableNumber === selectedTable).length > 0 && (
                <span className="w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center">
                  {orders.filter(o => o.tableNumber === selectedTable).length}
                </span>
              )}
            </button>

            <button
              onClick={toggleCart}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-orange-600 transition-all font-bold text-sm shadow-lg shadow-orange-100 cursor-pointer"
            >
              <ShoppingBag size={18} />
              <span>Giỏ hàng</span>
              {getTotalItems() > 0 && (
                <span className="bg-white text-primary w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar & Mode Switcher */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-4 flex items-center gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Tìm món ngon tại đây..."
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="bg-gray-50 p-1.5 rounded-2xl flex items-center gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-gray-400"}`}
            >
              <LayoutGrid size={20} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-gray-400"}`}
            >
              <ListIcon size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6 space-y-12">
        {/* Banner Section */}
        <div className="relative h-48 md:h-64 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-orange-100">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200"
            alt="Hero Banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
            <h2 className="text-white text-3xl md:text-4xl font-black mb-2">Giảm 20% hôm nay! 🍜</h2>
            <p className="text-orange-200 font-medium">Áp dụng cho tất cả các loại trà sữa</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="sticky top-40 z-30 bg-gray-50/80 backdrop-blur-md py-4 -mx-4 px-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all shadow-sm cursor-pointer ${activeTab === category.id
                  ? "bg-primary text-white shadow-orange-200 scale-105"
                  : "bg-white text-gray-500 hover:bg-orange-50 hover:text-primary"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product List grouped by Category */}
        <div className="space-y-16">
          {categories.map((category) => {
            const catProducts = filteredProducts.filter(p => p.categoryId === category.id);
            if (catProducts.length === 0) return null;

            return (
              <div key={category.id} id={`category-${category.id}`} className="scroll-mt-60">
                <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-6 md:h-8 bg-primary rounded-full"></span>
                  {category.name}
                </h3>
                <div className={`grid gap-4 transition-all duration-500 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
                  {catProducts.map((product) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="cursor-pointer"
                    >
                      <ProductCard product={product} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 pb-20 text-center flex flex-col items-center gap-4 relative z-10">
        <p className="text-[10px] text-gray-300 font-bold tracking-widest uppercase mt-4">© 2026 Triet Dang</p>
      </footer>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-gray-400">Đang tải menu...</div>}>
      <HomeContent />
    </Suspense>
  );
}
