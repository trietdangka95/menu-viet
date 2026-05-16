"use client";

import { useCartStore } from "@/store/cartStore";
import { ShieldAlert, LogOut, LayoutDashboard, Store } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userRole, logout, isLoggedIn } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const role = userRole?.toLowerCase();
    if (!isLoggedIn || role !== "superadmin") {
      console.log("Access denied for role:", userRole);
      router.push("/super-login");
    }
  }, [isLoggedIn, userRole, router, mounted]);

  // Prevent rendering anything until hydration is complete
  if (!mounted) return null;

  const role = userRole?.toLowerCase();
  if (role !== "superadmin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight leading-none text-white">Super Admin</h1>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Platform Manager</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <Link
            href="/superadmin"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold transition-all"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/superadmin/stores"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white font-bold transition-all"
          >
            <Store size={20} />
            <span>Manage Stores</span>
          </Link>
        </nav>

        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
