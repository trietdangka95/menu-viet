"use client";

import { OrderStatus } from "@/store/cartStore";
import { useEffect, useState, useRef } from "react";
import OrderTicket from "@/components/kitchen/OrderTicket";
import { ChevronLeft, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { useOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useSocket } from "@/providers/SocketProvider";
import { useQueryClient } from "@tanstack/react-query";

export default function KitchenPage() {
  const { data: apiOrders = [] } = useOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const isMounted = useIsMounted();
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // Real-time updates
  useEffect(() => {
    if (!socket) return;

    const refreshOrders = () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    };

    socket.on('ORDER_READY_TO_COOK', refreshOrders);
    socket.on('NEW_ORDER_ALERT', refreshOrders);
    socket.on('ORDER_STATUS_CHANGED', refreshOrders);

    return () => {
      socket.off('ORDER_READY_TO_COOK', refreshOrders);
      socket.off('NEW_ORDER_ALERT', refreshOrders);
      socket.off('ORDER_STATUS_CHANGED', refreshOrders);
    };
  }, [socket, queryClient]);

  // Map API data to UI format
  const orders = apiOrders.map(o => ({
    ...o,
    status: o.status.toLowerCase() as OrderStatus, // UI expects lowercase
    timestamp: new Date(o.createdAt).getTime(),
    isConfirmed: o.status !== 'PENDING',
    totalPrice: o.totalAmount || 0,
    items: o.items.map(i => ({
      ...i,
      id: i.productId, // Use productId as id for CartItem compatibility
      name: i.product?.name || 'Món ăn',
      image: i.product?.image || '',
      price: i.product?.price || 0,
      description: i.product?.description || '',
      category: i.product?.category || '',
      categoryId: i.product?.categoryId || 0,
      note: i.note || '',
    }))
  }));
  const audioRef = useRef<HTMLAudioElement>(null);
  const [view, setView] = useState<"board" | "summary">("board");

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg");
    }
  }, []);

  const [prevPendingCount, setPrevPendingCount] = useState(0);
  const pendingCount = orders.filter((o) => o.isConfirmed && o.status === "pending").length;

  // Adjust state during render to avoid cascading renders in useEffect
  if (pendingCount !== prevPendingCount) {
    setPrevPendingCount(pendingCount);
  }

  useEffect(() => {
    if (pendingCount > prevPendingCount && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
    }
  }, [pendingCount, prevPendingCount]);

  const advanceStatus = (orderId: string, current: OrderStatus) => {
    let next: string | null = null;
    if (current === "pending") next = "COOKING";
    else if (current === "cooking") next = "SERVING";
    else if (current === "serving") next = "COMPLETED";

    if (next) {
      updateStatusMutation.mutate({ id: orderId, status: next });
    }
  };

  const confirmedOrders = orders
    .filter(o => o.isConfirmed)
    .sort((a, b) => a.timestamp - b.timestamp); // FIFO: Cũ nhất làm trước

  const itemSummary = confirmedOrders
    .filter(o => o.status === "pending" || o.status === "cooking")
    .reduce((acc, order) => {
      order.items.forEach(item => {
        if (!acc[item.name]) {
          acc[item.name] = { count: 0, tables: new Set<string>() };
        }
        acc[item.name].count += item.quantity;
        acc[item.name].tables.add(order.tableNumber);
      });
      return acc;
    }, {} as Record<string, { count: number; tables: Set<string> }>);

  const columns: { status: OrderStatus; title: string; color: string }[] = [
    { status: "pending", title: "📝 Chờ chế biến", color: "bg-red-50 text-red-700 border-red-100" },
    { status: "cooking", title: "🍳 Đang nấu", color: "bg-orange-50 text-orange-700 border-orange-100" },
    { status: "serving", title: "🛎️ Chờ phục vụ", color: "bg-blue-50 text-blue-700 border-blue-100" },
    { status: "completed", title: "✅ Hoàn thành", color: "bg-green-50 text-green-700 border-green-100" },
  ];

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 px-4 shadow-sm">
        <div className="max-w-[1600px] mx-auto h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full transition-all border border-gray-100"
            >
              <ChevronLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight">Hệ thống KDS</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Kitchen Display System</p>
            </div>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-2xl border">
            <button
              onClick={() => setView("board")}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${view === "board" ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutGrid size={18} />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setView("summary")}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${view === "summary" ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List size={18} />
              <span className="hidden sm:inline">Tổng hợp</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">

        {view === "board" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((col) => {
              const colOrders = orders.filter((o) => o.status === col.status);
              return (
                <section key={col.status} className="flex flex-col h-full min-h-[500px]">
                  <div className={`p-4 rounded-2xl border-b-4 mb-4 flex items-center justify-between ${col.color}`}>
                    <h2 className="font-black uppercase tracking-wider text-sm">{col.title}</h2>
                    <span className="bg-white/50 px-2 py-0.5 rounded-lg text-xs font-black">{colOrders.length}</span>
                  </div>
                  <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-250px)] hide-scrollbar">
                    {confirmedOrders.filter(o => o.status === col.status).map((order) => (
                      <OrderTicket
                        key={order.id}
                        order={order}
                        onAdvance={() => advanceStatus(order.id, order.status)}
                      />
                    ))}
                    {colOrders.length === 0 && (
                      <div className="py-20 text-center text-gray-300 italic text-sm">
                        Trống
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 border-b bg-gray-50/50">
              <h2 className="text-xl font-black text-gray-800">Danh sách món cần chuẩn bị</h2>
              <p className="text-sm text-gray-500">Tổng hợp tất cả món từ các đơn hàng Đợi xác nhận & Đang làm</p>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(itemSummary).length > 0 ? (
                  Object.entries(itemSummary).map(([name, data]) => (
                    <div key={name} className="flex flex-col p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-gray-700">{name}</span>
                        <span className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center text-xl font-black shadow-lg shadow-orange-100">
                          {data.count}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {Array.from(data.tables).sort().map(table => (
                          <span key={table} className="px-2 py-0.5 bg-white border border-gray-100 rounded-md text-[10px] font-black text-gray-500">
                            Bàn {table}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center text-gray-400 italic">
                    Hiện không có món nào đang được yêu cầu.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
