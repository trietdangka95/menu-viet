"use client";

import { useCartStore } from "@/store/cartStore";
import {
  Soup,
  LayoutDashboard,
  Settings,
  LogOut,
  TrendingUp,
  Users,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";

import AdminStatCard from "./components/AdminStatCard";
import AdminMenuCard from "./components/AdminMenuCard";
import { useProducts } from "@/hooks/useProducts";
import { useOrders } from "@/hooks/useOrders";
import { useInvoices } from "@/hooks/useInvoices";

export default function AdminDashboard() {
  const { logout } = useCartStore();
  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useOrders();
  const { data: invoices = [] } = useInvoices();

  const totalRevenue = invoices.reduce((sum, i) => sum + i.totalAmount, 0);

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
      stats: `${orders.filter(o => o.status === "PENDING" || o.status === "COOKING").length} đơn đang chờ`
    }
  ];

  const managementItems = [
    {
      title: "Quản lý Doanh thu",
      description: "Thống kê doanh số, lịch sử đơn hàng đã hoàn tất",
      icon: TrendingUp,
      href: "/admin/revenue",
      color: "bg-green-600",
      stats: `${invoices.length} hóa đơn đã xuất`
    },
    {
      title: "Quản lý Thực đơn",
      description: "Thêm, sửa, xóa các món ăn trong menu",
      icon: Settings,
      href: "/admin/menu",
      color: "bg-purple-600",
      stats: `${products.length} món ăn`
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

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-2">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 font-medium italic">Hệ thống quản lý Menu Việt chuyên nghiệp</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <AdminStatCard
            icon={TrendingUp}
            value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalRevenue)}
            label="Doanh thu tổng"
            colorClass="text-green-500"
            bgClass="bg-green-50"
          />
          <AdminStatCard
            icon={ShoppingBag}
            value={invoices.length}
            label="Hóa đơn đã xuất"
            colorClass="text-blue-500"
            bgClass="bg-blue-50"
          />
          <AdminStatCard
            icon={Users}
            value={new Set(orders.map(o => o.tableNumber)).size}
            label="Bàn đang phục vụ"
            colorClass="text-orange-500"
            bgClass="bg-orange-50"
          />
        </div>

        {/* Section 1: Operations */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6 ml-4">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em]">Quy trình phục vụ</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {operationalItems.map((item, index) => (
              <AdminMenuCard key={item.href} item={item} index={index} />
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
              <AdminMenuCard key={item.href} item={item} index={index + 2} />
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
