// src/components/kitchen/OrderTicket.tsx
"use client";

import { Order } from "@/store/cartStore";
import { X, Check, ArrowRight, Clock } from "lucide-react";

interface OrderTicketProps {
  order: Order;
  onAdvance: () => void;
}

export default function OrderTicket({ order, onAdvance }: OrderTicketProps) {
  return (
    <div className="border border-gray-200 rounded-md p-3 shadow-sm bg-gray-50">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-black text-sm shadow-sm">
            {order.tableNumber}
          </div>
          <span className="font-bold text-sm text-gray-900 uppercase tracking-tight">Bàn {order.tableNumber}</span>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Đơn #{order.id.slice(-4)}</div>
          <div className="text-[10px] text-gray-400 font-medium">{new Date(order.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
      </div>
      <ul className="space-y-1 mb-2">
        {order.items.map((item) => (
          <li key={item.id} className="text-xs flex justify-between">
            <span>{item.name} x{item.quantity}</span>
            <span className="font-medium">{item.price * item.quantity}₫</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center">
        <span className="font-semibold">{order.totalPrice.toLocaleString("vi-VN")}₫</span>
        {/* Action buttons based on status for KITCHEN */}
        {order.status === "pending" && (
          <button
            onClick={onAdvance}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-100"
            title="Bắt đầu chế biến"
          >
            <ArrowRight size={18} strokeWidth={3} />
            <span className="font-black text-xs uppercase tracking-wider">Đang làm</span>
          </button>
        )}
        {order.status === "cooking" && (
          <button
            onClick={onAdvance}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
            title="Đã nấu xong"
          >
            <Check size={18} strokeWidth={3} />
            <span className="font-black text-xs uppercase tracking-wider">Đã nấu xong</span>
          </button>
        )}
        {order.status === "serving" && (
          <div className="flex items-center gap-1 text-blue-500 font-bold text-[10px] uppercase bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
            <Clock size={14} className="animate-pulse" />
            Chờ phục vụ
          </div>
        )}
        {order.status === "completed" && (
          <div className="flex items-center gap-1 text-green-500 font-bold text-[10px] uppercase bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
            <Check size={14} />
            Đã phục vụ
          </div>
        )}
      </div>
    </div>
  );
}
