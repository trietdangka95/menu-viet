"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft as ChevronLeftIcon,
  Receipt as ReceiptIcon,
  QrCode as QrCodeIcon,
  Printer as PrinterIcon
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import TableStatusCard from "./components/TableStatusCard";
import QRCodeCard from "./components/QRCodeCard";
import { useOrders, useClearTable, useConfirmOrder } from "@/hooks/useOrders";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useSocket } from "@/providers/SocketProvider";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminTablesPage() {
  const { tables, addTable, addMultipleTables, removeTable } = useCartStore();
  const { data: apiOrders = [], isLoading } = useOrders();
  const clearTableMutation = useClearTable();
  const confirmOrderMutation = useConfirmOrder();
  const isMounted = useIsMounted();
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // Real-time updates
  useEffect(() => {
    if (!socket) return;

    const refreshOrders = () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    };

    socket.on('NEW_ORDER_ALERT', refreshOrders);
    socket.on('ORDER_STATUS_CHANGED', refreshOrders);

    return () => {
      socket.off('NEW_ORDER_ALERT', refreshOrders);
      socket.off('ORDER_STATUS_CHANGED', refreshOrders);
    };
  }, [socket, queryClient]);

  const orders = apiOrders.map(o => ({
    ...o,
    status: o.status.toLowerCase() as any,
    timestamp: new Date(o.createdAt).getTime(),
    items: o.items.map(i => ({
      ...i,
      id: i.productId,
      name: i.product?.name || 'Món ăn',
      image: i.product?.image || '',
      price: i.product?.price || 0,
      note: i.note || '',
    })),
    totalPrice: o.totalAmount || o.items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0)
  }));
  const [activeTab, setActiveTab] = useState<"status" | "qr">("status");
  const [baseUrl, setBaseUrl] = useState("");
  const [newTableNum, setNewTableNum] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const tableStatus = orders.reduce((acc, order) => {
    const tNum = order.tableNumber || "??";
    if (!acc[tNum]) {
      acc[tNum] = [];
    }
    acc[tNum].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleCheckout = (tableNumber: string) => {
    if (confirm(`Xác nhận thanh toán và giải phóng Bàn ${tableNumber}?`)) {
      clearTableMutation.mutate(tableNumber);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTableNum) {
      const formatted = isNaN(parseInt(newTableNum)) ? newTableNum : newTableNum.padStart(2, "0");
      addTable(formatted);
      setNewTableNum("");
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0 print:bg-white print:pb-0">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 px-4 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeftIcon size={24} />
            </Link>
            <h1 className="text-xl font-bold text-gray-800">Quản lý Bàn</h1>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl border">
            <button
              onClick={() => setActiveTab("status")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === "status" ? "bg-white shadow-sm text-orange-500" : "text-gray-500"}`}
            >
              Trạng thái
            </button>
            <button
              onClick={() => setActiveTab("qr")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === "qr" ? "bg-white shadow-sm text-orange-500" : "text-gray-500"}`}
            >
              Mã QR
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "status" ? (
          /* Table Status View */
          Object.keys(tableStatus).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <ReceiptIcon size={64} className="mb-4 opacity-20" />
              <p className="text-lg italic">Hiện không có bàn nào đang sử dụng.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(tableStatus).map(([tableNumber, tableOrders]) => (
                <TableStatusCard
                  key={tableNumber}
                  tableNumber={tableNumber}
                  tableOrders={tableOrders}
                  formatPrice={formatPrice}
                  onCheckout={handleCheckout}
                  onConfirmOrder={(id) => confirmOrderMutation.mutate(id)}
                />
              ))}
            </div>
          )
        ) : (
          /* QR Code Management View */
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Danh sách mã QR Bàn</h2>
                <p className="text-sm text-gray-500 font-medium">In mã này để dán lên từng bàn tại quán.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <form onSubmit={handleAddTable} className="flex bg-white p-1.5 rounded-2xl border-2 border-gray-100 focus-within:border-orange-500 transition-all shadow-sm">
                  <input
                    type="text"
                    placeholder="Số bàn (vd: 06)"
                    value={newTableNum}
                    onChange={(e) => setNewTableNum(e.target.value)}
                    className="w-32 px-4 outline-none text-sm font-bold"
                  />
                  <button
                    type="submit"
                    className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-all active:scale-95"
                  >
                    Thêm bàn
                  </button>
                </form>

                <button
                  onClick={() => addMultipleTables(10)}
                  className="flex items-center gap-2 bg-blue-500 text-white px-5 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                  <QrCodeIcon size={18} />
                  Thêm nhanh 10 bàn
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
                >
                  <PrinterIcon size={18} />
                  In tất cả
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {tables.map((t) => (
                <QRCodeCard
                  key={t}
                  tableNum={t}
                  qrLink={`${baseUrl}/?table=${t}`}
                  onRemove={removeTable}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .print\:hidden { display: none !important; }
          .print\:block { display: block !important; }
          header, footer, nav { display: none !important; }
          main { padding: 0 !important; max-width: 100% !important; }
          .grid { display: block !important; }
          .break-inside-avoid { break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
