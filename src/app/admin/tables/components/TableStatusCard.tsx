"use client";

import { motion } from "framer-motion";
import { CheckCircle2 as CheckIcon, X as XIcon } from "lucide-react";
import { Order, useCartStore } from "@/store/cartStore";

interface TableStatusCardProps {
  tableNumber: string;
  tableOrders: Order[];
  formatPrice: (price: number) => string;
  onCheckout: (tableNumber: string) => void;
  onConfirmOrder: (orderId: string) => void;
}

export default function TableStatusCard({
  tableNumber,
  tableOrders,
  formatPrice,
  onCheckout,
  onConfirmOrder,
}: TableStatusCardProps) {
  const totalAmount = tableOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const hasUnconfirmed = tableOrders.some((o) => !o.isConfirmed);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-3xl shadow-sm border-2 overflow-hidden flex flex-col transition-colors ${
        hasUnconfirmed ? "border-red-200" : "border-gray-100"
      }`}
    >
      <div
        className={`p-6 border-b flex items-center justify-between ${
          hasUnconfirmed ? "bg-red-50" : "bg-orange-50/50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg ${
              hasUnconfirmed ? "bg-red-500 shadow-red-200" : "bg-orange-500 shadow-orange-200"
            }`}
          >
            {tableNumber}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Bàn {tableNumber}</h3>
            {hasUnconfirmed && (
              <span className="text-[10px] font-black text-red-600 uppercase animate-pulse">
                Có đơn mới chờ duyệt!
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Tổng cộng</div>
          <div className="text-lg font-black text-orange-600">{formatPrice(totalAmount)}</div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-4 max-h-[400px] overflow-y-auto">
        {tableOrders.map((order) => (
          <div key={order.id} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Đơn #{order.id.slice(-4)}
                </span>
                <button
                  onClick={() => {
                    if (confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
                      useCartStore.getState().orders = useCartStore.getState().orders.filter(
                        (o) => o.id !== order.id
                      );
                      useCartStore.setState({ orders: useCartStore.getState().orders });
                    }
                  }}
                  className="text-red-400 hover:text-red-600 transition-colors"
                  title="Xóa đơn hàng"
                >
                  <XIcon size={14} />
                </button>
              </div>
              {!order.isConfirmed ? (
                <button
                  onClick={() => onConfirmOrder(order.id)}
                  className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-lg font-black uppercase hover:bg-red-600 transition-colors"
                >
                  Xác nhận ngay
                </button>
              ) : (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    order.status === "completed" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {order.status === "completed" ? "Đã phục vụ" : "Đang xử lý"}
                </span>
              )}
            </div>
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    <span className="font-bold text-orange-500">{item.quantity}x</span> {item.name}
                  </span>
                  <span className="text-gray-500">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-6 bg-gray-50 border-t mt-auto">
        <button
          onClick={() => onCheckout(tableNumber)}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100 transition-all active:scale-95"
        >
          <CheckIcon size={20} />
          Thanh toán & Trả bàn
        </button>
      </div>
    </motion.div>
  );
}
