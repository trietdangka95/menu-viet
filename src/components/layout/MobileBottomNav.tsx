"use client";

import { useCartStore } from "@/store/cartStore";
import { Utensils, ClipboardList, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { getTotalItems, toggleCart, toggleOrders, orders, selectedTable } = useCartStore();

  const [popOrder, setPopOrder] = useState(false);

  const totalItems = getTotalItems();
  const activeOrdersCount = orders.filter(o => o.tableNumber === selectedTable && o.status.toLowerCase() !== "completed").length;

  useEffect(() => {
    if (activeOrdersCount > 0) {
      const handle = requestAnimationFrame(() => setPopOrder(true));
      const timer = setTimeout(() => setPopOrder(false), 300);
      return () => {
        cancelAnimationFrame(handle);
        clearTimeout(timer);
      };
    }
  }, [activeOrdersCount]);

  if (pathname !== "/") return null;

  return (
    <div className="md:hidden fixed bottom-3 left-4 right-4 z-50">
      <div className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-[2rem] px-6 py-2.5 flex justify-between items-center relative">

        {/* Menu Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center group active:scale-90 transition-all"
        >
          <div className="p-2.5 text-primary">
            <Utensils size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter text-primary">Menu</span>
        </button>

        {/* Cart Button with Highlight */}
        <button
          onClick={toggleCart}
          className="relative flex flex-col items-center group active:scale-90 transition-all"
        >
          <div className={`relative p-2.5 rounded-2xl transition-all duration-300 ${
            totalItems > 0 
              ? "bg-primary text-white shadow-lg shadow-orange-200 border-4 border-white -translate-y-4" 
              : "text-gray-400"
          }`}>
            <ShoppingBag size={24} strokeWidth={totalItems > 0 ? 2.5 : 2} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key="cart-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 min-w-[20px] h-[20px] flex items-center justify-center rounded-full bg-white text-primary border-2 border-primary font-black text-[10px]"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className={`text-[10px] uppercase tracking-tighter mt-1 font-black transition-all ${
            totalItems > 0 ? "text-primary -translate-y-2" : "text-gray-400"
          }`}>
            Giỏ hàng
          </span>
        </button>

        {/* Orders Button */}
        <button
          onClick={toggleOrders}
          className="flex flex-col items-center group active:scale-90 transition-all"
        >
          <div className={`p-2.5 relative transition-colors ${activeOrdersCount > 0 ? "text-blue-600" : "text-gray-400"}`}>
            <ClipboardList size={24} />
            {activeOrdersCount > 0 && (
              <motion.div
                animate={popOrder ? { scale: [1, 1.5, 1] } : {}}
                className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm"
              >
                {activeOrdersCount}
              </motion.div>
            )}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-tighter mt-1 ${
            activeOrdersCount > 0 ? "text-blue-600" : "text-gray-400"
          }`}>
            Đơn hàng
          </span>
        </button>
      </div>
    </div>
  );
}
