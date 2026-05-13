"use client";

import { useCartStore } from "@/store/cartStore";
import {
  Soup,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  Users,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { logout, orders, adminMenu, revenue } = useCartStore();

  const totalRevenue = revenue.reduce((sum, r) => sum + r.totalAmount, 0);

  const operationalItems = [
    {
      title: "Quản lý Bàn",
      description: "Theo dõi trạng thái bàn và thanh toán hóa đơn",
      icon: LayoutDashboard,
      href: "/admin/tables",
      color: "bg-blue-600",
      stats: `${new Set(orders.map(o => o.tableNumber)).size} bàn đang dùng`
    },
    {
      title: "Quản lý Bếp",
      description: "Xem và xử lý các đơn hàng đang chờ chế biến",
      icon: Soup,
      href: "/admin/kitchen",
      color: "bg-orange-500",
      stats: `${orders.filter(o => o.status === "pending" || o.status === "cooking").length} đơn đang chờ`
    }
  ];

  const managementItems = [
    {
      title: "Quản lý Doanh thu",
      description: "Thống kê doanh số, lịch sử đơn hàng đã hoàn tất",
      icon: TrendingUp,
      href: "/admin/revenue",
      color: "bg-green-600",
      stats: `${revenue.length} đơn đã hoàn tất`
    },
    {
      title: "Quản lý Thực đơn",
      description: "Thêm, sửa, xóa các món ăn trong menu",
      icon: Settings,
      href: "/admin/menu",
      color: "bg-purple-600",
      stats: `${adminMenu.length} món ăn`
    },
    {
      title: "Quản lý Tài khoản",
      description: "Đổi mật khẩu cho Staff, Kitchen và Admin",
      icon: Users,
      href: "/admin/credentials",
      color: "bg-gray-900",
      stats: "Bảo mật & Cài đặt"
    }
  ];

  const MenuCard = ({ item, index }: { item: any, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={item.href}
        className="group bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all flex items-center gap-6"
      >
        <div className={`w-16 h-16 ${item.color} text-white rounded-[1.5rem] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
          <item.icon size={32} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-black text-gray-900 mb-1">{item.title}</h2>
          <p className="text-gray-400 text-xs font-medium">{item.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`px-4 py-2 rounded-2xl text-sm font-black uppercase tracking-tight shadow-sm ${item.color} text-white whitespace-nowrap`}>
            {item.stats}
          </div>
          <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all">
            <ChevronRight size={18} />
          </div>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Admin Dashboard</h1>
            <p className="text-gray-500 font-medium italic">Hệ thống quản lý Menu Việt chuyên nghiệp</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-6 py-3 bg-white text-red-500 font-bold rounded-2xl shadow-sm border border-red-50 hover:bg-red-50 transition-all active:scale-95 w-fit"
          >
            <LogOut size={20} />
            Đăng xuất
          </button>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden group">
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp size={24} />
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalRevenue)}
            </div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Doanh thu tổng</div>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp size={80} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden group">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <ShoppingBag size={24} />
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{revenue.length}</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Đơn đã hoàn tất</div>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShoppingBag size={80} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden group">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
              <Users size={24} />
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{new Set(orders.map(o => o.tableNumber)).size}</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Bàn đang phục vụ</div>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users size={80} />
            </div>
          </div>
        </div>

        {/* Section 1: Operations */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6 ml-4">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em]">Quy trình phục vụ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {operationalItems.map((item, index) => (
              <MenuCard key={item.href} item={item} index={index} />
            ))}
          </div>
        </div>

        {/* Section 2: Management */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6 ml-4">
            <div className="w-2 h-8 bg-purple-600 rounded-full"></div>
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em]">Cấu hình & Quản trị</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {managementItems.map((item, index) => (
              <MenuCard key={item.href} item={item} index={index + 2} />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center pb-12">
          <Link
            href="/"
            className="text-gray-400 hover:text-gray-600 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            Quay lại trang Menu khách hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
